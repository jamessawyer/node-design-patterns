// 生成器函数返回的生成器既是一个iterator又是一个iterable
// iterator和iterable的区别是：
// iterator是一个有next()方法的对象，iterable是一个有[Symbol.iterator]()方法的对象

// 生成器 `yield x`  相当于返回 { done: false, value: x }
// 生成器 `return x` 相当于返回 { done: true, value: x }

function* gen() {
    yield 'a'
    yield 'b'
    return 'c'
}

const generator = gen()
console.log(generator.next()) // { value 'a', done: false }
console.log(generator.next()) // { value 'b', done: false }
console.log(generator.next()) // { value 'c', done: true }

// 但是如果使用 for-of 语法
for (const item of gen()) {
    console.log(item)
}
// 则只会打印
// 'a'
// 'b'
// 🚨 ‘c’ 是不会打印的，因为 `c` 不是通过yield语句返回的 而是通过return语句返回
// 这表明迭代以 `c` 作为返回值（而不是作为元素）完成了


function* fibGenerator() {
    let a = 0
    let b = 1

    while (true) {
        let c = a + b
        yield c
        a = b
        b = c
    }
}