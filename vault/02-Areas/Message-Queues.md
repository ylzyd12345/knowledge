---
phase: 第五阶段：Java 生态与主流框架
type: 地图型
summary: RabbitMQ/Kafka 基础概念与异步解耦。
related:
  - 异步处理
  - 事件驱动架构
  - Spring Cloud
---

# 消息中间件

> RabbitMQ/Kafka 基础概念与异步解耦。

本文介绍消息队列核心概念与 RabbitMQ、Kafka 的定位差异。深入运维与选型见架构专题。

---

## 概念定义

**消息中间件**实现应用间**异步通信**与**解耦**：生产者发消息到 Broker，消费者订阅消费。核心角色：

| 角色 | 说明 |
|------|------|
| Producer | 生产者 |
| Broker | 消息服务器 |
| Consumer | 消费者 |
| Topic / Queue | 消息通道 |

---

## 核心原理

### 1. 消息模型

- **队列模型**：点对点，一条消息一个消费者（RabbitMQ Queue）
- **发布订阅**：Topic，多消费者组（Kafka Topic + Consumer Group）

### 2. RabbitMQ 概念

Exchange（direct/topic/fanout）→ 绑定 → Queue → Consumer。  
ACK 确认、持久化、死信队列（DLQ）处理失败消息。

### 3. Kafka 概念

Topic 分区（Partition）并行；副本（Replication）高可用；offset 消费进度。  
高吞吐、日志型存储，适合事件流与大数据管道。

### 4. 对比速查

| | RabbitMQ | Kafka |
|---|----------|-------|
| 吞吐 | 万级 | 百万级 |
| 延迟 | 低 | 较低 |
| 场景 | 业务消息、复杂路由 | 日志、流处理、大数据 |
| 消息保留 | 消费后删（可配置） | 按时间/大小保留 |

### 5. 可靠性

生产者确认、Broker 持久化、消费者手动 ACK、幂等消费设计。

---

## 实际应用

```java
// Spring AMQP（RabbitMQ）
@RabbitListener(queues = "order.created")
public void onOrderCreated(OrderEvent event) { }

// Spring Kafka
@KafkaListener(topics = "order-topic", groupId = "inventory")
public void consume(String message) { }
```

异步解耦：订单创建发事件，库存、通知服务独立消费。

---

## 源码分析

Spring `RabbitTemplate` 封装 Channel 发布；`KafkaTemplate` 封装 ProducerRecord 发送与分区选择。

---

## 面试常见题目

**1. 为什么用消息队列？**

解耦、异步、削峰填谷、最终一致性。

**2. 如何保证消息不丢？**

生产者 confirm、Broker 持久化、消费者手动 ACK。

**3. 如何保证不重复消费？**

业务幂等、唯一键、去重表。

**4. 消息积压怎么办？**

扩容消费者、批量消费、临时降级、跳过非关键消息。

**5. Kafka 分区与消费者关系？**

一个分区同一时刻只被一个组内消费者消费；消费者数 ≤ 分区数时并行度受限。

---

## 思维发散

1. 事务消息（RocketMQ）与本地消息表。
2. CDC（Debezium）与 Kafka 构建事件驱动架构。
3. 云托管消息服务（SQS、MQ）与自建对比。

---

## 相关概念（待扩展）

- 异步处理 — 非阻塞业务流程
- 事件驱动架构 — EDA 模式
- Spring Cloud — 微服务集成
