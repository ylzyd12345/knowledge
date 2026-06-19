---
phase: 第一阶段：Java 基础入门
type: 机制型
summary: 方法定义、重载、递归与参数传递机制。
related:
  - 面向对象编程（OOP）
  - 基本语法
  - 重载
  - 递归
---

# 方法

> 方法定义、重载、递归与参数传递机制。

本文讲解 Java 方法的定义、调用、重载、递归及参数传递规则。反射动态调用方法见反射专题；Lambda 作为函数式替代见 Lambda 表达式专题。

---

## 概念定义

**方法（Method）** 是类或接口中封装的一段可复用逻辑，由方法名、参数列表、返回值与方法体组成。`static` 方法属于类；实例方法属于对象，可访问实例状态。

```java
public static int add(int a, int b) {
    return a + b;
}
```

---

## 核心原理

### 1. 方法签名

由**方法名 + 参数类型列表**组成（不含返回值）。签名决定重载识别与 invokevirtual 解析。

### 2. 重载（Overload）

同类中方法名相同、参数列表不同（类型、个数、顺序）：

```java
void print(int x) { }
void print(String s) { }
void print(int x, String s) { }
```

编译器根据实参类型在编译期选择匹配方法。返回值不同不能单独构成重载。

### 3. 值传递

Java **只有值传递**：

- 基本类型：传递值的副本。
- 引用类型：传递引用的副本（即地址值的拷贝），非传递对象本身。

```java
void swap(int a, int b) { /* 无法改变外部变量 */ }
void modify(List<String> list) { list.add("x"); /* 可改变对象内容 */ }
```

### 4. 递归

方法直接或间接调用自身，须有终止条件与递归深度意识：

```java
public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

过深递归可能导致 `StackOverflowError`（栈帧累积）。

### 5. 可变参数

```java
public static int sum(int... nums) {
    int s = 0;
    for (int n : nums) s += n;
    return s;
}
```

`nums` 在方法内为 `int[]`；可变参数须为最后一个参数。

### 6. 方法重写 vs 重载

| | 重载 | 重写 |
|---|------|------|
| 位置 | 同类 | 子类 |
| 绑定 | 编译期 | 运行期 |
| 签名 | 参数不同 | 相同 |

---

## 实际应用

### 示例：重载与可读 API

```java
public class OrderService {
    public void createOrder(Long userId) { createOrder(userId, null); }
    public void createOrder(Long userId, String coupon) { /* ... */ }
}
```

### 示例：递归遍历目录（示意）

```java
public static void listFiles(File dir, int depth) {
    if (depth > 10) return;  // 防止过深
  File[] files = dir.listFiles();
    if (files == null) return;
    for (File f : files) {
        System.out.println(f.getPath());
        if (f.isDirectory()) listFiles(f, depth + 1);
    }
}
```

---

## 源码分析

`Integer.valueOf` 展示重载与缓存：

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

不同参数类型的 `valueOf` 为重载；小整数走缓存池。

---

## 面试常见题目

**1. Java 是值传递还是引用传递？**

值传递。引用类型传递的是引用的副本。

**2. 重载和重写的区别？**

见上表；重载编译期、重写运行期。

**3. 能否根据返回值区分重载？**

不能。仅返回值不同不构成合法重载。

**4. 递归没有出口会怎样？**

栈溢出 `StackOverflowError`。

**5. main 方法为何 static？**

JVM 启动时调用，尚未创建对象，须通过类名调用。

**6. 方法签名包含返回值吗？**

不包含。

---

## 思维发散

1. 尾递归优化：Java 虚拟机是否优化尾递归？一般不优化，深递归改用循环。
2. 方法内联：JIT 如何将小方法内联提升性能？见 JVM 性能调优。
3. 函数式接口中的「方法」与实例方法的本质区别？Lambda 生成合成方法。

---

## 相关概念（待扩展）

- 面向对象编程（OOP）— 多态与重写
- 基本语法 — 变量与类型
- 重载 — 编译期多态
- 递归 — 分治与树形结构
