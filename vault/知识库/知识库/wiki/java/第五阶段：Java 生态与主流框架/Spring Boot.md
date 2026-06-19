---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: 自动配置、Starter 与快速项目搭建。
related:
  - Spring Framework
  - 微服务
  - 构建工具
  - Spring MVC
---

# Spring Boot

> 自动配置、Starter 与快速项目搭建。

本文介绍 Spring Boot 的自动配置、Starter 与常用配置。微服务治理见 Spring Cloud 专题。

---

## 概念定义

**Spring Boot** 在 Spring Framework 之上提供**约定优于配置**：内嵌服务器、自动配置、Starter 依赖聚合、Actuator 监控，快速构建可运行应用。

---

## 核心原理

### 1. 自动配置

`@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`。

`spring.factories` / `AutoConfiguration.imports` 注册自动配置类，条件注解控制生效：

- `@ConditionalOnClass`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`

### 2. Starter

`spring-boot-starter-web` 聚合 web、json、tomcat 等依赖与默认配置。

### 3. 配置文件

`application.yml` / `application.properties`，多环境 `application-dev.yml`，`@ConfigurationProperties` 绑定配置类。

### 4. Actuator

`/actuator/health`、`/metrics` 等端点；生产须限制暴露与鉴权。

### 5. 内嵌容器

Tomcat（默认）、Jetty、Undertow，无需外部 WAR 部署。

---

## 实际应用

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() { return "ok"; }
}
```

```yaml
server:
  port: 8080
spring:
  profiles:
    active: dev
management:
  endpoints:
    web:
      exposure:
        include: health,info
```

---

## 源码分析

`SpringApplication.run` 创建 `ApplicationContext`，`refresh` 前准备环境、`Environment`，启动内嵌 WebServer。

`@EnableAutoConfiguration` 导入 `AutoConfigurationImportSelector`，读取 META-INF 自动配置列表并过滤。

---

## 面试常见题目

**1. Boot 和 Spring 区别？**

Boot 自动配置、内嵌服务器、starter，降低搭建成本。

**2. 自动配置原理？**

条件注解 + 自动配置类 + `spring.factories`/imports。

**3. 如何排除自动配置？**

`@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)`。

**4. 配置文件优先级？**

命令行 > 环境变量 > application-{profile} > application。

**5. 如何实现自定义 Starter？**

autoconfigure 模块 + `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`。

---

## 思维发散

1. Native Image（GraalVM）与冷启动优化。
2. Spring Boot 3 与 Jakarta EE 9+ 包名迁移。
3. 配置中心与本地配置的分层。

---

## 相关概念（待扩展）

- Spring Framework — 核心容器
- 微服务 — 服务拆分与 Boot 应用
- 构建工具 — Maven/Gradle 插件
- Spring MVC — Web 层
