import { CancelError } from '../cancelError.mjs'

/**
 * 
 * 首先，我们应该注意，createAsyncCancelable() 函数接受一个生成器函数（被监督的函数）作为输入，并返回另一个函数（asyncCancelable()），
 * 该函数将生成器函数包裹在我们的监督逻辑中。asyncCancelable() 函数就是我们用来调用异步操作的工具。
 */
export function createAsyncCancelable(generatorFn) {
    return function asyncCancelable(...args) {
        const generatorObject = generatorFn(...args)
        let cancelRequested = false

        function cancel() {
            cancelRequested = true
        }

        // 包含异步函数最终的结果
        const promise = new Promise((resolve, reject) => {
            /**
             * 监督程序的整个逻辑在 `nextStep()` 函数中实现，
             *  该函数负责迭代被监督协程（prevResult）产生的值。这些可以是实际的值或promise,
             *  如果请求取消，抛出通常的CancelError；否则，如果协程已经终止(例如，`prevResult.done` 为true)，
             *      我们立即解决外部promise和完成返回。
             */
            async function nextStep(prevResult) {
                if (cancelRequested) {
                    return reject(new CancelError())
                }

                if (prevResult.done) {
                    return resolve(prevResult.value)
                }

                /**
                 * nextStep()函数的核心部分是检索受监督协程产生的下一个值的地方（不要忘记，它是一个生成器）。
                 *  我们等待这个值，这样我们就可以确保在处理promise的情况下得到实际的值。
                 *  这也确保了如果 `prevResult.value` 是一个promise，
                 *      如果它被reject，我们就会在catch语句中结束。
                 *          即使受监督的协程实际上抛出了异常，我们也可以在catch语句中结束。
                 */
                try {
                    nextStep(generatorObject.next(await prevResult.value))
                } catch(err) {

                    /**
                     * 在catch语句中，我们在协程中抛出捕获到的错误。
                     * 如果这个错误已经被协程抛出，这是多余的，
                     * 但如果它是promise reject的结果，这就不是多余的了。
                     * 即使不是最优的，为了演示，这个技巧也可以稍微简化我们的代码。
                     * 我们调用nextStep()，使用在协程内部抛出异常后产生的任何值，
                     * 但如果结果是另一个异常（例如，异常没有在协程内部捕获或抛出了另一个异常），
                     * 我们立即reject外部promise并完成异步操作。
                     */
                    try {
                        nextStep(generatorObject.throw(err))
                    } catch(err2) {
                        reject(err2)
                    }
                }
            }

            nextStep({})
        })

        return { promise, cancel }
    }
}
