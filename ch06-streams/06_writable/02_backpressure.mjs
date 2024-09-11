import Chance from 'chance'
import { createServer } from 'node:http'

const chance = new Chance()

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })

    function generateMore() {
        while (chance.bool({ likelihood: 95 })) {
            const randomChunk = chance.string({
                // 16kb - 1
                length: (16 * 1014) - 1
            })

            const shouldContinue = res.write(`${randomChunk}\n`)
            // 如果返回false,则表明Writable stream内部buffer已满，会触发backpressure
            if (!shouldContinue) {
                console.log('backpressure')
                // 触发 `drain` 事件
                return res.once('drain', generateMore)
            }
        }

        res.end('\n\n')
    }

    generateMore()

    res.on('finish', () => console.log('all data sent'))
})

server.listen(8080, () => console.log('Server running on port 8080'))
