// import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Level } from 'level'
import { createFSAdapter } from './fs-adapter.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db')
const db = new Level(dbPath, { valueEncoding: 'binary' })
const fs = createFSAdapter(db) // 使用适配器返回的fs 而不是node提供的fs模块

fs.writeFile('file.txt', 'Hello!', () => {
    fs.readFile('file.txt', { encoding: 'utf-8' }, (err, res) => {
        if (err) {
            console.log('读取存在的文件')
            return console.error(err)
        }
        console.log(res)
    })
})

fs.readFile('missing.txt', { encoding: 'utf-8' }, (err, res) => {
    if (err) {
        console.log('读取不存在的文件')
        return console.error(err)
    }
    console.log(res)
})