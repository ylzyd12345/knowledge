---
title: "JDBC"
tags: [java/frameworks, database, jdbc]
stage: 4
status: "permanent"
type: "工具型"
summary: "JDBC"
related: []
---

---
phase: 第四阶段：实用工具与开发进阶
type: 工具型
summary: 数据库连接、SQL 执行、事务与连接池。
related:
  - 事务（ACID）
  - SQL
  - ORM框架
  - Spring Data JPA
---

# JDBC

> 数据库连接、SQL 执行、事务与连接池。

本文介绍 JDBC 标准 API 与连接池实践。ORM 见 Spring Data JPA、MyBatis 专题。

---

## 概念定义

**JDBC（Java Database Connectivity）** 是 Java 访问关系型数据库的标准 API。驱动由厂商提供（MySQL Connector、PostgreSQL JDBC 等）。

核心接口：`Connection`、`Statement`、`PreparedStatement`、`ResultSet`。

---

## 核心原理

### 1. 连接

```java
Connection conn = DriverManager.getConnection(url, user, password);
```

生产使用**连接池**（HikariCP）：复用连接，控制最大连接数。

### 2. Statement vs PreparedStatement

`PreparedStatement` 预编译 SQL，防注入，参数 `setXxx`。

### 3. ResultSet

游标遍历结果；`TYPE_FORWARD_ONLY` 默认仅向前。

### 4. 事务

```java
conn.setAutoCommit(false);
try {
    // multiple updates
    conn.commit();
} catch (Exception e) {
    conn.rollback();
}
```

### 5. HikariCP 配置

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=30000
```

---

## 实际应用

```java
String sql = "SELECT id, name FROM user WHERE id = ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setLong(1, userId);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            return new User(rs.getLong("id"), rs.getString("name"));
        }
    }
}
```

---

## 源码分析

`DriverManager` 加载注册驱动；SPI `META-INF/services/java.sql.Driver`。HikariCP 用 ConcurrentBag 管理连接，borrow/return 低开销。

---

## 面试常见题目

**1. Statement 和 PreparedStatement？**

后者预编译、防 SQL 注入、性能更好（重复执行）。

**2. 连接池作用？**

复用连接、限流、监控、快速失败。

**3. 事务 ACID？**

原子性、一致性、隔离性、持久性。

**4. 如何处理大结果集？**

`setFetchSize`、流式 ResultSet、分页查询。

**5. JDBC 与 ORM 区别？**

JDBC 手写 SQL；ORM 对象映射与缓存。

---

## 思维发散

1. 读写分离与 JDBC 路由（ShardingSphere）。
2. R2DBC 响应式数据库访问。
3. 连接泄漏排查：池活跃连接数监控。

---

## 相关概念（待扩展）

- 事务（ACID）— 事务隔离级别
- SQL — 查询与优化
- ORM框架 — JPA/Hibernate
- Spring Data JPA — Repository 抽象
