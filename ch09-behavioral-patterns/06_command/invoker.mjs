import superagent from 'superagent'

// Invoker Component
export class Invoker {
    constructor() {
        this.history = []
    }

    // 立即执行命令
    run(cmd) {
        // 保存命令到历史栈中
        this.history.push(cmd)
        // 执行命令
        cmd.run()
        console.log('Command executed', cmd.serialize())
    }

    // 延迟命令的执行
    delay(cmd, delay) {
        setTimeout(() => {
            console.log('Executing delayed command', cmd.serialize())
            this.run(cmd)
        }, delay)
    }

    // 撤销命令
    undo() {
        const cmd = this.history.pop()
        cmd.undo()
        console.log('Command undone', cmd.serialize())
    }

    // 发送命令到远程服务器 （远程命令执行器）
    async runRemotely(cmd) {
        await superagent.post('http://localhost:3000/cmd')
            .send({ json: cmd.serialize() })

        console.log('Command executed remotely', cmd.serialize())
    }
}