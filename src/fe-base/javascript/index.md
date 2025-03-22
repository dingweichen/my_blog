# Javascript知识体系

## 变量

### 1. typeof

​	*typeof*  用于判断变量属于哪种数据类型，使用方式如下：

```javascript
typeof operand // operand是被判断的变量
```

​	*typeof*  可以判断出变量的基本类型：`number`、`string`、`boolean`、`undefined`、（ES6）`Symbol`、`bigint`，注意其中 `typeof null == object`（这个比较特殊）；以及引用类型 `object`, 注意其中 `typeof function(){} == function`。

```javascript
typeof 1; // "number"
typeof '1'; // "string"
typeof false; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "Symbol"
typeof 123n // 'bigint'

typeof null // 'object'

typeof {}; // "object" 
typeof []; // "object" 
typeof new Date(); // "object"
```

​为什么 *typeof null == object* 呢？  
​	这就涉及 *typeof* 的实现原理：不同的对象在底层都表示为二进制，**在 JS 中二进制低三位被用来存储其类型信息**。部分类型对应的二进制如下：

- `000`：对象
- `010`：浮点数
- `100`：字符串
- `110`：布尔
- `111`：整数

*typeof null == object* 因为null的二进制全为0，自然 *null* 被判定为 *object* 类型。

### 2. 深拷贝

**浅拷贝与深拷贝的区别**

​	在JS中，局部变量存储在栈中；而全局变量，被闭包引用的变量，引用类型的变量存储在堆中。存储在栈的变量特性是函数执行结束便被销毁，存储在堆的变量特性是整个JS执行文件结束才会被销毁。对于基本类型的变量，一般都会被存储在栈中；对于引用类型的变量，一般会被存储在堆中，而栈中存储的是引用类型的变量在堆中的地址。

- `浅拷贝`：只拷贝引用类型变量的第一层，如果第二层也是引用类型的变量，则不在堆中开辟新的空间，而只是复制其引用地址。
- `深拷贝`：拷贝引用类型变量的所有层，一旦碰到引用类型的变量，便会重新开辟空间，创建新的引用地址，并将对应值复制进去。

```javascript
// 浅拷贝函数
function shallowClone(obj) {
    const newObj = {};
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}


let obj1 = {
    arr: [1, 2, 3]
}

// 浅拷贝
let shallowObj = shallowClone(obj1);
shallowObj.arr[0] = 100;
console.log(obj1.arr[0]); // 100
// 深拷贝
let deepObj = JSON.parse(JSON.stringify(obj1));
deepObj.arr[0] = 200;
console.log(obj1.arr[0]); // 100
```

​	上面的示例中，浅拷贝复制的对象  *shallowObj*  只复制了第一层，导致修改 *shallowObj.arr\[0]* 会影响*obj1.arr\[0]*，而深拷贝复制的对象 *deepObj* 为 *arr* 数组重新在堆中开辟了空间，复制了第二层，所以修改 *deepObj.arr\[0]* 不会影响 *obj1.arr\[0]* 。

**深拷贝的实现方式**

1. 手写递归

```javascript
// 深拷贝函数
function deepClone(obj) {
    // 普通类型
    if(typeof obj !== 'object' || obj == null) return obj; 
    // 引用类型：数组 or 对象
    const newObj = obj instanceof Array ? [] : {};
    // 遍历属性
    for (let prop in obj) {
       // 这里 for...in...语句中的prop包含obj原型链上的属性，用hasOwnProperty排除原型链上的属性
        if (obj.hasOwnProperty(prop)) {
            // 重点：递归
            newObj[prop] = deepClone(obj[prop]);
        }
    }
    return newObj;
}
```

2. *JSON.stringfy()*

- `Json.stringfy`：将一个对象转换为JSON格式字串。
- `Json.pares()`：将一个JSON格式字串转化为一个对象。

所以通过以上两个函数，可以实现对象的深拷贝：

```javascript
const deepObj = JSON.parse(JSON.stringify(obj));
```

但是这种方式存在弊端，会忽略undefined、symbol和函数：

```javascript
const obj = {
    name: 'A',
    name1: undefined,
    name3: function() {},
    name4: Symbol('A')
}
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}
```

3. lodash库函数 *\_.cloneDeep()*

​	使用node中的一个名为 *lodash* 的包实现，*lodash* 是一个著名的 *JavaScript* 库，封装了许多快捷的 JS 方法。

```javascript
const _ = require('lodash');
const obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
const obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```

### 3. 暂时性死区( ES6 )

​   用 *var* 声明的变量，在执行声明语句之前会在内存中开辟一个空间并赋予一个 *undefined* 的默认值，使得其在声明语句之前也能被访问到且值为 *undefined*；而用 *let* 声明的变量，在执行声明语句之前会开辟一个内存空间，但这个内存空间不能被访问，只有在声明语句执行后才能通过变量名访问到。这个禁止访问的内存被称为 **暂时性死区**。

```javascript
console.log(a); // undefined
var a = 2;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;
```

​&emsp;更进一步地说：一个变量的使用可以分为三个阶段：*create* (分配内存)，*init* (初始化)，*modify*（修改值）。

*var* 做的工作：变量提升，*create* 为其分配一个内存空间后，*init* 初始化值为 undefined，所以其能被访问到，因为它有初始值。等到执行声明语句再 *modify*。

*let* 做的工作：只*create*为其分配一个内存空间，之后不能被访问，等到执行声明语句再 *init* 初始化值，所以它在执行完声明语句之后才能被访问到。

### 4. 垃圾回收机制

&emsp;JS的变量存储在栈和堆中。栈内存都是由操作系统自动分配和释放回收的，而堆内存所存大小不固定，系统无法自动释放回收，所以需要 **JS引擎管理并释放这些堆内存**。GC (Garbage Collection)垃圾回收会每隔一段固定时间执行一次，常见的内存回收机制有两种：

- `引用计数`：计算对象被引用的次数，一旦引用为0则进行回收。但如果对象之间互相引用，引用计数无法对它们进行回收。
- `标记清除`：对象首次被引用时会带有一个标记，一旦对象没有被引用标记会被清除，没有被标记的对象会被回收。

关于`标记清除`有一个很重要的概念叫做对象的**可达性**：

&emsp;从根对象（浏览器为window或node环境为global）的指针开始，递归遍历所有子节点（属性），如果子节点被搜索到了，说明该子节点可以通过引用访问，即可达。可达的子节点会被标记，不可达的子节点没有标记，没有标记的子节点会被垃圾回收。

**V8引擎-垃圾回收机制**

V8引擎将堆内存分为两个区域，也采用两个垃圾回收器进行内存管理：

- `新生代`：存活周期很短的对象，一般只经历过一、两次GC扫描。`1~8M`容量。采用 `副垃圾回收器`。
- `老生代`：存活周期长的对象，经历过两次以上GC扫描，还存活在内存中。容量很大。采用 `主垃圾回收器`。

**新生代**

&emsp;JS中任何被初始化的对象，首先会被放置在新生代区域中。新生代使用`Scavenge算法` 进行垃圾回收，因为新生代总的数据量不大，则垃圾回收算法的特点必须是快速有效。

&emsp;Scavange算法将新生代堆分为`from-space` 和`to-space` 两个部分，from-space表示使用中，to-space表示空闲中。Scavange算法步骤如下：

- 标记阶段：标记from-space中的可达对象，不可达对象不进行标记；
- 复制from-space的可达对象移至to-space中，并在to-space中对其排序避免产生内存碎片；
- 清除阶段：将from-space中的对象清除；
- 将from-sapce和to-space角色进行交换。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_b19TsGkckU.png"/> </div>


如果一个对象在新生代中经历了两次Scavange算法扫描后还存活，那么它就会被放入老生代中。这一过程被称之为**晋升**。

**老生代**

&emsp;老生代不适合使用Scavange算法进行垃圾回收，因为Scavange算法本质上是一种复制算法，采用空间换时间的策略，而老生代存储的对象数量较多且存活率较高，不适合对它们都进行复制。所以老生代采用了 `标记清除`和 `标记整理`算法。

::: info 标记清除法
::: 

&emsp;标记清除算法分为两个阶段：标记阶段和清除阶段。Scavange算法也有标记阶段和清除阶段，但Scavange算法需要复制后再清除，而这里则不需要。标记清除算法步骤如下：

- 标记阶段：对老生代对象进行第一次扫描，将可达对象进行标记
- 清除阶段：对老生代对象进行第二次扫描，将未标记对象进行清除

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_xdEm4XYBMx.png"/> </div>

但是普通的标记清除算法会产生很多内存碎片，导致内存的可用性受到限制。

::: info 标记整理算法
:::

&emsp;零零散散的内存碎片会降低内存的可用性。如果此时进来一个大对象，需要为此对象分配一个大内存，先是从零零散散的内存碎片中找位置，找了一圈发现没有适合自己大小的位置，只好将大对象放置在最后。这个寻找空位的过程是很消耗性能的。

