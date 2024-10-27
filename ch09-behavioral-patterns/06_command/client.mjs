import { createPostStatusCmd } from './createPostStatusCmd.mjs'
import { statusUpdateService } from './statusUpdateService.mjs'
import { Invoker } from './invoker.mjs'

const invoker = new Invoker()

// 使用工厂函数创建命令
const cmd = createPostStatusCmd(statusUpdateService, 'Hi')

// 立即执行该命令
invoker.run(cmd)

// 撤销上面的命令
invoker.undo()

// 延迟3s执行命令
invoker.delay(cmd, 3000)

// 发送命令到远程服务器
// invoker.runRemotely(cmd)