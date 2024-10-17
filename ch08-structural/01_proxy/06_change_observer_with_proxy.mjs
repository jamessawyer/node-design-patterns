// Change Observer pattern专注于允许被观察者属性的修改被检测到
// 而Observer pattern 则是一种通用的模式

/**
 * 这里只是简单的代理，更复杂的会处理好嵌套对象或数组等情况
 * @param {Object} target 被观察的对象
 * @param {Function} observer 一个回调函数，每次属性值发生变化时会被调用
 * @returns 
 */
function createObservable(target, observer) {
    const observable = new Proxy(target, {
        set(obj, prop, value) {
            if (value !== obj[prop]) {
                const prev = obj[prop] // 旧的值
                obj[prop] = value // 新的值
                observer({ prop, prev, curr: value})
            }
            return true
        }
    })

    return observable
}

function calculateTotal(invoice) {
    return invoice.subtotal - invoice.discount + invoice.tax
}

const invoice = {
    subtotal: 100,
    discount: 10,
    tax: 20
}

let total = calculateTotal(invoice)
console.log(`Starting total: ${total}`)

const obsInvoice = createObservable(
    invoice,
    ({ prop, prev, curr }) => {
        total = calculateTotal(invoice)
        console.log(`total: ${total} (${prop} changed: ${prev} -> ${curr})`)
    }
)

// 属性值发生变化
obsInvoice.subtotal = 200
obsInvoice.discount = 20
obsInvoice.discount = 20 // 没有发生变化，不会触发回调
obsInvoice.tax = 30

console.log(`Ending total: ${total}`)