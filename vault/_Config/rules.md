# Obsidian 知识库文章生成规则

> 版本：v2.1  
> 更新日期：2026-06-27  
> 适用范围：`vault/02-Areas/` 下按领域组织的百科全书式笔记  
> 标杆样例：`02-Areas/Java-Core/Basics/Java-Overview.md`

---

## 1. 路径与目录结构

### 1.1 知识库根路径

```
vault/
├── 00-Inbox/           # 草稿、原始素材、AI 对话初稿
│   ├── ai/             # AI 对话、模型对比等草稿
│   ├── java/           # Java 相关零散笔记
│   ├── structure/      # 架构设计、部署方案草稿
│   └── imgs/           # 临时截图（确认后移入 _Attachments/）
├── 01-Index/           # 索引/MOC/规划文档
│   ├── Master-Plan.md  # 全局知识库蓝图（94 篇规划）
│   ├── Java-Learning-Path.md  # Java 学习路径
│   └── Java-Core-MOC.md       # Java 核心 MOC
├── 02-Areas/           # 核心知识领域（永久笔记）
├── _Config/            # 规则、评分标准等配置
├── _Templates/         # 模板文件
├── _Attachments/       # 图片、PDF 等附件（正式引用）
└── wiki/               # 遗留内容（逐步迁移至 02-Areas/）
```

> **Inbox 处理规则**：`00-Inbox/` 中的笔记经评审后迁入 `02-Areas/` 对应领域，或归档至 `04-Archives/`。`imgs/` 中的临时截图确认后移入 `_Attachments/` 并按主题命名（如 `jvm-memory-model.png`）。`_Attachments/` 中的文件仅通过 `![[附件名]]` 在正文中引用，不单独维护索引。

### 1.2 领域映射规则

| 领域 | 子领域 | 路径示例 |
|------|--------|----------|
| Java-Core | Basics | `02-Areas/Java-Core/Basics/OOP.md` |
| Java-Core | API | `02-Areas/Java-Core/API/Generics.md` |
| Java-Core | Collections | `02-Areas/Java-Core/Collections/Collections-Framework.md` |
| Java-Core | Concurrency | `02-Areas/Java-Core/Concurrency/Thread-Pools.md` |
| Java-Core | IO | `02-Areas/Java-Core/IO/NIO.md` |
| Java-Core | JVM | `02-Areas/Java-Core/JVM/Garbage-Collection.md` |
| Java-Core | Advanced | `02-Areas/Java-Core/Advanced/Reflection.md` |
| Java-Frameworks | Spring | `02-Areas/Java-Frameworks/Spring/Spring-Boot.md` |
| Java-Frameworks | ORM | `02-Areas/Java-Frameworks/ORM/MyBatis.md` |
| Java-Frameworks | Database | `02-Areas/Java-Frameworks/Database/JDBC.md` |
| Architecture | Distributed-Systems | `02-Areas/Architecture/Distributed-Systems/...` |
| Architecture | High-Concurrency | `02-Areas/Architecture/High-Concurrency/...` |
| Architecture | Middleware | `02-Areas/Architecture/Middleware/...` |
| Architecture | Security | `02-Areas/Architecture/Security/...` |
| DevOps | — | `02-Areas/DevOps/Containerization-and-Deployment.md` |
| Engineering | Tools | `02-Areas/Engineering/Tools/Git.md` |
| Engineering | Testing | `02-Areas/Engineering/Testing/Unit-Testing.md` |
| Engineering | Design-Patterns | `02-Areas/Engineering/Design-Patterns/...` |

### 1.3 文件名约定

- 使用 **English Kebab-case**（英文短横线命名），对 SEO 和 URL 友好。
- 示例：`Garbage-Collection.md`、`Spring-Boot.md`、`Thread-Pools.md`。
- 不使用中文、空格、全角符号。
- 文件名与文章 `title` frontmatter 保持一致。

### 1.4 学习路径索引（MOC）

- 路径：`01-Index/Java-Learning-Path.md`
- 内容：按学习阶段列出全部文章链接 + 一句话摘要。
- 使用 Obsidian `[[双链]]` 组织，是知识库的导航入口。

### 1.5 大纲源文件

- **全局规划**：`01-Index/Master-Plan.md`（80+ 篇完整知识库蓝图，含 11 大分类）
- 结构定义：`01-Index/Java-Core-MOC.md`（Java 核心 MOC）
- 学习路径：`02-Areas/Java-Learning-Path.md`（全局学习路径）
- 各 MOC 文件为**写作契约**的补充说明。
- `wiki/索引.md` 为旧版规划索引，内容已迁入 `Master-Plan.md`，待确认后删除。

---

## 2. 文章结构（固定板块）

每篇文章包含以下板块，使用 `##` 二级标题：

