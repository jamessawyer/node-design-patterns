import { totalSales as totalSalesRaw } from './01_totalSales.mjs'

/**
 * 当请求数量较多且持续时间较长时，使用缓存相对于批处理的优势将更加明显。
 */

// Cache invalidation 缓存失效技术
const CACHE_TTL = 30 * 1000 // 30s的TTL 缓存的声明周期
const cache = new Map()

export function totalSales(product) {
    if (cache.has(product)) {
        console.log('Cache it')
        return cache.get(product)
    }

    const resultPromise = totalSalesRaw(product)
    cache.set(product, resultPromise)
    resultPromise.then(
        () => {
            // 在请求完成一段时间后删除Promise
            setTimeout(() => {
                cache.delete(product)
            }, CACHE_TTL)
        },
        (err) => {
            // 或者在发生错误时 直接删除Promise
            cache.delete(product)
            throw err
        }
    )

    return resultPromise
}