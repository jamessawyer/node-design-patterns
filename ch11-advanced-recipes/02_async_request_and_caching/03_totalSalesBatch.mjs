import { totalSales as totalSalesRaw } from './01_totalSales.mjs'
/**
 * 利用Promise的2个特性：
 * 1. 多个 `then()` 监听器可以作用于同一个Promise上
 *      --> 确保可以对请求进行batching
 * 2. `then()` 监听器能够被确保被调用（一次），即使promise已经resolved，它也会被调用；并且 `then()` 的调用总是异步的
 *      --> 这意味着promise已经是解析值的缓存，并提供了一种以一致的异步方式返回缓存值的自然机制。
 */

const runningRequests = new Map()

// 这里使用到了 Proxy Pattern
export function totalSales(product) {
    if (runningRequests.has(product)) {
        // 如果已经存在该请求，就直接返回promise
        console.log('Batching request for product', product)
        return runningRequests.get(product)
    }

    // totalSalesRaw是一个async function，因此这里返回的是一个promise
    const resultPromise = totalSalesRaw(product)
    runningRequests.set(product, resultPromise)
    resultPromise.finally(() => {
        runningRequests.delete(product)
    })

    return resultPromise
}