&emsp;标记整理算法对标记清除算法进行了改进，在标记清除的基础上，增加了`整理阶段`，每次清理完非可达对象，就把剩下的活动对象整理到内存一侧。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_fUI2j0R3Am.png"/> </div>

**全停顿**

&emsp;由于JS代码执行需要JS引擎解析，JS垃圾回收也需要JS引擎调度，两者之间会相互阻塞，如果发生冲突 `垃圾回收会优先于JS代码执行`，JS引擎会先停止JS代码的执行，等垃圾回收完毕，再执行JS代码。这个JS代码执行被阻塞，等待垃圾回收执行完毕的过程被称之为 `全停顿`。

&emsp;新生代容量较小，且采用快速的Scavenge算法，所以副垃圾回收器产生的停顿时间较短；而老生代容量较大，停顿时间较长，会使得页面出现卡顿现象。

::: info 增量标记和惰性清理
:::
&emsp;前面说过，老生代的垃圾回收机制包括 标记阶段 和 清除阶段。

&emsp;`增量标记`则对标记阶段进行优化。当对象少量时不会启动增量标记优化，采用一次性标记策略；当对象较多时，启动增量标记，`标记过程和JS代码执行过程交替进行`，从而防止页面长时间卡顿。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_86-MyiH6gY.png"/> </div>

&emsp;`惰性清理`则对清除阶段进行优化。在增量标记后，主垃圾回收器发现要清理的对象较少，就算不进行清理，剩余内存空间也足够让JS代码跑起来，所以就延迟清理，让JS代码先执行。等到垃圾对象变多时，就进行清理。

&emsp;这种类似于时间分片的优化思想，改善了全停顿现象。但增量标记存在一些问题，就是标记和JS代码交替运行，有可能会造成对象引用改变，标记错误的现象。比如：主垃圾回收器前脚刚标记对象a为活动对象，后脚就执行JS代码 a=null 将对象设置为非可达对象，但后面的标记阶段再也不会重复扫描a对象，发现其已经没有引用了。这种现象需要使用 `写屏障`技术进行改善。

参考：

