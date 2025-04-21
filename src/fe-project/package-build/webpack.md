

## webpack 基本使用 （why，what）

​ 现在项目都分模块进行开发，所以有了 `模块化` 的概念。模块化就是将每个 js/css/vue 文件视为一个模块，通过在原模块中导出，其他模块中导入，在其他模块中引用原模块特有功能。当一个项目模块过多，模块间的依赖关系变得复杂时，引用各种模块会产生时延，从而影响项目的运行效率。

​ `Webpack` 从所有模块的入口文件开始，以入口文件为根节点，将模块间的依赖关系整合成一颗关系树，并将这些有依赖关系的模块打包成几个大文件方便浏览器获取。Webpack 有以下优点：

- `模块打包`：将不同类型不同模块的文件打包整合在一起，方便浏览器获取，减少网络 I/O 次数，加速页面加载。
- `编译兼容`：通过 webpack 的 loader 机制，将诸如 .less, .vue, .jsx 这类在浏览器无法识别的格式文件编译转换为统一格式。让开发人员可以使用新特性和新语法，提高开发效率。

下面举一个常见的 webpack 打包的例子：

```javascript
// untils.js
export function add(num1, num2) {
  return num1 + num2;
}

export function multi(num1, num2) {
  return num1 * num2;
}
```

```javascript
// 入口文件：main.js
import { add, multi } from './untils';

console.log(add(2, 3));
console.log(multi(2, 3));
```

在项目首页引用入口文件：

```html
// index.html
<body>
  <script src="./src/main.js" type="module"></script>
</body>
```

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620163055700_k13pPIHkMn.png"/> </div>

我们使用 webpack 将 main.js 和 untils.js 打包成一个文件 bundle.js。在当前路径下执行命令：

```bash
webpack ./src/main.js ./dist/bundle.js
```

打包后修改 index.html 中的代码，引用 bundle.js 即可：

```html
// index.html
<body>
  <script src="./dist/bundle.js" type="module"></script>
</body>
```

## 1.基本配置

### 1.1 路径配置 entry/output

观察 webpack 打包命令：&#x20;

```bash
webpack ./src/main.js ./dist/bundle.js
```

其中 `./sec/main.js` 是需要打包的入口文件路径，而 `./dist/bundle.js`是需要打包的出口文件路径，配置 webpack 可以使得命令简化如下：

```bash
webpack
```

我们在项目路径下创建一个 `webpack.config.js` 文件对 webpack 进行配置：

```javascript
// webpack配置文件 webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
```

- `entry`：入口文件路径
- `output`：
  - `path`：出口文件存放路径
  - `filename`：出口文件名称

其中 `output.path` 参数设置的是一个绝对路径。`path.resolve(__dirname, 'dist')` 这行代码是为了生成绝对路径：path 是 node 中的一个包，path.resolve 方法进行路径的拼接，`__dirname` 是当前 webpack.config.js 这个文件所在路径，加上 `dist` 就生成了绝对路径。文件结构如图所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620164326474_NkGQ5Wuf5-.png"/> </div>

在配置 webpack 过程中, 引用了 node 环境下的 path 包。为了使 webpack 配置文件生效，必须引入 node 环境。为项目生成 `package.json`文件，引入 node 环境，输入如下命令：

```bash
npm init
```

