import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import FilterByGroup from './filter-by-group.mjs'
import SumProfit from './sum-profit.mjs'

// csvParser 是一种转换流实例
const csvParser = new parse({ columns: true })

createReadStream('data.csv')
    .pipe(csvParser)
    .pipe(new FilterByGroup('Italy'))
    .pipe(new SumProfit())
    .pipe(process.stdout)
