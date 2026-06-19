---
phase: 第四阶段：实用工具与开发进阶
type: 工具型
summary: Git 基本操作与 GitFlow 协作流程。
related:
  - 协作开发
  - 代码仓库（GitHub/GitLab）
  - 构建工具
---

# 版本控制（Git）

> Git 基本操作与 GitFlow 协作流程。

本文介绍 Git 核心命令与团队协作工作流。与 Java 构建结合见构建工具、CI 专题。

---

## 概念定义

**Git** 是分布式版本控制系统：每个克隆都是完整仓库，提交形成有向无环图（DAG），分支为指针移动。

核心对象：blob（文件）、tree（目录）、commit（快照）、tag。

---

## 核心原理

### 1. 基本操作

```bash
git clone <url>
git status
git add .
git commit -m "feat: message"
git push origin main
git pull
```

### 2. 分支与合并

```bash
git branch feature/login
git checkout feature/login   # 或 git switch
git merge feature/login
git rebase main              # 变基，整理历史
```

### 3. 远程

`origin` 默认远程名；`fetch` 拉取不合并，`pull` = fetch + merge。

### 4. GitFlow（概述）

| 分支 | 用途 |
|------|------|
| `main` | 生产就绪 |
| `develop` | 集成分支 |
| `feature/*` | 功能开发 |
| `release/*` | 发布准备 |
| `hotfix/*` | 紧急修复 |

现代团队也常用 **GitHub Flow**（main + feature + PR）或 **Trunk Based**。

### 5. 冲突解决

合并冲突须手动编辑标记区后 `add` 再 `commit`。

---

## 实际应用

```bash
# 查看历史
git log --oneline --graph

# 暂存工作区
git stash pop

# 回退（谨慎）
git revert <commit>   # 安全，新提交
git reset --hard      # 危险，丢历史
```

配合 Conventional Commits：`feat:`、`fix:`、`chore:` 便于生成 CHANGELOG。

---

## 源码分析

Git 非 Java 实现，但 Java 项目通过 JGit、EGit（IDEA 内置）操作仓库。`.git` 目录存对象与引用。

---

## 面试常见题目

**1. git merge 和 rebase？**

merge 保留分支图；rebase 线性历史，改写提交哈希。

**2. HEAD 是什么？**

当前分支指针。

**3. 如何撤销提交？**

未 push：`reset`；已 push：`revert`。

**4. cherry-pick？**

挑选某提交应用到当前分支。

**5. `.gitignore` 作用？**

忽略构建产物、IDE 配置等不纳入版本库。

---

## 思维发散

1. Monorepo 与多仓库的协作成本。
2. Signed commits 与供应链安全。
3. Git LFS 管理大二进制文件。

---

## 相关概念（待扩展）

- 协作开发 — Code Review 与 PR
- 代码仓库（GitHub/GitLab）— 托管平台
- 构建工具 — CI 触发构建