| 顺序 | 板块 | 说明 |
|------|------|------|
| 1 | 文首定位段 | 紧接 blockquote 后，1～3 句说明本文边界与读者收获 |
| 2 | 概念定义 | 清晰定义概念，必要时用表格归纳 |
| 3 | 核心原理 | 底层工作原理；深度随文章类型调整 |
| 4 | 实际应用 | 真实场景、配置或代码示例 |
| 5 | 源码分析 | JDK 或著名框架源码；无合适源码时写「典型实现思路」并标注 |
| 6 | 面试常见题目 | 附简要参考答案 |
| 7 | 思维发散 | 拓展问题或概念关联 |
| 8 | 相关概念（待扩展） | 纯文本列表，不用 wiki 链接 |

**不单独增加**「相关概念」以外的附录；子主题在核心原理下用 `###` 展开。

---

## 3. Frontmatter 规范

每篇文章顶部 YAML：

```yaml
---
title: "FileName"                    # 与文件名一致（不含 .md）
tags:                                # 领域标签，用于检索和分类
  - java/concurrency
  - thread-pools
stage: 3                             # 学习阶段：1-基础 2-进阶 3-高级 4-工程 5-框架 6-架构
status: "permanent"                  # fleeting(草稿) | literature(文献) | permanent(永久)
type: "机制型"                        # 地图型 | 机制型 | 工具型 | 框架型
summary: "一句话摘要"                  # 与学习路径 MOC 一致
related:                             # 相关概念，纯文本
  - ConceptA
  - ConceptB
---
```

### 3.1 文首格式

```markdown
# 概念名

> 一句话摘要（与 summary 一致）

本文……（定位段：本文解决什么问题、不展开什么、与哪些专题的边界）
```

---

## 4. 文章类型与深度

不同类型**板块权重与篇幅不同**，禁止所有文章同一深度。

### 4.1 类型定义

| 类型 | 适用场景 | 字数参考 | 板块权重 |
|------|----------|----------|----------|
| **地图型** | 总览、导论、体系介绍 | 1500～2500 | 概念 + 全景原理 + 应用；源码轻；面试偏「地图题」 |
| **机制型** | 语言机制、JVM、并发、底层原理 | 3000～5000 | 核心原理 + 源码 + 面试加重 |
| **工具型** | API 类、工程工具、使用指南 | 2000～3500 | 实际应用 + 示例/配置；源码可省略或极简 |
| **框架型** | Spring 等框架与生态 | 2500～4000 | 应用 + 架构原理；源码看入口类即可 |

### 4.2 代码示例规范

| 类型 | 代码数量 |
|------|----------|
| 地图型 | 1 个最小可运行或示意示例 |
| 机制型 | 1 个演示原理的示例 + 可选 1 段源码片段 |
| 工具型 | 1～2 个实用示例（API 调用 / 配置片段） |
| 框架型 | 注解 / YAML / 配置类为主 |

### 4.3 文章类型分配

#### Java-Core/Basics（Stage 1）

| 文件 | 类型 |
|------|------|
| Java-Overview.md | 地图型 |
| Basic-Syntax.md | 工具型 |
| Arrays.md | 工具型 |
| OOP.md | 机制型 |
| Methods.md | 机制型 |
| Access-Modifiers.md | 机制型 |

#### Java-Core/API（Stage 2）

| 文件 | 类型 |
|------|------|
| String-Processing.md | 工具型 |
| Wrapper-Classes.md | 机制型 |
| Math-Utilities.md | 工具型 |
| Date-and-Time.md | 工具型 |
| Generics.md | 机制型 |

#### Java-Core/Collections（Stage 2）

| 文件 | 类型 |
|------|------|
| Collections-Framework.md | 地图型 |

#### Java-Core/Basics（Stage 2，异常处理）

| 文件 | 类型 |
|------|------|
| Exception-Handling.md | 机制型 |

#### Java-Core/Concurrency（Stage 3+6）

| 文件 | 类型 |
|------|------|
| Multithreading-and-Concurrency.md | 机制型 |
| Thread-Pools.md | 机制型 |
| Concurrent-Collections.md | 机制型 |
| Advanced-Concurrency.md | 机制型 |

#### Java-Core/JVM（Stage 3+6）

| 文件 | 类型 |
|------|------|
| Memory-Model.md | 机制型 |
| Garbage-Collection.md | 机制型 |
| Performance-Tuning.md | 机制型 |

#### Java-Core/IO（Stage 3+4）

| 文件 | 类型 |
|------|------|
| IO-Streams.md | 机制型 |
| NIO.md | 机制型 |
| Network-Programming.md | 工具型 |

#### Java-Core/Advanced（Stage 3）

| 文件 | 类型 |
|------|------|
| Reflection.md | 机制型 |
| Annotations.md | 机制型 |
| Lambda-and-Functional-Interfaces.md | 机制型 |
| Stream-API.md | 机制型 |
| Module-System.md | 机制型 |

#### Java-Frameworks/Spring（Stage 5）

| 文件 | 类型 |
|------|------|
| Spring-Framework.md | 框架型 |
| Spring-Boot.md | 框架型 |
| Spring-MVC.md | 框架型 |
| Spring-Cloud.md | 地图型 |

#### Java-Frameworks/ORM（Stage 5）

