# HTTP详解

​	HTTP（Hyper Text Transfer Protocol）超文本传输协议，它允许将超文本标记语言HTML （Hyper Text Markup Language）文档从Web服务器传送至客户端的浏览器。

> 超文本：文本除了包含文字图片外，还包含超链接

## 1. 预备知识

### 1.1 TCP

​	**HTTP 是基于 TCP （Transmission Control Protocol）的**，TCP位于传输层，只有 B/S 两端建立可靠的 TCP 连接后才能通过 HTTP 传输数据。TCP建立连接的方式是三次握手：

- B端：`SYN=1, seq=x`，SYN是 TCP 报文头部6个标识位中之一，置1表示该报文目的是请求连接，seq 是报文的序列号。
- C端：`SYN=1, ACK=1, seq=y, ack=x+1 `，ACK也是标志位之一，置1表示该报文目的是确认连接，ack 是报文的确认应答号。表示希望对方下次用 ack 的号码作为序列号。
- B端：`ACK =1, seq=x+1, ack=y+1`

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/format,png_qBLBzzHYCM.png"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220622224435380_gFC59Ivd96.png"/> </div>

> 📌为什么建立连接需要三次握手？
> ​	为了确保 B/S 两端的  ”收“ 和 ”发“ 两种能力。第一次 B 发 C 收 （C收√），第二次 C 发 B收 （B收√B发√），第三次 B 发 C 收（C发√）。
> ​	第一次 C 接收到 B 的请求包，C 能确认自己的接收能力正常。第二次 B 接收到 C发的应答包，说明 B 知道 C 已经收到自己发的上一个包，从而确认自己发送能力正常；同时 B 又接收 C 的包，从而确认自己接收能力正常。第三次 C 接收到 B 发的应答包，说明 C 知道 B 已经收到自己发的上一个包，从而确认自己发送能力正常。

### 1.2 DNS

​	DNS（Domain Name System）域名解析服务位于应用层，它提供域名到 IP 地址之间的解析服务。

​	DNS 中域名用句点来分割层级，越靠右表示其层级越高，且域名最后还有一个点，比如 `www.baidu.com` 实际上是 `www.baidu.com.`。最后一个 `.` 代表根域名，`.com` 代表顶级域名，`baidu.com` 代表权威域名。

​	域名服务器的层级关系类似于一颗多叉树，同时根域名服务器 `域名->IP地址` 的映射存储于所有 DNS服务器中。这样一来，任何 DNS 服务器就能找到并访问根域名服务器。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/5_k57Y7Z-lVY.jpg"/> </div>


​	当用户在浏览器中输入网页URL时，浏览器必须解析出URL中域名对应的IP地址，从而发送HTTP请求进行通信。解析域名 `www.baidu.com` 对应IP地址步骤如下：

- 浏览器查找自身缓存，找到 IP地址就结束。
- 浏览器询问操作系统，操作系统查找本地缓存，如果没有，再去找 hosts 文件。
- 浏览器发送一个 DNS请求给本地DNS服务器，如果找到 IP 就结束。
- 本地DNS服务器发送请求给根域名服务器，根域名服务器返回 `.com` 顶级域名服务器的IP。
- 本地DNS服务器发送请求给 `.com` 顶级域名服务器，顶级域名服务器返回 `baidu.com` 权威服务器的IP。
- 本地DNS服务器发送请求给 `baidu.com` 权威服务器，权威服务器找到 `www.baidu.com` 的 IP，并返回给本地DNS服务器。
- 本地DNS服务器返回 IP 地址给浏览器。
- 浏览器发送HTTP请求。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/6_bTXVCzb5ZN.jpg"/> </div>

### 1.3 URI & URL

​	URI（Uniform Resource Identifier）统一资源标识符用来唯一**标识**一个网络资源，URL（Uniform Resource Locator）统一资源定位符用来唯一**定位**一个网络资源。

​	**标识**的意思是无论用哪种形式都能确定一个资源，而通过给出资源的位置信息（**定位**）来确定一个资源是其中的一种方式。所以 URL 是 URI 的 子集，即它是通过 ”定位“ 这种方式来标识一个资源。

​	比如一个文件可以用编号标识为 `index.html`，也可以用定位标识为 `http://www.baidu.com/index.html`。前者是一个 URI 但不是 一个 URL，因为它没给出获取文件的地址。

## 2. 报文结构

​	HTTP 的特性有很多，其报文结构 `简单` 只有 报头+报体，`灵活` 有多种请求方法，头部字段和状态码可以扩充增加新功能。但是它也有显著的缺点需要完善：

