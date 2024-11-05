import { CancelError } from '../cancelError.mjs'

/**
 * 这里使用工厂函数
 * 工厂返回两个函数：包装器函数（cancelWrapper）和触发取消异步操作的函数（cancel）。
 *  这允许我们创建一个包装器函数来包装多个异步调用，
 *  然后使用一个cancel()函数来取消所有异步调用。
 */
export function createCancelWrapper() {
    let cancelRequested = false

    function cancel() {
        cancelRequested = true
    }

    function cancelWrapper(fn, ...args) {
        if (cancelRequested) {
            return Promise.reject(new CancelError())
        }
        return fn(...args)
    }

    return { cancelWrapper, cancel }
}