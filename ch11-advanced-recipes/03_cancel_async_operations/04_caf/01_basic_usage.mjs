import { CAF } from 'caf'

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('haha')
        }, ms)
    })
}

const onResponse = (res) => console.log('res', res)
const onCancelOrError = err => console.error('err', err)

function test1() {
    const token = new CAF.cancelToken()

    const main = CAF(function* main(signal, ms) {
        const resp = yield delay(ms)

        console.log('resp', resp)
        return resp
    })

    main(token.signal, 2000)
        .then(
            onResponse,
            onCancelOrError
        )

    setTimeout(() => {
        token.abort('abort it')
    }, 100)
}

test1() 

// err abort it
