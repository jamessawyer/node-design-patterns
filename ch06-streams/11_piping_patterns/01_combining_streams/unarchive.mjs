import { promises as fsPromises, createReadStream, createWriteStream,  } from 'fs'
import { pipeline } from 'node:stream'
import { createDecryptAndDecompress } from './combined-streams.mjs'
import { join, basename } from 'path'

// 这里的iv就是 archive.mjs 中生成iv
const [,, password, iv, source] = process.argv

// 判断destination文件是否存在，不存在就同步创建该文件
// check if `dist` folder and file `destination`  exists and create it if not
const receivedDir = 'dist'
const destination = join(receivedDir, basename(source, '.gz.enc'))
try {
  await fsPromises.stat(receivedDir)
} catch (err) {
  if (err.code === 'ENOENT') {
    await fsPromises.mkdir(receivedDir)
  } else {
    throw err
  }
}

try {
  await fsPromises.stat(destination);
} catch (err) {
  if (err.code === 'ENOENT') {
    await fsPromises.writeFile(destination, '');
  } else {
    throw err;
  }
}

// node ./unarchive.mjs randomPassword 21be7a5e80a14c17d62bab4f11a2ff18 ./README.md.gz.enc
// 21be7a5e80a14c17d62bab4f11a2ff18 是iv
pipeline(
  createReadStream(source),
  // 注意这里的 iv是 hex 形式，将其转换为Buffer
  createDecryptAndDecompress(password, Buffer.from(iv, 'hex')),
  createWriteStream(destination),
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`文件写入到：${destination}`);
  }
)