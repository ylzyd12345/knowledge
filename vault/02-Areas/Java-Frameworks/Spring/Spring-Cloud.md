---
title: "Spring-Cloud"
tags: [java/frameworks, spring-cloud]
stage: 5
status: "permanent"
type: "框架型"
summary: "Spring Cloud"
related: []
---

---
phase: 第五阶段：Java 生态与主流框架
type: 地图型
summary: 微服务治理：服务发现、配置、网关等。
related:
  - 微服务
  - 分布式系统基础
  - Spring Boot
  - 消息中间件
---

# Spring Cloud

> 微服务治理：服务发现、配置、网关等。

本文建立 Spring Cloud 微服务组件全景。各组件深入配置见官方文档与专项实践；阿里系 Nacos/Sentinel 为常见替代。

---

## 概念定义

**Spring Cloud** 是在 Spring Boot 之上的**微服务工具集**，提供分布式系统常见模式的集成：注册发现、配置中心、负载均衡、熔断、网关、分布式追踪等（具体组件随版本演进，部分进入 Spring Cloud Alibaba 生态）。

---

## 核心原理

### 1. 服务发现

客户端/服务端注册模型：实例注册到注册中心（Eureka、Nacos、Consul），消费者查询健康实例列表。

### 2. 配置中心

集中管理 `application.yml`，动态刷新 `@RefreshScope`，多环境多命名空间。

### 3. 客户端负载均衡

`Spring Cloud LoadBalancer`（取代 Ribbon）配合 `@LoadBalanced RestTemplate` 或 OpenFeign。

### 4. 网关

**Spring Cloud Gateway**：路由、谓词、过滤器链；统一鉴权、限流、路径重写。

### 5. 熔断与限流

Hystrix（维护模式）→ Resilience4j、Sentinel；慢调用比例、异常比例熔断。

### 6. 典型架构

```
Client → Gateway → Service A → Service B
              ↓
        Registry / Config
```

---

## 实际应用

```yaml
# Gateway 路由示例
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
```

```java
@FeignClient("order-service")
public interface OrderClient {
    @GetMapping("/orders/{id}")
    OrderDto get(@PathVariable Long id);
}
```

---

## 源码分析

Gateway `FilteringWebHandler` 组合 `GlobalFilter` 与路由过滤器；Netty 非阻塞处理请求。

服务发现客户端通过 `DiscoveryClient` 接口抽象，定时拉取或推送实例列表更新本地缓存。

---

## 面试常见题目

**1. 微服务组件有哪些？**

注册、配置、网关、负载均衡、熔断、追踪、消息总线。

**2. Eureka 和 Nacos？**

Eureka AP 模型；Nacos 支持 CP/AP、配置中心一体化。

**3. Gateway 和 Zuul？**

Gateway 基于 WebFlux 非阻塞；Zuul 1.x 阻塞已过时。

**4. 如何实现灰度发布？**

网关路由权重、元数据标签、特性开关。

**5. 配置中心刷新原理？**

`/actuator/refresh` 或 Bus 广播，重建 `@RefreshScope` Bean。

---

## 思维发散

1. Service Mesh（Istio）与 Spring Cloud 边界。
2. 微服务拆分粒度与团队 Conway 定律。
3. 分布式事务 Seata 与 Spring Cloud 集成。

---

## 相关概念（待扩展）

- 微服务 — 架构风格
- 分布式系统基础 — CAP 与一致性
- Spring Boot — 微服务应用基础
- 消息中间件 — 异步解耦