packet.json 文件的作用不仅是为了引入 node 环境，它同时是[包管理工具的图谱](/fe-project/package-management/#package.json)。

### 1.2 loader

​ **loader本质是一个函数，接口源文件作为参数，返回转化后的结果。** 上面我们是通过 webpack 将入口文件引用的 js 模块进行打包。如果入口文件不仅仅引用了 js 模块，还引用了 css，vue 等其他类型的模块，我们通过 loader 将它们进行编译转换后打包。  

**常见的loader如下：**

| 名称            | 描述                                  |
|-----------------|---------------------------------------|
| babel-loader    | 转换 ES6、ES7 等 JS 新特性语法        |
| css-loader      | 支持 `.css` 文件的加载和解析          |
| less-loader     | 将 Less 文件转换成 CSS                |
| ts-loader       | 将 TypeScript 转换成 JavaScript       |
| file-loader     | 进行图片、字体等的打包                |
| raw-loader      | 将文件以字符串的形式导入              |
| thread-loader   | 多进程打包 JS 和 CSS                  |

**loader 的配置方法：**

```javascript
// webpack配置文件 webpack.config.js
module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```

- `test`: 识别出哪些文件会被转换
- `use`: 定义出在进行转换时，应该使用哪个 loader，use字段的解析顺序是 **从后往前**（即先执行 css-loader 进行解析，后执行 style-loader ）


#### 1.2.1 CSS Loader

看一下文件目录结构：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620165823696_GMaoa9Fjea.png"/> </div>

我们的目的是将入口文件引用的 css 模块也打包至 bundle.js 文件中：

```javascript
// 入口文件：main.js
import { add, multi } from './untils'; // 导入js模块
import './css/common.css'; // 导入css模块

console.log(add(2, 3));
console.log(multi(2, 3));
```

如果使用之前的 webpack 配置，不能打包 css 模块，所以必须在 webpack.config.js 中配置打包 css 模块所需的 `loader`。

打包 css 模块需要两种类型的 loader：

- `css-loader`：加载并解析导入的 css 文件，返回 css 代码
- `style-loader`：将解析出的 css 代码插入引用这些代码的 DOM 中

我们先通过 npm 下载这两个 loader 模块，执行以下命令：

```bash
npm install --save-dev css-loader
npm install --save-dev style-loader
```

接着在 webpack.config.js 文件中配置 loader：

```javascript
// webpack配置文件
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // 配置loader
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

除了 css 外，还有一些样式模块比如 less，也需要对应的 loader 进行解析后打包。less 模块除了用到 css-loader 和 style-loader 外，还用到了 less-loader。执行以下命令下载 `less-loader`：

```bash
npm install less less-loader --save-dev
```

接着在 webpack.config.js 文件中配置 loader：

```javascript
// webpack配置文件
module.exports = {
  // 配置loader
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

记住 use 的执行顺序是**从后往前** 。

#### ES6 文件打包

​ 一般打包 js 模块，是不需要 loader 进行转换的，但是这样打包的 js 模块会保留 ES6 语法，导致某些低版本浏览器无法解析。为了提高项目的兼容性，通过配置 `babel-loader` 将 js 模块中的 ES6 语法转为 ES5 语法。

执行以下命令下载 `babel-loader`模块：

```bash
npm install --save-dev babel-loader@7 babel-core babel-preset-es2015
```

接着在 webpack.config.js 文件中配置 loader：

```javascript
// webpack配置文件
module.exports = {
  // 配置loader
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
    ],
  },
};
```

#### VUE 文件打包

​ 如果入口文件引入了 vue 模块，则在必须配置 `vue-loader` 和 `vue-template-compiler`后进行打包。执行以下命令下载 vue-loader 和 vue-template-compiler 模块：

```bash
npm install --save-dev vue-loader vue-template-compiler
```

接着在 webpack.config.js 文件中配置 loader：

```javascript
// webpack配置文件
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
    ],
  },
};
```

按照上面的经验，进行下载和配置之后就可以进行打包，但是想打包 vue 文件还需要进行一个配置：

```javascript
// webpack配置文件
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
};
```

配置 `alias` 的目的是切换 vue 支持的模式。vue 有两种模式：`runtime-only` 和 `runtime-complier`，该配置制定了项目 import vue 的路径为 `node_modules/vue/dist/vue.esm.js`，这个路径下版本的 vue 包含了 runtime-compiler 模式。

#### 图片文件打包

​ 如果入口文件引用了图片模块，则必须配置转换图片对应的 loader 后再打包。与图片有关的 loader 有两个：

- `url-loader`：如果图片文件小于设置的限制大小，采用 base64 编码将图片直接写入 HTML 中
- `file-loader`：如果图片文件大于等于设置的限制大小，将图片打包至 dist 文件夹，并返回引用 URL

执行以下命令下载 url-loader 和 file-loader 模块：

```bash
npm install url-loader --save-dev
npm install file-loader --save-dev
```

接着在 webpack.config.js 文件中配置 loader：

```javascript
// webpack配置文件
const path = require('path');

module.exports = {
  // 配置loader
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
            },
          },
        ],
      },
    ],
  },
};
```

上面 `limit`字段设置了打包图片采用的 loader：如果图片文件小于 8KB，采用 `url-loader` 将图片直接转为 base64 编码写入 .html 文件中；如果图片大于等于 8KB，采用 `file-loader` 将图片重新打包入 dist 文件夹中，同时对图片重新命名。

**配置 file-loader 打包后图片命名**

如果不进行配置，file-loader 对图片模块进行打包后生成的文件名称是一段 32 位 hash ：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620173922312_QHGONzkn5W.png"/> </div>

这样无法与原图片一 一对应，通过在 webpack.config.js 中配置，可以实现打包后的图片命名与原图片命名对应上：

```javascript
// webpack配置文件
module.exports = {
  // 配置loader
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

配置的主要命令为`name: 'img/[name].[hash:8].[ext]'`：

- `img/`：在 dist 文件夹下新建一个 img 文件夹，打包后的图片都会放入该文件夹中
- `[name]`：表示原图片文件名
- `[hash:8]`：生成的 hash 值，表示取 8 位
- `[ext]`：表示原文件的扩展名

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620201723875_wJildCNfz0.png"/> </div>

### 1.3 plugin

#### HTML 插件

​ 在原本的目录中，项目首页 index.html 与打包文件夹 dist 是同级的。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620213431033_IT4PKwhySL.png"/> </div>

​ 现在我们想让 index.html 存在于 dist 文件夹中，这样项目上线时只需将 dist 文件夹拷贝至服务器上即可。使用 `html-webpack-plugin` 插件后，生成的效果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620213559734_TYcguQQbOt.png"/> </div>

执行以下命令下载 html-webpack-plugin 插件：

```bash
npm install html-webpack-plugin --save-dev
```

接着在 webpack.config.js 中配置插件：

```javascript
// webpack配置文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
```

`HtmlWebpackPlugin()`中传入 `template:index.html`，意思是在 webpack.config.js 同级路径下寻找名为 index.html 的文件，并以其为模板生成新的 index.html 文件放入 dist 文件夹中。

#### JS 压缩插件

​ 打包后的出口文件保留原格式会含有多余的字符，比如空格、注释等。通过`uglifyjs-webpack-plugin` 插件可以将打包后的出口文件进行压缩，使得其体积更小，效果如下图所示：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621161710428_Twqcau8UqY.png"/> </div>

执行以下命令下载 uglifyjs-webpack-plugin 插件：

```bash
npm install uglifyjs-webpack-plugin@1.1.1 --save-dev
```

接着在 webpack.config.js 中配置插件：

```javascript
// webpack配置文件
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [new uglifyJsPlugin()],
};
```

### 1.4 配置文件分离

​ webpack 的配置文件并没有规定全放在一个 `webpack.config.js`文件中。项目开发阶段有一个 webpack 配置，项目生产阶段也有一个 webpack 配置，可以将开发阶段的配置抽离在 `dev.config.js` 中，生产阶段的配置抽离在 `prod.config.js` 中，公共配置抽离在 `base.confg.js`中。

分离后的 webpack 文件目录如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620202241498_KRdNHChKsk.png"/> </div>

在将三个分离的 webpack 配置文件合并之前，我们需要下载`webpack-merge`包：

```bash
npm install webpack-merge
```

```javascript
// 公共配置：base.config.js
module.exports = {
    // 基础配置
    ...
}
```

通过 webpack-merge 在 dev.config.js 中合并 base.config.js ：

```javascript
// 开发环境配置：dev.config.js
const webpackMerge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = webpackMerge(baseConfig, {
    // 开发环境配置
    ...
})
```

通过 webpack-merge 在 pro.config.js 中合并 base.config.js：

```javascript
// 生产环境配置：prod.config.js
const webpackMerge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = webpackMerge(baseConfig, {
    // 生产环境配置
    ...
})
```

我们在开发环境下用 `dev.config.js` 配置 webpack，在生产环境下用 `pro.config.js` 配置 webpack。通过修改 package.json 的 script 属性选择 webpack 配置文件：

```json
// package.json
{
  "scripts": {
    "build": "webpack --config ./build/prod.config.js",
    "dev": "webpack-dev-server --config ./build/dev.config.js"
  }
}
```

修改 package.json 文件后，开发环境下运行 `npm run dev` 命令，会采用 dev.config.js 配置 webpack，并等待 webpack 打包后本地预览项目；生产环境下运行 `npm run serve`命令，会采用 prod.config.js 配置 webpack，并等待 webpack 打包后放置服务器上访问。

## 2.高级配置

### 2.1 多入口

​ 在项目有多个入口文件情况下，可以配置 webpack 如下：

```javascript
// webpack配置文件

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. 配置多入口文件路径
  entry: {
    index: path.resolve(__dirname, '/src/index.js'),
    other: path.resolve(__dirname, '/src/other.js'),
  },
  // 2. 配置出口文件路径
  output: {
    filename: '[name].[contentHash:8].js', // name 即为上面entry的属性名
    path: distPath,
  },
  // 3. 配置HTML插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '/src/index.html'),
      filename: 'index.html',
      chunks: ['index'], // 只引用 index.js
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '/src/other.html'),
      filename: 'other.html',
      chunks: ['other'], // 只引用 other.js
    }),
  ],
};
```

配置多入口打包后，效果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620214616509_vaBFIbRtnB.png"/> </div>

### 2.2 抽离 css 文件

​ 之前通过 loader 配置过关于 css 的打包，回想一下流程：先通过 `css-loader`解析，再通过 `style-loader` 插入 .html 中。如果是开发环境采用先前的配置是没问题的，但是生产环境需要对 css 文件抽离并压缩，以缩小 .html 的体积和减少解析 css 的时间。

执行以下命令下载 `mini-css-extract-plugin` 插件进行抽离，`terser-webpack-plugin` 和 `optimize-css-assets-webpack-plugin` 插件进行压缩：

```bash
npm install mini-css-extract-plugin --save-dev
npm install terser-webpack-plugin --save-dev
npm install optimize-css-assets-webpack-plugin --save-dev
```

接着在 webpack.config.js 中配置：

```javascript
// webpack配置文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // 1. 配置loader
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // style-loader 换成 MiniCssExtractPlugin.loader
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  // 2. 配置插件抽离css
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.[contentHash:8].css',
    }),
  ],
  // 3. 压缩css
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
};
```

配置抽离 css 文件后，效果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220620222723013_Jh5uKCb9lp.png"/> </div>

### 2.3 抽离公共代码

​ 在项目中，一个模块可能被其他很多模块都引用到。如果将公共模块都打包入其他模块中，会导致打包文件过于臃肿。此外，一旦其他模块有微小的改动，公共模块就得跟着该模块重新再打包一次，这样无疑是十分耗时的。这些公共模块被分为两类：自己写的模块称为 `公共模块`，第三方引入的模块称为 `第三方模块`。

​ 在 webpack.config.js 中配置文件抽离：

```javascript
// webpack配置文件
module.exports = {
  optimization: {
    // 分割代码块
    splitChunks: {
      chunks: 'all',
      // 缓存分组
      cacheGruops: {
        // 第三方模块拆分
        verndor: {
          name: 'vendor', // chunk名称
          priority: 1, // 分块优先级，先拆分第三方模块
          test: /node_modules/, // 匹配路径，从该路径匹配第三方模块
          minSize: 0, // 大小限制，模块>=该值就进行抽离
          minChunks: 1, // 次数限制，模块被引用>=该值就进行抽离
        },
        // 公共模块
        common: {
          name: 'common',
          priority: 0,
          minSize: 0,
          minChunks: 2,
        },
      },
    },
  },
};
```

配置抽离公共模块后，效果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621100244396_QzS9aEBRc2.png"/> </div>

### 2.4 懒加载

​ 懒加载是一个通用的概念，在 vue 引入子组件或者 vue-router 路由切换组件中，我们都使用过懒加载。懒加载实际上就是按需加载，或者称为异步加载。

​ 懒加载并不是 webpack 定义的功能，但是 webpack 支持并检测这种写法：

```javascript
// 入口文件 index.js
import _ from './src/untils'; // 正常引用

