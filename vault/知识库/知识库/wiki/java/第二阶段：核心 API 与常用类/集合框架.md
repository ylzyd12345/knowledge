---
phase: 第二阶段：核心 API 与常用类
type: 地图型
summary: List、Set、Map 体系及常用实现类。
related:
  - 泛型
  - 迭代器
  - Comparable与Comparator
  - 异常处理
  - 并发容器
---

# 集合框架

> List、Set、Map 体系及常用实现类。

本文建立 Java 集合体系全景图。各实现类内部结构、并发容器、Stream 操作分别见并发容器、泛型、Stream API 等专题。

---

## 概念定义

**集合框架（Collections Framework）** 提供一套标准接口与实现，用于存储和操作对象组。根接口分为两条线：

```
Collection
├── List（有序可重复）
├── Set（不重复）
└── Queue（队列）

Map（键值对，独立接口）
```

所有标准集合实现均非线程安全（并发版本见并发容器专题）。

---

## 核心原理

### 1. List 常见实现

| 实现 | 底层 | 特点 |
|------|------|------|
| `ArrayList` | 动态数组 | 随机访问快，尾部增删快 |
| `LinkedList` | 双向链表 | 头尾插入快，查询慢 |
| `Vector` | 数组 | 遗留，线程安全但少用 |

### 2. Set 常见实现

| 实现 | 底层 | 特点 |
|------|------|------|
| `HashSet` | 哈希表 | O(1) 增删查，无序 |
| `LinkedHashSet` | 哈希表+链表 | 保持插入顺序 |
| `TreeSet` | 红黑树 | 有序，O(log n) |

### 3. Map 常见实现

| 实现 | 特点 |
|------|------|
| `HashMap` | 最常用，无序，允许 null 键值（一个 null 键） |
| `LinkedHashMap` | 插入或访问顺序 |
| `TreeMap` | 键排序 |
| `Hashtable` | 遗留，同步，少用 |

### 4. 迭代器 Iterator

`iterator()` 返回迭代器；`for-each` 底层使用迭代器。`Iterator.remove()` 安全删除；`for-each` 中不能直接 `list.remove()`。

### 5. Comparable 与 Comparator

- `Comparable`：自然排序，`compareTo` 写在类内。
- `Comparator`：外部比较器，`Comparator.comparing(User::getName)`。

### 6. 与泛型

集合声明类型参数 `List<String>`，编译期类型安全（详见泛型专题）。

---

## 实际应用

```java
List<String> list = new ArrayList<>();
Map<String, Integer> map = new HashMap<>();
Set<Long> ids = new HashSet<>();

// 遍历
for (String s : list) { }
list.forEach(s -> System.out.println(s));

// 排序
list.sort(Comparator.comparing(String::length));

// 不可变集合 Java 9+
List<String> frozen = List.of("a", "b");
```

---

## 源码分析

`HashMap` 在 Java 8+ 数组+链表/红黑树：链表长度超过 8 转红黑树，低于 6 退化为链表。本篇不展开扩容与哈希算法，见机制型深入阅读。

```java
// HashMap 概览（概念）
// table[] -> Node 链表或 TreeNode 红黑树
```

---

## 面试常见题目

**1. ArrayList 与 LinkedList 区别？**

数组 vs 链表；随机访问 vs 插入删除场景不同。

**2. HashMap 原理？**

数组+链表/红黑树；哈希、扩容、负载因子 0.75（专题详述）。

**3. HashSet 如何保证不重复？**

内部封装 `HashMap`，元素作 key。

**4. fail-fast 与 fail-safe？**

`ArrayList` 迭代时结构修改抛 `ConcurrentModificationException`；`CopyOnWriteArrayList` 为 fail-safe 快照迭代。

**5. 如何选择集合？**

有序列表 `ArrayList`；去重 `HashSet`；键值 `HashMap`；排序 `TreeSet`/`TreeMap`；并发见并发容器。

---

## 思维发散

1. 集合与 Stream 的关系：Stream 不存储数据，管道操作集合。
2. 为何 Map 不继承 Collection？键值对与单元素模型不同。
3. 集合框架的设计模式：迭代器、适配器（`Arrays.asList`）。

---

## 相关概念（待扩展）

- 泛型 — 类型参数与擦除
- 迭代器 — Iterator 与 fail-fast
- Comparable与Comparator — 排序策略
- 异常处理 — ConcurrentModificationException
- 并发容器 — 线程安全实现
