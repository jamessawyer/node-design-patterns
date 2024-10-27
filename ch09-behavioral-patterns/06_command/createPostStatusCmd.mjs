// 工厂函数
// 该函数创建一个命令来表示发布新的状态更新。
export function createPostStatusCmd(service, status) {
    let postId = null

    // COMMAND Component
    // 命令对象
    return {
        // 
        run() {
            postId = service.postUpdate(status)
        },
        // 用于恢复post操作的效果
        undo() {
            if (postId) {
                service.destroyUpdate(postId)
                postId = null
            }
        },
        // 构建一个JSON对象，其中包含重构相同命令对象所需的所有必要信息
        serialize() {
            return {
                type: 'status',
                action: 'post',
                status,
            }
        }
    }
}