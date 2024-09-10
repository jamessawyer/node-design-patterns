// 客户端 压缩数据  加密数据 发送到服务端
// node ./gzip-send.mjs <path to file> localhost <secret>
import { request } from 'http'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { basename } from 'path'
// createCipheriv 是一种转换流
import { createCipheriv, randomBytes } from 'crypto'

const filename = process.argv[2]
const serverHost = process.argv[3]
// 从命令行中获取secret
// 因为采用的aes192算法，这里的secret需要是24字节
// 这个可以从 gzip-receive 服务端打印的脚本里去拿 比如：7033e324919ec4f7f91650315c293aa68c07497400fedce2
const secret = Buffer.from(process.argv[4], 'hex')
const iv = randomBytes(16) // 16字节随机数 （16 * 8 = 128 位）

console.log('filename',  basename(filename))

const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename),
    'X-Initialization-Vector': iv.toString('hex'),
  }
}

const req = request(httpRequestOptions, res => {
  console.log(`Server response status: ${res.statusCode}`)
})

createReadStream(filename)
  .pipe(createGzip())
  // 加密
  .pipe(createCipheriv('aes192', secret, iv))
  .pipe(req)
  .on('finish', () => {
    console.log('file成功发送');
  })
  .on('error', err => {
    console.log('客户端err ', err);
  })