# 性能优化

## 1. 浏览器渲染页面原理

::: info 浏览器渲染页面原理
1. 先根据HTML代码生成基本的DOM树，再根据CSS代码生成CSSOM样式树，将DOM树和CSSOM树结合生成 Render Tree 呈现树。
2. 由于JS执行和页面渲染共用一个线程，在Render Tree渲染过程中可能遭受到JS代码的修改，阻塞Render Tree的渲染过程。
:::

### 1.1 window.onload 和 document.DOMContentLoaded

都是在页面渲染完成后触发的事件，不同点在于触发时机：

- *onload*：页面全部资源加载完成时触发，包括图片、视频等。
- *DOMContentLoaded*：DOM渲染完成时触发，此时图片、视频可能没有加载完。

## 2. 常用的性能优化手段

> **大体原则：**
>
> - 多使用内存、缓存或其他方法，减少HTTP请求
> - 减少CPU的计算量，减少网络加载耗时
> - 空间换时间（适用于所有编程的性能优化）

前端性能优化从两个角度入手：

- 让加载更快：减少从网络获取资源时间
- 让渲染更快：减少获取资源后，浏览器的渲染时间

### 2.1  让加载更快

- 减少资源体积：服务器可以压缩资源后传输，比如gZip算法；
- 减少访问次数：多个文件合并为一个文件（雪碧图等）、浏览器缓存；
- 使用更快的网络：CDN服务加速资源获取。

### 2.2  让渲染更快

- CSS放在最前, JS放在最后；
- JS代码的触发时机，用DOMContentLoaded触发而不是onload；
- 懒加载（图片懒加载，下滑加载更多...）；
- 对DOM操作进行缓存，频繁的DOM操作应该合并，一起插入至DOM结构中。（Vue的Diff算法）；
- 使用SSR服务端渲染：将网页和数据一起加载，一起渲染后传给前端显示；
- 防抖和节流。

## 3. 防抖&节流

​    试想这样一个场景：

```latex
场景描述：

用户在搜索框中搜索时，代码通过监听keypress事件向后端发起请求。用户每按下一个键，页面就会发起一次请求，这样是否会因为事件触发太频繁而浪费浏览器性能呢？
```

​    为了提升页面的执行性能，是否可以等用户最后一次输入完后，再发送请求呢？这就引入了函数的 **防抖** 与**节流**。

### 3.1 定义

​	防抖与节流本质上是优化高频率执行代码的一种手段，如：浏览器的 `resize`、`mousemove`、`keypress`、`scroll` 等事件在触发时，会不断地调用绑定在事件上的回调函数，极大地浪费资源，降低前端性能。

​	为了优化体验，需要对这类事件进行调用次数的限制，对此我们就可以采用  `debounce` (防抖) 和  `torottle`（节流）的方式来减少使用频率。

- **防抖**：在一连串的事件触发后，最后一个事件触发结束，等待n秒后再处理该事件。
- **节流**：n 秒内只处理一次事件，若在n秒内重复触发，只有一次生效。

```latex
一个经典的比喻：

  想象每天上班大厦底下的电梯，把电梯完成一次运送，类比为一次事件处理函数fn的响应和执行。假设电梯有两种运行策略 debounce 和 throttle，时延设定为15s，不考虑容量限制。
  防抖：电梯第一个人进来后，等待15s。如果15s又有人进来，15s等待重新计时，直到15s后再也没人进来了，开始运送。
  节流：电梯第一个人进来后，每15s准时运送一次，无论15s是否还有人进来。
```

​	普通事件处理函数，和加了防抖与节流函数，被调用的结果对比图：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220528203449222_c4QrRRdOtM.png"/> </div>

### 3.2 代码实现

​	监听一个普通的div盒子中的`mousemove`事件，代码如下：

```javascript
<!-- DOCTYPE html-->
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .box {
            width: 400px;
            height: 400px;
            background-color: #000;
        }
    </style>
</head>

<body>
    <div class="box" id="box"></div>
    <script>
        function mouseMove(event) {
            console.log('鼠标在移动：');
            console.log(event.pageX);
        }

        let box = document.getElementById('box');
        box.addEventListener('mousemove', mouseMove); // 普通
    </script>

</body>

</html>
```

#### 防抖

​	用一次性定时器 `setTimeout` 实现防抖：

