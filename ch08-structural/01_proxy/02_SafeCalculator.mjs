// 解决除法中被除数为0的情形
/**
 * 对象组合（Object Composition）：扩展原对象功能或使用组合对象的功能
 * 在代理模式下，组合对象充当subject对象，subject实例在proxy内部被创建
 */
import StackCalculator from './01_StackCalculator.mjs'

class SafeCalculator {
    constructor(calculator) {
        // 通过构造函数的方式将Subject对象传递给Proxy对象
        this.calculator = calculator
    }

    // 代理方法
    divide() {
        // 额外的逻辑
        const divisor = this.calculator.peekValue()
        if (divisor === 0) {
            throw Error('被除数不能为0')
        }
        // 如果上面验证通过，则Proxy内部调用Subject的方法
        return this.calculator.divide()
    }

    putValue(value) {
        return this.calculator.putValue(value)
    }

    getValue() {
        return this.calculator.getValue()
    }

    peekValue() {
        return this.calculator.peekValue()
    }

    clear() {
        return this.calculator.clear()
    }

    multiply() {
        return this.calculator.multiply()
    }
}

const calculator = new StackCalculator()
const safeCalculator = new SafeCalculator(calculator)
safeCalculator.putValue(3)
safeCalculator.putValue(2)
console.log('乘法', safeCalculator.multiply())

safeCalculator.putValue(2)
console.log('乘法', safeCalculator.multiply())

// 直接使用Subject 除以0的情形
calculator.putValue(0)
console.log('直接Subject除以0的情形', calculator.divide())

// 清空计算器
safeCalculator.clear()
safeCalculator.putValue(4)
safeCalculator.putValue(0)
console.log('Proxy除以0的情形', safeCalculator.divide())