// 异步加载-懒加载
setTimeout(() => {
  import('./src/untils').then(res => {
    // 返回一个promise对象，res即为引入的对象
    res.add(1, 2);
  });
}, 1500);
```

懒加载的模块会被 webpack 抽离，作为一个单独的 bundle 文件等待浏览器请求：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621113241550_uv47_tx7-t.png"/> </div>

> 📌module, chunk 和 bundle 的区别：
> 1\. module：webpack 打包资源的最小单位，每个源码文件都被 webpack 视为一个模块
> 2\. chunk：webpack 对资源的组合，由多个模块合并成一个 chunk。产生 chunk 的方式如：“多入口” 中配置 entry，“抽离公共代码”中配置 vendor 和 common，“懒加载” 中异步引入的模块。chunk 存在于内存中。
> 3\. bundle：bundle 即是 chunk 最终输出的打包文件，一个 chunk 对应一个 bundle

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621111704535_36U-c9nYmi.png"/> </div>

## 3. 性能优化

### 3.1 优化打包速度

#### babel-loader 优化

​ babel-loader 是用来打包有 ES6 语法的 js 模块，将 ES6 转为 ES5 后再打包。 可以通过 `开启缓存` 和 `选择性打包`的方式优化 babel-loader。开启缓存：一旦 js 模块修改，没有修改的部分不会再次构建打包。选择性打包：一些文件不需要经过 bable-loader 转化后打包。

​ 在 webpack.config.js 中配置优化 babel-loader：

```javascript
// webpack配置文件
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader?cacheDirectory'], // 开启缓存
        include: srcPath, // 选择性打包
        // exclude: /node_modules/
      },
    ],
  },
};
```

#### IgnorePlugin & noParse

**IgnorePlugin**

​ 有些第三方库会有很多个语言的版本，比如日期处理类库 `moment.js`。如果直接引入该模块，会使得打包产生文件过大。使用 webpack 自带的 `IgnorePlugin`插件可以忽略引入语言文件：

在 webpack.config.js 中配置打包时忽略 moment 的语言包：

```javascript
// webpack配置文件
let webpack = requir('webpack');
module.exports = {
  plugins: [
    // 忽略 moment 下的 /locale 目录
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
  ],
};
```

​ 由于忽略了 moment 的语言包，所以需要在引用 moment 的文件中设置语言：

```javascript
// 入口文件：index.js
import moment from 'moment';
import 'moment/locale/zh-cn'; // 手动引入中文语言包
moment.locale('zh-cn'); // 设置moment语言为中文

