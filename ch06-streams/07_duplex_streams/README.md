双工流同时继承了 `Stream.Readable` & `Stream.Writable`，即它同时拥有 `read()` 和 `write()` 方法，同时可以监听 `readable` 和 `drain` 事件。
自定义双工流，我们可以提供 `_read()` 和 `_write()` 方法，来自定义读写逻辑。
双工流的构造器 `options` 会转发给 `Readable` 和 `Writable` 的构造器。另外它还有个 `allowHalfOpen` 属性,默认是 `true`，如果设置为 `false`，如果readable流或writable流中的任意一个流关闭，那么双工流也会关闭。

可以分别设置 `readableObjectMode` 和 `writableObjectMode`，来控制读写模式。

`Socket` 就是一种典型的双工流。