[ 13张图！20分钟！认识V8垃圾回收机制](https://www.51cto.com/article/783667.html)

## 原型

### 1. instanceof

​	*typeof* 只能识别某个变量是否为 *object*  类型，但不能识别该对象属于哪个类。 *instanceof*  用于判断一个对象是否为某一个构造函数的实例，或者说一个对象是否是某一个类的实例对象。使用方式如下：

```javascript
object instanceof constructor // object为一个对象 constructor为一个构造函数
```

看一个例子：

```javascript
function Father() {
    this.name = 'father';
}

function Son() {
    this.name = 'Son';
}

// 构造继承关系
Son.prototype.__proto__ = Father.prototype;

let people1 = new Son();
let people2 = new Father();

console.log(people1 instanceof Father); // true
console.log(people2 instanceof Son); // false
```

&emsp;这个例子构造了一个原型链 `Son.prototype -> Father.prototype -> Object.prototype -> null   ` 。其中，*people1* 为 *Son* 类的实例，所以第一行输出为 *true*，*people2* 为 *Father* 类的实例，所以第二行输出为 *false*。原型链只能由当前原型向上查找，而不能向下查找。对于 *people1*， 其原型为 *Son.prototype* , 从当前原型沿着原型链向上查找，能找到 *Father.prototype*，所以结果为 *true* 。

​	根据上面的思路，我们能手写一个 *instanceof*：

```javascript
function myInstanceof(object, constructor) {
    let o = object.__proto__,
        c = constructor.prototype;
    // 从o开始遍历其原型链
    while (o) {
        if (o == c) return true; // 原型链上有c，说明object是constructor的实例
        o = o.__proto__;
    }
    // 遍历到原型链的头(null)，也没找到c
    return false;
}
```

> `typeof`  和 `instanceof` 都是判断数据类型的操作符，区别如下：

- `typeof` 会返回一个变量的基本类型以字符串的形式表示，`instanceof` 返回的是一个布尔值。
- `typeof` 可以判断变量是否为基础数据类型，但是对于引用类型，只能判断 *function* 类型，其他无法判断。
- `instanceof` 可以判断复杂的引用数据类型，但是不能正确判断基础数据类型。

> &#x20;`Object.prototype.toString.call()`方法可以兼容 `typeof` 和 `instanceof`，但它无法识别一个对象是否是用户自定义的构造函数的实例。
> &#x20;  原型Objec.prototype上的toString方法，通过访问调用该方法的this内部的\[\[class]]类属性，获得该对象对应的类型。\[\[class]]类属性是每个对象的内置属性，记录了该对象的类型，null和undefined内部也有内置的\[\[class]]属性，而对于基本数据类型，则通过包装类转换为包装对象获取其内置的\[\[class]]属性。
>
> [ Object.prototype.toString判断类型的原理 - 掘金](https://juejin.cn/post/7009659922342215688 " Object.prototype.toString判断类型的原理 - 掘金 项目中，我们经常会直接使用Object.prototype.toString用来做类型判断。他基本是几种方法里可以开箱即用、且判断类型最完善了。 现在我们来扒皮一下他。 具体原理…… https://juejin.cn/post/7009659922342215688")

### 2. 对象的创建

**对象的创建方式**

1. 字面量

```javascript
let p1 = {
    name: 'ding'
};
```

2. *new* 关键字

```javascript
function Person(name) {
    this.name = name;
}
let p1 = new Person('ding');
```

`new` 关键字的执行流程：

- 创建一个空对象，并使得空对象的 ` __proto__`  指向构造函数的原型
- 使得构造函数的this指向上一步创建的空对象
- 执行构造函数的代码，为新对象添加属性和方法
- 返回创建的新对象（如果构造函数 *return* 了一个对象，则返回这个对象）。

将以上四个步骤写成代码如下：

```javascript
// 1. 创建一个新对象，将新对象原型指向构造函数原型
let temp = new Object();
temp.__proto__ = Person.prototype;
// 2. 将构造函数的this指向新对象 3.执行构造函数内代码为新对象赋予属性
let result = Person.call(temp, 'ding');
// 4. 返回创建好的新对象(temp), 除非构造函数有return语句且返回的是另一个对象
let p1 = typeof result == 'object' ? result : temp;
```

> `字面量{}` 与`new`的不同：

- 字面量是立即执行的，其执行速度比 new 更快。
- 使用字面量创建对象只是创建一个对象实例，且其原型永远都是 *Object.prototype*；而构造函数可以用来创建多个具有相同属性的对象，其原型是该构造函数的 *prototype*。

3. *Object.create()*

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.name = '1';

let p1 = Object.create(Person.prototype, {
    'name': {
        value: 'test',
    }
});
```

`Object.create()`也是创建对象，不过它能指定对象的原型并且为对象设置特定属性，它有两个形参：

- `proto`：必填参数，新创建对象的原型对象。
- `propertiesObject`：可选参数，指定要添加到新对象上的可枚举（可以被`hasOwnProperty()`获取到）的属性。

> 另外，`object.create(null)` 可以创建一个没有原型的对象。

### 3. 原型及原型链

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/原型1_qfJ8Ni55LE.jpg"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/原型2_pe3WtlGbG5.jpg"/> </div>

### 4. class ( ES6 )

**基本使用**

```javascript
// 定义类
class People {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHi() {
        console.log(`姓名：${this.name} 学号：${this.age}`);
    }
}

// 实例化对象
let p1 = new People('ding', 20);
p1.sayHi();
```

**继承**

```javascript
// 定义类
class People {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHi() {
        console.log(`姓名：${this.name} 学号：${this.age}`);
    }
}

class Student extends People {
    constructor(name, age, studentId) {
        // 调用父类构造函数
        super(name, age);
        // 初始化自定义属性
        this.studentId = studentId;
    }
    sayId() {
        console.log(`学号：${this.studentId}`);
    }
}

// 实例化对象
let p2 = new Student('ding', 20, 'SZ2016001');
p2.sayHi();
p2.sayId();
```

:::details class继承的原理
&emsp;extends实际上做了两件事情，（1）构造原型链：son.prototype.\_\_proto\_\_ = faher.prototype；（2）初始化父类属性：father.call(this,...arguments)。ES6中的class将类的所有方法设置在构造函数的prototype上。这种实现方式思想实际上就是寄生组合式继承。
:::

## 作用域

​	在理解  `作用域`  与 `执行上下文` 之前，首先得了解JS解析引擎执行代码时做了哪些工作及它们的执行顺序。JS的执行分为：**解释** 和 **执行** 两个阶段。

**解释阶段：**

- 词法分析
- 语法分析
- 作用域规则确定，主要创建作用域链（静态作用域）

**执行阶段：**

- 创建执行上下文
- 在执行上下文中执行代码
- 垃圾回收

​	通过观察上面的过程我们可以发现，**作用域链其实是在执行函数之前已经确定的，同时可以预先告知：作用域链的产生与函数定义的位置有关，而与函数在代码中执行的位置无关。**

### 1. 执行上下文

执行上下文是当前代码的执行环境，JS中执行上下文可 以划分为三类：

- `全局执行上下文`：所有执行上下文的最底层，在浏览器中全局对象是window，全局执行上下文的this指向window，全局执行上下文只有一个。
- `函数执行上下文`：大部分执行上下文都是函数执行上下文，其包含函数执行过程中所需要用到的所有数据资源，在函数被调用时创建，函数执行上下文有无数个。
- eval执行上下文：知道即可，很少用。

​	执行上下文只有以上三类，只需关注  **全局执行上下文**  和  **函数执行上下文** 即可，我们大部分讨论的还是函数执行上下文。一个执行上下文由三部分组成：

- `变量对象（Variable Object，OA）`：每个执行上下文都有一个与之关联的变量对象，执行上下文中所有定义的变量和函数都会保存在这个对象中。*这里有一个知识点是 ****变量提升与函数提升****。*
- `作用域链`：每个执行上下文都有一个作用域，其约定了当前执行环境中可以直接获取的变量和函数（存储于变量对象中）。如果要获取其他执行上下文中作用域中的变量，就需要定义一个规则，而JS采用的是链式规则。 *链的产生与函数定义的位置有关， 这里有一个知识点是 ****静态作用域****。*
- `this`：作用域链约定了如何访问其他执行环境的变量对象中声明的变量，而 this 又为当前的执行上下文开辟了另一个可以访问的空间（对象）。通过 this ，当前执行环境可以访问这个对象所具备的属性和方法。*注意，这里需要与某个作用域中声明的变量区分开，this指向的是某个对象的属性和方法，必须加上 **`this.`** 前缀访问属性和方法。*

​一个执行上下文的创建包含三个过程：`创建变量对象`、`创建作用域链` 和  `确定this指向`。

#### 1.1 变量对象

创建执行上下文，首先创建其变量对象，举一个例子来解释变量对象：

```javascript
function getName(name) {
    var b = 2;
    function foo() {};
    var bar = function() {};

}
getName('lucystar')
```

函数getName的执行上下文的变量对象为：

```javascript
AO = {
    arguments: {
        0: 'lucystar',
        length: 1
    },
    name: 'lucystar',
    b: undefined,
    bar: undefined
    foo: reference to function foo(){},
}
```

其中  `arguments` 是一个伪数组对象，其存储了函数调用时传递的实参。而  *b、bar*  则是被提前声明的对象，它们没有具体值。*foo* 是被提前声明的函数，它有具体的指向。

::: details  变量提升和函数提升


**提升**  
所谓提升，即是函数中的变量和函数在没有被具体赋值前，在作用域（变量对象）被初始化时进行声明。即知道有这么些变量名称，但不赋值（这里值实际上是undefined），等执行上下文被创建完毕后，函数代码被执行才会具体赋值。


​**函数提升**  
`函数提升`和`变量提升`又有所不同：在进入执行上下文时，JS引擎 **首先会处理函数声明，再处理变量声明** 。如果存在完全相同的函数名称，则后者会把前者覆盖；如果存在完全相同的变量名称，则后者对前者没有影响：

```javascript
// 存在相同的函数名进行提升，后者覆盖前者
foo(); // b 

function foo() {
    console.log('a');
}

function foo() {
    console.log('b');
}
// 存在相同的函数名和变量名提升，变量提升无法覆盖函数提升
console.log(foo); // function (){...}

function foo() {
    console.log("foo");
}

var foo = 1;
// 变量提升：b重名，不能进行覆盖，b为实参传入的5
function foo(b) {
    console.log(b); // 5
    var b = 10;
}

foo(5);
```
:::

#### 1.2 作用域链

​	接着，创建执行上下文的作用域链，作用域链其实在创建执行上下文之前的代码解释阶段已经确定，这里只是将其记录在执行上下文中。

::: details 作用域
**作用域**

作用域是根据变量名称查找变量值圈定的一个范围，作用域链是将各个作用域连结形成链路，链式查找变量名对应的变量值。作用域大致可以分类两类：

- `全局作用域`：全局执行上下文拥有的作用域（变量对象）即是全局作用域，覆盖范围最大。
- `函数作用域`：函数执行上下文拥有的作用域（变量对象）即是函数作用域，覆盖范围中等。

> ​以上是ES5语法规定的基本作用域，在ES6中通过 **let** 可以创建一种新的作用域：

- `块级作用域`：代码块  **{...}**  形成的一个单独的作用域，即是块级作用域，覆盖范围最小。

Tips: 如果箭头函数包裹在块级作用域中，因为块级作用域没有this，需要再向上寻找函数作用域，箭头函数的this等于该函数的this。
:::

::: details 静态作用域链、动态作用域链

​执行上下文的作用域之间的关系类似于一张链表，表头节点即是全局作用域，其他子节点由函数作用域、块级作用域组成。作用域链根据生成规则不同分为静态作用域链和动态作用域链：
- `静态作用域（词法作用域）`：代码编译阶段（解释阶段）确定，作用域间的链式关系由代码 **书写时** 位置的前后关系所决定；
- `动态作用域`：代码执行阶段确定，作用域间的链式关系由代码 **执行时** 位置的前后关系所决定；

静态作用域代表语言有 C、JAVA、JavaScript、Python、PHP 等，动态作用域代表语言有 Bash 等。
:::

​	下面这段代码，在还没执行之前有三个作用域：全局作用域  `globalContext.VO`、*foo* 的函数作用域`foo.AO`、*bar* 的函数作用域 `bar.AO`。虽然  *foo( )*  在 *bar( )* 中执行，但在执行之前它们的作用域链已经形成，即有两条作用域链：`globalContext.VO -> foo.AO`  和 `globalContext.VO -> bar.AO`。

```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo(); // 1 
}

bar(); // 结果是 1
```

所以 *foo* 和 *bar* 的执行上下文分别表示为：

```css
// foo的执行上下文
fooContext = {
    AO: {
        arguments: {
            length: 0
        },
    },
    Scope: [foo.AO, globalContext.VO],
    this: window
}
// bar的执行上下文
barContext = {
    AO: {
        arguments: {
            length: 0
        },
        foo: reference to function foo(){},
        value: undefined,
  },
    Scope: [bar.AO, globalContext.VO],
    this: window
}
```

​	其中 `Scope` 表示变量对象的作用域链，如果上述是一段Bash代码放在 shell 环境下执行，则 shell 遵从 **动态作用域** 规则。上面代码输出结果为2，且只有一条作用域链：`globalContext.VO -> bar.AO -> foo.AO`。

#### 1.3 this

​	最后，确定执行上下文中this的指向。函数执行上下文中 *this* 的指向，由函数的直接调用位置所决定，具体有下面四条规则：

- `由 new 调用`：*this* 指向新创建的对象。
- `由普通对象调用`：*this* 指向调用该函数的普通对象。
- `由 call、apply、bind 调用`：*this* 指向实参指定的对象。
- `默认调用`：*this* 指向全局对象 *window*，如果函数定义处代码启动了严格模式，则 *this* 指向 *undefined*。

具体看一下代码示例：

```javascript
// 1. 由new调用，构造函数的this指向构造的对象obj
function test() {　
    this.x = 1;
    console.log(this.x);
}

var x = 2;
var obj = new test(); // 1 

// 2. 由普通对象调用，这里普通对象是obj，test函数this指向普通对象obj
var x = 2;
var obj = {
    x: 1,
    test: function() {
        console.log(this.x);
    }
}
obj.test(); // 1

// 3. 由apply调用，这里通过apply方法将obj.test()中的this指向从obj改为指向window
var x = 2;
var obj = {
    x: 1,
    test: function() {
        console.log(this.x);
    }
}
obj.test.apply(window); // 2

// 4. 默认调用，最常见的调用形式没有前缀，默认指向window
var x = 1;
function test() {
    console.log(this.x);
}

test(); // 1
```

​	以上是 *ES5* 的 *this* 指向规则，但在 *ES6* 中新增了一种 **箭头函数**  `()=>{}` 它的 *this* 不遵循以上四条规则。

​	箭头函数的 *this* 根据当前的静态作用域来决定，具体说，箭头函数会继承在它编写位置（不是执行时所处的位置）从外层查找，直到找到具有作用域的执行上下文的 *this*。

```javascript
var x = 2;
var obj = {
    x: 1,
    test: function() {
        (() => {
            console.log(this.x);
        })();
    }
}

obj.test(); // 1

var f = obj.test;
f(); // 2

// 根据词法作用域的规则，箭头函数最近的具有this的执行上下文，是test()函数的执行上下文。所以箭头函数的this与test()的this相同。第一次调用，由obj调用，这时test()函数的this指向obj，箭头函数this也指向obj，输出结果为1。第二次调用，属于默认调用，这时test()函数的this指向window，箭头函数this也指向window，输出结果为2。
```

::: details 改变this指向apply, call, bind

​	`apply`、`call`、`bind` 都是任意函数的构造函数  `Function()` 的原型 `Function.prototype` 的内置方法，它们的作用都是改变某个函数运行时的执行上下文（context）中的 *this* 指向。

1. *apply* 和 *call*

​	`apply` 和 `call` 从本质上说实现的是同一种功能，它们的共同点是调用后会立即执行函数，不同点是**apply用数组传递参数** 而 **call用参数列表传递参数**。以下代码为例：

```javascript
function add(y, z) {
    return this.a + y + z;
}

var a = 1;
var obj = {
    a: 100,
};

add(2, 3); // this = Window, this.a=1
add.apply(obj, [2, 3]); // this = obj, this.a=100 数组传参
add.call(obj, 2, 3); // this = obj, this.a=100 列表传参
```

**手写call**

```javascript
Function.prototype.myApply = function(context, ...args) {
    // this指向的是调用myApply的函数本身
    if (!context) {
        // 参数为null
        return this(...args);
    } else {
        // 参数为某个对象
        context.fn = this;
        let result = context.fn(...args);
        delete context.fn;
        return result;
    }
}
```

**手写apply**

```javascript
// apply和call原理相同，只是传参形式不一样
Function.prototype.myCall = function(context, args) {
    // this指向的是调用myApply的函数本身
    if (!context) {
        // 参数为null
        return this(...args);
    } else {
        // 参数为某个对象
        context.fn = this;
        let result = context.fn(...args);
        delete context.fn;
        return result;
    }
}
```

2. bind

​	`bind` 与 *apply* 和 *call* 的区别是它不是立即执行而是 **延迟执行** 的，*bind* 返回的是一个函数而不是函数的执行结果：

```javascript
 add.bind(obj, 2, 3)(); // this = obj, this.a=100
```

​         *bind* 的本质实际上是封装 *apply* 实现的，我们可以自己手写一个 *bind* 函数：

**手写bind**

```javascript
Function.prototype.MyBind = function(context, ...args) {
    let fn = this;
    return function() {
        return fn.apply(context, args);
    }
}
```
:::

### 2. 执行上下文栈（调用栈）

&emsp;在理解了什么是执行上下文之后，我们知道执行上下文即是执行 JS 代码所需要的环境。相应的，根据执行上下文的分类，可执行代码也可分为：`全局代码`、`函数代码`、`eval代码`。JS 按照代码分类进行分段，以代码段为单位执行代码。

​&emsp;执行上下文用栈结构存储。在执行一个代码段前，JS 引擎会初始化执行这个代码段所需的执行上下文，而后将执行上下文压入栈；在执行上下文中执行对应代码段；执行完毕后，将执行上下文弹出栈，进行垃圾回收。这个被维护的执行上下文栈也称为 **调用栈**。

```javascript
// 示例1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// 示例2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

分析以上两段代码调用栈的状态变化：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20220718_171727_SIlugUZZDp.jpg"/> </div>

> 为什么基本数据类型存储在栈中，引用数据类型存储在堆中？  
> ​&emsp;JavaScript引擎需要用栈来维护程序执行期间的执行上下文的状态，如果数据都存放在栈空间里面，会导致栈空间过大。栈空间一旦过大，会影响到执行上下文切换的效率，进而影响整个程序的执行效率。

参考资料：

[深入理解JavaScript执行上下文](https://segmentfault.com/a/1190000023216555 "深入理解JavaScript执行上下文")

### 3. 闭包

​	了解了执行上下文及作用域的概念后，闭包就很容易理解了。**闭包是指有权访问另一个函数作用域中变量的函数**，创建闭包最常见的方式就是，在一个函数内部创建另一个函数，并将这个函数作为返回值。

​	**闭包 = 函数 + 函数能够访问的自由变量**。

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo(); // local scope
```

上面的 foo() 函数实际上就是一个闭包，<strong>闭包 = *f( )* 函数本身 + *checkscope* 作用域中的自由变量 *scope* </strong>。 作用域链 为`globalContext.VO -> checkscope.AO -> foo.AO `。

分析这示例的执行过程：

- 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
- 全局执行上下文初始化
- 进入 checkscope 函数，创建 *checkscope* 函数执行上下文，*checkscope* 函数执行上下文被压入执行上下文栈
- *checkscope* 执行上下文初始化，创建变量对象、作用域链、this等
- *checkscope* 函数执行完毕，*checkscope* 函数执行上下文从执行上下文栈中弹出。<strong>（由于 *checkscope* 函数的内部变量被 *foo* 函数引用，虽然它的执行上下文被弹出调用栈，但是它存储内部变量的变量对象不会被销毁，而是存储在堆中。）</strong>
- 进入 *foo* 函数，创建 *foo* 函数执行上下文，f 函数执行上下文被压入执行上下文栈
- *foo*  函数执行上下文初始化，创建变量对象、作用域链、this等
- *foo* 函数执行完毕，f 函数上下文从执行上下文栈中弹出

&#x20;     通过观察执行过程，我们发现当  *foo* 函数执行的时候，*checkscope* 函数的执行上下文已经被销毁（即从执行上下文栈中被弹出）， 怎么还会读取到  *checkscope* 变量对象（作用域）内的scope值呢？

```javascript
fooContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```

​	因为作用域链， *foo* 函数依然可以读取到  *checkscopeContext*.AO 的值，说明当  *foo* 函数引用了 *checkscopeContext*.AO （变量对象）中的值的时候，即使 *checkscope* 的执行上下文 *checkscopeContext* 被销毁了，但是 JS 依然会让  *checkscopeContext*.AO 存活在内存中，*foo* 函数依然可以通过其变量对象内的作用域链找到它，正是因为 JS 做到了这一点，从而实现了闭包这个概念。

参考资料：

[冴羽blog深入系列](https://github.com/mqyqingfeng/Blog "冴羽blog深入系列")

[深入理解JavaScript闭包之什么是闭包](https://segmentfault.com/a/1190000023356598 "深入理解JavaScript闭包之什么是闭包")

## 异步

### 1. JS 的单线程

​	JavaScript是一门单线程的语言，为什么JS无法实现多线程呢？这是由于JS是用来处理用户与前端页面交互的脚本语言，举个例子：

:::info 场景描述
假设现在有两个线程,process1和process2,由于是多线程的 JS ,所以它们对同一个DOM同时进行操作 
process1删除了该DOM,而process2编辑了该DOM,同时下达了两个矛盾的命令,浏览器到底该如何执行呢?
这样想,JS 为什么会被设计成单线程应该容易理解了吧。
:::

由于单线程，JS只能在主线程上一行一行执行代码，执行完当前代码才能执行下一行代码，这叫做**同步**。

:::info 场景描述
如果 JS 中不存在异步,代码只能自上而下的执行,这个时候,假如上一行代码的解析时间过长,那么下一行代码就会被阻塞,而对于用户而言,阻塞就意味着"卡死",这样就导致了很差的用户体验。所以,JS中需要异步执行。
:::

为了实现异步执行，JS采用了**事件循环机制（event loop）**，什么是事件循环机制？

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220507151729579_tABcXDX3hX.png"/> </div>

如上图：

- \<script> 中代码被放入**调用栈（Call Stack）** 中一行一行被执行，如果遇见异步操作，就会将异步任务放入event table  (事件队列) 中注册函数；
- event table (事件队列) 中的注册函数一旦被触发，就会将异步任务放入**异步任务队列（Task Queue）** 中；
- 等到主线程中的代码执行完毕后，调用栈为空，**Event Loop** 开始工作，它轮询查找异步任务队列中的任务，将队首任务放入调用栈中执行。
- 调用栈中代码执行完毕，Event Loop会继续轮询异步任务队列中的任务，将队首任务放入调用栈中执行。直到所有任务执行完毕。

实际上JS引擎将异步任务分为**宏任务(macroTask)** 和 **微任务(microTask)**。

宏任务有：

:::info 宏任务
script(整体代码)  
setTimeout  
setInterval  
I/O  
UI交互事件  
postMessage  
MessageChannel  
setImmediate(Node.js 环境)
:::

微任务有：

:::info 微任务
Promise.then  
Object.observe  
MutationObserver  
process.nextTick(Node.js 环境)
:::

每次放在 *调用栈* 中所有等待执行的代码就是一个 *宏任务*，而 *微任务* 则在每个 *宏任务* 之间被执行。在**Event Loop下一次轮询之前**（即 下一个 *宏任务*  被放入 *调用栈* 中执行之前），JS都会执行完当前累积的所有 *微任务* ，并重新渲染 DOM。结合 *宏任务* 和 *微任务*，JS的执行机制可以描述为：

**当前宏任务执行完毕 ->  执行微任务队列中所有微任务 -> 重新渲染页面  -> 执行下一个宏任务**

- < script >中代码放入调用栈，表示开启一个宏任务。遇见异步操作，将其放入 *Event Table*中等待其触发，放入 **宏任务队列（Task Queue）** 中 ，遇见微任务，将其放入**微任务队列（Microtask Queue ）** 中。
- 调用栈为空，当前 < script> 代码执行完毕，当前宏任务执行完毕。执行 微任务队列 中包含的所有微任务。
- 重新渲染页面。
- Event Loop 启动，从 宏任务队列 中将下一个宏任务放入调用栈中执行。

以下两个例子帮助理解：

**Example 1**

```javascript
setTimeout(() => console.log('代码开始执行'),0)

new Promise((resolve,reject) => {
  console.log('开始for循环');
  for(let i=0;i<10000;i++){
    i == 99 && resolve()
  }
}).then(() => console.log('执行then函数'))

console.log('代码执行结束');
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220507153112243_rhpWnR43C6.png"/> </div>

**Example 2**

```javascript
<!-- 脚本 1 -->
<script>
    // 同步
    console.log('start1')
    // 异步宏
    setTimeout(() => console.log('timer1'), 0)
    new Promise((resolve, reject) => {
        // 同步
        console.log('p1')
        resolve()
    }).then(() => {
        // 异步微
        console.log('then1')
    })
    // 同步
    console.log('end1')
</script>

<!-- 脚本 2 -->
<script>
    // 同步
    console.log('start2')
    // 异步宏
    setTimeout(() => console.log('timer2'), 0)
    new Promise((resolve, reject) => {
        // 同步
        console.log('p2')
        resolve()
     }).then(() => {
        // 异步微
        console.log('then2')
     })
  // 同步
    console.log('end2')
</script>
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220507153201461_BIeyiy5qQo.png"/> </div>

参考资料：

[JS引擎的解析](https://www.jianshu.com/p/9dd4427f540e "JS引擎的解析")

[宏任务和微任务](https://zhuanlan.zhihu.com/p/78113300 "宏任务和微任务")

### 2. Promise ( ES6 )

**1. 问题来源——回调地狱**

​	JS的异步应用场景有：*定时器*，*网络I/O*，*事件监听*... 等等，JS 实现异步的方式是 **回调函数**，一旦轮到异步操作被引擎执行，其所对应的回调函数的执行上下文会被压入调用栈中。但是，异步操作的执行顺序并不是它们在代码中的书写顺序，而是它们在事件队列中被唤醒的顺序。

​	为了指定异步操作的执行顺序，只能在一个异步操作的回调函数中嵌套调用另一个异步操作的回调函数，这种实现方式导致其代码横向延伸，不利于阅读维护，因此被称为 **回调地狱**。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220507155726497_zIvxsfWG19.png"/> </div>

​   以上面这个例子为例，发起异步操作（网络I/O）的顺序是：url1->url2->url3->url4，即先请求 url1 中的data1，data1中含有url2，data2中含有url3...借此达到指定异步函数被调用的顺序。这样虽然能达到目的，但是代码可读性很差。所以ES6中就推出了 **Promise**，实现在控制异步函数执行顺序的情况下同时避免回调地狱。

**2. 用Promise解决回调地狱**

​	首先明确 Promise 是一个工具（类），它包裹了基础的异步操作，以链式编程的方式代替之前的回调地狱。通过Promise，将上面这个例子修改如下：

```javascript
//用 Promise类 封装异步操作
function netIO(bool, url) {
    return new Promise((resolve, reject) => {
        // 包裹异步操作,拿到返回值
        let data = $.ajax(url);
        if (data.status == 200) {
            // 请求成功
            resolve(data);
        } else {
            // 请求失败
            reject('请求失败');
        }
    });
}

// 链式调用解决回调地狱
let url1 = '127.0.0.1',
    url2 = '127.0.0.2',
    url3 = '127.1.1.1',
    url4 = '127.1.1.2';
netIO(url1).then(data1 => {
    // resolve请求成功至这处理数据,第一次I/O处理
    console.log(data1);
    // 发起第二次异步操作
    return netIO(url2);
}).then(data2 => {
    // 第二次I/O处理
    console.log(data2);
    // 发起第三次异步操作
    return netIO(url3);
}).then(data3 => {
    // 第三次I/O处理
    console.log('222', data3);
    // 发起第四次异步操作
    return netIO(url4)
}).catch(err => {
    // 一旦链中某次操作reject都会至这，处理异常
    console.log(err);
});
```

​	Promise是一个类，*netIO()* 函数里面包含了封装异步操作的 *Promise* 对象。*Promise* 的构造函数的参数是一个回调函数（执行器），该回调函数有两个参数：

- `resolve`: 一个回调函数，当异步操作成功时，调用此函数会跳转至 *.then()* 内部，等待处理返回值。
- `reject`: 一个回调函数，当异步操作失败时，调用此函数会跳转至 *.catch()* 内部，等待处理异常。

​	注意，在调用 *netIO()* 函数后，*new Promise(回调函数)*  并不只是生成一个 *Promise* 对象，它会执行两个操作：**1. 初始化并保存一些状态信息 2. 执行传入的回调函数**。也就是说回调函数会在 *Promise* 构造函数内被执行。

&emsp;将异步操作封装进 *Promise* 后，就用链式调用实现与回调地狱相同的功能，首先 *netIO(url1)* 中 *new Promise（回调函数*），执行 回调函数，发起对 *url1* 的网络请求，请求成功则 *resolve(data1)*，转至 *.then(回调函数)* 中执行对 *data1* 的处理程序，在处理完 *data1* 后，再调用*netIO(url2)* 发起对 *url2* 的网络请求，请求成功则转至 .then(回调函数) 中执行对 *data2* 的处理程序，在处理完 *data2* 后，再调用 *netIO(url3)* 发起对 *url3* 的网络请求...以此类推。

​       注意以上的过程是 url1->url2->url3->url4 链式调用，且必须上一次请求成功才会发起下一次请求。如果某一次请求失败，则会发生“断链”的现象，所以最后有一个 .catch( ) 来处理导致“断链”所抛出的异常，如果所有请求成功，则 *.catch( )* 内回调函数将不会被执行。

**3. 手写Promise**

​	Promise本质上是一个**状态机**，它通过三种状态控制执行流程：

`Pending状态`：等待状态，比如正在进行网络请求，或者定时器没有到时间。

`Fulfilled状态`：满足状态，当异步操作完毕后。如果操作成功，通过主动调用resolve()，修改Pending状态为Fulfilled，并保存操作成功返回值，等待.then()指定回调函数进行处理。

`Rejected状态`：拒绝状态，当异步操作完毕后。如果操作失败，通过主动调用 reject()，修改Pending状态为Rejected，并保存操作失败返回值，等待.catch()进行处理。

**注意一个promise对象状态的跃迁只会发生一次，即由 Pending -> Fulfilled，或者由 Pending -> Rejected。**

​ &emsp;下面是基础版本的手写Promise：

```javascript
// 定义三种状态
const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();

// 定义MyPromise类

class MyPromise {
    constructor(excutor) {
        // excutor是被封装的异步操作，由开发者传入

        // 初始化
        this.state = PENDING; // 状态
        this.value = ''; // excutor返回值
    
        // 定义resolv和reject方法，是excutor()中的两个参数，用于改变"当前"promise对象的state和value
      function resolve(res) {
          if(this.state == PENDING){
               this.state = FULFILLED;
                this.value = res; 
          } 
      }
      function reject(error) {
          if(this.state == PENDING){
               this.state = REJECTED;
                 this.value = error;
            }
        }
        
        // 调用执行器
        try {
            // 如果不绑定 resolve/reject 的this指向为该promise对象，由于resolve和reject在严格模式下定义，其原本的this为undefined
            excutor(resolve.bind(this), reject.bind(this));
        } catch (error) {
            reject(error);
        }
    }

    // 定义then方法，有两个参数onFulfilled和onRejected。根据promise改变的状态指定不同回调函数进行处理
    // onFulfilled回调函数用于处理Fulfilled状态的promise对象,onRejected回调函数用于处理Rejected状态的promise对象
    then(onFulfilled, onRejected) {
        if (this.state == FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.state == REJECTED) {
            onRejected(this.value);
        }
    }
}

// 测试用例
let p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello World!');
    }, 1000);
});

