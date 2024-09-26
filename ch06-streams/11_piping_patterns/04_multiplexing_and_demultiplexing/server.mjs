import { createWriteStream } from 'node:fs'
import { createServer } from 'node:net'

// 1. node server.mjs
// 2. node client.mjs generateData.mjs

function demultiplexChannel(source, destinations) {
  let currentChannel = null
  let currentLength = null

  source
    .on('readable', () => { // 使用 non-flowing 模式读取数据
      let chunk

      // 读取channel id
      if (currentChannel === null) {
        chunk = source.read(1)
        currentChannel = chunk && chunk.readUInt8(0)
      }

      // 读取数据的长度
      if (currentLength === null) {
        chunk = source.read(4)
        currentLength = chunk && chunk.readUInt32BE(0)

        if (currentLength === null) {
          return null
        }
      }

      chunk = source.read(currentLength)

      if (chunk === null) {
        return null
      }

      // 当数据读取完成后 将其写入对应的通道中
      console.log(`Received packet from channel: ${currentChannel}`)
      destinations[currentChannel].write(chunk)

      currentChannel = null
      currentLength = null
    })
    .on('end', () => {
      destinations.forEach(destination => destination.end())
      console.log('Source channel closed')
    })
}

// 创建TCP服务
const server = createServer(socket => {
  const stdoutStream = createWriteStream('stdout.log')
  const stderrStream = createWriteStream('stderr.log')

  demultiplexChannel(socket, [stdoutStream, stderrStream])
})

server.listen(3000, () => {
  console.log('Server started!')
})