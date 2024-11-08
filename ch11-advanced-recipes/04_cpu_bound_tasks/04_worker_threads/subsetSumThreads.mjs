import { EventEmitter } from 'node:events'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ThreadPool } from './threadPool.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
// 使用 ./workers/subsetSumThreadWorker.mjs 作为child worker
const workerFile = join(__dirname, 'workers', 'subsetSumThreadWorker.mjs')
// 最大进程池容积是2
const workers = new ThreadPool(workerFile, 2)

export class SubsetSum extends EventEmitter {
    constructor(sum, set) {
        super()
        this.sum = sum
        this.set = set
    }

    async start() {
        const worker = await workers.acquire()
        // 注意线程使用的是  worker.postMessage() 而进程会使用 process.send()
        worker.postMessage({ sum: this.sum, set: this.set})

        const onMessage = msg => {
            if (msg.event === 'end') {
                worker.removeListener('message', onMessage)
                workers.release(worker)
            }

            this.emit(msg.event, msg.data)
        }

        worker.on('message', onMessage)
    }
}
