export const jsonMiddleware = function() {
    return {
        inbound(message) {
            return JSON.parse(message.toString('utf8'))
        },
        outbound(message) {
            // 序列化为字符串 然后转换为buffer
            return Buffer.from(JSON.stringify(message))
        }
    }
}