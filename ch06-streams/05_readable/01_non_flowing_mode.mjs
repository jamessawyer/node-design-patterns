// 将用户输入打印出来

// process.stdin 是一个可读流
// 监听 `readable` 事件 它是一种non-flowing模式
process.stdin
    .on('readable', () => {
        let chunk

        console.log('New data available')
        // read([size?]) 这是一个同步操作，会从readable buffer中拉取数据
        // 当 readable buffer 中没有数据时，read() 返回null
        // read(size) 传入size在实现网络协议或解析特殊的数据格式时会比较有用
        // chunk 默认是字节流 而chunk.toString() 是字符串,默认是utf8编码
        while((chunk = process.stdin.read()) !== null) {
            console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`)
        }
    })
    .on('end', () => console.log(`end of stream`))
