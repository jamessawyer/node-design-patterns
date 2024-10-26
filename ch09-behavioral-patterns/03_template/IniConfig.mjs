import { ConfigTemplate } from './ConfigTemplate.mjs'
import ini from 'ini'

export class IniConfig extends ConfigTemplate {
    _serialize(data) {
        return ini.stringify(data)
    }
    _deserialize(data) {
        return ini.parse(data)
    }
}