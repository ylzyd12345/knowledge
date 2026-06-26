---
phase: 第二阶段：核心 API 与常用类
type: 机制型
summary: 泛型类、方法、通配符及类型擦除。
related:
  - 集合框架
  - 类型安全
  - 包装类与自动装箱
---

# 泛型

> 泛型类、方法、通配符及类型擦除。

本文深入讲解 Java 泛型与类型擦除机制。反射获取泛型参数见反射专题；泛型与并发结合见集合与并发容器专题。

---

## 概念定义

**泛型（Generics）** 在编译期引入类型参数，使类、接口、方法在声明时参数化类型，提供编译期类型安全，避免强制转换与 `ClassCastException`。

```java
List<String> list = new ArrayList<>();
list.add("a");
String s = list.get(0);  // 无需强转
```

---

## 核心原理

### 1. 泛型类与方法

```java
public class Box<T> {
    private T value;
    public T get() { return value; }
}

public static <T> T identity(T t) { return t; }
```

### 2. 类型通配符

| 形式 | 含义 |
|------|------|
| `?` | 未知类型 |
| `? extends T` | 上界，只读为主（PECS：producer extends） |
| `? super T` | 下界，可写入 T 及其子类（consumer super） |

```java
void copy(List<? extends Number> src, List<? super Number> dest) {
    for (Number n : src) dest.add(n);
}
```

### 3. 类型擦除

编译后泛型信息被擦除为边界或 `Object`：

```java
List<String>  →  List
T extends Number → Number
```

运行时无法 `new T()` 或 `instanceof T`（除非反射 trick）。这是 Java 泛型与 C++ 模板的重要区别。

### 4. 桥方法（Bridge Method）

擦除后子类重写方法可能生成桥方法以保持多态正确性。

### 5. 限制

- 不能 `new T()`
- 不能 `new T[]`（可变泛型数组问题）
- 不能 `instanceof` 带具体类型参数的泛型类
- 静态字段不能引用类型参数

---

## 实际应用

```java
// 类型安全工厂
public static <T> List<T> listOf(T... items) {
    return Arrays.asList(items);
}

// 通配符 API
public double sum(List<? extends Number> nums) {
    double s = 0;
    for (Number n : nums) s += n.doubleValue();
    return s;
}

// 泛型与 super
Collections.sort(list, Comparator.comparing(User::getName));
```

---

## 源码分析

`Class<T>` 的泛型在反射中部分保留：

```java
Field field = clazz.getDeclaredField("list");
Type genericType = field.getGenericType();  // ParameterizedType
```

编译器在字节码 `Signature` 属性中保留泛型签名供反射读取，但运行时列表仍是 raw `List`。

`Arrays.asList(T... a)` 利用泛型数组与擦除，注意传入基本类型数组时的行为差异。

---

## 面试常见题目

**1. 什么是类型擦除？**

编译后泛型参数被擦除为 Object 或边界类型，运行时无 `List<String>` 类型信息。

**2. `? extends` 和 `? super`？**

上界读、下界写；记忆 PECS。

**3. 为何不能 `new T()`？**

擦除后不知道具体类型；可用工厂、Class 参数或 `Supplier<T>`。

**4. 泛型与重载？**

擦除后签名可能冲突，如 `void method(List<String>)` 与 `void method(List<Integer>)` 编译错误。

**5. 泛型数组为何有问题？**

`new List<String>[]` 非法；与数组协变和擦除冲突。

**6. 如何获取泛型实际类型？**

反射 `getGenericSuperclass`、`ParameterizedType`（子类指定父类泛型时）。

---

## 思维发散

1. Java 泛型 vs Kotlin 内联 `reified` 类型参数。
2. 类型擦除对 JSON 序列化框架（Jackson/Gson）的影响。
3. Valhalla 泛型与值类型的未来方向。

---

## 相关概念（待扩展）

- 集合框架 — 泛型集合 API
- 类型安全 — 编译期检查
- 包装类与自动装箱 — 泛型与基本类型
