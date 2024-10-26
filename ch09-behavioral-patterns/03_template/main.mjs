import { JsonConfig } from './JsonConfig.mjs'
import { IniConfig } from './IniConfig.mjs'

async function main() {
    const jsonConfig = new JsonConfig()
    await jsonConfig.load('samples/conf.json')
    jsonConfig.set('book.node.js', 'design patterns')
    await jsonConfig.save('samples/conf.json')

    const iniConfig = new IniConfig()
    await iniConfig.load('samples/conf.ini')
    iniConfig.set('book.node.js', 'design patterns')
    await iniConfig.save('samples/conf.ini')
}

main()
