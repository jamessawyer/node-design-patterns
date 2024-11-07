/**
 * subsetSumFork.js模块，该模块负责抽象在子进程中运行的子集和任务。
 * 其作用是通信与子进程，并将任务的结果转发，仿佛它们来自当前应用程序。
 */
import { EventEmitter } from 'node:events'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ProcessPool  } from './processPool.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
// 使用 ./workers/subsetSumProcessWorker.mjs 作为child worker
const workerFile = join(__dirname, 'workers', 'subsetSumProcessWorker.mjs')
// 最大进程池容积是2
const workers = new ProcessPool(workerFile, 2)

export class SubsetSum extends EventEmitter {
    constructor(sum, set) {
        super()
        this.sum = sum
        this.set = set
    }

    async start() {
        // 获取一个worker
        const worker = await workers.acquire()
        // 我们尝试从池中获取一个新的子进程
        // 当操作完成时，我们立即使用worker句柄向子进程发送一条消息，其中包含要运行的作业的数据。
        // send()方法是 child_process.fork() 提供的
        worker.send({ sum: this.sum, set: this.set })

        // 在onMessage监听器中，我们首先检查是否收到一个 end 事件，
        // 这意味着SubsetSum任务已完成，
        // 在这种情况下，我们移除onMessage监听器并释放工作者，将其放回池中。
        const onMessage = msg => {
            if (msg.event === 'end') {
                worker.removeListener('message', onMessage)
                workers.release(worker)
            }
            // worker以{event， data}的格式生成消息，
            // 允许我们无缝地转发（重新发出）子进程产生的任何事件
            this.emit(msg.event, msg.data)
        }

        // 我们随后开始监听由工作进程发送的任何消息，
        // 使用on()方法附加一个新的监听器（这也是所有使用child_process.fork()启动的进程提供的通信通道的一部分）
        worker.on('message', onMessage)
    }
}

/**
 * worker.send()
 * 知道在子进程实例上的 send() 方法也可以用来从主应用程序传播socket句柄到子进程是好的
 * 这实际上是集群(cluster)模块用于跨多个进程分配HTTP服务器负载的技术。
 */