# Java 开发知识库目录与学习路径

本知识库按照 Java 开发的学习路径组织，每个概念即为一篇独立文章。文章内使用 `[[概念名称]]` 标注相关概念之间的链接。

---

## 第一阶段：Java 基础入门

### [[Java概述]]
- 介绍 Java 的历史、特性（跨平台、JVM）、JDK/JRE 区别。
- 相关概念：[[JVM]]、[[JDK与JRE]]

### [[基本语法]]
- 变量、数据类型、运算符、控制流程（if/else、for、while）。
- 相关概念：[[数据类型]]、[[流程控制]]

### [[数组]]
- 数组的声明、初始化、遍历、多维数组。
- 相关概念：[[内存结构]]、[[循环语句]]

### [[面向对象编程（OOP）]]
- 类与对象、封装、继承、多态、构造方法、this/super。
- 相关概念：[[类]]、[[对象]]、[[继承]]、[[多态]]、[[封装]]

### [[方法]]
- 方法定义、重载、递归、参数传递（值传递）。
- 相关概念：[[重载]]、[[递归]]

### [[访问控制修饰符]]
- public、protected、default、private 的作用域。
- 相关概念：[[包（package）]]、[[封装]]

---

## 第二阶段：核心 API 与常用类

### [[字符串处理]]
- String、StringBuilder、StringBuffer 的区别与用法。
- 相关概念：[[不可变对象]]、[[可变字符序列]]

### [[包装类与自动装箱]]
- 基本类型的包装类（Integer、Double 等），自动装箱/拆箱。
- 相关概念：[[基本数据类型]]、[[泛型]]

### [[数学工具类]]
- Math、Random、BigDecimal、BigInteger。
- 相关概念：[[精度计算]]、[[随机数]]

### [[日期与时间]]
- Date、Calendar，以及 Java 8+ 的 LocalDate、LocalTime、DateTimeFormatter。
- 相关概念：[[新日期时间API]]、[[时区处理]]

### [[集合框架]]
- Collection 接口（List、Set、Queue）与 Map 接口。
- 常见实现：ArrayList、LinkedList、HashSet、TreeSet、HashMap、TreeMap。
- 相关概念：[[迭代器]]、[[Comparable与Comparator]]、[[泛型]]

### [[异常处理]]
- try-catch-finally、throws、throw、自定义异常、异常体系（Throwable/Error/Exception）。
- 相关概念：[[运行时异常]]、[[受检异常]]、[[堆栈跟踪]]

### [[泛型]]
- 泛型类、泛型方法、类型通配符（? extends T, ? super T）、类型擦除。
- 相关概念：[[集合框架]]、[[类型安全]]

---

## 第三阶段：Java 高级特性

### [[IO流]]
- 字节流（InputStream/OutputStream）、字符流（Reader/Writer）、缓冲流、转换流。
- 相关概念：[[文件操作]]、[[序列化]]

### [[NIO]]
- Channel、Buffer、Selector，非阻塞 IO 与多路复用。
- 相关概念：[[IO流]]、[[网络编程]]

### [[多线程与并发]]
- 线程创建（Thread、Runnable、Callable）、线程状态、sleep/join/yield。
- 同步机制：synchronized、Lock、volatile、原子类。
- 相关概念：[[线程池]]、[[死锁]]、[[并发容器]]、[[JMM（Java内存模型）]]

### [[线程池]]
- Executor 框架、ThreadPoolExecutor、核心参数、拒绝策略。
- 相关概念：[[多线程与并发]]、[[阻塞队列]]

### [[并发容器]]
- ConcurrentHashMap、CopyOnWriteArrayList、BlockingQueue。
- 相关概念：[[集合框架]]、[[线程安全]]

### [[JVM内存模型]]
- 堆、栈、方法区、程序计数器、直接内存。
- 相关概念：[[垃圾回收（GC）]]、[[内存溢出与泄漏]]

### [[垃圾回收（GC）]]
- 可达性分析、引用类型（强/软/弱/虚）、GC 算法（标记清除、复制、标记整理）、常用收集器（G1、CMS、ZGC）。
- 相关概念：[[JVM内存模型]]、[[性能调优]]

### [[反射]]
- Class 对象、动态获取类信息、调用方法/构造器/字段。
- 相关概念：[[注解]]、[[动态代理]]

### [[注解]]
- 内置注解（@Override、@Deprecated）、元注解（@Retention、@Target）、自定义注解、注解处理器。
- 相关概念：[[反射]]、[[APT（注解处理工具）]]