console.log(moment().format('ll')); // 输出时间测试
```

**noParse**

​ 有些第三方库本身就是模块化的文件，不需要对其进行依赖关系解析，直接引入即可。后缀为 `xxx.min.js`的文件是模块化文件：比如 `react.min.js`。

​ 在 webpack.config.js 中配置 `noParse`：

```javascript
// webpack配置文件
module.exports = {
  // 忽略对 `react.min.js` 文件的递归解析处理
  noParse: [/react\.min\.js$/],
};
```

> IngorePlugin 和 noParse 的不同：
> ​ IngorePlugin 匹配到的文件直接不进行引入，即打包的文件代码中没有这些代码；noParse 匹配到的文件不进行解析，直接将这些代码放入打包文件中。

#### happyPack

​ webpack 中需要用 loader 对各种类型的模块进行解析。由于 JS 引擎是单线程的，webpack 只能在一个线程中给 loader 分配解析任务。`happyPack` 做到了 loader 解析委托。当 webpack 碰到需要解析的模块后，webpack 将解析任务交给 happyPack，happyPack 进行进程调度分配一个进程资源给 loader 进行解析，loader 解析完成后将资源交给 happyPack，最后 happyPack 将处理结果返回给 webpack。

​ 在 webpack.config.js 中对解析 js 模块的 loader 配置 happyPack ：

```javascript
// webpack配置文件
const HappyPack = require('happypack');
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        include: srePath,
      },
    ],
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件类型
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
    }),
  ],
};
```

#### ParalleUglifyPlugin

​ 在基本配置中有一个压缩 js 文件的插件 `uglifyjs-webpack-plugin`，不过它是采用 JS 引擎单线程进行压缩。`webpack-parallel-uglify-plugin` 实现了多进程对 JS 模块进行压缩。

​ 在 webpack.config.js 中配置 ParalleUglifyPlugin：

```javascript
// webpack配置文件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false, // 代码丑化，输出最紧凑
          comments: false, // 删除所有注释
        },
        compress: {
          // 编译优化
          drop_console: true, // 删除所有 `console`语句，兼容IE
          collaspe_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true, // 提取出多次出现但是没有定义成变量被引用的静态值
        },
      },
    }),
  ],
};
```

#### DllPlugin

​ DLL (Dynamic Link Library) 动态链接库是 windows 操作系统常用的技术，放在 webpack 中是为了提高构建速度。在开发环境下，一些前端框架 Vue，React 体积较大，每次运行 `npm run dev` 都得打包一次框架。通过将引用的框架模块配置成动态链接库，在一次打包过后，直接引入动态链接库即可。

​ 在 webpack.dll.js 中用 `DllPlugin` 将 React 打包成动态链接库：

```javascript
// webpack配置文件
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');
const { disPath } = require('/paths');

