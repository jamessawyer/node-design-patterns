import { db } from './01_db.mjs'
import { once } from 'node:events'
/**
 * 🤔🤔🤔
 * 针对异步初始化组件问题的第二种快速但不太干净的解决方案涉及延迟依赖于异步初始化组件的任何代码的执行，
 * 直到组件完成其初始化例程。
 * 
 * 这种技术的主要缺点是，它要求我们提前知道哪些组件将使用异步初始化的组件，
 * 这使得我们的代码很脆弱，容易出错。
 */

/**
 * 此问题的一个解决方案是延迟整个应用程序的启动，直到所有异步服务初始化为止。这样做的优点是简单有效
 * 但是，它可能会大大延迟应用程序的总体启动时间，而且，它不会考虑必须重新初始化异步初始化组件的情况。
 */


async function initialize() {
    db.connect()
    await once(db, 'connected')
}

async function updateLastAccess() {
    await db.query(`INSET (${Date.now()}) INTO "LastAccesses"`)
}

initialize()
    .then(() => {
        updateLastAccess()
        setTimeout(() => {
            updateLastAccess()
        }, 600)
    })

// 执行查询: INSET (1730383577061) INTO "LastAccesses"
// 执行查询: INSET (1730383577666) INTO "LastAccesses"