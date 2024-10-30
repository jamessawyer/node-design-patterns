import nunjucks from 'nunjucks'


export function sayHello(name) {
    if (typeof __BROWSER__ !== 'undefined') {
        // 浏览器环境
        const template = '<h1>Hello <i>{{ name }}</i></h1>'
        return nunjucks.renderString(template, { name })
    }

    // node 环境
    return `Hello \u001b[1m${name}\u001b[0m`
}