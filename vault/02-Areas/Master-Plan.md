---
title: "Master Plan"
tags: [master-plan, knowledge-base, blueprint]
---

# 知识库全局蓝图

> 80+ 篇核心概念文章规划，覆盖 Java 后端架构师从基础到前沿的所有维度。
> 状态标记：✅ 已完成 | 🔄 进行中 | ⬜ 待生成

---

## 一、Java 语言与核心基础

| 文章 | 摘要 | 状态 |
|------|------|------|
| [[Java-Core/Basics/Java-Overview\|Java 概述]] | Java 语言特性、生态与学习路线全景。 | ✅ |
| [[Java-Core/Basics/OOP\|面向对象编程]] | 封装、继承、多态三大特性与设计原则。 | ✅ |
| [[Java-Core/Basics/Basic-Syntax\|基本语法]] | 变量、运算符、控制流与编码规范。 | ✅ |
| [[Java-Core/Basics/Methods\|方法]] | 方法定义、重载、可变参数与调用约定。 | ✅ |
| [[Java-Core/Basics/Access-Modifiers\|访问控制修饰符]] | public/protected/default/private 可见性规则。 | ✅ |
| [[Java-Core/Basics/Arrays\|数组]] | 数组声明、初始化、遍历与工具类。 | ✅ |
| [[Java-Core/Basics/Exception-Handling\|异常处理]] | try-catch-finally、异常体系与自定义异常。 | ✅ |
| [[Java-Core/API/Generics\|泛型]] | 泛型类、方法、通配符及类型擦除。 | ✅ |
| [[Java-Core/Collections/Collections-Framework\|集合框架]] | List、Set、Map 体系及常用实现类。 | ✅ |
| [[Java-Core/API/Wrapper-Classes\|包装类与自动装箱]] | 基本类型包装、缓存池与拆装箱陷阱。 | ✅ |
| [[Java-Core/API/String-Processing\|字符串处理]] | String/StringBuilder/StringTokenizer 与正则。 | ✅ |
| [[Java-Core/API/Date-and-Time\|日期与时间]] | java.time API、时区处理与格式化。 | ✅ |
| [[Java-Core/API/Math-Utilities\|数学工具类]] | Math、BigDecimal、Random 与 SecureRandom。 | ✅ |
| [[Java-Core/Concurrency/Multithreading-and-Concurrency\|多线程与并发]] | 线程创建、同步机制及线程状态管理。 | ✅ |
| [[Java-Core/Concurrency/Thread-Pools\|线程池]] | Executor 框架与 ThreadPoolExecutor 参数调优。 | ✅ |
| [[Java-Core/Concurrency/Concurrent-Collections\|并发容器]] | ConcurrentHashMap、CopyOnWriteArrayList 等。 | ✅ |
| [[Java-Core/Concurrency/Advanced-Concurrency\|并发编程深入]] | AQS、LockSupport、CAS 与原子类。 | ✅ |
| [[Java-Core/JVM/Memory-Model\|JVM 内存模型]] | 堆、栈、方法区等运行时数据区域划分。 | ✅ |
| [[Java-Core/JVM/Garbage-Collection\|垃圾回收（GC）]] | 可达性分析、GC 算法与常用收集器。 | ✅ |
| [[Java-Core/JVM/Performance-Tuning\|JVM 性能调优]] | JVM 参数、GC 日志分析与调优实战。 | ✅ |
| [[Java-Core/Advanced/Reflection\|反射与注解]] | 动态类加载、元编程与注解处理器。 | ✅ |
| [[Java-Core/Advanced/Lambda-and-Functional-Interfaces\|Lambda 与 Stream]] | 函数式编程与流式操作集合数据。 | ✅ |
| [[Java-Core/IO/IO-Streams\|IO 流]] | 字节流、字符流、装饰器模式。 | ✅ |
| [[Java-Core/IO/NIO\|NIO]] | Channel/Buffer/Selector 与零拷贝。 | ✅ |
| [[Java-Core/Advanced/Module-System\|Java 模块化系统]] | Java 9+ 模块定义与依赖管理。 | ✅ |
| Java 新特性演进 | 各版本 LTS（8/11/17/21）核心特性。 | ⬜ |

## 二、主流框架与微服务生态

