import { resolve } from 'node:path'

// readFile & writeFile 是需要被适配的adaptee 这里使用 createFSAdapter 创建一个Adapter
export function createFSAdapter(db) {
    return ({
        readFile(filename, options, callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = { encoding: options }
            }
            db.get(
                resolve(filename), 
                {
                    valueEncoding: options.encoding
                }, 
                (err, value) => {
                    if (err) {
                        if (err.code === 'LEVEL_NOT_FOUND') {
                            err = new Error(`ENOENT, open ${filename}`)
                            err.code = 'ENOENT'
                            err.errno = 34
                            err.path = filename
                        }
                        return callback && callback(err)
                    }
                    callback && callback(null, value)
                }
            )
        },
        writeFile(filename, contents, options, callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = { encoding: options }
            }

            db.put(resolve(filename), contents, {
                valueEncoding: options.encoding
            }, callback)
        }
    })
}