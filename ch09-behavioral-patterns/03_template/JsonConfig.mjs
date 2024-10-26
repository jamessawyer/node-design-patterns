import { ConfigTemplate } from './ConfigTemplate.mjs'

// 模板1：JSON
// 只实现 _serialize() & _deserialize() 动态的部分
export class JsonConfig extends ConfigTemplate {
    _deserialize(data) {
        return JSON.parse(data)
    }

    _serialize(data) {
        return JSON.stringify(data, null, 4)
    }
}
