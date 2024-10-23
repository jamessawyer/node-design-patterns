import { OfflineState } from './offlineState.mjs'
import { OnlineState } from './onlineState.mjs'

export class FailsafeSocket {
    constructor(options) {
        this.options = options
        // 当socket离线时，存储要发送的数据
        this.queue = []
        this.currentState = null
        this.socket = null
        this.states = {
            // 将当前类实例传递给 OfflineState & OnlineState
            // 这样 OfflineState & OnlineState 便能通过this访问到当前实例中的属性和方法
            offline: new OfflineState(this),
            online: new OnlineState(this)
        }
        this.changeState('offline')
    }

    // 从一个状态转换为另一个状态
    changeState(state) {
        console.log(`激活状态：${state}`)
        this.currentState = this.states[state]
        this.currentState.activate()
    }

    send(data) {
        this.currentState.send(data)
    }
}
