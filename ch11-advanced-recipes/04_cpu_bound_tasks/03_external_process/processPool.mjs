/**
 * processPool.js模块，该模块将允许我们创建一个运行进程池。
 * 启动新进程成本高昂且耗时，因此保持它们持续运行并准备好处理请求可以让我们节省时间和CPU周期。
 * 此外，该池将帮助我们限制同时运行的进程数量，以防止应用程序遭受拒绝服务（DoS）攻击。
 */
import { fork } from 'node:child_process'

// 最后，我们需要一个worker（我们的子进程），一个仅以运行子集和算法并将结果转发给父进程为目标的新的Node.js程序。
export class ProcessPool {
    constructor(file, poolMax) {
        this.file = file // 用于表示运行的Node.js程序 worker
        this.poolMax = poolMax // 最大运行实例数
        this.pool = [] // 正在使用的进程集合
        this.active = [] // 包含当前正被使用的进程列表
        this.waiting = [] // 包含一个回调队列，用于处理由于缺少可用进程而无法立即完成的所有请求
    }

    // 负责在进程存在空余时，返回一个可用的进程
    acquire() {
        return new Promise((resolve, reject) => {
            let worker
            // 如果进程池中有可用的进程，则直接返回
            if (this.pool.length > 0) {
                worker = this.pool.pop() // 取出一个可用的进程
                this.active.push(worker)
                return resolve(worker)
            }

            // 没有可用的进程了，并且已经达到最大运行进程数量，则需要等待
            // 通过对外部promise的resolve和reject回调进行排队来实现这一点，以供以后使用
            if (this.active.length >= this.poolMax) {
                return this.waiting.push({resolve, reject})
            }

            // 如果我们还没有达到运行进程的最大数量，我们将使用child_process.fork()创建一个新的进程
            worker = fork(this.file)
            // 然后，我们等待来自新启动的进程的ready消息，这表明该进程已经启动并准备接受新任务。
            // 这种基于消息的通道(channel)会自动提供给所有通过 child_process.fork() 启动的进程
            worker.once('message', message => {
                if (message === 'ready') {
                    this.active.push(worker)
                    return resolve(worker)
                }

                worker.kill()
                reject(new Error('进程启动失败'))
            })

            worker.once('exit', code => {
                console.log(`worker 退出，退出码是 ${code}`)
                this.active.filter(w => worker !== w)
                this.pool = this.pool.filter(w => worker !== w)
            })
        })
    }

    // 在处理完一个进程后将它放回池中
    release(worker) {
        // 如果等待列表中存在请求
        // 我们只需将我们正在释放的worker通过传递给等待队列头部的resolve()回调函数来重新分配
        if (this.waiting.length > 0) {
            const { resolve } = this.waiting.shift()
            return resolve(worker)
        }
        // 否则，我们将从活动列表中删除正在释放的worker，并将其放回池中
        this.active = this.active.filter(w => worker !== w)
        this.pool.push(worker)
        // 正如我们所见，这些进程永远不会停止，只是被重新分配，
        // 这样我们就可以通过在每个请求时不重新启动它们来节省时间。

        // 当然这种方式并不适用所有的应用，
        // 其他可能用于减少长期内存使用并增加进程池弹性的调整包括：
        // 1. 将在一段时间的不活跃后终止空闲进程以释放内存
        // 2. 添加一个机制来终止无响应的进程或重启已崩溃的进程
    }
}