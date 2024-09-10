// 客户端 压缩数据 发送到服务端
// node ./gzip-send.mjs <path to file> localhost
import { request } from 'http'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { basename } from 'path'

const filename = process.argv[2]
const serverHost = process.argv[3]

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
  }
}

const req = request(httpRequestOptions, res => {
  console.log(`Server response status: ${res.statusCode}`)
})

createReadStream(filename)
  .pipe(createGzip())
  .pipe(req)
  .on('finish', () => {
    console.log('file成功发送');
  })
  .on('error', err => {
    console.log('客户端err ', err);
  })