// example from https://www.youtube.com/watch?v=J24rb6_5h9o&ab_channel=AndrewBurgess
// async generators基本用法
import { setTimeout } from 'node:timers/promises'

async function* naturals(max = Infinity) {
    let num = 0

    while (num <= max) {
        // 除了可以yield一个值外，还可以yield一个promise
        // yield num
        // yield Promise.resolve(num)
        // setTimeout(delay, value, [options])
        yield setTimeout(num * 1000, num)
        num++
    }
}
// wholeNumbers 类型 -> AsyncGenerator<number, void, unknown>
const wholeNumbers = naturals()
for await (const number of wholeNumbers) {
    console.log(number)
}
