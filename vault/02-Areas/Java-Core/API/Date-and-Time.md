---
title: "Date-and-Time"
tags: [java/api, date-time]
stage: 2
status: "permanent"
type: "工具型"
summary: "Date and Time"
related: []
---

---
phase: 第二阶段：核心 API 与常用类
type: 工具型
summary: 旧版 Date/Calendar 与新版日期时间 API。
related:
  - 新日期时间API
  - 时区处理
---

# 日期与时间

> 旧版 Date/Calendar 与新版日期时间 API。

本文对比旧版 `Date`/`Calendar` 与 Java 8+ `java.time` API 的用法与选型。生产环境应优先使用 `java.time`。

---

## 概念定义

| API | 包 | 状态 |
|-----|-----|------|
| `Date`、`Calendar` | `java.util` | 遗留，设计缺陷多 |
| `java.time` | `LocalDate`、`LocalTime`、`LocalDateTime`、`ZonedDateTime` 等 | 推荐 |

**原则**：无时区场景用 `Local*`；需时区用 `ZonedDateTime`；时间戳与系统交互可用 `Instant`。

---

## 核心原理

### 1. 旧 API 问题

`Date` 可变、月份从 0 开始、`Calendar` 笨重且非线程安全。

### 2. java.time 核心类

| 类 | 说明 |
|----|------|
| `LocalDate` | 日期，无时区 |
| `LocalTime` | 时间 |
| `LocalDateTime` | 日期+时间 |
| `ZonedDateTime` | 带时区 |
| `Instant` | UTC 时间戳 |
| `Duration` / `Period` | 时间间隔 |

### 3. 格式化

`DateTimeFormatter` 替代 `SimpleDateFormat`（线程安全）：

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String s = dateTime.format(fmt);
LocalDate d = LocalDate.parse("2024-01-15", fmt);
```

### 4. 时区

`ZoneId.of("Asia/Shanghai")`；`withZoneSameInstant` 转换时区。

---

## 实际应用

```java
LocalDate today = LocalDate.now();
LocalDateTime now = LocalDateTime.now();
ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));

// 计算间隔
Period p = Period.between(startDate, endDate);
Duration d = Duration.between(t1, t2);

// 与旧 API 互转（遗留系统）
Date legacy = Date.from(instant);
Instant inst = legacy.toInstant();
```

---

## 源码分析

`java.time` 由 JSR-310 实现，类大多不可变、线程安全，设计遵循清晰域模型（日期与时间分离）。`Clock` 抽象系统时钟，便于测试注入固定时间。

---

## 面试常见题目

**1. 为何不用 Date？**

可变、API 混乱、线程安全问题；`java.time` 更清晰安全。

**2. LocalDateTime 与 ZonedDateTime？**

前者无时区；后者含时区，跨区业务必须用后者或 `Instant`。

**3. SimpleDateFormat 线程安全吗？**

不安全，多线程应各自创建或使用 `DateTimeFormatter`。

**4. 如何获取时间戳？**

`Instant.now().toEpochMilli()` 或 `System.currentTimeMillis()`。

**5. 闰年与月份计算？**

`LocalDate` API 自动处理；勿手动算月份天数。

---

## 思维发散

1. 数据库 `TIMESTAMP` 与 Java 类型映射：JDBC 与 JPA 的时区策略。
2. 分布式系统为何推荐 UTC 存储、本地展示？
3. `java.time` 与 Kotlin `kotlinx.datetime` 的互操作。

---

## 相关概念（待扩展）

- 新日期时间API — java.time 详解
- 时区处理 — ZoneId 与夏令时
