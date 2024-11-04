import superagent from 'superagent'

const start = Date.now()
let count = 20
let pending = count
const interval = 200
const query = process.argv[2] ? process.argv[2] : 'product=book'
console.log('222 ', process.argv[2])

function sendRequest() {
    superagent.get(`http://localhost:8000?${query}`)
        .then(result => {
            console.log(result.status, result.body)
            if (!--pending) {
                console.log(`All requests completed in ${Date.now() - start}ms`)
            }
        })

    if (--count) {
        setTimeout(sendRequest, interval)
    }
}
sendRequest()
