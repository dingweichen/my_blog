# Vue2基本原理

## Vue原理

### 1. 组件化基础

什么是组件化？

:::info 组件化
组件化相当于对DOM结构进行封装，但暴露出DOM相关的数据接口。通过传入不同的数据，显示不同的页面，但其DOM结构不变。
:::

​	组件化的概念一开始是后端提出的，后端写好一些组件，通过传入不同数据生成不同的静态页面，返回给前端进行显示。随着技术的发展，前后端分离时代到来，组件化的概念也被前端所引入，其核心思想就是**数据驱动视图**。

​	 基于数据驱动视图，出现了一种新的前端设计思想 **MVVM（Model-View-ViewModel）**。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/src=http___img-blog.csdnimg.cn_2021042623485452.pn.webp.webp"/> </div>

- `Model`：数据层，后端传输过来的JSON数据，比如存储于Vue对象的data中。
- `View`：视图层，前端显示出的页面，比如DOM。
- `ViewModel`：数据处理层，实现页面响应式的逻辑代码。即视图层的改变传至数据层，数据层改变传至视图层。

### 2. 响应式

#### 2.1基于Object.defineProperty

```javascript
let obj = {};
let name = 'ding';
Object.defineProperty(obj, 'name', {
    get: function() {
        return name;
    },
    set: function(newVal) {
        console.log('被修改');
        name = newVal;
    }
});
```

`Object.defineProperty` 实现了对某个对象赋予属性，并对该属性赋予存取器：`get` 和 `set`。一旦有获取该属性的操作，get 就会被调用；一旦有修改该属性值的操作，set就会被调用。