- `无连接`：一次 TCP 连接只处理一个HTTP请求，处理完就断开。
- `无状态`：由于服务器需要响应来自很多客户端的HTTP请求，所以它不会记录同一个客户端多次请求之间的状态信息。即每一次HTTP请求都是相互独立的，服务器不会区分请求的发送方，从而记录与同一个发送方的交互状态。**后面可以用 cookie 和 session 为 HTTP 添加记录状态的能力**。

​	一个HTTP报文结构由四部分组成：

- 请求行/响应行：请求行包括 **请求method+URL+HTTP版本**，响应行包括 **状态码 + 原因短语 +HTTP版本**。
- 请求头/响应头：请求头包括三种首部字段  请求首部字段（响应首部字段）+ 通用首部字段 + 实体首部字段 。
- 空行
- 请求体/响应体：请求体通常包括请求携带参数，响应体通常包括响应返回数据。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220623180449138_OlBG5CJWpm.png"/> </div>

### 2.1 请求行/ 响应行

#### 请求行：请求方法

​	请求行由 请求方法 + URL + HTTP版本 组成，下面列举几种重要的请求方法：

- `GET`：客户端向服务端请求已被URL标识的资源
- `POST`：客户端向服务端传送表单数据
- `PUT`： 客户端向服务端传送数据，并修改指定URL下的内容
- `DELETE`：客户端请求服务端删除指定资源
- `HEAD`：客户端向服务端请求报头，类似于GET请求，只不过返回的响应体没有具体内容，只用于获取报头
- `OPTIONS`：对某个URL资源，客户端向服务端查询其对该URL所支持的请求方法。该请求方法常用于跨域前的预检请求中，如果查询到服务端对该URL支持某个方法，才会请求跨域。

> 📌POST 和 GET 方法的不同：
> ​	POST 方法主要是为了弥补 GET 方法向服务端传递参数的问题：1. URL长度限制，传送参数有限 2. 参数放在URL中明文传输，没有保密性。POST 方法将参数放入请求体内传输，克服了上述 GET 方法存在的问题。
> &#x20;        此外，GET请求只发送一个TCP数据包，而POST请求会发送两个TCP数据包。get 发送数据的时候，url把header和data数据带着一起传送到服务器，然后返回结果。但是 post 会先发送 header 到服务器，服务器响应 100 之后，继续向浏览器发送data，服务器接收完之后，会验证数据完整性，然后返回结果。
> POST 和 PUT 方法的不同：
> ​	PUT是幂等的，而POST是不幂等的。幂等的意思是只在同一个指定位置进行不同操作，比如PUT只在同一个位置修改数据，而POST是在不同的位置插入数据。由于 PUT 方法存在安全性问题，可以用 POST 方法模拟实现 PUT 方法。

