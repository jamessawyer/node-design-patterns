import StackCalculator from './01_StackCalculator.mjs'

/**
 * 使用ES6 Proxy代理对象
 * 通过Proxy对象，可以在代理对象内部直接调用Subject的方法
 */

const safeCalculatorHandler = {
    get: (target, prop) => {
        if (prop === 'divide') {
            return function() {
                const divisor = target.peekValue()
                if (divisor === 0) {
                    throw Error('被除数不能为0')
                }

                return target.divide()
            }
        }
        return target[prop]
    }
}

const calculator = new StackCalculator()
// 使用ES6 Proxy代理对象
const safeCalculator = new Proxy(calculator, safeCalculatorHandler)
// proxy对象会继承subject的原型
console.log('proxy是否继承subject：', safeCalculator instanceof StackCalculator)


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