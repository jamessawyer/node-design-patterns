// 可读流也是一种异步迭代器
// 因此可以使用 for await...of 来遍历可读流

async function main() {
    for await (const chunk of process.stdin) {
        console.log('New data available')
        console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`)
    }
    console.log('end of stream')
}

main()