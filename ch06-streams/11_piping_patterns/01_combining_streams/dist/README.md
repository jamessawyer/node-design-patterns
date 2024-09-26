结合流实际上是一种 `Duplex Stream`，从一端写入数据，从另一端读取数据，中间可以包含多个其它的流，它的作用：

1. 进行封装，隐藏内部细节
2. 对管道内的错误进行捕获和冒泡传递

可以使用 [pumpify](https://www.npmjs.com/package/pumpify) 对多个流进行组合