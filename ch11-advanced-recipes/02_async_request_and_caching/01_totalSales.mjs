import { Level } from 'level'

const db = new Level('example-db')
const salesDb = db.sublevel('sales', { valueEncoding: 'json' })

export async function totalSales(product) {
    const now = Date.now()
    let sum = 0

    for await (const [key, transaction] of salesDb.iterator()) {
        // console.log('key', key)
        // console.log('value', transaction)
        if (!product || transaction.product === product) {
            sum += transaction.amount
        }
    }

    console.log(`totalSales() took: ${Date.now() - now}ms`)

    return sum
}

