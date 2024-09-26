import { createReadStream, createWriteStream } from 'node:fs'
import { Transform } from 'node:stream';
import pumpify from 'pumpify'

const streamA = createReadStream('../package.json')

const streamB = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

const streamC = createWriteStream('package-uppercase.json')

const combinedStreams = pumpify(streamA, streamB, streamC)

combinedStreams.on('error', (err) => {
  console.error('Error occurred while processing streams', err)
})

combinedStreams.on('end', () => {
  console.log('All streams have finished processing')
})
