# WebAPI 知识体系

## DOM

​	DOM（Doucument Object Model）将HTML结构形式化成一颗节点树，并定义了操作树的一些API。

### 1. DOM元素操作

**获取DOM元素**

- *getElementById（单个），getElementByTagName（多个），getElementByClassName（多个）*
- H5新增：*querySelectAll（多个）*，参数为一个css选择器

```javascript
.red {
    color: red;
}

<p id='p1' class="red">段落1</p>
<p class="red">段落2</p>
<p>段落3</p>

<script>
    let p1 = document.getElementById('p1');
    let pList = document.getElementsByTagName('p');
    let pList = document.getElementsByClassName('red');
    let pList = document.querySelectorAll('p');
</script>
```

- *parentNode*：当前DOM元素的父亲节点
- *children*：当前DOM元素的子节点

```javascript
<div id="container">
    <div id="curNode">
        <p>段落1</p>
        <p>段落2</p>
        <p>段落3</p>
    </div>
</div>

<script>
    let curNode = document.getElementById('curNode');
    console.log(curNode.parentNode);
    console.log(curNode.children);
</script>
```

**添加DOM元素**

- *createElement*：创建DOM节点
- *appendChild*：添加DOM节点

```javascript
<div id="container">
    <div id="curNode">
        <p>段落1</p>
        <p>段落2</p>
        <p>段落3</p>
    </div>
</div>

<script>
    let curNode = document.getElementById('curNode');
    let newP = document.createElement('p');
    newP.innerHTML = '新增节点';
    curNode.appendChild(newP);
</script>
```

**删除DOM元素**

- *removeChild*：删除某个节点下的孩子DOM节点

```javascript
<div id="container">
    <div id="curNode">
        <p>段落1</p>
        <p>段落2</p>
        <p>段落3</p>
    </div>
</div>

<script>
    let curNode = document.getElementById('curNode');
    let pList = document.getElementsByTagName('p'),
        p1 = pList[0];
    curNode.removeChild(p1);        
</script>
```

### 2. property 和 attribute

- *property*：DOM元素自带属性，其不会在HTML标签上出现。
- *attribute*：开发者给DOM元素定义的属性，会在HTML标签中出现。H5提供的方法有：*getAttribute*，*setAttribute*，*removeAttribute*，*hasAttribute*。

```javascript
.red {
    color: red;
}

<div id="div1" class="red">容器</div>

<script>
    let div1 = document.getElementById("div1");
    // property
    console.log(div1.className);
    // attribute
    div1.setAttribute('data-name', 'ding'); // 自定义属性以 'date-' 开头
    div1.getAttribute('data-name');
    div1.hasAttribute('data-name');
    div1.removeAttribute('data-name');
</script>
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220510112634645_GhnfJbMaym.png"/> </div>

### 3. DOM操作优化

**多次插入DOM节点优化**

```javascript
<script>
    const listNode = document.getElementById('list');

    // 创建一个文档片段，作为操作缓存
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 10; i++) {
        const li = document.createElement('li');
        li.innerHTML = `List item ${i}`;
        // 对文档片段进行操作
        frag.appendChild(li);
    }

    // 都完成后，再统一插入至DOM树中
    listNode.appendChild(frag);
</script>
```

# BOM

​	BOM（Browser Object Model）浏览器对象模型及相应的 API。

**location**

:::info 示例
```
https://www.baidu.com:8080/s?wd=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C&sa=ire_dl_gh_logo_texing&rsv_dl=igh_logo_pcs
```
:::

- *href*：完整URL
- *protocol*：协议  https：
- *host*：域名+端口   [www](http://www "www"). baidu.com:8080
- *hostname*：域名    [www](http://www "www"). baidu.com
- *port*：端口  80
- *pathname*：路径信息  /s
- *search*：查询信息 *wd=%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C\&sa=ire\_dl\_gh\_logo\_texing\&rsv\_dl=igh\_logo\_pcs*

## 事件

### 1. 事件流

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/clip_image002__UM8eWpQTT.jpg"/> </div>

DOM元素存在父子级关系，具体的呈现方式是一颗树形结构。如果某个DOM元素触发事件，则会在其所有上级元素触发该事件，那么触发事件就会存在顺序：

- 事件捕获：从上至下，*document -> html -> body -> div* 事件依次触发。
- 事件冒泡：从下至上，*div -> body -> html -> document*  事件依次触发。

### 2. 事件处理程序

绑定事件处理程序有以下几种方式

- *on*：比如 ele.onclick = function(){ ... }。DOM0规定的事件处理程序绑定方式，取消绑定 ele.onclick = null 。
- *addEventListener*：比如 ele.addEventListener( 'click'，function(){...}，false)。DOM2规定的事件处理程序绑定方式，取消绑定 *removeEventListener*。

> *addEventListener*：第三个参数可以规定事件处理程序被调用的时机；*false* 冒泡阶段调用，**true**捕获阶段调用。

### 3. 事件对象

​	浏览器默认会将一个 *event* 事件对象传入事件处理程序中，通常是事件处理程序的最后一个参数。这个对象中包含着所有与事件有关的信息。

**事件对象属性**

​	*event* 有以下常用属性：

- *type*：事件类型
- *currentTarget*：当前事件处理程序所绑定的DOM元素
- *target*：当前事件的目标，即触发事件的源头的DOM元素

**事件对象方法**

- *preventDefault*：取消事件的默认行为，比如 a 标签的跳转...
- *stopPropagation*：取消事件的冒泡

### 4. 事件委托

​	不是每个子节点单独设置事件处理程序，而是在其公共父节点上设置事件处理程序，然后利用事件冒泡，对事件做出相应。

```javascript
<ul>
    <li>物品1</li>
    <li>物品2</li>
    <li>物品3</li>
    <button>按钮</button>
