### 1.7 文章生命周期

知识库文章遵循 **fleeting → literature → permanent** 的单向流转，每个阶段有明确的驻留位置、准入条件和退出条件。

| 阶段 | 阶段名称 | 驻留目录 | 准入条件 | 退出条件 | 自动化脚本 |
|------|----------|----------|----------|----------|------------|
| 1 | fleeting（闪念笔记） | `00-Inbox/` | 有初步想法或原始素材 | 补充 frontmatter + 8 板块骨架 → `literature` | `scripts/promote.js` |
| 2 | literature（文献笔记） | `02-Areas/`（draft） | status="literature" + 基础内容完整 | 综合评分 >=7.0 + 人工确认 → `permanent` | `scripts/review.js` |
| 3 | permanent（永久笔记） | `02-Areas/` | status="permanent" + 综合评分 >=8.0 | 过时/废弃/重复 → `04-Archives/` | `scripts/archive.js` |

#### 1.7.1 阶段详细规则

**fleeting（闪念笔记）**
- 位置：`00-Inbox/{category}/`
- 内容要求：有核心观点即可，不强制 frontmatter 完整
- 流转：执行 `node scripts/promote.js <path>` 自动补充 frontmatter、创建 8 板块骨架、更新状态为 literature
- 限制：`00-Inbox/` 滞留时间不超过 30 天，超期自动标记为废弃

**literature（文献笔记）**
- 位置：`02-Areas/{Domain}/`
- 内容要求：frontmatter 齐全（title/tags/stage/status/type/summary/related）、8 个 mandatory sections 完整、有 1-2 个有效双链
- 流转：执行 `node scripts/review.js <path>` 进行评分，>=7.0 自动更新 status="permanent"、更新 Master-Plan 状态
- 限制：滞留时间不超过 60 天，超期未达标则退回 fleeting 或标记废弃

**permanent（永久笔记）**
- 位置：`02-Areas/{Domain}/`
- 内容要求：综合评分 >=8.0、depth/edge >=7.0、双链格式规范、related 概念无 wiki 链接
- 流转：长期维护，定期回顾；过时则迁移至 `04-Archives/deprecated/`
- 限制：每年至少回顾 1 次，过时内容标记 `status: "deprecated"`

#### 1.7.2 状态自动化工具链

```bash
# 提升为 literature（补充 frontmatter + 骨架）
node knowledge-wiki/scripts/promote.js vault/00-Inbox/ai/某草稿.md

# 评审升级为 permanent（评分 >=7.0 自动升级）
node knowledge-wiki/scripts/review.js vault/02-Areas/某文章.md

# 归档废弃文章
node knowledge-wiki/scripts/archive.js vault/02-Areas/某过时文章.md --reason "技术栈迁移"
```
