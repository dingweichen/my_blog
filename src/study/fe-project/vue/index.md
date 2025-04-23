# Vue2学习笔记

## 一、初识Vue

```javascript
<body>  
  <div id='app'>
        <h2 id="count">当前计数：{{counter}}</h2>
        <button v-on:click="add()">+</button>
        <button @click="sub()">-</button>
  </div>
  <script src="./js/vue.js"></script>
  <script>
    const app = new Vue({
            el: '#app',
            data: {
                counter: 0,
            },
            methods: {
                add: function() {
                    this.counter++;
                },
                sub: function() {
                    this.counter--;
                }
            }
        });
    </script>
</body>
```

Vue是MVVM架构的框架，其中M为model，V为view，VM为view-model。

- Model：为数据层，主要包括后端传送过来的待处理数据，举例为data这个对象。
- View：为视图层，主要包括前端展示出来的数据及视图，举例为页面的DOM（HTML+CSS）。
- View-model：为数据处理层，主要为将后端数据处理后映射至前端页面中的逻辑代码。在Vue中，为处理数据并展现至DOM中的vue实例对象。

上面是MVVM及Vue之间的关系，Vue用Vue类的实例化对象来操纵DOM，其传入参数options为一个对象{}包含多个参数，主要讲解下面几个：

- el ：挂载的Dom元素，入参为DOM的id
- data：该挂载的DOM元素中所用到的数据，由一个对象包裹，以键值对的形式呈现。
- methods：该挂载的DOM元素中所用的方法，由一个对象包裹，以键值对的形式呈现。

## 二、生命周期

生命周期一般分为三个阶段：

- **挂载**：vue实例对象的构造阶段，包括四个钩子函数：beforeCreate，**created** 此时vue实例对象已经初始化完成，beforeMount，**mounted** 此时vue实例对象已经在页面渲染完成。
- **更新**：beforeUpdate，**updated** vue实例中data的数据发生更改，并重新渲染vue实例对象完成。
- **销毁**：beforeDestory，**destroyed** vue实例对象拆除了数据监听，事件监听及子组件，vue实例对象销毁完成。

## 三、模板语法

### 1. 插值表达式（DOM内容）

```javascript
<body>
    <div id="app">
        <h2>{{a+b}}</h2>
        <h2>{{a>b}}</h2>
        <h2>{{parseInt(a)+parseInt(b)}}</h2>
        <h2>{{a.split("")}}</h2>
    </div>

    <script src="js/vue.js"></script>
    <script>
        const app = new Vue({
            el: "#app",
            data: {
                a: '1',
                b: '2',
            },
        });
    </script>

</body>
```

插值表达式能向DOM元素的文本节点内插入变量，也可以插入表达式，神奇的是它也会解析一些js代码，有点类似于js内置函数**eval()**。

​	有关向DOM元素的文本节点中插入值的模板命令还有：`v-once`, `v-text`, `v-html`,`v-cloak`。

### 2. 属性绑定 （v-bind DOM属性）

```javascript
<body>
    <div id="app">
        <img v-bind:src="imgSrc" alt="">
        <a :href="aHref">点击跳转</a>
    </div>

  <script src="js/vue.js"></script>
  <script>
        const app = new Vue({
            el: '#app',
            data: {
                imgSrc: 'https://i0.hdslb.com/bfs/archive/c5c95976d27fb1d75470d98828eadf90039a72ed.jpg@412w_232h_1c.jpg',
                aHref: 'https://www.baidu.com'
            },
        });
    </script>

</body>
```

​	DOM中的属性也可以随自定义变量的改变而响应式改变，由`v-bind`命令实现，语法糖 `:` 。

#### 特殊属性class

```javascript
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .list {
            color: red;
            list-style: none;
        }
        
        .active {
            color: blue;
        }
    </style>
</head>

<body>
    <div id="app">
        <ul>
            <li class="list" :class="{active:isActive}">Hello</li>
        </ul>
        <button @click="changeColor">变色</button>
    </div>

    <script src="js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                isActive: false,
            },
            methods: {
                changeColor: function() {
                    this.isActive = !this.isActive;
                }
            }
        });
    </script>

</body>
```

​	DOM元素有一个特殊属性 `class` 用于描述CSS与DOM元素之间的挂载关系，如果用原生js修改DOM的样式，则是`element.className` 修改（注意是className不是class）。而vue则是通过属性绑定class，用对象的形式来控制class中是否含有某个选择器 `{key:value}`, 其中`key是style中的类名选择器`，`value是bool值为true或false` 。vue用属性绑定来控制类名选择器的开关。

​	还有一点要注意，DOM可以拥有两个class（一个未被v-bind绑定数据，一个绑定了），最终呈现的结果是**未被绑定和被绑定的class会合并为一个class**。

​	下面是一个例子：有一个列表，鼠标点击li的时候，该li的文本颜色改变。原生js：事件委托ul上绑定click事件监听，排他思想将所有li的className为空，将`event.target` 的className赋予active类选择器 （event.target为具体触发事件的DOM元素）。注意vue的实现，不是将isActive设置成一个bool数组，而是设置成li对应的编号，通过判断isActive与当前编号i是否相同，决定该li的class是否拥有active（如果isActive设置成布尔数组  `:class={active:isActive[i]}` 将解析不出）。

```javascript
<style>
        .active {
            color: red;
        }
</style>

<body>
    <div id="app">
        <ul>
            <li v-for="(item,i) in fruit" :class="{active:isActive==i}" @click="changeColor(i)">{{item}}</li>
        </ul>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                fruit: ['banana', 'orange', 'apple'],
                isActive: -1,
            },
            methods: {
                changeColor: function(i) {
                    this.isActive = i;
                }
            }
        })
    </script>

</body>
```

#### 特殊属性style

​	DOM元素中还有一个style属性也是描述CSS与DOM元素之间的关系（style是内联样式，class是放于\<style>标签的类选择器，\<style>属于内部样式。它们之间有优先级关系，具体查看css的优先级）。原生js：`document.style.css属性`，例如：`document.style.fontSize` 修改元素内联样式的font-size属性；通过属性绑定style，也是用对象的形式控制style `{key,value}` ,其中`key是css属性`，`value是具体的值`。看下面一个例子：

```javascript
<body>
    <div id='app'>
        <h2 :style="{backgroundColor: bgColor,fontSize:'50px'}">{{msg}}</h2>
    </div>


    <script src="../js/vue.js"></script>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                msg: 'Hello word',
                bgColor: 'blue',
            },
        });
    </script>

</body>
```

​	这个例子中backgroundColor属性的值被变量bgColor所传递，而fontsize属性则直接给出其值50px。但是在css中应该这么写`font-size：50px`，而不是`fontSize：'50px'`。首先vue通过属性绑定，将style改为一个对象，key的值为css属性`key必须用驼峰命名法`，value的值为变量或常量`value值会被解析，可以理解为value部分就是js语句`，如果写成`fontSize：50px`，那50px会被解析成一个变量，然而data中没有50px命名的变量，所以得用'50px'表示是一个字符串。

### 3. 事件绑定 （v-on DOM事件）

```javascript
<body>
    <div id="app">
        <!-- 1.定义无参数 -->
        <button v-on:click="handleNoParam">无参数</button>
        <!-- 2.定义带参数，调用不传递参数（默认传event） -->
        <button v-on:click="handleHasParam">默认传event</button>
        <!-- 3.定义带参数，调用传递参数（没有event） -->
        <button v-on:click="handleNoEvent(1,2)">无event</button>
        <!-- 4.定义带参数，调用传递参数（有event） -->
        <button v-on:click="handleNoEvent(1,2,$event)">有event</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        var app = new Vue({
            el: '#app',
            data: {

            },
            methods: {
                handleNoParam() {
                    console.log('无参数传递被触发');
                },
                handleHasParam(x, y) {
                    console.log('调用不传实参，默认传event：');
                    console.log(x);
                    console.log(y);
                    // x为event对象，y为undefined
                },
                handleNoEvent(x, y, z) {
                    console.log('调用传参，实参无event：');
                    console.log(x + y);
                    console.log(z);
                    // x，y为实际传递参数值，z为undefined。注意z不能接收默认传递的event
                },
                handleHasEvent(x, y, z) {
                    console.log('调用传参，实参有event：');
                    console.log(x + y);
                    console.log(z);
                    // x，y为实际传递参数值，z为event。注意z接收了传递的event
                },
            }
        })
    </script>

</body>
```

​	事件驱动程序是js程序的一大特点，不同的框架都对这一特点有不同的实现方式，vue也不例外。原生js：DOM 0通过 `element.onclick` 绑定事件，DOM 2通过`element.addEventLister` 绑定事件，两者的区别为前者只能绑定一个事件处理函数，后者可以绑定多个且按绑定顺序触发。Vue：通过`v-on:click`这种形式绑定事件，事件绑定的语法糖为`@`, 也即`v-on:click <=> @click`。

​	Vue中事件调用时应该注意几点:

- 调用时不传递实参，定义时有实参，默认第一个参数接收event对象。
- 调用时传递实参，定义时有实参，默认不传递event对象。
- 调用时传递实参，定义时有实参，且想传递的实参中有event对象，必须手动进行传递。以`$event`传递给函数。（为什么不能用`event`？如果用event，解析时会在vue实例的data中找是否有event变量，而event对象是浏览器生成的，并不是开发者定义的变量，所以不能用event）。

#### 事件修饰符

​	事件触发往往有一些特殊功能通过event对象进行实现，而vue则将这些功能以修饰符的形式跟在v-on指令后面，简化了其操作。以下是几种常用的事件修饰符：

