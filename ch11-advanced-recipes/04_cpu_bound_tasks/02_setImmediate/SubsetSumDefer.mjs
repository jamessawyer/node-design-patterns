import { EventEmitter } from 'node:events'

/**
 * 通常，cpu密集型算法是基于一组步骤构建的。
 * 这可以是一组递归调用、一个循环或它们的任何变体/组合。
 * 因此，我们的问题的一个简单解决方案是，在每个步骤完成后（或完成一定数量的步骤后）将控制权交还给事件循环。
 * 这样，任何挂起的I/O仍然可以在长时间运行的算法产生CPU的时间间隔内由事件循环处理。
 * 实现这一点的一个简单方法是将算法的下一步安排在任何挂起的I/O请求之后运行。
 * 这听起来像是setImmediate()函数的完美用例
 */

// 数字集合的子集的所有项之和等于sum的子集
// 例如 [1,-1,-2,2,3] 子集合加起来等于0的子集有
// [1, -1] [-2, 2] [1, -1, -2, 2] [-1, -2, 3]
export class SubsetSumDefer extends EventEmitter {
    constructor(sum, set) {
        super()
        this.sum = sum
        this.set = set
        // 子集合数量
        this.totalSubsets = 0
    }

    // 产生所有子集合，并对子集合进行处理（同步的）
    _combine(set, subset) {
        for (let i = 0; i < set.length; i++) {
            const newSubset = [...subset, set[i]]
            // 确保算法的每一步都会使用setImmediate()在事件循环中排队，
            // 因此，它将在任何挂起的I/O请求之后执行，而不是同步运行。
            this._combineInterleaved(set.slice(i + 1), newSubset)
            this._processSubset(newSubset)
        }
    }

    // _combineInterleaved()方法用于将cpu密集的_combine()方法与使用setImmediate的事件循环交织在一起。
    // 1. 增加runningCombine计数器。
    // 2. 使用setImmediate调度_combine()方法在任何挂起的I/O操作之后运行。
    // 3.当_combine完成时，减少runningCombine计数器。
    // 4. 如果runningCombine变为0，则发出一个‘end’事件，表示所有组合都已被处理。
    // 这允许cpu密集的_combine方法将控制权交还给事件循环，防止它阻塞其他I/O操作。
    _combineInterleaved(set, subset) {
        this.runningCombine++
        setImmediate(() => {
            // 延迟调用原来同步的_combine()方法
            this._combine(set, subset)
            if (--this.runningCombine === 0) {
                this.emit('end')
            }
        })
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
        this.runningCombine = 0
        this._combineInterleaved(this.set, [])
    }
}