import { asyncRoutine } from '../asyncRoutine.mjs'
import { CancelError } from '../cancelError.mjs'
import { createAsyncCancelable } from './createAsyncCancelable.mjs'

// 或者使用现成的库 Caf 实现类似取消逻辑
// https://www.npmjs.com/package/caf

// 传入一个generator函数
const cancelable = createAsyncCancelable(function* () {
    // 这里用 yield 语句而不是await，模拟了异步操作
    const resA = yield asyncRoutine('A')
    console.log(resA)

    const resB = yield asyncRoutine('B')
    console.log(resB)

    const resC = yield asyncRoutine('C')
    console.log(resC)
})

const { promise, cancel } = cancelable()

promise.catch(err => {
    if (err instanceof CancelError) {
        console.log('Function Canceled')
    } else {
        console.error(err)
    }
})

setTimeout(() => {
    cancel()
}, 100)

// Starting async routine A
// Async routine A completed
// Async routine A result
// Starting async routine B
// Function Canceled
// Async routine B completed
