---
title: "Math-Utilities"
tags: [java/api, math]
stage: 2
status: "permanent"
type: "工具型"
summary: "Math Utilities"
related: []
---

---
phase: 第二阶段：核心 API 与常用类
type: 工具型
summary: Math、Random、BigDecimal 等数学运算类。
related:
  - 包装类与自动装箱
  - 精度计算
  - 随机数
---

# 数学工具类

> Math、Random、BigDecimal 等数学运算类。

本文介绍 Java 常用数学与精度计算 API。统计与科学计算可结合第三方库（如 Apache Commons Math）。

---

## 概念定义

| 类 | 用途 |
|----|------|
| `Math` | 静态数学函数（三角、幂、取整、随机） |
| `Random` / `ThreadLocalRandom` | 伪随机数 |
| `BigDecimal` | 任意精度十进制，适合金额 |
| `BigInteger` | 任意精度整数 |

---

## 核心原理

### 1. Math

所有方法静态，不可实例化。`Math.random()` 返回 [0,1) 的 `double`，内部使用 `Random`。

### 2. Random 与 ThreadLocalRandom

`Random` 多线程共享有竞争；`ThreadLocalRandom.current()` 线程本地，高并发首选。

### 3. BigDecimal

用 `String` 构造避免精度丢失：`new BigDecimal("0.1")`。  
运算：`add`、`subtract`、`multiply`、`divide`（须指定 `RoundingMode`）。

### 4. 浮点精度问题

```java
0.1 + 0.2 == 0.3  // false
```

二进制无法精确表示部分十进制小数，金额必须用 `BigDecimal`。

---

## 实际应用

```java
// 金额计算
BigDecimal price = new BigDecimal("19.99");
BigDecimal qty = new BigDecimal("3");
BigDecimal total = price.multiply(qty)
    .setScale(2, RoundingMode.HALF_UP);

// 随机整数 [0, n)
int r = ThreadLocalRandom.current().nextInt(n);

// 取整与比较
int max = Math.max(a, b);
double ceil = Math.ceil(2.3);
```

---

## 源码分析

`BigDecimal` 内部用 `BigInteger` 存无标度值 + `int scale` 表小数位数。`divide` 无法精确表示时须指定舍入模式，否则抛 `ArithmeticException`。

---

## 面试常见题目

**1. float/double 为何不适合金额？**

二进制浮点精度误差；`BigDecimal` 十进制精确。

**2. BigDecimal 如何比较？**

`compareTo`，不用 `equals`（`equals` 比较 scale）。

**3. `Random` 线程安全吗？**

`Random` 内部同步，多线程竞争；用 `ThreadLocalRandom`。

**4. `Math.round` 与 `Math.floor`？**

`round` 四舍五入到 long；`floor` 向下取整。

**5. 如何生成安全随机数？**

`SecureRandom` 用于密码学场景，非 `Random`。

---

## 思维发散

1. 银行家舍入 `HALF_EVEN` 与 `HALF_UP` 在报表中的影响。
2. 大数运算性能：`BigInteger` 模幂在 RSA 中的应用。
3. 是否需要 `double` 做科学计算？注意累积误差与 Kahan 求和。

---

## 相关概念（待扩展）

- 包装类与自动装箱 — 数值对象
- 精度计算 — 舍入与标度
- 随机数 — 伪随机与真随机
