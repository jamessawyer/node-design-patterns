import { Transform } from 'node:stream'

export default class SumProfit extends Transform {
    constructor(options = {}) {
        // 使用objectMode
        options.objectMode = true
        super(options)
        this.total = 0
    }

    _transform(record, encoding, cb) {
        // 这里并没有调用 this.push() 这意味着当数据流经流时不会发出任何值。
        this.total += Number.parseFloat(record.profit)
        cb()
    }

    // 为了在处理完所有数据后发出最终结果，我们必须使用_flush()方法定义自定义刷新行为。
    // _flush()是在流关闭之前自动调用的
    _flush(cb) {
        this.push(this.total.toString())
        cb()
    }
}