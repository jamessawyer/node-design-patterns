// 有async iterators 就有 async generators
// async generators 既可以是有效的async iterators 也可以是有效的async iterables
// 语法
// async function* asyncGeneratorFunction() {}
// 或者 自定义实现 async *[Symbol.asyncIterator]() {}


import superagent from 'superagent'

class CheckUrls {
    constructor(urls) {
        this.urls = urls
    }

    async *[Symbol.asyncIterator]() {
        for (const url of this.urls) {
            try {
                const checkResult = await superagent.head(url).redirects(2)
                // 使用yield关键字来yield每个url的检测结果
                yield `${url} is up. status: ${checkResult.status}`
            } catch(err) {
                yield `${url} is down. error: ${err.message}`
            }
        }
    }
}
// 

async function main() {
    const checkUrls = new CheckUrls([
        'https://mario.fyi',
        'https://example.com',
        'https://mustbedownforsurehopefully.com',
        'https://nodejsdesignpatterns.com'
    ])

    for await (const status of checkUrls) {
        console.log(status)
    }
}

main()

/* https://mario.fyi is up. status: 200
https://example.com is down. error: connect ECONNREFUSED 127.0.0.1:443
https://mustbedownforsurehopefully.com is down. error: getaddrinfo ENOTFOUND mustbedownforsurehopefully.com
https://nodejsdesignpatterns.com is up. status: 200 */