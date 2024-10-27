import zeromq from 'zeromq'
import { ZmqMiddlewareManager } from './ZmqMiddlewareManager.mjs'
import { jsonMiddleware } from './jsonMiddleware.mjs'
import { zlibMiddleware } from './zlibMiddleware.mjs'

async function main() {
    const socket = new zeromq.Request()
    await socket.connect('tcp://127.0.0.1:5000')

    const zmqm = new ZmqMiddlewareManager(socket)
    zmqm.use(zlibMiddleware)
    zmqm.use(jsonMiddleware)

    await zmqm.use({
        inbound(message) {
            console.log('Echo back', message)
            return message
        }
    })

    // 定时向服务端发送消息
    setInterval(() => {
        zmqm.send({ action: 'ping', echo: Date.now() })
            .catch(err => console.error(err))
    }, 1000)

    console.log('Client 连接成功!🚀')
}

main()
