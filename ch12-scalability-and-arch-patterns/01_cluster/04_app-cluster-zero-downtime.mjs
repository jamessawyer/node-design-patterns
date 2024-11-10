import { createServer } from 'node:http'
import { cpus } from 'node:os'
import cluster from 'node:cluster'
import { once } from 'node:events'

if (cluster.isPrimary) {
    const availableCpus = cpus()
    console.log(`集群模式，创建${availableCpus.length}个工作进程`)
    availableCpus.forEach(() => cluster.fork())

    // cluster.on('exit', (worker, code) => {
    //     if (code !== 0 && !worker.exitedAfterDisconnect) {
    //         console.log(
    //             `工作进程 ${worker.process.pid} 崩溃了，开启一个新的worker`
    //         )
    //         cluster.fork()
    //     }
    // })

    // worker的重启是在接收到 `SIGUSR2` 信号时触发的。
    // 请注意，我们在这里使用异步函数来实现事件处理器，因为我们需要在这里执行一些异步任务。
    process.on('SIGUSR2', async () => {
        const workers = Object.values(cluster.workers)

        // 当接收到SIGUSR2信号时，我们遍历cluster.workers对象的所有值。
        // 每个元素都是一个可以用来与当前在工作池中活跃的特定worker交互的worker对象。
        for (const worker of workers) {
            console.log(`关闭进程 ${worker.process.pid}`)
            // 优雅的停用当前worker
            // 这意味着如果worker目前正在处理一个请求，这不会突然中断；相反，它将等它执行完成。
            // worker只有在所有进行中的请求完成后才会退出。
            worker.disconnect()
            // 当被终止的worker退出，我们启动一个新的worker
            await once(worker, 'exit')
            if (!worker.exitedAfterDisconnect) continue
            const newWorker = cluster.fork()
            // 我们等待新worker准备就绪并监听新连接，然后我们再继续重启下一个worker
            await once(newWorker, 'listening')
        }
    })
} else {
    const { pid } = process
    
    const server = createServer((req, res) => {
        // 模拟CPU密集型任务
        let i = 1e7
        while( i > 0) {
            i--
        }
        
        console.log(`使用进程 ${pid} 执行了 CPU密集型任务`)
        res.end(`Hello from ${pid}\n`)
    })

    // 模拟异常
    // setTimeout(() => {
    //     throw new Error('出错了')
    // }, Math.ceil(Math.random() * 3) * 1000)
    
    server.listen(8000, () => console.log(`Server running on port 8000, PID: ${pid}`))
}


// 10s内200个并发请求
// npx autocannon -c 200 -d 10 http://localhost:8000