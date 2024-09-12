import { Writable } from 'node:stream'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { mkdirp } from 'mkdirp'

class ToFileStream extends Writable {
    constructor(options) {
        // 因为写入的直接就是对象，这里使用objectMode
        // 其它的一些配置项
        // highWaterMark 控制内部buffer的大小，默认是16kb
        // decodeStrings 默认是true ，这允许在将字符串传递给_write()方法之前将其自动解码为二进制缓冲区。当为objectMode时，会忽略该选项
        super({...options, objectMode: true})
    }

    // 自定义的 _write() 方法
    _write(chunk, encoding, cb) {
        mkdirp(dirname(chunk.path))
            .then(() => fs.writeFile(chunk.path, chunk.content))
            .then(() => cb()) // 这里的cb()会触发 `drain` 事件
            .catch(cb)
    }
}

const tfs = new ToFileStream()

tfs.write({
    path: join('files', 'file1.txt'),
    content: 'Hello'
})
tfs.write({
    path: join('files', 'file2.txt'),
    content: 'Node.js'
})
tfs.write({
    path: join('files', 'file3.txt'),
    content: 'Streams'
})

tfs.end(() => console.log('所有文件已创建'))