p.then((data) => {
    console.log(data);
});
```

这段代码基本实现了Promise的逻辑，可以发现每个Promise对象是一个状态机，其中包含了

两大属性：

- `state`: 表示当前promise对象所处状态 ( Pending状态 / Fulfilled状态 / Rejected状态 )。
- `value`: 表示状态被修改后保留的值。

三大方法：

- `resolve`：将promise对象进行状态切换 Pending-> Fulfilled，并保留值。
- `reject`：将promise对象进行状态切换 Pending-> Rejected，并保留值。
- `then`：用于promise对象发生状态改变后指定回调函数处理value，其有两个参数 *onFulfilled* 和 *onRejected*，分别是状态切换为 *Fulfilled* 和 *Rejected* 后处理value的回调函数。

但是这段代码运行结果却与预期不同：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220508123433748_84TpXbQ9lr.png"/> </div>

**改进点1：Promise对象的  “resolve / reject”  与  “ then / catch”  触发顺序问题**

​	根据JS代码的执行原理。当出现异步操作时，V8引擎会利用一个子线程单独运行此异步操作，同时主线程继续向下执行。也就是说，在执行异步操作时，主线程不会出现阻塞，会继续执行代码。
​	这导致没等异步操作中的 resolve 改变 promise 对象状态，then就被调用。如下图所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220508123759389_rVwn6suS47.png"/> </div>

​	我们可以用数组保存.then()链式调用过程中的回调函数，等到resolve()修改状态后，再在resolve()中遍历数组并执行指定的回调函数。​下面是改进后的代码：

```javascript
// 定义三种状态
const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();

