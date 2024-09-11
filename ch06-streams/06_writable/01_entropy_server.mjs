import Chance from 'chance'
import { createServer } from 'node:http'

const chance = new Chance()

// 这里的res是 http.ServerResponse 实例，它是一种 Writable stream
const server = createServer((req, res) => {
    // writeHead() 方法并不是Writable stream的一部分
    // 它是 http.ServerResponse 内部的方法，特定于HTTP协议
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    while(chance.bool({ likelihood: 95 })) {
        // 写入字符串数据
        res.write(`${chance.string()}\n`)
    }
    // 结束写入
    res.end('\n\n')
    // 监听 `finish` 事件
    res.on('finish', () => console.log('all data sent'))
})

server.listen(8080, () => console.log('Server running on port 8080'))