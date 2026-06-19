---
phase: 第一阶段：Java 基础入门
type: 地图型
summary: Java 的历史、JVM 原理与开发环境介绍。
related:
  - JVM
  - JDK与JRE
  - 基本语法
  - 面向对象编程（OOP）
  - JVM内存模型
  - 垃圾回收（GC）
  - 构建工具
---

# Java概述

> Java 的历史、JVM 原理与开发环境介绍。

本文建立 Java 全景地图，帮助读者回答「Java 是什么、从哪来、怎么跑起来、接下来学什么」。类加载细节、内存分区、GC 算法、框架原理等机制性内容，见各专题文章。

---

## 概念定义

**Java** 通常指三个层面的组合：**编程语言**、**运行时平台**（以 JVM 为核心）、以及围绕其形成的**开发生态**（类库、框架、构建工具、中间件等）。开发者编写符合 Java 语法的源码，编译为字节码，再由 JVM 在目标操作系统上执行，从而实现跨平台部署。

### 核心特性（概述级）

| 特性 | 简要说明 |
|------|----------|
| 面向对象 | 以类与对象组织代码，支持封装、继承、多态 |
| 跨平台 | 字节码与平台无关，依赖各操作系统上的 JVM 实现 |
| 自动内存管理 | 堆内存由垃圾回收器自动回收，开发者无需手动释放 |
| 强类型 | 编译期进行类型检查，减少运行时类型错误 |
| 多线程 | 语言与 JVM 内置线程支持，便于并发编程 |
| 健壮性与安全性 | 无指针算术、数组边界检查、字节码验证等机制 |

### Java 平台组成

- **Java SE（Standard Edition）**：标准版，包含语言、核心类库与 JVM，是后端开发的主线。
- **Java EE / Jakarta EE**：企业版，曾提供 Servlet、JPA 等规范；现今大量企业能力由 Spring 等生态承载，规范本身已迁移至 Eclipse Jakarta 命名空间。
- **Java ME（Micro Edition）**：面向嵌入式与功能机；移动端开发现主要由 Android（Kotlin/Java）主导，ME 在主流业务中已较少使用。

### JDK、JRE、JVM 的关系

```
JDK（开发工具包）
├── JRE（运行环境）
│   ├── JVM（虚拟机，执行字节码）
│   └── 核心类库（java.lang、java.util 等）
└── 开发工具（javac、javadoc、jar、jdb 等）
```

- **JVM**：加载并执行字节码，提供内存管理与线程调度等运行时服务。
- **JRE**：JVM + 核心类库，足以**运行**已编译程序。Oracle JDK 9 之后不再单独发布 JRE，通常随 JDK 一并安装。
- **JDK**：JRE + 开发工具，**开发** Java 程序所必需。

---

## 核心原理

### 1. Java 发展简史

| 时间 | 事件 |
|------|------|
| 1991～1995 | James Gosling 团队在 Sun 启动 Oak 项目，1995 年正式发布 Java 1.0 |
| 2006 | Sun 将 Java 核心开源，形成 OpenJDK 社区 |
| 2010 | Oracle 收购 Sun，Java 归属 Oracle |
| 2017 起 | 每 6 个月发布一个功能版本，部分版本标记为 LTS（长期支持） |

**LTS 版本定位**（特性细节见「Java 新特性」类专题）：

- **Java 8**：Lambda、Stream API 普及，长期是企业存量系统的主流基线。
- **Java 11**：模块化时代后的常用 LTS，许多云厂商以此作为运行时默认选项。
- **Java 17**：现代 LTS，引入 Records、密封类等语言增强。
- **Java 21**：当前新一代 LTS，虚拟线程等特性进一步简化高并发编程。

Java 在企业后端、大数据（Hadoop、Spark）、消息与搜索中间件（Kafka、Elasticsearch）等领域保持主导地位，生态成熟度是其核心竞争力之一。

### 2. 从源码到运行

