import { createReadStream, createWriteStream } from 'node:fs'
import split from 'split'

// Merging Streams 就是将多个Readable Streams合并成一个Writable Stream
// 如果使用 pipe() 或者 pipeline() 他们会在某个Readable Stream 完成后自动关闭 Writable Stream
// 这会导致其他Readable Stream 正写入Writable Stream发生错误，因此我们需要手动设置 {end: false} 选项
// 只有当最后一个Readable Stream 完成后，我们手动关闭

// 除了这里写的这种方式，还可以看看下面连接中通过递归实现的方式
// https://www.nodejs.red/#/nodejs/modules/stream-mutil-file-merge
// 还有 multistream 库 https://www.npmjs.com/package/multistream


// node ./merge-lines.mjs output.txt ./test/file1.txt ./test/file2.txt
const dest = process.argv[2]
const sources = process.argv.slice(3)

const destStream = createWriteStream(dest)

let endCount = 0
for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 16 })
  sourceStream.on('end', () => {
    if (++endCount === sources.length) {
      // 最后一个Readable Stream 完成后，我们手动关闭
      destStream.end()
      console.log(`${dest} created`)
    }
  })
  sourceStream
    // split() 是一个Transform Stream
    .pipe(split((line) => line + '\n'))
    .pipe(destStream, { end: false })
}