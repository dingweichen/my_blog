# Vue3新特性

## Vue3.0

### 一、生命周期

​	Vue3.0的生命周期与Vue2.0相似，有几处修改：

- `setup`：对应Vue2.0的 beforeCreate 和 created，是Composition AIP的入口API
- `beforeUnmount, unmounted`：对应2.0的 beforeDestroyed 和 destroyed

且生命周期的钩子函数写法不同，必须先 import 导入，在 setup函数中调用：

```javascript
<script>
import { onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted} from "vue";
export default {
  // setup钩子等价于 beforeCreate 和 created
  setup() {
    console.log("setup");
      
    onBeforeMount(() => {
      console.log("onBeforeMount");
    });
    onMounted(() => {
      console.log("onMounted");
    });
    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });
    onUpdated(() => {
      console.log("onUpdated");
    });
    // 等价于beforeDestroy
    onBeforeUnmount(() => {
      console.log("onBeforeUnmount");
    });
    // 等价于destoryed
    onUnmounted(() => {
      console.log("onUnmounted");
    });
  },
};
</script>
```

Vue2.0 的 options API的生命周期写法也兼容，建议不要和vue3.0的 Composition API共存。

### 二、Composition API

​	vue2.0中初始化Vue实例和Vue组件时必须传入一个对象参数，它被叫做 **options**。而 Vue3.0新增了一种传入参数的形式，它被叫做 **composition**。相比于options，composition具有如下优点：

- `更好的代码组织`：options中一个逻辑处理散落在几个部分中，比如数据存储在data中，处理data的方法存储在methods中。composition将一个逻辑处理分为一小块，更有组织性。
- `更好的逻辑复用`：composition逻辑处理不再散乱，复用性更高。
- `更好的类型推导`：options代码的追溯很乱，比如：this.getName可能是data中的数据，也可能是methods中的方法。composition的写法则更好定位变量或函数。

​	composition的出现并不是取代options的，composition的出现是为了弥补Vue框架某些场景的不足，Vue3.0中也兼容options的写法。

> options和composition如何选择?
> ​	首先，两者不建议进行共用：一个组件用options写法，另一个组件用composition写法，这样会引起混乱。options适用于小型项目，因为小型项目的逻辑简单且options便于上手。composition适用于中大型项目，因为中大型项目逻辑复杂，虽然composition具有一定的上手难度，但其更具备规范性。

#### 1. ref & toRef & toRefs

##### 1.1 ref

​	ref **用于生成一个值类型（基本数据类型）的响应式变量**，用ref生成的数据能用于**模板** 和 **reactive** 中。通过 **ref变量名.value** 的方式访问和修改 ref 定义的变量。

> `reactive` 也是composition api中的一个api，其作用是生成一个对象类型的响应式变量。

```javascript
<template>
  <div>
    <!-- 1. ref变量被模板所引用 -->
    <p>{{ ageRef }}</p>
    <p>{{ state.name }}</p>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  setup() {
    // 用ref生成的变量名加上Ref后缀，形如xxxRef
    const ageRef = ref(20);
    const nameRef = ref("丁维琛");

    // 2.ref变量被reactive的对象所引用
    const state = reactive({
      name: nameRef,
    });

    setTimeout(() => {
      // 通过xxxRef.value属性修改变量
      ageRef.value = 24;
      nameRef.value = '丁维琛年长一岁';
    }, 3000);

    return {
      ageRef,
      state,
    };
  },
};
</script>
```

​	在vue2.0中，ref 也被用于获取DOM元素，这一功能也被vue3.0保留下来：

```javascript
<template>
  <div>
    <p ref="elemRef">我是一行文字</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  setup() {
     
    // ref不传入值类型而传入null，表示引用DOM元素
    const elemRef = ref(null);

    onMounted(() => {
      console.log(elemRef.value);
    });
    return {
      elemRef,
    };
  },
};
</script>
```

##### 1.2 toRef

​	toRef也是用于生成一个值类型的响应式变量，不过用 **toRef生成的变量绑定的是响应式对象的某个属性**。

```javascript
<template>
  <div>
    <p>{{ nameRef }}</p>
    <p>未绑定：{{ state.age }}</p>
    <p>已绑定：{{ state.name }}</p>
  </div>
</template>

<script>
import { toRef, reactive } from "vue";
export default {
  setup() {
    // 1.生成一个响应式对象
    const state = reactive({
      age: 20,
      name: "丁维琛",
    });
    // 2.生成一个响应式变量，且绑定state的name属性
    const nameRef = toRef(state, "name");

    setTimeout(() => {
      nameRef.value = "响应式变量->响应式对象";
    }, 1500);

    setTimeout(() => {
      state.name = "响应式对象->响应式变量";
    }, 3000);

    return {
      state,
      nameRef,
    };
  },
};
</script>
```

