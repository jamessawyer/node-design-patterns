/**
 * 02_SafeCalculator.mjs 为了代理StackCalculator,我们不得不重复的复制
 * 所有StackCalculator中的方法，这样会显得很无聊
 * 可以使用对象增强（也称猴子补丁），即在代理对象内部直接取代原有的方法
 */
import StackCalculator from './01_StackCalculator.mjs'

/**
 * 猴子补丁（Monkey Patching）：适用于更改少量的方法
 * 在代理对象内部直接取代原有的方法
 * 但是这种方式会直接修改被代理的对象（Subject）,
 * 会导致被代理对象的行为发生变化，这是不可取的
 */
function patchToSafeCalculator(calculator) {
    // 先将原有方法保存下来
    const divideOriginal = calculator.divide

    calculator.divide = () => {
        // 额外的验证逻辑
        const divisor = calculator.peekValue()
        if (divisor === 0) {
            throw Error('被除数不能为0')
        }
        // 如果上面验证通过)++;
        // 调用原有的方法，并通过apply()将this指向原对象
        return divideOriginal.apply(calculator)
    }

    return calculator
}

const calculator = new StackCalculator()
const safeCalculator = patchToSafeCalculator(calculator)

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