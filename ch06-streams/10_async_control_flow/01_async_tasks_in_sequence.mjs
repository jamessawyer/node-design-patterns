import { createWriteStream, createReadStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'

// 有序异步任务
function concatFiles(dest, files) {
  return new Promise((resolve, reject) => {
    const destStream = createWriteStream(dest)

    // Readable.from() is a utility method that creates a Readable stream from an iterable or async iterable.
    // It's a convenient way to create a stream from an array, string, or other iterable object.
    // In this case, it's used to create a stream from the array of filenames that are to be concatenated.
    // Readable.from(files)会创建一个可读流 它的objectMode默认是true
    Readable.from(files)
      .pipe(new Transform({
        objectMode: true,
        transform(filename, encoding, callback) {
          const src = createReadStream(filename)
          src.pipe(destStream, { end: false }) // end: false 显式的标识读取完成后不要关闭destStream流
          src.on('error', callback)
          src.on('end', callback) // 出发回调，标识读取完成，再读取下一个文件流
        }
      }))
      .on('error', reject)
      .on('finish', () => {
        destStream.end()
        resolve()
      })
  })
}


async function main() {
  try {
    // 写入的文件名
    const dest = process.argv[2]
    // 要读取的文件列表
    const files = process.argv.slice(3)
    await concatFiles(dest, files)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }

  console.log('All done!')
}

// node ./01_async_tasks_in_sequence.mjs output.txt ./test/file1.txt ./test/file2.txt ./test/file3.txt
main()