##### 1.3 toRefs

​	toRefs用于生成多个值类型的响应式变量，不过用**toRefs生成的变量绑定的是响应式对象的所有属性**。

```javascript
<template>
  <div>
    <p>{{ age }}</p>
    <p>{{ name }}</p>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    const state = reactive({
      age: 20,
      name: "丁维琛",
    });

    setTimeout(() => {
      state.age = 24;
    }, 3000);

    return {
      ...state,
    };
  },
};
</script>
```

普通的响应式对象进行解构返回，其单个属性不具备响应式特性，必须使用toRefs对响应式对象的所有属性进行转化，变为响应式变量：

```javascript
<template>
  <div>
    <p>{{ age }}</p>
    <p>{{ name }}</p>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
export default {
  setup() {
    const state = reactive({
      age: 20,
      name: "丁维琛",
    });
    // 1. 用toRefs对响应式对象转化
    const stateRefs = toRefs(state);
    setTimeout(() => {
      state.age = 24;
    }, 3000);

    // 2. 返回解构后的toRefs对象
    return {
      ...stateRefs,
    };
  },
};
</script>
```

toRefs常用于这种场景：一个函数返回值为一个响应式对象时，对返回的响应式对象进行toRefs转化后解构，使得对象的每个属性都具备响应式特性：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220615103356373_UPTOo0fuuH.png"/> </div>

> vue3.0 为什么要提供ref？为什么要提供toRef和toRefs呢？
> ​vue2.0中，数据的响应式是通过data进行注册和监听的；vue3.0中，基本类型的数据通过ref注册，引用类型的数据通过reactive注册。ref使得基本类型数据具备响应式特性，所以十分重要。ref实际上对基本类型值进行了一个封装，返回一个对象， 将基本类型值存储在ref.value中，一旦ref.value被改变，ref的setter监听到，从而实现响应式。
> ​toRef和toRefs的作用是在对具备响应式特性的对象进行解构时，使得结构后该对象的每个属性都具备响应式特性。所以，**toRef 和 toRefs 不是创造响应式，而是延续响应式**。它们实际上是将响应式对象的某个（所有）属性变为了ref对象。

#### 2. useXxxx 逻辑复用

​	将很多组件用到的一个共同逻辑封装成一个函数，**命名为useXxxx**，通过在各个组件的setup中引用useXxxx，实现逻辑复用。

```javascript
// untils.js 文件中定义”逻辑复用“ 函数
import { onMounted, onUnmounted, ref } from "vue";

// 实现组件加载就监听鼠标位置，销毁就不监听
export function useMousePositon() {
    const x = ref(0); // 鼠标x坐标
    const y = ref(0); // 鼠标y坐标

    function updatePos(event) {
        x.value = event.pageX;
        y.value = event.pageY;
    }

    onMounted(() => {
        console.log('组件渲染完成');
        window.addEventListener('mousemove', updatePos);
    });

    onUnmounted(() => {
        console.log('组件被销毁');
        window.removeEventListener('mousemove', updatePos);
    });

    return { x, y };
}
```

```vue
// 任意组件导入”逻辑复用“函数，在setup中调用
<template>
  <div>
    <h3>鼠标X：{{ x }}</h3>
    <h3>鼠标y：{{ y }}</h3>
  </div>
</template>

<script>
import { useMousePositon } from ".././untils/useMousePosition";
export default {
  setup() {
    const { x, y } = useMousePositon();
    return { x, y };
  },
};
</script>
```

### 三、响应式

​	vue3.0通过ES6提供的 `Proxy` 实现响应式，由于Proxy调用了ES6的 `Reflect` ，首先介绍 Reflect。

​	Reflect 是ES6为了操作对象而提供的新API，它的设计目的如下：

- `与Proxy对象的方法一一对应`：只要是Proxy对象的方法，就能在Relfect对象上找到对应的方法
- `将Object的工具函数全部转移至Reflect`：由于Object本身是一种数据类型，设计Reflect的目的是将Object拥有的一些工具函数转移至Reflect对象上，使得Object表示数据类型更存粹。如：name in obj -> Reflect.has( obj, name);  delete obj\[name] -> Reflect.deletePeoperty( obj, name )

