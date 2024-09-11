## writable.write(chunk, [encoding], [callback])
所有Writable流都有一个 `write()` 方法：
- `encoding` 参数是可选的，如果chunk是字符串，默认是 `utf8`；如果忽略，则chunk默认是buffer,即字节流
- `callback` 也是可选的，在chunk冲刷到底层资源后调用

## writable.end([chunk], [encoding], [callback])
- 可以在结束时，最后提供chunk数据
- 这里的 `callback` 相当于注册了 `finish` 事件

## Backpressure
writable内部buffer有一个 `highWaterMark` 属性（默认是 `16384`， 也就是16kb），当 `write()` 方法写入数据的速度大于消费的速度时，这个方法会返回 `false`，我们有2种处理策略：
- 我们可以忽略这个信号，但这样会导致buffer缓冲的数据越来越大，导致内存使用过大
- 我们也可以依据这个值，停止写入，等待buffer被清空，此时会触发 `drain` 事件，然后再开始往Writable 内部buffer中写入数据✅