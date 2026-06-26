---
title: "Exception-Handling"
tags: [java/basics, exceptions]
stage: 2
status: "permanent"
type: "地图型"
summary: "Exception Handling"
related: []
---

---
phase: 第二阶段：核心 API 与常用类
type: 机制型
summary: try-catch-finally、异常体系与自定义异常。
related:
  - 运行时异常
  - 受检异常
  - 堆栈跟踪
---

# 异常处理

> try-catch-finally、异常体系与自定义异常。

本文讲解 Java 异常机制与处理实践。JVM 对异常表的实现见 JVM 专题；Spring 全局异常处理见 Spring MVC 专题。

---

## 概念定义

**异常（Exception）** 是程序运行中打断正常流程的事件，通过 `Throwable` 子类表示。Java 异常分为：

```
Throwable
├── Error（严重错误，一般不捕获）
└── Exception
    ├── RuntimeException（运行时异常，非受检）
    └── 其他 Exception（受检异常）
```

---

## 核心原理

### 1. try-catch-finally

```java
try {
    // 可能抛异常
} catch (IOException e) {
    // 处理
} finally {
    // 几乎总是执行（除 JVM 退出）
}
```

Java 7+ `try-with-resources` 自动关闭 `AutoCloseable`：

```java
try (InputStream in = new FileInputStream(path)) {
    // use
}
```

### 2. throws 与 throw

- `throws`：方法声明可能抛出的异常。
- `throw`：主动抛出异常对象。

### 3. 受检 vs 非受检

| 类型 | 编译期 | 示例 |
|------|--------|------|
| 受检异常 | 必须处理或声明 | `IOException`、`SQLException` |
| 运行时异常 | 不强制 | `NullPointerException`、`IllegalArgumentException` |

### 4. 异常链

`e.initCause(cause)` 或构造器传入 cause，保留原始堆栈。

### 5. 自定义异常

```java
public class BusinessException extends RuntimeException {
    private final int code;
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
```

业务异常常用运行时异常，避免污染方法签名。

### 6. 堆栈跟踪

`printStackTrace()`、`getStackTrace()`；日志应记录完整堆栈，勿只打 `getMessage()`。

---

## 实际应用

```java
public User loadUser(Long id) {
    try {
        return repository.find(id);
    } catch (DataAccessException e) {
        log.error("load user failed, id={}", id, e);
        throw new BusinessException(500, "用户加载失败");
    }
}

// 不要用异常控制业务流程
// 不好：try { list.get(0); } catch ...
// 好：if (!list.isEmpty()) list.get(0);
```

---

## 源码分析

JVM 通过异常表（Exception Table）实现 try-catch：字节码记录 try 块范围与 catch 类型，异常发生时查找匹配 handler。

`RuntimeException` 与 `Error` 为非受检，编译器不强制 `throws` 检查。

---

## 面试常见题目

**1. Exception 和 Error？**

`Error` 系统级严重问题（如 OOM）；`Exception` 可预期可处理。

**2. finally 一定会执行吗？**

几乎总是；`System.exit` 或线程被 kill 时不执行；`finally` 中 return 会覆盖 try 返回值。

**3. try-with-resources 原理？**

编译器生成 finally 调用 `close()`，并处理 close 异常。

**4. 何时用受检异常？**

可恢复且调用方应处理的场景；许多现代框架倾向运行时异常 + 统一处理。

**5. 不要捕获 Exception？**

过于宽泛掩盖问题；应捕获具体类型，顶层可有兜底 handler。

**6. NPE 如何避免？**

空检查、Optional、`Objects.requireNonNull`、注解 `@NonNull`。

---

## 思维发散

1. 异常 vs 返回 Result 类型：Rust/Go 风格在 Java 中的实践。
2. 性能：异常创建有成本，勿用于正常流程。
3. 异步与异常：CompletableFuture 的异常传播。

---

## 相关概念（待扩展）

- 运行时异常 — RuntimeException 家族
- 受检异常 — 编译期检查
- 堆栈跟踪 — 调试与日志
