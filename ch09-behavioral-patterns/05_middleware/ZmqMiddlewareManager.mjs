export class ZmqMiddlewareManager {
    // 这里的socket是一个 ZeroMQ socket
    constructor(socket) {
        this.socket = socket
        // 一个用于入站消息，另一个用于出站消息
        this.inboundMiddleware = []
        this.outboundMiddleware = []

        this.handleIncomingMessages()
            .catch(err => {
                console.log(err)
            })
    }

    async handleIncomingMessages() {
        // ZeroMQ socket是一个异步迭代器 因此可以使用 for await of 语法进行迭代
        for await (const [message] of this.socket) {
            await this.executeMiddleware(this.inboundMiddleware, message)
                .catch(err => {
                    console.error(`Error while processing the message ${err}`)
                })
        }
    }

    async send(message) {
        const finalMessage = await this.executeMiddleware(this.outboundMiddleware, message)
        return this.socket.send(finalMessage)
    }

    // 这里注册中间件 每个中间件都是成对出现的 一个处理进站消息 一个处理出站消息
    // middleware = {
    //     inbound: (message) => {
    //         return message
    //     },
    //     outbound: (message) => {
    //         return message
    //     }
    // }
    use(middleware) {
        if (middleware.inbound) {
            this.inboundMiddleware.push(middleware.inbound)
        }
        if (middleware.outbound) {
            this.outboundMiddleware.unshift(middleware.outbound)
        }
    }

    async executeMiddleware(middlewares, initialMessage) {
        let message = initialMessage
        for await (const middlewareFunc of middlewares) {
            message = await middlewareFunc.call(this, message)
        }
        return message
    }
}