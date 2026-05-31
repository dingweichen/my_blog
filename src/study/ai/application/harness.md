# Harness 从理解到应用

## 1. 前言（why，what）

[工程技术：在智能体优先的世界中利用 Codex](https://openai.com/zh-Hans-CN/index/harness-engineering/) OpenAI 在2026年2月11日发布的文章中，通过实践证明模型在工程实践中 “不是llm模型能力不够强大，而是缺少正确的约束与引导”，正式宣布AI工程范式的第三次跃迁：1. Prompt Engineering ->2. Context Engineering -> 3. Harness Engineering。

Harness Engineering 的简单概念可参考 [Harness Engineering（驾驭工程）](https://www.runoob.com/ai-agent/harness-engineering.html)。本质上是通过对智能体构建约束机制、反馈回路、持续改进循环机制来实现一套控制系统的方法论，目的是引导智能体按预期可靠运行。

> harness engineering is the idea that anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent will not make that mistake again in the future. —— Mitchell Hashimoto

## 2. 应用（how）

掌握 harness 基本概念后，通过课程 [learn-harness-engineering](https://walkinglabs.github.io/learn-harness-engineering/zh/lectures/lecture-01-why-capable-agents-still-fail/) 掌握如何将harness 应用于实际项目中。

### 2.1 Project 01.Harness 最小可用原则

完成 [Project 01. 只写提示词让 agent 做，和定好规则再让它做，差多少](https://walkinglabs.github.io/learn-harness-engineering/zh/projects/project-01-baseline-vs-minimal-harness/) ，做一组AB实验，认识同一个项目在具备 harness 和不具备 harness 条件下的表现差异。查看实验结果前，笔者先介绍 harness 最小可用原则是如何构建的？

参考文档 [推荐最小组合](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/#%E6%8E%A8%E8%8D%90%E6%9C%80%E5%B0%8F%E7%BB%84%E5%90%88)，实现一套 harness 约束最少应具备四个文件：

- `AGENTS.md`: 根指令文件。agent 每次开工会先读这个文件。它定义了工作规则：写代码前要做什么、工作过程中怎么守规矩、收尾时要检查什么。
- `claude-progress.md`: 过程执行日志。agent 每轮会话往里写，每轮新会话先读它。
- `feature_list.json`: 项目功能模块清单。agent 可读的功能列表，每个功能有状态、验证步骤和证据。
- `init.sh`: 最终启动脚本。一条命令完成依赖安装、验证和打印启动命令。

参考 [模板](#harness-templates)，我们生成最终的 [harness配置](https://github.com/dingweichen/harness-experiment/tree/main/projects/project-01/solution)。

接下来我们对比具备 harness 与不具备 harness 的 agent 表现差异，如下表格所叙述：

<CommonTable :headers="['比较项\\实验组', 'harness', 'no-harness']">

  <CommonRow label="Prompt">
    <CommonCell
    :code="'帮我完成以下任务：\n用 Electron 做一个知识库应用，窗口左边是文档列表区域，右边是问答面板区域，应用需要创建并使用本地数据目录\n要求：\n1. 思考过程用中文输出\n2.读取 AGENTS.md，其中写明了项目结构、启动命令、Electron 层边界规则\n3. feature_list.json：验收列表，其中列出四个功能点及其完成状态\n4. init.sh：其中写明了脚本运行命令，一键恢复可运行状态（npm install && npm start）'"
     lang="text"
     >
    </CommonCell>
    <CommonCell
     :code="'帮我完成以下任务：\n 用 Electron 做一个知识库应用，窗口左边是文档列表区域，右边是问答面板区域，应用需要创建并使用本地数据目录\n要求：\n1. 思考过程用中文输出'"
     lang="text"
    >
    </CommonCell>
  </CommonRow>

  <CommonRow label="对话日志">
    <CommonCell>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531212143.png"/> </div>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531212315.png"/> </div>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531212546.png"/> </div>
        省略agent中间的自查纠正过程...
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531212707.png"/> </div>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531212835.png"/> </div>
    </CommonCell>
    <CommonCell>
        <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531202609.png" />
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531211533.png"/> </div>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531211618.png"/> </div>
    </CommonCell>
  </CommonRow>

   <CommonRow label="最终diff">
    <CommonCell>
        <a href="https://github.com/dingweichen/harness-experiment/tree/p01-harness/projects/project-01/solution">harness 生成</a>
    </CommonCell>
    <CommonCell>
        <a href="https://github.com/dingweichen/harness-experiment/tree/p01-no-harness/projects/project-01/starter">no-harness 生成</a>
    </CommonCell>
  </CommonRow>

  <CommonRow label="最终效果">
    <CommonCell>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531213515.png"/> </div>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531213533.png"/> </div>
    </CommonCell>
    <CommonCell>
        <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20260531213714.png"/> </div>
    </CommonCell>
  </CommonRow>

</CommonTable>

#### 附录

- [个人实验记录](https://github.com/dingweichen/harness-experiment)
  <a id="harness-templates"></a>
- [harness 应用模版](https://github.com/walkinglabs/learn-harness-engineering/tree/main/docs/zh/resources/templates)
- [harness 应用模版使用指南](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/templates/)
