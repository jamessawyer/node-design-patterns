import { asyncRoutine } from '../asyncRoutine.mjs'
import { CancelError } from '../cancelError.mjs'
import { createCancelWrapper } from './cancelWrapper.mjs'

/**
 * 
 * 我们可以立即看到使用包装器函数实现取消逻辑的好处，
 * 可以看出，cancelable()函数现在更加简洁和可读了。
 */
async function cancelable(cancelWrapper) {
    const resA = await cancelWrapper(asyncRoutine, 'A')
    console.log(resA)
    
    const resB = await cancelWrapper(asyncRoutine, 'B')
    console.log(resB)

    const resC = await cancelWrapper(asyncRoutine, 'C')
    console.log(resC)
}

const { cancelWrapper, cancel } = createCancelWrapper()

cancelable(cancelWrapper)
    .catch(err => {
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
// Async routine B completed
// Async routine B result
// Function Canceled