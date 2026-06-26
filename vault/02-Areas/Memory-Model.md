---
title: "Memory-Model"
tags: [java/jvm, memory-model]
stage: 3
status: "permanent"
type: "机制型"
summary: "Memory Model"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 堆、栈、方法区等运行时数据区域划分。
related:
  - 垃圾回收（GC）
  - 内存溢出与泄漏
  - Java概述
---

# JVM内存模型

> 堆、栈、方法区等运行时数据区域划分。

本文讲解 JVM 运行时数据区域划分。GC 算法与调优见垃圾回收、JVM 性能调优专题；JMM 并发语义见多线程与并发专题。

---

## 概念定义

**JVM 内存模型（运行时数据区）** 描述 JVM 管理的内存布局，与并发 JMM 不同。主要区域：

| 区域 | 线程共享 | 说明 |
|------|----------|------|
| 堆（Heap） | 是 | 对象实例、数组 |
| 方法区 / 元空间 | 是 | 类元数据、常量、静态变量 |
| 虚拟机栈 | 否 | 局部变量、栈帧 |
| 本地方法栈 | 否 | Native 方法 |
| 程序计数器 | 否 | 当前字节码行号 |
| 直接内存 | — | NIO DirectBuffer，堆外 |

---

## 核心原理

### 1. 堆

年轻代（Eden + Survivor）+ 老年代。`-Xms`、`-Xmx` 设置大小。OOM：`Java heap space`。

### 2. 方法区与元空间

Java 8 前永久代；之后**元空间**使用本地内存。存储类信息、运行时常量池、静态字段。OOM：`Metaspace`。

### 3. 虚拟机栈

每个方法对应栈帧：局部变量表、操作数栈、动态链接、返回地址。递归过深 `StackOverflowError`；扩展失败 OOM。

### 4. 对象创建

`new` → 类加载检查 → 堆分配（指针碰撞/空闲列表）→ 初始化。

### 5. 直接内存

`ByteBuffer.allocateDirect` 减少拷贝，受 `-XX:MaxDirectMemorySize` 限制。

---

## 实际应用

```bash
java -Xms512m -Xmx2g -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -jar app.jar
```

排查 OOM：堆 dump（`-XX:+HeapDumpOnOutOfMemoryError`）、MAT 分析 dominator tree。

---

## 源码分析

HotSpot 中 `oop`（Ordinary Object Pointer）表示对象，对象头含 Mark Word（哈希、锁、GC 年龄）与类型指针（压缩指针 `-XX:+UseCompressedOops` 时 32 位）。

---

## 面试常见题目

**1. JVM 内存结构？**

见上表。

**2. 堆和栈存什么？**

堆：对象；栈：局部变量与引用（引用本身在栈，对象在堆）。

**3. 方法区存什么？**

类元数据、常量、静态变量；JDK8 为元空间。

**4. 强引用、软引用、弱引用、虚引用？**

与 GC 相关，见垃圾回收专题。

**5. StackOverflowError 和 OOM？**

前者栈帧过多；后者无法分配堆/元空间/直接内存。

**6. 对象一定在堆上吗？**

默认是；逃逸分析后可能栈上分配或标量替换（JIT）。

---

## 思维发散

1. JVM 内存模型 vs JMM（Java Memory Model）名称辨析。
2. 容器化环境下 JVM 内存与 cgroup 限制。
3. 大页内存（Huge Pages）对堆的影响。

---

## 相关概念（待扩展）

- 垃圾回收（GC）— 堆回收
- 内存溢出与泄漏 — OOM 排查
- Java概述 — JVM 角色
