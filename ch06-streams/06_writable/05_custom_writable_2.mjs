// 这个例子来自 Understanding Node.js Core Concepts
import { Writable } from 'node:stream'
import fs from 'node:fs'

class FileWriteStream extends Writable {
    constructor({highWaterMarker, fileName}) {
        super({highWaterMark: highWaterMarker})

        this.fileName = fileName
        this.fd = null
        this.chunks = []
        this.chunksSize = 0
        this.writeCount = 0
    }

    // 可以不写
    // 但是如果写了 _construct() 首先会被调用
    _construct(callback) {
        // 打开文件 mode是 `w` 写入
        fs.open(this.fileName, 'w', (err, fd) => {
            // 如果不调用callback() 后面的_write()等方法就不会被执行
            if (err) {
                // 如果出错，直接调用callback(err) 不要使用throw new Error()这种形式
                callback(err)
            } else {
                this.fd = fd
                callback()
            }
        })
    }

    // 如果要自定义Writable 必须重写这个方法
    _write(chunks, encoding, callback) {
        this.chunks.push(chunks)
        this.chunksSize += chunks.length
        // 只有当chunksSize >= highWaterMark 时才会触发drain事件
        // 这里的 [writableHighWaterMark](https://nodejs.cn/api/v20/stream.html#writablewritablehighwatermark)
        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), err => {
                if (err) {
                    return callback(err)
                }
                this.chunks = []
                this.chunksSize = 0
                ++this.writeCount
                callback()
            })
        } else {
            callback()
        }
    }

    // 可不写
    // 流必须调用 end() 方法才会触发这个方法
    _final(callback) {
        // 上面的_write()方法如果写入的内容没有超过highWaterMark，并不会直接把数据写入到文件中
        // 在这里将剩余的数据写入到文件中
        fs.write(this.fd, Buffer.concat(this.chunks), err => {
            if (err) {
                return callback(err)
            }
            this.chunks = []
            this.chunksSize = 0
            // 如果这里不调用callback(), 会导致 `finish` 事件不会被触发
            // 下面的 _destroy() 方法也不会执行
            callback()
        })
    }

    // 可不写
    _destroy(error, callback) {
        console.log('写入次数：', this.writeCount)
        if (this.fd) {
            // 关闭句柄
            fs.close(this.fd, err => {
                callback(err || error)
            })
        } else {
            callback(error)
        }
    }
}

// 例子1
// const stream = new FileWriteStream({
//     highWaterMarker: 1800,
//     fileName: 'test.txt'
// })

// stream.write(Buffer.from('this is some data3'))
// stream.end()
// // 或者最后写入一点数据
// // stream.end(Buffer.from('last data'))

// stream.on('finish', () => {
//     console.log('Stream was finish')
// })

// 例子2 从0写到999999
console.time('writeMany')
const stream = new FileWriteStream({
    fileName: 'test.txt'
})

let i = 0
const numberOfWrites = 1_000_000

const writeMany = () => {
    while (i < numberOfWrites) {
        const buff = Buffer.from(` ${i} `, 'utf8')

        // 最后一次写入
        if (i === numberOfWrites - 1) {
            return stream.end(buff)
        }

        // 如果返回false，则表明Writable stream内部buffer已满，会触发backpressure
        // 这里就停止写入
        if (!stream.write(buff)) break
        i++
    }
}

writeMany()

let d = 0

stream.on('drain', () => {
    // 等writable buffer 清空后再继续写
    d++
    writeMany()
})

stream.on('finish', () => {
    console.log('Stream was finish')
    console.log('drain事件触发次数: ', d)
    console.timeEnd('writeMany')
})