---
phase: 第五阶段：Java 生态与主流框架
type: 框架型
summary: Docker/K8s 实现应用容器化与编排。
related:
  - 持续集成（CI）/持续部署（CD）
  - 云原生
  - Spring Boot
  - 构建工具
---

# 容器化与部署

> Docker/K8s 实现应用容器化与编排。

本文介绍 Docker 基础与 Kubernetes 核心概念。完整云原生体系见 DevOps 与云原生专题。

---

## 概念定义

| 技术 | 作用 |
|------|------|
| **Docker** | 容器运行时，镜像打包应用与依赖 |
| **Docker Compose** | 多容器本地编排 |
| **Kubernetes（K8s）** | 集群级容器编排、调度、扩缩容 |

容器共享宿主机内核，比虚拟机更轻量，是云原生部署的标准单元。

---

## 核心原理

### 1. Docker 核心

- **镜像（Image）**：只读层，由 Dockerfile 构建
- **容器（Container）**：镜像运行实例
- **仓库（Registry）**：镜像存储（Docker Hub、Harbor）

```dockerfile
FROM eclipse-temurin:17-jre
COPY target/app.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 2. Docker Compose

`docker-compose.yml` 定义多服务、网络、卷，一键 `up/down`。

### 3. Kubernetes 核心对象

| 对象 | 说明 |
|------|------|
| Pod | 最小调度单元，含一个或多个容器 |
| Deployment | 无状态应用部署与滚动更新 |
| Service | 集群内稳定访问入口（ClusterIP/NodePort/Ingress） |
| ConfigMap / Secret | 配置与敏感信息 |
| Ingress | HTTP 路由到 Service |

### 4. 部署策略

滚动更新、蓝绿、金丝雀（配合 Ingress 权重或 Argo Rollouts）。

### 5. Java 应用注意点

容器内存限制与 JVM `-XX:MaxRAMPercentage`；优雅停机 `preStop` + Spring `graceful shutdown。

---

## 实际应用

```bash
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0

kubectl apply -f deployment.yaml
kubectl get pods
kubectl logs -f pod-name
```

```yaml
# Deployment 片段
spec:
  replicas: 3
  template:
  spec:
    containers:
    - name: app
      image: myapp:1.0
      resources:
        limits:
          memory: "1Gi"
      env:
      - name: JAVA_OPTS
        value: "-XX:MaxRAMPercentage=75.0"
```

---

## 源码分析

Docker 基于 Linux namespace、cgroup、union filesystem。  
K8s 控制器循环（Deployment Controller）对比期望副本数与实际 Pod 状态，驱动调谐。

---

## 面试常见题目

**1. 容器和虚拟机区别？**

容器共享内核、启动快、更轻；VM 完整 OS 隔离更强。

**2. Dockerfile 最佳实践？**

多阶段构建、非 root 用户、最小基础镜像、分层缓存。

**3. Pod 和容器关系？**

Pod 是 K8s 调度单位，通常一容器一进程模型。

**4. Service 类型？**

ClusterIP 集群内；NodePort 节点端口；LoadBalancer 云 LB。

**5. Java 容器 OOMKilled？**

JVM 堆超过 cgroup memory limit；调整 MaxRAMPercentage 或 limit。

---

## 思维发散

1. Helm Chart 与 GitOps（ArgoCD）。
2. Serverless（Knative）与容器的关系。
3. 镜像安全扫描与最小攻击面。

---

## 相关概念（待扩展）

- 持续集成（CI）/持续部署（CD）— 流水线发布
- 云原生 — 12 要素与可移植性
- Spring Boot — 可执行 JAR 与容器
- 构建工具 — 镜像构建插件
