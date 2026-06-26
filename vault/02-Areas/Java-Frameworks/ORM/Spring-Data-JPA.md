---
title: "Spring-Data-JPA"
tags: [java/frameworks, spring-data-jpa, orm]
stage: 5
status: "permanent"
type: "框架型"
summary: "Spring Data JPA"
related: []
---

---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: ORM 映射、Repository 接口与查询方法。
related:
  - JDBC
  - Hibernate
  - 事务管理
  - MyBatis
---

# Spring Data JPA

> ORM 映射、Repository 接口与查询方法。

本文介绍 Spring Data JPA 与 JPA 实体映射。底层 Hibernate 细节与 MyBatis 对比见相关专题。

---

## 概念定义

**Spring Data JPA** 在 JPA（Java Persistence API）之上提供 Repository 抽象，通过接口 + 方法名或 `@Query` 完成 CRUD 与查询，减少样板代码。

**JPA** 是 ORM 规范；**Hibernate** 是最常用实现。

---

## 核心原理

### 1. 实体映射

```java
@Entity
@Table(name = "user")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToMany(mappedBy = "user") private List<Order> orders;
}
```

### 2. Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    @Query("select u from User u where u.status = ?1")
    List<User> findActive(int status);
}
```

### 3. 方法命名查询

`findBy`、`And`、`Or`、`Between`、`OrderBy` 等解析为 JPQL。

### 4. 事务

`@Transactional` 默认在 Service 层；只读事务 `readOnly = true` 优化查询。

### 5. 级联与懒加载

`CascadeType`、`fetch = LAZY/EAGER`；注意 N+1 问题与 `@EntityGraph`、`join fetch`。

---

## 实际应用

```java
@Service
public class UserService {
    private final UserRepository repo;
    @Transactional
    public User create(String email) {
        return repo.save(new User(email));
    }
}
```

分页：`Page<User> page = repo.findAll(PageRequest.of(0, 20));`

---

## 源码分析

`SimpleJpaRepository` 实现 CRUD；`JpaRepositoryFactory` 为接口生成代理。  
查询方法由 `PartTreeJpaQuery` 解析方法名生成查询。

---

## 面试常见题目

**1. JPA 和 Hibernate？**

JPA 规范，Hibernate 实现。

**2. N+1 问题？**

懒加载关联在循环中触发多次查询；用 fetch join 或 batch size。

**3. `persist` 和 `merge`？**

persist 新实体；merge  detached 实体状态合并。

**4. JPA 和 MyBatis？**

JPA ORM 对象导向；MyBatis SQL 可控。

**5. 乐观锁？**

`@Version` 字段 CAS 更新。

---

## 思维发散

1. 多数据源与 `@Transactional` 路由。
2. 事件发布 `@DomainEvents` 与审计 `@CreatedDate`。
3. Schema 迁移 Flyway/Liquibase 与 ddl-auto。

---

## 相关概念（待扩展）

- JDBC — 底层连接
- Hibernate — JPA 实现
- 事务管理 — 声明式事务
- MyBatis — SQL 映射替代方案
