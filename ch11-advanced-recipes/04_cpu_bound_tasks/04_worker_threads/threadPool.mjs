import { Worker } from 'node:worker_threads'

export class ThreadPool {
    constructor(file, poolMax) {
        this.file = file // 用于表示运行的Node.js程序 worker
        this.poolMax = poolMax // 最大运行实例数
        this.pool = [] // 正在使用的进程集合
        this.active = [] // 包含当前正被使用的进程列表
        this.waiting = [] // 包含一个回调队列，用于处理由于缺少可用进程而无法立即完成的所有请求
    }

    acquire() {
        return new Promise((resolve, reject) => {
            let worker
            // 如果进程池中有可用的工作线程，则直接返回
            if (this.pool.length > 0) {
                worker = this.pool.pop() // 取出一个可用的工作线程
                this.active.push(worker)
                return resolve(worker)
            }

            if (this.active.length >= this.poolMax) {
                return this.waiting.push({resolve, reject})
            }

            // 🚀🚀这里和进程的区别
            worker = new Worker(this.file)
            worker.once('online', () => {
                this.active.push(worker)
                resolve(worker)
            })

            worker.once('exit', code => {
                console.log(`Worker exited with code ${code}`)
                this.active = this.active.filter(w => worker !== w)
                this.pool = this.pool.filter(w => worker !== w)
            })
        })
    }

    // 在处理完一个进程后将它放回池中
    release(worker) {
        // 如果等待列表中存在请求
        // 我们只需将我们正在释放的worker通过传递给等待队列头部的resolve()回调函数来重新分配
        if (this.waiting.length > 0) {
            const { resolve } = this.waiting.pop()
            return resolve(worker)
        }

        // 否则，我们将从活动列表中删除正在释放的worker，并将其放回池中
        this.active = this.active.filter(w => worker !== w)
        this.pool.push(worker)
    }
}