- `@click.stop`: 事件冒泡是可以阻止的，在原生js中通过DOM元素的事件处理程序中传入的`event.stopPropagation()`方法阻止事件的冒泡。
- `@click.prevent`: 有些DOM元素对应事件触发有默认行为（比如在用户点击超链时，页面会进行跳转）。在原生js中通过`event.preventDefault()`方法阻止事件触发后的默认行为。
- `@keyup.enter`or`@keyup.delete`：用于监听键盘事件，按下回车和删除键，键盘弹起时候的触发事件处理函数。原生js中需要监听`document.keyup`事件，在事件函数中判断`event.keyCode` 键码，从而触发对应的事件处理代码。

### 4. 表单绑定（v-model）

​	上面的指令无论是`v-bind`，还是`{{}}插值表达式`，都是从vue实例data中的数据，影响DOM中的值，这实际上是一种单向绑定`data->DOM元素`。那么反过来想，DOM元素值的改变能不能影响data中的变量呢？即另一种单向绑定`DOM元素->data`。

​	首先我们考虑一下，什么DOM元素能暴露一些值给用户进行修改？显然是具有交互属性的DOM元素，比如`input`输入框，`textarea`文本框，`radio`单选框，`checkbox`多选框，`select`下拉选择框，这些DOM元素都具有`value`属性将当前值暴露给用户。用户在"输入"，"选择"的同时会改变DOM元素的`value`值，又由于单向绑定`DOM元素->data`会改变data中的变量值。

​	这些元素毫无例外都属于表单元素，因此vue实现了一个命令 `v-model` ，通过这个命令能实现`data <=> DOM元素`之间的双向数据绑定，而这个命令也多用于表单元素中。下面我们看一个例子：

```javascript
<body>
    <div id="app">
        <!-- v-model双向 -->
        <input type="text" v-model="name" placeholder="请输入您的用户名">
        <!-- 不用v-model实现双向 -->
        <input type="text" :value="name" @input="name = $event.target.value;">
        <div>测试双向绑定： {{name}}</div>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                name: 'hello',
            }
        })
    </script>
</body>
```

​	`v-model`命令实际上是`v-bind`和`v-on`命令结合的语法糖，`v-bind`实现的是`data->DOM元素`的单向绑定，而`v-on`实现的是`DOM元素->data`的单向绑定，它通过听input的`input事件`，当用户输入改变value时，触发该事件将更新后的value值回馈给data中的数据。下面是v-model在表单元素中运用的一些举例：

```javascript
<body>
    <div id="app">
        <!-- radio单选框 -->
        <div>
            <label for="male">
              <input type="radio" id="male" value="male" v-model="sex">男
            </label>
            <label for="female">
              <input type="radio" id="female" value="female" v-model="sex">女
            </label>
        </div>
        <!-- checkbox多选框 -->
        <div>
            <input type="checkbox" value="baseketball" v-model="hobbies">篮球
            <input type="checkbox" value="football" v-model="hobbies">足球
            <input type="checkbox" value="billiards" v-model="hobbies">台球
            <input type="checkbox" value="pingpong" v-model="hobbies">篮球
        </div>
        <!-- select只能选择一个 -->
        <select v-model="fruit">
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="orange">橘子</option>
            <option value="pear">梨子</option>
        </select>
        <!-- select选择多个 -->
        <select v-model="fruits" multiple>
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="orange">橘子</option>
            <option value="pear">梨子</option>
        </select>
    </div>
    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                // radio 单选按钮
                sex: 'male',
                // checkbox 多选按钮
                hobbies: [],
                // select 选择一个
                fruit: 'apple',
                // selec 选择多个
                fruits: [],
            },
        })
    </script>
</body>
```

- `radio`: value有两个取值`male`和`femal`，用户点击改变value的值，绑定至data中的`sex`,sex的取值为二选一。
- `checkbox`: value有多个取值`basketball`,`football`,`billiards`,`pingpong`，用户点击选择多个选项，绑定至data中的`hobbies`中，hobbies为一个数组，存储被选择的项的value。(注意checkbox可以单选和多选，单选的时候绑定值为变量而不是数组)
- `select`: value有多个取值`apple`,`banana`,`orange`,`pear`，用户可以点击选择一个，也可以点击选择多个，当选择一个时绑定至data中的`fruit`变量，当选定多个时绑定至data中的`fruits`数组。

#### 值绑定

​	在使用`checkbox`及`select` 类型的表单元素时，里面含有多个`input`或者`option`元素，只是它们的value的取值不同，所以这些value的取值也可以放入一个数组中通过`v-for`简化html代码，例如简化上一个代码的select选择框：

```javascript
<body>

    <div id="app">
        <select v-model="fruit"> 
            <option v-for="item in selectFruit" :value="item">{{item}}</option>
        </select>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                // 选项的value
                selectFruit: ['apple', 'banana', 'orange', 'pear'],
                // 被选择的value
                fruit: 'apple',
            }
        })
    </script>
</body>
```

#### 修饰符

```javascript
<body>

    <div id="app">
        <!-- .lazy修饰符 -->
        <input type="text" v-model.lazy="msg">
        <div>观察改变msg时机：{{msg}}</div>
        <!-- .number修饰符 -->
        <input type="text" v-model.number="tel">
        <div> 观察tel的数据类型：{{typeof tel}} {{tel}}</div>
        <!-- .trim修饰符 -->
        <input type="text" v-model.trim="hasSpace">
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                msg: 'a',
                tel: '1234',
                hasSpace: '    aaaa   ',
            }
        });
    </script>
</body>
```

​	在`DOM元素->data`传递的过程中，用户改变的value可能需要经过一些处理之后再绑定给data中的变量。而修饰符就是起到对value进行预处理的作用，表单绑定中常见的修饰符有三个：`.lazy`,`.number`，`.trim`。

- `.lazy`:  改变value与data中数据的同步时机（频率），由input事件触发频率变成change事件触发频率。
  - `input事件`：在用户每次改变输入框内容时触发，比如原 value 为'a'，用户输入了 'b' 和 'c'，如果按照input的频率，data中的数据会改变两次，即value 为 'ab' 时一次，为 'abc' 时一次。
  - `change事件`：在用户将焦点从输入框中移走时触发，比如原value为'a'，用户输入了'b' 和 'c' 后按下enter键（或者鼠标点击input元素外），如果按照change的频率，data中的数据会改变一次，即按下enter键后value变为 'abc'。
- `.number`：预处理value，在用户改变value后，在传递给data中变量之前，调用`parseFloat()`方法自动转换为`Number`类型，再传递给data中变量。（默认value值为`String`类型，即输入框内容全是字符串。如果value无法转换为`Number`类型，则会返回`String`类型）
- `.trim`：预处理value，在用户改变value后，在传递给data中变量之前，调用`trim()`方法去除value中两边的空格，再传递给data中变量。

### 5. 分支与循环

#### 分支（v-if）

```javascript
<body>
    <div id="app">
        <input type="text" placeholder="请输入用户账号" v-if="type==0" key='username'>
        <input type="text" placeholder="请输入用户邮箱" v-else-if="type==1" key='email'>
        <input type="text" placeholder="请输入用户手机号" v-else key='tel'>
        <button @click="handleIptType">切换类型</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                type: 0,
            },
            methods: {
                handleIptType() {
                    let rand = parseInt(Math.random() * 3);
                    while (rand == this.type) {
                        rand = parseInt(Math.random() * 3);
                    }
                    this.type = rand;
                }
            }
        })
    </script>

</body>
```

​	类似于js等其他高级语言，vue设置了自己的分支指令`v-if`，其用来在一系列相关的标签中选中一个渲染进DOM中。v-if通常配合 `v-else-if` 及 `v-else`使用，上面的例子，DOM中渲染哪个input是由type的值所决定。

​	对于DOM元素是否出现在页面上，有一个指令与v-if相似，那就是`v-show`,它们存在相同点和不同点：

- 相同
  ​功能都是控制DOM元素能否在页面中显示。
- 不同
  - 可选择标签的范围不同： `v-show`只能控制一个标签是否显示，而`v-if` 可以结合其他分支指令在一系列相关标签中选择一个进行显示。
  - 实现原理不同：`v-show` 是修改DOM元素的style属性中的dislay的值，决定该元素是否显示，这意味着该元素已经渲染在DOM树上面，只是通过修改display样式决定其是否可见。`v-if` 如果为true则将该元素渲染在DOM树上，否则从DOM树中删除。所以`v-if` 的执行开销要比`v-show`大，它必须操纵DOM。

#### 循环（v-for）

```javascript
<body>
    <div id="app">
        <ul>
            <li v-for="(item,i) in fruits">{{i+':'+item}}</li>
        </ul>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                fruits: ['orange', 'apple', 'banana']
            }
        })
    </script>
</body>
```

​	类似于js等其他高级语言，vue设置了自己的循环指令`v-for`，其是用来根据`数组`或 `对象`的长度循环创建相同的DOM元素并放入DOM树中。例如语句`v-for = "(item,i) in fruits"`, 其中`item`是数组的值，而`i`是数组的索引；推广至对象，例如语句`v-for="(value,key) in obj"`,其中 `value` 是对象的值，而`key`是对象的键。

​	注意当v-for绑定一个数组元素时，如果直接修改数组元素的值，其改变不会`响应式`地出现在页面之上，必须通过`array.splice()`,或者`Vue.set(修改对象，修改索引，修改值)`的方式实现。例如：

```javascript
<body>
  <div id="app">
        <ul>
            <li v-for="item in fruits">{{item}}</li>
        </ul>
        <button @click="changeItem">改变第3个元素值</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                fruits: ['a', 'b', 'c', 'd', 'e']
            },
            methods: {
                changeItem() {
                    // 1. 直接改变数组值，不会更新至页面
                    this.fruits[2] = 'change';
                    // 2. 通过splice方法替换数组值，会更新至页面
                    this.fruits.splice(2, 1, 'change');
                    // 3. 通过Vue.set方法替换数组值，会更新至页面
                    Vue.set(this.fruits, 2, 'change');
                }
            }
        })
    </script>
</body>
```

### ★虚拟DOM和Diff算法

