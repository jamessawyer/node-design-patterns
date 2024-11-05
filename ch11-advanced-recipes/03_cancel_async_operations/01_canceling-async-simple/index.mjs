import { asyncRoutine } from '../asyncRoutine.mjs'
import { CancelError } from '../cancelError.mjs'

/**
 * 🤔
 * 这里有很多样板文件。实际上，它涉及到如此多的额外代码，以至于很难识别功能的实际业务逻辑。
 */
async function cancelable(cancelObj) {
    const resA = await asyncRoutine('A')
    console.log(resA)

    // 最简单的方法，每次调用之前检测一下是否取消了
    if (cancelObj.cancelRequest) {
        throw new CancelError()
    }

    const resB = await asyncRoutine('B')
    console.log(resB)

    if (cancelObj.cancelRequest) {
        throw new CancelError()
    }

    const resC = await asyncRoutine('C')
    console.log(resC)
}

const cancelObj = { cancelRequest: false }

cancelable(cancelObj)
    .catch(err => {
        if (err instanceof CancelError) {
            console.log('Function Canceled')
        } else {
            console.error(err)
        }
    })

setTimeout(() => {
    cancelObj.cancelRequest = true
}, 100)

// Starting async routine A
// Async routine A completed
// Async routine A result
// Starting async routine B
// Async routine B completed
// Async routine B result
// Function Canceled