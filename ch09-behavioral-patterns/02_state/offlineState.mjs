import jsonOverTcp from 'json-over-tcp-2'

// https://www.npmjs.com/package/json-over-tcp-2
// json-over-tcp-2 简化原生tcp行为 解析和格式化json传输数据
// 管理socket离线后的行为
export class OfflineState {
    constructor(failsafeSocket) {
        this.failsafeSocket = failsafeSocket
    }

    // 离线状态时：将数据保存在队列中
    send(data) {
        this.failsafeSocket.queue.push(data)
    }

    activate() {
        const retry = () => {
            setTimeout(() => this.activate(), 1000)
        }
        console.log('尝试连接...')
        this.failsafeSocket.socket = jsonOverTcp.connect(
            this.failsafeSocket.options,
            () => {
                console.log('连接成功')
                this.failsafeSocket.socket.removeListener('error', retry)
                // 尝试重新连接成功后，failsafeSocket状态转变为 `online`
                this.failsafeSocket.changeState('online')
            }
        )

        // 监听 `error` 事件
        this.failsafeSocket.socket.once('error', retry)
    }
}