​	为什么要在这里谈论`虚拟DOM和Diff算法`? 因为需要讨论`v-for`中DOM元素的一个属性`key`，其是否需要绑定，以及其绑定的作用，牵扯到虚拟DOM和Diff算法。首先解释什么是虚拟DOM和Diff算法：

- 虚拟DOM：
  HTML页面的结构添加上CSS的修饰后以一颗DOM树的形式呈现，如果用原生的JS直接操作DOM树，那么操作一次页面就需要重构一次然后再重新渲染一次，这样十分消耗浏览器的性能，也即是客户机的性能。那么虚拟DOM的作用是什么呢？
  虚拟DOM就是用JS模拟现有的页面的真实DOM，形成一个副本。在代码需要操纵DOM的过程中，首先操作虚拟DOM，在一顿操作完毕后，再比较虚拟DOM和真实DOM的不同，将不同的部分更新到真实DOM上，从而节省更新DOM的开销。这里将虚拟DOM更新到真实DOM的算法就是Diff算法。
- Diff算法：
  通过比较虚拟DOM及真实DOM结构的不同，将虚拟DOM更新后的内容同步至真实DOM中。至于如何比较？如何更新？就得进行详细的研究，这里只是做一个初步的介绍。

下面看一个`v-if`及`key`的例子说明Diff更新的过程：

```javascript
<body>   
  <div id="app">
        <!-- 没有key -->
        <input type="text" v-if="showIpt" id='ipt1'>
        <input type="text" v-else id='ipt2'>
        <!-- 有key -->
        <input type="text" v-if="showIpt" id='ipt1' key='ipt1'>
        <input type="text" v-else id='ipt2' key='ipt2'>
        <button @click="handleShow">切换文本框</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                showIpt: true,
            },
            methods: {
                handleShow() {
                    this.showIpt = !this.showIpt;
                }
            }
        })
    </script>
</body>
```

​	以上代码原意是想实现，按钮点击，两个input输入框ipt1和ipt2在DOM树上进行更换，但`没有key`和`有key`出现的现象却不同：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/diff1_iQshMcvNzZ.png"/> </div>

​       上面是`没有key`的现象，可以看见input中的输入内容在切换DOM元素后并没有被清空，而是保留在那。按照设想两个input不是会进行完全更换吗？即DOM树中`ipt1`节点会被删除，而在相同位置插入`ipt2`节点，ipt2没有被用户输入过内容，输入框应该为空才对。看图片效果，仿佛ipt1节点还保留在DOM树中，只是改变了id而已。事实上也正是如此，因为ip1和ip2除了id外并没有什么不同，所以Diff算法在将虚拟DOM更新至真实DOM的过程中，扫描到此处发现同样位置的两个节点只是id不同而已，所以在真实DOM中将ipt1节点保留并修改其id作为更新操作。加上key属性效果如何？

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/diff2_FXzmwNjMZ5.png"/> </div>

​	加入key属性后，发现输入框被清空，说明`ipt1`在DOM树上被完全清除，并插入了新的`ipt2`元素节点。所以我们可以得出结论：key对Diff算法的影响是——给DOM元素节点打`标签`用以完全区分元素节点。

下面看一个`v-for`及`key`的例子说明Diff更新的过程：

```javascript
<body>
  <div id="app">
        <ul>
            <!-- key绑定i -->
            <li v-for="(item,i) in fruits" :key="i">{{item}}</li>
            <!-- key绑定item -->
            <li v-for="(item,i) in fruits" :key="item">{{item}}</li>
        </ul>
        <button @click="add">加入一个z节点在第三个位置</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                fruits: ['a', 'b', 'c', 'd', 'e']
            },
            methods: {
                add() {
                    this.fruits.splice(2, 0, 'z');
                }
            }
        })
    </script>
</body>
```

​	以上代码想实现：点击按钮，在`ul`的第三个位置加入一个文本内容为`z`的`li`元素节点。所有li都绑定了`key`属性，一个绑定的是fruits中的索引 `i` ，一个绑定的是fruits中的值`item`，这两种绑定有什么区别？

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/diff3_-NZOtqSC0G.png"/> </div>

​	上面是`key绑定为i`的diff执行过程，根据前面我们知道，key唯一标识了一个元素节点。在0，1，2 节点对比过程中发现没有任何变化，所以`蓝箭头`不做任何操作，在3，4节点对比中发现3的内容由d改为z，4的内容由e改为d，所以`红箭头`执行两次更新操作，即更新3，4节点的文本内容，最后5节点在真实DOM中没有，作为插入操作。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/diff4_pFEhK7C4zK.png"/> </div>

​	上面是`key绑定为item`的diff执行过程。同上面一样，扫描a，b，c 元素节点发现没有任何变化，扫描到z时，发现与d不匹配，此时从尾部开始扫描；e，d 元素节点没有任何变化，所以`蓝箭头`不做任何操作，最后发现z是多出来的节点，在 c 之后插入一个元素节点其key为z，文本内容为z，`红箭头` 为插入操作。

​	总结，当`key绑定为i`时，diff执行过程中一共有两次更新操作，一次插入操作；而`key绑定为item`时，diff执行过程中一共只有一次插入操作，所以`key的取值对diff算法`的执行同样重要。key绑定为i时，设想如果没有绑定key，那么diff的执行步骤是一样吗？显然是一样的。

​	那么虚拟DOM和Diff算法起到了一个什么作用呢？

​	引用一位博主的话说：`这些东西都是为了保证一件事，让页面的这些节点，能复用的尽量复用，减少重新创建节点的次数，减少对DOM元素节点的频繁操作`。

### 6.  计算属性

​	当我们需要处理vue实例data中包含的数据，将其转化为一个返回值作为输出时，我们需要用到计算属性。计算属性形式上是一个`变量名` ，其变量值是函数的返回结果。听起来计算属性不就是一个函数吗？输入是data中的一些变量，输出是对变量经过逻辑处理后的结果。vue中将其与函数区分开，肯定有其特别之处。下面是计算属性的一个例子：

```javascript
<body>
    <div id="app">
        <h2>总价格:{{totalPrice}}</h2>
    </div>

    <script src="../js/vue.js"></script>
    <script> 
        var app = new Vue({
            el: '#app',
            data: {
                books: [{
                    id: 110,
                    name: 'Linux编程艺术',
                    price: 100
                }, {
                    id: 110,
                    name: '代码大全',
                    price: 50
                }, ],
            },
            computed: {
                totalPrice: function() {
                    let result = 0;
                    for (let i = 0; i < this.books.length; i++) {
                        result += this.books[i].price;
                    }
                    return result;
                }
            }
        });
    </script>

</body>
```

​	totalPrice是一个计算属性，其用books数组中的元素作为输入，求出每个元素中price的累加和。当books中任意一个元素的price改变时，totalPrice也会随之改变，这一特点贯彻了vue的“响应式”特性。那么计算属性和函数之间有什么区别呢？看下面一段代码

```javascript
<body>
  <div id="app">
        <!-- 调用函数 -->
        <h2>{{getFullName()}}</h2>
        <h2>{{getFullName()}}</h2>
        <!-- 引用计算属性 -->
        <h2>{{fullName}}</h2>
        <h2>{{fullName}}</h2>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                firstName: 'Weichen',
                lastName: 'Ding'
            },
            methods: {
                getFullName: function() {
                    console.log('函数被调用');
                    return this.firstName + ' ' + this.lastName;
                }
            },
            computed: {
                fullName: function() {
                    console.log('计算属性被调用');
                    return this.firstName + ' ' + this.lastName;
                }
            }
        });
    </script>

</body>
```

- 相同点：vue实例data中的数据发生改变导致返回值改变时，函数和计算属性都会随之被调用并更新在DOM上。
- 不同点：
  - 在使用上，函数要加（）表示调用`getFullName()`而计算属性不用`fullName`
  - 在原理上，计算属性监听data的输入参数的变化并对返回值有一个缓存。当输入参数不变时，计算属性只会调用一次，而函数有几处调用语句它就被调用几次。因为其输入参数没变，相应的，返回值也不会变。所以计算属性的执行性能比函数更好。

#### 侦听器

​	侦听器像计算属性那样监听data中的变量，但是与计算属性不同的是，一个计算属性可以监听多个变量，而一个侦听器只能监听一个变量。在数据变化后，只有需要 `执行异步` 或`开销较大` 的操作时，侦听器才是最有用的。下面是侦听器的一个例子：

```javascript
<body>
    <div id='app'>
        <span>用户名</span>
        <span><input type='text' v-model.lazy='uname'></span>
        <span>{{tip}}</span>
    </div>

    <script src='./js/vue.js'></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                uname: '',
                tip: '',
            },
            methods: {
                identify: function(newVal) {
                    var app = this;
                    setTimeout(function() {
                        if (newVal == 'admin') {
                            app.tip = '该用户名已经存在';
                        } else {
                            app.tip = '该用户名可以使用';
                        }
                    }, 5000);
                }
            },
            watch: {
                // 监视的变量名：function（变量修改后的值）{}
                uname: function(newVal) {
                    this.tip = '正在验证...';
                    this.identify(newVal);
                }
            }
        });
    </script>
</body>
```

​	上面的例子实现的是input框中双向绑定了变量`uname`，当用户输入内容时，改变了uname的值。等用户将焦点从输入框中移出后，触发监听器，调用异步验证函数 `identify`, 5s后会显示验证结果。

#### 过滤器

​	过滤器的功能是将某些变量进行格式化，以另一种形式呈现在页面中，这里放在计算属性下面，是因为与计算属性的写法相似。都是通过输入data中的某些变量，输出一些值，且随着这个变量的变化值也会发生变化。如下面代码：

```javascript
<body>
    <div id="app">
        <span>零售价为：{{price  | showPrice}}</span>
    </div>

    <script src='../js/vue.js'></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                price: 10,
            },
            filters: {
                showPrice(price) {
                    return '￥' + price.toFixed(2);
                }
            }
        });
    </script>
</body>
```

