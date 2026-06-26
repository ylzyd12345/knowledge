---
title: "MyBatis"
tags: [java/frameworks, mybatis, orm]
stage: 5
status: "permanent"
type: "框架型"
summary: "MyBatis"
related: []
---

---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: SQL 映射、动态 SQL 与 Mapper 接口。
related:
  - JDBC
  - ORM框架
  - Spring Data JPA
---

# MyBatis

> SQL 映射、动态 SQL 与 Mapper 接口。

本文介绍 MyBatis 的 SQL 映射与 Spring 集成。与 JPA 对比选型见 Spring Data JPA 专题。

---

## 概念定义

**MyBatis** 是半自动 ORM：开发者编写 SQL，框架完成参数绑定与结果映射，比全自动 ORM 更可控，适合复杂 SQL 与性能调优场景。

核心：`SqlSession`、`Mapper` 接口、`XML` 或注解 SQL。

---

## 核心原理

### 1. Mapper 接口

```java
public interface UserMapper {
    User selectById(@Param("id") Long id);
    int insert(User user);
}
```

### 2. XML 映射

```xml
<select id="selectById" resultType="User">
  SELECT * FROM user WHERE id = #{id}
</select>
```

### 3. 动态 SQL

`<if>`、`<choose>`、`<foreach>` 拼接条件，避免字符串拼接 SQL。

### 4. 一级与二级缓存

`SqlSession` 一级缓存默认开启；二级缓存跨 Session，须谨慎（分布式下常用 Redis 替代）。

### 5. Spring 集成

`@MapperScan` + `mybatis-spring-boot-starter`，Mapper 注册为 Bean。

---

## 实际应用

```xml
<select id="search" resultType="User">
  SELECT * FROM user
  <where>
    <if test="name != null">AND name LIKE #{name}</if>
    <if test="status != null">AND status = #{status}</if>
  </where>
</select>
```

```java
List<User> users = userMapper.search(params);
```

---

## 源码分析

`MapperProxy` 动态代理拦截接口方法，根据方法名与 namespace 定位 `MappedStatement`，经 `Executor` 执行 SQL。

---

## 面试常见题目

**1. MyBatis 和 Hibernate？**

MyBatis SQL 可控；Hibernate 对象状态与自动生成 SQL。

**2. `#{}` 和 `${}`？**

`#{}` 预编译防注入；`${}` 字符串替换（用于表名等须严格校验）。

**3. 如何防止 SQL 注入？**

使用 `#{}` 与 PreparedStatement。

**4. 一级二级缓存？**

见上；更新操作清空缓存。

**5. PageHelper 分页原理？**

拦截器改写 SQL 加 `LIMIT`。

---

## 思维发散

1. MyBatis-Plus 通用 CRUD 增强。
2. 多租户 `tenant_id` 拦截器。
3. 读写分离与动态数据源。

---

## 相关概念（待扩展）

- JDBC — SQL 执行基础
- ORM框架 — 对象关系映射
- Spring Data JPA — 另一数据访问风格
