import { Transform } from 'node:stream'

class ReplaceStream extends Transform {
    constructor(searchStr, replaceStr, options) {
        super({ ...options })
        this.searchStr = searchStr
        this.replaceStr = replaceStr
        this.tail = ''
    }

    // _transform() 和 _write() 方法的签名一样
    // 它将writable buffer中的数据通过 push() 方法推送到readable buffer中
    // （_read()方法中也是使用push()方法写入数据到buffer中）
    _transform(chunk, encoding, cb) {
        const pieces = (this.tail + chunk).split(this.searchStr)
        const lastPiece = pieces[pieces.length - 1]
        const tailLen = this.searchStr.length - 1
        this.tail = lastPiece.slice(-tailLen)
        pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
        this.push(pieces.join(this.replaceStr))
        cb()
    }

    // 当stream结束后，仍旧可能存在残余数据（保存在tail中） 
    // _flush() 方法是最后一次将其推送到readable buffer中的机会
    _flush(cb) {
        this.push(this.tail)
        cb()
    }
}

const replaceStream = new ReplaceStream('World', 'Node.js')
replaceStream.on('data', chunk => console.log(chunk.toString()))

replaceStream.write('Hello W')
replaceStream.write('orld!')
replaceStream.end()


