// 可以使用Readable.from()从数组或者可迭代对象(iterable) 
// 即generators, iterators, async iterators中创建可读流


import { Readable } from 'stream'

const mountains = [
    { name: 'Everest', height: 8848 },
    { name: 'K2', height: 8611 },
    { name: 'Kangchenjunga', height: 8586 },
    { name: 'Lhotse', height: 8516 },
    { name: 'Makalu', height: 8481 },
]
// Readable.from() 会默认将 objectMode 配置项设置为true
const mountainsStream = Readable.from(mountains)

mountainsStream
    .on('data', mountain => {
        console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`)
    })
    .on('end', () => {
        console.log('End of stream')
    })