import fs from 'fs/promises'
import { gzip } from 'zlib'
import { promisify } from 'util'

const gzipPromise = promisify(gzip)

const filename = process.argv[2]

async function main() {
  const data = await fs.readFile(filename)
  const gzippedData = await gzipPromise(data)
  await fs.writeFile(filename + '.gz', gzippedData)
  console.log('Done')
}
main()