import jsonOverTcp from 'json-over-tcp-2'

// 操作 
// 1. 先启动客户端 `node client.mjs` 此时服务端还没有开启，处理offline状态
// 2. 客户端尝试不断重新连接，并将数据缓存到queue中
// 3. 在启动服务端 `node server.mjs` 此时客户端会连上服务端
// 4. 并将缓存好的数据发送给服务端，这样就保证了客户端数据不会丢失

const server = jsonOverTcp.createServer({ port: 5050 })

server.on('connection', socket => {
    socket.on('data', data => {
        console.log('客户端发送过来的数据 ', data)
    })
})

server.listen(5050, () => {
    console.log('Server started!🚀')
})