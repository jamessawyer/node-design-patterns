import superagent from 'superagent'
// 异步迭代器
// 实现 [Symbol.asyncIterator]() 方法
// 并使用 `for await of` 进行迭代
class CheckUrls {
    constructor(urls) {
        // urls是一个可迭代对象 比如数组
        this.urls = urls
    }

    [Symbol.asyncIterator]() {
        // 获取迭代器
        const urlsIterator = this.urls[Symbol.iterator]()

        return {
            // 注意这里的next()方法是异步的
            // 它会返回一个promise
            async next() {
                const iteratorResult = urlsIterator.next()
                if (iteratorResult.done) {
                    return { done: true }
                }

                const url = iteratorResult.value
                try {
                    const checkResult = await superagent.head(url).redirects(2)

                    return {
                        done: false,
                        value: `${url} is up. status: ${checkResult.status}`
                    }
                } catch(err) {
                    return {
                        done: false,
                        value: `${url} is down. error: ${err.message}`
                    }
                }
            }
        }
    }
}

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