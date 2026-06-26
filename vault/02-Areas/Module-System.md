---
title: "Module-System"
tags: [java/advanced, modules]
stage: 3
status: "permanent"
type: "机制型"
summary: "Module System"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: Java 9+ 模块化定义与依赖管理。
related:
  - 包（package）
  - JDK9+新特性
  - Java概述
---

# Java模块化系统

> Java 9+ 模块化定义与依赖管理。

本文介绍 JPMS（Java Platform Module System）。包（package）是逻辑分组；模块是更强封装与依赖边界。

---

## 概念定义

**模块（Module）** 由 `module-info.java` 描述，显式声明：

- `exports`：哪些包对外可见
- `requires`：依赖哪些模块
- `opens`：允许反射访问（Spring 需要）

未 export 的包对其他模块不可访问，即使 public 类也不行。

---

## 核心原理

### 1. module-info.java 示例

```java
module com.example.app {
    requires java.sql;
    requires com.example.core;
    exports com.example.api;
    opens com.example.internal to spring.core;
}
```

### 2. 模块路径 vs 类路径

- **模块路径（module path）**：模块化解耦，强封装
- **类路径（classpath）**：传统未命名模块（unnamed module），所有包默认可访问

### 3. 自动模块

无 `module-info` 的 JAR 在模块路径上成为**自动模块**，导出名基于 JAR 名，可读所有模块。

### 4. 与 OSGi 对比

JPMS 是 JVM 层模块化，启动时静态解析；OSGi 更动态，生态不同。

---

## 实际应用

```bash
java --module-path libs --module com.example.app/com.example.Main
```

Spring Boot 2.x+ 对模块系统支持逐步完善；许多库仍以 classpath 运行。迁移须检查 split package、反射 opens。

---

## 源码分析

`Module` 类（`java.lang.Module`）表示运行时模块；`ModuleLayer` 支持分层加载。`ClassLoader` 与模块层配合实现可见性检查。

---

## 面试常见题目

**1. 模块解决了什么问题？**

强封装、显式依赖、避免 JDK 内部 API 滥用（JEP 260）。

**2. exports 和 opens？**

exports 编译+运行可见；opens 运行期反射。

**3. 模块与 package 关系？**

模块包含多个包；export 以包为单位。

**4. 未命名模块？**

classpath 上传统 JAR，可读所有模块导出的包。

**5. 如何迁移到模块？**

逐步添加 module-info、处理 split package、`--add-opens` 临时兼容。

---

## 思维发散

1. jlink 定制运行时镜像缩小部署体积。
2. 模块系统与微服务边界设计的类比。
3. Gradle/Maven 对 module-path 的构建支持。

---

## 相关概念（待扩展）

- 包（package）— 逻辑命名空间
- JDK9+新特性 — 版本演进
- Java概述 — 平台组成