</ul>

<script>
    let ul = document.getElementsByTagName('ul')[0];
    ul.addEventListener('click', function(event) {
        let target = event.target;
        if (target.matches('li')) {
            console.log(target.innerHTML);
        }
    });
</script>
```

> ***ele.matches***：用于判断ele是否是某种类型的DOM元素，参数为 css选择器，与querySelectorAll类似。

## AJAX

​	没有 *ajax* 之前，页面通过表单与服务器进行交互，表单交互的缺点是：每次提交表单，浏览器就会发起一个http请求，服务器返回新的html 文件，浏览器重新渲染；即每次发起http请求都会导致整个页面重新刷新。*ajax* (*Asynchronous + JavaScript + XML*) 则实现了：用户可以通过 Javascript 发起**异步网络请求**(Asynchronous)获取格式化数据(XML格式文件 / JSON格式文件)，对当前页面进行部分修改后渲染，不用刷新整个页面。

​	后来，*ajax* 就成为用 *Javascript* 脚本发起 http 通信的代名词；也就是说，只要用  *Javascript* 发起通信，就可以叫做 *ajax* 通信。

### 1. 手写 ajax

​	*XMLHttpRequest* 对象是实现 *ajax* 的主要接口，发起一次 *ajax* 通信包含以下四步：

```javascript
// 1. 生成一个 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();
// 2. 设置 xhr 状态进行修改的回调函数
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log(JSON.parese(xhr.responseText));
        }
    }
};
// 3. 初始化一个http请求
xhr.open('GET', '/index.html', true);
// 4. 发送一个http请求
xhr.send(null);


// 使用 Promise 封装一个 ajax 请求
function ajax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else if (xh4.status === 404) {
                    reject(new Error('404 not found'));
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}
```

- *onreadystatechange*：*readyStateChange* 事件触发时被调用的回调函数，*xhr* 对象 ***readyState*** 属性的值每一次变化，都会触发*readyStateChange* 事件。*readyState* 的取值有五种：
  - 0：表示 XMLHttpRequest 实例已经生成，但是实例的`open()`方法还没有被调用。
  - 1：表示`open()`方法已经调用，但是实例的`send()`方法还没有调用。
  - 2：表示实例的`send()`方法已经调用，并且服务器返回的头信息和状态码已经收到。
  - 3：表示正在接收服务器传来的返回体（body 部分）。
  - 4：表示服务器返回的数据已经完全接收，或者本次接收已经失败。
- *open*：第二个参数是一个服务器的相对路径，*协议 + 域名 + 端口* 被省略。因为浏览器的同源隔离策略，*ajax*只能获取与当前页面同源服务器的格式化数据。如果想获取不同源服务器上的数据，就涉及到跨域的问题。第三个参数是一个 *Boolean*，默认为 *true* 表示这是一个异步请求，*false* 表示这是一个同步请求，同步请求会阻塞页面加载不建议使用。
- *send*：发起一个Http请求，GET请求不需要传递额外的参数，PUT请求以对象的形式将参数传递。

[ 浏览器同源政策及其规避方法 - 阮一峰的网络日志 ](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)

### 2. 跨域问题

**同源策略**

​	同源策略是浏览器针对 *JavaScript* 发起网络请求的限制。**即在当前页面下， *****ajax***** 请求只能获取与当前页面同源（*****协议 + 域名 + 端口***** 相同）的服务器上的格式化数据**。而对于其他类型的资源获取，比如css样式 \<link href="...">，js脚本  \<script href="...">，图片< img src="...">则不存在同源策略的限制。

**跨域实现**

​	**所有的跨域实现方式都需要外源服务器进行配合。**

**(1) JSONP**

​	由于浏览器对 *ajax* 请求的同源策略限制，但对js脚本的获取没有限制。可以在外源服务器上放置一个js脚本，其内容为调用一个回调函数。

```javascript
// https://127.0.0.1:8080/?callback=getJson 外源服务器的脚本URL
<script>
   getJson( {'name':'ding', 'age':'23', 'sex':'male'} );// 实参为JSON格式数据，进行传递
