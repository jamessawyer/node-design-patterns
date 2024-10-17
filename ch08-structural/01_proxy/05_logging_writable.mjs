import { createWriteStream } from 'fs'

function createLoggingWritable(writable) {
    return new Proxy(writable, {
        get(target, propKey, receiver) {
            // 检查是否是write方法
            // 如果是的话，就返回一个函数代理原有的行为
            if (propKey === 'write') {
                return function (...args) {
                    const [chunk] = args
                    console.log(`writing: ${chunk}`)
                    return writable.write(...args)
                }
            }
            return target[propKey]
        }
    })
}

const writable = createWriteStream('test.txt')
const loggingWritable = createLoggingWritable(writable)
loggingWritable.write('First Chunk')
loggingWritable.write('Second Chunk')
writable.write('This is not logged')
writable.end()