​	与计算属性不同的是，计算属性可以直接通过`this`访问data中的数据，并`响应式`地绑定这些数据，而过滤器必须在`插值表达式`中传入参数，通过传入参数`响应式`地绑定data中的数据。

**总结**

​	计算属性、侦听器和过滤器都监听data中的数据，一旦数据发生改变它们便会被触发。但是它们的监听数据所实现的功能不同，计算属性是 `对data中的几个变量进行逻辑处理，并将处理结果返回成该计算属性，计算属性就是接收返回结果的一个变量`，侦听器是 `监听data中的一个变量，当变量发生改变时调用一些异步操作`，过滤器是 `对data中的变量监听，并将变量进行格式化`。

## 四、组件化

​	Vue将页面划分为 `组件` ，`组件` 是vue中程序开发的最小单位，它封装了HTML代码和JS代码。每个组件具有特定的DOM结构及功能，可以多次复用，组件间的关系以`多叉树`的形式呈现，及在Vue中至少有一个根组件。下面是组件的一个简单示例：

```javascript
<body>
    <div id="app">
        <!-- 3.使用组件 -->
        <hellow-world></hellow-world>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        // 1.用Vue类的extend方法：创建一个组件构造器
        const hwConstructor = Vue.extend({
            template: `
             <div> Hellow world</div>   
            `
        });
        // 2. 用Vue类的compontent方法：注册组件，定义组件名称
        Vue.component('hellow-world', hwConstructor);

        // 注意：使用组件的元素必须被挂载在一个vue实例上才能生效
        const app = new Vue({
            el: '#app',
        });
    </script>

</body>
```

​一个组件的产生过程分为三步：1.创建构造器  2. 注册组件 3. 使用组件

- 创建组件构造器：通过Vue类的`extend`方法创建一个组件构造器，其中有几个参数。
  - template：模板，通常用es6中的模板字符串书写，表示该组件的DOM结构
- 注册组件：注意注册组件的方式对组件的作用域有影响。其中用Vue类的`component`方法称作`全局注册`，还有一种注册方式叫`局部注册`。
- 使用组件：直接在父组件或者DOM元素中使用即可，注意 `DOM元素必须挂载在一个vue实例之下` 。

**语法糖**

​	为了简化组件的使用过程，可以将第一步和第二步合成为一步，其中合成接口就是将`Vue.extend({...})`方法中传入的组件对象，直接放到使用组件构造器的地方（实际免去了用`组件对象`生成`组件构造器`的步骤）。上面的代码可以用语法糖简化如下：

```javascript
<body>
    <div id="app">
        <!-- 2.使用组件 -->
        <hellow-world></hellow-world>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        // 1. 用Vue类的compontent方法：注册一个全局组件
        Vue.component('hellow-world', {
            template: `
             <div> Hellow world</div>   
            `
        });

        const app = new Vue({
            el: '#app',
        });
    </script>

</body>
```

**模板抽离**

​	在定义一个组件时，需要`组件名称`和`组件对象`,而组件对象中有`template:''`这样一个属性，它表示了`组件的DOM结构`，如果组件结构复杂的话会显得组件对象难以阅读，所以可以将temple放在script标签外的`<template></template>`标签中定义，并通过标签的`id`属性进行引用。所以上述代码又可以进行简写，将 组件对象中的template属性分离：

```javascript
<body>
    
    <div id="app">
        <hellow-world></hellow-world>
    </div>
    <!--通过<template> 定义某个组件的DOM结构 -->
    <template id='helloworld'>
        <div> Hellow world</div>   
    </template>

    <script src="../js/vue.js"></script>
    <script>
        Vue.component('hellow-world', {
            // 分离 template
            template: '#helloworld',
        });

        const app = new Vue({
            el: '#app',
        });
    </script>

</body>

```

​	注意：`template中必须包含一个<div>将内容给包裹起来`，否则会`报错`。

### ★组件中的data

​	有时候我们会思考，组件和vue实例初始化的时候都是输入一个对象option，且该对象中都有data，methods，components，生命周期的钩子函数created，mounted等等属性。那么就有个问题：

```javascript
<body>

    <div id="app"> </div>

    <script src="../js/vue.js"></script>
    <script>
        // 全局组件
        Vue.component('cpn', {
            template: `
                <div>静态字符串,没绑定变量</div>
            `,
            data(){
                return{
                    
                }
            },
            methods: {

            },
            components: {

            },
            created() {

            },
            mounted() {

            },
        });
        // vue实例
        const app = new Vue({
            el: '#app',
            data: {

            },
            methods: {

            },
            components: {

            },
            created() {

            },
            mounted() {

            },
        });
    </script>

</body>
```

​	**''组件'' 和''实例''为何如此相似，它们之间存在什么关系吗？**

- 相同：
  它们具有共同的原型Vue，它们是Vue原型的不同实例。类似于面向对象中由一个基类继承的不同子类后实例化的不同对象。
- 不同点：
  `vue实例`是作用在DOM元素上面，它是Vue方便操纵DOM元素的一个`接口`，通过vue实例能很好地实现对DOM元素的管理，如数据双向绑定、创建子元素节点、事件监听等。总结来说，`vue实例是DOM元素的工具类`。
  `组件`是对DOM元素节点的一个`封装`,它是一个独立的单元。组件中有自己特定的HTML骨架，还有自己特定的数据，方法，事件监听函数等。`组件` 之所以和vue实例类似，因为组件本身就是一个组合起来的DOM元素，Vue又必须用vue实例来管理DOM元素，所以组件中仿佛`内嵌`了一个vue实例便于被管理。且其区别于vue实例的最大特点是 `复用性`，一个vue实例只能挂载一个DOM元素，而一个组件可以在页面中被复用n次。 总结来说，`组件是DOM元素的封装类`。
  那么组件中是否能像vue实例那样，根据data中的数据修改DOM元素的内容呢?
  ```javascript
  <body>

      <div id="app">
          <h2>{{msg}}</h2>
          <cpn></cpn>
      </div>

      <script src="../js/vue.js"></script>
      <script>
          Vue.component('cpn', {
              template: `
                  <div>
                      <p> 静态字符串,没绑定变量 </p>
                      <h2>{{msg}}</h2>
                  </div>
              `,
              data() {
                  return {
                      msg: '我是cpn组件data的msg,这里被单向绑定了',
                  }
              }
          });

          const app = new Vue({
              el: '#app',
              data: {
                  msg: '我是vue实例data的msg'
              },
          });
      </script>

  </body>
  ```
  如上例所示，组件也有自己的data，里面的数据控制的是自己封装的DOM元素（即template）中的内容，而vue实例的data控制的是挂载的DOM元素中的内容。且它们的表现形式不一样，vue实例中的是`data{key:value}`, 而组件中的是 `data(){ return { key: value} }`。那么就有了第二个问题：

  **组件中的data为什么要用函数返回 ，为什么是函数的形式而不是简单的对象？**

  ​	前面我们讲了，vue实例和DOM元素是一对一，那么vue实例的data只有该DOM元素能访问到；而组件具有复用性，即一个组件可以被多次使用在不同的DOM节点中，虽然它们`长得一样`,但是是同一个组件的不同实例，得有自己的`内存空间`。

  ​	所以组件的data以函数的形式返回一个对象，在组件每次被使用（生成一个实例）时，`data(){return{key :value}}`都会被调用一次，以生成自己的数据空间，防止出现`变量共享`的情况。

  这里再增加一个组件和vue实例相关的问题，第三个问题：

  **vue实例中的 el 和 template 有什么关系?**

  ​	组件定义时通过template构造其DOM骨架，而vue实例中也有template属性构造其骨架，所以vue实例也有template属性，进一步证明了vue实例和组件是Vue原型的不同子类。但是，vue实例通过el已经挂载过了一个DOM元素，该DOM元素也有自己的骨架，那么就存在两个骨架：`被挂载元素的DOM骨架` 和 vue实例 `template定义的DOM骨架`，它们之间的关系是 `template定义的DOM骨架在渲染时会取代被挂载DOM元素的骨架`，即在原来的位置删除原DOM元素，后把 template 定义的DOM元素放入其中。

### 1. 全局注册和局部注册

​	在生成组件过程中，我们提到第二步 `注册组件` 有两种方式：`全局注册`和 `局部注册`。他们之间的区别就是划分了组件的使用范围。

#### 全局注册

```javascript
<body>

    <div id="area1">
        <global-cp></global-cp>
    </div>
    <div id="area2">
        <global-cp></global-cp>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const globalcpConstructor = Vue.extend({
            template: `
                <div>
                    <p>我是全局组件</p>
                </div> 
            `,
        });
        // 全局注册方式
        Vue.component('global-cp', globalcpConstructor);

        const area1 = new Vue({
            el: '#area1',
        });
        const area2 = new Vue({
            el: '#area2',
        });
    </script>

</body>
```

​	`全局注册`的方式是用`Vue类`的`component方法`，在`<script> </script>`标签中进行注册。全局注册的组件的作用范围为：`该页面内所有挂载了vue实例的DOM元素`。例如，例子中两个DOM元素area1和area2都可以使用全局注册的`<global-cp></global-cp>`组件。另外，`Vue.component()`带有两个参数，第一个参数为`组件名称`，第二个参数为`组件构造器`。

#### 局部注册

```javascript
<body>

    <div id="area1">
        <local-cp></local-cp>
    </div>
    <div id="area2">
        <local-cp></local-cp>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const localcpConstructor = Vue.extend({
            template: `
                <div>
                    <p>我是局部组件</p>
                </div> 
            `,
        });
        const area1 = new Vue({
            el: '#area1',
            // 局部注册方式
            components: {
                'local-cp': localcpConstructor,
            }
        });
        const area2 = new Vue({
            el: '#area2',
        });
    </script>

</body>
```

