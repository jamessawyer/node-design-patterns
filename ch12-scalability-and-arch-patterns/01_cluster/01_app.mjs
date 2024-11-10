import { createServer } from 'node:http'

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

// 10s内200个并发请求
// npx autocannon -c 200 -d 10 http://localhost:8000