# 包管理工具

## 1. 前言（why，what）

项目往往由多个软件包构成，如果没有软件包管理工具，每位开发者不得不手动完成以下工作：

1. 记录项目中依赖的所有软件包；
2. 手动下载、安装、更新、删除所有软件包；
3. 跟踪软件包的安全问题、最新更新版本；

包管理工具通过在项目中配置文件，协助开发者自动完成上述工作。下面介绍前端项目中常用的两种包管理工具：**NPM**（Node Package Manager） 和 **YARN**（Yet Another Resource Negotiator）。

## 2. NPM & YARN（how）

两者都是前端工程化项目中常见的包管理工具，不存在好坏之分，根据个人偏好选用即可，主要介绍它们如何进行包管理：

1. 通过项目中生成 `package.json`文件，记录项目中依赖的所有软件包；
2. 通过包管理工具 `npm` 或 `yarn` 一键下载、安装、更新、删除软件包。
3. 通过 `node_modules` 文件夹，存储项目中依赖的所有软件包。

### 2.1 package.json

package.json 是包管理工具的图谱，在项目根目录下通过：

```bash
npm init (yarn init)
```

命令生成，它有以下字段及含义：

#### 2.1.1 常见字段

| 字段名      | 字段解释                               |
| ----------- | -------------------------------------- |
| name        | 包名称，由小写字母、连字符或下划线组成 |
| main        | 包入口文件                             |
| script      | 自定义脚本指令                         |
| description | 包简要描述信息                         |
| private     | 是否私有包，私有包不会发布到 npm 仓库  |
| keywords    | 包关键词，有助于通过 npm search 包搜索 |
| author      | 包作者相关信息                         |
| repository  | 包源代码地址                           |

字段举例如下：

```json
{
  "name": "my-package",
  "main": "./dist/index.js",
  "scripts": {
    "test": "jest",
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "description": "dingweichen's blog",
  "private": false,
  "keywords": ["learning", "blog"],
  "author": "dingweichen",
  "repository": "https://github.com/dingweichen/my_blog"
}
```

#### 2.1.2 version

