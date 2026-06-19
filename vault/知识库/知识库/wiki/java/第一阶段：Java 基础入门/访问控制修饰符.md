---
phase: 第一阶段：Java 基础入门
type: 机制型
summary: public/protected/default/private 的可见性规则。
related:
  - 面向对象编程（OOP）
  - 封装
  - 包（package）
---

# 访问控制修饰符

> public/protected/default/private 的可见性规则。

本文说明 Java 四种访问级别的作用域与封装实践。模块化系统的导出规则见 Java 模块化系统专题。

---

## 概念定义

**访问控制修饰符**用于限制类、字段、方法、构造器的可见范围，是封装的核心手段。四个级别：

| 修饰符 | 同类 | 同包 | 子类（不同包） | 其他 |
|--------|------|------|----------------|------|
| `private` | ✓ | ✗ | ✗ | ✗ |
| default（无修饰符） | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public` | ✓ | ✓ | ✓ | ✓ |

**类**本身只有 `public` 或 default（同文件内可有多个 default 类）。

---

## 核心原理

### 1. private

仅本类内部可见。字段通常 `private`，通过 `getter/setter` 或业务方法暴露。

### 2. default（包访问）

无关键字，同包内可见。适合包内协作的辅助类与 API。

### 3. protected

同包 + 不同包子类可见。常用于框架中供子类扩展的模板方法。

```java
class Base {
    protected void onInit() { }  // 子类可重写
}
```

### 4. public

对外公开 API。接口方法、公共常量通常为 `public`。

### 5. 与继承的关系

- 子类重写方法访问权限**不能更严格**（如父 `public`，子不能 `protected`）。
- 子类可访问父类 `protected` 成员，即使不在同包。

### 6. 包（package）

`package com.example.service;` 声明所属包；目录结构须与包名对应。`import` 导入其他包类型。

---

## 实际应用

### 示例：分层可见性

```java
// com.example.api — 对外
public interface UserService { User findById(Long id); }

// com.example.internal — 包内
class UserRepository { User load(Long id) { } }

// com.example.service
public class UserServiceImpl implements UserService {
    private final UserRepository repo = new UserRepository();
    public User findById(Long id) { return repo.load(id); }
}
```

### 示例：protected 供子类扩展

```java
public abstract class AbstractHandler {
    protected void beforeHandle() { }
    public final void handle() {
        beforeHandle();
        doHandle();
    }
    protected abstract void doHandle();
}
```

---

## 源码分析

`java.lang.Object` 中 `clone()`、`finalize()` 等为 `protected`，子类在合适场景下可访问或重写。`Arrays` 中部分工具方法为包内 default，不对外暴露实现细节。

---

## 面试常见题目

**1. 四种访问修饰符及范围？**

见上表。

**2. protected 和 default 的区别？**

同包子类外：default 子类不可见，protected 子类可见。

**3. 接口中的方法默认修饰符？**

Java 8 前隐式 `public abstract`；Java 8+ 默认方法为 `public`。

**4. 外部类能用 private 吗？**

顶级类只能 `public` 或 default；`private` 可用于内部类。

**5. 如何设计类的访问级别？**

最小权限原则：默认 private，必要才放宽。

---

## 思维发散

1. 模块系统（module-info）与包访问有何不同？模块导出是更粗粒度的边界。
2. 反射能否访问 private 字段？可以 `setAccessible(true)`，破坏封装，框架与测试中使用需谨慎。
3. Kotlin 的 `internal` 与 Java default 的对比。

---

## 相关概念（待扩展）

- 面向对象编程（OOP）— 封装
- 封装 — 数据隐藏
- 包（package）— 命名空间与组织
