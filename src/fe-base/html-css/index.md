# HTML+CSS知识体系

## CSS

CSS层叠性：**后来居上**，应用于同一个DOM元素的相同优先级的样式，后面写的会覆盖前面写的。

CSS优先级：书写CSS样式时，经常出现多个冲突样式渲染至同一个DOM元素，所以CSS按照优先级渲染。每种选择器的权重按下表计算：

| 选择器        | 格式                      | 优先级权重 |
| ---------- | ----------------------- | ----- |
| !important | !important              | ∞ 无穷大 |
| 行内样式       | style=""                | 1000  |
| id选择器      | #id                     | 100   |
| 类选择器       | .classname              | 10    |
| 属性选择器      | a\[ref=“eee”]           | 10    |
| 伪类选择器      | li:last-child 或 a:hover | 10    |
| 标签选择器      | div                     | 1     |
| 伪元素选择器     | li::after               | 1     |
| 相邻兄弟选择器    | h1+p                    | 0     |
| 子选择器       | ul>li                   | 0     |
| 后代选择器      | li a                    | 0     |
| 通配符选择器     | \*                      | 0     |

### 盒模型
​	  CSS中，每一个DOM元素都会被看作一个盒模型：

<div align="center">
    <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220427174703240-16546818762231_TJUHRoOfnQ.png" >
</div>

​	  每个盒模型由四部分组成：内容（**content**），内边距（**padding**），边框（**border**），外边距（**margin**）。

#### 1. 盒模型大小

**CSS：box-sizing**

<div align="center">
    <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/8994137-a6d03f49038ad095_ECUjKswbbp.png"/>
</div>

通过修改CSS的 `box-sizing` 属性，改变盒子模型计算总宽度和总高度的公式。

- `{ box-sizing: content-box, width = 200px}`：width = 200px = content的宽度
- `{ box-sizing: border-box, width = 200px}`：width = 200px = border + padding + content的宽度

**JS：获取盒子大小**

​	JavaScript 中也有直接获取盒模型大小的属性：

| clientX      | offsetX      | scrollX      |
| ------------ | ------------ | ------------ |
| clientWidth  | offsetWidth  | scrollWidth  |
| clientHeight | offsetHeight | scrollHeight |

- `clientX`：客户区大小，clientWidth = content的宽度 + padding
  ​	注意：如果有滚动条的话，滚动条占据原有content空间，content会在原有基础上缩小。在windows操作系统下 clientWidth  = 缩小后content的宽度 + padding ，在IOS操作系统下 clientWidth = 缩小后content的宽度 + padding + 垂直滚动条宽度。

<div align="center">
    <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_C1q_wVF0cF.png"/>
</div>


- `offsetX`：偏移量大小，offsetWidth = content的宽度 + padding + border
  ​	注意：如果有滚动条的话，滚动条占据原有content位置，content会在原有基础上缩小。此时：offsetX = 缩小后content的宽度 + padding + border +  垂直滚动条宽度。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_rCyi2IhxAS.png"/> </div>

- `scrollX`：滚动区大小，如果盒子内的内容能被盒子容纳下，scrollWidth  = clientWidth ；反之，scrollWidth  = 盒子内内容的宽度。

<div align="center"> 
    <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_b7UDQn61td.png"/> 
</div>

