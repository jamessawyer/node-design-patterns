## 区分迭代器（`iterators`）和可迭代对象（`iterables`）

在JavaScript中，迭代器（Iterators）和可迭代对象（Iterables）是两个密切相关但不同的概念。它们是ES6（ECMAScript 2015）引入的迭代协议的一部分，旨在提供一种统一的方式来遍历集合类型的对象，如数组、字符串、Map等。

### 可迭代对象（Iterables）

可迭代对象是那些具有`[Symbol.iterator]`方法的对象。这个方法返回一个迭代器。简单来说，任何对象，只要它定义了`[Symbol.iterator]`方法，就可以被视为可迭代对象。

- **特点**：
  - 可迭代对象必须有一个`[Symbol.iterator]`方法。
  - 这个方法返回一个迭代器。
  - 可迭代对象本身不定义遍历的顺序或元素，这是迭代器的工作。

### 迭代器（Iterators）

迭代器是一个对象，它记录了一个遍历过程中的当前位置，并提供了一种方法来访问集合的下一个元素。迭代器有两个方法：`next()`和可选的`return()`。

- **特点**：
  - 迭代器必须有一个`next()`方法，该方法返回一个对象，该对象具有两个属性：`value`和`done`。
    - `value`：当前元素的值。
    - `done`：一个布尔值，指示是否还有更多的元素可以遍历。如果为`true`，则迭代结束。
  - 迭代器可以有一个`return()`方法，当迭代器被提前终止时调用，例如在`for...of`循环中使用`break`语句。

### 区别

- **定义**：
  - **可迭代对象**：定义了一种方式来获取一个迭代器。
  - **迭代器**：定义了一种方式来遍历集合中的元素。

- **角色**：
  - **可迭代对象**：提供了一个入口点，通过`[Symbol.iterator]`方法获取迭代器。
  - **迭代器**：负责遍历集合并提供元素。

- **使用**：
  - **可迭代对象**：通常用于定义数据结构，如数组、字符串、自定义类等。
  - **迭代器**：通常用于定义遍历逻辑，特别是当遍历逻辑复杂或需要在遍历过程中维护状态时。

### 示例

```javascript
// 可迭代对象示例：数组
const array = [1, 2, 3];
for (const item of array) {
    console.log(item); // 输出 1, 2, 3
}

// 自定义可迭代对象
class MyIterable {
    *[Symbol.iterator]() {
        for (let i = 0; i < 5; i++) {
            yield i;
        }
    }
}

const myIterable = new MyIterable();
for (const item of myIterable) {
    console.log(item); // 输出 0, 1, 2, 3, 4
}

// 迭代器示例
const iterator = myIterable[Symbol.iterator]();
console.log(iterator.next().value); // 输出 0
console.log(iterator.next().value); // 输出 1
```

在这个示例中，数组和`MyIterable`类都是可迭代对象，因为它们都有`[Symbol.iterator]`方法。通过这些方法，我们可以获得一个迭代器，然后使用`next()`方法遍历元素。

**for ... of 语法 只能对可迭代对象进行循环，不能对生成器进行循环**
