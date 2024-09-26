import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'node:stream'
import { randomBytes } from 'node:crypto'
import { createCompressAndEncrypt } from './combined-streams.mjs'

const [,, password, source] = process.argv

const iv = randomBytes(16) // 16字节 * 8 = 128位
const destination = `${source}.gz.enc`

// node archive.mjs randomPassword ./README.md
// 执行完后打印 ./README.md.gz.enc created with iv: 20a6b736bacf4fa73b23e79efc1eac0b
pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`${destination} created with iv: ${iv.toString('hex')}`);
  }
)
