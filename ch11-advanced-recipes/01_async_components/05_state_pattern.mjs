import { EventEmitter, once } from 'node:events'

/**
 * 🚀🚀🚀
 * 使用 State Pattern 优化异步组件
 * 
 */
// 纯业务逻辑类
// 包含组件的实际业务逻辑
class InitializedState {
    async query(queryString) {
        console.log(`执行查询: ${queryString}`)
    }
}

// 状态类
const METHODS_REQUIRING_CONNECTION = ['query']
const deactivate = Symbol('deactivate')

class QueuingState {
    constructor(db) {
        this.db = db
        this.commandsQueue = []

        METHODS_REQUIRING_CONNECTION.forEach(methodName => {
            this[methodName] = (...args) => {
                console.log('命令被加入队列中：', methodName, args)
                return new Promise((resolve, reject) => {
                    const command = () => {
                        db[methodName](...args)
                            .then(resolve, reject)
                    }

                    this.commandsQueue.push(command)
                })
            }
        })
    }

    // 当状态被取消激活时（即组件初始化时）调用此方法，并执行队列中的所有命令
    [deactivate]() {
        this.commandsQueue.forEach(command => command())
        this.commandsQueue = []
    }
}


class DB extends EventEmitter {
    constructor() {
        super()

        this.state = new QueuingState(this)
    }

    async query(queryString) {
        return this.state.query(queryString)
    }

    connect() {
        // 模拟连接数据库的延迟 假设需要500ms（即异步连接数据库）
        setTimeout(() => {
            // 当与数据库建立连接（即初始化完成）
            this.connected = true
            this.emit('connected')
            
            const oldState = this.state
            // 我们将当前状态转变为 InitializedState
            this.state = new InitializedState(this)
            // 并使旧的状态失活
            // 取消激活QueuedState的效果，正如我们之前所看到的，是执行队列中的所有命令
            oldState[deactivate] && oldState[deactivate]()
        }, 500)
    }
}

const db = new DB()

db.connect()

async function updateLastAccess() {
    await db.query(`INSET (${Date.now()}) INTO "LastAccesses"`)
}

updateLastAccess() // 1730383110885 到这里 数据库还没有连接 被加入到队列中 等待数据库连接后执行

setTimeout(() => {
    updateLastAccess() // 1730383111494 到这里 数据库已经连接上了
}, 600)

// 命令被加入队列中： query [ 'INSET (1730383110885) INTO "LastAccesses"' ]
// 执行查询: INSET (1730383110885) INTO "LastAccesses"
// 执行查询: INSET (1730383111494) INTO "LastAccesses"