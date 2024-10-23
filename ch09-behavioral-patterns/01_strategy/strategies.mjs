import ini from 'ini'

// 算法1
// https://www.npmjs.com/package/ini
// ini 格式 序列化和解序列化算法
export const iniStrategy = {
    deserialize: data => ini.parse(data),
    serialize: data => ini.stringify(data)
}

// 算法2
// JSON 格式 序列化和解序列化算法
export const jsonStrategy = {
    deserialize: data => JSON.parse(data),
    serialize: data => JSON.stringify(data)
}

