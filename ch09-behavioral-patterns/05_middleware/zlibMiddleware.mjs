// inflateRaw用于解压缩buffer流
// deflateRaw用于压缩buffer流
import { inflateRaw, deflateRaw } from 'node:zlib'
import { promisify } from 'node:util'

const inflateRawAsync = promisify(inflateRaw)
const deflateRawAsync = promisify(deflateRaw)

export const zlibMiddleware = function() {
    return {
        inbound(message) {
            // 解压缩进站的流
            // 异步的 返回一个promise
            return inflateRawAsync(Buffer.from(message))
        },
        outbound(message) {
            // 压缩出站的流
            return deflateRawAsync(message)
        }
    }
}
