// What are JavaScript Generators and Iterators? - Andrew Burgess@youtube
// https://www.youtube.com/watch?v=6D7XOGXbyfs&ab_channel=AndrewBurgess
const A_CHAR_CODE = 65
const Z_CHAR_CODE = 90

function createAlphabetIterator() {
    let currCode = A_CHAR_CODE
    return {
        // 实现 next() 协议，即iterator 返回 { done: boolean, value: any } 即可视为一个迭代器(iterator)
        next() {
            if (currCode > Z_CHAR_CODE) {
                return { done: true, value: null }
            }
            return { done: false, value: String.fromCharCode(currCode++) }
        },
        // 🚀 实现 @@iterator 协议,即iterable 返回iterator 这样就可以使用 for ... of 语法
        [Symbol.iterator]() {
            // iterable 可以在iterator基础上实现 @@iterator 协议
            // 因此这里直接返回 this 即可
            // 实现iterable协议后，并可以使用 for ... of 语法
            return this
        }
    }
}

// 返回一个迭代器
const iterator = createAlphabetIterator()

let iterationResult = iterator.next()
while (!iterationResult.done) {
    console.log(`迭代结果: ${iterationResult.value}`)
    iterationResult = iterator.next()
}

// 🚨注意：如果没有实现 @@iterator 协议，就不能使用 for ... of 语法
for (const item of createAlphabetIterator()) {
    console.log(`迭代结果2: ${item}`)
}

// 或者使用解构
console.log([...createAlphabetIterator()])