[ 前后端数据交互(八)——请求方法 GET 和 POST 区别](https://juejin.cn/post/7007592284929687589)

#### 响应行：状态码

​	响应行由 HTTP版本 + 状态码 + 原因短语 组成，状态码描述了服务端对客户端请求的响应结果，下面列举几种重要的状态码：

- 1XX：服务器已经接收浏览器的请求，且正在处理。
- 2XX：处理完毕，且请求成功。
  - 200：响应成功，正常返回数据。
- 3XX：重定向。
  - 301：永久重定向，服务器会在location字段给出重定向URL。且浏览器会记住这个URL，下次请求自动映射至该URL。比如，浏览器访问 [www.baidu.com](http://www.baidu.com "www.baidu.com") -> 服务器返回301，location = [www.taobao.com](http://www.taobao.com "www.taobao.com") -> 浏览器再次访问 [www.baidu.com，自动映射URL向](http://www.baidu.com，自动映射URL向 "www.baidu.com，自动映射URL向") [www.taobao.com](http://www.taobao.com "www.taobao.com") 发送请求。
  - 302：临时重定向，服务器会在location字段给出重定向URL。重定向只在本次请求有效。比如，浏览器访问 [www.baidu.com](http://www.baidu.com "www.baidu.com") -> 服务器返回302，location = [www.taobao.com](http://www.taobao.com "www.taobao.com") -> 浏览器重定向至 [www.taobao.com；](http://www.taobao.com； "www.taobao.com；") 浏览器再次访问 [www.baidu.com，不会自动映射，还是向](http://www.baidu.com，不会自动映射，还是向 "www.baidu.com，不会自动映射，还是向") [www.baidu.com](http://www.baidu.com "www.baidu.com") 发送请求。
  - 304：资源未被修改，后面会讲缓存机制。
- 4XX：客户端错误，请求不合规范。
  - 401：用户没有认证登录。
  - 403：用户通过认证，但没有获取资源的权限。
  - 404：服务端没有客户端所给URL对应资源。
- 5XX：服务端错误，服务端内部处理出错。
  - 500：服务器内部错误。
  - 504：服务器网关超时。（服务器请求其他资源时超时，比如数据库）

### 2.2  请求头/响应头

1\. Request Headers（请求首部字段）:

- **Accept**：浏览器可接收的数据格式。
- **Accept-Language:**  浏览器期待接收的页面语言类型。
- **Accept-Encoding**：浏览器可接收数据的采用的压缩算法，如gZip。
- **Cookie**：同源请求下携带的状态信息。
- **Host**：请求资源所在服务器。
- **User-Agent**：浏览器信息。
- **If-Modified-Since**：比较资源的更新时间。
- **If-None-Match**：比较实体标记。

1. Response Headers（响应首部字段）:

- **Set-Cookie**：修改客户端在某域名下存储的cookie。
- **ETag**：资源的匹配信息。

2\. 通用首部字段：

- **Cache-Control**：控制缓存的行为。
- **Connection**：keep-alive 保持当前TCP连接活跃，等待下次HTTP请求。

3\. 实体首部字段：

- **Content-Type**：请求体（响应体）中传输数据的格式application/json。
- **Content-Language：** 实体中内容采用的语言类型。
- **Content-Length**：实体中数据的大小（单位：字节）。
- **Content-Encoding**：实体数据采用的压缩算法，如：gZip。
- **Expires**：实体过期的日期时间。
- **Last-Modified**：资源的最后修改日期。

## 3. 缓存

**1. 什么是缓存？**

​	将一些服务器不常修改的静态资源（js, css, img... 等等）在第一次请求过后保存至本地，当下次请求的时候，优先从本地加载资源。**缓存实际上是优化了前后端的交互，缩短了网络请求时延。**

**2. 如何实现缓存？**

​	缓存分为两种策略，强制缓存 和 协商缓存。

#### 强制缓存

​	强缓存是本地缓存没有资源时，第一次获取到资源时采用的缓存策略。服务器第一次返回资源时，在响应体中会返回一个`Cache-Control`字段。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220527130323920_Gr5BQLAeg6.png"/> </div>

- **Cache-Control：** 服务器在回应体中添加该字段控制客户端的强制缓存逻辑，它有以下取值：
  - max-age：设置一个最长缓存时间，过了这个时间需要重新请求资源，单位s
  - no-cache：客户端可以在本地缓存资源，但每次请求该资源必须向服务端做**新鲜度校验**，即进行一次协商缓存。**no-cache等价于 max-age: 0**
  - no-store：客户端不可以本地缓存资源

> 📌*Expires*： 返回一个Date对象，表示资源过期的最后时间。现在已经被Cache-Control代替，二者同时存在以Cache-Control为准。

#### 协商缓存

​	当采用强制缓存策略的本地缓存资源过期后，采用协商缓存的策略对资源进行获取。协商缓存实现的就是对现有缓存资源的新鲜度校验。

​	实现资源的新鲜度校验必须利用**资源标识**。资源标识有两种，在服务端每次返回资源的响应头中携带两种资源标识：

- **Etag：** 资源的Hash值，用于资源的完整性校验。
- **Last-Modified：** 一个Date对象，资源最后一次改动时间，用于资源的完整性校验。

​	当本地缓存时间过期后，客户端必须发起请求对当前缓存资源进行新鲜度校验。请求头中必须带有资源标识，开启协商缓存。请求头中包含两个字段携带资源标识：

- **IF-None-Match：** 对应资源的 Etag标识，将资源的hash值传递给服务器。
- **IF-Modified-Since：** 对应资源的 Last-Modified标识，将资源的最后一次改动时间传递给服务器。

> 📌Etag 和 Last-Modified的不同：一个是采用hash对文件进行完整性校验，一个是采用改动时间对文件进行完整性校验。Last-Modified只能精确至秒级，同时如果资源被重复生成而内容不变，则采用Etag对资源进行校验更加准确。**Etag的优先级比 Last-Modified 更高。**
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220527171929071_vR9CoBX2_q.png"/> </div>

​	服务器接收到客户端的协商缓存请求后，根据资源标识对存储在内部的资源进行完整性校验。如果资源没有变化，响应头状态码为304，表示客户端缓存没有修改可以直接取用，同时设置 Cache-Control 字段重新给缓存一个有效时间；资源发生变化，响应头状态码为200，表示客户端缓存已经被修改，在响应体中携带新的资源，同时设置 Cache-Control 字段重新给缓存一个有效时间，并返回新的资源标识。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220701222403694_OE-5OGFQzE.png"/> </div>

**页面刷新对缓存的影响：**

(1) 正常刷新（输入URL，前进后退，link跳转）：强制缓存✔，协商缓存✔

(2) 手动刷新（F5，点击刷新按钮，右键菜单刷新）：强制缓存❌，协商缓存✔

(3) 强制刷新（crtl + F5）：强制缓存❌，协商缓存❌

## 4. 状态管理

​	HTTP的缺点之一是无状态，而 Cookie 和 Session 的出现增强了HTTP的状态管理能力。

**Cookie**

​	Cookie是服务端保存在客户端浏览器上的一条键值对信息，单个域名设置的Cookie不能超过30条，每条Cookie的大小不能超过 4KB。

​	每条Cookie存储了浏览器在单个域名下的状态信息，服务器收到浏览器发送的Cookie后，会验证Cookie的有效性，以获取与该浏览器的交互状态。其工作流程如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220701155313785_3zjufk4IjM.png"/> </div>

- 浏览器第一次发送请求：服务器生成cookie表示交互状态，并在响应头 `Set-Cookie` 字段返回。
- 浏览器收到响应结果后，将服务器返回的cookie存储在本地。
- 浏览器再次发送请求：检测本地是否有该域名及其父域名下的cookie，并自动将cookie携带至请求头的 `Cookie` 字段中。服务器对cookie进行验证，并确定与该浏览器的交互状态。

​	Cookie携带的状态信息是有限的，为了更方便的管理与浏览器的交互状态，Session出现了。

参考：[Cookie - JavaScript 标准参考教程（alpha） - 阮一峰](https://javascript.ruanyifeng.com/bom/cookie.html "Cookie - JavaScript 标准参考教程（alpha） - 阮一峰")

> 📌cookie的常见属性：
> 1\. Domain,Path：设置自动携带cookie请求的域名和路径。默认为一级域名下的所有子域名。比如www\.example.com 会设为example.com。以后如果访问example.com的任何子域名，会自动携带上这个cookie。
> 2\. HttpOnly：禁止该cookie被JS脚本获取；Secure：该cookie只能在https协议下传送。
> 3\. Expire/max-age：类似于强缓存，max-age标识了cookie的有效时长，Expire标识了cookie的最后有效时刻。max-age优先级更高。

**Session**

​	由于浏览器单个域名下最多只能存30个 Cookie，且交互状态信息存储在浏览器这种方案本身就是不安全的，所以工程师又设计了 Session 机制弥补了这些缺陷。

​	Session是服务器保存在自己内部的一张状态信息表，通过 sessionID 唯一标识。服务器只需返回给浏览器与其会话的 sessionID，待浏览器下次请求中携带 sessionID，服务器即可通过sessionID查询与该浏览器的交互状态。Session机制实现了将交互状态存储于服务器本地，其存储数量和容量都相对较多。其工作流程如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220701160946906_83AOv0yS_H.png"/> </div>

- 浏览器第一次发送请求：服务器生成会话记录与该浏览器的交互状态，并生成 sessionID 标识它。在响应头的 `Set-cookie` 字段设置  `‘sessionID:xxx’` 返回给浏览器。
- 浏览器收到响应结果后，将服务器返回的cookie存储在本地。
- 浏览器再次发送请求：检测本地是否有该域名下的cookie，并自动将cookie携带至请求头的 `Cookie: 'sessionID:xxx'` 字段中。
- 服务器对cookie进行验证，并获取到 sessionID。通过查找对应的会话记录，确定与该浏览器的交互状态。

上述方案是通过Cookie来存储并传递 sessionID ，可见 cookie 和 session 经常结合起来使用。此外，如果浏览器禁用 Cookie，则可以通过  `重写URL`，`表单隐藏属性` 等方式来存储并传递 sessionID。

> 📌Cookie 与 Session 的不同：
>
> 1. Cookie存储在浏览器上，Session 存储在服务器上。
> 2. 单个域名的Cookie数量有限，且每条Cookie大小不能超过4KB。
> 3. Cookie存储在浏览器上且直接放在HTTP报文中传输，存在安全问题。
> 4. Cookie可以在浏览器中长期存储，但Session不能在服务器上长期存储，一旦页面关闭断连，session就会被清除。

参考：[Cookie和session应该这样理解](https://zhuanlan.zhihu.com/p/59307179 "Cookie和session应该这样理解")

**Token**

&#x20;    Cookie+Session机制可以很好地记录客户端与服务端的交互状态，但其有一个缺陷就是记录状态的开销由服务端承担。一旦有许多客户端与服务端进行HTTP交互，那么服务端就会开辟更多的内存来存储更多的session。这是一台服务器的情况，试想：在分布式系统中，如果有多台服务器承担相同的服务该怎么保证它们的session同步呢？
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/2074831-20210330020325962-677994127_cDzYUfdrkR.png"/> </div>

上图有一台公共服务器进行负载均衡，它将统一处理用户发送来的请求，并通过算法将请求分发给后面的服务器进行处理。

&#x20;      如果用户A的登录请求被公共服务器分发给服务器1进行处理，那么服务器1会建立与用户A的session并将其保存内存中，服务器1返回sessionID 给用户A；当用户A再次发送携带sessionID的另一个请求时，该请求被公共服务器分发给了服务器2进行处理，而服务器2内存中并没有与用户A的session，用户A将被认为已退出应用程序并被要求再次登录，这显然不是一个很好的用户体验。

&#x20;      以上问题被称为**session一致性问题**，session一致性问题可以通过引入缓存来解决：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/2074831-20210330020357842-6567073_hq0h2KjBzG.png"/> </div>

如上图，所有的session 将同时保存在缓存中，任何一台服务器可以通过访问缓存检查session是否存在，并且利用它来验证用户并授予他们对应用程序的访问权限。但是在生产环境中，这种解决方案有着昂贵的成本。

&#x20;   Token的出现解决该问题。Token可以理解为服务器存储在客户端上的一块令牌，用于对用户的请求鉴权。它不像cookie那样会被自动加入客户端发起的请求中（防止CSRF攻击），也不像session那样将交互状态存储于服务器上。用户只要在请求头中手动加入token，就能实现HTTP的状态管理。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_g_MDAMEfoj.png"/> </div>

如上图，服务器不用记录与每个客户端的session，且任何一台服务器都可以直接通过校验token从而对客户端请求进行鉴权。**请记住：Token之中不包括客户端用户的一些敏感信息，所以token只能用来对用户进行鉴权。如果有记录每个用户与服务端敏感交互信息的需求，还得用session来存储这些敏感信息。**

JWT

&#x20;     JWT（JSON Web Token）是一种token规范，本质上是一个对JSON格式数据进行加密后形成的字符串。JWT中包含了用户的权限信息（不能包含用户敏感信息，比如密码），使得服务端能够对不同客户端的请求的权限进行验证。

JWT的工作流程如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_2fVc1BiFT6.png"/> </div>

&#x20;    通过下面这张图可以对比其与cookie+sessionID进行鉴权的区别：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_I51sQoJx-v.png"/> </div>

JWT由三部分组成，且以点 （.）符号进行分隔，分别是：

- Header：标头，包含两个字段即token类型和使用的签名算法
- Payload：有效载荷，包含多个字段用于存储jwt的一些信息及客户端的权限
- Signature：签名，服务端对jwt进行签名并通过验证签名判断token是否生效

因此，JWT的形式通常如下所示：

```text
xxxxxxxx.yyyyyyyy.zzzzzzzz
```

JWT的生成过程：

Header的格式如下所示：

```json
{
  "alg": "HS256",// 签名算法，实际上是一种单向散列算法
  "typ": "JWT" // token类型
}
```

然后，将此Header进行Base64编码生成JWT的第一部分

Payload的格式如下：

```json
{
  "sub": "221122112", // 主题
  "name": "Mohamd Lawand", // 用户名
  "admin": true, // 权限
  "exp": 15323232, // 过期时间
  "iat": 14567766 // 该 token 的签发时间
}
```

然后，将此Payload也进行Base64编码生成JWT第二部分

Signature的格式是一串散列值，生成签名的代码如下：

```javascript
HMACSHA256( 
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret);
```

将Header和Payload进行Base64编码后的结果用 "." 进行连接，用Header中`alg`

字段提供的加密算法和服务端的私钥 `secret`对拼接结果进行加密。加密后生成的散列值作为JWT的第三部分。

JWT的验证过程：

&#x20;      服务端接收到jwt后，通过base64解码第一部分获得生成签名的加密算法。服务器再取出自己的私钥对 "第一部分+ . +第二部分" 拼接成的字符串进行加密生成一个散列值H1，通过比较H1和jwt的第三部分，确认该token是否是服务端生成的，从而确认请求是否鉴权通过。

JWT的使用：

客户端通过两种方式携带jwt

- 加到请求url参数中：`?token=你的token`
- 加到请求header中：`Authorization: Bearer 你的token`&#x20;

以上两种方式都可能使得jwt被第三者窃听，所以通过https传输或者设置jwt一个短时效能避免jwt被窃听。

## 5. HTTP 1.1

#### 5.1 长连接

​	HTTP另一个缺点是无连接，无连接即是短连接。短连接即客户端与服务端建立好TCP连接，只进行一次HTTP交互后，就断开TCP连接。这样做每次进行HTTP交互就得建立一次TCP连接，十分消耗资源。

​	因此， HTTP1.1 之后的版本将长连接作为可选项。当客户端与服务端进行一次 HTTP 交互后，服务端在响应头中携带 `Connection: keep-alive` 字段，提醒客户端不要将TCP连接关闭，以便在此TCP连接上进行后续HTTP交互。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/fd268e431f2e47af84105b5dfd6d3650_Rv8cFSaVb-.jpeg"/> </div>


#### 5.2 断点续传

​	断点续传指的是当HTTP传输文件时，网络中断导致客户端获得文件不完全。等到下次请求时，客户端不需要重新请求整个文件，而是在请求头中携带 `Ragnge` 字段从断点处请求剩余文件。有关断点续传用到的字段如下：

- `Range`：请求头字段，取值为文件的起始地址和结束地址，单位为byte。Range：bytes = 0- 表示请求整个文件；Range：bytes = 512-1024 表示请求文件第512字节\~第1024字节内容。
- `Content-Range`：响应头字段，取值为返回文件的起始地址和结束地址，单位为byte，另外还有返回文件的大小。Content-Range：bytes 512-1024/512 表示返回文件第512\~第1024字节内容，大小为512 bytes。
- `206`：响应行状态码。表示文件使用的是断点续传方式，即分片的方式进行传输。

## 6. HTTP2.0

### 6.1 HTTPS
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/25-HTTP2_wEI67V9Ntq.png"/> </div>

​	HTTP存在有三个安全问题：1. 通信双方没有安全认证 2. 采用明文通信 3. 没有完整性校验。HTTPS通过在TCP与HTTP之间加了一层协议——TLS，完善了HTTP的通信过程，使得其更具备安全性。TLS重点在于其握手协议，下面介绍TLS的握手协议。

​	握手协议分为四次，且用到了一些前置技术，我们先介绍3种前置技术：

- `CA证书`：CA（Certificate Authority）第三方认证机构，用于生成CA证书。CA证书的生成：受理人向CA提交自己的公钥及一些其他身份信息，CA 收集信息后用自己的私钥对这些信息进行加密生成CA证书。其他用户在浏览器中内置有CA的公钥，通过公钥解密CA证书获取受理人公钥。这里用CA的私钥加密，公钥解密起到了CA对受理人公钥进行签名的作用，防止中间人伪造受理人公钥。
- `非对称加密`：服务端将公钥发送给客户端，客户端利用服务端公钥对会话密钥进行加密发送给服务端，服务端收到后用私钥解密获得会话密钥。非对称加密用于传输会话密钥。
- `对称加密`：客户端和服务端用同一个会话密钥进行加密通信。

下面是TLS握手协议：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/https_rsa_PvTvpsPmc5.png"/> </div>

- 第一次握手：客户端发送 ClientHello包，请求与服务器建立TLS通信。其中包含了 TLS可选版本、可选加密套件算法、随机数C。
- 第二次握手：服务端发送 ServerHello包，与客户端商定TLS相关细节。其中包含了 TLS选择版本、选择加密套件算法（非对称加密+对称加密+散列算法）、随机数B。接着发送ServerCertificate包，其中包含了服务端的CA证书。最后发送ServerHello Done 表示完成第二次握手。
- 第三次握手：客户端利用CA私钥对服务端的CA证书进行解密，获得服务端公钥，并用该公钥对新生成的随机数 pre-master 进行加密。这时客户端得到了与服务端进行对称加密的会话密钥（随机数C+随机数B+随机数pre-master）。接着，客户端发送 Client Key Exchange 数据包，将加密后的随机数 pre-master 发送给服务端；并发送 Change Cipher Spec 数据包，告诉服务端接下来用会话密钥进行加密通信。
- 第四次握手：服务端用自己的私钥解密得到随机数 pre-master，并通过三个随机数生成了会话密钥。接着，服务端发送 Change Cipher Spec 数据包确认并告诉客户端接下来进行加密通信。

参考：[TLS握手解析](https://xiaolincoding.com/network/2_http/https_rsa.html#tls-握手过程)

**CA证书如何进行验证？**

&#x20;     CA证书可能被中间人劫持后进行伪造，导致客户端识别服务端错误，误认为中间人是可信任的吗？了解了CA证书签发及验证流程后，就知道CA颁发的证书是不可能被伪造的：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/证书的校验_5gYx3B6T3-.webp"/> </div>

&#x20;      签发：CA把服务端的公钥、证书的颁发用途、证书的有效时间等等...作为源信息打成一个包。将源信息作为输入，用Hash算法计算得该信息的Hash值，再用自己的私钥对这个Hash值进行签名（用CA私钥进行签名就确定了证书是不可能被伪造的）。

&#x20;      验证：客户端收到服务端发来的CA证书后，找到存储在操作系统或浏览器中签发该证书CA机构的公钥。用同样的Hash算法计算出源信息的hash值H1，同时用CA机构的公钥解密证书的签名得到hash值H2，通过比较H1与H2是否相同确定该证书是否可信（如果证书被伪造，H1和H2不会相同，CA的签名是用私钥做的，不可能被伪造）。

### 6.2 二进制分帧

​	HTTP2.0将HTTP1.0的文本格式改成了二进制格式传输数据，提高了HTTP的传输效率，同时二进制通过位运算能更高效地解析。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/二进制帧_IHBJe1WqlY.png"/> </div>

​	HTTP2.0把HTTP报文划分为两类帧，`首部帧`（HEADERS frame）和 `数据帧`（DATA frame），其结构如下图所示：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/帧格式_yx-zfEtM2e.png"/> </div>

- `首部帧`：只有9个字节，其中流标识符表示每个HTTP帧属于哪一个数据流，通过拼接相同流标识符的数据帧还原数据。
- `数据帧`：存放了通过 **HPACK算法** 压缩过的HTTP头部字段和实体字段。

### 6.3 头部压缩

​	一个HTTP报文由 Header + Body 两部分组成。对于 Body部分，HTTP 通过头字段 `Content-Encoding` 指定其压缩方式，比如常见的 gZip压缩。但对于 Header部分，HTTP 1.1 却没有针对它的压缩手段，HTTP2.0 推出了用于对Header部分压缩的 HPACK 算法，HPACK算法也可用于对Body部分进行压缩。

​	HPCAK算法包含三个部分：静态字典，动态字典，Huffman编码

- `静态字典`：常用首部字段采用1字节编码，内置HTTP2.0框架中。
- `动态字典`：不常用首部字段也采用1字节编码，不过其针对于一次HTTP2.0连接。即在一次连接中对使用频率很高的首部字段进行编码。
- `Huffman编码`：用于对首部字段的具体取值进行编码，而不是直接用文本的形式显示。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/静态表_91JycXYBGP.png"/> </div>

举一个例子：

```latex
server: nghttpx\r\n
```

如果不采用HPACK算法，以上首部字段 `server` 及首部值 `nghttpx` 算上冒号、空格、及末尾的换行符`\r\n`一共占了17个字节。如果采用 HPACK算法进行压缩，其只占用了8个字节：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/静态编码_W-_yTmbAbm.png"/> </div>

红线 1 字节：前两位 `01`表示该头部值为动态取值，后6为 `110110` 对应静态表的索引为 54，查表后知该首部字段为 server。

绿线 7 字节：第一个字节 `10000110`：第一位`1`表示该首部取值采用 Huffman 编码，`0000110`表示首部取值的长度为 6 字节；后面6字节为首部取值的 Huffman 编码，解码后值为 nghttpx。

HTTP2.0 头部由于基于**二进制编码**，就不需要冒号空格和末尾的\r\n作为分隔符。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/静态头部2_XnTxhCfktE.png"/> </div>

参考：[HTTP/2优化-小林](https://xiaolincoding.com/network/2_http/http2.html#头部压缩 "HTTP/2优化-小林")

### 6.4 多路复用

​	HTTP1.0由于其短连接，一个TCP连接只能进行一次HTTP事务（请求与响应）。

​	HTTP1.1推出了长连接，一个TCP连接能进行多次HTTP事务，但是事务之间存在顺序：即前一个事务没有处理完，后续的事务是无法进行的，这就是所谓的**HTTP队头阻塞** 问题。可以开启多个TCP连接将事务分开进行处理，但这样也增加了开销，且服务器能同时处理的连接数是有限的。

​	HTTP2.0推出了多路复用，一个TCP连接能进行多次HTTP事务，且事务可以并行处理，并不存在顺序约束。多路复用中包含了三个重要概念：数据流、消息和数据帧。

- `数据流(Stream)`：在HTTP2.0 中，一个事务被称为一次数据流，即包含一次请求和响应。
- `消息(Message)`：在HTTP2.0中，消息即对应 HTTP1.1 中的请求或响应，由头部和实体构成。
- `数据帧(Frame)`：Frame是 HTTP2.0的最小单位，以二进制的形式组成一个Frame。一个消息包括一条或多条Frame。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/stream-165692279469417_MQyeyxE0z_.png"/> </div>

HTTP2.0规定，在一个TCP连接上，不同Stream中的帧是可以乱序发送的（因此可以并发不同的Stream），因为每个帧头部会携带 Stream ID，所以接收端可以通过 Stream ID 有序将帧组装成HTTP消息，而同一个Stream内部的帧必须是严格有序的。
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220704162416177_ewEoyuVLDO.png"/> </div>

#### 6.5 服务器推送

​	HTTP1.1 采用通信的问答模式，只有客户端主动询问，服务端才会推送资源。WebSocket实现了客户端与服务端之间平等对话，打破了HTTP这种问答模式。而 HTTP2.0 也优化了问答模式，引入了服务器推送技术。

​&#x9;
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/push_-uBjAHgUSc.png"/> </div>

​	如上述图片中，客户端通过 HTTP1.1 请求从服务端那获取到了 HTML 文件，而 HTML 中可能还需要依赖 CSS 来渲染页面，这时客户端还要再发起获取 CSS 文件的请求，需要两次消息往返。在 HTTP2.0 中，客户端在访问 HTML 时，服务端可以直接主动推送CSS文件，减少了消息传递的次数。

​	HTTP2.0 实现服务器推送的步骤如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/push2_HMfQQbxBrl.png"/> </div>

​	客户端发起的请求，使用的是奇数的 Stream ID；服务器主动的推送，使用的是偶数的Stream ID。服务器将要推送资源时，会通过 `PUSH_PROMISE` 类型的帧传递推送消息。并通过帧中的 `Promised Stream ID` 字段告知客户端，接下来在哪个偶数号的 Stream 中推送资源。

​	上图，服务器在 Stream 1 中通知客户端 CSS 资源即将到来，然后在 Stream 2 中发送CSS资源。Stream 1 和 Stream2 是并发的，并不是根据其编号顺序触发。

> 📌WebSocket 和 HTTP2.0 ：
> ​	两者都有服务器推送技术。所不同的是，HTTP2.0 推送的是浏览器将要请求的静态资源，减少了浏览器向服务器发起请求的次数。但不适用于一些实时性场景，因为服务器并不会主动推送类似 JSON 的格式化数据。而 WebSocket 实现了收发双方的平等通信，服务器可以向客户端推送任何类型的数据。

​	HTTP2.0的缺陷：HTTP2.0 虽然采用了多路复用技术，但所有Stream共用一个TCP连接会存在问题，导致某些情况下其性能都不如 HTTP1.1。这个问题本质上是 TCP 的缺陷导致的，即 **TCP 队头阻塞**。

​	我们知道 TCP 是字节流协议，即 TCP 层必须保证收到的字节数据是完整且连续的，这样内核才会将缓冲区里的数据返回给 HTTP 应用。假设这样的场景：Stream1，Stream3的字节流已经传输完毕，且存在于缓冲区中，而Stream2中的一个字节数据没有到达。那么缓冲区的所有数据只能等到这个字节达到，才能被内核提取给HTTP应用。

​	由于 HTTP2.0 中，许多Stream共用一个 TCP 连接，如果出现TCP队头阻塞，将大大增加其传输时延。虽然 HTTP1.1中也存在TCP队头阻塞问题，但 HTTP1.1 通常采用建立多个 TCP 连接的方式实现并发，所以造成的影响没有 HTTP2.0 那么严重。

# WebSocket简介

​	HTTP 通信为问答模式，且每次通信都是由客户端主动发起。如果只是用于浏览普通的web交互网页，http 是十分合适的，因为交互行为都是由用户在网页上主动发起。但是如果要求网页具备实时性，比如聊天室，股票行情显示...，http则不太适合。实现http实时性有常见的两种方式：

- `AJAX轮询`：浏览器每隔几秒就向服务器发送异步查询数据请求。这种方式要求服务器的响应速度快。
- `Long Poll`：浏览器向服务器发送一次查询数据请求，一直等到服务器回复新消息才会关闭连接。这种方式要求服务器连接的并发量大。

由于 http 通信模式以及无状态的特性，服务器每次处理http请求都得先进行状态解析，所以以上两种方式开销都很大。WebSocket由此孕育而生：

​	WebSocket实现了客户端和服务端平等对话，客户端借助http协议与服务端建立连接。客服端发起http请求，请求头中包含`Upgrade:websocket Connection: Upgrade`字段表示请求建立websocket连接，服务端返回 `101` 状态码表示协议切换成功。如下图所示：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/Snipaste_2022-07-04_11-14-42_Uuu6FkYhMR.png"/> </div>

​	WebSocket一次建立连接，客户端和服务器双方都能互相推送数据，而不是像http那样采用问答的通信方式：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/bg2017051502_JuxQL84o5Y.png"/> </div>

参考：[WebSocket 教程——阮一峰](https://www.ruanyifeng.com/blog/2017/05/websocket.html "WebSocket 教程——阮一峰")
