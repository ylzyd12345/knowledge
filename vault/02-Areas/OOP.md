---
phase: 第一阶段：Java 基础入门
type: 机制型
summary: 类、对象、封装、继承、多态的核心思想。
related:
  - 方法
  - 访问控制修饰符
  - 面向对象编程（OOP）
  - 类
  - 对象
  - 继承
  - 多态
  - 封装
  - 设计模式
---

# 面向对象编程（OOP）

> 类、对象、封装、继承、多态的核心思想。

本文系统讲解 Java 面向对象的四大特性及类与对象的基础机制。设计模式的具体实现见设计模式专题；反射动态创建对象见反射专题。

---

## 概念定义

**面向对象编程（OOP）** 以「对象」为中心组织代码，将数据与操作数据的方法封装在类中。Java 是纯面向对象语言（除基本类型外），支持四大特性：

| 特性 | 含义 |
|------|------|
| 封装 | 隐藏内部实现，通过公开接口访问 |
| 继承 | 子类复用父类属性和方法 |
| 多态 | 同一引用调用不同子类实现 |
| 抽象 | 抽象类与接口定义规范（与继承、多态配合） |

**类（Class）** 是对象的模板；**对象（Object）** 是类的实例，通过 `new` 在堆上创建。

---

## 核心原理

### 1. 类与对象

```java
public class Person {
    private String name;
    public Person(String name) { this.name = name; }  // 构造方法
    public String getName() { return name; }
}
Person p = new Person("Alice");
```

- 成员变量描述状态，方法描述行为。
- 每个对象有独立的成员变量副本（`static` 除外）。

### 2. 封装

使用 `private` 隐藏字段，通过 `getter/setter` 或业务方法暴露必要操作。配合访问控制修饰符限制可见性（详见访问控制修饰符专题）。

### 3. 继承

```java
class Animal { void speak() { } }
class Dog extends Animal {
    @Override void speak() { System.out.println("汪汪"); }
}
```

- Java **单继承**：一个类只能直接继承一个父类。
- 子类继承非 `private` 成员；`Object` 为所有类的根类。
- `super` 调用父类构造或方法。

### 4. 构造方法与 this/super

- 构造方法名与类名相同，无返回值。
- 子类构造必须调用父类构造（显式 `super(...)` 或隐式调用无参父构造）。
- `this(...)` 调用本类其他构造。

### 5. 多态

**编译看左边，运行看右边**：

```java
Animal a = new Dog();
a.speak();  // 运行 Dog.speak()
```

实现条件：继承/实现关系 + 方法重写。多态用于统一处理多种子类型，是框架与集合 API 的基石。

### 6. 方法重写与重载

- **重写（Override）**：子类重新定义父类方法，签名一致，访问权限不能更严格。
- **重载（Overload）**：同类中方法名相同、参数列表不同（见方法专题）。

### 7. 抽象类与接口（概述）

- `abstract class`：可有抽象方法与普通方法，单继承。
- `interface`：Java 8+ 可有默认方法与静态方法，多实现。
- 本篇不展开接口与抽象类的完整用法，见后续专题。

---

## 实际应用

### 示例：策略式多态

```java
interface Payment { void pay(double amount); }
class Alipay implements Payment {
    public void pay(double amount) { /* ... */ }
}
class WechatPay implements Payment {
    public void pay(double amount) { /* ... */ }
}

void checkout(Payment payment, double amount) {
    payment.pay(amount);  // 多态调用
}
```

### 示例：封装保护不变式

```java
public class BankAccount {
    private final String id;
    private double balance;
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException();
        balance += amount;
    }
}
```

---

## 源码分析

`java.lang.Object` 是所有类的隐式父类：

```java
public class Object {
    public boolean equals(Object obj) { return (this == obj); }
    public int hashCode() { /* native */ }
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

业务实体常重写 `equals`/`hashCode`（如放入 `HashMap` 时），`toString` 便于日志调试。

---

## 面试常见题目

**1. 面向对象四大特性？**

封装、继承、多态、抽象。

**2. 重载与重写的区别？**

重载：同类、参数不同、编译期确定。重写：父子类、签名相同、运行期确定。

**3. 为什么重写 equals 还要重写 hashCode？**

`HashMap`/`HashSet` 依赖二者一致性：相等对象必须有相同哈希码。

**4. 多态的实现原理？**

虚方法表（vtable）：对象调用方法时根据实际类型查表定位方法地址。

**5. 抽象类与接口的区别？**

抽象类单继承、可有构造与状态；接口多实现、侧重契约。Java 8 后接口可有默认方法。

**6. super 和 this 的区别？**

`super` 访问父类成员；`this` 访问当前对象或调用本类构造。

**7. 能否继承多个类？**

不能多继承类；可通过实现多个接口达到类似能力。

---

## 思维发散

1. 组合优于继承：何时用委托代替子类化？设计模式中的策略、装饰器模式。
2. 多态的性能开销？虚方法调用有轻微开销，JIT 可内联消除热点调用。
3. OOP 与函数式：Lambda 与 Stream 是否削弱 OOP？二者在 Java 中互补。

---

## 相关概念（待扩展）

- 方法 — 重载、递归与参数传递
- 访问控制修饰符 — 封装与可见性
- 类 — 类成员与静态成员
- 对象 — 创建与生命周期
- 继承 —  extends 与 super
- 多态 — 向上转型与虚方法
- 封装 — private 与 getter/setter
- 设计模式 — OOP 实践模式
