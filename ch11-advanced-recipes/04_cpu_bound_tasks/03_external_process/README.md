多进程方法与交错方法相比具有许多优点。首先，在运行算法时不会引入任何计算惩罚。其次，它可以充分利用多处理器机器。

需要注意的是🚨

当子进程不是Node.js程序时，我们刚才描述的简单通信通道（`on()`, `send()`）不可用。在这些情况下，我们仍然可以通过在标准输入和标准输出流上实现自己的协议，与子进程建立接口，这些流被暴露给父进程