```
源代码 (.java)
    │  javac 编译
    ▼
字节码 (.class)
    │  类加载器载入 JVM
    ▼
解释执行 / JIT 编译为本地机器码
    ▼
在操作系统上运行
```

**跨平台原理**：不同操作系统提供各自的 JVM 实现（Windows、Linux、macOS 等），但字节码格式统一。应用只需编译一次，即可在安装了对应 JVM 的机器上运行——即「Write Once, Run Anywhere」。

**混合执行模型**（概念级）：

- **解释执行**：启动快，逐条解释字节码，适合冷代码。
- **JIT（Just-In-Time）编译**：对反复执行的热点代码编译为本地机器码，提升长期运行性能。

本篇不展开类加载阶段、JIT 触发阈值等机制细节。

### 3. JVM 在本篇中的角色

JVM 是 Java 跨平台与运行时的核心，主要职责包括：

- 加载并验证字节码
- 管理堆、栈等运行时内存（分区细节见 JVM 内存模型专题）
- 调度垃圾回收，自动管理对象生命周期（算法与收集器见垃圾回收专题）
- 提供线程与同步等底层运行时支持

学习路径上，在掌握语法与面向对象之后，再系统学习 JVM 内存模型、垃圾回收与性能调优，能更高效地排查生产问题。

---

## 实际应用

### 典型应用领域

- **企业级后端与微服务**：金融、电商、物流等核心业务系统普遍采用 Java + Spring 生态。
- **大数据与流处理**：Hadoop、Spark、Flink 等核心组件以 Java/Scala 实现，Java 是数据平台的重要语言。
- **中间件与基础设施**：Kafka、Elasticsearch、Netty 等高性能组件由 Java 编写。
- **移动端**：Android 早期以 Java 为主，现阶段 Kotlin 已成为官方首选，Java 仍广泛存在于存量代码中。

### 开发环境搭建

**JDK 版本选择**

- 生产环境优先选用 **LTS 版本**（当前常用：11、17、21）。
- 与团队、CI 流水线、云厂商运行时镜像保持一致，避免「本地能跑、线上报错」的版本漂移。

**安装与验证**

```bash
java -version
javac -version
```

两条命令应显示同一 JDK 版本；若 `javac` 找不到，说明只配置了 JRE 或未正确设置开发环境。

**环境变量**

| 变量 | 作用 |
|------|------|
| `JAVA_HOME` | 指向 JDK 安装根目录，供 Maven、Gradle、IDE 引用 |
| `PATH` | 追加 `%JAVA_HOME%\bin`（Windows）或 `$JAVA_HOME/bin`（macOS/Linux），使 `java`、`javac` 全局可用 |

**开发工具**

- **IntelliJ IDEA**：Java 后端开发的主流 IDE，集成调试、重构、Maven/Gradle 支持。
- **VS Code + Extension Pack for Java**：轻量备选，适合多语言项目或简单脚本。

**构建工具**：实际项目很少只用 `javac` 手动编译，通常通过 Maven 或 Gradle 管理依赖与构建生命周期（详见构建工具专题）。

