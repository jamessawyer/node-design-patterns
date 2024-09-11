import { Writable } from 'node:stream'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { mkdirp } from 'mkdirp'

const tfs = new Writable({
    objectMode: true,
    write(chunk, encoding, cb) {
        mkdirp(dirname(chunk.path))
            .then(() => fs.writeFile(chunk.path, chunk.content))
            .then(() => cb())
            .catch(cb)
    }
})

tfs.write({
    path: join('files2', 'file1.txt'),
    content: 'Hello'
})
tfs.write({
    path: join('files2', 'file2.txt'),
    content: 'Node.js'
})
tfs.write({
    path: join('files2', 'file3.txt'),
    content: 'Streams'
})

tfs.end(() => console.log('所有文件已创建'))