import { CAF } from 'caf'

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('haha')
        }, ms)
    })
}

const token = new CAF.cancelToken()

const one = CAF(function* one(signal, ms) {
    return yield two(signal, ms)
})

const two = CAF(function* two(signal, ms) {
    return yield three(ms)
})

const three = CAF(function* three(ms) {
    return yield delay(ms)
})

one(token.signal, 2000)

setTimeout(function onElapsed() {
    token.abort('请求时间过长，现在取消请求')
}, 5000)
