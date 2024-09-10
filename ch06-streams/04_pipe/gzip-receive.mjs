// 服务端 接受数据，解密数据 解压，写入文件
import { createServer } from 'http'
import { createWriteStream } from 'fs'
import fsPromises from 'fs/promises'
import { createGunzip } from 'zlib'
import { basename, join } from 'path'
import { createDecipheriv, randomBytes } from 'crypto'

const secret = randomBytes(24)
console.log('secret: ', secret.toString('hex'));

const server = createServer(async (req, res) => {
  console.log(req.headers)
  // 客户端虽然写的是 X-Filename 注意这里的 x-filename 全是小写
  const filename = basename(req.headers['x-filename'])

  const iv = Buffer.from(
    req.headers['x-initialization-vector'],
    'hex'
  )
  

  // 判断received_files文件夹是否存在，不存在则创建
  const receivedDir = 'received_files'
  try {
    await fsPromises.stat(receivedDir)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fsPromises.mkdir(receivedDir)
    } else {
      throw err
    }
  }

  const destFilename = join('received_files', filename)

  console.log(`File request received: ${filename}`)
  // 服务端req请求是一个写入流,用于接受客户端发送的数据
  req
    .pipe(createDecipheriv('aes192', secret, iv))
    // createGunzip() 返回一个Transform Stream
    // writable buffer -> readable buffer
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' })
      res.end('OK\n')
      console.log(`File saved: ${destFilename}`)
    })
    .on('error', err => {
      console.log('服务端err ', err);
    })

})

server.listen(3000, () => console.log('Server running at http://localhost:3000'))