```javascript
<script>
        // 函数防抖
        function debounce(fn, delay) {
            // fn: 事件处理函数 delay：事件处理延时
            let timer = null;
            return function() {
                let context = this; // 保存this指向
                let args = arguments; // 拿到event对象
                // 如果之前有事件发生，此事件再次发生，则清空之前的事件处理器，设置新的事件处理器 
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(context, args)
                }, delay);
            }
        }
    
        function mouseMove(event) {
            console.log('鼠标在移动：');
            console.log(event.pageX);
        }

        let box = document.getElementById('box');
        // box.addEventListener('mousemove', mouseMove); // 普通
        box.addEventListener('mousemove', debounce(mouseMove, 1000)); // 加防抖
    </script>
```

#### 节流

​	用一次性定时器 `setTimeout` 实现节流：

```javascript
<script>
        // 函数节流
        function throttle(fn, delay) {
            let timer = null;
            return function() {
                let context = this;
                let args = arguments;
                // 当前事件处理程序，只有等待上一个事件处理程序的定时器执行完后，在新的定时器中执行
                if (!timer) {
                    timer = setTimeout(() => {
                        fn.apply(context, args);
                        timer = null;
                    }, delay);
                }
            }
        }

        function mouseMove(event) {
            console.log('鼠标在移动：');
            console.log(event.pageX);
        }

        let box = document.getElementById('box');
        // box.addEventListener('mousemove', mouseMove); // 普通
        box.addEventListener('mousemove', throttle(mouseMove, 1000)); // 加节流
    </script>
```

### 3.3 应用场景

​	防抖在连续的事件，只需触发一次回调的场景有：

- 搜索框搜索输入，只需用户最后一次输入完，再发送请求。
- 手机号、邮箱验证输入检测。
- 窗口大小 `resize` ，只需窗口调整完成后，计算窗口大小，防止重复渲染。
  节流在间隔一段时间执行一次回调的场景有：
- 滚动加载，加载更多或滚到底部监听
- 搜索框，搜索联想功能

参考资料：
1. [浅谈JS防抖与节流](https://segmentfault.com/a/1190000018428170#item-2)
2. [面试官：什么是防抖和节流？有什么区别？如何实现？](https://vue3js.cn/interview/JavaScript/debounce_throttle.html)

## 4. Web安全

### 4.1 XSS

​	XSS（Cross-Site Scripting）跨站脚本攻击，原理：在被攻击的源服务器上注入恶意脚本，等用户从源服务器上获取静态资源并解析时，触发恶意脚本导致XSS攻击生效。

+ 反射型：一次性的，构造含有恶意代码的URL诱导用户访问。比如：http://taobao.com/#alert(document.cookie)，
用户被诱导点击后，发送请求给源服务器，源服务器不做过滤直接返回给用户浏览器解析执行，导致用户有关源服务器的cookie被截取。

+ 存储型：永久性的，在源服务器上被攻击者插入了恶意代码。比如：攻击者在留言板上输入恶意代码并提交，源服务器不做过滤就存储进数据库中。等其他用户浏览并拉取攻击者的留言，源服务器返回恶意代码，导致其他人遭受XSS攻击。

所以XSS攻击生效的原因还是源服务器对用户提交的文本没有进行校验，如果源服务器审查严格，那么XSS也不会生效。

+ 防御：1. 服务器在响应头中设置cookie的httpOnly属性 `Set-cookie: 某cookie，HttpOnly`使得cookie不能被JS读取，防止cookie被恶意代码读取并发送给攻击者2. 对用户输入，输出进行HTML编码，防止恶意代码被注入至页面DOM属性中被浏览器解析执行。

### 4.2 CSRF/XSRF

​	CSRF（Cross-Site Request Forgery）跨站请求伪造，原理：前提是受害者已经认证并登录某个目标网站（淘宝）且没有关闭，这时攻击者向受害者发送一封钓鱼邮件；受害者打开钓鱼邮件后触发了恶意脚本，恶意脚本的功能是向目标网站发送恶意HTTP请求（自动携带受害者在目标网站的cookie），完成需要认证的恶意操作（支付...等）。&#x20;

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/v2-8deb5273d92a71772670aaedc74cbced_1440w_om0X46gd.jpg"/> </div>

1. 使用token验证可以防止CSRF攻击，服务器在对用户进行登录验证以后生成一个用于鉴权的token，并将token发送给浏览器。当浏览器发送请求调用服务器某个api时，请求头种应该携带token，服务器通过判断token有效从而允许浏览器调用该api获取JSON数据。因为token必须通过当前页面手动添加，而不会在其他页面自动被自动添加入请求中，所以token可以成功防范CSRF攻击。
2. 在服务器响应头中设置 cookie的sameSite属性`Set-Cookie: 某cookie,sameSite=Lax` 使得cookie不会随请求自动携带，从而防范CSRF攻击。
