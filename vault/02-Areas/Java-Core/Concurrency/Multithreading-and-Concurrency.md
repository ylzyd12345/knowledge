---
title: "Multithreading-and-Concurrency"
tags: [java/concurrency, multithreading]
stage: 3
status: "permanent"
type: "机制型"
summary: "Multithreading and Concurrency"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 线程创建、同步机制及线程状态管理。
related:
  - 线程池
  - 死锁
  - 并发容器
  - JMM（Java内存模型）
  - 并发编程深入
---

# 多线程与并发

> 线程创建、同步机制及线程状态管理。

本文讲解 Java 线程基础与常用同步手段。线程池、AQS、JMM 细节见线程池、并发编程深入、JVM 内存模型专题。

---

## 概念定义

**线程**是 CPU 调度的基本单位，同一进程内多线程共享堆内存与方法区，各自拥有虚拟机栈与程序计数器。

**并发**：多任务交替执行；**并行**：多核同时执行。Java 通过 `Thread`、`Runnable`、`Callable` 创建任务。

---

## 核心原理

### 1. 线程创建

```java
new Thread(() -> System.out.println("run")).start();
executor.submit(() -> "result");  // Callable + Future
```

### 2. 线程状态

`NEW` → `RUNNABLE` → `BLOCKED`/`WAITING`/`TIMED_WAITING` → `TERMINATED`

`sleep` 不释放锁；`wait` 释放锁（须在同步块内）。

### 3. synchronized

互斥锁，可修饰方法或块；锁对象为 monitor。可重入、非公平（JDK 6+ 优化偏向/轻量级锁）。

### 4. Lock 接口

`ReentrantLock`：显式 `lock()`/`unlock()`，可中断、可超时、公平锁可选。

### 5. volatile

保证可见性与禁止指令重排（部分场景），不保证复合操作原子性（如 `i++`）。

### 6. 原子类

`AtomicInteger`、`AtomicLong` 等，基于 CAS 无锁更新。

### 7. 死锁

两线程互相等待对方持有的锁；避免：固定加锁顺序、超时 `tryLock`、死锁检测。

---

## 实际应用

```java
private final Object lock = new Object();
private int count = 0;

void increment() {
    synchronized (lock) {
        count++;
    }
}

// 或
private final AtomicInteger atomic = new AtomicInteger();
atomic.incrementAndGet();

// 可见性
private volatile boolean running = true;
```

---

## 源码分析

`synchronized` 字节码体现为 `monitorenter`/`monitorexit`。对象头 Mark Word 存储锁状态（无锁、偏向、轻量、重量）。

`Object.wait/notify` 依赖 monitor，与 `synchronized` 配合使用。

---

## 面试常见题目

**1. 创建线程的方式？**

继承 Thread、实现 Runnable、Callable+Future、线程池。

**2. sleep 和 wait 区别？**

sleep 属 Thread，不释放锁；wait 属 Object，释放锁，须唤醒。

**3. synchronized 与 Lock？**

前者自动释放、JVM 优化；后者功能丰富、须手动 unlock。

**4. volatile 能保证原子性吗？**

不能，`i++` 仍须 synchronized 或原子类。

**5. 什么是死锁？如何避免？**

互相等待；顺序加锁、超时、银行家算法（理论）。

**6. 线程安全三个特性？**

原子性、可见性、有序性（JMM 专题）。

---

## 思维发散

1. 协程、虚拟线程与平台线程的差异（Java 21）。
2. 乐观锁 CAS 与 ABA 问题。
3. 并发与分布式锁的边界。

---

## 相关概念（待扩展）

- 线程池 — 任务调度
- 死锁 — 锁顺序与检测
- 并发容器 — 线程安全集合
- JMM（Java内存模型）— 可见性与有序性
- 并发编程深入 — AQS 与锁优化
