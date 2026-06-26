# 知识库文章生成模板

> 版本：v2.1 | 更新：2026-06-27  
> 详细规则见 [`_Config/rules.md`](../_Config/rules.md) | 打分见 [`_Config/scoring.md`](../_Config/scoring.md)

---

## 文档索引

| 文件 | 内容 |
|------|------|
| **`_Config/rules.md`** | 目录映射、文章结构、类型与深度、链接策略、工作流、禁止项 |
| **`_Config/scoring.md`** | 八维加权评分、三轮迭代、放行门槛（综合分 ≥ 8.0） |
| **`_Templates/template.md`** | 本文件：Markdown 骨架 + AI 生成提示词 |
| **`02-Areas/Master-Plan.md`** | 全局知识库蓝图（80+ 篇规划，11 大分类） |
| **`02-Areas/Java-Learning-Path.md`** | Java 学习路径 MOC |
| **`02-Areas/Java-Core/Java-Core-MOC.md`** | Java 核心 MOC |

---

## Markdown 文章骨架

```markdown
---
title: "FileName"
tags:
  - java/领域
  - 具体标签
stage: 1
status: "permanent"
type: "地图型"
summary: "与学习路径 MOC 一致的一句话摘要"
related:
  - RelatedConceptA
  - RelatedConceptB
---

# 概念名

> 一句话摘要

本文……（定位段：回答什么问题、不展开什么、与哪些专题的边界）

---

## 概念定义

（定义 + 可选表格）

---

## 核心原理

### 1. …
### 2. …

（地图型：全景流程；机制型：机制深挖；工具型：可压缩；框架型：架构分层）

---

## 实际应用

（场景 + 代码/配置示例；类型决定示例数量）

---

## 源码分析

（JDK 或框架源码片段 + 解读；无源码则写「典型实现思路」）

---

## 面试常见题目

### 基础
**1. 题目？**
参考答案：……

### 进阶（可选）
**N. 题目？**
参考答案：……

---

## 思维发散

1. …
2. …
3. …

---

## 相关概念（待扩展）

- 概念名 — 一句说明
```

---

## AI 批量生成提示词

将下列提示词与具体章节信息一并交给 Agent 使用。

```
请根据知识库的学习路径 MOC，在 Obsidian 知识库中生成百科全书式笔记。

知识库路径：vault/02-Areas/
规则文档：vault/_Config/rules.md
评分文档：vault/_Config/scoring.md
全局规划：vault/02-Areas/Master-Plan.md
学习路径：vault/02-Areas/Java-Learning-Path.md

【硬性要求】
1. 目录：按领域/子领域组织（见 _Config/rules.md 第 1.2 节）
2. 文件名：English Kebab-case（如 Garbage-Collection.md）
3. 结构：frontmatter + 八大板块（见 _Templates/template.md 骨架）
4. Frontmatter：title、tags、stage、status、type、summary、related
5. 摘要：summary、文首 blockquote 与学习路径 MOC 一致
6. 类型：按 _Config/rules.md 第 4.3 节分配地图型/机制型/工具型/框架型
7. 链接：正文使用 [[双链]]；文末「相关概念（待扩展）」纯文本
8. 面试：题量见 rules.md；每题附 3～5 句参考答案
9. 迭代：每篇内部 3 轮，只输出综合分最高版本
10. 放行：综合分 ≥ 8.0，深度适配性与边界清晰度 ≥ 7.0
11. 已存在文件：按规则全文覆盖更新
12. MOC：生成后同步更新 Java-Learning-Path.md

【本次任务】
- 生成范围：（填写领域或文章列表）
- 特殊说明：（如有）

【输出】
逐篇写入 02-Areas/{领域}/{子领域}/{FileName}.md，不输出中间轮次草稿。
```

---

## 单篇生成提示词（增量）

```
请生成单篇知识库文章。

概念：{概念名}
文件路径：02-Areas/{领域}/{子领域}/{FileName}.md
类型：{地图型|机制型|工具型|框架型}
阶段：{stage 数字}
摘要：{从 MOC 复制}
要点：{从 MOC 或相关 bullet 复制}
相关概念：{从 MOC 相关 bullet 复制}

遵循 vault/_Config/rules.md、vault/_Config/scoring.md。
内部迭代 3 轮，写入目标路径。
生成后更新对应 MOC 文件。
```

---

## 类型与篇幅速查

| 类型 | 字数 | 面试题 | 源码 | 示例 |
|------|------|--------|------|------|
| 地图型 | 1500～2500 | 5～6 | 0～1 段 | 1 个 |
| 机制型 | 3000～5000 | 6～10 | 1～2 段 | 1 个 + 原理演示 |
| 工具型 | 2000～3500 | 4～6 | 可省略 | 1～2 个 |
| 框架型 | 2500～4000 | 5～8 | 入口类 | 配置/注解为主 |

---

## MOC 维护模板

### Master-Plan.md 结构

\`\`\`markdown
---
title: "Master Plan"
tags: [master-plan, knowledge-base, blueprint]
---

# 知识库全局蓝图

> 80+ 篇核心概念文章规划，覆盖 Java 后端架构师从基础到前沿的所有维度。

## 一、Java 语言与核心基础
| 文章 | 摘要 | 状态 |
|------|------|------|
| [[Java-Core/Basics/Java-Overview\|Java 概述]] | ... | ✅ 已完成 |
| ... | ... | ... |

## 二、主流框架与微服务生态
...（按分类展开）

## 使用说明
- 状态标记：✅ 已完成 | 🔄 进行中 | ⬜ 待生成
- 新文章生成后同步更新对应分类的状态
\`\`\`

### Java-Learning-Path.md 结构

```markdown
---
title: "Java Learning Path"
tags: [java, learning-path, moc]
---

# ☕ Java 后端工程师学习路径

## 阶段一：筑基 (Stage 1)
- [[Java-Core/Basics/OOP|面向对象三大特性]]
- [[Java-Core/Basics/Basic-Syntax|基本语法]]
...

## 阶段二：核心 API (Stage 2)
- [[Java-Core/Collections/Collections-Framework|集合框架]]
...

## 阶段三：进阶与底层 (Stage 3)
- [[Java-Core/Concurrency/Multithreading-and-Concurrency|多线程与并发]]
...

## 阶段四：工程与架构 (Stage 4-6)
- [[Java-Frameworks/Spring/Spring-Boot|Spring Boot]]
...
```

### Java-Core-MOC.md 结构

```markdown
---
title: "Java Core MOC"
tags: [java, core, moc]
---

# Java 核心知识图谱

## 基础
- [[Basics/Java-Overview|Java 概述]]
- [[Basics/OOP|面向对象]]
...

## API
- [[API/Generics|泛型]]
...

## 并发
- [[Concurrency/Thread-Pools|线程池]]
...

## JVM
- [[JVM/Garbage-Collection|垃圾回收]]
...
```

---

## 维护说明

- 调整链接策略、类型表或放行门槛时：先改 `_Config/rules.md` / `_Config/scoring.md`，再同步本文件提示词与版本号。
- 新增领域时：创建领域目录 → 更新规则 4.3 类型表 → 批量生成 → 更新 MOC。
- 新增文章时：写入 `02-Areas/{领域}/{子领域}/` → 更新对应 MOC。