import { promises as fs } from 'node:fs'
import objectPath from 'object-path'

export class ConfigTemplate {
    async load(file) {
        console.log(`从 ${file} 解序列化`)
        this.data = this._deserialize(
            await fs.readFile(file, 'utf8')
        )
    }

    async save(file) {
        console.log(`序列化到 ${file}`)
        await fs.writeFile(file, this._serialize(this.data))
    }

    get(path) {
        return objectPath.get(this.data, path)
    }

    set(path, value) {
        return objectPath.set(this.data, path, value)
    }

    // 上面是模板中固定的实现
    // 下面是需要子类去实现的具体的实现
    // 父类中直接throw 子类必须实现该方法
    _serialize(data) {
        throw new Error('子类必须实现_serialize方法')
    }

    _deserialize(data) {
        throw new Error('子类必须实现_deserialize方法')
    }
}