module.exports = {
  mode: 'development',
  entry: {
    // 把 React 相关模块放到一个单独的动态链接库
    react: ['react', 'react-dom'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name]代表当前动态链接库的名称，也就是 entry 中配置的 react
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: disPath,
    // 存放动态链接库的全局变量名称，例如 react 对应_ dll_react，之所以在前面加上 _dll_是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 动态链接库的全局变量名称，需要和 output.library 中保持一致
    // 该字段设置的是输出的 manifest.json 文件中 name 字段的值。例如： react.mainfest.json 中就有 "name": "_dll_react" 字段
    new DllPlugin({
      name: '_dll_[name]',
      // 描述动态链接库 manifest.json 文件输出时的文件名称
      path: path.join(disPath, '[name].manifest.json'),
    }),
  ],
};
```

webpack 配置好后，需要在 package.json 中设置启动 webpack.dll.js 配置打包的命令：

```javascript
// package.json
{
    "scripts":{
        "dev":"webpack --config build/webpack.dev.js"
        "dll":"webpack --config build/webpack.dll.js"
    }
}
```

运行以下命令生成动态链接库：

```bash
npm run dll
```

生成结果如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621210216425_KRMxqq-usZ.png"/> </div>

打包出 dll 文件后，用 `DllReferencePlugin` 插件引用 dll 文件。在 webpack.dev.js (只用于开发环境) 中配置引用 dll 文件：

```javascript
// webpack.dev.js
const path = require('path');
const { disPath } = require('/paths');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = {
  mode: 'development',
  plugins: [
    // 告诉 webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require(path.join(disPath, 'react.manifest.json')),
    }),
  ],
};
```

在 index.html 中引用动态链接库：

```html
<html>
  <head> </head>

  <body>
    <div id="root"></div>
    <script src="./react.dll.js"></script>
  </body>
