# 包（模块化）

## 1. 前言（why，what）

早期前端业务简单，将业务代码写在不同 JS 文件里面，然后手动维护加载顺序导入即可。以下是一个 **无模块化** 的工程代码示例：

```javascript
// multiply.js
console.log('加载了 multiply 模块');
var multiply = function (x, y) {
  return x * y;
};

// square.js
console.log('加载了 square 模块');
var square = function (num) {
  return multiply(num, num);
};

// main.js
console.log(square(3));

// 最终在同级目录 index.html 中导入如下代码
<script src="./multiply.js"></script>
<script src="./square.js"></script>
<script src="./main.js"></script>
```

以上无模块化代码存在两个缺点：

- `变量名污染`：变量/函数命名直接暴露在全局执行上下文中，存在命名冲突；
- `依赖顺序混乱`：手动维护文件加载顺序，难以确定文件间的依赖关系。

**模块化** 就是为了解决上述问题而提出的一个概念，其具备以下特点：

- `命名空间`：采用独立的作用域，模块内部数据是私有的，只是向外部暴露一些改内部数据的方法；
- `高内聚低耦合`：一个模块内部功能丰富且独立，尽量撇清与外部业务代码的关系；
- `高复用性`：模块按需加载，在不同环境下皆可复用。

## 2. AMD & CMD & CommonJS & ES6 Module（how）

了解问题的产生和模块化的特点后，接下来问题是： **如何实现模块化？**

观察模块化的特点，独立命名空间、高内聚低耦合...这不就是实现一个类吗？没错，一个类就是一个模块，但是原生 JS 并不支持类定义（虽然 ES6 支持了类，但是还不普及），问题就转变为了：**如何在 JS 中模拟类？**