### [[Lambda表达式与函数式接口]]
- Lambda 语法、@FunctionalInterface、常用函数式接口（Predicate、Consumer、Function、Supplier）。
- 相关概念：[[Stream API]]、[[方法引用]]

### [[Stream API]]
- 流操作：filter、map、reduce、collect、并行流。
- 相关概念：[[Lambda表达式与函数式接口]]、[[集合框架]]

### [[Java模块化系统]]
- module-info.java、模块导出与依赖、模块路径与类路径的区别。
- 相关概念：[[包（package）]]、[[JDK9+新特性]]

---

## 第四阶段：实用工具与开发进阶

### [[网络编程]]
- Socket、ServerSocket、UDP（DatagramSocket）、HTTP 客户端。
- 相关概念：[[IO流]]、[[NIO]]、[[REST API]]

### [[JDBC]]
- 数据库连接、Statement/PreparedStatement、ResultSet、事务管理、连接池（HikariCP）。
- 相关概念：[[事务（ACID）]]、[[SQL]]、[[ORM框架]]

### [[单元测试]]
- JUnit 5（注解、断言、生命周期）、Mockito 模拟依赖。
- 相关概念：[[测试驱动开发（TDD）]]、[[依赖注入]]

### [[构建工具]]
- Maven（pom.xml、坐标、生命周期、依赖管理）、Gradle（基础）。
- 相关概念：[[依赖冲突]]、[[持续集成（CI）]]

### [[版本控制（Git）]]
- 基本操作（commit、push、pull、branch、merge）、GitFlow 工作流。
- 相关概念：[[协作开发]]、[[代码仓库（GitHub/GitLab）]]

### [[日志框架]]
- SLF4J 接口、Logback/Log4j2 配置、日志级别、MDC。
- 相关概念：[[面向切面编程（AOP）]]、[[监控与运维]]

### [[设计模式]]
- 创建型（单例、工厂、建造者）、结构型（代理、适配器、装饰器）、行为型（观察者、策略、模板方法）。
- 相关概念：[[面向对象编程（OOP）]]、[[重构]]

---

## 第五阶段：Java 生态与主流框架

### [[Spring Framework]]
- IoC 容器、依赖注入（DI）、Bean 生命周期、AOP。
- 相关概念：[[Spring Boot]]、[[控制反转]]

### [[Spring Boot]]
- 自动配置、Starter 依赖、Actuator、配置文件（application.yml）。
- 相关概念：[[Spring Framework]]、[[微服务]]

### [[Spring MVC]]
- 请求映射、控制器、视图解析器、RESTful 风格、拦截器。
- 相关概念：[[Spring Boot]]、[[网络编程]]

### [[Spring Data JPA]]
- ORM 映射、Repository 接口、方法命名查询、@Query、级联操作。
- 相关概念：[[JDBC]]、[[Hibernate]]、[[事务管理]]

### [[MyBatis]]
- SQL 映射文件、动态 SQL、Mapper 接口、与 Spring 集成。
- 相关概念：[[JDBC]]、[[ORM框架]]

### [[Spring Cloud]]
- 服务发现（Eureka/Nacos）、配置中心（Config）、网关（Gateway）、熔断（Sentinel/Hystrix）。
- 相关概念：[[微服务]]、[[分布式系统]]

### [[消息中间件]]
- RabbitMQ、Kafka 基本概念（生产者、消费者、Topic、队列）。
- 相关概念：[[异步处理]]、[[事件驱动架构]]

### [[容器化与部署]]
- Docker 基础（镜像、容器、Dockerfile）、Docker Compose、Kubernetes 简介。
- 相关概念：[[持续集成（CI）/持续部署（CD）]]、[[云原生]]

---

## 第六阶段：性能与架构

### [[JVM性能调优]]
- 内存分析（jmap、jstack、MAT）、GC 日志分析、调优参数。
- 相关概念：[[JVM内存模型]]、[[垃圾回收（GC）]]

### [[并发编程深入]]
- AQS（AbstractQueuedSynchronizer）、锁优化（偏向锁、轻量级锁）、Fork/Join 框架。
- 相关概念：[[多线程与并发]]、[[线程池]]

### [[高并发与缓存]]
- 本地缓存（Caffeine）、分布式缓存（Redis）、缓存穿透/雪崩/击穿。
- 相关概念：[[多线程与并发]]、[[数据库优化]]

