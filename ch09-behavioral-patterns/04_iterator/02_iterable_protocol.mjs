// JS 实现 [Symbol.iterator]() 协议，返回iterable对象
/**
 * 矩阵
 *      col1  col2
 * row1 11    12
 * row2 21    22
 */
class Matrix {
    constructor(inMatrix) {
        this.data = inMatrix
    }

    get(row, column) {
        if (
            row >= this.data.length ||
            column >= this.data[row].length
        ) {
            throw new RangeError('Index out of bounds')
        }
        return this.data[row][column]
    }

    set(row, column, value) {
        if (
            row >= this.data.length ||
            column >= this.data[row].length
        ) {
            throw new RangeError('Index out of bounds')
        }
        this.data[row][column] = value
    }

    // 返回一个迭代器对象，允许对矩阵元素井行迭代
    // 从左到右，从上到下
    [Symbol.iterator]() {
        let nextRow = 0
        let nextCol = 0

        return {
            next: () => {
                if (nextRow === this.data.length) {
                    return { done: true }
                }
                const currVal = this.data[nextRow][nextCol]
                if (nextCol === this.data[nextRow].length - 1) {
                    nextRow++
                    nextCol = 0
                } else {
                    nextCol++
                }
                return {
                    done: false,
                    value: currVal
                }
            }
        }
    }
}

const matrix2x2 = new Matrix([
    ['11', '12'],
    ['21', '22']
])

// 返回一个迭代器
const iterator = matrix2x2[Symbol.iterator]()

let iterationResult = iterator.next()
while (!iterationResult.done) {
    console.log(`迭代结果: ${iterationResult.value}`)
    iterationResult = iterator.next()
}
// 除了上面方式外
// for ... of 语法 可对可迭代对象进行循环
for (const item of matrix2x2) {
    console.log(`迭代结果2: ${item}`)
}

// 还可以使用 spread object 方式
const flattenedMatrix = [...matrix2x2]
console.log(`展开后的矩阵: ${flattenedMatrix}`)

// 另外还可以使用 解构赋值 的方式
const [row1Col1, row1Col2, row2Col1, row2Col2] = matrix2x2
console.log(`row1Col1: ${row1Col1}, row1Col2: ${row1Col2}, row2Col1: ${row2Col1}, row2Col2: ${row2Col2}`)

// 另外JS中内置的如下API接收可迭代对象作为参数
// Map([iterable])
// WeakMap([iterable])
// Set([iterable])
// WeakSet([iterable])
// Promise.all([iterable])
// Promise.race([iterable])
// Array.from([iterable])

// Node.js 一个常见的用例
// stream.Readable.from(iterable, [options])
// Buffer.from(iterable)