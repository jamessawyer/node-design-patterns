import { FailsafeSocket } from './failsafeSocket.mjs'

const failSafeSocket = new FailsafeSocket({ port: 5050 })

setInterval(() => {
    failSafeSocket.send(process.memoryUsage())
}, 1000)