</script>
```

​	在浏览器上获取外源服务器的 js 脚本，并定义外源脚本调用的回调函数，用以获取数据。

```javascript
// https://127.0.0.1:90/index.html 当前页面URL
<script>
    let jsonData;
  // 定义回调函数 
  function getJson(param){
        jsonData = param;
    }
</script>
```

> JSONP 使用GET请求获取数据，无法实现POST，PUT，DELETE等其他请求。

手写JSONP：

```javascript
    function myJSONP(url, data = {}, callBackName) {
        // 参数解释：url-后端服务器基址url, data-url后面的参数，callBackName回调函数名 

        // 1.处理参数
        let params = [];
        for (let key in data) {
            params.push(key + "=" + data[key]);
        }
        params = params.join('&');
        // 2.创建script标签引用服务器上js脚本
        let script = document.createElement('script');
        script.src = url + "?" + params;
        document.body.appendChild(script);
        // 3.在全局对象上定义回调函数供js脚本调用
        window.callBackName = function (data) {
            //... 处理脚本返回data
        }
    }
    myJSONP('https://www.example.com/', {
        callback: 'getJson'
    }, 'getJson');
    
    // **************对上面版本进行优化，主要在第三步用promise封装**************
    function myJSONP(url, data = {}, callBackName) {
      // 参数解释：url-后端服务器基址url, data-url后面的参数，callBackName回调函数名 

      // 1.处理参数
      let params = [];
      for (let key in data) {
          params.push(key + "=" + data[key]);
      }
      params = params.join('&');
      // 2.创建script标签引用服务器上js脚本
      let script = document.createElement('script');
      script.src = url + "?" + params;
      document.body.appendChild(script);
      // 3.在全局对象上定义回调函数供js脚本调用
      return new Promise((resolve, reject) => {
          window.callBackName = function (data) {
              // 这里实际上用了闭包，修改的是返回promise对象的状态
              try {
                  resolve(data);
              } catch (error) {
                  reject(error);
              } finally {
                  document.body.removeChild(script);
              }
          }
      });
  }
  
  myJSONP('https://www.example.com/', {
      callback: 'getJson'
  }, 'getJson').then((data) => {
      //... 处理脚本返回data
  });
    
