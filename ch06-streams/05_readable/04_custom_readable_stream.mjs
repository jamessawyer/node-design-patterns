// 自定义可读流 _read() 内部逻辑

// import Chance from 'https://esm.sh/chance@1.1.12'
// import Import from "@reejs/imports";
// let Chance = await Import("https://esm.sh/chance@1.1.12");
import Chance from 'chance'
import { Readable } from 'stream'

const chance = new Chance()

export class RandomStream extends Readable {
    // options可以传入的配置项有
    // encoding 编码格式，如果设置为utf8 可以将buffers转换为strings
    // objectMode 是否接收对象
    // highWaterMark Readable buffer的大小,默认是16kb
    constructor(options) {
        super(options)
        this.emittedBytes = 0
    }

    // 注意内部的_read() 方法和Readable read()方法的区别
    // Readable read()方法是消费者调用的
    // 而这里的_read()是Readable子类内部实现对数据操作的方法
    _read(size) {
        const chunk = chance.string({ length: size })
        this.push(chunk, 'utf8')
        this.emittedBytes += chunk.length
        if (chance.bool({ likelihood: 0.5 })) {
            // 传入null 表示流结束
            this.push(null)
        }
    }
}

const randomStream = new RandomStream()

randomStream
    .on('data', chunk => {
        console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`)
    })
    .on('end', () => {
        console.log(`Produced ${randomStream.emittedBytes} bytes of random data`)
    })