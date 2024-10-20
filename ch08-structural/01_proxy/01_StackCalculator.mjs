export default class StackCalculator {
    constructor() {
        this.stack = []
    }

    putValue(value) {
        this.stack.push(value)
    }

    getValue() {
        return this.stack.pop()
    }

    peekValue() {
        return this.stack[this.stack.length - 1]
    }

    clear() {
        this.stack = []
    }

    divide() {
        const divisor = this.getValue()
        const dividend = this.getValue()
        const result = dividend / divisor
        this.putValue(result)

        return result
    }

    multiply() {
        const multiplicand = this.getValue()
        const factor = this.getValue()
        const result = factor * multiplicand
        this.putValue(result)

        return result
    }
}

const calculator = new StackCalculator()
calculator.putValue(3)
calculator.putValue(2)
console.log('乘法', calculator.multiply())
calculator.putValue(2)
console.log('乘法', calculator.multiply())
