import StackCalculator from './StackCalculator.mjs'

const enhancedCalculatorHandler = {
    get(target, property) {
        if (property === 'add') {
            // 新方法
            return function add() {
                const addend2 = target.getValue()
                const addend1 = target.getValue()
                const result = addend1 + addend2
                target.putValue(result)

                return result
            }
        } else if (property === 'divide') {
            // 修改方法
            return function () {
                const divisor = target.peekValue()
                if (divisor === 0) {
                    throw Error('被除数不能为0')
                }
                // 如果上面验证通过，则Proxy内部调用Subject的方法
                return target.divide()
            }
        }
        return target[property]
    }
}

const calculator = new StackCalculator()
const enhancedCalculator = new Proxy(calculator, enhancedCalculatorHandler)

enhancedCalculator.putValue(4)
enhancedCalculator.putValue(3)

console.log('加法', enhancedCalculator.add())
enhancedCalculator.putValue(2)
console.log('乘法', enhancedCalculator.multiply())
enhancedCalculator.putValue(0)
console.log('除法', enhancedCalculator.divide())