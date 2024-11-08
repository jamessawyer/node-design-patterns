import { parentPort } from 'node:worker_threads'
import { SubsetSum } from '../subsetSum.mjs'

parentPort.on('message', msg => {
    const subsetSum = new SubsetSum(msg.sum, msg.set)

    subsetSum.on('match', data => {
        // 使用进程时，用的是 process.send() 方法进行传递消息
        parentPort.postMessage({ event: 'match', data })
    })

    subsetSum.on('end', data => {
        parentPort.postMessage({ event: 'end', data })
    })

    subsetSum.start()
})
