# Dify 工作流解析

## 1. 前言（why，what）

什么是工作流？什么是 AI 工作流？什么是 Dify，解决什么问题？ 

- 工作流定义：将工作流程分解为 **可执行的结构化步骤**， 每个步骤都是对业务规则的抽象、概括描述。
- 工作流目标：利用计算机在多个操作步骤间按某种预定规则 **自动传递信息**、文档或者任务，实现某个业务目标。
- AI 工作流：Agentic Workflow 是将 Agent 能力（推理规划 Planning、工具调用 Function Calling、反思总结 Reflection）融合入传统工作流的智能工作流。
  - 对比传统工作流：引入 Agent 的自我分析、决策、学习能力，打破了其确定性，增强其灵活性、适应性，以便处理更复杂任务（会议总结、智能客服等）。
  - 对比 AI Agent：引入工作流的编排能力，减少 AI Agent 的不确定性，扩展 AI Agent 的能力边界（A2A 编排等）。

**Dify** 只是搭建 AI 工作流的平台之一，它在这些基础理念上通过自己的产品定义让用户搭建 AI 工作流，解决企业问题。

参考：
- [一文看懂：AI 圈刷屏的 Agentic Workflows 到底是个啥？](https://developer.volcengine.com/articles/7517866342792314943#heading23)
- [Dify 产品手册](https://docs.dify.ai/zh/use-dify/getting-started/introduction)

## 2. 源码解读（how）

在进入枯燥的源代码解读前，首先看下 Dify Workflow 前端原作者对外的分享:
- 视频：[超越界面：前端工程师如何塑造 AI 原生应用的未来 - 吴天炜](https://fedev.cn/video/play/701606bc91638d618ac990493a4972c8)
- PDF：[超越界面：前端工程师如何塑造 AI 原生应用的未来](https://github.com/fequancom/FEDAY/blob/main/2025/feday2025-%E8%B6%85%E8%B6%8A%E7%95%8C%E9%9D%A2%EF%BC%9A%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E5%A6%82%E4%BD%95%E5%A1%91%E9%80%A0%20AI%20%E5%8E%9F%E7%94%9F%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%AA%E6%9D%A5.pdf)

下图是作者对 Dify Workflow 前端的总结：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260103162030.png"/> </div>

### 前端架构

为了循序渐进解读 Dify 工作流的前端逻辑，笔者按个人理解将业务代码分为以下 6 层：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260103165459.png"/> </div>


- 路由层：解释用户请求如何获取入口文件，并在浏览器渲染出整个 workflow 页面；
- 绘制层：解释如何实现 workflow 的 Canvas 层，允许用户拖拽编排 workflow 并同步至后端；
- 执行层：解释用户在界面点击运行 workflow 后，前端做了哪些工作展示其运行流程；
- 变量系统：解释 workflow 如何在节点间进行信息传递；
- 状态管理：解释 workflow 前端整个 stores 的管理逻辑；
- 应用层：解释 workflow 如何实现基础能力（编排、运行）之外的补充能力（调试、版本控制等）

### 2.1 路由层

### 2.2 绘制层

### 2.3 执行层

### 2.4 变量系统

### 2.5 状态管理

### 2.6 应用层