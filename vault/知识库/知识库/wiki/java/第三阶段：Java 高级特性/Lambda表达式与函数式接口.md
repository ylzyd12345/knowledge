---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 函数式编程基础与常见函数式接口。
related:
  - Stream API
  - 方法引用
  - 面向对象编程（OOP）
---

# Lambda表达式与函数式接口

> 函数式编程基础与常见函数式接口。

本文讲解 Lambda 语法与四大函数式接口。Stream 管道操作见 Stream API 专题。

---

## 概念定义

**Lambda 表达式**是匿名函数的简洁写法，实现**函数式接口**（仅一个抽象方法的接口）。

```java
Runnable r = () -> System.out.println("run");
Comparator<String> c = (a, b) -> a.length() - b.length();
```

**函数式接口**用 `@FunctionalInterface` 标注，编译器检查抽象方法唯一。

---

## 核心原理

### 1. 语法

```java
(参数) -> 表达式
(参数) -> { 语句块 }
```

单参数可省略括号；单表达式可省略 `{}` 和 `return`。

### 2. 四大核心接口

| 接口 | 方法 | 用途 |
|------|------|------|
| `Predicate<T>` | `boolean test(T)` | 判断 |
| `Consumer<T>` | `void accept(T)` | 消费 |
| `Function<T,R>` | `R apply(T)` | 转换 |
| `Supplier<T>` | `T get()` | 供给 |

还有 `BiFunction`、`UnaryOperator` 等。

### 3. 方法引用

```java
list.forEach(System.out::println);
list.sort(String::compareToIgnoreCase);
```

四种：静态、实例、特定类型、构造器引用。

### 4. 实现原理

invokedynamic + LambdaMetafactory 生成合成方法，非简单内部类，减少匿名类类文件膨胀。

### 5. 变量捕获

只能访问 effectively final 的局部变量与 final 参数。

---

## 实际应用

```java
List<User> adults = users.stream()
    .filter(u -> u.getAge() >= 18)
    .toList();

Optional.ofNullable(name)
    .map(String::trim)
    .filter(s -> !s.isEmpty())
    .ifPresent(System.out::println);
```

---

## 源码分析

`java.lang.invoke.LambdaMetafactory.metafactory` 在首次调用时生成调用句柄，后续调用走优化路径。

---

## 面试常见题目

**1. Lambda 本质？**

函数式接口的匿名实现；invokedynamic 生成。

**2. Lambda 与匿名内部类？**

Lambda 更简洁；语义上函数式接口；性能上 Lambda 通常更优。

**3. 四大函数式接口？**

Predicate、Consumer、Function、Supplier。

**4. effectively final？**

未声明 final 但不再赋值的变量。

**5. 方法引用类型？**

静态、实例、类、构造器。

---

## 思维发散

1. Lambda 与闭包：Java 不捕获可变变量。
2. 串行 Lambda 调试困难：栈跟踪为合成方法名。
3. 与 Kotlin 函数类型的对比。

---

## 相关概念（待扩展）

- Stream API — 流式处理
- 方法引用 — 简写形式
- 面向对象编程（OOP）— 与函数式互补
