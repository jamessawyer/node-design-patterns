import { promises as fs } from 'node:fs'
import objectPath from 'object-path'

// object-path 用于对对象属性路径进行操作
// https://www.npmjs.com/package/object-path

export class Config {
    // 构造器中传入算法 -> 这个算法存在 deserialize() & serialize() 2个方法
    constructor(formatStrategy) {
        this.data = {}
        this.formatStrategy = formatStrategy
    }

    get(configPath) {
        return objectPath.get(this.data, configPath)
    }

    set(configPath, value) {
        return objectPath.set(this.data, configPath, value)
    }

    async load(filePath) {
        console.log(`从 ${filePath} 解序列化`)
        this.data = this.formatStrategy.deserialize(
            await fs.readFile(filePath, 'utf8')
        )
    }

    async save(filePath) {
        console.log(`序列化到 ${filePath}`)
        await fs.writeFile(filePath, this.formatStrategy.serialize(this.data))
    }
}