// 定义MyPromise类

class MyPromise {
    constructor(excutor) {
        this.state = PENDING;
        this.value = '';
        this.onFulfilledCallbacks = []; // then中Fulfilled状态对应的回调函数
        this.onRejectedCallbacks = []; // then中Rejected状态对应的回调函数
        
    function resolve(res) {
          if(this.state == PENDING){
                this.state = FULFILLED;
                this.value = res;
                // 状态改变，调用处理函数
                this.onFulfilledCallbacks.forEach(onFulfilled => onFulfilled(this.value));
          }
        }
        function reject(error) {
          if(this.state == PENDING){
                this.state = REJECTED;
                  this.value = error;
                // 状态改变，调用处理函数
                this.onRejectedCallbacks.forEach(onRejected => onRejected(this.value));   
          }  
      }
        
        try {
            excutor(resolve.bind(this),reject.bind(this));
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        if (this.state == FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.state == REJECTED) {
            onRejected(this.value);
        }
        if (this.state == PENDING) {
            // 处于等待状态，将处理函数压入数组后等待resolve和reject调用
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }
    }
}

// 测试用例
let p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello World!');
    }, 1000);
});

p.then(res => {
    console.log(res);
});
```

可以看到测试用例结果如下所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220508124003854_YVB4VvkNUG.png"/> </div>

这样解决了 promise 中 “resolve / reject” 与 “then / catch” 的执行顺序问题；即必须是先 resolve 修改状态，再执行 then 指定的回调函数。

**改进点2：如何利用then的返回值，实现链式调用**

​	上面的代码无法实现promise的链式调用，例如 `p.then().then()...`。为了实现链式调用 then 的返回值应该也是一个promise对象，此时代码应该修改为：

```javascript
class MyPromise{
    ...
    then(onFulfilled, onRejected) {     
        // 将then函数内容封装至返回一个promise对象
        return new Promise((resolve,reject) => {
            
            if (this.state == FULFILLED) {
              onFulfilled(this.value);
             }
          if (this.state == REJECTED) {
                onRejected(this.value);
             }
          if (this.state == PENDING) {
                this.onFulfilledCallbacks.push(onFulfilled);
                this.onRejectedCallbacks.push(onRejected);
             }    
            
        });
    }
}
```

​	但此时返回promise对象（p2）的状态是 Pending，且没有保留前一个 promise 对象传递的值。我们回顾一下一个promise对象的执行逻辑：**excutor执行异步操作 —> 在excutor中调用reslove/reject：改变异步操作对应promise对象的状态，并保留异步操作的返回值给当前promise对象的value —>  执行then函数指定的回调函数处理value**，所以 then 函数的返回值影响了其返回 promise 对象的状态及value。根据Promise A+规范，then 返回对象的状态判定逻辑如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220508163535428_PxijXobnUr.png"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220508163620952_xHDV1FRKmH.png"/> </div>

根据这个逻辑，我们进一步修改then的代码，修改返回promise对象（p2）的状态：

```javascript
    class MyPromise {
        ...
        then(onFulfilled, onRejected) {
            let _this = this;

            return new Promise((resolve, reject) => {
                // 封装函数
                function returnPromise(callBack, callBackType) {
                    // 封装了then函数返回promise对象状态
                    // callBack是then指定回调函数为 onFulfilled/onRejected,callBackType是then指定回调函数的类型  为'onFulfilled'/'onRejected'
                    if (typeof callBack != 'function') {
                        if (callBackType == 'onFulfilled') {
                            // 条件3：onFulfilled不是一个函数
                            resolve(_this.value);
                        }
                        if (callBackType == 'onRejected') {
                            // 条件4：onRejected不是一个函数
                            reject(_this.value);
                        }
                    }
                    try {
                        // 执行回调函数onFulfiled/onRejected，result是返回值
                        let result = callBack(_this.value);
                        // console.log('p1.then的返回值：' + result);

                        // 条件1：onFulfiled/onRejected返回值为x
                        if (result instanceof Promise) {
                            // result为一个promise对象：返回promise对象状态与result相同，并传递value
                            result.then(data => {
                                resolve(data);
                            }, err => {
                                reject(err);
                            });
                        } else {
                            // result为一个数值: 返回promise对象状态为resolved，并传递value
                            resolve(result);
                        }

                    } catch (error) {
                        // 条件2：onFulfiled/onRejected执行异常
                        reject(error);
                    }
                } //returnPromise定义结束

                if (this.state == FULFILLED) {
                    returnPromise(onFulfilled, 'onFulfilled');
                }
                if (this.state == REJECTED) {
                    returnPromise(onRejected, 'onRejected');
                }
                if (this.state == PENDING) {
                    this.onFulfilledCallbacks.push(function() {
                        returnPromise(onFulfilled, 'onFulfilled');
                    });
                    this.onRejectedCallbacks.push(function() {
                        returnPromise(onRejected, 'onRejected');
                    });
                }
            });
        }
    }