参考：[正确获取DOM元素的大小](https://juejin.cn/post/6844903533242744839 "正确获取DOM元素的大小")

#### 2.  margin

**margin塌陷**

​	上下两个块级元素，上元素有 *margin-bottom* 下元素有 *margin-top*，它们之间垂直间距不是 *margin-bottom + margin-top*，而是**取两个值中较大者**。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_j-R_dR2iu3.png"/> </div>

​	嵌套关系的两个块级元素，父元素有 *margin-top*，子元素也有 *margin-top* ，它们之间垂直间距不是两者之和，而是**取两个中的较大者**。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image__xUd7QrTre.png"/> </div>


**margin负值**

- 负的 *margin-top* 和 *margin-left*：元素向上，向左移动。
- 负的 *margin-bottom* 和 *margin-right*：下邻居元素向上移动，右邻居元素向左移动。

#### 3. 盒子布局容器BFC

​	BFC（Block Formatting Context），即块级格式化上下文。盒子是浏览器对页面进行布局的最小单位，一个BFC可以理解为一个布局容器，容器内的元素必须满足BFC规定的特性，BFC有三层：普通流，浮动流和定位。

- **普通流：** 普通流（又称标准流）内的盒子，一个接着一个排列，块级盒子竖着排列，行内级盒子横着排列。此外，*position：static / relative* 采用 *静态定位* 和 *相对定位* 的盒子会被放在这一层。
- **浮动流**：凌驾于普通流，采用 *float: left / right* 使盒子脱离普通流，使得普通流中的下一个相邻盒子会占据浮动盒子的原位置，浮动盒子会覆盖挤上来的盒子。浮动流的盒子**横着**排列。但浮动流和普通流并不是完全隔离的两个层，浮动起来的元素只是位于**当前行** 进行排列，而不是位于页面左上角进行排列。
- **定位**：凌驾于普通流，采用  *position：absolute / fixed* 使盒子脱离普通流，*absolute* 的参考物为最近的一个具有 *position* 属性的元素，直到追溯至\<body>\</body> 。*fixed* 的参考物为浏览器窗口。

**BFC的作用范围**

​	BFC作用范围是：**创建该BFC元素的所有子元素，但是不包括创建了新的BFC的子元素的内部元素。**

```html
<div id='div_1' class='BFC'>
    <div id='div_2'>
        <div id='div_3'></div>
        <div id='div_4'></div>
    </div>
    <div id='div_5' class='BFC'>
        <div id='div_6'></div>
        <div id='div_7'></div>
    </div>
</div>
```

​		如上面这段代码，*#div\_1* 创建了一个 BFC，这个BFC的作用范围为：*#div\_2, #div\_3, #div\_4, #div\_5*。而 #*div\_6, #div\_7* 则不存在于 *#div\_1* 的BFC中，它们存在于 *#div\_5* 新建的BFC中。

**BFC的创建方式**

- *overflow* 值不为 *visible* 的元素，比如：*overflow: hidden*
- *float* 值不为 *none* 的元素，比如 *float: left / right*
- *position* 值为绝对定位的元素，比如 *position: absolute / fixed*
- *display* 值为 \*flex / inline-block / \****flow-root*** 的元素
- 根元素启动开启BFC，即 \*\* 元素本身就是一个 BFC 布局容器\*\*

**BFC的特性**

- 内部盒子在垂直方向，一个个地放置
- 计算BFC容器的高度是，考虑BFC包含的所有元素（除了绝对定位元素），浮动元素也参与计算。**解决子盒浮动导致的父盒高度坍塌问题**
- BFC内子元素布局不会影响到外面元素。**解决父盒子与子盒子margin塌陷问题**
- BFC内浮动流层的盒子不会覆盖至其他BFC上。一般BFC内浮动流盒子会覆盖位于同一个BFC普通流上的盒子，可以开启普通流盒子的BFC，使得其不会被浮动流盒子覆盖。**解决浮动流覆盖普通流问题**

参考：[学习 BFC (Block Formatting Context)](https://juejin.cn/post/6844903495108132877 "学习 BFC (Block Formatting Context)")

&#x20; IFC(Inline Formatting Context)即行内格式化上下文，一个IFC可以理解为一个行内盒子容器，容器内的元素必须满足IFC规定的特性。

**IFC的创建方式**

- display值为 inline-block

**IFC的特性**

- 内部盒子在水平方向，一个个的放置（不建议在一个IFC内插入块级盒子）
- IFC的高度是其包含的行内元素中最高的高度（不受到垂直方向的 `padding/margin` 的影响）

**IFC的应用**

- 水平居中：将一个块级盒子display设为inline-block在其外层产生IFC，在其父盒子内设置tex-algin: center使其水平居中
- 垂直居中：父盒子创建一个IFC，其中每个行内元素设置vertical-algin: middle，所有行内元素可以在此父盒子下垂直居中

### **布局**

#### 1. float

实现一个三栏布局：两侧内容固定，中间内容（**最先加载和渲染**）随宽度自适应。

**圣杯布局**

圣杯布局的DOM结构：

```html
<header>页首</header>
<div class="container">
  <div class="middle">中间弹性区</div>
  <div class="left">左边栏</div>
  <div class="right">右边栏</div>
</div>
<footer>页尾</footer>
```

DOM书写上middle写在left和right前面，实现中间盒子被优先渲染。

1. 首先让 *left, middle, right* 向左浮动，启动container容器的BFC使得其高度不会塌陷，给middle宽度为100%使得其宽度自适应。


- .container{ **overfliow:hidden** }
- .middle{ **width: 100%;  float:left;** }
- .left{ width: 200px; height: 200px; **float:left;** }
- .right{ width: 200px; height: 200px;  **float:left;** }

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/webp_LEmJoZcnFp.jpg"/> </div>

2. 利用 **负的margin-left** 使得 *left，right* 与  *middle* 同一行并覆盖它。
```css
.container{ overflow:hidden }
.middle{ width: 100%;  float:left; }
.left{ width: 200px; height: 200px; float:left; **margin-left: -100%;** }
.right{ width: 200px; height: 200px;  float:left; **margin-left: 200px;** }
```
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/webp-16513277788133_n0OMs57quU.webp"/> </div>


3. 在 *container* 中设置 **padding**，挤出 *left* 和 *right* 的宽度。

```css
.container{ overfliow:hidden; **padding-left: 200px; padding-right: 200px;** }
.middle{ width: 100%;  float:left; }
.left{ width: 200px; height: 200px; float:left; margin-left: -100%; }
.right{ width: 200px; height: 200px;  float:left; margin-left: 200px; }
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/webp-16513279460796_gGdIObZpMD.webp"/> </div>


4. 最后利用  **相对定位** 将 *left* 和 *right* 从 *middle* 上面移开，实现圣杯布局。

```css
.container{ overfliow:hidden; padding-left: 200px; padding-right: 200px; }
.middle{ width: 100%;  float:left; }
.left{ width: 200px; height: 200px; float:left; margin-left: -100%; **position: relative; left: -200px;** }
.right{ width: 200px; height: 200px;  float:left; margin-left: 200px;  **position: relative; right: -200px;** }
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/webp-16513281169689_9rcr4IJipD.webp"/> </div>

参考：[圣杯布局](https://www.jianshu.com/p/f9bcddb0e8b4 "圣杯布局")

**双飞翼布局**

双飞翼布局的DOM结构

```html
<header>Header内容区</header>
<div class="middle">
    <div class="middle-inner">中间弹性区</div>
</div>
<div class="left">左边栏</div>
<div class="right">右边栏</div>
<footer>Footer内容区</footer>
```

DOM书写上middle写在left和right前面，实现中间盒子被优先渲染。

1. 首先让 *left, middle, right* 向左浮动，由于没有了 *container* 使用另外一种方式即给 *footer* 一个 **clear: both** 清除浮动防止高度塌陷，给 *middle* 宽度为100%使得其宽度自适应。

```css
.footer{ **clear: both** }
.middle{ **width: 100%;  float: left;** }
.left{ width: 200px; height: 200px; **float: left;** }
.right{ width: 200px; height: 200px;  **float: left;** }
```
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_td2ajpVRTg.png"/> </div>

2. 使用 **负的 margin-left** 使得  *left, right* 与 *middle* 同处一行，并覆盖它。

```css
.middle{ width: 100%;  float: left; }
.left{ width: 200px; height: 200px; float: left; **margin-left: -100%;**}
.right{ width: 200px; height: 200px;  float: left; **margin-left: -200px;**}
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_C4LOtAs4aL.png"/> </div>

3. 在 **middle-inner** 中设置 **padding** 将 *middle* 中的内容往中间挤出，防止 *left, right* 将其覆盖。实现双飞翼布局。

```css
.middle-inner{ **padding: 0 200px 0 200px;** }
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_gnjpIhHAlV.png"/> </div>

> 圣杯布局与双飞翼布局的异同：
> 同：两者都使用了 **float: left** 和 负的 **margin-left** 使得三栏同处一行
> 异：而解决 *left, right* 覆盖 *middle* 的方式不同。圣杯布局利用 *container* 包裹住 *left, middle, right* ，给*container* 设置 **padding** 来挤出 *left, right* 的摆放位置，再利用 **相对定位** 将 *left, right* 移至挤出的位置；双飞翼布局在 *middle* 内部放入一个 *middle-inner*，给 *middle-inner* 设置 **padding** 将middle的内容挤出，导致其不被 *left, right* 覆盖。总之，**双飞翼布局比圣杯布局少用了相对定位**。

参考：[双飞翼布局](https://juejin.cn/post/6973562604581027853 "双飞翼布局")

**清除浮动**

​	清除浮动主要是为了解决父盒子因为子盒子浮动引起导致其高度为0的问题。下面有几种清除浮动的方法：

- 浮动元素末尾添加一个空标签，设置clear: both；
```html
 <div style="clear: both"> < /div>
 ```
- 父盒子伪元素设置 clear: both，这种是方式1的优化，不用添加一个空标签；
``` css
.clearfix:after{ 
    content: ' '; 
    display: block; 
    clear: both 
}
```
- 父盒子启动BFC。
```css
overflow: hidden;
```

#### 2. position

​		定位是CSS用于布局的除浮动外的另一种方式，通过 **position** 属性设置，它有以下取值：

- *static*：静态定位，不移动位置但占据文本流。
- ***relative***：相对定位，相对于自己原来在标准流中的位置移动，**原来size在标准流继续占有**。
- ***absolute***：绝对定位，参考最近具有 *position* 属性（取值为除static外的所有属性）的元素的位置进行移动，**原来size脱离标准流**。
- **fixed**：固定定位，特殊的绝对定位，参考浏览器窗口的位置进行移动，**原来size脱离标准流**。
- **sticky**：粘性定位，适用于具有滚动条的长页面。如果元素位置在视口中，其相当于relative；如果用户滚动页面，导致元素位置在视口外，其相当于fixed。

常用的定位组合：**子绝父相**，父盒设置 *relative* 但不移动，作为参照物；子盒设置 *absolute* 以父盒位置为参照进行移动。

#### 3.flex

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_.png"/> </div>

​	flex（Flexible Box）弹性布局。布局样式为一个垂直交叉轴，默认主轴为从左至右的X轴，侧轴为从上至下的Y轴。盒子首先沿主轴方向排列，放满后按侧轴方向换行，再继续沿主轴方向排列。{ display: flex }开启布局。flex有以下几个常用属性，加粗为默认值：

**容器属性**：

- *flex-direction*：设置主轴方向，***row*** 为X轴，*column* 为Y轴。
- *flex-wrap*：设置是否换行，***nowrap*** 不换行盒子排在一条线上，*wrap* 换行。
- *justify-content*：设置盒子在主轴方向的对齐方式，***flex-start*** 从起点至终点排列，*flex-end* 从终点至起点排列，*center* 从中点至两边扩散，*space-between* 两端对齐（起点终点紧贴边框）中间均匀分布。
- *algin-items*：设置盒子在侧轴方向的对齐方式，*flex-start* 从起点至终点排列，*flex-end* 从终点至起点排列，*center* 从中点至两边扩散，**stretch** 如果盒子未设置高度那么盒子高度将占满整个容器。

**项目属性**：

- *algin-self*：设置在盒子上的 *algin-items*，为盒子设置侧轴的对齐方式。**auto** 表示继承容器的 *algin-items* 值，其余取值与 *algin-items* 一致：*flex-start, flex-end, center, stretch*。

**flex样式的三个值**

​	*flex* 与 *algin-self* 一样是用来设置在盒子上的样式，它是三个属性的缩写：

- *flex-grow*：当主轴未被盒子占满，按比例划分主轴上剩余空间。**0** 盒子宽度不变，不划分剩余空间。如果主轴上所有盒子该值为  *1*  则它们等分剩余空间；如果有一个盒子该值为 *2* 其他盒子都为 *1*，则前者占据剩余空间比其他项多一倍。
- *flex-shrink*：当盒子总宽度超过容器宽度，主轴被占满，按比例缩放盒子宽度。**1** 所有盒子默认该值为 *1*，当主轴空间不足时，都将等比例缩小。如果一个盒子该值为 *0* 其他盒子都为 *1* ，则主轴空间不足时，前者不缩小。
- *flex-basis*：在分配多余空间前，给盒子在容器中一个固定宽度。浏览器根据这个属性，计算主轴是否有剩余空间。***auto*** 盒子宽度为其原本的大小，一个...px值，盒子占主轴固定空间。

​		*flex*：*flex-grow*，*flex-shrink*，*flex-basis*. 默认值为 ***0 1 auto***.

参考：<br/>
[Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html "Flex 布局教程：语法篇")<br/>
[一个测试flexbox工具](https://angrytools.com/css-flex/ "一个测试flexbox工具")

#### 4. grid

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image_hftRbtdwSj.png"/> </div>

​	Grid 网格布局，是继 flex 布局之后推出的更强大的布局方案。布局分为容器和项目，**容器** 即是最外层的盒子，**项目** 是容器的亲儿子盒子，不包括孙子盒子后面几代盒子。Grid只对项目生效。

​	Grid 布局的属性分为 *容器属性* 和 *项目属性*。{ display: grid }开启 *Grid* 布局。

**容器属性**：

- *grid-template-columns / grid-template-rows*：指定每一 列 / 行 的大小。可以的取值为：*px(数值)* / *%(百分比)* /  *1fr(比例)* / *auto(自适应)* .

​	比如实现一个三栏布局：两边固定中间自适应{ display: grid; grid-template-colums: 200px auto 200px }. **注意这里给的是单元格的size，不是项目的size**。

- *column-gap / column-gap*：列 / 行间隔。可以缩写成  *gap*：20px(列间间隔) 30px(行间间隔).
- *grid-auto-flow*：项目摆放顺序。**row** 先行后列，*column* 先列后行。
- *grid-template-areas*：将单元格进行分区与合并。

​比如 { 
    display : grid; 
    grid-template-colunms:
     100px 100px 100px;
      grid-template-rows: 100px 100px 100px;
}

```latex
grid-template-areas: 'header header header' 
                     'main main siderbar' 
                     'footer footer footer'
```

​	上面代码中，顶部是页眉区域 *header*，底部是页脚区域 *footer*，中间为 *main* 和 *sider*。

- **justify-items / algin-items**：一个单元格中只能放一个项目，当项目的size小于单元格的size时，用  *justify-items* 调整项目在单元格内的水平位置，*algin-items* 调整在单元格的垂直位置。**stretch** 项目将单元格在水平/ 垂直方向填满，*start* 项目对齐单元格的起始边缘，*end* 对齐单元格的结束边缘，*center* 在单元格内居中。*place-items*：*justify-items*  algin-items 是两者的缩写。

  比如： { place-items: start start } 项目位于单元格左上角;
  ​      { place-items: center center  } 项目位于单元格水平居中和垂直居中;
  ​      { place-items: end end } 项目位于单元格右下角;
        { place-items: stretch stretch  } 项目将单元格填满;

- *justify-content / align-content*：当所有单元格size小于容器的size时，用 *justify-content* 调整所有单元格在容器内的水平位置，*align-content* 调整在容器内的垂直位置。

**项目属性**：

- *grid-column-start / grid-column-end / grid-row-start / grid-row-end*：设置项目在单元格的摆放位置。**网格线从 1 开始编号**。<br/>
  比如：{ grid-column-start: 1; grid-column-end: 3; grid-row-start: 2; grid-row-end: 4 }设置该项目占 第2，3两行，第1，2两列交叉组成的4个单元格。<br/>
​	*grid-column-start / grid-column-end*  可以缩写成  grid-column:  < start-line> / <br end-line>;<br/>
​	*grid-row-start / grid-row-end*  可以缩写成  grid-row:  < start-line> / < end-line>;<br/>
​   比如：上面例子可以缩写为{ grid-colum: 1 / 3; grid-row: 2 / 4 }。

- *justify-self / algin-self*：用法与 *justify-items / algin-items* 一致，都是设置容器在单元格内的水平 / 垂直方向的布局。前者是作用于容器中所有项目，后者作用于具体某一个项目。取值都为 *start, end, center, stretch*。
  *place-self*：*justify-self*  *algin-self* 是两者的缩写。

参考：<br/>
(1)[CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html "CSS Grid 网格布局教程")<br/>
(2)[Grid\_常用属性总结](https://juejin.cn/post/7092609553472159774 "Grid_常用属性总结")

> *flex* 布局与 *Grid* 布局的不同：  
> *flex* 布局将容器划分坐标系的 **交叉轴**，相当于在一个单元格内指定项目的摆放位置，属于**一维布局**。*Grid* 布局将容器划分为多个单元格，相当于在多个单元格内指定项目的摆放位置，同时一个项目可以占据多个单元格，属于**二维布局**。
> 

### 图文样式

#### 1. line-height

​        表示文本盒子的高度，原本文本盒子的高度等于文本的font-size的大小，如果指定高度文本盒子等于指定的高度，同时文本会在盒子内垂直居中。

### 响应式

**计量单位**

​	通常，我们给定盒子大小的时候会用 **px** 直接指定值，然而这样一个值是 *绝对单位*，它不会随着窗口 size的变化而变化；如果需要响应式布局，需要给定一个相对值，而这个值的单位为 *相对单位*。CSS中有以下相对单位：

| 单位  | 相对于                                                        |
| --- | ---------------------------------------------------------- |
| em  | 当前元素的 ***font-size*，1***em* = 1 \* font-size               |
| rem | html元素的 ***font-size*，1***rem* = 1 \* html \*\**font-size* |
| vw  | 浏览器可视窗口宽度的 1%                                              |
| vh  | 浏览器可视窗口高度的 1%                                              |

**媒体查询**

​	媒体查询的语法如下：

```css
@media mediatype and|not|only (media feature){ }
```

- *mediatype*：媒体类型，一般取值为 ***scree*** 用于电脑屏幕，平板电脑，智能手机等。
- *关键字*：多个查询条件进行连接，***and*** 与、not 非、only 指定特定类型。
- *media feature*：媒体特性，筛选条件 ***min-width*** 可视窗口最小宽度， ***max-width*** 可视窗口最大宽度。

利用媒体查询 -> 根据可视窗口宽度，调整 *html* 元素 的 *font-size* -> 利用 *rem* 调整DOM元素大小

```css
@media screen and (min-width: 374px) {
    html {
        font-size: 86px;
    }
}

@media screen and (min-width: 375px) and (max-width: 413px) {
    html {
        font-size: 100px;
    }
}

@media screen and (min-width: 414px) {
    html {
        font-size: 110px;
    }
}

body{
  font-size: 0.16rem;
}
```

## CSS3

### 动画

​	动画是规定一个样式序列，例如：0%css1，25%css2，50%css3，75%css4，100%css5，动画就是在规定时间内将css1\~5在某个DOM元素上循序渐进地改变。动画的基本使用：定义 + 调用。

**基本使用**

​		使用关键字 **@keyframes + 动画名称** 定义一个动画，其中每个%对应的样式被称为**关键帧**。使用{ **animation-name：动画名称；animation-duration：动画时长；**} 调用动画。

```css
/* 1.定义动画 */

@keyframes move {
    0% {
        transform: translate(0, 0);
    }
    /* 第一个状态 */
    25% {
        transform: translate(1000px, 0);
    }
    /* 第二个状态 */
    50% {
        transform: translate(1000px, 500px);
    }
    /* 第三个状态 */
    75% {
        transform: translate(0, 500px);
    }
    /* 最终态 */
    100% {
        transform: translate(0, 0);
    }
}

div {
    width: 200px;
    height: 200px;
    background: pink;
    /* 2.调用动画 */
    animation-name: move;
    animation-duration: 20s;
}

<body>
    <div></div>
</body>
```

以上代码实现了一个 *div* 利用 平移+动画 旋转一圈。

**常见属性**

- *animation-timing-function*：指定动画的播放速度曲线。***ease*** 低速开始，然后加快，在结束前变慢；*linear* 匀速；*steps(n)* 将动画每个关键帧的切换分n段执行，每段之间不存在曲线过度而是直接切换。参考：[steps介绍](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/ "steps介绍")
- *animation-delay*：指定动画延迟播放时间，从渲染好页面开始计时。***0*** 表示立即播放。
- *animation-iteration-count*：指定动画播放次数。**1** 表示只播放一次；*infinite* 表示循环播放。
- *animation-fill-mode*：指定动画播放完成后保持的状态。***backwards*** 表示播放完回到 0% 的关键帧； *forwards* 表示回到 100% 的关键帧。
- *animation-play-state*：指定动画播放与否。***running*** 表示播放；*paused*表示停止。通常配合伪类:hover使用。
- *animation-direction*：指定动画在下一个播放周期的播放顺序。***normal*** 表示动画与上一个周期播放顺序一致；*alternate* 表示与上一个周期播放顺序相反。

```css
div {
  width: 100px;
  height: 100px;
  background-color: aquamarine;
  /* 动画名称 */
  animation-name: move;
  /* 动画花费时长 */
  animation-duration: 2s;
  /* 动画速度曲线 */
  animation-timing-function: ease-in-out;
  /* 动画等待多长时间执行 */
  animation-delay: 2s;
  /* 规定动画播放次数 infinite: 无限循环 */
  animation-iteration-count: infinite;
  /* 是否逆行播放 */
  animation-direction: alternate;
  /* 动画结束之后的状态 */
  animation-fill-mode: forwards;
}

div:hover {
  /* 规定动画是否暂停或者播放 */
  animation-play-state: paused;
}
```