### [[分布式系统基础]]
- CAP 定理、BASE 理论、分布式事务（2PC、TCC、最终一致性）、一致性哈希。
- 相关概念：[[Spring Cloud]]、[[消息中间件]]

### [[安全与加密]]
- 对称/非对称加密（AES、RSA）、数字签名、证书、HTTPS、Spring Security。
- 相关概念：[[网络编程]]、[[身份认证与授权]]

---

# index.md 主索引

以下是知识库中所有文章的索引，按学习路径排序，每篇文章提供一句话摘要。

| 文章名称 | 一句话摘要 |
|---------|------------|
| [[Java概述]] | Java 的历史、JVM 原理与开发环境介绍。 |
| [[基本语法]] | 变量、数据类型、运算符及控制流程基础。 |
| [[数组]] | 一维和多维数组的声明、初始化与遍历。 |
| [[面向对象编程（OOP）]] | 类、对象、封装、继承、多态的核心思想。 |
| [[方法]] | 方法定义、重载、递归与参数传递机制。 |
| [[访问控制修饰符]] | public/protected/default/private 的可见性规则。 |
| [[字符串处理]] | String、StringBuilder、StringBuffer 的用法与区别。 |
| [[包装类与自动装箱]] | 基本类型包装类及自动装箱/拆箱原理。 |
| [[数学工具类]] | Math、Random、BigDecimal 等数学运算类。 |
| [[日期与时间]] | 旧版 Date/Calendar 与新版日期时间 API。 |
| [[集合框架]] | List、Set、Map 体系及常用实现类。 |
| [[异常处理]] | try-catch-finally、异常体系与自定义异常。 |
| [[泛型]] | 泛型类、方法、通配符及类型擦除。 |
| [[IO流]] | 字节流、字符流、缓冲流及序列化操作。 |
| [[NIO]] | Channel、Buffer、Selector 实现非阻塞 IO。 |
| [[多线程与并发]] | 线程创建、同步机制及线程状态管理。 |
| [[线程池]] | Executor 框架与 ThreadPoolExecutor 参数调优。 |
| [[并发容器]] | 线程安全的 ConcurrentHashMap 等容器。 |
| [[JVM内存模型]] | 堆、栈、方法区等运行时数据区域划分。 |
| [[垃圾回收（GC）]] | 可达性分析、GC 算法与常用收集器。 |
| [[反射]] | 动态获取类信息并操作字段、方法。 |
| [[注解]] | 内置注解、元注解与自定义注解处理器。 |
| [[Lambda表达式与函数式接口]] | 函数式编程基础与常见函数式接口。 |
| [[Stream API]] | 流式操作集合数据，支持并行处理。 |
| [[Java模块化系统]] | Java 9+ 模块化定义与依赖管理。 |
| [[网络编程]] | Socket、ServerSocket 与 UDP 网络通信。 |
| [[JDBC]] | 数据库连接、SQL 执行、事务与连接池。 |
| [[单元测试]] | JUnit 5 测试框架与 Mockito 模拟。 |
| [[构建工具]] | Maven/Gradle 依赖管理与项目构建。 |
| [[版本控制（Git）]] | Git 基本操作与 GitFlow 协作流程。 |
| [[日志框架]] | SLF4J + Logback 配置与日志级别。 |
| [[设计模式]] | 创建型、结构型、行为型经典设计模式。 |
| [[Spring Framework]] | IoC、DI、AOP 核心容器与 Bean 生命周期。 |
| [[Spring Boot]] | 自动配置、Starter 与快速项目搭建。 |
| [[Spring MVC]] | RESTful 控制器、视图解析与拦截器。 |
| [[Spring Data JPA]] | ORM 映射、Repository 接口与查询方法。 |
| [[MyBatis]] | SQL 映射、动态 SQL 与 Mapper 接口。 |
| [[Spring Cloud]] | 微服务治理：服务发现、配置、网关等。 |
| [[消息中间件]] | RabbitMQ/Kafka 基础概念与异步解耦。 |
| [[容器化与部署]] | Docker/K8s 实现应用容器化与编排。 |
| [[JVM性能调优]] | 内存分析工具与 GC 调优参数实践。 |
| [[并发编程深入]] | AQS、锁优化、Fork/Join 并发框架。 |
| [[高并发与缓存]] | 本地/分布式缓存及缓存问题处理。 |
| [[分布式系统基础]] | CAP、BASE、分布式事务与一致性哈希。 |
| [[安全与加密]] | 加密算法、数字签名与 Spring Security。 |