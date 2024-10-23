import { Config } from './config.mjs'
import { jsonStrategy, iniStrategy } from './strategies.mjs'

async function main() {
    const iniConfig = new Config(iniStrategy)
    await iniConfig.load('samples/conf.ini')
    iniConfig.set('book.node.js', 'design patterns')
    await iniConfig.save('samples/conf.ini')

    const jsonConfig = new Config(jsonStrategy)
    await jsonConfig.load('samples/conf.json')
    jsonConfig.set('book.node.js', 'design patterns')
    await jsonConfig.save('samples/conf.json')
}

main()