​	Proxy是ES6在操作目标对象做的一层 “拦截”，外界对该对象的访问，都必须先通过这层拦截。它提供了一种机制，可以对外界的访问进行过滤和改写。通常为某个对象Proxy化，返回一个具有Proxy属性的新对象proxyObj；当proxyObj调用某些对象的常用方法时（比如get），首先会执行Proxy内部定义的过滤操作，然后再调用Reflect的方法实现一般对象的操作（比如Reflect.get）。

下面是Proxy的基本使用：

```javascript
let obj = {
    age: 20,
    name: '丁维琛'
}

// 将对象Proxy化...
let proxyObj = new Proxy(obj, {
    get: function(target, key, receiver) {
        // 只监听对象本身（非原型的）属性
        const ownKeys = Reflect.ownKeys(target)
        if (ownKeys.includes(key)) {
            // get前的拦截操作...
            console.log('get', key);
        }
        const result = Reflect.get(target, key, receiver); // 用Reflect实现原本的get方法
        return result;
    },
    set: function(target, key, val, receiver) {
        // 设置相同的值，不进行处理
        if (val === target[key]) return true;
        // set前的拦截操作...
        console.log('set', key, val);

        const result = Reflect.set(target, key, val, receiver);
        return result;
    },
    deleteProperty: function(target, key) {
        // delete前的拦截操作...
        console.log('delete', key);

        const result = Reflect.deleteProperty(target, key);
        return result;
    }
});
```

Vue3.0通过 `reactive` 方法实现了引用数据类型的响应式，而reactive内部实际上就是将传入的对象Proxy化，然后返回Proxy化后的对象：

```javascript
function reactive(target = {}) {
    if (typeof target !== 'object' || target === null) return true; // 非引用类型不做处理

    // proxy配置信息
    const proxyConf = {
        get(target, key, receiver) {
            const ownKeys = Reflect.ownKeys(target)
            if (ownKeys.includes(key)) {
                // get前的拦截操作...
                console.log('get', key);
            }

            const result = Reflect.get(target, key, receiver);
            // 重点！！！当被调用就实现深度监听，并不是一次性递归
            return reactive(result);
        },
        set(target, key, val, receiver) {
            if (val === target[key]) return true;
            // set前的拦截操作...
            console.log('set', key, val);

            const result = Reflect.set(target, key, val, receiver);
            return result;
        },
        deleteProperty(target, key) {
            // delete前的拦截操作...
            console.log('delete', key);

            const result = Reflect.deleteProperty(target, key);
            return result;
        }
    };

    return new Proxy(target, proxyConf); // 返回Proxy化后的对象 
}
```

vue3.0通过Proxy实现响应式，而Vue2.0通过 `Object.defineProperty`实现响应式。Proxy相比于Object.defineProperty的优势如下：

> Proxy能够监听新增的属性，且能监听数组。
> Proxy实现深度监听的方式并不是一次性递归，只有当用户访问具体属性的时候才会触发深度监听。比如：let obj = { a: 1, b: 2, c: { name: 'ding' } }，里层的 { name：'ding' } 只有用户访问 obj.c 的时候才会触发深度监听。而 Object.defineProperty 是一次性监听，即从监听obj对象的那一刻，就必须一次性递归监听其所有子属性，一旦对象嵌套过多，开销就很大。这种优化方式原理类比于**异步组件中的按需加载**。

### 四、Vue3.0运行速度优化

#### 1. PatchFlag

​	PatchFlag是用来标记动态节点从而优化diff算法的。在理解PatchFlag之前，首先说明一下 静态节点 和 动态节点：

- `静态节点`：没有绑定Vue实例中的响应式变量，形如"\<p> 我是一个静态文本\</p>"这种形式。
- `动态节点`：绑定了Vue实例中的响应式变量，形如 "\<p> {{msg}}\</p>" 这种形式。

`PatchFlag` 就是用来唯一标识动态节点的。通过PatchFlag，diff算法可以直接比较动态节点而跳过比较静态节点，从而优化性能。diff算法：patch(比较节点) -> someVnode(浅比较：tag和index) -> patchVnode ( 深比较：updateChildren )

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617153559153_CGl6dKtIwf.png"/> </div>

#### 2. hoistStatic 和 cacheHandler

