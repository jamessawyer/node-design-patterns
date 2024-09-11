import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'

const filename = process.argv[2]

createReadStream(filename)
  //  createGzip会返回一个TransformStream
  .pipe(createGzip())
  .pipe(createWriteStream(`${filename}.gz`))
  .on('finish', () => console.log('Done'))