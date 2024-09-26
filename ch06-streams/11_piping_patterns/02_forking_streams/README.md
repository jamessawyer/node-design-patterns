forking streams一般是将一个Readable Stream 连接到多个 Writable Streams，将数据用于不同的处理，比如2个不同的sockets或者文件。

使用注意事项：

1. 分叉的流回接受相同的数据块，因此对数据执行带有副作用的操作时要小心，它们会相互影响
2. backpressure会自然形成，流的速度取决于最慢的forking，另外如果有一个流暂停了，其余流也会暂停
3. 如果中途再forking一个流，新forking的流接收不到之前已经传输完成的数据，不过可以使用PassThrough Stream 将流先存起来