```

接着我们用以下测试用例测试代码的可行性：

```javascript
// 测试用例
let p1 = new MyPromise((resolve, reject) => {
    // 异步修改状态
    setTimeout(() => {
        resolve('Hello World!');
    }, 1000);
});

const p2 = p1.then(() => {
    // 条件1：x为值
    return '获取到了then的返回值x';

    // 条件1：x为promise对象
    /* return new Promise((resolve, reject) => {
            // resolve('传递给p2的值');
            reject('传递给p2的值');
        }) */

    // 条件2：onFulfiled执行过程出错
    /* throw 'error'; */
});

// 条件3/4：onFulfiled/onRejected 不是一个函数
/* const p2 = p1.then(); */

console.log(p2);
```

:::info 说明
&emsp;*catch* 的返回值与 *then*一致：如果 catch 中代码执行正常，则返回一个Fulfilled状态的 promise 对象；反之，则返回一个 Rejected状态的 promise 对象。
>
&emsp;如果 then 中包含有 onRejected 这个处理异常的回调函数，则会先调用 onRejected，再根据then返回的promise对象状态决定是否调用 catch；如果 then 中不包含 onRejected回调函数，则直接调用catch。
:::

**附录：一个完整手写的Promise类**

```javascript
// 定义三种状态
const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();

// 定义MyPromise类
class MyPromise {
    constructor(excutor) {
        this.state = PENDING;
        this.value = '';
        this.onFulfilledCallbacks = []; // then中fulfilled状态对应的回调函数
        this.onRejectedCallbacks = []; // then中rejected状态对应的回调函数

        function resolve(res) {
          if(this.state == PENDING){
                this.state = FULFILLED;
                this.value = res;
                // 状态改变，调用处理函数
                this.onFulfilledCallbacks.forEach(onFulfilled => onFulfilled(this.value));
          }
        }
        function reject(error) {
          if(this.state == PENDING){
                this.state = REJECTED;
                  this.value = error;
                // 状态改变，调用处理函数
                this.onRejectedCallbacks.forEach(onRejected => onRejected(this.value));   
          }  
      }

        try {
            excutor(resolve.bind(this), reject.bind(this));
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        let _this = this;

        return new Promise((resolve, reject) => {
            // 封装函数
            function returnPromise(callBack, callBackType) {
                // 封装了then函数返回promise对象状态
                //callBack是then指定回调函数为 onFulfilled/onRejected,callBackType是then指定回调函数的类型为'onFulfilled'/'onRejected'

                if (typeof callBack != 'function') {
                    if (callBackType == 'onFulfilled') {
                        // 条件3：onFulfilled不是一个函数
                        resolve(_this.value);
                    }
                    if (callBackType == 'onRejected') {
                        // 条件4：onRejected不是一个函数
                        reject(_this.value);
                    }
                }
                try {
                    let result = callBack(_this.value); // 执行回调函数onFulfiled/onRejected，result是返回值
                    // console.log('p1.then的返回值：' + result);
                    // 条件1：onFulfiled/onRejected返回值为x
                    if (result instanceof Promise) {
                        // result为一个promise对象：返回promise对象状态与result相同，并传递value
                        result.then(data => {
                            resolve(data);
                        }, err => {
                            reject(err);
                        });
                    } else {
                        // result为一个数值: 返回promise对象状态为resolved，并传递value
                        resolve(result);
                    }
                } catch (error) {
                    // 条件2：onFulfiled/onRejected执行异常
                    reject(error);
                }
            }

            if (this.state == FULFILLED) {
                returnPromise(onFulfilled, 'onFulfilled');
            }
            if (this.state == REJECTED) {
                returnPromise(onRejected, 'onRejected');
            }
            if (this.state == PENDING) {
                this.onFulfilledCallbacks.push(function() {
                    returnPromise(onFulfilled, 'onFulfilled');
                });
                this.onRejectedCallbacks.push(function() {
                    returnPromise(onRejected, 'onRejected');
                });
            }
        });
    }
}
```

**4. Promise 的 API**

**1. Promise.all**

基本用法：

```javascript
let p = Promise.all([p1,p2,p3...]);

入口参数：一个promise对象组成的数组
出口参数：一个promise对象
功能：当入口参数传入的 [p1,p2,p3...] 每个promise对象state都为fulfilled（成功）时，出口参数p对象 state 为fulfilled，且 value 为[ p1.value, p2.value, p3.vlaue ]; 当入口参数传入的 [p1,p2,p3...]其中有一个对象（假设是p2）state为rejected （失败）时，出口参数p对象 state 为rejected，且 value 为p2.value.
```

手写：

```javascript
    class MyPromise {
        constructor(excutor) {
      ...
        }

