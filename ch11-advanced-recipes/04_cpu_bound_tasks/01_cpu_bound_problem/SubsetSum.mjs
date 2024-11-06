import { EventEmitter } from 'node:events'

// 数字集合的子集的所有项之和等于sum的子集
// 例如 [1,-1,-2,2,3] 子集合加起来等于0的子集有
// [1, -1] [-2, 2] [1, -1, -2, 2] [-1, -2, 3]
export class SubsetSum extends EventEmitter {
    constructor(sum, set) {
        super()
        this.sum = sum
        this.set = set
        // 子集合数量
        this.totalSubsets = 0
    }

    _combine(set, subset) {
        for (let i = 0; i < set.length; i++) {
            const newSubset = [...subset, set[i]]
            this._combine(set.slice(i + 1), newSubset)
            this._processSubset(newSubset)
        }
    }

    _processSubset(subset) {
        console.log('子集合数量:', ++this.totalSubsets)
        console.log('子集合:', subset)
        const res = subset.reduce((a, b) => a + b, 0)
        if (res === this.sum) {
            this.emit('match', subset)
        }
    }

    start() {
        // 因为_combine是同步的 所以下面的 end 事件在处理完成之后会触发
        this._combine(this.set, [])
        this.emit('end')
    }
}