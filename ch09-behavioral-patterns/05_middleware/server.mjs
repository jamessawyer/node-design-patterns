import zeromq from 'zeromq'
import { ZmqMiddlewareManager } from './ZmqMiddlewareManager.mjs'
import { jsonMiddleware } from './jsonMiddleware.mjs'
import { zlibMiddleware } from './zlibMiddleware.mjs'

async function main() {
    const socket = new zeromq.Reply()
    await socket.bind('tcp://127.0.0.1:5000')

    const zmqm = new ZmqMiddlewareManager(socket)
    zmqm.use(zlibMiddleware)
    zmqm.use(jsonMiddleware)
    zmqm.use({
        async inbound(message) {
            console.log(`Received message`, message.toString('utf8'))
            if (message.action === 'ping') {
                // 使用 send() 方法 会通过outbound中间件进行序列化 然后压缩处理
                await this.send({ action: 'pong', echo: message.echo })
            }
            return message
        }
    })

    console.log('Server started!🚀')
}

main()
