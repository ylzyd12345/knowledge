---
name: knowledge-wiki
description: Generate, update, and validate Obsidian knowledge-base wiki articles for a Java backend architect knowledge vault. Use when the user asks to write a new wiki article, batch-generate articles, update existing notes, check article quality against rules/scoring, or track the Master-Plan progress. Triggers on requests like "generate an article on X", "batch generate", "check article quality", "update the knowledge base", "what articles are pending", or any work involving vault/02-Areas/, vault/_Config/, or vault/_Templates/.
---

# Knowledge Wiki Skill

This skill manages the Obsidian knowledge vault at `vault/`. It generates, validates, and tracks encyclopedia-style wiki articles for a Java backend architect knowledge base.

## Vault Structure

```
vault/
├── 00-Inbox/           # Drafts, raw material, AI dialogue snippets
│   ├── ai/             # AI dialogue, model comparison drafts
│   ├── java/           # Java-related scattered notes
│   ├── structure/      # Architecture design, deployment drafts
│   └── imgs/           # Temp screenshots (move to _Attachments/ after confirmation)
├── 02-Areas/           # Core knowledge domains (permanent notes)
│   ├── Java-Core/      # Java language core
│   ├── Java-Frameworks/ # Spring, MyBatis, etc.
│   ├── Architecture/    # Distributed, high-concurrency, middleware, security
│   ├── DevOps/          # Containerization, deployment
│   ├── Engineering/     # Design patterns, testing, tools
│   ├── Master-Plan.md   # Global blueprint (94 articles, 11 categories, status tracking)
│   └── Java-Learning-Path.md
├── _Config/            # rules.md, scoring.md
├── _Templates/         # template.md
├── _Attachments/       # Images, PDFs (referenced via ![[name]])
└── wiki/               # Legacy content (migrate to 02-Areas/)
```

## Core Documents (Read Before Acting)

Always read these before generating or updating articles:

1. `vault/_Config/rules.md` — Directory mapping, article structure (8 sections), type system, link strategy, workflow, prohibitions. The single source of truth for structure.
2. `vault/_Config/scoring.md` — 8-dimension weighted scoring (10 points), 3-round internal iteration, release threshold (>=8.0, depth/edge >=7.0).
3. `vault/_Templates/template.md` — Markdown skeleton + AI generation prompts.
4. `vault/01-Index/Master-Plan.md` — Global blueprint with 94 articles, 11 categories, and status tracking.

## Article Types

| Type | Word count | Interview Qs | Source code | Examples |
|------|-----------|--------------|-------------|----------|
| Map (地图型) | 1500-2500 | 5-6 | 0-1 short | 1 |
| Mechanism (机制型) | 3000-5000 | 6-10 | 1-2 blocks | 1 + principle demo |
| Tool (工具型) | 2000-3500 | 4-6 | optional | 1-2 |
| Framework (框架型) | 2500-4000 | 5-8 | entry class | config/annotation |

## Mandatory Frontmatter

```yaml
---
title: "FileName"           # Must match filename without .md
tags:                         # Domain tags for retrieval
  - java/concurrency
  - thread-pools
stage: 3                      # 1-basics 2-api 3-advanced 4-engineering 5-framework 6-architecture
status: "permanent"           # fleeting | literature | permanent
type: "机制型"                 # 地图型 | 机制型 | 工具型 | 框架型
summary: "One-line summary"   # Must match Master-Plan and Learning-Path
related:                      # Related concepts, plain text
  - ConceptA
  - ConceptB
---
```

## Mandatory 8 Sections

Every article contains these `##` sections in order:

1. **Opening positioning paragraph** (after the blockquote)
2. **概念定义** (Concept definition)
3. **核心原理** (Core principle)
4. **实际应用** (Practical application)
5. **源码分析** (Source code analysis)
6. **面试常见题目** (Common interview questions with answers)
7. **思维发散** (Divergent thinking)
8. **相关概念（待扩展）** (Related concepts, plain text list)

## Workflow

### Single Article Generation

1. Read `01-Index/Master-Plan.md` to find the target article and its summary.
2. Determine `type` and `stage` from `rules.md` section 4.3.
3. Read the benchmark article `02-Areas/Java-Core/Basics/Java-Overview.md` (map-type benchmark).
4. Generate 3 internal rounds:
   - Round 1: Skeleton — frontmatter + 8 sections + cover key points
   - Round 2: Boundaries — trim out-of-scope content, fill missing contract items, adjust depth by type
   - Round 3: Polish — interview answers, code runnability, tables/flows, de-redundancy
5. Score each round using `scoring.md` dimensions. Only output the highest-scoring version.
6. Release threshold: comprehensive score >=8.0, depth adaptability >=7.0, edge clarity >=7.0.
7. Write to `02-Areas/{domain}/{subdomain}/{FileName}.md` (English Kebab-case).
8. Update `01-Index/Master-Plan.md`: change status to ✅ and fill in the `[[双链]]`.
9. Update `01-Index/Java-Learning-Path.md` if the article belongs to the Java learning path.

### Batch Generation

1. Read `01-Index/Master-Plan.md`, filter articles with status ⬜.
2. Generate in category order (categories 一 → 十一) to minimize cross-reference inconsistency.
3. For each article, follow the single-article workflow above.
4. After each category, run the quality check script on a sample article.
5. Update `01-Index/Master-Plan.md` statistics table after each batch.

### Quality Check

Run `scripts/check_article.js <article-path>` to validate:
- Frontmatter fields present and consistent
- 8 mandatory sections present
- Filename matches `title`
- `summary` matches Master-Plan entry
- Links use `[[path|display]]` format
- Related concepts section is plain text (no wiki links)

Run `scripts/update_progress.js` to:
- Scan `02-Areas/` for all `.md` files
- Compare against `01-Index/Master-Plan.md` entries
- Update status markers and statistics table

### Inbox Processing

1. Review `00-Inbox/` drafts.
2. If mature: move to `02-Areas/{domain}/{subdomain}/`, add frontmatter, update Master-Plan.
3. If obsolete: move to `04-Archives/` (create if needed).
4. Move confirmed screenshots from `00-Inbox/imgs/` to `_Attachments/` with topic-based names.

## Prohibitions

- Do not create stub notes for unplanned concepts.
- Do not fabricate source code line numbers or non-existent class/method names.
- Do not make all articles the same length or depth.
- Do not list interview questions without answers.
- Do not expand GC algorithms, AQS, or Spring internals inside map-type overview articles.
- Do not use Chinese characters or spaces in filenames.
- Do not skip the 3-round internal iteration.
- Do not output articles scoring below 8.0.

## Benchmark

- `02-Areas/Java-Core/Basics/Java-Overview.md` — map-type structure and boundary benchmark.
- Target comprehensive score >=8.0 for all articles; >=8.5 for difficult mechanism-type articles.
