---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: RESTful 控制器、视图解析与拦截器。
related:
  - Spring Boot
  - 网络编程
  - REST API
---

# Spring MVC

> RESTful 控制器、视图解析与拦截器。

本文介绍 Spring MVC 的请求处理流程与 REST API 开发。全栈视图渲染简述；前后端分离以 JSON API 为主。

---

## 概念定义

**Spring MVC** 基于 DispatcherServlet 的 Web MVC 框架，将 HTTP 请求映射到控制器方法，支持视图解析、数据绑定、验证与异常处理。

---

## 核心原理

### 1. 请求流程

```
DispatcherServlet
  → HandlerMapping（找 Controller）
  → HandlerAdapter（执行方法）
  → Controller
  → 返回 ModelAndView 或 @ResponseBody
  → ViewResolver / HttpMessageConverter
  → 响应
```

### 2. 常用注解

| 注解 | 作用 |
|------|------|
| `@RestController` | `@Controller` + `@ResponseBody` |
| `@GetMapping` / `@PostMapping` | 路由 |
| `@PathVariable` | 路径参数 |
| `@RequestParam` | 查询参数 |
| `@RequestBody` | JSON 反序列化 |
| `@Valid` | 参数校验 |

### 3. 拦截器 vs 过滤器

`Filter`（Servlet 层）先于 `DispatcherServlet`；`HandlerInterceptor` 在 MVC 链路内（`preHandle`/`postHandle`/`afterCompletion`）。

### 4. 异常处理

`@ExceptionHandler`、`@ControllerAdvice` 统一返回错误 JSON。

### 5. RESTful 风格

资源用 URI，动词用 HTTP 方法；状态码语义化（200、201、404、400、500）。

---

## 实际应用

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public UserDto get(@PathVariable Long id) { }

    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(201).body(dto);
    }
}

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handle(BusinessException e) {
        return ProblemDetail.forStatusAndDetail(400, e.getMessage());
    }
}
```

---

## 源码分析

`DispatcherServlet.doDispatch` 核心分发逻辑；`RequestMappingHandlerMapping` 解析 `@RequestMapping` 映射表。

`RequestMappingHandlerAdapter` 调用控制器方法，参数解析器 `HandlerMethodArgumentResolver` 处理 `@RequestBody` 等。

---

## 面试常见题目

**1. Spring MVC 流程？**

见请求流程图。

**2. `@Controller` 和 `@RestController`？**

后者默认响应体序列化，不经过视图解析。

**3. 拦截器和过滤器顺序？**

Filter → Servlet → Interceptor → Controller。

**4. 如何实现跨域？**

`@CrossOrigin` 或 `WebMvcConfigurer.addCorsMappings`。

**5. 内容协商？**

`Accept` 头或参数选择 JSON/XML；`HttpMessageConverter` 处理。

---

## 思维发散

1. WebFlux 响应式栈与 MVC 阻塞模型对比。
2. OpenAPI（SpringDoc）自动生成 API 文档。
3. API 版本控制：URI vs Header。

---

## 相关概念（待扩展）

- Spring Boot — 自动配置 Web 环境
- 网络编程 — HTTP 基础
- REST API — 资源设计规范