| 文章 | 摘要 | 状态 |
|------|------|------|
| [[Java-Frameworks/Spring/Spring-Framework\|Spring Framework]] | IoC、DI、AOP 核心容器与 Bean 生命周期。 | ✅ |
| [[Java-Frameworks/Spring/Spring-Boot\|Spring Boot]] | 自动配置、起步依赖、Actuator。 | ✅ |
| [[Java-Frameworks/Spring/Spring-MVC\|Spring MVC]] | RESTful 控制器、视图解析与拦截器。 | ✅ |
| [[Java-Frameworks/ORM/Spring-Data-JPA\|Spring Data JPA]] | ORM 映射、Repository 接口与查询方法。 | ✅ |
| [[Java-Frameworks/ORM/MyBatis\|MyBatis]] | SQL 映射、动态 SQL 与 Mapper 接口。 | ✅ |
| [[Java-Frameworks/Spring/Spring-Cloud\|Spring Cloud]] | 微服务治理全家桶。 | ✅ |
| Spring Cloud Alibaba | Nacos、Sentinel、Seata、RocketMQ 集成。 | ⬜ |
| Nacos | 服务注册发现与配置管理平台。 | ⬜ |
| Sentinel | 流量控制、熔断降级、系统自适应保护。 | ⬜ |
| Seata | 分布式事务解决方案（AT/TCC/Saga）。 | ⬜ |
| API 网关深度 | Gateway / Kong / APISIX 对比与 BFF 模式。 | ⬜ |
| 服务网格（Service Mesh） | Istio/Linkerd 原理与流量管理。 | ⬜ |
| Dubbo | 高性能 Java RPC 框架与服务治理。 | ⬜ |
| gRPC 与 Protobuf | 高性能跨语言 RPC 协议与 Java 集成。 | ⬜ |

## 三、数据存储与处理

| 文章 | 摘要 | 状态 |
|------|------|------|
| MySQL | 存储引擎、事务、索引、SQL 优化、主从复制。 | ⬜ |
| 数据库架构设计 | 分库分表、读写分离、分布式 ID。 | ⬜ |
| PostgreSQL | 高级特性：JSON、数组、全文检索。 | ⬜ |
| NoSQL 数据库选型 | MongoDB、Cassandra、HBase 场景对比。 | ⬜ |
| Redis | 数据结构、持久化、哨兵/集群、缓存设计。 | ⬜ |
| Elasticsearch | 倒排索引、全文搜索、聚合分析与集群架构。 | ⬜ |
| 图数据库（Neo4j） | 图模型、Cypher 查询与知识图谱。 | ⬜ |
| [[Architecture/Middleware/Message-Queues\|消息中间件架构]] | RocketMQ vs Kafka vs RabbitMQ 选型。 | ✅ |
| RocketMQ | 事务消息、顺序消息、死信队列。 | ⬜ |
| Kafka | 高吞吐事件流平台与 Exactly-Once 语义。 | ⬜ |
| 数据架构与数据治理 | 数仓分层、数据湖、CDC 与元数据管理。 | ⬜ |
| 大数据集成 | Spark、Flink 与 Java 后端交互。 | ⬜ |

## 四、架构设计核心

| 文章 | 摘要 | 状态 |
|------|------|------|
| 系统架构设计原则 | 架构演进、高可用/高并发/高扩展设计。 | ⬜ |
| [[Architecture/High-Concurrency/High-Concurrency-and-Caching\|高并发系统设计]] | 分层并发控制、秒杀系统、异步与缓存策略。 | ✅ |
| 高可用架构 | 冗余/故障转移、熔断/降级、异地多活。 | ⬜ |
| 微服务架构深度 | 拆分原则、服务治理、灰度发布。 | ⬜ |
| 分布式事务 | 2PC、TCC、SAGA、事务消息方案对比。 | ⬜ |
| [[Architecture/Distributed-Systems/Distributed-Systems-Basics\|分布式系统基础]] | CAP/BASE、一致性协议与集群管理。 | ✅ |
| 可观测性体系 | Metrics/Tracing/Logging 三支柱与 SLO。 | ⬜ |
| [[Architecture/Security/Security-and-Encryption\|安全与加密]] | HTTPS、JWT、OAuth2 与常见攻击防御。 | ✅ |

## 五、云原生与基础设施

| 文章 | 摘要 | 状态 |
|------|------|------|
| [[DevOps/Containerization-and-Deployment\|容器化与部署]] | Docker、Kubernetes 与 CI/CD 流水线。 | ✅ |
| 云原生架构 | 12-Factor、Serverless、Service Mesh。 | ⬜ |
| Kubernetes 深度 | Pod/Service/Ingress、HPA 与 Operator 模式。 | ⬜ |
| 基础设施即代码（IaC） | Terraform、Pulumi 管理云资源。 | ⬜ |

## 六、DevOps 与工程效能

