---
title: "NIO"
tags: [java/io, nio]
stage: 3
status: "permanent"
type: "机制型"
summary: "NIO"
related: []
---

---
phase: 第三阶段：Java 高级特性
type: 机制型
summary: Channel、Buffer、Selector 实现非阻塞 IO。
related:
  - IO流
  - 网络编程
  - 多线程与并发
---

# NIO

> Channel、Buffer、Selector 实现非阻塞 IO。

本文介绍 Java NIO 核心组件与非阻塞多路复用模型。Netty 等框架在 NIO 之上封装，本篇不展开框架 API。

---

## 概念定义

**NIO（New IO / Non-blocking IO）** 提供 `Channel`、`Buffer`、`Selector`，支持非阻塞模式与多路复用，适合高并发网络服务。

与 BIO 对比：BIO 阻塞等待读写；NIO 可注册通道到 `Selector`，单线程轮询多个通道就绪事件。

---

## 核心原理

### 1. Buffer

`ByteBuffer` 等：capacity、position、limit、mark。  
`flip()` 读模式、`clear()` 重置写模式。

### 2. Channel

双向通道：`FileChannel`、`SocketChannel`、`ServerSocketChannel`。  
`read(Buffer)` / `write(Buffer)` 与 Buffer 配合。

### 3. Selector

`select()` 阻塞直到有通道就绪；返回就绪通道集合。  
事件：`OP_READ`、`OP_WRITE`、`OP_CONNECT`、`OP_ACCEPT`。

### 4. 非阻塞模式

`channel.configureBlocking(false)` 后 `read` 可能返回 0，须结合 Selector 与循环/线程模型处理。

### 5. 零拷贝

`FileChannel.transferTo` / `transferFrom` 减少用户态与内核态拷贝次数。

---

## 实际应用

```java
ServerSocketChannel server = ServerSocketChannel.open();
server.bind(new InetSocketAddress(8080));
server.configureBlocking(false);
Selector selector = Selector.open();
server.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select();
    for (SelectionKey key : selector.selectedKeys()) {
        if (key.isAcceptable()) {
            SocketChannel client = server.accept();
            client.configureBlocking(false);
            client.register(selector, SelectionKey.OP_READ);
        } else if (key.isReadable()) {
            SocketChannel ch = (SocketChannel) key.channel();
            ByteBuffer buf = ByteBuffer.allocate(1024);
            int n = ch.read(buf);
            if (n > 0) {
                buf.flip();
                ch.write(buf);
            }
        }
        selector.selectedKeys().remove(key);
    }
}
```

生产环境多用 Netty，手写 Selector 循环较少。

---

## 源码分析

`Selector` 在 Linux 上通常基于 `epoll`，Windows 上 `wepoll` 或 `select`。`sun.nio.ch` 包实现平台相关多路复用。

`ArrayBlockingQueue` 等与 NIO 无直接关系，但高并发下常配合线程池处理业务逻辑。

---

## 面试常见题目

**1. NIO 三大组件？**

Channel、Buffer、Selector。

**2. Buffer 的 flip 作用？**

写完后 `flip()`：limit=position，position=0，切换为读模式。

**3. NIO 与 BIO 区别？**

阻塞 vs 非阻塞；线程模型：BIO 一连接一线程，NIO 可多连接单线程轮询。

**4. 什么是多路复用？**

一个线程监听多个 Channel 的 IO 事件。

**5. 零拷贝是什么？**

减少数据在内核与用户空间之间拷贝次数，提升文件传输性能。

**6. Netty 与 NIO 关系？**

Netty 封装 NIO，提供更易用的 EventLoop、Pipeline。

---

## 思维发散

1. IO 模型：阻塞、非阻塞、多路复用、信号驱动、异步（Linux AIO）。
2. Epoll 水平触发与边缘触发对 Selector 的影响。
3. Java 21 虚拟线程与 NIO 阻塞调用的协同。

---

## 相关概念（待扩展）

- IO流 — 传统 BIO
- 网络编程 — Socket 应用
- 多线程与并发 — Reactor 线程模型
