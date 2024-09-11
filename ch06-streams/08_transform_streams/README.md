转换流是一种特殊的双工流，它用于处理数据的转换。例如前面例子中介绍的：`zlib.createGzip()` 和 `crypto.createCipheriv()` 就是一种转换流，分别用于压缩和加密数据。

简单的双工流，从流中读取的数据和写入流中的数据没有直接的关联，比如TCP socket,接收的数据和发送的数据来自客户端和服务端，socket对输入和输出的数据之间的关联是没有感知的。

而转换流对从**可写端**接收到的每个数据块使用某种转换（`_transform`），然后使转换后的数据在**可读端**可用。

实现自定义双工流，需要改写 `_read()` 和 `_write()` 方法。而实现自定义转换流，需要改写 `_transform()` 和 `_flush()` 方法。

## 关于自定义流中的解释

```mjs
import { Transform } from 'node:stream'

class ReplaceStream extends Transform {
    constructor(searchStr, replaceStr, options) {
        super({ ...options })
        this.searchStr = searchStr
        this.replaceStr = replaceStr
        this.tail = ''
    }

    // _transform() 和 _write() 方法的签名一样
    // 它将writable buffer中的数据通过 push() 方法推送到readable buffer中
    // （_read()方法中也是使用push()方法写入数据到buffer中）
    _transform(chunk, encoding, cb) {
        const pieces = (this.tail + chunk).split(this.searchStr)
        const lastPiece = pieces[pieces.length - 1]
        const tailLen = this.searchStr.length - 1
        this.tail = lastPiece.slice(-tailLen)
        pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
        this.push(pieces.join(this.replaceStr))
        cb()
    }

    // 当stream结束后，仍旧可能存在残余数据（保存在tail中） 
    // _flush() 方法是最后一次将其推送到readable buffer中的机会
    _flush(cb) {
        this.push(this.tail)
        cb()
    }
}

const replaceStream = new ReplaceStream('World', 'Node.js')
replaceStream.on('data', chunk => console.log(chunk.toString()))

replaceStream.write('Hello W')
replaceStream.write('orld!')
replaceStream.end()
```
下面是对 `_transform()` 方法的解释：

在 `ReplaceStream` 类中，`_transform` 方法是用来处理流中的数据的。这个方法会在每次有新的数据块（chunk）到来时被调用。`tail` 属性用于存储上一次处理时剩余的部分数据，这通常是因为在上一次处理中，数据块的末尾恰好包含了搜索字符串（`searchStr`），但是不足以进行替换。

以下是 `_transform` 方法中 `tail` 相关逻辑的详细解释：

1. **拼接数据块**：首先，将上一次处理剩余的 `tail` 和当前的数据块 `chunk` 拼接起来。这样做是为了确保在处理流数据时，不会因为数据块的边界而遗漏搜索字符串。

2. **分割数据**：使用 `split` 方法根据 `searchStr` 将拼接后的数据分割成多个部分。这些部分中，除了最后一个部分，其他的都应该完整地包含 `searchStr`。

3. **处理最后一个片段**：`pieces[pieces.length - 1]` 是分割后的最后一个片段，它可能包含 `searchStr` 的部分，但不足以进行完整的替换。因此，需要计算这个片段中 `searchStr` 后面剩余的部分的长度 `tailLen`，这个长度等于 `searchStr` 的长度减去1。

4. **更新 `tail`**：将最后一个片段中 `searchStr` 后面剩余的部分保存到 `tail` 中，以便下一次处理时使用。这里的 `lastPiece.slice(-tailLen)` 就是取最后一个片段的最后 `tailLen` 个字符。

5. **修正最后一个片段**：通过 `lastPiece.slice(0, -tailLen)` 将最后一个片段中应该替换的部分修正，移除掉尾部的 `tailLen` 个字符，因为这些字符将被保存到 `tail` 中。

6. **推送替换后的数据**：使用 `pieces.join(this.replaceStr)` 将所有片段（除了最后一个片段，因为它已经被修正）连接起来，并在每个 `searchStr` 的位置插入 `replaceStr`，然后通过 `this.push` 方法将结果推送到可读缓冲区。

7. **回调**：最后，调用 `cb()` 来通知流处理系统 `_transform` 方法已经处理完毕，可以继续处理下一个数据块。

通过这种方式，`ReplaceStream` 能够逐块地处理流数据，并且在数据块的边界处正确地处理搜索字符串，确保替换操作的准确性。


> 具体例子举例

好的，让我们通过一个具体的例子来说明 `ReplaceStream` 类中的 `_transform` 方法如何处理流数据。

假设我们有一个流，并且我们想要将所有的 "foo" 替换成 "bar"。下面是一些流中的数据块（chunks）和处理过程：

1. **初始化**：
   - `tail` 为空字符串。
   - `searchStr` 为 "foo"。
   - `replaceStr` 为 "bar"。

2. **第一个 chunk**："fool"（注意，这里 "foo" 后面没有 'l'，所以 "foo" 不完整）
   - 拼接："fo" + "ol" = "foo"（这里 "foo" 刚好完整）
   - 分割：["", "l"]（因为 "foo" 被分割，所以前面是空字符串，后面是 "l"）
   - 更新 `tail`："l"（因为 "foo" 后面没有其他字符，所以 `tail` 就是 "l"）
   - 推送：""（因为前面是空字符串，所以没有替换发生）
   - 回调。

3. **第二个 chunk**："bar"（这里 "foo" 完整，并且后面跟着 "bar"）
   - 拼接："l" + "bar" = "lbar"（"l" 是上一次的 `tail`）
   - 分割：["l", "bar"]（因为 "foo" 不在 "lbar" 中，所以没有分割）
   - 更新 `tail`：""（因为 "lbar" 中没有 "foo"，所以没有剩余的部分）
   - 推送："lbar"（直接推送拼接后的结果）
   - 回调。

4. **第三个 chunk**："bazfoo"（这里 "foo" 完整，并且后面跟着 "baz"）
   - 拼接："lbar" + "bazfoo" = "lbarbazfoo"（"lbar" 是上一次的 `tail`）
   - 分割：["lbar", "baz"]（因为 "foo" 被分割，所以前面是 "lbar"，后面是 "baz"）
   - 更新 `tail`：""（因为 "baz" 后面没有 "foo"，所以没有剩余的部分）
   - 推送："lbarbaz"（"foo" 被替换为 "bar"）
   - 回调。

5. **第四个 chunk**："foo"（这里 "foo" 完整）
   - 拼接："" + "foo" = "foo"（上一次处理完毕后 `tail` 为空）
   - 分割：["", "foo"]（因为 "foo" 被分割，所以前面是空字符串，后面是 "foo"）
   - 更新 `tail`：""（因为 "foo" 后面没有其他字符，所以 `tail` 为空）
   - 推送："bar"（"foo" 被替换为 "bar"）
   - 回调。

6. **流结束**：
   - 此时没有更多的数据块，但是可能还有 `tail` 中的数据需要处理。
   - 调用 `_flush` 方法，如果 `tail` 不为空，则将其推送到可读缓冲区。

通过这个例子，我们可以看到 `ReplaceStream` 如何处理流中的数据块，以及 `tail` 如何在处理过程中被更新和使用。