::: details 模块化基石：IIFE 模式 {#IIFE}
**IIFE 模式（Immediately Invoked Function Expression）**

IIFE 即立即执行函数，在 JS 中除了 `全局作用域` 之外的独立作用域就是 `函数作用域`（当然 ES6 中又引入了用 let 创造 `块级作用域` ）。我们想创建一个独立的命名空间，只能先创建一个独立的函数作用域，然后又得保证其执行上下文不能被立即销毁。这不正符合 **闭包** 的特性吗？

以下是使用 IIFE + 闭包 来模拟一个类的例子：

```javascript
// moduleA.js
var moduleA = (function () {
  var count = 0; // 私有属性

  var getCount = function () {
    return count; // 闭包：内部count本应该在IIFE执行完毕就被销毁，因为getCount函数，内部count暂存在内存中
  };

  var addCount = function (x, y) {
    count++;
  };

  return {
    getCount: getCount,
    addCount: addCount,
  };
})();

// main.js
console.log(moduleA.count); // undefined，不能直接访问私有属性
console.log(moduleA.getCount()); // 0

// index.html
<script src="./moduleA.js"></script>
<script src="./main.js"></script>
```

通过 IIFE + 闭包实现了独立命名空间，单个模块间有自己的私有数据。那多个模块间如何相互通信呢？看下面这个例子：

```javascript
// moduleA.js
var moduleA = (function () {
  var multiply = function (x, y) {
    return x * y;
  };

  return {
    multiply: multiply,
  };
})();

// moduleB.js
var moduleB = (function (moduleA) {
  var square = function (num) {
    return multiply(num, num);
  };

  return {
    square: square,
  };
})(moduleA);

// main.js
console.log(moduleB.square(3));

// index.html
<script src="./moduleA.js"></script>
<script src="./moduleB.js"></script>
<script src="./main.js"></script>
```

通过这个例子我们发现，IIFE 只是通过闭包为每个模块创造了私有数据。依然存在以下问题：

- `模块名污染`：模块名挂载在全局作用域上，如果模块名重复，后者会覆盖前者；
- `依赖顺序混乱`：手动维护模块间加载顺序，难以明确模块间的依赖关系。

:::

IIFE 模式为实现模块化提供了一种很好的思路，但 **如何在创建私有属性的同时，更显式表达模块间的依赖关系？** 是 JS 模块化演变过程中重点关注的问题。由此，也产生了以下几种 **模块化规范**：

### 2.1 AMD & CMD

**AMD(Asynchronous Module Definition)** 和 **CMD(Common Module Definition)** 是早期浏览器端的两种模块化规范。前者是基于 `require.js` 库产出的模块化规范，后者是基于 `sea.js` 库产出的模块化规范（作者是玉伯）。

两者共同点都是通过实现原子的 `define` 和 `require` 约束 JS 模块的定义、导入、导出规范，不同点是他们的语法、模块加载机制不同。分别看下面两个例子：

```javascript{4-14,45-49,58,61-67}
/** require.js 示例*/

// add.js
// 定义、导出模块
define(function () {
  console.log('加载了 add 模块');
  var add = function (x, y) {
    return x + y;
  };

  return {
    add: add,
  };
});

// multiply.js
define(function () {
  console.log('加载了 multiply 模块');

  var multiply = function (x, y) {
    return x * y;
  };

  return { multiply: multiply };
});

// square.js
define(['./multiply'], function (multiplyModule) {
  console.log('加载了 square 模块');

  var square = function (num) {
    return multiplyModule.multiply(num, num);
  };

  return {
    square: square,
  };
});

// main.js
/**
 * @参数1 依赖模块路径
 * @参数2 模块导出内容
 */
// 导入模块
require(['./add', './square'], function (addModule, squareModule) {
  console.log(addModule.add(1, 1));
  console.log(squareModule.square(3));
});

// index.html
<html>
  <head>
    <title>require.js</title>
  </head>
  <body>
    <h1>Content</h1>
    <script data-main="vender/main" src="vender/require.js"></script>
  </body>
</html>;

// 输出结果，依赖前置：先加载所有模块，再执行代码
加载了 add 模块
加载了 multiply 模块
加载了 square 模块
2
9
```

```javascript{4-14,43-50,59,67-72}
/** sea.js 示例 */

// add.js
// 定义、导出模块
define(function (require, exports, module) {
  console.log('加载了 add 模块');
  var add = function (x, y) {
    return x + y;
  };

  module.exports = {
    add: add,
  };
});

// multiply.js
define(function (require, exports, module) {
  console.log('加载了 multiply 模块');

  var multiply = function (x, y) {
    return x * y;
  };

  module.exports = {
     multiply: multiply
  };
});

// square.js
define(function (require, exports, module) {
  console.log('加载了 square 模块');

  var square = function (num) {
    return multiplyModule.multiply(num, num);
  };

  module.exports = {
    square: square,
  };
});

// main.js
// 导入模块
define(function (require, exports, module) {
    var addModule = require('./add');
    console.log(addModule.add(1, 1));

    var squareModule = require('./square');
    console.log(squareModule.square(3));
});

// index.html
<html>
<head>
    <title>sea.js</title>
</head>
<body>
    <h1>Content</h1>
    <script src="vender/sea.js"></script>
    <script>
    // 在页面中加载主模块
    seajs.use("./vender/main");
    </script>
</body>
</html>

// 输出结果，依赖就近：按需加载模块，一边加载模块，一边执行代码
加载了 add 模块
2
加载了 square 模块
加载了 multiply 模块
9
```

AMD 和 CMD 分别在 `require.js` 和 `sea.js` 基础上定义了如何定义模块、如何导入模块、如何导出模块的代码书写规范，并自动分析依赖，将需要加载的模块正确加载。它们之间的区别在于模块的加载方式：

::: details 依赖前置 和 依赖就近

- `依赖前置`：require 时前置依赖必须写好，且是提前加载所有依赖模块，再执行代码；
- `依赖就近`：require 时前置依赖需要时再写，按需加载依赖模块，加载完再执行代码，代码和加载模块穿插执行。

:::

### 2.2 CommonJS

AMD&CMD 都是浏览器端的 JS 模块化规范，而在服务端（Node）的 JS 模块化规范，则普遍采用 CommonJS 规范。

```javascript{4-9,26-31,33-38}
/**CommonJS示例 */

// add.js
// 定义、导出模块
console.log('加载了 add 模块');
var add = function (x, y) {
  return x + y;
};
module.exports.add = add;

// multiply.js
console.log('加载了 multiply 模块');
var multiply = function (x, y) {
  return x * y;
};
module.exports.multiply = multiply;

// square.js
console.log('加载了 square 模块');
var square = function (num) {
  return multiplyModule.multiply(num, num);
};
module.exports.square = square;

// main.js
// 导入模块
var addModule = require('./add');
console.log(addModule.add(1, 1));

var squareModule = require('./square');
console.log(squareModule.square(3));

// 输出结果，依赖就近：按需加载模块，一边加载模块，一边执行代码
加载了 add 模块
2
加载了 square 模块
加载了 multiply 模块
9
```

可以发现和 sea.js 的示例代码相似，且模块加载方式都是 `依赖就近`。

### 2.3 ES6 Module

为了设计一种更通用的模块化规范，ECMAScript2015 推出了 ES6 Module 规范。其核心思想是模块解析静态化，在编译阶段就能确定模块间的依赖关系，而不用像 AMD&CMD、CommonJS 那样在运行时动态分析依赖。

```javascript{4-9,26-31,40,44-50}
/** ES6 Module 示例 */

// add.js
// 定义、导出模块
console.log('加载了 add 模块');
var add = function (x, y) {
  return x + y;
};
export { add };

// multiply.js
console.log('加载了 multiply 模块');
var multiply = function (x, y) {
  return x * y;
};
export { multiply };

// square.js
console.log('加载了 square 模块');
var square = function (num) {
  return multiplyModule.multiply(num, num);
};
export { square };

// main.js
// 导入模块
import { add } from './add';
console.log(add(1, 1));

import { square } from './square';
console.log(square(3));

// index.html
<html>
  <head>
    <title>ES6 Module</title>
  </head>
  <body>
    <h1>Content</h1>
    <script src="vender/main.js" type="module"></script>
  </body>
</html>;

// 输出结果，依赖前置：先加载所有模块，再执行代码
加载了 add 模块
加载了 multiply 模块
加载了 square 模块
2
9
```

::: details ES6 Module 和 CommonJS 的区别 {#es6&commonjs}

ES6 Module 是面向浏览器端和服务端的通用模块化规范，其与面向服务端的 CommonJS 规范有以下区别：

- 1. `模块的加载方式不同`: ES6 Module 是依赖前置，CommonJS 是依赖就近；（ES6 Module 由于考虑浏览器端模块资源需要从服务端获取，所以必须提前加载所有模块，再执行业务代码；而 CommonJS 由于考虑服务端编程，模块资源存储于本地磁盘中，加载速度较快，所以可以按需加载模块，和业务代码穿插执行；）
- 2. `模块的解析方式不同`：ES6 Module 是静态分析，CommonJS 是动态分析；（ES Module `import` 的是一个接口定义，JS 引擎在编译阶段可以通过接口定义，静态解析出模块间的依赖关系， 而 CommonJS `require` 的是一个对象 module.exports, 该对象只有等脚本运行完才会生成导出，只有在脚本运行时才能解析出模块间的依赖关系）
- 3. `模块的输出不同`：这点只针对基础类型数据，ES6 Module 输出的是基础类型值的引用，而 CommonJS 输出的是基础类型值的拷贝；

关于第 3 点，可以示例如下：

```javascript
/** ES6 Module 示例 */
// counter.js
export let counter = 3;
export function increment() {
  counter++;
}
// main.js
import { counter, increment } from './counter';
console.log(counter); // 3
increment();
console.log(counter); // 4 基本类型值引用
```

ES6 Module 采用值引用（有点像 Unix 文件系统的软链接），所以输出结果是 4。ES6 module 中模块是**单例**的，所有导入的地方都共享同一份模块实例。

```javascript
/** CommonJS 示例 */
// counter.js
var counter = 3;
function increment() {
  counter++;
}

module.exports = {
  counter: counter,
  increment: increment,
};
// main.js
var countModule = require('./counter');
console.log(countModule.counter); // 3
countModule.increment();
console.log(countModule.counter); // 3 // 基本类型值拷贝
```

CommonJS 采用值拷贝，所以输出结果依然是 3。但是对应引用类型的值，CommonJS 输出结果却不一样：

```javascript
/** CommonJS 引用类型示例 */
// counter.js
var counter = {
  value: 3,
};
function increment() {
  counter.value++;
}

module.exports = {
  counter: counter,
  increment: increment,
};
// main.js
var countModule = require('./counter');
console.log(countModule.counter.value); // 3
countModule.increment();
console.log(countModule.counter); // 4 // 引用类型值拷贝
```

引用类型 CommonJS 拷贝的是引用类型值的指针。

:::

### 2.4 总结

| 模块化规范 | 提出时间 | 加载规则 | 适用范围          |
| ---------- | -------- | -------- | ----------------- |
| AMD        | 2009     | 依赖前置 | 浏览器端          |
| CMD        | 2011     | 依赖就近 | 浏览器端          |
| CommonJS   | 2009     | 依赖就近 | 服务端（Node.js） |
| ES6 Module | 2015     | 依赖前置 | 浏览器端&服务端   |

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/前端模块化.drawio.png"/> </div>

前端模块化规范由最初的 IIFE 采用闭包生成命名空间、私有变量，到浏览器端的 AMD&CMD 的提出、服务端 CommonJS 的提出，再到 ES6 Module 统一的规范化，JS 模块逐渐形成一套通用的模块化规范（Node.js 也逐渐从 CommonJS 转向 ES6 Module ）。

#### 参考：

- [JavaScript 模块化入门 Ⅰ：理解模块](https://www.freecodecamp.org/chinese/news/javascript-modules-a-beginner-s-guide/)
- [前端模块化详解(完整版)](https://segmentfault.com/a/1190000017466120#item-2-2)
- [冴羽：ES6 系列之模块加载方案](https://github.com/mqyqingfeng/Blog/issues/108)
