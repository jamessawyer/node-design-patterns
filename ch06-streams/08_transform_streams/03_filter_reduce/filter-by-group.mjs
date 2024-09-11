import { Transform } from 'node:stream'

export default class FilterByGroup extends Transform {
    constructor(country, options = {}) {
        // 使用objectMode
        options.objectMode = true
        super(options)
        this.country = country
    }

    // 这里的record是一个对象
    _transform(record, encoding, cb) {
        if (record.country === this.country) {
            // 依据条件 将数据推送到readable buffer中，从而实现过滤
            this.push(record)
        }
        cb()
    }
}