// 不同于 readable事件，内部通过 read() 方法从buffer中拉取数据
// data事件是一种flowing模式 当buffer中存在数据时，会自动触发data事件
// 非流动模式可以更好的控制数据的读取和操作，默认也是non-flowing模式

// 默认是非流动模式，将其变为流动模式可以有如下方式：
// 1- 使用 `data` 事件时，会变为流动模式
// 2- 显式的调用 resume() 方法来恢复流动模式；
// 调用pause()方法来暂停流动模式，进入non-flowing模式，停止继续向buffer中写入数据
process.stdin
    .on('data', chunk => {
        console.log('new Data available')
        console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`)
    })
    .on('end', () => console.log('end of stream'))