​	`局部注册`的方式是用`Vue实例`的`components属性`, 在vue实例的`components:{key:value}`对象中进行注册。局部注册的组件作用范围为：`当前注册该组件的vue实例所挂在的DOM元素`。例如，例子中两个DOM元素area1和area2，只有area1挂载的vue实例局部注册了`<loacl-cp></loacl-cp>`组件，只有area1能使用该组件。另外，Vue实例的components属性是一个对象，其`key`为`组件名称`，`value`为`组件构造器`。

### 2. 父组件和子组件

​	前面说过，组件之间的关系以一颗多叉树的形式呈现，所以组件之间也存在`层级关系`。定义这种关系的`纽带` 就是父组件的`components`属性。如以下代码：

```javascript
<body>

    <div id="app">
        <father-cp></father-cp>
    </div>

    <!-- 父组件template -->
    <template id="fatherTel">
        <div>
            <h2>我是父组件</h2>
            <!-- 2.引用子组件 -->
            <son-cp></son-cp> 
        </div>    
    </template>
    <!-- 子组件template -->
    <template id="sonTel">
        <div>
            <h3>我是子组件</h3>
        </div>
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const fatherCp = Vue.component('father-cp', {
            template: '#fatherTel',
            // 1.通过components属性建立关系
            components: {
                'son-cp': {
                    template: '#sonTel',
                },
            }
        });

        const app = new Vue({
            el: '#app',
        });
    </script>

</body>
```

​	代码用了`vue组件定义的语法糖`和`模板抽离`语法。首先全局注册了一个父组件`<father-cp></father-cp>`,接着通过父组件的components属性`局部注册`了其子组件`<son-cp></son-cp>`。其中两个组件的组件对象中的`template`属性均进行了抽离，注意：`template中必须包含一个<div>将内容给包裹起来`，否则会`报错`。

#### 2.1 组件间的数据传递

#### 父传子（props）

​	通常是父组件向服务端发起网络请求，请求到数据后将数据传输给子组件让其渲染出来。这一过程要用到父组件向子组件传递数据。

```javascript
<body>

    <div id="app">
        <!-- 1. 传入：将数据通过v-bind传入子组件，并给变量重命名，不能用驼峰命名法 -->
        <child-cpn :cmsg="msg" :cfruits="fruits"></child-cpn>
    </div>
    <!-- 子组件的DOM -->
    <template id="childCpn">
        <div>
            <p>{{cmsg}}</p>
            <p>{{cfruits}}</p>
        </div>
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                msg: '我要传给子组件',
                fruits: ['我', '也', '要', '传', '给', '子', '组', '件'],
            },
            components: {
                'child-cpn': {
                    template: '#childCpn',
                    // 2. 接收：接收父组件传递数据
                    // 方式1：数组
                    // props: ['cmsg', 'cfruits'],
                    // 方式2：对象
                    props: {
                        cmsg: {
                            type: String,
                            required: true,
                            default: '默认值',
                        },
                        cfruits: {
                            type: Array,
                            required: true,
                            default () {
                                return [];
                            }
                        }
                    }
                }
            }
        });
    </script>

</body>

```

​	上面例子中，把名为app的 `vue实例` 当作父组件，在app的 `components` 中 `局部注册` 了一个子组件 `<child-cpn></child-cpn>`。因为组件之间是相互独立的，它们之间不能随便访问数据，现在想在父组件 `app` 中给子组件 `chilid-cpn`传递两个变量：字符串`msg` 和 数组 `fruits`。

​	传递的过程如上例所示，在子组件实例生成处，通过 v-bind指令传递数据并给这些变量在子组件中重新命名。`msg` -> `cmsg`、`fruits` -> `cfruits`。在子组件定义处，通过 `props`属性接收传递过来的数据，并在`template` 中使用这些数据。下面是几个注意的点：

- 传递：传递时，被传递的数据会在子组件中进行重命名，记住这些`重命名不能使用驼峰命名法`。
- 接收：接收时，props属性接收有两种形式
  - `props:[str1,str2]`：以数组的方式进行接收，其中str1和str2均为对传递变量的重命名。
  - `props:{key:{}}`：以对象的方式进行接收，其中key为对传递变量的重命名，value为一个对象，里面包含了许多参数。
    - `type`：指定该变量必须传递的类型。
    - `required`：指定该变量必须有实参，即必须被父组件传递值。
    - `default`：该变量的默认值，即父组件没传递值的时候，该变量在子组件中的默认值。注意该变量的类型为数组 `type:Array` 或对象 `type:Object`时，defult必须以这种形式指定默认值`defult(){return []; }`、`defult(){ return {}; }`。

#### 子传父（自定义事件和\$emit）

​	当子组件被用户点击时，需要向父组件传递被点击的那个按钮包含的信息。例如购物页面，整个页面是一个父组件，其中一个子组件是页面中的导航栏，用户点击导航栏的某个选项，点击事件发生在子组件上，它如何向父组件传递这个信息呢？

```javascript
<body>
    <!-- 父组件模板 -->
    <div id="app">
        <!-- 2.接收：通过自定义事件getSelect -->
        <select-cpn @get-select="getSelect"></select-cpn>
        <h2>点击的选项栏为：{{select}}</h2>
    </div>
    <!-- 子组件模板 -->
    <template id="countCpn">
        <ul>
            <li v-for="item in categories">
                <button @click="sendSelect(item)">{{item.name}}</button>
            </li>
        </ul>
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                select: '',
            },
            methods: {
                getSelect(id, name) {
                    this.select = id + name;
                }
            },
            components: {
                'select-cpn': {
                    template: '#countCpn',
                    data() {
                        return {
                            categories: [{
                                id: 1,
                                name: '热门推荐',
                            }, {
                                id: 2,
                                name: '手机数码',
                            }, {
                                id: 3,
                                name: '家用家电',
                            }, {
                                id: 4,
                                name: '电脑办公',
                            }, ],
                        }
                    },
                    methods: {
                        sendSelect(item) {
                            // 1.传入：通过自定义事件getSelect
                            this.$emit('get-select', item.id, item.name);
                        }
                    }
                },
            },

        });
    </script>

</body>
```

​	上述例子中，子组件`<select-cpn></select-cpn>`是一个选项栏，当用户点击某个选项时，如何把该选项的id和name传输给父组件`app`呢？有两个步骤：

- 传递：`this.$emit(自定义事件名,...参数)`，通过`this.$emit`方法将id和name传输给父组件，其中自定义事件名为开发者在子组件上自定义的事件，其 `命名方式不可采用驼峰命名法`。
- 接收： `@自定义事件名 = handle `，在子组件实例生成处，通过绑定自定义事件接收子组件传递的参数，其中handle是父组件的事件处理函数，定义在父组件的`methods`属性中。注意：这里直接 `=handle` ,而不是`=handle()`,或者`=handle(...参数)`，它不像函数的调用，它会自己默认传递参数。在父组件methods定义处，`handle(...参数)`, 会默认将子组件传递的变量，传递到定义处的形参中。

**注意： 不建议在被传递数据的组件中，修改这些属于原组件的数据的值。**

```latex
一些结论：
假设父组件传递给子组件一个基本类型的值，比如 a=2。如果在父组件中修改其值，令a=3，那么子组件也会跟着改变。但是，如果在子组件中修改父组件传递过来的a，令a=3，会报错，父组件的a还是等于2。

假设父组件传递给子组件一个引用类型的值，比如obj={name:'ding'}，如果在父组件中修改obj.name='yang'，那么子组件也会跟着改变。如果在子组件中修改父组件传递过来的obj.name='wang',那么父组件也会跟着修改。

所以父组件传递给子组件的一直是地址，这一传递规则与函数中实参向形参传递是一样的。
```

#### 2.2  组件间的互相访问

​	有时候，组件之间可能需要互相调用对方的某个方法，所以才需要对组件之间的互相访问。

#### 父访问子

```javascript
<body>
    <div id="app">
        <table-cpn ref='table1'></table-cpn>
        <table-cpn></table-cpn>
        <button @click="handleClick">重置表单</button>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            methods: {
                handleClick() {
                    // 方式一：通过$children属性访问子组件，注意是$children一个数组
                    this.$children[0].resetForm();
                    // 方式二：通过$refs.'ref名称'访问子组件，注意子组件必须有ref属性
                    this.$refs.table1.resetForm();
                }
            },
            components: {
                'table-cpn': {
                    template: '<div>我是表单</div>',
                    methods: {
                        resetForm() {
                            console.log('表单已重置');
                        }
                    }
                },
            }
        })
    </script>
</body>
```

​	上面的案例中，子组件是一个表单，父组件包含了两个表单；当用户点击父组件中的按钮时希望调用子组件的resetForm方法对表单进行重置。在父组件中访问子组件对象并调用其methods中的方法有两种方式：

- `this.$children[i]`: children是一个组件数组，里面按序存放了当前父组件中所有的子组件，不过这种方式并不常用，因为当组件树中当前节点的子节点改变时，即插入一个节点，则this.children\[i]指向的子节点也会改变。
- `this.$refs.'ref名称'`：使用\$refs方式的前提是 `子组件中有ref='ref名称'`这个属性，通过子组件的ref属性，可以直接访问改子组件对象。这种方法在开发中经常使用，因为其具有靶向性。

#### 子访问父

​	同样子组件也可以访问父组件，通过 `this.$parent` 进行访问。不过子组件访问父组件用的比较少，因为子组件的`复用性`, 每个子组件的父组件可能不同，所以访问父组件的代码在子组件中并不符合复用性。

#### 2.3 插槽

​	组件有自己的DOM结构和逻辑代码，但其完全的封闭性会使得其结构过于单一。`插槽`的作用就是使组件多样化，在同样的结构上面可以呈现不同的内容，但其 `主要还是再原有的DOM结构上添加不同的DOM节点`，即向 `template` 中添加内容。比如组件 template 中有一个\<slot>标签，当第一个组件实例化时，往slot中放入按钮，当第二个组件实例化时，往slot中放入input输入框。插槽就类似于电脑主机上的USB接口，我们可以往接口上插入鼠标，键盘，U盘实现不同的功能。而被封装的电脑主机就是组件。

