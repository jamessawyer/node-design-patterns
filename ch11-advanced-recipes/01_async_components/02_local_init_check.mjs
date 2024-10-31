import { once } from 'node:events'
import { db } from './01_db.mjs'

/**
 * 🤔🤔🤔
 * 第一个解决方案确保在调用其任何api之前对模块进行初始化；
 * 否则，我们等待它的初始化。每次我们想要调用异步模块上的操作时，都必须进行此检查：
 */

db.connect()

async function updateLastAccess() {
    if (!db.connected) {
        await once(db, 'connected')
    }

    await db.query(`INSET (${Date.now()}) INTO "LastAccesses"`)
}


updateLastAccess() // 1730383522988

setTimeout(() => {
    updateLastAccess() // 1730383522889
}, 600)

// 执行查询: INSET (1730383522889) INTO "LastAccesses"
// 执行查询: INSET (1730383522988) INTO "LastAccesses"