        then(onFulfilled, onRejected) {
          ...
        }
          
        static all(proArray) {
            return new Promise((resolve, reject) => {
                let count = 0; // 记录成功状态的promise对象个数
                let values = []; // 记录成功状态的promise对象的值

                for (let i = 0; i < proArray.length; i++) {
                    proArray[i].then(value => {
                        // 执行onFulfilled，proArray[i]状态为 fulfilled
                        count++;
                        values[i] = value;
                        if (count == proArray.length) {
                            // proArray中所有对象都为 fulfilled
                            resolve(values);
                        }
                    }, error => {
                        // 执行onRejected，proArray[i]状态为 rejected
                        // 一旦发现一个proArray[i]状态为失败，立即改变返回p状态并传值，由于p状态只能改变一次，此后的改变都不会生效
                        reject(value);
                    });
                }
            });
        }
    }
```

**2. Promise.race**

基本用法：

```javascript
let p = Promise.race([p1,p2,p3...]);

入口参数：一个promise对象组成的数组
出口参数：一个promise对象
功能：当入口参数传入的 [p1,p2,p3...] 一旦有一个promise对象 state为 fulfilled(成功)/ rejected(失败)时，出口参数p对象 state 为该对象状态，且 value 为该对象值.
```

手写：

```javascript
    class MyPromise {
        constructor(excutor) {
      ...
        }

        then(onFulfilled, onRejected) {
          ...
        }
          