| 字段名  | 字段解释                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| version | 包版本号，必须是 "major.minor.patch" 格式，遵循 [semantic versioning spec](https://docs.npmjs.com/about-semantic-versioning) 规范 |

字段举例如下：

```json
{
  "version": "1.0.0"
}
```

注意更新版本号的规则：
| 代码状态 | 阶段 | 规则 | 示例版本 |
|---------------------------|--------------------|----------------------------------------|-----------|
| 首次发布 | 新产品 | 从 1.0.0 开始 | 1.0.0 |
| 向后兼容的 bugfix | 补丁发布 | 增加补丁版本号 | 1.0.1 |
| 向后兼容的新功能 | 次要发布 | 增加次级版本号并将补丁版本号重置为零 | 1.1.0 |
| 新特性发布并不做兼容 | 主要发布 | 增加主版本号并次级版本号、补丁版本号重置为零 | 2.0.0 |

注意 package.json 中生效版本号的规则如下（都会取范围内的最新版本）：

- `^`: 主版本不允许发生改变，比如 `^1.2.3` 允许更新的版本范围是 >=1.2.3 且 <2.0.0
- `~`: 主版本、次版本不允许发生改变，比如 `~1.2.3` 允许更新的版本范围是 >=1.2.3 且 <1.3.0

因为根据 package.json 下载依赖包的范围有波动，在用户执行 `npm install (yarn install)`是项目根目录会自动生成 `package-lock.json (yarn.lock)` 文件锁定下载依赖包的版本，运行如下命令可更新 lock 文件：

```bash
npm update (yarn update)
```

::: tip
**1. package-lock.json 和 yarn.lock 的区别？**

- `package-lock.json`: json 格式，准确描述了依赖包之间的层级关系，通过其可直接解析出依赖资源树；
- `yarn.lock`: 所有依赖包平铺描述，无法明确主依赖包，必须结合 package.json 文件才能解析出依赖资源树。
  :::

#### 2.1.3 dependencies & devDependencies & peerDependencies

| 字段名           | 字段解释                                                                                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dependencies     | 项目运行所必须的依赖包，会打包到生产环境                                                                                                                                                                                                    |
| devDependencies  | 项目在开发、测试阶段补充的依赖包，不会打包到生产环境                                                                                                                                                                                        |
| peerDependencies | **对等依赖**，一般在依赖包中生声明。声明当前包 A 依赖某些其他包 B、D 作为基础能力构建，但这些其他依赖包 B、D 不会在 A 中被自动安装，而是由使用依赖包 A 的宿主提供。[一文搞懂 peerDependencies](https://segmentfault.com/a/1190000022435060) |

- `npm install package_name@^a.b.c（yarn add package_name@version）`: 通过`@`安装指定版本范围的包
- `npm install package_name（yarn add package_name）`: 更新项目 dependencies
- `npm install package_name --save-dev（yarn add package_name --dev）`: 更新项目 devDependencies
- `npm install package_name -g（yarn global add <package-name>）`: 全局安装包（脱离项目安装至主机）

::: tip
<small>

1. 对于 peerDependencies 不会自动安装的特性，思考出了一个如下问题：
   <strong>在项目中，如果 plugin1 和 plugin2 都通过 peerDependencies 声明依赖 packageA>=1.0.0，而项目 demo 的 dependencies 或 devDependencies 中未显式声明 packageA，那么 packageA 是否会被自动安装？</strong>

DeepSeek 给出的答案如下, 取决于包管理工具及其版本：

| 包管理工具  | 行为                                                |
| ----------- | --------------------------------------------------- |
| **npm 7+**  | 自动安装 `peerDependencies`（若无冲突），否则报错。 |
| **npm 6-**  | 不自动安装，仅警告。需手动添加 `packageA`。         |
| **Yarn 1**  | 不自动安装，仅警告。需手动添加 `packageA`。         |
| **Yarn 2+** | 默认不自动安装，需手动添加或通过配置启用。          |

</small>

:::

### 2.2 本地联调包

试想这样一个场景：开发包 Package A 需要在工程项目 Project B 中引用，则不可能每次开发完一个功能都要讲包发布到 npm 仓库，然后 Project B 再通过 npm 安装，这样效率太低。

#### 2.2.1 构造软链接

下面介绍通过构造 `软链接` 的方式，实现在 B 项目中本地联调 A：

1. 在包 A 根目录中执行 `yarn link` 命令，将包 A 链接到全局 node_modules 目录下，包标识为 package.json 文件中的 name 字段，设为`package_a`；
2. 在项目 B 根目录下执行 `yarn link package_a` 命令，将包 A 链接到项目 B 的 node_modules 目录下；
3. 在项目 B 中执行 `yarn install` 命令，更新项目 B 依赖。

即可在项目 B 中本地调试包 A。

::: tip
<small>

**1. 验证软链配置是否生效：**

- 在项目 B 根目录下，执行 `ls -l node_modules/package_a` 命令，查看 项目 B node_modules 目录下引用包 A 的路径；
- 执行 `yarn global dir` 查看 yarn 管理工具在全局的路径，并查看全局 yarn/link 文件夹下 package_a 的路径与上一步是否一致；

**2. 在软件配置生效的前提下，项目 B 依然构建后依然没有包 A 在本地更新的代码，可能是项目 B 包构建工具的缓存：**

- 执行如下命令清除项目 B 构建工具的缓存：

```bash
 yarn webpack --clear-cache
 yarn vite --force
```

</small>
:::

#### 2.2.2 清除软链接

1. 在项目 B 根目录下执行 `yarn unlink package_a` 命令，删除项目 B 中对包 A 的软链接；
2. 在项目 B 根目录下执行 `yarn install --force` 命令，更新项目 B 依赖；
3. 在包 A 根目录下执行 `yarn unlink` 命令，清除 package_a 的软链接。

### 2.3 发布包

[Npm Registry](https://www.npmjs.com/products) 是全球开源的 Node 包仓库，可以用来发布个人主机中如何有 package.json 文件的项目。在此发包的流程如下：

1. 远端登陆/注册：在[Npm Registry](https://www.npmjs.com/products)上注册用户；
2. 本地登陆：本地执行 `npm login` 命令登陆 npm 账户；
3. 发布包： 项目根目录执行 `npm publish` 命令发包。

::: tip

**1. 如何将包发向指定的 registry:**

- 通过 `npm config get registry` 命令查看当前的 registry，通过 `config set registry https://registry.npmjs.org` 包设置当前的 registry（全局生效）;
- 通过 `npm login --registry=https://registry.npmjs.org` 命令登陆指定 registry;
- 通过 `npm publish --registry=https://registry.npmjs.org` 命令将包发向指定 registry;

注意：项目根目录下 `.npmrc` 也能配置 npm registry 信息，其优先级别大于全局配置。

**2. npm 命令配置参数的优先级:**

- （1）命令行参数（如 --registry=xxx）**>>** （2）环境变量（如 NPM_CONFIG_REGISTRY）**>>** （3）项目级 `.npmrc`（项目根目录下的 .npmrc 文件）**>>** （4）用户级 `.npmrc`（全局配置，位于 ~/.npmrc）**>>**（5） npm 的默认配置（如 registry=https://registry.npmjs.org/）

:::

## 3. PNPM

根据 `package.json` 生成项目的<OrangeText>依赖解析树</OrangeText>是包管理工具的核心问题，在生成的依赖解析树过程中可能会面临以下问题：

- `嵌套地狱`：项目多个的依赖包引用了同一个公共包 A 的多个相同版本，包 A 被安装多次，导致生成 nodule_module 文件臃肿；
- `分身依赖`：将公共包 A 使用频率最高的版本提取到 nodule_module 下，即将依赖扁平化能缓解 嵌套地域 问题，但是因为公共包 A 只能提取一个版本，项目中公共包 A 的其他版本无法提取，只能重复安装，这就是分身依赖问题；
- `幽灵依赖`：将公共包 A 使用频率最高的版本提取到 nodule_module 下，但是 package.json 文件并没有显示声明公共包 A，它却能被项目代码 import，如果其他包不再依赖 A，那么项目代码将执行异常，这就是幽灵依赖问题；

| 问题          | 现状                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **嵌套地狱+** | npm3、yarn 通过提取公共依赖，将依赖扁平化的方法 **解决**（提取公共依赖的算不一样），pnpm 通过包 store、硬/软链接方式 **解决**； |
| **分身依赖**  | npm、yarn **未解决** ，pnpm pnpm 通过包 store、硬/软链接方式 **解决**；                                                         |
| **幽灵依赖**  | npm、yarn **未解决** ，pnpm pnpm 通过包 store、硬/软链接方式 **解决**；                                                         |

**PNPM** (Performant NPM) 是原作者对 NPM 的升级，通过将 node_module 文件存储在 store 中，并且在 `nodule_module/.pnpm` 文件下生成硬链接，包之前生成软链接的方式实现依赖扁平化，解决了以上 3 个问题。

::: tip
**1. 硬链接、软链接分别是什么？**

读完 [通过实践搞懂 linux 中“软链接”和“硬链接”的区别](https://zhuanlan.zhihu.com/p/516862375)后的个人理解：

- `硬链接`：直接指向磁盘文件的指针，存储了区块文件的地址；通过修改硬链接，能直接修改原区块文件的内容；
- `软链接`：指向硬链接的指针；通过修改软链接，只会改变其绑定硬链接指向的区块文件，不能修改原区块文件的内容。
  :::

* [JavaScript 包管理器——NPM 和 Yarn 完整指南](https://www.freecodecamp.org/chinese/news/javascript-package-manager-npm-and-yarn/)
* [聊聊依赖管理](https://juejin.cn/post/7207702606646329399)
* [通过实践搞懂 linux 中“软链接”和“硬链接”的区别](https://zhuanlan.zhihu.com/p/516862375)