### 最小可运行示例

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Java 版本: " + System.getProperty("java.version"));
        System.out.println("JVM 名称: " + System.getProperty("java.vm.name"));
    }
}
```

```bash
javac HelloWorld.java
java HelloWorld
```

第二、三行输出可用于确认当前运行时 JDK 与 JVM 信息，排查环境配置问题。

---

## 源码分析

### `java.lang.Object`——所有类的根

除基本类型外，每个 Java 类都直接或间接继承 `Object`。JVM 在加载类时，若未显式指定父类，编译器会自动将 `extends Object` 写入字节码。

```java
// java.lang.Object（JDK 源码节选）
public class Object {
    public final native Class<?> getClass();
    public native int hashCode();
    public boolean equals(Object obj) {
        return (this == obj);
    }
    protected native Object clone() throws CloneNotSupportedException;
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
    // ...
}
```

**解读要点**：

- `getClass()`、`hashCode()` 等为 `native` 方法，由 JVM 本地实现，体现「语言层 API」与「虚拟机层能力」的分工。
- 默认 `equals` 比较引用地址；实际开发中常按业务语义重写 `equals` 与 `hashCode`（面向对象编程专题）。
- `toString()` 的默认格式为 `类名@哈希码`，调试时常重写以便可读。

本篇借此说明：Java 程序并非孤立语法，而是建立在标准类库与统一类型体系之上；启动 `main` 方法前，JVM 已完成类加载、链接与必要的初始化工作。

---

## 面试常见题目

### 基础

**1. Java 有哪些主要特性？**

面向对象、跨平台（JVM + 字节码）、自动内存管理（GC）、强类型、内置多线程支持，以及通过字节码验证等手段提升健壮性与安全性。企业开发还受益于成熟的类库与框架生态。

**2. JDK、JRE、JVM 的区别与关系？**

JVM 执行字节码；JRE = JVM + 核心类库，用于运行程序；JDK = JRE + 开发工具（javac 等），用于开发。关系上 JDK 包含 JRE，JRE 包含 JVM。JDK 9 之后 Oracle 通常只分发 JDK，不再单独提供 JRE 安装包。

**3. Java 如何实现跨平台？**

源码编译为与平台无关的字节码，各操作系统安装对应的 JVM 实现来解释或 JIT 编译执行该字节码，从而屏蔽底层硬件与 OS 差异。

**4. 从 `.java` 到程序运行经历了哪些步骤？**

编写源码 → `javac` 编译为 `.class` 字节码 → JVM 通过类加载器加载类 → 解释执行或 JIT 编译 → 执行 `main` 等入口方法。

**5. `main` 方法为什么必须是 `public static void`？**

`public`：JVM 从外部调用入口，需对外可见；`static`：启动时尚未创建对象，须通过类名直接调用；`void`：入口方法无返回值约定；`String[] args`：接收命令行参数。

### 进阶

**6. Java 是编译型还是解释型语言？**

严格说是**混合模式**：源码先由编译器生成字节码（编译阶段）；字节码由 JVM 解释执行，热点代码再由 JIT 编译为本地机器码（运行阶段）。因此既不像 C 直接编译为机器码，也不像纯脚本语言逐行解释源码。

---

## 思维发散

1. **为何选择字节码而非直接编译为各平台机器码？** 直接编译能获得更高单平台性能，但需为每个 OS/CPU 维护独立产物；字节码 + JVM 以一层抽象换取部署一致性，JIT 则在运行期弥补部分性能损失。这是跨平台与性能之间的工程权衡。

2. **团队选型 LTS 时除语言特性还应考虑什么？** 供应商支持周期、现有依赖与框架的最低 JDK 要求、CI/CD 与容器基础镜像、监控与诊断工具兼容性、以及团队成员技能与培训成本。

3. **「学 Java」的合理顺序是什么？** 基本语法 → 面向对象 → 核心 API（集合、异常、IO）→ 多线程与并发 → JVM 与调优 → 框架与工程化（Spring、构建工具、数据库）。先能写正确代码，再理解运行时与架构，避免过早陷入框架配置而忽视语言与 JVM 基础。

**建议后续阅读顺序**（纯文本，待各专题完成后可建立链接）：基本语法 → 面向对象编程（OOP）→ 数组与方法 → 集合框架与异常处理 → IO 流与多线程 → JVM 内存模型与垃圾回收 → 构建工具 → Spring 生态。

---

## 相关概念（待扩展）

- JVM — 执行字节码的虚拟机，跨平台核心
- JDK与JRE — 开发与运行环境的组成与区别
- 基本语法 — 变量、类型、运算符与流程控制
- 面向对象编程（OOP）— 类、对象、封装、继承、多态
- JVM内存模型 — 堆、栈、方法区等运行时数据区域
- 垃圾回收（GC）— 自动内存管理与收集器
- 构建工具 — Maven、Gradle 依赖管理与项目构建
