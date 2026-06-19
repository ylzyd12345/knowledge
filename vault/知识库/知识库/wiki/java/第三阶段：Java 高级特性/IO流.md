---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: 字节流、字符流、缓冲流及序列化操作。
related:
  - NIO
  - 文件操作
  - 序列化
  - 网络编程
---

# IO流

> 字节流、字符流、缓冲流及序列化操作。

本文讲解传统 IO（BIO）的流体系与常用操作。NIO 非阻塞模型见 NIO 专题；网络 IO 见网络编程专题。

---

## 概念定义

**IO 流**将输入输出抽象为流，按数据单位分为：

| 类型 | 基类 | 单位 |
|------|------|------|
| 字节流 | `InputStream` / `OutputStream` | byte |
| 字符流 | `Reader` / `Writer` | char（处理编码） |

装饰器模式：`BufferedInputStream` 包装底层流增加缓冲；`InputStreamReader` 字节转字符。

---

## 核心原理

### 1. 字节流常用类

- `FileInputStream` / `FileOutputStream`：文件
- `BufferedInputStream` / `BufferedOutputStream`：缓冲
- `DataInputStream` / `DataOutputStream`：基本类型

### 2. 字符流常用类

- `FileReader` / `FileWriter`
- `BufferedReader` / `BufferedWriter`：`readLine()`
- `InputStreamReader` / `OutputStreamWriter`：指定 `Charset`

### 3. 缓冲的意义

减少系统调用，默认缓冲 8KB 左右，大幅提升读写性能。

### 4. 序列化

`ObjectOutputStream` 将对象写为字节流；对象须实现 `Serializable`（`serialVersionUID` 建议显式声明）。`transient` 字段不序列化。

### 5. try-with-resources

流必须关闭，优先使用 try-with-resources 防止泄漏。

---

## 实际应用

```java
// 文本文件读取
try (BufferedReader br = new BufferedReader(
        new FileReader("data.txt", StandardCharsets.UTF_8))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}

// 文件复制
try (InputStream in = new FileInputStream(src);
     OutputStream out = new FileOutputStream(dest)) {
    byte[] buf = new byte[8192];
    int len;
    while ((len = in.read(buf)) != -1) {
        out.write(buf, 0, len);
    }
}
```

---

## 源码分析

`InputStream.read()` 默认一次读一字节，效率低；`BufferedInputStream` 内部 `fill()` 批量读入缓冲区，`read()` 从缓冲区取。

`FilterInputStream` 是装饰器基类，体现 IO 库设计模式。

---

## 面试常见题目

**1. 字节流与字符流区别？**

字节处理二进制；字符处理文本并涉及编码转换。

**2. 为何需要缓冲流？**

减少底层 IO 次数，提高性能。

**3. 序列化注意事项？**

`serialVersionUID`、敏感字段 `transient`、版本兼容、安全（反序列化漏洞）。

**4. BIO 缺点？**

阻塞：线程与连接绑定，高并发下线程多。NIO/Netty 解决。

**5. 如何正确关闭流？**

try-with-resources 或 finally 中关闭，注意关闭顺序。

---

## 思维发散

1. Java 7 `Files` 与 NIO.2 简化文件操作。
2. 大文件传输：零拷贝 `FileChannel.transferTo`。
3. 序列化替代：JSON、Protobuf 跨语言与安全性。

---

## 相关概念（待扩展）

- NIO — 非阻塞 IO
- 文件操作 — Path 与 Files
- 序列化 — 对象持久化
- 网络编程 — Socket 流
