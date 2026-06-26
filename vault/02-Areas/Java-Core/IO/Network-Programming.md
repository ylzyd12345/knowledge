---
title: "Network-Programming"
tags: [java/io, network-programming]
stage: 4
status: "permanent"
type: "机制型"
summary: "Network Programming"
related: []
---

---
phase: 第四阶段：实用工具与开发进阶
type: 工具型
summary: Socket、ServerSocket 与 UDP 网络通信。
related:
  - IO流
  - NIO
  - REST API
  - Spring MVC
---

# 网络编程

> Socket、ServerSocket 与 UDP 网络通信。

本文介绍 Java 传统 Socket 编程与 HTTP 客户端基础。REST 与 Spring MVC 见对应专题；高性能服务常用 Netty。

---

## 概念定义

| 概念 | 说明 |
|------|------|
| TCP | 可靠、面向连接，Socket / ServerSocket |
| UDP | 无连接，DatagramSocket / DatagramPacket |
| HTTP | 应用层协议，HttpClient（Java 11+） |

IP + 端口标识端点；`InetAddress` 表示地址。

---

## 核心原理

### 1. TCP 服务端/客户端

ServerSocket `accept()` 阻塞等待连接；每个连接 Socket 读写流通信。

### 2. UDP

发送方打包 DatagramPacket，接收方 `receive()`；不保证顺序与到达。

### 3. HTTP 客户端

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest req = HttpRequest.newBuilder(URI.create(url)).GET().build();
HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());
```

### 4. 与 IO

Socket `getInputStream()`/`getOutputStream()` 基于字节流；文本需指定编码。

---

## 实际应用

```java
// TCP 简易服务端（示意）
try (ServerSocket server = new ServerSocket(8080)) {
    Socket client = server.accept();
    try (BufferedReader in = new BufferedReader(
            new InputStreamReader(client.getInputStream()))) {
        String line = in.readLine();
        // handle
    }
}
```

生产环境使用连接池、超时、心跳与 Netty/Spring Web 替代裸 Socket。

---

## 源码分析

`Socket` 底层为平台 Socket 的 JNI 封装。`HttpClient` 支持 HTTP/2、异步 `sendAsync`。

---

## 面试常见题目

**1. TCP 和 UDP 区别？**

可靠有序 vs 快且无连接；场景不同。

**2. Socket 编程基本步骤？**

bind/listen/accept/connect/read/write/close。

**3. 如何实现端口复用？**

`ServerSocket` 多线程或 NIO 多路复用。

**4. HTTP 长连接？**

Keep-Alive；HTTP/2 多路复用。

**5. 粘包拆包？**

应用层协议定界（长度头、分隔符）；Netty 解码器。

---

## 思维发散

1. WebSocket 与 HTTP 升级机制。
2. gRPC 与 REST 在 Java 中的选型。
3. 云原生下 Service Mesh 与 Socket 编程的边界。

---

## 相关概念（待扩展）

- IO流 — 字节流读写
- NIO — 高并发网络
- REST API — HTTP 资源风格
- Spring MVC — Web 层框架
