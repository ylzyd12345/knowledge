---
phase: 第一阶段：Java 基础入门
type: 工具型
summary: 一维和多维数组的声明、初始化与遍历。
related:
  - 基本语法
  - 集合框架
  - 内存结构
  - 循环语句
---

# 数组

> 一维和多维数组的声明、初始化与遍历。

本文介绍 Java 数组的声明、初始化、遍历与多维用法。集合框架的 List 等动态结构见集合框架专题；堆内存分配细节见 JVM 内存模型专题。

---

## 概念定义

**数组（Array）** 是相同类型元素的有序集合，长度固定，在堆上连续存储（引用数组存的是引用）。数组本身是对象，继承自 `Object`，可实现 `Cloneable` 与 `Serializable`。

```java
int[] arr;      // 推荐写法
int arr2[];     // C 风格，合法但不推荐
```

---

## 核心原理

### 1. 声明与初始化

| 方式 | 示例 |
|------|------|
| 声明后赋值 | `int[] a = new int[3];` |
| 字面量 | `int[] a = {1, 2, 3};` |
| 匿名数组 | `new int[]{1, 2, 3}` |

未显式赋值的元素：数值型为 0，`boolean` 为 `false`，引用为 `null`。

### 2. 长度与索引

- `arr.length` 获取长度（非方法，是字段）。
- 合法索引 `0` 到 `length - 1`；越界抛出 `ArrayIndexOutOfBoundsException`。

### 3. 遍历

```java
for (int i = 0; i < arr.length; i++) { }
for (int x : arr) { }
```

### 4. 多维数组

```java
int[][] matrix = new int[3][4];
int[][] irregular = {{1, 2}, {3, 4, 5}};  // 不规则数组
```

本质是「数组的数组」，各行长度可不同。

### 5. 数组与内存

数组对象在堆上，引用变量在栈（或堆中对象字段）中。大数组需注意内存占用与 GC 压力。

---

## 实际应用

### 示例一：复制与排序

```java
int[] src = {3, 1, 4, 1, 5};
int[] copy = Arrays.copyOf(src, src.length);
Arrays.sort(copy);
System.out.println(Arrays.toString(copy));
```

### 示例二：二维矩阵求和

```java
public static int sumMatrix(int[][] m) {
    int sum = 0;
    for (int[] row : m) {
        for (int v : row) {
            sum += v;
        }
    }
    return sum;
}
```

### 示例三：与集合转换

```java
List<String> list = Arrays.asList("a", "b", "c");
// 注意：asList 返回固定大小列表，不能 add/remove
```

---

## 源码分析

`java.util.Arrays` 提供排序、搜索、复制等工具方法。`Arrays.sort` 对基本类型数组使用双轴快排（Dual-Pivot Quicksort），对对象数组使用 TimSort。

```java
// Arrays 部分 API
public static void sort(int[] a)
public static <T> T[] copyOf(T[] original, int newLength)
```

---

## 面试常见题目

**1. 数组长度能改变吗？**

不能。需扩容时创建新数组并复制，或使用 `ArrayList`。

**2. 数组是基本数据类型吗？**

不是。数组是引用类型，是对象。

**3. `int[] a = new int[0]` 合法吗？**

合法，长度为 0 的空数组。

**4. 数组与 ArrayList 的区别？**

数组长度固定、可存基本类型；`ArrayList` 动态扩容、只能存对象（包装类）。

**5. 如何正确比较两个数组内容？**

使用 `Arrays.equals(a, b)`，而非 `a == b`。

---

## 思维发散

1. 为何 Java 同时保留数组和集合？数组性能与内存更紧凑；集合 API 更丰富。
2. 多维数组在内存中是否连续？行连续，行与行之间通过引用连接，不规则数组各行独立分配。
3. 大数组分配在堆的哪个区域？对象数组在堆上，详见 JVM 内存模型。

---

## 相关概念（待扩展）

- 基本语法 — 循环与类型
- 集合框架 — 动态容器
- 内存结构 — 堆与栈
- 循环语句 — for 与 foreach
