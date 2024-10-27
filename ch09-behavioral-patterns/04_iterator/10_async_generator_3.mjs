// example from https://www.youtube.com/watch?v=J24rb6_5h9o&ab_channel=AndrewBurgess

// glob 需要node v22.0.0+
// https://nodejs.cn/api/fs.html#fspromisesglobpattern-options
// import { glob, readFile } from 'node:fs/promises'
import { readFile } from 'node:fs/promises'
import { globby } from 'globby'

function readFileToString(filePath)  {
    // 返回一个promise
    return readFile(filePath, 'utf8').then(buf => buf.toString('utf8'))
}

// 异步生成器
async function* mapAsync(iterable, mapperFn) {
    for await (const item of iterable) {
        yield mapperFn(item)
    }
}

// const filePaths = await glob('*.mjs')
const filePaths = await globby('*.mjs')
const pathsAndContent = mapAsync(
    filePaths,
    async filePath => [filePath, await readFileToString(filePath)]
)

for await (const [filePath, content] of pathsAndContent) {
    console.log({ filePath, content })
}
// node v22.0.0+ 可以使用 Array.fromAsync()
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync
// console.log(await Array.fromAsync(pathsAndContent))