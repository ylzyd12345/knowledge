---
title: "Spring-Framework"
tags: [java/frameworks, spring]
stage: 5
status: "permanent"
type: "框架型"
summary: "Spring Framework"
related: []
---

---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: IoC、DI、AOP 核心容器与 Bean 生命周期。
related:
  - Spring Boot
  - 控制反转
  - 注解
  - 设计模式
---

# Spring Framework

> IoC、DI、AOP 核心容器与 Bean 生命周期。

本文介绍 Spring 核心容器与 AOP 原理。自动配置与快速启动见 Spring Boot；Web 层见 Spring MVC 专题。

---

## 概念定义

**Spring Framework** 是企业级 Java 应用的基础框架，核心包括：

- **IoC（控制反转）**：对象创建与依赖关系由容器管理
- **DI（依赖注入）**：通过构造器、setter 或字段注入依赖
- **AOP（面向切面编程）**：横切关注点（日志、事务）与业务解耦

---

## 核心原理

### 1. IoC 容器

`ApplicationContext` 是高级容器，扩展 `BeanFactory`。  
配置方式：XML、注解（`@ComponentScan`）、Java Config（`@Configuration`）。

### 2. Bean 生命周期（主要阶段）

实例化 → 属性注入 → `Aware` 回调 → 初始化前（BFPP/BeanPP）→ `@PostConstruct` / `init-method` → 初始化后 → 使用 → 销毁。

### 3. 依赖注入方式

推荐**构造器注入**（不可变、易测试）；`@Autowired` 字段注入简洁但不利测试。

### 4. AOP

基于代理：有接口 JDK 动态代理；无接口 CGLIB 子类。  
`@Transactional`、`@Cacheable` 等基于 AOP 实现。

### 5. 作用域

`singleton`（默认）、`prototype`、`request`、`session` 等。

---

## 实际应用

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
}

@Aspect
@Component
public class LogAspect {
    @Around("@annotation(Log)")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object r = pjp.proceed();
        // log duration
        return r;
    }
}
```

---

## 源码分析

`AbstractApplicationContext.refresh()` 是容器启动核心：加载配置、注册 BeanDefinition、`finishBeanFactoryInitialization` 实例化单例。

`AnnotationConfigApplicationContext` 通过 `ClassPathBeanDefinitionScanner` 扫描 `@Component`。

---

## 面试常见题目

**1. IoC 和 DI？**

IoC 控制权反转给容器；DI 是 IoC 的实现方式。

**2. Bean 生命周期？**

见上主要阶段。

**3. `@Autowired` 原理？**

AutowiredAnnotationBeanPostProcessor 在属性注入阶段解析依赖并从容器获取 Bean。

**4. AOP 实现？**

JDK 代理或 CGLIB；切面织入在方法调用链前后。

**5. 循环依赖如何解决？**

三级缓存；仅单例 setter/字段注入场景；构造器循环依赖失败。

**6. `@Component` 和 `@Bean`？**

前者类路径扫描；后者 `@Configuration` 中 `@Bean` 方法注册。

---

## 思维发散

1. Spring 与 Jakarta EE 规范的关系。
2. 轻量替代：Micronaut、Quarkus 编译期 DI。
3. 容器安全：限制 `@ComponentScan` 范围。

---

## 相关概念（待扩展）

- Spring Boot — 自动配置与启动器
- 控制反转 — IoC 思想
- 注解 — 配置元数据
- 设计模式 — 工厂、代理、模板
