---
title: "Nacos"
tags:
  - java/frameworks
  - nacos
  - service-discovery
  - configuration-management
stage: 5
status: "permanent"
type: "地图型"
summary: "服务注册发现与配置管理平台"
related:
  - Spring Cloud
  - Service Mesh
  - Configuration Center
---

# Nacos

> 服务注册发现与配置管理平台

本文全景介绍 Nacos 的核心能力、架构组成与使用场景，不展开源码细节（参见 [[|]] 专题）。Nacos 是阿里巴巴开源的服务发现与配置管理平台，支持 DNS/HTTP/RPC 多种协议，适用于微服务架构下的服务治理与动态配置。

---

## 概念定义

Nacos（Naming and Configuration Service）提供四大核心能力：

| 能力 | 说明 |
|------|------|
| 服务注册发现 | 服务实例自动注册、健康检查、负载均衡 |
| 配置管理 | 配置动态推送、版本管理、灰度发布 |
| 服务元数据 | 标签、权重、元数据扩展 |
| 多环境隔离 | Namespace/Group/DataID 三级隔离 |

---

## 核心原理

### 1. 服务注册流程

```
服务启动 → 调用 Nacos API 注册 → 心跳保活 → 消费者拉取列表 → 本地缓存 → 负载均衡调用
```

- **注册协议**：HTTP/1.1（默认）、gRPC（2.x+）
- **心跳机制**：默认 5s 上报，15s 未上报标记不健康，30s 剔除
- **本地缓存**：`~/nacos/naming/{namespace}/public/{serviceName}`

### 2. 配置推送机制

```
配置变更 → Nacos Server 通知 → 客户端长轮询（30s） → 拉取新配置 → 应用刷新
```

- **长轮询**：客户端持有 30s 超时请求，配置变更立即返回
- **快照缓存**：`~/nacos/config/{namespace}/{group}/{dataId}`
- **监听器**：`@NacosConfigListener` 自动绑定刷新方法

### 3. 集群架构

```
Client → VIP → Nacos Server (Raft 共识) ↔ MySQL (持久化)
                      ↓
                多副本同步（AP/CP 模式）
```

- **AP 模式**：默认，高可用优先，数据最终一致
- **CP 模式**：强一致优先，需启用 `nacos.core.protocol.raft.data=true`

---

## 实际应用

### Spring Cloud 集成

```yaml
# application.yml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: dev
      config:
        server-addr: ${spring.cloud.nacos.discovery.server-addr}
        file-extension: yaml
```

```java
// 服务提供者
@NacosInjected
private NamingService namingService;

@PostConstruct
public void register() throws NacosException {
  namingService.registerInstance("order-service", "192.168.1.10", 8080);
}
```

### 配置动态刷新

```java
@NacosConfigListener(dataId = "app.yaml", timeout = 3000)
public void onConfigChange(String config) {
  // 自动解析 YAML 并注入 @Value 字段
}
```

---

## 源码分析

Nacos 客户端注册核心入口（简化）：

```java
// com.alibaba.nacos.client.naming.NacosNamingService.registerInstance()
public void registerInstance(String serviceName, String ip, int port) {
  Instance instance = new Instance();
  instance.setIp(ip); instance.setPort(port);
  instance.setServiceName(serviceName);
  // 1. 构建注册请求
  // 2. 通过 HTTP/gRPC 发送 Server
  // 3. 启动心跳任务（BeatReactor）
  beatReactor.addBeatInfo(serviceName, new BeatInfo(instance));
}
```

> 完整流程参见 Nacos GitHub: `naming/` 模块。本文仅展示入口，不展开 Raft 共识与 Distro 协议细节。

---

## 面试常见题目

### 基础
**1. Nacos 支持哪两种数据一致性模式？**
参考答案：AP（高可用，默认）与 CP（强一致）。AP 模式使用 Distro 协议，CP 模式启用 Raft 共识。

**2. 配置变更后，客户端多久能感知？**
参考答案：长轮询机制，服务端变更立即通知，客户端 30s 内必刷新；实际通常 <1s。

**3. Nacos 与 Eureka 的核心区别？**
参考答案：Nacos 支持配置管理 + 服务发现双能力；Eureka 仅服务发现。Nacos 支持 AP/CP 切换，Eureka 仅 AP。

### 进阶
**4. 如何保证 Nacos 集群脑裂时配置不丢失？**
参考答案：启用 CP 模式 + Raft 共识，Leader 写入成功后才返回；或开启配置快照 + MySQL 持久化双写。

**5. 服务实例下线后，消费者多久感知？**
参考答案：默认心跳 5s，15s 标记不健康，30s 剔除；消费者本地缓存默认 10s 刷新，实际感知 <35s。

---

## 思维发散

1. Nacos 2.x 引入 gRPC 后，长连接管理对客户端资源的影响？
2. 多 Namespace 隔离 vs 多集群部署，如何选择？
3. 配置中心与 Apollo/Consul 的对比选型维度？

---

## 相关概念（待扩展）

- Spring Cloud — Nacos 的 Spring 生态集成方案
- Service Mesh — 与 Istio 的服务发现对接模式
- Configuration Center — 配置管理的通用抽象与 Nacos 实现差异

