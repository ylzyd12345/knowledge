---
title: "Reflection"
tags: [java/advanced, reflection]
stage: 3
status: "permanent"
type: "机制型"
summary: "Reflection"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 动态获取类信息并操作字段、方法。
related:
  - 注解
  - 动态代理
  - 泛型
---

# 反射

> 动态获取类信息并操作字段、方法。

本文讲解 Java 反射 API 与原理。动态代理、Spring IoC 依赖反射与注解，见注解、Spring Framework 专题。

---

## 概念定义

**反射（Reflection）** 在运行期通过 `Class` 对象检查与操作类的字段、方法、构造器，无需编译期确定具体类型。入口：`obj.getClass()`、`Class.forName()`、`.class` 字面量。

---

## 核心原理

### 1. Class 对象

每个类在加载后由 JVM 生成对应 `Class` 实例，单例 per ClassLoader。

### 2. 常用 API

```java
Class<?> clazz = Class.forName("com.example.User");
Constructor<?> ctor = clazz.getDeclaredConstructor(String.class);
Object obj = ctor.newInstance("name");
Method m = clazz.getMethod("getName");
m.invoke(obj);
Field f = clazz.getDeclaredField("id");
f.setAccessible(true);
f.set(obj, 1L);
```

### 3. 访问控制

`getDeclaredX` 获取本类声明（含 private）；`setAccessible(true)` 绕过检查（JDK 9+ 模块系统可能限制）。

### 4. 性能

反射调用有开销；JIT 可生成字节码桥接优化。高频路径可用 MethodHandle。

### 5. 与泛型

运行时擦除，`getGenericReturnType()` 等可获取部分签名信息。

---

## 实际应用

```java
// 框架中根据配置加载实现类
Class<?> impl = Class.forName(config.getDriverClass());
Driver driver = (Driver) impl.getDeclaredConstructor().newInstance();

// 注解扫描结合反射（Spring ComponentScan）
```

---

## 源码分析

`Method.invoke` 经 native 或 GeneratedMethodAccessor 调用；调用次数多时 JVM 生成字节码访问器替代 native，降低开销。

`Class` 对象由 ClassLoader 创建并缓存于 `ClassLoader` 内部。

---

## 面试常见题目

**1. 什么是反射？优缺点？**

运行期动态操作类；灵活但性能较低、破坏封装。

**2. 获取 Class 的方式？**

`Class.forName`、`类名.class`、对象 `getClass()`。

**3. `Class.forName` 和 `loadClass`？**

前者触发初始化；`loadClass` 默认不初始化。

**4. 反射破坏单例？**

可通过反射调用私有构造创建新实例；枚举单例可防反射。

**5. 如何提升反射性能？**

缓存 Method/Field、setAccessible 一次、MethodHandle、避免在热点循环反射。

---

## 思维发散

1. 反射与注解处理器（编译期）的分工。
2. JDK 模块系统对深层反射的限制（`--add-opens`）。
3. GraalVM 原生镜像对反射的配置 `reflect-config.json`。

---

## 相关概念（待扩展）

- 注解 — 元数据与反射读取
- 动态代理 — InvocationHandler
- 泛型 — 擦除与 Type 接口
