import { SubsetSum } from '../SubsetSum.mjs'

// worker ---> 子进程
// 监听父进程发送过来的消息
process.on('message', msg => {
    // SubsetSum是原来同步版本
    // 现在我们处于一个独立进程，我们不再需要担心阻塞事件循环了；
    // 所有的HTTP请求将继续由主应用程序的事件循环处理，不会受到干扰。
    const subsetSum = new SubsetSum(msg.sum, msg.set)

    subsetSum.on('match', data => {
        process.send({ event: 'match', data })
    })

    subsetSum.on('end', data => {
        process.send({ event: 'end', data })
    })

    subsetSum.start()
})

process.send('ready')
