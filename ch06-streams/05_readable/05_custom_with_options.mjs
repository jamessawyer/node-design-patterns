// 除了像04_custom_readable_stream.mjs这样的自定义可读流
// 还可以传入配置项的形式自定义可读流
import Chance from 'chance'
import { Readable } from 'stream'

const chance = new Chance()
let emittedBytes = 0

const randomStream = new Readable({
    read(size) {
        const chunk = chance.string({ length: size })
        this.push(chunk, 'utf8')
        emittedBytes += chunk.length
        if (chance.bool({ likelihood: 0.5 })) {
            this.push(null)
        }
    }
})

randomStream
    .on('data', chunk => {
        console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`)
    })
    .on('end', () => {
        console.log(`Produced ${emittedBytes} bytes of random data`)
    })