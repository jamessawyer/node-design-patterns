// 无序并行流
// 只对顺序不重要的场景，一般针对的都是object streams, 很少再binary streams中使用
import { Transform, pipeline } from 'node:stream'
import { createReadStream, createWriteStream } from 'node:fs'
import split from 'split'
import superagent from 'superagent'

class ParallelStream extends Transform {
  // userTransform 是一个函数
  constructor(userTransform, opts) {
    super(({ ...opts, objectMode: true }))
    this.userTransform = userTransform
    this.running = 0
    this.terminateCb = null
  }

  _transform(chunk, encoding, done) {
    // 增加运行tasks次数
    this.running++
    this.userTransform(
      chunk,
      encoding,
      this.push.bind(this),
      this._onComplete.bind(this), // this._onComplete 用于通知userTransform() 已经完成
    )
    // 这里不等待userTransform()，直接调用done()，以达到并行的目的
    done()
  }

  // 在流终止之前调用，调用 done() 后会触发 `finish` 事件
  _flush(done) {
    // 如果存在正在运行的任务
    if (this.running > 0) {
      this.terminateCb = done
    } else {
      done()
    }
  }

  _onComplete(err) {
    this.running--
    if (err) {
      return this.emit('error', err)
    }
    if (this.running === 0) {
      // 如果不存在任务了 这里调用_flush中保存的done回调方法
      // 触发 `finish` 事件 终止流
      this.terminateCb?.()
    }
  }
}

// node ./02_unordered_parallel_stream.mjs urls.txt
// 无序并行判断文件中的url是否可用
// 如果urls过多，会同时开启多个并发请求，导致内存溢出
pipeline(
  createReadStream(process.argv[2]),
  split(), // Transform流，将每一行作为一个单独的chunk传给userTransform
  new ParallelStream(
    async (url, encoding, push, done) => {
      if (!url) {
        return done()
      }
      try {
        await superagent.head(url, { timeout: 5 * 1000 })
        push(`${url} is up\n`)
      } catch(err) {
        push(`${url} is down\n`)
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