export class OnlineState {
    constructor(failSafeSocket) {
        this.failSafeSocket = failSafeSocket
        this.hasDisconnected = false
    }

    send(data) {
        this.failSafeSocket.queue.push(data)
        this._safeWrite(data)
    }
    
    _safeWrite(data) {
        this.failSafeSocket.socket.write(data, err => {
            // 如果当前连接是正常的 并且不存在错误
            if (!this.hasDisconnected && !err) {
                // 取出离线前存储在队列中的数据，然后写入到socket中
                this.failSafeSocket.queue.shift()
            }
        })
    }

    activate() {
        this.hasDisconnected = false
        // 取出所有离线存储的数据
        for (const data of this.failSafeSocket.queue) {
            this._safeWrite(data)
        }

        // 如果出现错误 就切换为离线状态
        this.failSafeSocket.socket.once('error', () => {
            this.hasDisconnected = true
            this.failSafeSocket.changeState('offline')
        })
    }
}