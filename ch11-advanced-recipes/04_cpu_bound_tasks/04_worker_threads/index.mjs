import { createServer } from 'node:http'
// 这里的SubsetSum是SubsetSumThreads.mjs
import { SubsetSum } from './subsetSumThreads.mjs'

createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    
    if (url.pathname !== '/subsetSum') {
        res.writeHead(200)
        return res.end(`I'm alive \n`)
    }

    const sum = JSON.parse(url.searchParams.get('sum'))
    const data = JSON.parse(url.searchParams.get('data'))

    res.writeHead(200)
    const subsetSum = new SubsetSum(sum, data)
    subsetSum.on('match', match => {
        res.write(`Match: ${JSON.stringify(match)}\n`)
    })
    subsetSum.on('end', () => {
        res.end()
    })

    subsetSum.start()
}).listen(8000, () => console.log('Server running on port 8000'))

// 启动服务器
// node index.mjs

// 第一个请求 这个会产生131071个子集合 然后进行计算
// curl -G http://localhost:8000/subsetSum --data-urlencode "data=[16,19,1,1,-16,9,1,-5,-2,17,-15,-97,-16,-4,-5,15]" --data-urlencode "sum=0"

// 第2个请求 因为因为使用了子进程进行处理，因此不会被阻塞
// curl -G http://localhost:8000