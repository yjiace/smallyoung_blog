---
title: 让 AI 成为你的专家助手：Claude Skills 完全指南
category: 人工智能
tags: [AI, Claude, Skills, MCP, Anthropic, 智能体]
description: 深入解析 Anthropic Claude Skills 技术原理,了解如何通过可复用的技能包让 Claude 成为你的专业助手。涵盖 Skills 与 MCP 协议的关系、渐进式加载机制、技能编排等核心技术。
author: smallyoung
date: 2025-12-21
dateModified: 2025-12-21
keywords: [Claude Skills, Anthropic, MCP, Model Context Protocol, AI技能, 智能体, 工作流自动化, Progressive Disclosure]
cover: //pub.smallyoung.cn/cdn-cgi/image/quality=60/course_slidev/skills/1.png
---

# Claude Skills 完全指南 | Anthropic AI 技能系统教程

> **Claude Skills**(也称 **Agent Skills**)是由 Anthropic 于 2024 年 10 月 16 日推出的可复用任务能力包系统,它让 Claude 能够掌握特定领域的专业知识和工作流程,就像给 AI 安装"技能插件"一样,使其成为你的专业助手。

> 📌 **Agent Skills 开放规范**: https://agentskills.io  
> 📌 **官方发布公告**: https://www.anthropic.com/news/skills  
> 📌 **工程博客**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills  
> 📌 **GitHub 示例**: https://github.com/anthropics/skills  
> 📌 **支持计划**: Claude Pro, Max, Team, Enterprise (需订阅)

> 💡 **重要更新**: 2025 年 12 月 18 日,Anthropic 将 Agent Skills 发布为跨平台开放标准,使其可在不同的 AI 产品中使用。

## 关于本文档

本文档是 **Claude Skills 的中文入门指南**,适合零基础初学者,覆盖以下核心知识:

- ✅ Claude Skills 的基本概念与设计理念
- ✅ Skills 与 MCP 协议的关系
- ✅ 渐进式加载(Progressive Disclosure)机制
- ✅ 如何创建和使用自定义 Skill
- ✅ Skills 编排与组合
- ✅ 实际应用场景和最佳实践

**适合人群**: AI 应用开发者、企业工作流自动化人员、Claude 用户、对 LLM 应用感兴趣的技术人员。

**关键词**: Claude Skills、Anthropic、MCP、Model Context Protocol、AI 技能、智能体、工作流自动化、Progressive Disclosure

