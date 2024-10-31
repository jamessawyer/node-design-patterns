import { EventEmitter } from 'node:events'

/**
 * ✅
 * 另一个确保组件服务仅在组件初始化后才被调用的方法涉及使用队列和命令模式。
 * 想法是在组件尚未初始化期间接收到的方法调用（仅限于需要初始化组件的调用）进行排队，
 *      然后在所有初始化步骤完成后立即执行它们。
 */

class DB extends EventEmitter {
    connected = false
    commandsQueue = []

    async query(queryString) {
        // 如果组件尚未初始化——在我们的情况下，这是当连接属性为false时,
        // ——我们使用当前调用的参数创建一个命令，并将其推送到commandsQueue数组,
        // 当命令执行时，它将再次运行原始的query()方法，并将结果转发到我们返回给调用者的Promise。
        if (!this.connected) {
            console.log('数据库还没有连接')
            console.log(`请求先被加入到队列中: ${queryString}`)

            return new Promise((resolve, reject) => {
                // 命令模式
                const command = () => {
                    this.query(queryString)
                        .then(resolve, reject)
                }
                this.commandsQueue.push(command)
            })
        }
        console.log(`执行查询: ${queryString}`)
    }

    connect() {
        // 模拟连接数据库的延迟 假设需要500ms
        setTimeout(() => {
            this.connected = true
            this.emit('connected')

            console.log('this.commandsQueue', this.commandsQueue.length)
            // 连接上数据库后立即将缓存的命令执行
            this.commandsQueue.forEach(command => command())
            this.commandsQueue = []
        }, 500)
    }
}

// 使用我们刚刚实现的DB类，在调用其方法之前无需检查组件是否已初始化。
// 事实上，所有逻辑都嵌入在组件本身中，任何消费者都可以透明地使用它，无需担心其初始化状态。
const db = new DB()

db.connect()

async function updateLastAccess () {
    await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}

updateLastAccess() // 1730383442128 到这里 数据库还没有连接 被加入到队列中 等待数据库连接后执行
setTimeout(() => {
    updateLastAccess() // 1730383442733 到这里 数据库已经连接上了
}, 600)

// 数据库还没有连接
// 请求先被加入到队列中: INSERT (1730383442128) INTO "LastAccesses"
// this.commandsQueue 1
// 执行查询: INSERT (1730383442128) INTO "LastAccesses"
// 执行查询: INSERT (1730383442733) INTO "LastAccesses"