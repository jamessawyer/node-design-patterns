import { createReadStream, createWriteStream } from 'node:fs'
import { createHash } from 'node:crypto'

const filename = process.argv[2]
const sha1Stream = createHash('sha1').setEncoding('hex')
const md5Stream = createHash('md5').setEncoding('hex')
const inputStream = createReadStream(filename)


// node ./generate-hashes.mjs ../package.json
// sha1Stream和md5Stream会在inputStream结束后自动进行结束
// 除非指定 {end: false}
inputStream
  .pipe(sha1Stream)
  .pipe(createWriteStream(`${filename}.sha1`))

inputStream
  .pipe(md5Stream)
  .pipe(createWriteStream(`${filename}.md5`))