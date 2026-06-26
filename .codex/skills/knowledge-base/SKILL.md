---
name: knowledge-base
description: >
  Manage and automate the Obsidian knowledge base at vault/02-Areas/.
  Use when: (1) Generating new encyclopedia-style articles for Java, Architecture,
  DevOps, or Engineering domains, (2) Validating existing articles against scoring
  criteria, (3) Updating MOC (Map of Content) files, (4) Batch generating or
  refactoring articles, (5) Checking article structure compliance with rules.
  Triggers: "生成文章", "写笔记", "知识库", "knowledge base", "generate article",
  "validate article", "update MOC", "学习路径".
---

# Knowledge Base Management

Automate the creation, validation, and maintenance of encyclopedia-style technical articles in an Obsidian knowledge base.

## Key Files

| File | Purpose |
|------|---------|
| `vault/_Config/rules.md` | Article structure, types, naming, workflow rules |
| `vault/_Config/scoring.md` | 8-dimension scoring criteria, pass threshold |
| `vault/_Templates/template.md` | Article skeleton + AI prompt templates |
| `vault/02-Areas/Java-Learning-Path.md` | Global learning path MOC |
| `vault/02-Areas/Java-Core/Java-Core-MOC.md` | Java Core domain MOC |

## Directory Structure

```
vault/02-Areas/
├── Java-Core/          # Basics, API, Collections, Concurrency, IO, JVM, Advanced
├── Java-Frameworks/    # Spring, ORM, Database
├── Architecture/       # Distributed-Systems, High-Concurrency, Middleware, Security
├── DevOps/             # Containerization, Deployment
└── Engineering/        # Design-Patterns, Testing, Tools
```

## Workflows

### 1. Generate Single Article

1. Read `vault/_Config/rules.md` for structure and type requirements
2. Read `vault/_Templates/template.md` for the article skeleton
3. Determine: domain, subdomain, FileName, type, stage
4. Generate content with 3 internal iterations (score each)
5. Output only the highest-scoring version (target ≥ 8.0)
6. Write to `vault/02-Areas/{domain}/{subdomain}/{FileName}.md`
7. Update relevant MOC file

### 2. Generate Batch Articles

1. Read the learning path MOC to identify gaps
2. Group by domain and type
3. For each article: follow single-article workflow
4. After batch: update all affected MOC files
5. Run `scripts/validate_articles.js` to check compliance

### 3. Validate Existing Articles

Run the validation script:
```bash
node .codex/skills/knowledge-base/scripts/validate_articles.js
```

Or manually check against `vault/_Config/scoring.md` criteria:
- Frontmatter fields: title, tags, stage, status, type, summary, related
- 8 sections present
- File naming: English Kebab-case
- Word count within type range

### 4. Update MOC Files

When adding new articles:
1. Add `[[domain/subdomain/FileName|显示名]]` to the relevant MOC
2. Ensure the article appears in the correct stage section
3. Verify no duplicate entries

## Frontmatter Format

```yaml
---
title: "FileName"
tags:
  - java/concurrency
  - thread-pools
stage: 3
status: "permanent"
type: "机制型"
summary: "一句话摘要"
related:
  - ConceptA
  - ConceptB
---
```

## Article Types

| Type | Words | Interview Qs | Source Code |
|------|-------|--------------|-------------|
| 地图型 | 1500-2500 | 5-6 | 0-1 snippets |
| 机制型 | 3000-5000 | 6-10 | 1-2 snippets |
| 工具型 | 2000-3500 | 4-6 | optional |
| 框架型 | 2500-4000 | 5-8 | entry class |

## Naming Conventions

- File names: English Kebab-case (e.g., `Garbage-Collection.md`)
- No Chinese characters, spaces, or full-width symbols in file names
- Title in frontmatter matches file name (without .md)

## Pass Criteria

- Composite score ≥ 8.0
- No single dimension below 6.0
- Depth adaptability ≥ 7.0
- Boundary clarity ≥ 7.0