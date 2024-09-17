import { pipeline } from 'node:stream'
import { createReadStream, createWriteStream } from 'node:fs'
import split from 'split'
import superagent from 'superagent'
import ParallelTransform from 'parallel-transform'


// https://www.npmjs.com/package/parallel-transform
// parallel-transform 允许并行的处理流的同时，保持顺序
pipeline(
  createReadStream(process.argv[2]),
  split(), // Transform流，将每一行作为一个单独的chunk传给userTransform
  new ParallelTransform(
    4,
    async function(url, done) {
      if (!url) {
        return done()
      }
      console.log('url- ', url);
      try {
        await superagent.head(url, { timeout: 2 * 1000 })
        this.push(`${url} is up\n`)
      } catch(err) {
        this.push(`${url} is down\n`)
      }
      done()
    }
  ),
  createWriteStream('results.txt'),
  err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('所有的urls都检测完毕')
  }
)