import StackCalculator from './StackCalculator.mjs'

// 直接修改原对象的方式增加对象功能
function patchCalculator(calculator) {
    calculator.add = () => {
        const addend2 = calculator.getValue()
        const addend1 = calculator.getValue()
        const result = addend1 + addend2
        calculator.putValue(result)

        return result
    }

    const divideOrig = calculator.divide
    calculator.divide = () => {
        const divisor = calculator.peekValue()
        if (divisor === 0) {
            throw Error('被除数不能为0')
        }
        // 如果上面验证通过，则Proxy内部调用Subject的方法
        return divideOrig.apply(calculator)
    }

    return calculator
}

const calculator = new StackCalculator()
const enhancedCalculator = patchCalculator(calculator)

enhancedCalculator.putValue(4)
enhancedCalculator.putValue(3)

console.log('加法', enhancedCalculator.add())
enhancedCalculator.putValue(2)
console.log('乘法', enhancedCalculator.multiply())
enhancedCalculator.putValue(0)
console.log('除法', enhancedCalculator.divide())