​	`hoistStatic` 和 `cacheHandler`两者都是在模板转render函数后，将render函数输入参数做缓存：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617155153893_12e5OfCotS.png"/> </div>

上面模板未作hoistStatic缓存，而转化的render函数：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617155236800_G9HHLyVfnz.png"/> </div>

做了hoistStaic缓存后，转化的render函数：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617204724819_UjlgoDJaQX.png"/> </div>

render函数会执行多次，如果没做缓存的话，内部初始化静态节点的函数`_createVNode("span",null."hello vue3")`每次都会随着render函数的执行而执行。有了hoistStatic缓存，使得该函数不会被多次调用。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617205315831_m4_PpTpBna.png"/> </div>

上面模板未作cacheHandler缓存前，转化的render函数：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617205743492_shh-jzsUVO.png"/> </div>

做了cacheHandler后，转化的render函数：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617210054744_pOkQoXRfF6.png"/> </div>

render缓存会执行多次，如果没做缓存的话，每次调用render函数就会初始化事件监听函数一次。有了cacheHandler，事件监听函数就只会初始化一次，并做缓存。

#### 3.SSR

​	SSR（Server Side Rendering）服务端渲染，一些静态节点不会被解析入render函数，从而作为Vnode的一部分，被Vue框架所监听。通过SSR 可以使得服务器解析出静态节点，返回部分被解析的HTML代码，加速了页面的解析速度。

#### 4. tree-shaking

​	tree-shaking实现了模板编译成render函数的“按需引用”，使得模板编译的过程更快，编译后的文件体积更小。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220617213810191_wSbC8OM1oi.png"/> </div>

  Vue3.0将Vue2.0中很多挂载在Vue原型上方法的写法改为import按需导入(比如Vue.set/Vue.delete)，细粒度的按需导入使得webpack在打包时能更准确地分析模块间的依赖关系，再通过tree-shaking 将一些不必要的方法进行剔除，从而缩小打包文件的体积。

### 五、其他新特性

#### 1. 从sync到v-model

​	vue2.0中父组件向子组件props传递的值是单向传递的，即子组件修改props传递的值，父组件的值不会跟着变化。必须使用 `sync` 修饰符才能实现组件间传递值的双向绑定，而vue3.0移除了 sync 修饰符，引入了 `v-model`：

```vue
// 父组件
<template>
  <!-- vue2.0 -->
  <Vmodel v-bind:msg.sync="msg"></Vmodel>
  <!-- vue3.0 -->
  <Vmodel v-model:msg="msg"></Vmodel> 
  <h3>{{ msg }}</h3>
</template>

<script>
import Vmodel from "./components/Vmodel.vue";
export default {
  components: { Vmodel },
  data() {
    return {
      msg: "Hello World",
    };
  },
};
</script>
```

```vue
// 子组件
<template>
  <div>
    <input :value="msg" @input="$emit('update:msg', $event.target.value)" />
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
};
</script>
```

#### 2. 从watch 到 watchEffect

​	vue2.0中watch用于监听data中数据的变化，一旦发生变化，watch就会被执行，但一个watch只能监听一个变量。vue3.0在兼容watch的同时，推出了 `watchEffect`, watchEffect可以同时监听多个变量。

```vue
<template>
  <div>
    <p>{{ ageRef }} {{ nameRef }}</p>
  </div>
</template>

<script>
import { reactive, toRefs, watch, watchEffect } from "vue";
export default {
  setup() {
    const state = reactive({
      age: 20,
      name: "丁维琛",
    });
    const { age: ageRef, name: nameRef } = toRefs(state);
    setTimeout(() => { ageRef.value = 25;}, 1500);
    setTimeout(() => { nameRef.value = "丁";}, 3000);

    // vue2.0
    watch(ageRef, (oldValue, newValue) => {
      console.log("age: " + oldValue + " " + newValue);
    });
    watch(nameRef, (oldValue, newValue) => {
      console.log("name: " + oldValue + " " + newValue);
    });

    // vue3.0
    watchEffect(()=>{
        console.log("age: ",ageRef.value);
        console.log("name: " , nameRef.value);
    });

    return {
      ageRef,
      nameRef,
    };
  },
};
</script>
```

> watchEffect可以同时监听多个变量，且这些变量被初始化时watchEffect也会执行一次；而watch只能监听一个变量，必须设置immediate属性才会在被监听变量初始化时执行一次。

> 注意watchEffect内变量需要 **.value** 进行访问。

剩余的新增功能看Vue3：6-11那一节的视频
