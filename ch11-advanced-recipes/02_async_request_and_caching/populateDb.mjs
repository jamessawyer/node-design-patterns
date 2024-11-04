import { Level } from 'level'
import { nanoid } from 'nanoid'

const db = new Level('example-db')
const salesDb = db.sublevel('sales', { valueEncoding: 'json' })
const products = ['book', 'game', 'app', 'song', 'movie']

async function populate() {
    for (let i = 0; i < 100000; i++) {
        await salesDb.put(nanoid(), {
            amount: Math.ceil(Math.random() * 100),
            product: products[Math.floor(Math.random() * products.length)]
        })
    }
    console.log('DB populated 🎉')
}

populate()
