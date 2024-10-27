function* twoWayGenerator() {
    const what = yield null
    yield 'Hello ' + what
}

const gen = twoWayGenerator()
console.log(gen.next()) // { value: null, done: false }
console.log(gen.next('World')) // { value: 'Hello World', done: false }

// 解释上面的代码
// 1. 第一次调用 `next()` 方法，生成器会到达第一个 `yield` 语句 并在此暂停
// 2. 当 `next('World)` 被调用，生成器从它被暂停的位置恢复，
//     这是在yield指令上，但是这次我们有一个值被传递回生成器。然后将此值设置为 `what` 变量
//     生成器将 `what` 变量添加到 ‘Hello ’ 后面，并返回(`yield`)该结果