| 文章 | 摘要 | 状态 |
|------|------|------|
| [[Engineering/Testing/Unit-Testing\|单元测试]] | JUnit 5、Mockito、测试金字塔与覆盖率。 | ✅ |
| 测试体系 | 集成测试、契约测试、E2E 与性能测试。 | ⬜ |
| [[Engineering/Tools/Git\|Git 高级技巧]] | GitFlow/Trunk Based、rebase/bisect。 | ✅ |
| [[Engineering/Tools/Build-Tools\|构建工具]] | Maven/Gradle 原理、多模块与依赖管理。 | ✅ |
| [[Engineering/Tools/Logging-Frameworks\|日志框架]] | SLF4J/Logback/Log4j2 配置与 MDC。 | ✅ |
| Linux 与 Shell 脚本 | 常用命令、性能诊断与脚本自动化。 | ⬜ |
| API 设计与调试 | RESTful 规范、OpenAPI、Postman/cURL。 | ⬜ |
| 日志与监控工具链 | ELK/Loki、Prometheus、Grafana。 | ⬜ |

## 七、设计模式与工程实践

| 文章 | 摘要 | 状态 |
|------|------|------|
| [[Engineering/Design-Patterns/Design-Patterns\|设计模式]] | 创建型/结构型/行为型 23 种模式精要。 | ✅ |
| [[Java-Frameworks/Database/JDBC\|JDBC]] | 连接池、事务隔离与 PreparedStatement。 | ✅ |
| [[Java-Core/IO/Network-Programming\|网络编程]] | Socket/NIO/Netty 与 HTTP 客户端。 | ✅ |
| 代码质量与工程效能 | 编码规范、SonarQube、DORA 指标。 | ⬜ |
| 技术债务管理 | 分类、识别与偿还策略。 | ⬜ |

## 八、项目管理与团队协作

| 文章 | 摘要 | 状态 |
|------|------|------|
| 敏捷开发与 Scrum | 角色、工件、活动与用户故事。 | ⬜ |
| 需求管理与优先级 | MoSCoW、Kano 模型与变更流程。 | ⬜ |
| 交付与发布管理 | 语义化版本、灰度发布、特性开关。 | ⬜ |
| 团队建设与人员培养 | Onboarding、Code Review 文化与 OKR。 | ⬜ |
| 复盘文化 | 故障复盘（Blameless）、5 Whys。 | ⬜ |

## 九、合规、安全与审计

| 文章 | 摘要 | 状态 |
|------|------|------|
| 合规与审计架构 | GDPR、等保 2.0、PCI-DSS 合规要求。 | ⬜ |
| 数据隐私与脱敏 | 动态/静态脱敏、差分隐私。 | ⬜ |
| IAM 深度 | SSO（OAuth2/SAML）、RBAC/ABAC。 | ⬜ |
| 安全左移 | SAST/DAST、依赖扫描、威胁建模。 | ⬜ |
| 零信任架构 | BeyondCorp、mTLS、身份感知代理。 | ⬜ |

## 十、通信与协议

| 文章 | 摘要 | 状态 |
|------|------|------|
| HTTP/2 与 HTTP/3 | 多路复用、服务器推送、QUIC 协议。 | ⬜ |
| WebSocket 与 RSocket | 全双工通信、背压机制与四种交互模式。 | ⬜ |
| RPC 框架对比 | Dubbo、gRPC、Thrift、Feign 性能对比。 | ⬜ |

## 十一、架构演进与案例分析

| 文章 | 摘要 | 状态 |
|------|------|------|
| 架构重构案例 | 单体到微服务拆分实例与数据迁移。 | ⬜ |
| 高并发案例 | 秒杀系统、排行榜实时计算。 | ⬜ |
| 高可用案例 | 双活/多活架构与混沌工程演练。 | ⬜ |
| 分布式系统案例 | 最终一致性、分布式 ID 与调度。 | ⬜ |

---

## 统计

| 分类 | 总数 | ✅ 已完成 | ⬜ 待生成 |
|------|------|-----------|-----------|
| 一、Java 语言与核心基础 | 26 | 25 | 1 |
| 二、主流框架与微服务生态 | 14 | 6 | 8 |
| 三、数据存储与处理 | 12 | 1 | 11 |
| 四、架构设计核心 | 8 | 4 | 4 |
| 五、云原生与基础设施 | 4 | 1 | 3 |
| 六、DevOps 与工程效能 | 8 | 5 | 3 |
| 七、设计模式与工程实践 | 5 | 5 | 0 |
| 八、项目管理与团队协作 | 5 | 0 | 5 |
| 九、合规、安全与审计 | 5 | 0 | 5 |
| 十、通信与协议 | 3 | 0 | 3 |
| 十一、架构演进与案例分析 | 4 | 0 | 4 |
| **合计** | **94** | **47** | **47** |

---

## 使用说明

- 新文章生成后同步更新对应分类的状态标记。
- 批量生成时按分类顺序推进，优先完成高频面试领域。
- 每个 `[[双链]]` 对应 `02-Areas/` 下的一篇永久笔记。
- 未建立双链的文章为待生成状态，生成后补全链接。
