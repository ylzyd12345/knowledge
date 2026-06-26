---
title: "Concurrent-Collections"
tags: [java/concurrency, collections]
stage: 3
status: "permanent"
type: "机制型"
summary: "Concurrent Collections"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 线程安全的 ConcurrentHashMap 等容器。
related:
  - 集合框架
  - 线程安全
  - 多线程与并发
  - 线程池
---

# 并发容器

> 线程安全的 ConcurrentHashMap 等容器。

本文介绍 `java.util.concurrent` 中的线程安全容器。HashMap 原理见集合框架；AQS 与锁见并发编程深入专题。

---

## 概念定义

**并发容器**在多线程环境下提供安全或弱一致性的读写，避免外部全局 `synchronized` 包装集合。常用类：

| 类 | 说明 |
|----|------|
| `ConcurrentHashMap` | 分段/CAS+锁的 Map |
| `CopyOnWriteArrayList` | 写时复制 List |
| `BlockingQueue` 家族 | 阻塞队列，生产者消费者 |
| `ConcurrentLinkedQueue` | 无界非阻塞队列 |

---

## 核心原理

### 1. ConcurrentHashMap（Java 8+）

数组+链表/红黑树；锁粒度为桶头节点或 CAS 插入空桶。读大多无锁。不允许 null 键值。

### 2. CopyOnWriteArrayList

写操作复制整个数组，读无锁。适合读多写极少（监听器列表）。

### 3. BlockingQueue

`put` 队列满阻塞，`take` 队列空阻塞。  
实现：`ArrayBlockingQueue`（有界）、`LinkedBlockingQueue`、`SynchronousQueue`、`DelayQueue`。

### 4. 与 Collections.synchronizedX

后者全表锁，并发度低；并发容器细粒度锁或无锁算法。

---

## 实际应用

```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("key", 1);
map.computeIfAbsent("key", k -> 0);

BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);
queue.put(task);
Task t = queue.take();  // 线程池 worker 常用

List<Listener> listeners = new CopyOnWriteArrayList<>();
```

---

## 源码分析

`ConcurrentHashMap.put`：空桶 CAS 插入；否则 synchronized 锁住头节点再插入/树化。`sizeCtl` 控制扩容与初始化。

`CopyOnWriteArrayList.add`：`lock` 保护下复制 `array` 引用到新数组并替换 volatile 字段。

---

## 面试常见题目

**1. ConcurrentHashMap 与 HashMap？**

前者线程安全；JDK8 锁桶而非分段锁。

**2. ConcurrentHashMap 能否 null？**

不能，避免歧义。

**3. CopyOnWrite 适用场景？**

读多写少；写频繁则复制成本高。

**4. BlockingQueue 用途？**

线程池任务队列、生产者消费者解耦。

**5. fail-fast 与并发容器迭代？**

`ConcurrentHashMap` 弱一致性迭代，不抛 CME。

---

## 思维发散

1. ConcurrentHashMap 在 size 统计上的近似与精确方案。
2. 无锁队列与 Michael-Scott 队列思想。
3. Redis 分布式场景下本地缓存 Caffeine + ConcurrentHashMap。

---

## 相关概念（待扩展）

- 集合框架 — 非线程安全实现
- 线程安全 — 同步与可见性
- 多线程与并发 — 同步原语
- 线程池 — 阻塞队列