| 文件 | 类型 |
|------|------|
| MyBatis.md | 框架型 |
| Spring-Data-JPA.md | 框架型 |

#### Java-Frameworks/Database（Stage 4）

| 文件 | 类型 |
|------|------|
| JDBC.md | 工具型 |

#### Architecture（Stage 5+6）

| 文件 | 类型 |
|------|------|
| Message-Queues.md | 地图型 |
| Distributed-Systems-Basics.md | 地图型 |
| High-Concurrency-and-Caching.md | 机制型 |
| Security-and-Encryption.md | 机制型 |

#### DevOps（Stage 5）

| 文件 | 类型 |
|------|------|
| Containerization-and-Deployment.md | 框架型 |

#### Engineering（Stage 4）

| 文件 | 类型 |
|------|------|
| Design-Patterns.md | 地图型 |
| Unit-Testing.md | 工具型 |
| Build-Tools.md | 工具型 |
| Git.md | 工具型 |
| Logging-Frameworks.md | 工具型 |

---

## 5. 链接策略

### 5.1 正文

- 提及其他概念时优先使用 Obsidian `[[双链]]`。
- 链接目标使用相对路径：`[[Java-Core/JVM/Garbage-Collection|垃圾回收]]`。

### 5.2 相关概念（待扩展）

- 文末独立小节，**纯文本列表**：概念名 + 一句说明。
- 同步写入 frontmatter `related` 数组。

### 5.3 MOC 维护

- 每新增一篇文章，同步更新 `Java-Learning-Path.md` 或对应领域 MOC。
- MOC 中使用 `[[相对路径|显示名]]` 格式。

---

## 6. 边界与去重

### 6.1 地图型文章

- 只建立全景，每个子主题 **1～2 段 + 必要时一张流程图/表格**。
- 文首或原理节声明「本篇不展开：……」。
- 不抢占机制型/框架型专题篇幅。

### 6.2 跨文章去重

- 同一机制（如 synchronized）在多篇出现时：概述篇只点到为止，专题篇写透。
- 使用 `[[双链]]` 引用而非重复内容。

### 6.3 源码分析门槛

- 优先 JDK 源码（`java.*`、`javax.*`、`sun.*` 等）。
- 框架型可选 Spring、MyBatis 等入口类或核心接口。
- 无合适源码时：标题可写「典型实现思路」，说明设计模式或执行路径，不虚构行号。

---

## 7. 面试题规范

| 类型 | 题量 | 难度分布 |
|------|------|----------|
| 地图型 | 5～6 道 | 以基础为主，最多 1 道进阶 |
| 机制型 | 6～10 道 | 基础 + 进阶，可含 1～2 道高频深挖 |
| 工具型 | 4～6 道 | 使用场景与易错点 |
| 框架型 | 5～8 道 | 原理 + 实战配置 |

- 每题须附**简要参考答案**（3～5 句），不只列题目。
- 进阶题不得超出本文边界；超出则标「参见 ×× 专题」并用 `[[双链]]`。

---

## 8. 生成工作流

### 8.1 单篇流程

```
读取 MOC 或学习路径（摘要 + 要点）
    → 确定 type 与字数区间
    → 内部迭代 3 轮（见 _Config/scoring.md）
    → 仅输出综合分最高版本
    → 写入 02-Areas/{领域}/{子领域}/{FileName}.md
    → 更新对应 MOC 文件
```

### 8.2 内部三轮迭代

| 轮次 | 目标 |
|------|------|
| 第 1 轮 | 骨架：frontmatter、八大板块、覆盖要点 |
| 第 2 轮 | 边界：删超纲内容、补缺失契约项、调整类型深度 |
| 第 3 轮 | 打磨：面试答案、代码可运行性、表格与流程、去冗余 |

### 8.3 批量顺序

- 按学习路径阶段顺序生成，减少前后引用不一致。
- 已存在文件：按本规则全文覆盖更新（用户确认批量后执行）。

### 8.4 标杆样例

- `02-Areas/Java-Core/Basics/Java-Overview.md`（地图型标杆）

---

## 9. 禁止项

- 为未规划的概念单独建 stub 笔记。
- 虚构源码行号或捏造不存在的类名/方法名。
- 所有文章同一篇幅、同一深度。
- 面试题只列题目不写答案。
- 在地图型文章中展开 GC 算法、AQS、Spring 源码等专题级内容。
- 使用中文或空格作为文件名。

---

## 10. 文档维护

| 文件 | 职责 |
|------|------|
| `_Config/rules.md` | 本文件：结构、类型、链接、工作流 |
| `_Config/scoring.md` | 迭代打分与放行门槛 |
| `_Templates/template.md` | AI 生成提示词与快速索引 |
| `01-Index/Master-Plan.md` | 全局知识库蓝图（80+ 篇规划） |
| `01-Index/Java-Learning-Path.md` | Java 学习路径 MOC |
| `01-Index/Java-Core-MOC.md` | Java 核心 MOC |

规则变更时同步更新版本号与 `_Templates/template.md` 中的提示词。