</html>
```

#### 热更新

​ 在开发环境下，每次修改代码， `web-dev-server` 都会自动刷新页面。普通的自动刷新会刷新整个页面，同时全局环境中保留的状态也会丢失。热更新实现了在新代码生效的同时，网页不会刷新，全局环境中的状态也不会丢失。

​ 在 webpack.dev.js (只用于开发环境) 中配置热更新：

```javascript
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  // 1. 入口配置热更新
  entry: {
    index: [
      'webpack-dev-serve/client?http://localhost:8080/',
      'webpack/hot/dev-server',
      path.resolve(__dirname, '/src/index.js'),
    ],
  },
  // 2. 配置热更新插件
  plguins: [new HotModuleReplacementPlugin()],
  // 3. 启用热更新
  devServer: {
    port: 8080,
    hot: true,
  },
};
```

​ 热更新只在 html，css 修改时生效，如果想让 js 代码实现热更新，还需要额外的配置：

```javascript
// 入口文件：index.js
import { sum } from './math';

// 增加，热更新被执行的回调函数
if (module.hot) {
  // 确定代码开启热更新后，配置启动热更新的模块，一旦这些模块被改变，则执行回调函数
  module.hot.accept(['./math'], () => {
    const sumRes = sum(10, 30);
    console.loh('监听到math文件被修改，热更新已启动');
  });
}
```

### 3.2 优化产出代码

​ 产出代码即 webpack 打包后生成的打包文件，这些文件通常放在项目 dist 文件夹目录下，将 dist 文件夹放置在服务器上，即可给用户线上访问。 优化产出代码可以提高用户访问速度，通常解决网站首次加载过慢问题。常见的方式有以下几种：

- `缩小打包文件体积`：小图片采用 base64 编码，提取公共代码或第三方模块，打包文件压缩，IngorePlugin 减少第三方库语言版本
- `缩短请求资源时延`：bundle 加 hash 提高缓存命中，懒加载，使用 CDN 加速

#### production

​ `production` 是 webpack 的一种打包模式，在 webpack.prod.js（只用于生产环境）中配置 webpack 启用该模式进行打包：

```javascript
// webpack.prod.js
module.exports = {
  mode: 'production',
};
```

使用该模式有以下好处：

- 自动开启代码压缩
- Vue，React 等会自动删掉调试代码（如开发环境的 warning）
- 启动 Tree-Shaking

> 📌Tree-Shaking 字面意思就是用力摇动一棵树，将联系不紧的叶子从树上甩掉。它在 webapack 中的作用是忽略引用模块中没有被调用的代码，从而减少打包文件的体积。**但是，只有采用 ES6 Module 写法的代码才能让 tree-shaking 生效。**
> 因为 ES6 Module 引入模块的方式是静态引入，而 Commonjs 是动态引入，webpack 实际上就是对项目代码进行静态分析后再打包，所以 tree-shaking 只对 ES6 Module 生效。静态引入：在代码为执行前，入口文件就能确定引用的模块；动态引入：只有在代码执行过程中，入口文件才能确定引用了哪些模块。

#### Scope Hosting

​ `Scope Hosting` 用于函数作用域合并，一个模块打包后是一个函数，合并作用域即意味者合并函数。如：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621220610999_hYJ7uYMtEg.png"/> </div>

​ 入口文件 main.js 引用了 hello.js 中的代码，如果不采用 scope hosting 的话，打包文件会生成两个函数：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621220742148_6hgC5Md0wC.png"/> </div>

​ 这样会使得代码过于冗余，同时每执行一个函数会开辟一个活动对象，函数过多可能会导致调用栈溢出。所以采用 Scope Hosting 对打包文件进行合并：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220621220934184_yelvOolv0r.png"/> </div>

​ 这样使得打包文件的代码体积更小，创建活动对象更少，代码可读性更好。

在 webpack.prod.js 中配置 Scope Hosting：

```javascript
// webpack.prod.js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  resolve: {
    // 由于Scope Hosting 只对 ES6 Module 有效，配置 npm 下载的第三方模块有限下载 ES6 Module版本
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  plugins: [
    // 开启 Scope Hosting
    new ModuleConcatenationPlugin(),
  ],
};
```

## 4.babel

​ babel 是 js 的一个转译器，用于将高版本的 JS 代码（ES6 以上）转为 ES5 代码，以提高代码的兼容性。

> 高级语言到低级语言叫编译，高级语言到高级语言叫转译

### 4.1 环境搭建 & 基本配置

​ 使用 babel 需要安装以下几个插件，在 package.json 中配置：

```javascript
// package.json
{
    "devDependencies": {
        "@babel/cli": "^7.7.5",
        "@babel/core": "^7.7.5",
        "@babel/preset-env": "^7.7.5",
        "@babel/plugin-transform-runtime": "^7.7.5",
    },
    "dependencies": {
        "@babel/polyfill": "^7.7.0",
        "@babel/runtime": "^7.7.5"
    }
}
```

然后运行 `npm install` 下载即可。babel 通过 `.babelrc` 文件进行配置：

```javascript
// .babelrc
{
    "presets":[
      [
          "@babel/preset-env"
      ]
    ],
    "plugins":[

    ]
}
```

- `plugins`：插件，babel 的主要转化工具，每一种高版本 JS 语法都通过一种插件进行转化。
- `presets`：预设，插件的组合，将一些常用的插件进行组合打包后形成预设，如 `@babel/preset-env` 就是用于 ES6 向 ES5 转换的预设。特殊功能在 plugins 中引用补充。

### 4.2 基本原理&#x20;

&#x20; babel 只是一个转译器，区别于编译器。转译器是将同种语言的高版本规则翻译成低版本规则，而编译器是将一种高级语言代码翻译成另一种更低级的语言代码。

&#x20; babel 的转译过程分为三个阶段：

- `parsing`：通过 babylon，将高版本规则代码转化为一颗抽象语法树 AST；
- `transforming`：通过 babel-traverse，在高版本规则的抽象语法树上进行修改，生成低版本规则的抽象语法树；
- `generating`：通过 babel-gengrator，将低版本规则的 AST 生成兼容性代码。

### 4.3 babel-polyfill

​ polyfill 为 `补丁` 之意，polyfill 在前端的意思是对某个 api 进行打补丁，使得该 api 兼容各种类型的浏览器。一个新 api 对应一个 polyfill，babel-polyfill 实际上是各种 polyfill 的集合，其由 core-js 和 regenerator 组成：

- `core-js`：集合了 ES5+ 以上所有新 api 的 polyfill，使得 ES 语法在各种浏览器兼容
- `regenerator`：提供了 Generator 的 polyfill

​ babel 只是实现了语法转换，将不符合 ES5 语法规范的代码转为 ES5 的写法，但是其并不能解析 ES6+ 提供的 API。比如：

```javascript
// 引入core-js进行解析
import ‘@babel/polyfill’
// 新的API
Promise.resolve(100).then (data=>data);
[10,20,30].includes(20);
```

以上 ES6 两个 API 写法上都符合 ES5 规范，但是需要引入 core-js 对其进行 polyfill，以实现其兼容性。core-js 是一个 polyfill 库，如果引入所有的 polyfill 会使得打包后文件臃肿，所以必须配置按需引入。

在 .babelrc 中配置 `core-js`：

```javascript
// .babelrc
{
    "presets": [
        "@babel/preset-env",
        {
            "useBuiltIns": "usage",
            "corejs": 3 // core-js采用3.0版本
        }
    ],
    "plugins": [
    ]
}
```

### 4.4 babel-runtime

​ babel-polyfill 实际上是直接在原型上面修改方法，比如 includes 方法的 polyfill 实现方式为 `Array.prototype.includes = function(){ 兼容性代码... }`，这种实现方式会污染全局环境。所以推出了 `babel-runtime`, 它实现了 polyfill 的同时避免污染全局环境。

​ 在 .barbelrc 中配置 `babel-runtime`：

```javascript
{
    "presers": ["@babel/preset-env"],
    "plugins": [
        [
            "babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": 3,
                "helpers": true,
                "regenerator": true,
                "useESModules": false,
            }
        ]
    ]
}
```

注意 `@babel/preset-env` 和 `plugin-transform-runtime` 二者都可以设置 core-js 使用 polyfill，但是两者不能同时配置 core-js，以免产生复杂的不良后果。
