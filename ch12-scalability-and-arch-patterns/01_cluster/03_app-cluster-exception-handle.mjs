import { createServer } from 'node:http'
import { cpus } from 'node:os'
import cluster from 'node:cluster'

if (cluster.isPrimary) {
    const availableCpus = cpus()
    console.log(`集群模式，创建${availableCpus.length}个工作进程`)
    availableCpus.forEach(() => cluster.fork())

    // 一旦主进程收到一个 'exit' 事件，我们检查进程是故意终止还是由于错误而终止
    // 我们通过检查状态码和标志 `worker.exitedAfterDisconnect` 来做到这一点，该标志指示worker是否被主进程明确终止。
    cluster.on('exit', (worker, code) => {
        // 如果我们确认进程因错误而终止，我们将启动一个新的工作进程
        // 值得注意的是，尽管崩溃的工作进程被替换，其他工作进程仍然可以处理请求，因此不会影响应用程序的可用性。
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(
                `工作进程 ${worker.process.pid} 崩溃了，开启一个新的worker`
            )
            cluster.fork()
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
    setTimeout(() => {
        throw new Error('出错了')
    }, Math.ceil(Math.random() * 3) * 1000)
    
    server.listen(8000, () => console.log(`Server running on port 8000, PID: ${pid}`))
}


// 10s内200个并发请求
// npx autocannon -c 200 -d 10 http://localhost:8000