---
phase: 第二阶段：核心 API 与常用类
type: 机制型
summary: 基本类型包装类及自动装箱/拆箱原理。
related:
  - 基本语法
  - 泛型
  - 基本数据类型
---

# 包装类与自动装箱

> 基本类型包装类及自动装箱/拆箱原理。

本文讲解 8 种包装类、自动装箱拆箱及缓存机制。泛型与集合只能使用引用类型，故包装类与集合框架紧密相关。

---

## 概念定义

每种基本类型有对应包装类：

| 基本类型 | 包装类 |
|----------|--------|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

**自动装箱**：基本类型 → 包装类（如 `Integer i = 10`）。  
**自动拆箱**：包装类 → 基本类型（如 `int n = i`）。

---

## 核心原理

### 1. 装箱与拆箱实现

编译器插入 `Integer.valueOf()` 与 `intValue()` 等调用，是编译期语法糖。

### 2. 缓存池

`Integer` 默认缓存 -128～127（可配置上限）；`Long` 缓存 -128～127。超出范围 `new` 新对象。

```java
Integer a = 127;
Integer b = 127;
a == b;  // true
Integer c = 128;
Integer d = 128;
c == d;  // false
```

### 3. NPE 风险

```java
Integer n = null;
int x = n;  // NullPointerException 拆箱
```

### 4. 与泛型

`List<Integer>` 不能写 `List<int>`；集合存包装类，注意空值与比较。

### 5. 比较

使用 `equals` 比较包装对象；`compare` 用 `Integer.compare(a, b)`。

---

## 实际应用

```java
// 集合中的基本类型
List<Integer> scores = new ArrayList<>();
scores.add(90);  // 自动装箱

// 空安全
Integer count = map.get(key);
if (count != null) {
    total += count;  // 拆箱
}

// 精确比较
BigDecimal money = new BigDecimal("19.99");  // 金额用 BigDecimal
```

---

## 源码分析

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

缓存减少小整数对象创建，是性能与内存的常见优化。

---

## 面试常见题目

**1. 自动装箱拆箱原理？**

编译器插入 `valueOf` 与 `xxxValue` 调用。

**2. Integer 128 比较？**

128 超出默认缓存，`==` 为 false；应用 `equals`。

**3. 包装类与基本类型性能？**

装箱有对象分配开销；热点路径优先基本类型。

**4. 三元运算符与拆箱 NPE？**

`condition ? a : b` 若类型不一致可能拆箱导致 NPE。

**5. `int` 与 `Integer` 在 HashMap 中？**

`HashMap` 键为对象；`int` 需装箱或使用专门结构（如 `Int2ObjectMap` 第三方库）。

---

## 思维发散

1. 为何没有泛型 `List<int>`？类型擦除与向后兼容；Valhalla 项目的值类型展望。
2. `Boolean` 只有 true/false 两个实例缓存。
3. 性能敏感场景如何避免装箱？流式 API 的 `IntStream` 等。

---

## 相关概念（待扩展）

- 基本语法 — 基本数据类型
- 泛型 — 类型参数与擦除
- 基本数据类型 — 8 种 primitive
