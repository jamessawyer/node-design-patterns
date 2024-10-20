import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Level } from 'level'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db')
const db = new Level(dbPath, { valueEncoding: 'json' })
levelSubscribe(db)

// 使用Decorator模式（monkey patching方式）创建一个levelUP插件
function levelSubscribe(db) {
    // 添加一个 subscribe 方法
    db.subscribe = (pattern, listener) => {
        // 注意新版的level 将 `put` 事件已标记为废弃
        // https://github.com/Level/abstract-level#events
        db.on('put', (key, val) => {
            // 这里是一个简单的匹配，如果插入的数据每一项和pattern都能匹配上，则调用listener
            const match = Object.keys(pattern).every(k => pattern[k] === val[k])
            if (match) {
                listener(key, val)
            }
        })
    }

    return db
}

db.subscribe(
    { doctype: 'tweet', language: 'en' }, // pattern
    (k, val) => console.log(val) // listener
)

// 能匹配上
db.put('1', {
    doctype: 'tweet',
    text: 'Hi',
    language: 'en'
})
// 不能匹配
db.put('2', {
    doctype: 'company',
    name: 'ACME Co.'
})
// 能匹配上
db.put('3', {
    doctype: 'tweet',
    text: 'Hi',
    msg: 'great',
    language: 'en'
})