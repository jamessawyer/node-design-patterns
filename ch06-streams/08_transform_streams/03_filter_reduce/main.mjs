import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import FilterByGroup from './filter-by-group.mjs'
import SumProfit from './sum-profit.mjs'
import { pipeline } from 'node:stream'

// csvParser 是一种转换流实例
const csvParser = new parse({ columns: true })

// pipe() 不容易进行错误处理
// createReadStream('data.csv')
//     .pipe(csvParser)
//     .pipe(new FilterByGroup('Italy'))
//     .pipe(new SumProfit())
//     .pipe(process.stdout)

// ✅ pipeline() 会自动处理错误和进行清理，比pipe()更好
pipeline(
    createReadStream('data.csv'),
    csvParser,
    new FilterByGroup('Italy'),
    new SumProfit(),
    process.stdout,
    err => console.error(err)
)
