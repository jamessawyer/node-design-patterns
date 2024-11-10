import { createServer } from 'node:http'
import { cpus } from 'node:os'
import cluster from 'node:cluster'
/**
 * 1. 当我们从命令行启动app.js时，我们实际上正在执行主进程，
 *    在这种情况下，cluster.isPrimary变量被设置为true，我们所需做的唯一工作就是使用cluster.fork()来分叉当前进程。
 *    在前面的例子中，我们启动了与系统中逻辑CPU核心数量相同的工作进程，以充分利用所有可用的处理能力。
 * 
 * 2. 当从主进程执行 `cluster.fork()` 时，当前模块（app.js）再次运行，但这次是在工作模式（`cluster.isWorker` 设置为true，而`cluster.isPrimary`设置为false）。
 *    当应用程序以工作模式运行时，它可以开始做一些实际的工作。在这种情况下，它启动了一个新的HTTP服务器。
 */

// 🚨🚨记住，每个worker都是一个不同的Node.js进程，拥有自己的事件循环、内存空间和已加载的模块，这一点很重要。

/**
 * 在底层，cluster.fork() 函数使用 child_process.fork() API，
 *  因此，我们也在主进程和工作者进程之间有一个通信通道可用。
 *  工作进程可以通过变量 cluster.workers 访问，所以向所有这些进程广播消息就像运行以下代码行一样简单：
 *  Object.values(cluster.workers).forEach(worker => worker.send('ping from master')
 */

if (cluster.isPrimary) {
    const availableCpus = cpus()
    console.log(`集群模式，创建${availableCpus.length}个工作进程`)
    availableCpus.forEach(() => cluster.fork())
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
    
    server.listen(8000, () => console.log(`Server running on port 8000, PID: ${pid}`))
}


// 10s内200个并发请求
// npx autocannon -c 200 -d 10 http://localhost:8000