参考：[理解Object.defineProperty的作用](https://segmentfault.com/a/1190000007434923 "理解Object.defineProperty的作用")

基于此方法，可以实现 **对象类型** 的data进行监听。

```javascript
function defineReactive(obj, key, value) {
    // 实现对某个对象属性的监听
    // obj：被监听的目标对象，key: 被监听的属性，value：被监听属性的值

    observer(value); // 递归实现深度监听
    Object.defineProperty(obj, key, {
        // 闭包：自由变量为value
        get: function() {
            return value;
        },
        set: function(newVal) {
            if (newVal !== value) {
                value = newVal;
                observer(value); // 属性值由普通类型改为引用类型，需要进行监听
                // 视图更新操作
                console.log('视图被更新');
            }
        }
    });
}

function observer(target) {
    // 实现对target变量的监听

    if (typeof target !== 'object' || target === null) {
        // 非对象：不进行监听
        return target;
    }

    if (target instanceof Array) {
        // 数组：用另外的方式监听
    }

    // 对象：用defineProperty监听
    for (let key in target) {
        defineReactive(target, key, target[key]);
    }
}

// 测试用例
let obj = {
    name: 'ding',
    sex: 'male',
    score: {
        'math': 0,
        'english': 0,
    },
}
observer(obj);
```

以上代码实现了对象类型数据的深度监听，一旦对象的某个属性值被改变，视图也会响应地改变。**核心思想就是为obj 中每个属性设置 ****`set`****，在 set 中进行相应的视图更新操作**。

`Object.defineProperty` 具有以下缺陷：

- 需要**一次性**递归对每个属性设置 set，开销大。
- 无法监听新增/删除属性。（Vue 2.x可以用 Vue.set 和 Vue.delete 加入/删除被vue框架监听的属性）
- 无法监听数组类型，需要特殊处理。

**实现监听数组**

```javascript
function arrayReactive(arr) {
    // 实现对某个数组进行监听
    
    // 1. 在原本的arr -> Array之间创造一个中间原型reactPrototype
    let reactPrototype = Object.create(Array.prototype);
    let methods = ['push', 'pop', 'shift', 'unshift', 'splice'];
    methods.forEach(method => {
        reactPrototype[method] = function() {
            // 视图更新操作
            console.log('视图被更新');
            Array.prototype[method].call(arr, ...arguments);
        }
    });
    // 2. 修改原型链 arr ->reactPrototype ->Array
    arr.__proto__ = reactPrototype;
}
```

对于**数组类型**的数据，需要增加一个中间原型 `reactPrototype`, 将更新视图的操作封装进 reactPrototype的数组方法中，实现监听数组类型的数据。

&#x20;      以上通过Object.defineProperty实现的 `observer`方法实现了**数据劫持**功能，数据劫持即劫持了数据的读、取...等操作，一旦数据进行读/取就会触发数据劫持所设定的一些代码。而要实现数据响应式还得在数据劫持内部加入**观察者模式**，观察者模式是一种设计模式。简单来说是一种“一对多”的关系，一个被观察者，多个观察者，一旦被观察者发生某些变化就会通知观察者执行指定操作。

&#x20;      Vue通过在响应式数据的getter中创建一个被观察者并收集相关的多个观察者，对象的一个属性就是一个【被观察者】，而引用了该属性的DOM元素就是【观察者】。getter会为每一个对象的每一个属性设置一个【被观察者】，并收集所有引用该属性（关注了被观察者）的所有DOM元素作为【观察者】。【被观察者】内部会有一个数组`watchers`保存关注该属性的所有【观察者】们。

&#x20;     而setter所作的操作就是，一旦属性的值被修改（【被观察者】发生变化），就通过被观察的`notify`方法调用`watchers`中每个观察者的 `update`方法使得他们做出相应的改变。

参考：

[ 探索 Vue.js 响应式原理](https://segmentfault.com/a/1190000038921922 )

#### 2.2 异步更新DOM

  Vue实现了异步更新DOM，即当【被观察者】通知【观察者】做出相应修改时，会调用它们内部的`update`方法，而update 并不是立即对当前DOM元素进行修改，而是将 `watcher`（要修改的DOM引用和属性）放入一个更新队列中等待执行。

在一个宏任务中，一旦响应式对象的某个属性被修改，就会通过setter数据劫持 →被观察者通过notify通知观察者们 → 观察者通过update将watch放入更新队列中等待执行。更新队列会在一个微任务中被清空，即所有的DOM更新任务会放在一个微任务中执行。

**为什么需要异步更新DOM？**

假设一个宏任务对某个对象的属性多次修改，比如下面这段代码：

```vue
<template>
  <div>
    <div>{{test}}</div>
  </div>
</template>

export default {
    data () {
        return {
            test: 0
        };
    },
    mounted () {
      for(let i = 0; i < 1000; i++) {
        this.test++;
      }
    }
}
```

如果采用同步更新DOM的策略，test值会被修改1000次，而每一次都会根据响应式触发 `setter →Dep(被观察者通知)→Watcher(观察者收到通知)→update(观察者更新)→patch(diff算法比较新vdom)`Vue的响应式更新机制，这样是十分消耗性能的。所以Vue采用了异步响应式更新DOM的机制，将更新任务相关`watcher`存进一个队列中等待执行，如果watcher中的属性被多次修改，只要在队列中找到相同的wather 并直接更改其对应属性即可，所以例子中的test对应的watcher最终只需要将对应的DOM的0改为1即可。所有的属性更改操作被放入一个tick（宏任务）中，而所有的DOM更新操作被放入接下来的tick（微任务）中。**tick即表示一次调用栈的清空（清空一次调用栈可能是执行一次宏任务也可能是执行一次微任务）**

**nextTick**

  Vue通过nextTick实现获取异步更新后的DOM。通过上面我们知道，异步更新DOM会在一次微任务中执行完毕，而要获取更新后的DOM只要在异步更新DOM的微任务之后执行即可。nextTick接收一个回调函数`callback`作为参数，通过在异步更新DOM的微任务（tick）之后添加一个新的微任务（tick），在微任务中执行这个回调函数即可获取更新后的DOM。

  nextTick通过构造tick（微任务或宏任务）的方式实现callback的异步调用，其原理是利用 `Promise → MutationObserver → setimmediate → setTimeout` 构造一个tick实现异步操作。优先使用Promise.then构造一个微任务；如果没有Promise则用MutationObserver构造一个微任务；再次之用setimmediate构造一个微任务；如果以上方式全都不行，则只能用setTimeout构造一个宏任务。目的就是为了延迟callback的执行时机。**所以一般nextTick会写在属性更改之后**，例如：

```vue
  <div id="app">
      <div ref="test">{{test}}</div>
      <button @click="handleClick">tet</button>
  </div>
    
  // 1. 异步更新DOM的tick比获取DOM的tick先执行
  const app = new Vue({
      el: '#app',
      data: {
          test: 'start',
      },
      methods: {
          handleClick() {
              this.test = 'end'; // 异步更新DOM的微任务，先执行
              this.$nextTick(() => {
                  console.log(this.$refs.test.innerText); // 获取DOM的回调，后执行，输出end
              })
          }
      }
 });
  // 2. 异步更新DOM的tick比获取DOM的tick后执行
   const app = new Vue({
      el: '#app',
      data: {
          test: 'start',
      },
      methods: {
          handleClick() {
              this.$nextTick(() => {
                  console.log(this.$refs.test.innerText); // 获取DOM的回调，先执行，输出start
              })
              this.test = 'end'; // 异步更新DOM的微任务，后执行
             
          }
      }
 });
```

实际上异步更新DOM的微任务底层也是通过调用nextTick生成一个tick（微任务）做到异步的。

参考：

[ learnVue/Vue.js异步更新DOM策略及nextTick](https://github.com/answershuto/learnVue/blob/master/docs/Vue.js%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0DOM%E7%AD%96%E7%95%A5%E5%8F%8AnextTick.MarkDown)

[ 温故而知新，浅入 Vue nextTick 底层原理 - mdnice 墨滴 nextTick是什么？](https://www.mdnice.com/writing/440b1ac98b4d44589326e9a9e427187c)

[ vue方法nextTick源码分析 - 掘金 nextTick是vue的核心方法之一](https://juejin.cn/post/6844903945752543245)

### 3. 虚拟DOM和Diff算法

#### 3.1 虚拟DOM

​	如果用原生JS直接操作DOM对页面进行修改，那么操作一次页面，浏览器就需要重构一次DOM结构并重新渲染一次DOM。这样十分消耗浏览器的性能。我们可以用 JS 代码来模拟DOM结构，并直接在模拟的DOM上进行操作，用 JS 模拟出的DOM结构即是 **VDOM（Virtual DOM）**。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220610150057704_Wito_ybQ71.png"/> </div>

下面是用 snabbdom 库实现VDOM代码：

```javascript
const container = document.getElementById("container");

const vnode = h(
    "div#container.two.classes", // tag
    { on: { click: someFn} }, // 属性
    [ // 孩子节点
        h(
            "span",
            { style: { fontWeight: "bold" }},
            "This is bold" // 这样表示无孩子节点
        ),
        " and this is just normal text",
        h(
            "a", 
            { props: { href: "/foo" }}, 
            "I'll take you places!"
        ),
    ] 
);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode); // 将虚拟DOM节点挂载至真实DOM上

const newVnode = h(
  "div#container.two.classes",
  { on: { click: anotherEventHandler } },
  [
    h(
      "span",
      { style: { fontWeight: "normal", fontStyle: "italic" } },
      "This is now italic type"
    ),
    " and this is still just normal text",
    h("a", { props: { href: "/bar" } }, "I'll take you places!"),
  ]
);
// Second `patch` invocation: Snabbdom efficiently updates the old view to the new state
patch(vnode, newVnode); // 因为vnode已经挂载至真DOM上，比较新的vnode和旧的vnode即可
```

上面代码中，`patch` 函数通过比较新旧VDOM，得出最小更新范围，最后更新DOM。而 patch 函数中的比较算法则是 **Diff算法**。

#### 3.2 Diff算法

​	Diff对比算法是用于两颗新旧DOM树的对比，它遵从如下三条原则：

- 只比较同一层级，不跨级比较
- 节点的tag不相同，则直接删除以该节点为根的子树，再重新创建，不做深度比较
- 节点的tag和key，两者都相同，则认为是相同节点，进行深度比较

`patch` 函数实现了比较新旧VDOM，以最小的代价更新DOM。其中包含了三步，每步用到了三个关键函数：

- `sameVnode`：通过比较新旧Vnode的**tag**及**key** 。如果节点初步相同（是同一种类型节点tag相等，且key相等），则调用 **patchVnode** 进行深度比较；如果不同，则直接将旧节点销毁，插入新节点。
- `patchVnode`：对新旧Vnode进行深度比较，主要是比较他们的孩子节点。首先将新Vnode映射至旧Vnode关联的真实DOM，取代其与该真实DOM的关联；接着，将真实DOM的属性(id,class,width...)更新至与新Vnode相同；最后比较他们的孩子节点。这里分几种情况：
  - 旧Vnode无孩子，新Vnode有：向真实DOM中插入新增的孩子。
  - 旧Vnode有孩子，新Vnode无：向真实DOM中删除所有孩子。
  - 旧Vnode有孩子，新Vnode也有：调用 **updateChlidren** 对孩子进行比较。
- `updateChildren`：对新旧Vnode的孩子进行比较。用双指针指向孩子列表的首尾，对旧Vnode孩子列表oldCh，及新Vnode孩子列表newCh，首尾元素调用 sameVnode 进行两两初步比较。如果没有找到相同节点，则对当前节点（图中为newCh的b）在oldCh中遍历，如果sameVnode命中，则调用patchVode修改属性移动其位置即可；如果sameVnode未命中，则需要构造新节点并将新节点插入当前位置。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/727b5dd8a3424d22afd9dc5cf0dae05e_tplv-k3u1fbpfcp-z.png"/> </div>

​Diff算法的关键部分在于 **updateChildren** 的扫描过程，详细步骤可以参考：[15张图，20分钟吃透Diff算法核心原理](https://juejin.cn/post/6994959998283907102 "15张图，20分钟吃透Diff算法核心原理")

> 在v-for语句中，为什么节点的key不能绑定index，而绑定唯一值？
> ​	因为如果key绑定为index，则无法在Diff算法中唯一标识一个Vnode，导致很多没必要的修改节点属性的操作。具体例子可以参考《Vue基本使用》的 “★虚拟DOM和Diff算法” 举例章节。

### 4. 模板编译

​	\<template>是定义一个Vue组件中DOM结构用到的语法。首先一个Vue组件会检查其初始化参数 options 对象的 **el** 属性，利用 el 挂载的元素作为Vue组件的DOM结构；如果options中同时有el 和**template**，则会将template中的代码编译，生成一个新的DOM结构，利用新的DOM替换 el 挂载的旧DOM。

​	模板编译即是将\<template> 语法通过 `vue template complier` 模块编译为一个 **rende**r函数，render函数的作用是生成一个 Vnode。render内部实际上调用了 h 函数，通过 h 函数生成一个Vnode。下面是将模板语法编译为 render函数的举例：

```javascript
// 案例1
const template = `<p>{{message}}</p>` // 以下为编译后的render函数

function render() {
    with(this) {
        // this为当前Vue实例对象, createElement相当于h
        return createElement(
            'p', // tag
            [ // 孩子节点
                createTextVNode(toString(message)),
            ]
        )
    }
}
// 案例2
const template = `
        <div>
            <p v-if="flag === 'a'">A</p>
            <p v-else>B</p>    
        </div>
    `

functionr render() {
    with(this) {
        return createElement(
            'div',
            [
                (flag==='a') ? createElement('p',[createTextVNode("A")]) : createElement('p',createTextVNode("B")),
            ]
        )
    }
}
```

回顾以上知识，一个Vue组件的渲染及更新包含三个部分：模板编译，生成vnode节点 -> 触发响应式，实现数据驱动视图 -> 将vnode映射至真实DOM，通过diff比较VDOM与真DOM修改页面结构：

- 将模板语法编译为render函数
- 在编译过程中检索模板所引用变量，触发变量的getter，从而触发Vue响应式框架
- 执行render函数，生成一个Vnode节点
- patch（ele，Vnode），将VDOM与DOM映射
- data改变，触发setter被Vue框架所监听到，重新生成 render函数
- 重新执行render函数，生成新的newVnode
- patch（Vnode，newVnode），用Diff算法以最小代价更新DOMj

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220613221259631_1moKdJY0Uf.png"/> </div>

## Vue-router原理

​	Vue-router实现了前端路由。前端路由即浏览器的URL改变时，通过Vue-Router监听URL的变化，响应式地更改组件的加载。前端路由多应用于SPA中。

> 📌**SPA(Single Page Application) 单页面应用：**
> &#x20;    只有一个html文件作为入口，浏览器首次加载页面需获取页面所需的所有公共资源（js，css）等。后面通过js代码监听URL的变化（前端路由），局部替换页面组件，而不必向后端重新请求所有资源并全局刷新页面。
> &#x20;    特点：适用于组件复用较多的页面场景，首屏加载时间过长（通过懒加载优化），且不利于SEO（搜索引擎优化）。
> **MPA(Multi Page Application) 多页面应用：**
> &#x20;    每个URL都对应一个html文件作为入口文件。每次URL变化，浏览器都得向后端获取新的资源（后端路由），并全局刷新页面实现页面视觉上的跳转。
> &#x20;    特点：适用于组件关联不大，耦合度不高的页面场景，首屏加载时间不长，利于SEO；但每次路由都相当于重新加载页面，页面重启成本高，用户体验不好。

### 1. hash模式

​	hash模式，指的是URL形如 **.../#/aaa** 样式，通过/#/aaa标识一个URL。hash模式路由有以下特点：

- hash变化会触发页面的跳转，即浏览器的前进/后退功能
- hash变化不会刷新页面
- hash变化永远不会提交到server端

​	修改hash模式的URL：

- `location.hash`：通过修改location.hash属性实现hash模式下URL的修改

​	而vue-router实际上是通过 `window.onhashchange`事件监听hash模式URL的变化，从而加载不同组件

```javascript
window.onhashchange = (event) =>{
    // event有两个参数:event.oldURL表示跳转前的URL，event.newURL表示跳转后的URL
    if(event.newURL === 'xxx'){
        // 加载对应组件...
    }
}
```

### 2. history模式

​	history模式是H5新提出的一种路由模式，它也是一种前端路由模式，与hash模式不同，其URL形如 **.../aaa/bbb** 样式，看起来与后端路由URL样式相似。history模式跳转时也不会刷新页面。

​	而vue-router实现监听history模式URL的变化，从而加载不同组件有两种方式：

- `window.onpopstate`：H5以前，通过监听浏览器history模式下的 `onpopstate` 事件，即用户点击浏览器前进/后退按钮，一旦URL改变则切换组件加载。
- `history.pushState`： H5以后，提供`history.pushState（state，null，'page1'）`修改URL实现跳转，同时切换组件加载。第一个参数为state，包含当前URL下存储的查询参数，第二个参数为页面显示的title基本设置为null，第三个参数为URL的跳转。

> **hash和history的不同：**
> &#x20; 1\. 形式上hash模式的URL有 “**#**”，history模式没有。
> &#x20; 2\. hash模式不能记录参数，history模式可以通过state对象记录参数。
> &#x20; 3\. hash模式由于“#”后面的hash值并不会带入http请求URL中，所以如果用户点刷新按钮，一直请求的是同一个页面；history模式由于 URL改变会带入http请求URL中，所以需要服务端做相应配置，比如用户点刷新按钮浏览器请求URL为“<http://www.baidu.com/aaa”服务端返回的是> “[http://www.baidu.com”首页对应资源。注意：]()`history.pushState` 方法实现了修改URL同时不向服务端发送http请求，更好地支持了history模式。
>
> **hash和history的选择：**
> ​	to B 的系统推荐用hash，因为其简单易用，对url规范不敏感；to C 的系统可以考虑选择H5 history，但需要服务端支持。尽量使用简单的路由模式，即hash模式。