```javascript
<body>
    <div id="app">
        <!-- 1.不往插槽插东西，显示默认内容 -->
        <cpn></cpn>
        <!-- 2.向插槽插入一颗DOM子树 -->
        <cpn>
            <ul>
                <li><button>按钮</button></li>
                <li><button>按钮</button></li>
            </ul>
        </cpn>
        <!-- 3.向插槽插入另一颗DOM子树 -->
        <cpn>
            <input type="text">
        </cpn>
    </div>
    <template id='cpn'>
        <div>
            <p>子组件</p>
            <!-- 定义一个插槽，插口 -->
            <slot> <p>我是插槽的默认插入物，在这里可以定制化DOM</p> </slot>
        </div>
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            components: {
                'cpn': {
                    template: '#cpn',
                }
            },
        })
    </script>

</body>
```

​	上面的例子中，`<cpn></cpn>` 子组件有一个插槽，我们对子组件进行了三次实例化。第一次没有向插槽插入DOM子树其显示默认内容，第二次插入一个无序列表带有按钮的DOM子树，第三次插入一个输入框的DOM子树。插槽的使用过程可归纳为：

- `定义插槽`: 在组件定义处的template中插入`<slot></slot>`标签，表示可以往这块插入内容。
- `插入内容`: 在组件的实例化中插入DOM子树。

#### 具名插槽

​	上面的例子中，组件中只存在一个插槽，但是如果组件中存在多个插槽。该如何将插入的DOM子树和插槽对应呢？（即如何将外设物和插口对应起来？），看下面一个例子：

```javascript
<body>
    <div id="app">
        <cpn>
            <!-- 插入插槽1 -->
            <template v-slot:slot1>
                <div>
                    <button>按钮</button>
                </div>
            </template>
            <!-- 插入插槽2 -->
            <template v-slot:slot2>
                <div>
                    <input type="text"/>
                </div> 
            </template>
            <!-- 插入插槽3 -->
            <template #slot3>
                <div>
                    <h3 >插入物</h3>
                </div> 
            </template>
        </cpn>
    </div>
    
    <template id='cpn'>
        <div>
            <p>子组件</p>
            <!-- 定义三个插槽，插口 -->
            <slot name="slot1"><p>我是插槽1</p></slot>
            <slot name="slot2"><p>我是插槽2</p></slot>
            <slot name="slot3"><p>我是插槽3</p></slot>    
        </div>
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            components: {
                'cpn': {
                    template: '#cpn',
                }
            },
        })
    </script>

</body>
```

​	以上的例子中，组件有三个插槽，向第一个插槽中插入按钮，第二个插槽中插入文本框，第三个插槽中插入标题，组件被实例化一次。具名插槽的使用可以归纳为：

- `定义插槽name`： 即给插入口贴标签，slot的 `name` 属性表示插槽的标签。
- `关联DOM子树和插槽:`即将插入物和插入口联系起来，首先被插入的DOM子树得在外面裹一层 DOM子树 ，给temple 赋予 `slot` 属性，其中`slot的值必须和要插入的插槽的name值相同`，插入物通过其template的slot属性与插入口的name属性配对。

#### 作用域插槽

​	在讲述作用域插槽的作用之前，先看下面一个例子：

```javascript
<body>
    <div id="app">
        <cpn>
            <template v-slot:slot1 >
                <div>{{msg}}</div>
            </template>
        </cpn>
    </div>
    
    <template id="cpn">
        <div>
            <p>我是子组件</p>
            <slot name='slot1'></slot>
        </div> 
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                msg: '父组件',
            },
            components: {
                'cpn': {
                    template: '#cpn',
                    data() {
                        return {
                            msg: '子组件',
                        }
                    }
                }
            },
        })
    </script>
</body>
```

在组件`<cpn></cpn>`中有一个插槽口，插入物中放入了一个 msg 变量，但是父组件`app` 和子组件 `cpn` 的data中都有一个msg变量。那么插入物引用的是哪个组件中的msg呢？答案是父组件app中的msg，因为`编译作用域`，类似于JS的`词法作用域`，即变量的作用域是在执行之前根据上下文来确定的，这里的msg在编译之前是处于app的DOM结构中（或者说是app的template），所以引用的是app的msg。

​	那如何将插槽的插入物中的变量的作用域改变，使其引用的是子组件 `cpn` 中的msg呢?

```javascript
<body>
    <div id="app">
        <cpn>
            <!-- 2. 通过插入物的template模板的slot-cope属性拿到插口slot的引用 -->
            <template v-slot:slot1="slot1Props">
                <!-- 3. 通过插口引用，使用组件中被重命名的变量 -->
                <div>{{slot1Props.row}}</div>
            </template>
        </cpn>
    </div>
    
    <template id="cpn">
        <div>
            <p>我是子组件</p>
            <!--1. 在插口定义处绑定变量，并给变量重命名。比如这里cpn的data中的msg被重命名为row -->
            <slot name='slot1' :row="msg"></slot>
        </div> 
    </template>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                msg: '父组件',
            },
            components: {
                'cpn': {
                    template: '#cpn',
                    data() {
                        return {
                            msg: '子组件',
                        }
                    }
                }
            },
        })
    </script>
</body>
```

如果想在插入物中引用插口所属组件data中的变量，将其步骤归纳为三步：

- `插口处绑定变量`：在组件的template模板内，插口slot定义的地方，将组件data中的变量通过`v-bind`绑定为自定义属性（重命名）。
- `插入物处获取插口引用`：在实例化组件后，插入物使用的template模板中，使用 `slot-scope="插口引用"` 获取插口的引用，其中`插口引用`名称是自己定义的。
- `通过插口引用使用自定义属性`：在实例化组件后，插入物使用的template模板中，使用`插口引用.自定义属性`获取组件data中的变量，其关联关系为 `插口引用` ->`自定义属性`->`组件中data变量`。

最后，在组件的插入物中使用插口data中数据的目的是什么？我们追溯到插槽的作用，插槽是在封装组件的DOM结构下面指定位置插入一颗DOM子树，这颗DOM子树的呈现方式有很多种，其中可能关联到了插口data中的某些数据，所以作用域插槽的作用就是使用这些数据，将这些数据以不同的方式呈现。（比如msg变量可以放在\<i>标签中呈现斜体，可以放在\<strong>标签中呈现粗体，可以放在\<h3>中呈现成标题）。

## 五、路由(vue-router)

**location.href 和 history.pushState( )**

​	一旦手动修改浏览器的URL，浏览器会自动发起http请求向服务器请求资源。上面两种方式修改浏览器的URL的同时不发起HTTP请求，vue-router通过感知URL的改变将页面进行跳转。

### 1. 安装与配置

通过npm导入vue-router包：

```bash
npm install vue-router --save
```

建立`src/router/index.js`文件：

```javascript
// index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1.通过Vue.use(插件),安装插件
Vue.use(VueRouter)

// 2.创建VueRouter实例
const routes = [

]
const router = new VueRouter({
    routes
})

// 3.导出router对象
export default router
```

在入口文件`main.js`的 `挂载在app上的vue实例`中注册此成员：

```javascript
// main.js
// 1.导入router对象
import router from './router'
// 2.在vue实例中注册router
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
```

### 2. 映射组件与使用

**映射组件**

通过修改 `src/router/index.js`文件建立组件与URL之间的映射关系：

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1.导入组件
import Test from '../components/Test'

Vue.use(VueRouter)

// 2.定义路由
const routes = [
    { path: '/test', component: Test },
]

const router = new VueRouter({
    routes
})
export default router
```

以上建立了 `/test` 路径与 `Test.vue`组件之间的映射关系

**使用路由**

在页面首先加载出来的组件处使用路由，这里我们在`根组件app`处使用路由：

```javascript
// app.vue
<template>
  <div id="app">
    <!-- 1.建立跳转标签 -->
    <router-link to='/test'>测试路由</router-link>
    <!-- 2.用路由占位符：渲染被路由的组件 -->
    <router-view></router-view>
  </div>
</template>
```

*1. 关于router-link*

`router-link`是封装在 `vue-router` 包里面的一个组件，其被渲染后以\<a>\</a>的形式呈现在DOM中，下面是它相关的一些属性：

- `tag`：指定`router-link`之后渲染成什么组件。如果 \<router-link tag="li">\</router-link> ,则该组件最终会被渲染为一个\<li>元素。
- `active-class`： 被渲染后的 `router-link`会有一个属性`router-link-active`，其包含了该元素被点击后生效的样式，`active-class`属性的作用是给这个生效的样式取别名，如\<router-link tag="li" active-class="active">\</router-link>，那么active样式会取代router-link-active生成新样式。

*2. 用代码修改URL \$router*

前面是用过router-link实现点击后修改URL：

```vue
 <router-link to='/test'>测试路由</router-link>
```

实际上，我们可以不用router-link组件实现URL的修改：

```vue
<template>
  <button @click='handJump'>跳转</button>
</template>
<script>
export default {
  methods: {
      handJump(){
          this.$router.push('/test');
      }
  }
}
</script>
```

这里 `this`是当前组件，vue-router插件会给每一个组件绑定`$router`，通过调用它的push方法改变URL，实现页面路由。

*3. 动态路由 \$route*

假设有这样一种URL `/user/:id` ，其绑定的是用户详细页面组件`UserInfo.vue`。我们在`src/router/index.js`中修改如下：

```javascript
// index.js
const routes = [
    { path: '/test', component: Test },
    { path: '/user/:id', component: UserInfo }
]
```

当浏览器的URL为`loaclhost:8080/user/dwc`或者`loaclhost:8080/user/ylr`时，router-view都会渲染出Userinfo.vue组件，且id参数分别为  `dwc` 和`ylr`。那么，我们只知道`/user/:id`路由会跳转至UserInfo组件，如何获取参数id的值呢？

```javascript
<template>
  <div>
    <div class="msg">用户详情页面</div>
    <button @click="getId()">获取id</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    getId(){
      alert(this.$route.params.id);
    }

  },
};
```

其中`this.$route.params.id`用以获取id，`$route`对象为当前URL，`params`属性包含了后面的参数，`.id`获取的是名为id的参数，参数的命名与 index.js配置的映射一致。

`$route`与`$router`有什么区别呢？

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-1_fgZySvmRH5.png"/> </div>

### 3. 更改路由模式

vue-router 默认使用hash模式，其特点是URL中有 `/#/`，而HTML5的history模式则没有这个特点。

