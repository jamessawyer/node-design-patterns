// 无序并行流 - 但是限制并发的数量
// 只对顺序不重要的场景，一般针对的都是object streams, 很少再binary streams中使用
import { Transform, pipeline } from 'node:stream'
import { createReadStream, createWriteStream } from 'node:fs'
import split from 'split'
import superagent from 'superagent'

class LimitedParallelStream extends Transform {
  // userTransform 是一个函数
  // concurrency 限制并发数量
  constructor(concurrency, userTransform, opts) {
    super(({ ...opts, objectMode: true }))
    this.concurrency = concurrency
    this.userTransform = userTransform
    this.running = 0
    this.continueCb = null // 存储pending的_transform
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
    if (this.running < this.concurrency) {
      // 这里不等待userTransform()，直接调用done()，以达到并行的目的
      done()
    } else {
      // 如果达到并发限制，先保存pending的done回调
      this.continueCb = done
    }
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
    // 每次任务完成时，我们调用任何保存的continueCb()，它将导致流解除阻塞，触发下一项的处理。
    const tmpCb = this.continueCb
    this.continueCb = null
    tmpCb && tmpCb()
    if (this.running === 0) {
      // 如果不存在任务了 这里调用_flush中保存的done回调方法
      // 触发 `finish` 事件 终止流
      this.terminateCb?.()
    }
  }
}

// node ./03_limited_parallel_stream.mjs urls.txt
pipeline(
  createReadStream(process.argv[2]),
  split(), // Transform流，将每一行作为一个单独的chunk传给userTransform
  new LimitedParallelStream(
    2,
    async (url, encoding, push, done) => {
      if (!url) {
        return done()
      }
      try {
        await superagent.head(url, { timeout: 2 * 1000 })
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