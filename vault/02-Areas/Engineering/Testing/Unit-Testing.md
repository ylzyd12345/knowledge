---
title: "Unit-Testing"
tags: [engineering, testing, unit-testing]
stage: 4
status: "permanent"
type: "工具型"
summary: "Unit Testing"
related: []
---

---
phase: 第四阶段：实用工具与开发进阶
type: 工具型
summary: JUnit 5 测试框架与 Mockito 模拟。
related:
  - 测试驱动开发（TDD）
  - 依赖注入
  - Spring Framework
---

# 单元测试

> JUnit 5 测试框架与 Mockito 模拟。

本文介绍 JUnit 5 与 Mockito 在 Java 项目中的单元测试实践。集成测试与 CI 见构建工具、DevOps 专题。

---

## 概念定义

**单元测试**验证最小可测单元（通常一个方法或类）在隔离环境下的行为。JUnit 5 架构：JUnit Platform + Jupiter（API）+ Vintage（JUnit4 兼容）。

**Mockito** 创建 mock 对象，隔离外部依赖（数据库、HTTP、其他服务）。

---

## 核心原理

### 1. JUnit 5 注解

| 注解 | 作用 |
|------|------|
| `@Test` | 测试方法 |
| `@BeforeEach` / `@AfterEach` | 每测试前后 |
| `@BeforeAll` / `@AfterAll` | 类级，静态 |
| `@ParameterizedTest` | 参数化 |
| `@DisplayName` | 显示名称 |

### 2. 断言

```java
assertEquals(expected, actual);
assertThrows(IllegalArgumentException.class, () -> service.invalid());
assertAll(() -> assertTrue(a), () -> assertFalse(b));
```

### 3. Mockito

```java
@Mock UserRepository repo;
@InjectMocks UserService service;

when(repo.find(1L)).thenReturn(user);
verify(repo).find(1L);
```

### 4. 测试金字塔

大量单元测试 + 适量集成测试 + 少量 E2E。

---

## 实际应用

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock PaymentGateway gateway;
    @InjectMocks OrderService orderService;

    @Test
    void shouldPayWhenOrderValid() {
        when(gateway.charge(any())).thenReturn(true);
        assertTrue(orderService.pay(order));
    }
}
```

Spring 测试：`@SpringBootTest`、`@WebMvcTest`、`@DataJpaTest` 分层测试切片。

---

## 源码分析

JUnit 5 通过 `TestEngine` SPI 发现测试；Jupiter `Extension` 机制（如 MockitoExtension）扩展生命周期。

---

## 面试常见题目

**1. 单元测试与集成测试？**

单元隔离依赖；集成测多组件协作。

**2. mock 和 stub？**

mock 验证交互；stub 仅提供预设返回值。

**3. `@Mock` 和 `@Spy`？**

Spy 部分 mock，未 stub 方法调真实对象。

**4. 如何提高测试可维护性？**

AAA 模式、单一断言焦点、避免测试私有方法。

**5. TDD 流程？**

红-绿-重构：先写失败测试再实现。

---

## 思维发散

1. 契约测试（Pact）与微服务。
2. 变异测试（PIT）衡量测试质量。
3. 测试容器（Testcontainers）真数据库集成测。

---

## 相关概念（待扩展）

- 测试驱动开发（TDD）— 开发流程
- 依赖注入 — 可测试性设计
- Spring Framework — Spring Test
