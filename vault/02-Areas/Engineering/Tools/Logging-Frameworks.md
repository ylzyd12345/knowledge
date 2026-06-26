---
title: "Logging-Frameworks"
tags: [engineering, tools, logging]
stage: 4
status: "permanent"
type: "工具型"
summary: "Logging Frameworks"
related: []
---

---
phase: 第四阶段：实用工具与开发进阶
type: 工具型
summary: SLF4J + Logback 配置与日志级别。
related:
  - 面向切面编程（AOP）
  - 监控与运维
  - Spring Boot
---

# 日志框架

> SLF4J + Logback 配置与日志级别。

本文介绍 Java 日志门面与 Logback 配置。AOP 统一日志见 Spring AOP；集中式日志见监控运维专题。

---

## 概念定义

| 组件 | 角色 |
|------|------|
| SLF4J | 日志门面，API 统一 |
| Logback | 实现之一，Spring Boot 默认 |
| Log4j2 | 另一高性能实现 |

应用代码只依赖 SLF4J，切换实现不改业务代码。

---

## 核心原理

### 1. 日志级别

`TRACE < DEBUG < INFO < WARN < ERROR`（还有 `OFF`、`ALL`）。生产通常 INFO 或 WARN。

### 2. 使用方式

```java
private static final Logger log = LoggerFactory.getLogger(UserService.class);
log.info("user login, id={}", userId);
log.error("failed", exception);  // 异常作为最后参数
```

占位符 `{}` 避免字符串拼接；只有输出时才格式化。

### 3. Logback 配置（logback-spring.xml）

- `appender`：控制台、文件、滚动策略
- `logger`：包级别
- `root`：默认级别

### 4. MDC

`Mapped Diagnostic Context`：线程本地 map，存放 traceId，便于链路追踪。

```java
MDC.put("traceId", traceId);
// ...
MDC.clear();
```

### 5. 异步日志

`AsyncAppender` 降低业务线程 IO 阻塞（注意队列满与丢失策略）。

---

## 实际应用

```xml
<configuration>
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>
  <root level="INFO">
    <appender-ref ref="CONSOLE"/>
  </root>
</configuration>
```

Spring Boot `application.yml`：

```yaml
logging:
  level:
    com.example: DEBUG
  file:
    name: logs/app.log
```

---

## 源码分析

SLF4J `LoggerFactory.getLogger` 绑定具体实现（classpath 上第一个）。Logback `Logger` 继承 `ch.qos.logback.classic.Logger`，级别过滤在 appender 链前完成。

---

## 面试常见题目

**1. SLF4J 和 Logback 关系？**

门面 vs 实现；类似 JDBC 与驱动。

**2. 为何不用 System.out？**

级别控制、异步、滚动、格式统一、集中收集。

**3. Log4j2 和 Logback？**

Log4j2 异步与垃圾友好更好；Boot 默认 Logback 足够多数场景。

**4. 日志如何与链路追踪结合？**

MDC 注入 traceId；ELK/Loki 关联检索。

**5. 敏感信息如何打日志？**

脱敏、禁止打印密码/token、合规审计分离。

---

## 思维发散

1. 结构化日志（JSON）与日志分析平台。
2. Log4Shell 漏洞与 JNDI 注入教训。
3. 采样日志降低高 QPS 场景成本。

---

## 相关概念（待扩展）

- 面向切面编程（AOP）— 统一日志切面
- 监控与运维 — 日志聚合与告警
- Spring Boot — 默认日志配置
