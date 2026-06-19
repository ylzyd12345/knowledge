---
phase: 第六阶段：性能与架构
type: 机制型
summary: 内存分析工具与 GC 调优参数实践。
related:
  - JVM内存模型
  - 垃圾回收（GC）
  - 高并发与缓存
---

# JVM性能调优

> 内存分析工具与 GC 调优参数实践。

本文介绍 JVM 调优工具与常用参数。内存区域与 GC 算法见 JVM 内存模型、垃圾回收专题。

---

## 概念定义

**JVM 性能调优**在正确架构与代码基础上，通过监控、分析、参数调整降低延迟、提高吞吐、避免 OOM。调优须**测量驱动**，避免盲目调参。

---

## 核心原理

### 1. 常用工具

| 工具 | 用途 |
|------|------|
| `jps` | 列出 Java 进程 |
| `jstat` | GC、类加载统计 |
| `jmap` | 堆 dump、堆概要 |
| `jstack` | 线程栈，死锁检测 |
| `jcmd` | 综合诊断命令 |
| MAT / VisualVM | 堆分析、 dominator tree |
| Arthas | 在线诊断（阿里开源） |

### 2. GC 日志

```bash
-Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=20m
```

分析停顿时间、吞吐、晋升失败、Full GC 频率。

### 3. 常用参数

| 参数 | 说明 |
|------|------|
| `-Xms` / `-Xmx` | 堆初始/最大（常设相等避免扩容） |
| `-XX:MetaspaceSize` | 元空间 |
| `-XX:+UseG1GC` | G1 收集器 |
| `-XX:MaxGCPauseMillis` | G1 停顿目标 |
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 自动 dump |

### 4. 调优思路

1. 明确目标（延迟 vs 吞吐）
2. 监控基线（CPU、堆、GC、线程）
3. 定位瓶颈（慢 SQL、锁、GC、泄漏）
4. 小步调整并对比

### 5. 堆 dump 分析

MAT 看 Leak Suspects、大对象、GC Roots 引用链。

---

## 实际应用

```bash
jmap -dump:live,format=b,file=heap.hprof <pid>
jstack <pid> > threads.txt
arthas-boot.jar  # thread -n 3; dashboard
```

容器环境：

```bash
java -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -jar app.jar
```

---

## 源码分析

G1 `G1CollectedHeap` 根据 `Mixed GC` 回收垃圾最多的 Region。  
JIT `CompilationPolicy` 根据调用计数触发 C2 编译。

---

## 面试常见题目

**1. 如何排查 CPU 高？**

top + jstack 看热点线程栈；Arthas `profiler`。

**2. 如何排查内存泄漏？**

对比 heap dump；找增长对象与 GC Roots 路径。

**3. 频繁 Full GC 原因？**

老年代满、元空间、显式 System.gc、大对象直接进入老年代。

**4. G1 调优关注什么？**

停顿目标、Region 大小、Mixed GC 频率、IHOP。

**5. 调优第一步？**

建立监控与压测基线，勿无指标调参。

---

## 思维发散

1. 全链路压测与生产流量回放。
2. JFR（Java Flight Recorder）低开销持续 profiling。
3. 云监控（Prometheus + Grafana）与 JVM 指标 exporter。

---

## 相关概念（待扩展）

- JVM内存模型 — 运行时区域
- 垃圾回收（GC）— 算法与收集器
- 高并发与缓存 — 应用层优化