![让 AI 成为你的专家助手：Claude Skills 完全指南](//pub.smallyoung.cn/course_slidev/skills/0.png)

> 🎧 **更喜欢听？试试本文的音频版本**
<AudioPlayer 
  src="//pub.smallyoung.cn/course_slidev/skills/Claude_Skills：AI如何从助手进化成专家团队.m4a"
  author="SmallYoung"
/>

<VideoPlayer 
  src="//pub.smallyoung.cn/course_slidev/skills/从助手到专家：Claude_Skills_完全指南.mp4"
/>

<MindMapFloat title="让 AI 成为你的专家助手：Claude Skills 完全指南">

```mindmap-data
# Claude Skills 完全指南
## 基本概念
- 定义: 可复用任务能力包系统
- 核心文件: SKILL.md
- 设计理念: Progressive Disclosure (渐进式加载)
## 核心特性
- 智能加载: 初始仅加载元数据，按需加载全文
- 程序化知识: 提供详细执行步骤与最佳实践
- 技能编排: 自动选择、组合多个技能完成复杂任务
- Token 高效: 动态占用上下文空间
## 与 MCP 的关系
- MCP: 提供连接能力 (访问外部系统)
- Skills: 提供执行能力 (如何专业地使用系统)
- 协作: MCP 获取数据，Skills 处理流程
## 技能生命周期
- 创建: 编写 SKILL.md 和脚本
- 注册: 上传至 Claude UI 或 API
- 待命: 预加载名称和描述
- 激活: 根据用户需求调用工具
- 执行: 按照定义步骤操作
## 应用场景
- 企业知识管理: 文档转培训指南
- 代码审查助手: 标准化反馈格式
- 客户支持自动化: 分类、查找并生成回复
## 快速上手
- 订阅要求: Pro, Max, Team, Enterprise
- 操作步骤: 创建目录 -> 编写 SKILL.md -> 上传激活
- 使用方式: 网页界面、API、Claude Code
## 最佳实践
- 原则: 明确性、可测试性、模块化
- 调试: 检查元数据、简化测试、查看反馈
- 避免错误: 功能过宽、缺少示例、步骤模糊
```
</MindMapFloat>

## 协议概述

### 什么是 Claude Skills?

**Claude Skills** 是 Anthropic 推出的一种技能封装系统,解决了一个核心问题:

> **如何让 AI 助手快速掌握特定领域的专业知识,并能够一致、高效地执行重复性任务?**

#### 传统 AI 助手的局限

![传统 AI 助手的局限](//pub.smallyoung.cn/course_slidev/skills/2.png)

| 问题 | 描述 |
|------|------|
| 需要反复指导 | 每次对话都要重新解释工作流程和要求 |
| 缺乏专业性 | 通用模型对特定领域理解不够深入 |
| 执行不一致 | 同样的任务,不同对话中可能给出不同结果 |
| 效率低下 | 长篇提示词占用大量上下文空间 |

#### Claude Skills 的解决方案

Claude Skills 让你能够:

1. **封装专业知识** - 将领域专长编写成可复用的技能包
2. **标准化工作流** - 定义一次,重复使用,确保执行一致性
3. **组合编排** - 多个技能协同工作,完成复杂任务
4. **智能加载** - 只在需要时才加载完整技能内容,节省 Token

**核心优势**:
- 📦 技能可复用:一次创建,随时调用
- 🎯 执行一致性:标准化的工作流程
- 💡 Token 高效:智能的渐进式加载机制
- 🔧 易于管理:通过 Markdown 文件定义技能

![核心优势](//pub.smallyoung.cn/course_slidev/skills/3.png)

### Skills 是什么样的?

一个 Skill 本质上是一个包含以下内容的包:

```
my-skill/
├── SKILL.md          # 技能定义文件(必需,注意大写)
├── scripts/          # 可选:可执行脚本目录
│   └── process.py
├── references/       # 可选:参考文档目录
│   └── guide.md
└── assets/           # 可选:资源文件目录
    └── template.json
```

**核心文件 `SKILL.md` 的结构** (注意文件名必须大写):

```markdown
---
name: data-analysis     # 必需:小写字母+连字符,1-64字符
description: "从 CSV 数据中生成统计分析报告。当用户需要数据分析、统计报告或CSV处理时使用。"  # 必需:1-1024字符
license: Apache-2.0     # 可选:许可证
metadata:               # 可选:自定义元数据
  author: example-org
  version: "1.0"
---

# 工作流程

1. 读取用户提供的 CSV 文件
2. 分析数据分布和统计特征
3. 生成可视化报告
4. 提供优化建议

# 输出格式

- 使用 Markdown 表格展示统计数据
- 包含关键指标的解释
- 提供数据洞察和建议
```

## 核心概念

### 三大核心特性

| 核心特性 | 英文 | 详细说明 |
|---------|------|---------|
| **渐进式加载** | Progressive Disclosure | Skills 初始只加载元数据(~100 tokens),完整内容仅在需要时才加载,避免上下文窗口浪费 |
| **程序化知识** | Procedural Knowledge | 不同于 MCP 的"连接能力",Skills 提供"如何执行"的详细步骤和最佳实践 |
| **技能编排** | Skill Orchestration | Claude 能自动选择、组合多个 Skills 来完成复杂的多步骤任务 |

### Skills 的生命周期

```
创建阶段 → 注册阶段 → 待命阶段 → 激活阶段 → 执行阶段
   ↓          ↓          ↓          ↓          ↓
编写 MD    上传到     加载元数据   完整加载   按步骤
 文件      Claude    (~100 tokens)  内容      执行
```

**详细流程**:

1. **创建阶段**: 开发者编写 `SKILL.md` 文件和可选的支持文件,定义技能的用途、步骤和输出格式
2. **注册阶段**: 将 Skill 目录上传到 Claude(通过 UI 或 API)
3. **待命阶段**: Claude 启动时预加载所有 Skills 的 `name` 和 `description` 到系统提示词
4. **激活阶段**: 用户提问时,Claude 判断需要哪个 Skill,通过工具调用读取 SKILL.md 完整内容
5. **执行阶段**: Claude 按照 Skill 定义的步骤执行,按需读取引用文件或执行脚本

### 渐进式加载(Progressive Disclosure)

![渐进式加载](//pub.smallyoung.cn/course_slidev/skills/4.png)

这是 Agent Skills 最核心的设计理念,也是区别于传统提示词的关键。

**设计原理**:

就像一本结构良好的使用手册,Agent Skills 采用分层信息架构:

1. **第一层 - 目录页**: `name` 和 `description` (元数据)
2. **第二层 - 章节内容**: SKILL.md 的完整正文
3. **第三层及以上 - 详细附录**: 引用的其他文件(references/, scripts/ 等)

**工作机制**:

当 Agent(如 Claude)启动时:

```
1. 系统预加载所有已安装 Skills 的 name 和 description 到系统提示词
   → 消耗约 100 tokens/skill

2. Claude 根据用户任务判断是否需要某个 Skill
   → 如需要,通过工具调用(如 Bash)读取 SKILL.md 文件

3. SKILL.md 中如果引用了其他文件(如 references/forms.md)
   → Claude 按需再次调用工具读取引用文件

4. 对于 scripts/ 中的代码,Claude 可直接执行而无需加载到上下文
   → 既保证确定性执行,又不占用 Token
```

**关键优势**:

| 对比项 | 传统长提示词 | Agent Skills |
|--------|------------|--------------|
| Token 占用 | 每次对话都占用全部 Token | 按需加载,动态占用 |
| 信息规模 | 受上下文窗口限制 | 理论上无限制(通过多层引用) |
| 代码执行 | 需生成代码(Token 密集型) | 直接执行预写脚本(零 Token) |
| 更新维护 | 需在每个对话中复制粘贴 | 集中管理,自动应用 |

**实际效果示例**:

```
场景:拥有 20 个 Skills,每个 SKILL.md 平均 2000 tokens

传统方式(如全部作为系统提示):
20 × 2000 = 40,000 tokens(持续占用)

Agent Skills 方式:
- 启动时: 20 × 100 = 2,000 tokens(元数据)
- 任务执行: 2 × 2000 = 4,000 tokens(按需激活2个)
- 总计: 6,000 tokens
- 节省: 85%

若包含复杂脚本(传统方式需每次生成代码):
- Skills 方式: 0 additional tokens(直接执行)
- 节省可达 90%+
```

## Skills 与 MCP 的关系

![Skills 与 MCP 的关系](//pub.smallyoung.cn/course_slidev/skills/5.png)

Claude Skills 和 MCP(Model Context Protocol)是互补的技术,理解它们的区别和协作方式非常重要。

### 核心区别

| 对比维度 | MCP (Model Context Protocol) | Claude Skills |
|---------|------------------------------|---------------|
| **核心作用** | 提供"连接能力" | 提供"执行能力" |
| **解决问题** | Claude 如何访问外部系统 | Claude 如何专业地使用这些系统 |
| **技术类型** | 协议标准(类似 USB-C) | 知识封装(类似应用程序) |
| **定义方式** | Server-Client 架构 | Markdown 文件 |
| **举例说明** | 连接到 Notion 数据库 | 如何规范地从 Notion 生成会议纪要 |

### 协作示例

**场景**: 从 Notion 生成周报

```
[MCP Server: Notion]  →  提供数据访问能力
        ↓
[Claude Skills: 周报生成器]  →  定义周报格式和生成流程
        ↓
[最终输出]  →  符合公司规范的周报文档
```

**MCP 部分** (连接 Notion):

```python
# MCP Server 提供工具
@server.tool()
async def search_notion_pages(query: str, database_id: str):
    """搜索 Notion 页面"""
    # 实现 Notion API 调用
    return results
```

**Skills 部分** (定义周报生成流程):

```markdown
---
name: "周报生成器"
description: "从 Notion 任务数据库生成标准周报"
---

# 工作流程

1. 使用 search_notion_pages 获取本周完成的任务
2. 按照优先级分类任务
3. 生成以下格式的周报:
   - 本周完成事项 (按重要性排序)
   - 进行中事项
   - 下周计划
   - 遇到的问题和风险

# 输出格式

## 本周工作总结 (YYYY-MM-DD 至 YYYY-MM-DD)

### ✅ 已完成
- [高优先级] 任务名称 - 简要描述
- [中优先级] 任务名称 - 简要描述

### 🔄 进行中
- 任务名称 - 当前进度和预计完成时间

### 📅 下周计划
- 任务名称 - 目标和关键节点
```

**关键点**:
- MCP 让 Claude **能够** 访问 Notion
- Skills 教 Claude **如何** 使用这些数据生成专业的周报
- 一个 MCP Server 可以支持多个不同的 Skills
- 一个 Skill 也可以使用多个 MCP Servers

## Skill 的结构

![Skill 的结构](//pub.smallyoung.cn/course_slidev/skills/6.png)

### 完整的 SKILL.md 文件格式

根据 Agent Skills 开放规范,标准的 `SKILL.md` 文件格式如下:

```markdown
---
name: skill-name                    # 必需:1-64字符,仅小写字母和连字符
description: "简短描述这个技能的用途以及何时使用"  # 必需:1-1024字符
license: Apache-2.0                 # 可选:许可证信息
compatibility: "适用环境说明"       # 可选:兼容性要求
metadata:                           # 可选:自定义元数据
  author: "作者名称"
  version: "1.0.0"
allowed-tools: "Bash(*) Read Write" # 可选:预批准的工具列表
---

# 技能说明

这里详细描述这个技能是做什么的,适用于什么场景。

# 前置条件

- 需要的 MCP 连接(如有)
- 需要的权限
- 需要的数据格式

# 工作流程

## 步骤 1: 标题
详细描述第一步要做什么

## 步骤 2: 标题
详细描述第二步要做什么

# 输出格式

定义最终输出应该是什么样的

# 注意事项

- 重要提示 1
- 重要提示 2

# 示例

## 输入示例:

  示例输入

## 期望输出:

  示例输出
```

### 关键元素解析

| 元素 | 必需 | 说明 |
|------|------|------|
| `name` | ✅ | 技能名称,仅小写字母和连字符,1-64字符,必须与目录名匹配 |
| `description` | ✅ | 1-1024字符,应包含用途说明和使用时机的关键词 |
| `license` | ❌ | 许可证信息(推荐包含) |
| `compatibility` | ❌ | 环境要求说明,1-500字符 |
| `metadata` | ❌ | 自定义元数据(如 author, version 等) |
| `allowed-tools` | ❌ | 预批准工具列表(实验性) |
| `工作流程` | 推荐 | 详细的分步骤执行指令 |
| `示例` | 推荐 | 输入输出示例,帮助 Claude 理解 |

## 快速入门

### 5 分钟创建你的第一个 Skill

![Skill 的结构](//pub.smallyoung.cn/course_slidev/skills/7.png)

#### 前置条件

| 要求 | 说明 |
|------|------|
| Claude 账号 | Pro, Max, Team 或 Enterprise 订阅 |
| 文本编辑器 | 用于编写 Markdown 文件 |

#### 步骤 1: 创建技能目录和文件

创建目录结构:

```bash
mkdir email-summary
cd email-summary
```

创建 `SKILL.md` 文件(注意大写):

```markdown
---
name: email-summary
description: "将长邮件转换为简洁的要点摘要。当用户需要总结邮件、提取关键信息或生成行动项时使用。"
license: MIT
metadata:
  author: your-name
  version: "1.0"
---

# 技能说明

这个技能帮助用户快速理解长邮件的核心内容,生成结构化的摘要。

# 工作流程

## 步骤 1: 分析邮件内容
- 识别邮件的主要主题
- 提取关键人物和时间
- 找出重要的行动项

## 步骤 2: 生成摘要
按照以下格式组织信息:

1. **核心主题**: 一句话概括邮件主旨
2. **关键信息**: 3-5 个要点
3. **行动项**: 需要采取的具体行动(如有)
4. **截止时间**: 重要的时间节点(如有)

# 输出格式

📧 **邮件摘要**

**核心主题**: [一句话概括]

**关键信息**:
- 要点 1
- 要点 2
- 要点 3

**行动项**:
- [ ] 行动 1 (负责人: XXX, 截止: YYYY-MM-DD)
- [ ] 行动 2 (负责人: XXX, 截止: YYYY-MM-DD)

# 示例

输入:

Hi Team,

I hope this email finds you well. I wanted to follow up on our discussion 
from last week's meeting about the Q4 project timeline...

[长邮件内容]


期望输出:

📧 **邮件摘要**

**核心主题**: Q4 项目时间线调整和资源分配

**关键信息**:
- 项目因客户需求变更需要延期 2 周
- 需要增加 2 名开发人员
- 预算增加 15%

**行动项**:
- [ ] 更新项目计划 (负责人: 张三, 截止: 2025-12-25)
- [ ] 申请额外预算 (负责人: 李四, 截止: 2025-12-23)

```

#### 步骤 2: 上传 Skill

**通过 Claude 网页界面**:

1. 访问 https://claude.ai
2. 进入设置(Settings) → 功能(Features)
3. 启用 "Skills" 功能
4. 点击 "Add Skill" 或 "Create Skill"
5. 上传整个 `email-summary` 文件夹(包含 SKILL.md)
6. 点击 "Save"

> 💡 **提示**: Team 和 Enterprise 用户需要管理员先在组织级别启用 Skills 功能。

**通过 API** (高级用法):

> ⚠️ **注意**: 官方通过 Messages API 的 `container` 参数来使用 Skills。以下展示使用已上传 Skill 的方式,具体请参考[官方 API 文档](https://docs.anthropic.com/)。

**Python 示例**:

```python
from anthropic import Anthropic

client = Anthropic(api_key="your-api-key")

# 使用 Skills 需要启用代码执行工具
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    # 必需的 beta headers
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    # 启用代码执行工具
    tools=[{"type": "code_execution"}],
    # 通过 container 参数指定 Skills
    container={
        "skills": [
            {
                "type": "custom",  # 或 "anthropic" 表示官方技能
                "skill_id": "email-summary",  # 你上传的技能 ID
                "version": "1.0"  # 可选:固定版本
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "请总结这封邮件:[邮件内容]"
    }]
)

print(response.content)
```

**TypeScript/Node.js 示例**:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 使用 Skills 需要启用代码执行工具
const response = await client.messages.create(
  {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    // 必需的 beta headers
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    // 启用代码执行工具
    tools: [{ type: 'code_execution' }],
    // 通过 container 参数指定 Skills
    container: {
      skills: [
        {
          type: 'custom',  // 或 'anthropic' 表示官方技能
          skill_id: 'email-summary',  // 你上传的技能 ID
          version: '1.0'  // 可选:固定版本
        }
      ]
    },
    messages: [{
      role: 'user',
      content: '请总结这封邮件:[邮件内容]'
    }]
  }
);

console.log(response.content);
```

**安装依赖**:

```bash
# Python
pip install anthropic

# Node.js/TypeScript
npm install @anthropic-ai/sdk
```

#### 步骤 3: 使用 Skill

在 Claude 对话中直接粘贴一封长邮件,然后说:

```
请使用"邮件摘要生成器"帮我总结这封邮件。
```

Claude 会:
1. 识别你提到了技能名称
2. 激活并完整加载该 Skill
3. 按照定义的流程执行
4. 返回符合格式要求的摘要

## 技能编排与组合

### 什么是技能编排?

![Skill 的结构](//pub.smallyoung.cn/course_slidev/skills/8.png)

**技能编排(Skill Orchestration)** 是指 Claude 自动选择和组合多个 Skills 来完成复杂任务的能力。

#### 简单场景 vs 复杂场景

**简单场景**: 单一技能

```
用户: "总结这封邮件"
  ↓
Claude: 使用 [邮件摘要生成器]
  ↓
输出: 邮件摘要
```

**复杂场景**: 多技能协作

```
用户: "分析这份销售数据并生成周报"
  ↓
Claude 的思考过程:
  1. 需要先分析数据 → 激活 [数据分析助手]
  2. 需要生成周报 → 激活 [周报生成器]
  3. 可能需要图表 → 激活 [图表生成器]
  ↓
执行流程:
  [数据分析助手] → 分析数据,生成统计结果
         ↓
  [图表生成器] → 根据统计结果生成可视化
         ↓
  [周报生成器] → 整合分析和图表,生成周报
  ↓
输出: 完整的销售周报
```

### 编排示例

假设你有以下三个 Skills:

1. **数据清洗器** - 处理和标准化数据
2. **统计分析器** - 计算统计指标
3. **报告生成器** - 生成专业报告

**用户请求**:
```
我有一份客户数据 CSV,帮我生成一份分析报告。
```

**Claude 的自动编排**:

```mermaid
graph LR
    A[用户上传 CSV] --> B[数据清洗器]
    B --> C[统计分析器]
    C --> D[报告生成器]
    D --> E[输出报告]
```

**执行日志** (概念化):

```
[Claude]: 检测到用户需要数据分析报告
[Claude]: 激活技能 "数据清洗器" (Step 1/3)
[数据清洗器]: 完成 - 清洗了 1,234 行数据
[Claude]: 激活技能 "统计分析器" (Step 2/3)
[统计分析器]: 完成 - 生成 8 项统计指标
[Claude]: 激活技能 "报告生成器" (Step 3/3)
[报告生成器]: 完成 - 生成 Markdown 报告
[Claude]: 任务完成 ✅
```

## 实际应用场景

### 场景 1: 企业知识管理

![企业知识管理](//pub.smallyoung.cn/course_slidev/skills/9.png)

**需求**: 将公司内部文档转换为新员工培训材料

**Skills 设计**:

```markdown
---
name: "培训材料生成器"
description: "从技术文档生成新员工友好的培训材料"
---

# 工作流程

## 步骤 1: 分析源文档
- 识别核心概念
- 提取关键流程
- 标记专业术语

## 步骤 2: 简化和重组
- 将复杂概念拆解为简单步骤
- 为专业术语添加解释
- 添加实际案例

## 步骤 3: 生成培训材料
- 创建循序渐进的学习路径
- 添加检查点问题
- 包含实践练习

# 输出格式

# [主题名称] 新员工培训指南

## 📚 学习目标
- 目标 1
- 目标 2

## 📖 核心概念
### 概念 1: [名称]
**简单解释**: ...
**为什么重要**: ...

## 🔧 实际操作
### 步骤 1: [标题]
详细说明...

## ✅ 检查点
- [ ] 我能解释...
- [ ] 我能完成...

## 💡 常见问题
**Q: ...**
A: ...
```

**效果**: 
- ✅ 将 50 页技术文档转换为 10 页新手指南
- ✅ 新员工培训时间从 2 周缩短到 3 天
- ✅ 确保培训材料的一致性和质量

### 场景 2: 代码审查助手

![代码审查助手](//pub.smallyoung.cn/course_slidev/skills/10.png)

**需求**: 标准化代码审查流程和反馈格式

**Skills 设计**:

```markdown
---
name: "代码审查助手"
description: "按照团队标准进行代码审查并生成结构化反馈"
version: "2.0"
---

# 工作流程

## 步骤 1: 代码分析
检查以下方面:
- 代码风格是否符合团队规范
- 是否存在明显的 bug 或性能问题
- 是否有安全隐患
- 测试覆盖是否充分
- 文档注释是否完整

## 步骤 2: 分级评估
为每个问题分配优先级:
- 🔴 严重 (Critical): 必须修复才能合并
- 🟡 重要 (Important): 强烈建议修复
- 🔵 建议 (Suggestion): 可选优化

## 步骤 3: 生成报告
提供具体的、可操作的反馈

# 输出格式

# 代码审查报告

**审查人**: Claude  
**日期**: YYYY-MM-DD  
**总体评估**: ✅ 可以合并 / ⚠️ 需要修改 / ❌ 需要重大改进

## 🔴 严重问题
### [问题描述]
**位置**: `文件名:行号`  
**问题**: 详细说明  
**建议**: 具体的修改方案  

## 🟡 重要建议
### [建议描述]
**位置**: `文件名:行号`  
**原因**: 为什么需要改进  
**建议**: 如何改进  

## 🔵 优化建议
- 建议 1
- 建议 2

## ✨ 优点
- 做得好的地方 1
- 做得好的地方 2
```

**效果**:
- ✅ 代码审查时间从 30 分钟缩短到 5 分钟
- ✅ 反馈格式标准化,易于理解
- ✅ 提高审查质量和一致性

### 场景 3: 客户支持自动化

![客户支持自动化](//pub.smallyoung.cn/course_slidev/skills/11.png)

**需求**: 快速生成标准化的客户支持回复

**Skills 组合**:

1. **问题分类器 Skill** - 识别问题类型
2. **解决方案查找器 Skill** - 从知识库匹配答案
3. **回复生成器 Skill** - 生成专业、友好的回复

**工作流程**:

```
客户问题
    ↓
[问题分类器] → 识别为"账号密码重置"类型
    ↓
[解决方案查找器] → 从知识库找到标准流程
    ↓
[回复生成器] → 生成个性化回复
    ↓
输出专业回复
```

**效果**:
- ✅ 响应时间从 4 小时缩短到 5 分钟
- ✅ 回复质量一致性提升 80%
- ✅ 客户满意度提高 35%

## 最佳实践

![最佳实践](//pub.smallyoung.cn/course_slidev/skills/12.png)

### 编写高质量 Skill 的技巧

| 原则 | 说明 | 示例 |
|------|------|------|
| **明确性** | 每个步骤都要清晰、具体 | ❌ "分析数据" → ✅ "计算平均值、中位数和标准差" |
| **可测试性** | 提供输入输出示例 | 包含 3-5 个实际例子 |
| **模块化** | 一个 Skill 做好一件事 | 分解复杂任务为多个小 Skills |
| **版本控制** | 记录版本和变更 | 使用语义化版本号 (1.0.0, 1.1.0) |

### 常见错误及解决方案

| 错误 | 问题 | 解决方案 |
|------|------|---------|
| 过于宽泛 | Skill 试图做太多事情 | 拆分为多个专注的 Skills |
| 缺少示例 | Claude 难以理解期望输出 | 添加 2-3 个详细示例 |
| 步骤模糊 | 执行结果不一致 | 将每个步骤具体化、量化 |
| 忽略边界情况 | 特殊情况处理不当 | 在"注意事项"中说明边界情况 |

### 测试你的 Skill

**测试清单**:

```markdown
# Skill 测试清单

## 功能测试
- [ ] 正常输入能产生预期输出
- [ ] 边界情况能正确处理
- [ ] 错误输入有合理提示

## 性能测试
- [ ] Token 消耗在合理范围(<3000 tokens)
- [ ] 执行时间可接受(<30秒)

## 用户体验测试
- [ ] 输出格式清晰易读
- [ ] 反馈信息足够详细
- [ ] 错误提示有指导意义

## 兼容性测试
- [ ] 与其他 Skills 组合正常
- [ ] 依赖的 MCP Servers 正常工作
```

## 常见问题

### Q1: Skills 支持哪些编程语言?

**答**: Skills 本身使用 Markdown 编写,但可以包含任何语言的脚本。

**支持的脚本类型**:
- Python (最常用,官方推荐)
- JavaScript/TypeScript
- Bash/Shell
- 任何 Claude Code 支持的语言

**注意**: 脚本执行需要用户明确授权。

### Q2: Skills 和 Prompts 有什么区别?

| 对比 | Prompts | Skills |
|------|---------|--------|
| **定义方式** | 每次对话手动输入 | 一次创建,永久保存 |
| **复用性** | ❌ 每次重新输入 | ✅ 随时调用 |
| **管理** | ❌ 难以版本控制 | ✅ 文件化管理 |
| **组合** | ❌ 难以组合 | ✅ 自动编排 |
| **效率** | ❌ 每次占用完整 Token | ✅ 渐进式加载 |

**适用场景**:
- 一次性任务 → 使用 Prompts
- 重复性工作 → 使用 Skills

### Q3: Skills 能访问我的本地文件吗?

**答**: 这取决于你的使用方式和授权。

**不同场景**:

| 使用方式 | 文件访问能力 |
|---------|-------------|
| Claude.ai 网页版 | ❌ 只能访问你上传的文件 |
| Claude Code | ✅ 经授权后可访问项目文件 |
| API + MCP Servers | ✅ 可配置文件访问权限 |

**安全提示**: 
- 始终审查 Skill 要求的权限
- 不要在 Skill 中硬编码敏感信息
- 使用环境变量管理密钥

### Q4: 如何调试一个不工作的 Skill?

**答**: 按照以下步骤排查。

**调试步骤**:

1. **检查元数据格式**
   ```markdown
   ---
   name: "技能名称"    ✅ 正确
   description: 描述  ❌ 错误(缺少引号)
   ---
   ```

2. **简化测试**
   - 创建最小化版本的 Skill
   - 逐步添加功能

3. **查看 Claude 的反馈**
   - 直接问 Claude: "为什么这个 Skill 没有正常工作?"
   - Claude 会告诉你可能的问题

4. **检查依赖**
   - 确认需要的 MCP Servers 已连接
   - 验证权限设置正确

## 进阶话题

### 使用 API 管理 Skills

> ⚠️ **注意**: 以下代码为概念性示例,用于说明 Skills 管理的可能方式。实际的官方 API 接口可能不同,具体请参考[官方 API 文档](https://docs.anthropic.com/)。官方文档主要说明通过 Messages API 的 `container` 参数来指定和使用 Skills。

**创建 Skill**:

```python
from anthropic import Anthropic

client = Anthropic(api_key="your-api-key")

# 创建新技能
skill = client.skills.create(
    name="我的技能",
    content=open("skill.md").read()
)

print(f"Created skill: {skill.id}")
```

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 创建新技能
const skill = await client.skills.create({
  name: '我的技能',
  content: readFileSync('skill.md', 'utf-8')
});

console.log(`Created skill: ${skill.id}`);
```

**列出所有 Skills**:

```python
skills = client.skills.list()
for skill in skills:
    print(f"{skill.name} (v{skill.version})")
```

```typescript
const skills = await client.skills.list();
skills.forEach(skill => {
  console.log(`${skill.name} (v${skill.version})`);
});
```

**更新 Skill**:

```python
client.skills.update(
    skill_id="skill_abc123",
    content=open("skill_v2.md").read(),
    version="2.0"
)
```

```typescript
await client.skills.update({
  skill_id: 'skill_abc123',
  content: readFileSync('skill_v2.md', 'utf-8'),
  version: '2.0'
});
```

**删除 Skill**:

```python
client.skills.delete(skill_id="skill_abc123")
```

```typescript
await client.skills.delete({ skill_id: 'skill_abc123' });
```

### Skills 与工作流自动化

**集成到 CI/CD**:

```yaml
# .github/workflows/deploy-skills.yml
name: Deploy Skills

on:
  push:
    paths:
      - 'skills/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Skills
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python deploy_skills.py
```

**deploy_skills.py**:

```python
import os
from anthropic import Anthropic
from pathlib import Path

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# 自动部署所有 skills 目录下的技能
for skill_file in Path("skills").glob("*.md"):
    content = skill_file.read_text(encoding="utf-8")
    
    try:
        client.skills.create(
            name=skill_file.stem,
            content=content
        )
        print(f"✅ Deployed: {skill_file.stem}")
    except Exception as e:
        print(f"❌ Failed: {skill_file.stem} - {e}")
```

**deploy_skills.ts** (TypeScript):

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

// 自动部署所有 skills 目录下的技能
const skillsDir = 'skills';
const skillFiles = readdirSync(skillsDir).filter(file => file.endsWith('.md'));

for (const skillFile of skillFiles) {
  const filePath = join(skillsDir, skillFile);
  const content = readFileSync(filePath, 'utf-8');
  const { name } = parse(skillFile);
  
  try {
    await client.skills.create({
      name,
      content
    });
    console.log(`✅ Deployed: ${name}`);
  } catch (error) {
    console.error(`❌ Failed: ${name} - ${error}`);
  }
}
```

## 总结

### Claude Skills 的核心价值

**对于个人用户**:
- 📚 建立个人 AI 专家库
- ⚡ 提高重复性任务效率
- 🎯 获得一致、专业的结果

**对于企业**:
- 💼 标准化业务流程
- 👥 传承专业知识和最佳实践
- 📊 提高团队协作效率
- 💰 降低培训和支持成本

**对于开发者**:
- 🔧 构建专业的 AI 工作流
- 🎨 创建可分享的技能包
- 🚀 加速 AI 应用开发

### 从"助手"到"专家"

![从"助手"到"专家"](//pub.smallyoung.cn/course_slidev/skills/14.png)

Claude Skills 的推出标志着 AI 助手的重要进化:

- **过去**: AI 是通用助手,每次都需要指导
- **现在**: AI 是领域专家,掌握专业知识和标准流程
- **未来**: AI 技能生态,开发者共享和交易专业技能包

### 下一步行动

**初学者**:
1. 创建你的第一个简单 Skill
2. 在实际工作中使用和改进它
3. 尝试组合多个 Skills

**进阶用户**:
1. 结合 MCP 构建完整的自动化工作流
2. 开发团队共享的技能库
3. 通过 API 实现 Skills 的自动化管理

**企业用户**:
1. 识别可标准化的业务流程
2. 创建企业级技能库
3. 建立技能治理和版本控制机制

## 延伸阅读

### 相关技术

| 技术 | 说明 | 关系 |
|------|------|------|
| **MCP** | Model Context Protocol | Skills 的底层连接协议 |
| **Claude Code** | 代码执行环境 | Skills 的运行环境之一 |
| **Anthropic API** | Claude 的编程接口 | Skills 的程序化管理 |

### 官方资源

- [Claude Skills 文档](https://claude.ai/skills)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [Claude API 文档](https://docs.anthropic.com/)

### 社区资源

- [Claude Skills 示例库](https://github.com/topics/claude-skills)
- [MCP Servers 集合](https://github.com/modelcontextprotocol/servers)