在`src/router/index.js`的 router实例生成时修改其路由模式，代码如下：

```javascript
// index.js
const routes = [
    { path: '/', redirect: '/test' },
    { path: '/test', component: Test },
]
const router = new VueRouter({
    routes,
    mode: 'history'
})
```

### 4. 路由懒加载

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-2_ucT5hV_tMS.png"/> </div>

上面是路由懒加载的效果。路由懒加载的目的是：`将vue项目中的组件按路由分块打包，当URL中加载相应组件时，才会开始向服务器请求该组件`。如果不进行懒加载配置，一般的vue项目会由webpack默认打包成三个js文件：

- `app.js`：主要的业务代码打包文件。
- `manifest.js`：底层支撑代码打包文件。
- `vendor.js`：第三方库代码打包文件。

当页面初次请求，首先会请求vedor.js和manifest.js提供代码加载支撑，接着再请求整个app.js。这样似乎看起来没什么问题，但是一旦项目代码数量庞大，所有.vue文件都打包进app.js会导致app.js请求缓慢，阻塞页面的渲染。

路由懒加载就是将app.js打包文件进行分解，他会将该文件分解为app.js +组件.js \* n 个文件。即按照配置的路由与组件的映射关系分解app.js文件。下面看一段懒加载代码：

```javascript
// 配置懒加载
const Test = () => import ('../components/Test')
const UserInfo = () => import ('../components/UserInfo')

const routes = [
    { path: '/test', component: Test },
    { path: '/user/:id', component: UserInfo }
]
```

配置了懒加载后，Test.vue 和 UserInfo.vue文件不会一并打包进app.js中，而是分开打包至两个js文件，等到URL中出现对应映射时才会被请求。&#x20;

### 5. 嵌套路由(子路由)

假设当 Test.vue被路由加载时，我们还想在Test.vue加载的前提下加载Testa.vue和Testb.vue两个模块，即有`/test/testa` 和 `test/testb` 两个路由。我们应做出如下配置：

**映射组件**

```javascript
// index.js
const Test = () => import ('../components/Test')
const TestA = () => import ('../components/Testa')
const TestB = () => import ('../components/Testb')

const routes = [
    {
        path: '/test',
        component: Test,
        children: [
            { path: 'testa', component: TestA },
            { path: 'testb', component: TestB }
        ]
    },
]
```

**使用子路由**

```vue
<template>
  <div>
      <div class='msg'>被路由引用</div>
      <router-link to='/test/testa'>跳转TestA</router-link>
      <router-link to='/test/testb'>跳转TestB</router-link>
      <router-view></router-view>
  </div>
</template>
```

### 6. 路由传参

我们通常能在URL中传递一些参数，参数传递有两种方式：`query传参` 和 `params传参`

#### &#x20;query传参

首先配置映射:

```javascript
// index.js

const route =[
    { path: '/profile', component: Profile }
]
```

通过vue-router修改URL,其中to属性被动态绑定为一个对象：

```vue
// app.vue
<tempalte>
   <div>
       <router-link :to="{
          path:'/profile/',
          query:{ name: name, age: age,}  
      }">传参</router-link>    
   </div>  
</tempalte>

<script>
export default {
  data(){
      return{
          name: 'dwc',
          age:18,
      };
    }
}
</script>
```

通过代码修改URL：

```vue
// app.vue
<tempalte>
   <div>
    <button @click="urlQuery()">传参</button>
   </div>  
</tempalte>

<script>
export default {
  data(){
      return{
          name: 'dwc',
          age:18,
      };
    },
    methods:{
        urlQuery() {
          this.$router.push({
            path: "/profile",
            query: { name: this.name, age: this.age,},
          });
      },
    }
}
</script>
```

以上两种方式都将产生如下的URL:

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-3_lahCJlC6at.png"/> </div>

我们通过代码获取URL的query：

```vue
// Profile.vue
<template>
  <div>
      <button @click="getParams()">获取传递的参数</button>
  </div>
</template>

<script>
export default {
  methods: {
      getParams(){
          console.log(this.$route.query);
      }
  }
}
</script>
```

结果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-4_b1DE46dEsZ.png"/> </div>

#### params传参

首先配置映射，与query传参不同：

```javascript
//index.js

const route =[
   { path: '/profile/:name/:age', component: Profile }
]
```

通过vue-router修改URL,其中to属性被动态绑定为一个对象：

```vue
// app.vue

<tempalte>
   <div>
       <router-link :to="{
          path: '/profile/'+ name + '/'+age,  
      }">传参</router-link>    
   </div>  
</tempalte>

<script>
export default {
  data(){
      return{
          name: 'dwc',
          age:18,
      };
    }
}
</script>
```

通过代码修改URL：

```vue
//app.vue

<tempalte>
   <div>
    <button @click="urlQuery()">传参</button>
   </div>  
</tempalte>

<script>
export default {
  data(){
      return{
          name: 'dwc',
          age:18,
      };
    },
    methods:{
        urlQuery() {
          this.$router.push({
            path: '/profile/'+ this.name + '/'+ this.age,
          });
      },
    }
}
</script>
```

以上两种方式都能产生入下的URL：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-5_aELm7-Xw-G.png"/> </div>

我们通过代码获取URL的params：

```vue
// Profile.vue
<template>
  <div>
      <button @click="getParams()">获取传递的参数</button>
  </div>
</template>

<script>
export default {
  methods: {
      getParams(){
          console.log(this.$route.params);
      }
  }
}
</script>
```

结果如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vueRouter-6_wl_-XZqoCL.png"/> </div>

### 7. 路由导航守卫

路由导航守卫的功能是在URL发生跳转之前，将此跳转拦截下来进行一些操作，本质是一个钩子函数。下面是一个跳转守卫案例：

```javascript
// index.js

const router = new VueRouter({
    routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();

});
```

这里实现的是，login 页面向其他页面的跳转。在跳转发生前会被守卫给拦截下来，检查是否有token，有token就允许跳转，否则就跳转回login页面再次登录。导航守卫内部参数是一个回调函数，该回调函数有三个参数：

- `from`： 跳转前的 `$route`对象，例子中是 `loaclhost:8080/login`。
- `to`：将要跳转至的`$route`对象，例子中是`localhost:8080/home`。
- `next`: 这是一个函数，表示放行，进行正常跳转。也可以传入一些参数修改跳转。

上面是全局路由卫士，路由卫士也可以给某个URL或某个组件单独设置，具体看Vue官方文档。

### 8. 组件缓存(keep-alive)

每个组件都有一个声明周期` created(初始化)->mounted(挂载至DOM)->updated(在DOM上更新)->destroyed(销毁)`，在URL被改变的过程中，router-view渲染出的组件也会不断地被创建和销毁。而 `<keep-alive></keep-alive>` (一个Vue内置组件)的作用就是防止组件频繁被创建和销毁，帮它们做缓存：

```vue
<keep-alive>
  <router-view></router-view>
</keep-alive>
```

假设router-view被渲染的组件有`User.vue, Role.vue, Product.vue`等组件，在URL`/user, /role, /prduct`切换的过程中，每个组件只会创建一个，此后便会被缓存下来，等到再次跳转时再渲染出来。

当然keep-alive还有两个参数

```vue
<keep-alive include="User">
  <router-view></router-view>
</keep-alive>
<keep-alive exclude="Role,Product">
  <router-view></router-view>
</keep-alive>
```

- `include`：被缓存的组件名称。
- `exclude`：不被缓存的组件名称。

上面两个配置都是实现了只缓存User.vue组件的效果。

## 六、Vue脚手架(vue-cli)

​	`脚手架` 是建筑学中的一个术语，它是一个建筑物开始搭建前的骨架。在开发一个Vue项目前，需要文件目录的构建和相关的配置，vue-cli是vue专属的脚手架，它的作用就是自动生成开发一个vue项目所需文件和配置，使得开发者可以直接在脚手架上进行开发。

​	在安装vue-cli之前，确保系统有全局安装 `node`和 `npm`，我们全局安装一个vue-cli3：

```bash
npm install @vue/cli@3.0.4 -g
```

​	运行以下命令查看安装是否成功：

```bash
vue --version
```

### 1. vue-cli 2

上面安装的是vue-cli 3版本，为了使用vue-cli 2我们使用以下命令拉取vue-cli 2的模板：

```bash
npm install @vue/cli-init -g
```

用vue-cli 2 初始化一个项目：

```bash
vue init webpack test-cli2
```

初始化项目后通过命令行配置选择配置项目：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli2_d0u-OogsM4.png"/> </div>

生成项目目录后，对项目文件夹的解析：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli2-mulu_8-R7jxqbOD.jpg"/> </div>

**runtime-compiler 和 runtime-only**

​	在创建项目的过程中，有一个选项给我们选择，开发模式是选择 `runtime-compiler` or `runtime-only` ?  后者比前者项目文件小6KB且运行更快，这是为什么呢？首先我们看下 runtime-compiler 和 runtime-only选项下创建的项目不同之处，在于它们的 src/main.js 文件：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/runtime_xNHfqdDMB6.png"/> </div>

在 new Vue() 实例中它们都想在\<div id="app">\</div>中挂载一个子组件\<App>\</App>，只是方式不同：

- runtime-complier 方式是 `局部注册->template模板编译后挂载`
- runtime-only 方式是 `render函数渲染进DOM中`

