import { fork } from 'node:child_process'
import { connect } from 'node:net'

// sources 是可读流数组
// destination 是一个可写流
function multiplexChannels(sources, destination) {
  let openChannels = sources.length
  for (let i = 0; i < sources.length; i++) {
    sources[i]
      .on('readable', function() {
        let chunk

        while((chunk = this.read()) !== null) {
          // bytes structure
          // 1个字节用于表示channelId
          // 4个字节用于表示chunk的长度大小
          // chunk.length 表示数据的长度
          const outBuff = Buffer.alloc(1 + 4 + chunk.length)
          outBuff.writeUInt8(i, 0)
          outBuff.writeUInt32BE(chunk.length, 1)
          chunk.copy(outBuff, 5)
          console.log(`Sending packet to channel: ${i}`)
          destination.write(outBuff)
        }
      })
      .on('end', () => {
        if (--openChannels === 0) {
          destination.end()
        }
      })
  }
}

// 创建TCP连接
const socket = connect(3000, () => {
  const child = fork(
    process.argv[2], // path
    process.argv.slice(3), // 其余的child process的参数
    { silent: true } // 子进程不继承父进程的stdout & stderr
  )
  multiplexChannels([child.stdout, child.stderr], socket)
})