        static race(arr) {
            return new Promise((resolve, reject) => {
                for (let i = 0; i < arr.length; i++) {
                    arr[i].then((data) => {
                        resolve(data);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            });
        }
    }
```

#### 3. Generator ( ES6 )

**1. 基本使用**

​	`Generator`是 *ES6* 中实现异步编程的一种新的函数类型。普通函数：一旦执行就必须从头到尾执行完毕，而 `Generator`**可以将一个函数分段执行** 。即一个函数执行到某个停止节点，就返回一个结果，转而执行另外的函数；等到下次调用时，在上一次停止节点处，继续执行该函数。

:::info 
  内存分析：普通函数，等到被调用时，在调用栈中压入该函数的执行上下文，等到函数从头至尾执行完毕，调用栈弹出该函数的执行上下文，垃圾回收。
  Generator函数：等到被调用时，在调用栈中压入该函数的执行上下文，执行到第一个停止节点；停止执行，在调用栈中弹出该函数的执行上下文，但不进行内存销毁，而是冻结内存以保持当前执行上下文状态；等到下一次被用，在调用栈中压入被冻结的执行上下文，继续执行该函数，直到下一个停止点。
:::

看一个Generator的例子：

```javascript
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}
let g = foo();

g.next(); // { value : 1, done : false}
g.next(); // { value : 2, done : false}
g.next(); // { value : 3, done : false}
g.next(); // { value : 4, done : true}
g.next(); // { value : undefined, done : true}
```

通过这个例子我们能发现：

- `Generator` 的定义：在普通函数名前加 `*`.
- `Generator` 的调用：与普通函数调用一致，返回值为一个 iterator 对象.
- `Generator` 的停止点：**yield** 关键字。
- `Generator`的启动点：iterator的**next()** 函数。

**yeild**

​	`Genrator` 函数的停止节点，每次执行碰见yield便会停止，并向启动点吐出一个返回值。返回值为yield后面表达式的值。注意：*当次执行并不会执行 yield 那行所在语句，只会执行 yeild 后面的表达式后跳出。*

**next**

​	`Genrator` 函数的启动节点，因为 Generator函数返回值为一个 iterator（迭代器），调用 itreator的next（）方法启动 `Genrator` ，即执行 `Genrator` 中的代码。执行代码段为上一个 yield 至 下一个 yield 之间的代码。返回值为 下一个 yield 吐出的值 + 一个状态，{ value : yield返回值，done : false }。

​	通过利用迭代器，存储 `Genrator`的每一个停止点 ，将函数的执行类似成一个线性结构。每次碰见yield，函数就停止执行，吐出一个值；又通过next，在上一次停止的基础上继续执行该函数。

​	`Generator` 每次在停止点都吐出一个值，能否在启动点吞进一个值呢？

​	可以通过next方法传参，使 `Genrator` 吞进一个值，如下面例子：

```javascript
function *foo(x) {
    const y = 2 * (yield (x + 1));
    const z = yield (y / 3);
    return (x + y + z);
}

const  a = foo(5);
a.next(); // {value : 6, done : false}
a.next(); // {value : NaN, done : false}
a.next(); // {value : NaN, done : false}

const b = foo(5);
b.next(); // {value : 6, done : false} 
b.next(12);// {value : 8, done : false}
b.next(13);// {value : 42, done : false}
```

分析以上代码需要知道3点：

- yield 向外吐出的值是其表达式的值，但是在内部其执行语句的返回值是undefined。
- 每次外部调用next，碰见yield标识符就停止执行并吐出一个值，yield那一行代码会在下次启动时执行。
- next可以传参，从外部向 `Genrator` 输入一个值，该值会替代上次yield语句的返回值。（undeifined -> 某个传入值）


<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20220608_194837_LVQndrgYAS.jpg"/> </div>

**2. Generator与异步**

​	由于 JS 是单线程执行，只有一个调用栈，所以一开始实现异步的方式是利用 **回调函数**。但如果想指定异步操作的执行顺序，则必须在回调函数中嵌套调用另一个回调函数，调用层数过多会导致代码可读性很差，这种现象叫做 *回调地狱* 。ES6 中引入了 **Promise** 实现了通过链式调用的方式指定异步操作的执行顺序。

​	*Promise* 解决了*回调地狱* 的问题，将回调函数的嵌套调用修改为了链式调用。本质上看，*Promise* 不是一种新语法，而是一种新写法，把 **指定异步操作顺序** 的写法由嵌套调用形式改成了链式调用形式。

​	**Genrator** 的出现进一步改进了 *Promise* 的链式调用，它结合 *Promise* 使得 指定异步操作顺序 写法更接近于同步函数，可读性也更高。我们在下一章中会介绍。

**协程**

​	协程可以理解为 “相互协作的线程”，由于 JS 是一门单线程的语言，所以将程序执行的最小单元由 *线程* 改为 *函数*。因此，协程在 JS 中的解释为 “相互协作的函数”。

​	多个函数可以并行执行，但是只有一个函数处于正在运行的状态，其他函数都处于暂停态。函数之间可以交换执行权，一个函数执行到一半，可以暂停执行，将执行权交给另一个函数，等稍后收回执行权时，再恢复执行。这种可以并行执行、交换执行权的函数（线程），称为协程。

**3. Generator的自动执行器**

​	首先，了解异步操作从 回调函数 -> Promise ->  Generator 的变化：

```javascript
// 普通回调函数
$ajax('url1', function(data1){ 
    $ajax(data1['url2'], function(data2){
        $ajax(data2['url3'], function(data3){
            $ajax(data3['url4'], function(data4){
                console.log(data4);
            })
        })
    })
});

// Promise链
function getApi(params){
    // 返回一个Promise对象
    return new Promise((resolve,reject)=>{
        $ajax(params,function(data)=>{
              resolve(data);
        })
    });
}

getApi(url1).then((data1)=>{
    return getApi(data1['url2']);
}).then((data2)=>{
    return getApi(data2['url3']);
}).then((data3)=>{
    return getApi(data3['url4']);
}).then((data4)=>{
    console.log(data4);
})

// Generator
function getApi(params){
    // 返回一个Promise对象
    return new Promise((resolve,reject)=>{
        $ajax(params,function(data)=>{
              resolve(data);
        })
    });
}

function *gen(params){
    let data1 = yield getApi('url1');
    let data2 = yield getApi(data1['url2']);
    let data3 = yield getApi(data2['url3']);
    let data4 = yield getApi(data3['url4']);
    console.log(data4);
}
run(gen);

// 但是Generator需要一个自动执行机制
function run(gen){
    let g = gen();  
    next();
    
    function next(data){
        let { value, done} = g.next(data);
        if(done) return value;
        value.then((data)=>{
           next(data);  
        });
    }
}
```

从上面的例子可以看出，异步操作的写法逐渐趋近于同步代码的写法，这些写法形如同步代码的异步操作被封装进  `Generator` 中，但 `Generator` 只是一个异步操作的容器，它能够用 iterator 迭代器记录异步操作的顺序，但它需要一种机制驱动它自动执行。这种自动执行机制使得：一旦异步操作有了结果，能够自动交回执行权给 `Generator`。

两种方法可以做到：

- Thunk函数：将异步操作包装成 Thunk 函数，在 Thunk 函数的回调函数里面交回执行权。
- Promise对象：将异步操作包装成 Promise 对象，用 then 方法交回执行权。co库使用的是这一种方式。

**Thunk函数**

​	Thunk函数的传入参数是一个普通多参函数（参数包含一个回调函数），返回值是一个与多参函数功能一样的函数，不过它只有一个形参且该形参必须是回调函数。

​	`Generator` 的自动执行机制可以通过在 *yield* 向调用处吐出一个Thunk函数实现，具体的实现方式及原理可以参考：[Thunk 函数的含义和用法](https://www.ruanyifeng.com/blog/2015/05/thunk.html "Thunk 函数的含义和用法")

**Co库**

​	co函数库是著名程序员TJ Holowaychuk 于2013年6月发布的一个node库，用于 Generator 函数的自动执行。看下面的例子：

```javascript
var gen = function* (){
  var f1 = yield readFile('/etc/fstab');  // 异步操作读文件1 
  var f2 = yield readFile('/etc/shells');  // 异步操作读文件2
  console.log(f1.toString());
  console.log(f2.toString());
};

// 手动执行
let g = gen();
g.next();
g.next();
g.next();

// 使用co库实现自动执行
let co = require('co');
co(gen);
```

​	co的实现原理：规定在`Generator`中每一个 *yield* 向调用处吐出的都是一个 *Promise* 对象，通过递归实现 `Generator` 的自动执行。

```javascript
let fs = require('fs');

// 封装readFile函数符合co使用机制
let readFile = function(fileName){
    // 返回一个Promise对象
    return new Promise((resolve,reject) => {
        fs.readFile(fileName, (error,data) => {
            if(error) reject(error);
            resolve(data);
        })
    });
}

// 使用Generator指定异步操作的执行顺序
function *gen(){
  var f1 = yield readFile('/etc/fstab');  // 异步操作读文件1 
  var f2 = yield readFile('/etc/shells');  // 异步操作读文件2
  console.log(f1.toString());
  console.log(f2.toString());
};

// 手动执行：Promise的链式调用
let g = gen();
// 执行f1
g.next().value.then((data)=>{
    // 执行f2
   return g.next(data);   
}).then((data)=>{
    // 执行至return
    return g.next(data);
});

// 自动执行：模拟实现co函数
function co(gen){
    // 入参是一个Generator
    let g = gen();
    next(); // 启动gen
    
    function next(data){
        let result = g.next(data);
        if(result.done ) return result.value;
        // yield返回的result.value是一个Promise对象
        result.value.then((data)=>{
            next(data);   // 递归实现自动执行
        });
    }
}

co(gen);
```

参考：[co 函数库的含义和用法](https://www.ruanyifeng.com/blog/2015/05/co.html "co 函数库的含义和用法")

#### 4. async 函数

​	async函数是编写异步代码的最终解决方案。一句话：**async函数就是Generator函数的语法糖果。**

**基本使用**

```javascript
// Generator
function getApi(params){
    // 返回一个Promise对象
    return new Promise((resolve,reject)=>{
        $ajax(params,function(data)=>{
              resolve(data);
        })
    });
}

// 但是Generator需要一个自动执行机制
function run(gen){
    let g = gen();  
    next(); // 启动gen
    
    function next(data){
        let { value, done} = g.next(data);
        if(done) return value;
        value.then((data)=>{
           next(data);  
        });
    }
}

function *gen(params){
    let data1 = yield getApi('url1');
    let data2 = yield getApi(data1['url2']);
    let data3 = yield getApi(data2['url3']);
    let data4 = yield getApi(data3['url4']);
    console.log(data4);
}
run(gen);
```

引入async函数后，上面的写法可以修改为：

```javascript
// async函数
function getApi(params){
    // 返回一个Promise对象
    return new Promise((resolve,reject)=>{
        $ajax(params,function(data)=>{
              resolve(data);
        })
    });
}

async function gen(params){
    let data1 = await getApi('ulr');
    let data2 = await getApi(data1['url2']);
    let data3 = await getApi(data2['url3']);
    let data4 = await getApi(data3['url4']);
    console.log(data4);
}
gen();
```

可以看见，async函数不需要实现自动执行器，执行调用便可自动执行。写法上：async函数就是将 *Generator* 的 **\*** 替换成 async，将 yield 替换成 await。async函数相比于 *Generator* 有如下优点：

- `内置执行器`：*Generator* 函数必须依靠类似于 co 库这种自动执行器才能执行；而async函数自带执行器，直接调用便可自动执行。
- `更广的适用性`：在 *Generator* 中要配合co库自动执行，yield后面必须是 thunk 函数 or Promise对象；而 async 函数中 await 后面可以是 Promise 对象，也可以是原始类型值（数值、字符串、布尔...）。
- `更好的语义`：async 和 await，比起 *Generator* 的 **\*** 和 yield，语义更清楚。async 表示函数里面有异步操作，await 表示紧跟在后面的表达式是异步操作。
- `返回值是Promise`：async函数的返回值是Promise便于操作，*Generator*函数的返回值是iterator迭代器，适用性更差。

**async的原理**

​	async 实际上是将 *Generator* 的定义和自动执行器进行封装，看以下代码：

```javascript
async function fn(args){
    //...
}
// 等价于 👇
function fn(args){
    return co(function *(){
        //async函数中代码...
    });
    
    function co(gen){
        // async函数返回一个Promise对象，得加一层包裹
        return new Promise( (resolve,reject)=>{
            let g = gen();
            next(); // 启动gen
            
            function next(data){
                let { value, done} = g.next(data);
                // gen语句执行完，返回onFulfilled的promise
                if (done) resolve(value);
                // gen语句未执行完，通过递归继续执行。考虑await返回的value可能是一个原始类型值，加一层Promise进行包裹
                Promise.resolve(value).then((data)=>{
                    next(data) // 递归实现自动执行,data便是await的返回值
                });
            }
        })
    } 
}
```

为了便于理解，以上代码参考：[async 函数的含义和用法](https://www.ruanyifeng.com/blog/2015/05/async.html) 有所改动。总之，都是实现：将 *Generator* 的定义过程和自动执行器封装在一个函数中，这个函数被叫做async函数。

:::info async 和 await
 **async**: async声明的函数只是把该函数的return包装了，使得无论如何都会返回promise对象（非promise会转化为promise），除此之外与普通函数没有不同，没有特殊待遇。

 **await:** await声明只能用在async函数中。当执行async函数时，遇到await声明，会先将await后面的表达式执行完，执行完后立马跳出async函数，去执行主线程其他内容。await后面剩余等待执行的代码，会被当做一个微任务放入微任务队列中（类似于then）。（参考 Generator 中的 yield）  

 **await相比于 yield 还有不同之处：** 如果await后面表达式是一个成功状态的 promise 对象，则返回 promise 对象的 resolve(value) 中的 value；如果await后面表达式是一个失败状态的 promise 对象则抛出异常，如果await后面表达式是一个正常值，则返回这个正常值。
:::

```javascript
// 如果 await 后面表达式立即返回一个 resolve / reject 状态的promise，则执行顺序为：主线程-> 第一个await（交出执行权）-> 主线程 -> 微任务(包含执行await之后的代码) ->尝试Dom渲染-> ...Event Loop轮询 ->宏任务
<script>
    function netIO() {
        return new Promise((resolve, reject) => {
            // 立即返回
            resolve(1);
        });
    }
    async function async1() {
        let data = await netIO();
        console.log('async1'); // 3
        console.log(data); // 4

    }

    console.log('script start'); // 1
    async1();
    Promise.resolve(1).then((data) => {
        console.log('then'); // 5
    });
    console.log('script end'); // 2
</script>

// 如果 await 后面表达式延迟返回一个 resolve / reject 状态的promise，则执行顺序为：主线程-> 第一个await（交出执行权）-> 主线程 -> 微任务 -> 尝试Dom重新渲染 ->...Event Loop轮询 -> 宏任务：await后面Promise状态被修改-> 微任务(包含执行await之后的代码) ->尝试Dom重新渲染->...Event Loop轮询 -> 宏任务。
<script>
    function netIO() {
        return new Promise((resolve, reject) => {
            // 延迟返回
            setTimeout(() => {
                resolve(1);
            }, 1000);
        });
    }
    async function async1() {
        let data = await netIO();
        console.log('async1'); // 4
        console.log(data); // 5

    }

    console.log('script start'); // 1
    async1();
    Promise.resolve(1).then((data) => {
        console.log('then'); // 3
    });
    console.log('script end'); // 2    
<script> 
```