那么两种方式有何不同呢？首先我们看一下vue组件如何嵌入真实DOM中：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/runtime2_UphE2lPqIK.png"/> </div>

我们知道template是vue组件的DOM骨架，它被渲染进真实DOM要经历以下过程：`template(等待解析)->ast(解析成抽象语法树)->render(将编译后的template进行渲染)->Virtual DOM(等待更新至真实DOM)-> UI(通过diff算法比较VDOM和原DOM渲染出真实DOM)`，这是一个vue组件至真实DOM中的所有步骤，而两种模式的步骤是不同的：

- `runtime-compiler`：template -> ast -> render -> VDOM -> DOM
- `runtime-only`：render -> VDOM -> DOM

可以发现 runtime-only 比 runtime-compiler 少了两个步骤 `template->ast`，即是对template语法解析过程。所以runtime-only更轻量级。

*那么什么时候用 runtime-only 什么时候用 runtime-compiler呢？*

​	在其他后缀（比如main.js是js文件）文件中使用 `template语法`，则需要选择 runtime-compiler 模式对其进行解析。不过大多数情况都选择 runtime-only 模式以维持项目的执行效率。这里提到其他后缀名的文件需要对 `template语法`进行解析，那么.vue文件也有\* \*\<template>\</template>，为什么 runtime-only 能对其进行解析呢？

​	因为无论是 runtime-only 模式 还是 runtime-compiler 模式，都有一个外部模块（包） `vue-template-compiler`对 .vue 文件中的 `template语法` 进行解析。 &#x20;

### 2. vue-cli 3

用vue-cli 3初始化一个项目：

```bash
vue create testvuecli3
```

初始化项目后通过命令行配置选择配置项目：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli3-1_lFFwYagbSq.png"/> </div>

生成项目目录后，对项目文件夹的解析：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli3-2_eHaYJVQLY_.png"/> </div>

**vue-cli 3的配置文件**

​	在原来用vue-cli 2 生成的项目中 `build `和` config` 文件夹存储了webpack相关配置，而vue-cli 3 项目文件夹没有相关配置，它把webpack相关配置给隐藏了。那么如何获取vue-cli 3搭建项目的webpack配置呢？

`方法一：图形化管理界面`

启动 vue-cli 3 新增的项目管理GUI界面：

```bash
vue ui
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli3-3_Of435Dc8_0.png"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli3-4_ifWJbV7_O9.png"/> </div>

`方法二：vue.config.js 文件`

在vue-cli 3 中，作者将webpack的相关配置隐藏在了 `node_modules/@vue/cli-service/webpack.config.js`路径下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/vue-cli3-5_2oGIhT32bi.png"/> </div>

这是项目的默认 webpack 配置，如果要新增自己的webpack配置，则需要在项目的根目录中添加名为`vue.config.js`的配置文件。

## 七、Vuex

Vuex即是vue的一个**状态管理工具**，所谓 **状态** 可以理解为所有组件的共享变量，**状态管理** 即将所有组件用到的状态，封装进一个工具里面进行管理，所有状态与组件之间的关系是响应式的。

### 1. 安装与使用

Vuex是一个插件首先得安装：

```bash
npm install vuex --save
```

建立 `src/store/index.js` 文件：

```javascript
// index.js
import Vue from 'vue'
import Vuex from 'vuex'

// 1.安装插件
Vue.use(Vuex)

// 2.创建对象
const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    getters: {},
    modules: {}
})

// 3.导出store对象
export default store
```

在入口文件 `main.js` 的 `挂载在根组件app的vue实例中` 注册此成员：

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
// 1. 导入store对象
import store from './store'

Vue.config.productionTip = false;
// 2. 在vue实例中注册store
new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
```

接下来，展示一个Vuex的使用案例，vuex是用来管理共享变量的，我们在store对象的state属性中定义一个共享变量：

```javascript
// src/store/index.js
const store = new Vuex.Store({
    state: {
        count: 100，
    },
})
```

接着在某个vue组件中引用这个共享变量：

```vue
// app.vue
<template>
  <div id="app">
    <h2>{{$store.state.count}}</h2>
  </div>
</template>
```

效果如下图所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211216211501870_TLNnzKv3Bg.png"/> </div>

如果想修改共享变量count，则必须在store对象的mutations属性中定义修改字段的方法

```javascript
// src/store/index.js
const store = new Vuex.Store({
    state: {
        count: 100，
    },
    mutations:{
        increment(state){
            state.count++;
        },
    },
})
```

然后在某个vue组件中通过`this.$store.commit('')`引用该方法

```vue
// app.vue

<template>
  <div id="app">
    <h2>{{$store.state.count}}</h2>
    <button @click="add">+</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  methods:{
    add(){
      // 引用该方法
       this.$store.commit('increment');
    }
  }
}
</script>
```

效果如下图所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211216214807212_tpA7QkGcSf.png"/> </div>

### 2. store对象核心属性

#### 1. state

​     store对象的state属性即是用于保存vue组件所有共享变量的地方，这里vue官方文档介绍了一个技术名词`单一状态树`。

​      在理解什么是 `单一状态树`前，我们先举一个例子：

:::info 案例1
   在现实生活中，一个人的信息由很多个部门所管理：个人档案、社保记录、公积金记录、结婚登记等...这种分布式的信息管理方式好处是专人专项提高了安全性，坏处是当需要你的完整信息时，必须到每个部门去盖章取出确保权威性。有没有一种机构，拥有一个人的完整信息？
:::

​     而单一状态树就是这种机构，所有资源不采用分布式而是集中式管理：

:::info 案例2
   在vuex中，规定有且只有一个store对象管理vuex包含的所有信息，这就是单一状态树的概念。
:::

#### 2. getters

​        store对象的getters属性用于定义一些函数，这些函数返回的是共享变量进行一些逻辑运算后的值，其作用类似于vue中的计算属性。例如，我想获取count共享变量的乘方：

```javascript
// src/store/index.js

const store = new Vuex.Store({
    state: {
        count: 100,
    },
    mutations: {},
    actions: {},
    getters: {
        powerCount(state) {
            return state.count * state.count;
        }
    },
    modules: {}
})
```

在vue组件中调用该函数:

```vue
// app.vue
<template>
  <div id="app">
    <h2>共享变量count:{{$store.state.count}}</h2>
    <h2>count的乘方:{{$store.getters.powerCount}}</h2>
  </div>
</template>
```

实现效果：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211217105657481_pP4MJbnYI0.png"/> </div>

getters内的函数本身是不接收传参的，但是可以通过其他方式使得其内部函数接收参数：

```javascript
// src/store/index.js
const store = new Vuex.Store({
    state: {
        count: 100,
    },
    mutations: {},
    actions: {},
    getters: {
        nPowerCount(state) {
            return function(n) {
                return Math.pow(state.count, n);
            }
        }
    },
    modules: {}
})

```

在vue组件中调用该函数：

```vue
<template>
  <div id="app">
    <h2>count:{{$store.state.count}}</h2>
    <h2>count^2:{{$store.getters.powerCount}}</h2>
    <h2>count^n:{{$store.getters.nPowerCount(3)}}</h2>
  </div>
</template>
```

实现效果：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211217110307640_ibOTCdITTH.png"/> </div>

#### 3. mutations

​       store对象的mutations属性用于定义一些函数，这些函数是用来给组件修改共享变量的值，例如开始时候我们举了一个例子：

```javascript
// src/store/index.js
const store = new Vuex.Store({
    state: {
        count: 100，
    },
    mutations:{
        increment(state){
            state.count++;
        },
    },
})
```

mutations内的函数同样也在组件中传递参数,这个形参在mutations中被称为payload（载荷）：

```javascript
// src/store/index.js
const store = new Vuex.Store({
    state: {
        count: 100,
    },
    mutations: {
        increment(state) {
            state.count++;
        },
        incrementN(state, payload) {
            state.count += payload.increment;
        }
    },
    actions: {},
    getters: {},
    modules: {}
})
```

在vue组件中传参:

```vue
<template>
  <div id="app">
    <h2>count:{{$store.state.count}}</h2>
    <button @click="addN">+ N</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  methods:{
    addN(){
      // 调用mutations中的incrementN
      this.$store.commit('incrementN',{increment:5});
      // 另外还能通过另一种方式进行调用
      this.$store.commit({
        type:'incrementN',
        increment:5,
      });
    }
  }
}
</script>
```

其效果如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211217112710093_rv38ZMkYZS.png"/> </div>

#### 4. actions

​        如果要在异步操作中修改共享变量，则不能将异步操作定义在store对象的mutations属性中，而应该定义在store对象的actions属性中。

```javascript
// src/store/index.js

const store = new Vuex.Store({
    state: {
        count: 100,
    },
    mutations: {
        // 1. mutations中定义好修改共享变量count的方法
        increment(state) {
            state.count++;
        },
    },
    actions: {
        // 2. 在actions中引用mutations中的方法,context为默认参数等价于store对象
        aIncrement(context) {
            return new Promise((resolve, reject) => {
                // 在异步操作中调用修改函数
                setTimeout(()=>{
                   context.commit('increment');
                },1000); 
            })
        }
    },
    getters: {},
    modules: {}
})
```

在vue组件中调用action中的函数：

```vue
<template>
  <div id="app">
    <h2>count:{{$store.state.count}}</h2>
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  methods:{
    add(){
      this.$store.dispatch('aIncrement')
      .then(data=>{
        console.log(data);
      });
    }
  }
}
</script>
```

### 3. Vuex的响应式

​        Vuex也实现了vue中的响应式特性，即在store对象中定义的共享变量，一旦被某一个组件修改，就会将其映射到其他引用该共享变量的组件上。

​        但值得注意的是，这些响应式共享变量是初始化时那些被Vue框架所监听的共享变量，后续加入的变量得采用Vue提供的特定API才能被监听到，实现响应式的效果。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20211217162648614_TED8W_3BGi.png"/> </div>
