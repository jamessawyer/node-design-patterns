import StackCalculator from './StackCalculator.mjs'

class EnhancedCalculator {
    constructor(calculator) {
        this.calculator = calculator
    }

    // 新的方法
    add() {
        const addend2 = this.getValue()
        const addend1 = this.getValue()
        const result = addend1 + addend2
        this.putValue(result)

        return result
    }

    // 修改方法
    divide() {
        const divisor = this.calculator.peekValue()
        if (divisor === 0) {
            throw Error('被除数不能为0')
        }
        return this.calculator.divide()
    }

    // 委托方法
    putValue(value) {
        return this.calculator.putValue(value)
    }

    getValue() {
        return this.calculator.getValue()
    }

    peekValue() {
        return this.calculator.peekValue()
    }

    multiply() {
        return this.calculator.multiply()
    }
}

const calculator = new StackCalculator()
const enhancedCalculator = new EnhancedCalculator(calculator)

enhancedCalculator.putValue(4)
enhancedCalculator.putValue(3)

console.log('加法', enhancedCalculator.add())
enhancedCalculator.putValue(2)
console.log('乘法', enhancedCalculator.multiply())
enhancedCalculator.putValue(0)
console.log('除法', enhancedCalculator.divide())