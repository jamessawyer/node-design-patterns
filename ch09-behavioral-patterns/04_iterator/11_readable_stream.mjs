// stream.Readable 实现了@@asyncIterator 方法
// 并且还有 stream.Readable.from(iterable, [options]) 其中iterable既可以是同步的，也可以是异步的
// 可以使用 for await...of 来遍历可读流
import split from 'split2'

async function main() {
    // split 是一个转换流 会根据换行符来分割数据
    const stream = process.stdin.pipe(split())

    for await (const line of stream) {
        console.log(`You typed: ${line}`)
    }
}

main()
