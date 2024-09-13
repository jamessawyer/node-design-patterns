// 这个例子来自 Understanding Node.js Core Concepts
import fs from 'node:fs'
import { Readable } from 'node:stream'

class FileReadStream extends Readable {
    constructor({highWaterMarker, fileName}) {
        super({highWaterMark: highWaterMarker})
        this.fileName = fileName
        this.fd = null
    }

    _construct(callback) {
        fs.open(this.fileName, 'r', (err, fd) => {
            if (err) {
                callback(err)
            } else {
                this.fd = fd
                callback()
            }
        })
    }

    // 必须实现 _read() 方法
    _read(size) {
        const buff = Buffer.alloc(size)
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            // 因为_read()没有callback，这里直接将错误交给 destroy() 进行处理
            if (err) return this.destroy(err)
            // 因为上面分配的buff可能多了，导致存在很多无用的0，这里的subarray就是去掉多余的0
            // Buffer <23, 78, 00, 00> -> <23, 78>
            // this.push(buff) 会将字节读取到内部的buffer中 并触发 `data` 事件
            // this.push(null) 会触发 `end` 事件，表示读取流结束了
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null)
        })
    }

    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, err => {
                callback(err || error)
            })
        } else {
            callback(error)
        }
    }
}

const stream = new FileReadStream({ fileName: 'test.txt' })

stream.on('data', chunk => {
    console.log(chunk.toString('utf-8'))
})

stream.on('end', () => {
    console.log('Stream is done reading')
})