```

[ 面试题之Jsonp的理解及手写代码 - 掘金 ](https://juejin.cn/post/6947694608247685127)

**(2) CORS**

​	CORS (*Cross-Origin Resource Sharing*) 是 *H5* 定义的访问跨域资源的规范。**CORS背后的基本思想，就是使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求 / 响应是 成功/失败。**

- 浏览器在请求头中加入 ***Origin*** 字段，说明这个请求来自哪个源，从而发出一个 CORS 请求。
- 服务器在响应头中加入 ***Access-Control-Allow-Origin：允许的URL***，从而响应浏览器，允许浏览器在当前页面下进行跨域资源访问。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/l_BsmjI6zuz5.png"/> </div>

​	上面这种跨域请求，称为简单请求 (GET、POST)。如果要实现PUT、DELETE请求，在发送 *ajax* 请求前，会发送一个  ***preflighted***  预检请求（在请求中添加 *OPTIONS* 字段），询问外源服务器是否支持。

```latex
OPTIONS /path/to/resource HTTP/1.1
Host: sina.com
Origin: http://my.com
Access-Control-Request-Method: POST
```

服务器必须响应并明确指出允许的 Method：

```javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://my.com
Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS
Access-Control-Max-Age: 86400
```

*Access-Control-Allow-Methods* 规定了服务器支持的请求类型，*Access-Control-Max-Age* 给出了允许发送这些类型的持续时间。如果要支持 PUT、DELETE请求，则代价只是多发送一次 *preflighted* 预检请求。

> cookie与CORS: 默认CORS请求是不能携带cookie的，如果想携带cookie，则可以通过两种方式实现：
>
> - 浏览器在有发 *preflighted* 预校验请求的情况下，服务器在 *preflighted* 预校验返回头中填入 *Access-Control-Allow-Credentials: true* 表示浏览器某个时间段内CORS请求可以携带cookie。
> - 浏览器在没有发 *preflighted* 预校验请求的情况下，向 CORS 请求头中添加 *withCredentials: true* 并携带cookie；服务器在响应头中添加 *Access-Control-Allow-Credentials: true* 表示响应了带cookie的请求，反之，则服务器的响应无效。

**(3) 同源服务器代理**

​&emsp;浏览器向同源的代理服务器发送 ajax 请求，这样符合了浏览器的同源策略，代理服务器再将这个请求转发给外源服务器；拿到结果后，代理服务器将结果返回给浏览器。

​&emsp;比如用ngin作为代理服务器器，需要配置`ngnix.conf`文件的`server`部分的`location`字段：

```bash
server {
    # 配置服务地址
    listen       9000;
    server_name  localhost;
    
    # 访问根路径，返回前端静态资源页面
    location / {
        # 前端代码服务地址
        proxy_pass http://localhost:8000/;  #前端项目开发模式下，node开启的服务器，根路径下可打开index.html
    }
    
    # 最简单的API代理配置
    # 约定：所有不是根路径下的资源，都是api接口地址。则可代理如下
    location /* {
        # API 服务地址
        proxy_pass http://www.serverA.com;  #将真正的请求代理到API 服务地址,即真实的服务器地址，ajax的url为/user/1将会访问http://www.serverA.com/user/1
    }
    
    # 需要更改rewrite 请求路径的配置
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;   #所有对后端的请求加一个api前缀方便区分，真正访问的时候移除这个前缀
        # API Server
        proxy_pass http://www.serverA.com;  #将真正的请求代理到serverA,即真实的服务器地址，ajax的url为/api/user/1的请求将会访问http://www.serverA.com/user/1
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

参考：[廖雪峰的ajax教程](https://www.liaoxuefeng.com/wiki/1022910821149312/1023022332902400)

### 3. 实现ajax的工具

**(1) XMLHttpRequest**

​	参考第一节。

**(2) fetch**

​	fetch 也是用原生js代码发起 ajax请求，但是它没有使用 *XMLHttpRequest*对象 的api来实现ajax请求。

```javascript
fetch(url)
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
})
```

​	fetch 返回的是一个 promise对象，它有以下特征：

- 如果此次请求失败（http状态码为4xx或5xx），返回的 promise 对象也是Fulfilled状态，通过返回值的 *ok* 属性设置 *false* 表示此次请求失败。仅当网络故障或者请求被阻止时，promise对象才是 Rejected状态。
- 默认情况不会发送或接收cookie，除非设置请求头的 *credentials* 选项。

**(3) axios**

​	对 *XMLHttpRequest* 封装，用来发起 ajax请求的一个node库。

```javascript
axios.get(url)
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
})
// 通常结合 async 和 await使用
async getUserList(url){
    try{
        let data = await axios.get(url);      
    }catch(err){
        console.log(err);
    }
}
```

# 存储

​&emsp;JS有一些api可以实现在本地浏览器中存储数据，本地存储的意思是即使页面刷新 / 关闭，下次打开页面时本地存储的数据也不会消失。

**(1) cookie**

​	cookie 原本是浏览器用来与服务器通信的工具。但是在H5之前，浏览器并没有本地存储工具，所以**借用**cookie 的空间作为本地存储。其设计的出发点，并不是用来做本地存储的。

缺点：

- 存储大小只有4kb
- 每次发送http请求时，请求头中就会多出cookie的数据量，影响传输速率。
- 只能用document.cookie = ‘...’ 对cookie进行修改，api过于简陋。

**(2) localstorage & sessionstorage**

​	*localstorage* 和 *sessionstorage* 是H5专门为浏览器设计的本地存储，其特点如下：

- 存储大小有5MB
- 并不会跟随http请求发送出去
- api简易，*localstorage.setItem(key,value)*，*localstorage.getItem(key)*，localstorage.removeItem(key)

> localstorage 和 sessionstorage 的区别：
> localstorage 在浏览器中永久存储，除非手动进行删除；sessionstorage只在一次会话间存储，新建一个相同标签页或者关闭浏览器就访问不到。一般使用localstorage多一些。
