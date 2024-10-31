import { EventEmitter } from 'node:events'

/**
 * 只有在与数据库服务器的连接和握手成功完成后，
 * db模块才会接受API请求。因此，在初始化阶段完成之前，不能发送查询或其他命令。
 */

class DB extends EventEmitter {
    connected = false

    connect() {
        setTimeout(() => {
            this.connected = true
            this.emit('connected')
        }, 500)
    }


    async query(queryString) {
        if (!this.connected) {
            throw new Error('数据库还没有连接')
        }

        console.log(`执行查询: ${queryString}`)
    }
}

export const db = new DB()
