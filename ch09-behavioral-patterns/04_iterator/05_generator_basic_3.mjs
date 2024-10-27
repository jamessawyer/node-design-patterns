// 生成器还提供了 throw() 和 return() 2个迭代器方法
// throw() 方法的行为类似于next()，但它也会在生成器中抛出一个异常，
//         就好像它是在最后一次yield时抛出的一样，并返回带有done和value属性的规范迭代器对象

// return() return（）方法，强制生成器终止并返回如下对象：
//    {done: true， value: returnArgument}其中returnArgument是传递给return()方法的参数。
function* twoWayGenerator() {
    try {
        const what = yield null
        yield 'Hello ' + what
    } catch(err) {
        yield 'Hello error: '  + err.message
    }
}

console.log('使用 throw() 方法：')
const genThrow = twoWayGenerator()
console.log(genThrow.next()) // { value: null, done: false }
console.log(genThrow.throw(new Error('Boom!'))) // { value: 'Hello error: Boom!', done: false }
console.log(genThrow.next()) // { value: undefined, done: true }

const genReturn = twoWayGenerator()
console.log('使用 return() 方法：')
console.log(genReturn.next()) // { value: null, done: false }
console.log(genReturn.return('myReturnValue')) // { value: 'myReturnValue', done: false }
console.log(genReturn.next()) // { value: undefined, done: true }