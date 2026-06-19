---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 流式操作集合数据，支持并行处理。
related:
  - Lambda表达式与函数式接口
  - 集合框架
  - 多线程与并发
---

# Stream API

> 流式操作集合数据，支持并行处理。

本文讲解 Stream 的中间与终端操作及并行流注意点。集合来源见集合框架；Lambda 语法见 Lambda 表达式专题。

---

## 概念定义

**Stream** 是对数据源（集合、数组、IO）的**声明式、可管道化**操作序列，不存储数据，操作分为：

- **中间操作**：`filter`、`map`、`sorted` — 惰性，返回新 Stream
- **终端操作**：`collect`、`reduce`、`forEach` — 触发执行

---

## 核心原理

### 1. 创建

```java
list.stream();
Arrays.stream(arr);
Stream.of(1, 2, 3);
IntStream.range(0, 10);
```

### 2. 常用操作

| 操作 | 类型 | 说明 |
|------|------|------|
| `filter` | 中间 | 过滤 |
| `map` | 中间 | 映射 |
| `flatMap` | 中间 | 展平 |
| `distinct` | 中间 | 去重 |
| `sorted` | 中间 | 排序 |
| `reduce` | 终端 | 归约 |
| `collect` | 终端 | 收集到 List/Map 等 |

### 3. Collectors

```java
list.stream().collect(Collectors.toList());
groupingBy(User::getDept);
partitioningBy(u -> u.getAge() >= 18);
```

### 4. 并行流

`parallelStream()` 利用 ForkJoinPool.commonPool()。须注意线程安全、无序、性能并非总是提升。

### 5. 惰性求值

多个中间操作合并为一次遍历（短路操作如 `findFirst` 可提前结束）。

---

## 实际应用

```java
Map<String, List<User>> byDept = users.stream()
    .filter(u -> u.isActive())
    .collect(Collectors.groupingBy(User::getDepartment));

double avg = scores.stream()
    .mapToInt(Integer::intValue)
    .average()
    .orElse(0);
```

---

## 源码分析

`Stream` 实现类 `ReferencePipeline` 链式包装 `Sink` 操作，终端操作时从源向下传播。`forEach` 触发 `evaluate` 遍历 pipeline。

---

## 面试常见题目

**1. Stream 与 Collection？**

Stream 不存数据、单次消费、支持惰性并行。

**2. 中间操作与终端操作？**

中间惰性；终端触发计算。

**3. 并行流注意事项？**

共享数据结构线程安全、避免 IO 阻塞 common pool、数据量够大才有收益。

**4. `reduce` 和 `collect`？**

reduce 归约为单个值；collect 用 Collector 灵活汇总。

**5. Stream 能重复使用吗？**

不能，消费后需重新创建。

---

## 思维发散

1. Reactive Streams（Flow API）与 Stream 的区别。
2. 并行流与专用线程池的隔离问题。
3. Stream 对 GC 的压力（中间对象）。

---

## 相关概念（待扩展）

- Lambda表达式与函数式接口 — 语法基础
- 集合框架 — 数据源
- 多线程与并发 — 并行流与 ForkJoinPool
