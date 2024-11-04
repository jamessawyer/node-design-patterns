import { createServer } from 'node:http'
import { totalSales } from './03_totalSalesBatch.mjs'

createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const product = url.searchParams.get('product')
    console.log(`处理查询：${url.search}`)

    const sum = await totalSales(product)

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(JSON.stringify({ product, sum }))
}).listen(8000, () => console.log('Server running on port 8000'))
