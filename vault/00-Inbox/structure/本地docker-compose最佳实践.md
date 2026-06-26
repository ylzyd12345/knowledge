以下是一份**完整版的 `docker-compose.yml` 配置**，整合了之前所有讨论的组件，包括 **Nginx、Loki、MinIO** 等全部内容，开箱即用。

---

## 以下是完整版 **目录结构** 和 **避坑指南**，确保你能够顺利部署并避免常见问题。

---

## 📁 完整目录结构

```bash
project-root/
├── docker-compose.yml                # 核心编排文件
├── .env                              # 环境变量（所有密码/端口集中管理）
│
├── init-scripts/                     # MySQL 初始化脚本目录
│   └── 01-init.sql                   # 建库建表脚本（自动执行）
│
├── nginx/                            # Nginx 配置目录
│   ├── nginx.conf                    # 主配置文件
│   ├── conf.d/
│   │   └── default.conf              # 站点/代理配置
│   └── html/                         # 静态文件目录（可选）
│       └── index.html
│
├── loki/                             # Loki 配置目录
│   └── loki-config.yaml              # Loki 配置文件
│
├── promtail/                         # Promtail 配置目录
│   └── promtail-config.yaml          # Promtail 配置文件
│
├── prometheus/                       # Prometheus 配置目录
│   └── prometheus.yml                # Prometheus 配置文件
│
├── grafana/                          # Grafana 配置目录
│   ├── datasources/                  # 数据源自动配置
│   │   └── datasource.yml
│   └── dashboards/                   # 仪表盘自动配置
│       └── dashboard.yml
│
├── minio/                            # MinIO 数据目录
│   └── data/                         # 实际存储数据（自动创建）
│
└── data/                             # 所有有状态服务的数据持久化
    ├── mysql/                        # MySQL 数据文件
    ├── redis/                        # Redis RDB/AOF 文件
    ├── rabbitmq/                     # RabbitMQ 数据
    ├── elasticsearch/                # ES 索引数据
    ├── loki/                         # Loki 日志块
    ├── prometheus/                   # Prometheus TSDB
    └── grafana/                      # Grafana 插件/配置

# 日志目录（便于集中查看）
logs/
├── nacos/                            # Nacos 日志
└── skywalking/                       # SkyWalking 日志
```

---

## 🚨 完整避坑指南（按组件分类）

### 一、通用避坑

| 问题         | 原因          | 解决方案                                             |
|:---------- |:----------- |:------------------------------------------------ |
| **容器启动失败** | 端口被占用       | 检查 `netstat -ano \| findstr :端口`，修改 `.env` 中对应端口 |
| **容器反复重启** | 内存限制过小      | 调大 `deploy.resources.limits.memory`              |
| **数据丢失**   | 未挂载数据卷      | 所有有状态服务必须挂载 `./data/服务名`                         |
| **时间混乱**   | 容器时区与宿主机不一致 | 挂载 `/etc/localtime:/etc/localtime:ro`            |
| **磁盘占满**   | 容器日志无限增长    | 全局配置 `logging.max-size: 10m`                     |

### 二、MySQL 避坑

| 问题           | 原因                    | 解决方案                                                         |
|:------------ |:--------------------- |:------------------------------------------------------------ |
| **启动失败**     | `./data/mysql` 目录权限不足 | 执行 `chmod -R 755 ./data/mysql`                               |
| **初始化脚本未执行** | 脚本放在错误目录              | 必须放在 `init-scripts/`，且以 `.sql` 或 `.sh` 结尾                    |
| **中文乱码**     | 字符集不是 UTF-8           | `command` 中添加 `--character-set-server=utf8mb4`               |
| **主从复制失败**   | GTID 未启用              | `command` 中添加 `--gtid-mode=ON --enforce-gtid-consistency=ON` |
| **连接数超限**    | `max_connections` 太小  | 已设置为 100，如需调大可修改                                             |

### 三、Redis 避坑

| 问题        | 原因              | 解决方案                                            |
|:--------- |:--------------- |:----------------------------------------------- |
| **数据丢失**  | 未开启 AOF/RDB 持久化 | `command` 已包含 `--appendonly yes` 和 `--save`     |
| **内存耗尽**  | 未设置 `maxmemory` | 已设置 `--maxmemory 256mb`，确保触发淘汰策略                |
| **连接被拒绝** | 绑定地址问题          | 默认监听 `0.0.0.0`（容器内），通过 `ports` 映射到宿主机           |
| **性能差**   | 持久化策略频繁         | 调整 `--save 300 10` 为 `--save 600 100`（减少磁盘 I/O） |

### 四、Elasticsearch 避坑

| 问题           | 原因                                        | 解决方案                                                                                                                |
|:------------ |:----------------------------------------- |:------------------------------------------------------------------------------------------------------------------- |
| **启动失败（致命）** | `vm.max_map_count` 不足（ES 8.x 必须 ≥ 262144） | **宿主机执行**：<br>`sudo sysctl -w vm.max_map_count=262144`<br>永久生效：`echo "vm.max_map_count=262144" >> /etc/sysctl.conf` |
| **启动失败**     | `./data/elasticsearch` 权限不足               | `chmod -R 777 ./data/elasticsearch`（容器内用户 UID=1000）                                                                 |
| **内存 OOM**   | JVM 堆内存过大                                 | `ES_JAVA_OPTS=-Xms256m -Xmx512m` 已设置，≤ 物理内存 50%                                                                     |
| **集群不可用**    | `discovery.type` 不正确                      | 已设置 `single-node`，多节点需改为 `zen`                                                                                      |
| **认证问题**     | ES 8.x 默认开启安全认证                           | 已设置 `xpack.security.enabled=false`                                                                                  |

### 五、MinIO 避坑

| 问题              | 原因                    | 解决方案                                                    |
|:--------------- |:--------------------- |:------------------------------------------------------- |
| **启动失败**        | `./minio/data` 目录权限不足 | `chmod -R 755 ./minio/data`                             |
| **上传文件报错**      | 磁盘空间不足                | 检查磁盘容量，清理多余文件                                           |
| **控制台登录失败**     | 密码包含特殊字符              | `.env` 中密码避免使用 `$`、`&`、`#` 等符号                          |
| **端口冲突**        | 9000/9001 被占用         | 修改 `.env` 中的 `MINIO_API_PORT` 和 `MINIO_CONSOLE_PORT`    |
| **无法创建 bucket** | 启动后 bucket 不存在        | 使用 `mc` 客户端创建，或在 `command` 中添加 `--init-bucket=mybucket` |

### 六、Nacos 避坑

| 问题                  | 原因                               | 解决方案                            |
|:------------------- |:-------------------------------- |:------------------------------- |
| **服务注册失败**          | gRPC 端口 `9848` 未开放               | **必须同时暴露 `8848` 和 `9848`**，已配置  |
| **内存占用过高**          | JVM 默认堆 1GB                      | `JVM_XMS=256m JVM_XMX=256m` 已设置 |
| **配置中心无法使用**        | `SPRING_DATASOURCE_PLATFORM` 不正确 | 本地开发使用 `derby`，生产改为 `mysql`     |
| **集群模式下节点不同步**      | 未设置 `NACOS_SERVERS`              | 生产环境需配置集群地址列表                   |
| **Nacos 2.3+ 无法登录** | 认证未正确关闭                          | 添加 `NACOS_AUTH_ENABLE="false"`  |

### 七、Seata 避坑

| 问题                   | 原因                        | 解决方案                                         |
|:-------------------- |:------------------------- |:-------------------------------------------- |
| **事务回滚失败**           | `STORE_MODE=file` 无法多实例共享 | 本地开发用 `file`，生产必须改为 `db`                     |
| **客户端连接失败**          | `SEATA_IP` 指向错误           | 已设置为 `seata`（容器服务名）                          |
| **事务日志丢失**           | 未持久化                      | 挂载 `./data/seata` 目录                         |
| **Seata 1.6+ 兼容性问题** | 依赖版本不匹配                   | 确保 `spring-cloud-starter-alibaba-seata` 版本对应 |

### 八、SkyWalking 避坑

| 问题             | 原因                                         | 解决方案                          |
|:-------------- |:------------------------------------------ |:----------------------------- |
| **OAP 启动失败**   | 内存不足                                       | `JAVA_OPTS=-Xmx512m` 已设置      |
| **链路数据无法查询**   | `SW_STORAGE=h2` 数据未持久化                     | 挂载 `./data/skywalking`（如需持久化） |
| **Agent 无法连接** | `SW_AGENT_COLLECTOR_BACKEND_SERVICES` 端口错误 | OAP 默认 gRPC 端口 `11800`        |
| **UI 显示无数据**   | OAP 未就绪或存储为 H2 内存模式                        | 等待 `start_period: 30s` 后刷新    |
| **生产环境性能瓶颈**   | H2 存储不适合大规模数据                              | 生产环境改为 Elasticsearch 存储       |

### 九、Loki + Promtail 避坑

| 问题            | 原因                              | 解决方案                                                       |
|:------------- |:------------------------------- |:---------------------------------------------------------- |
| **日志采集不到**    | `/var/run/docker.sock` 未挂载或权限不足 | 确保 `volumes` 正确挂载，执行 `sudo chmod 666 /var/run/docker.sock` |
| **日志写入慢**     | Loki 默认配置写入延迟高                  | 降低 `chunk_target_size`，本地开发可设置 `max_concurrent: 4`         |
| **磁盘快速占满**    | 未配置数据保留策略                       | `retention_period: 168h`（7天）已配置                            |
| **查询超时**      | 单次查询数据量过大                       | 设置 `limits_config.max_entries_limit: 5000`                 |
| **采集到无关容器日志** | 未过滤项目                           | 在 Promtail 配置中添加 `action: keep` 按项目名过滤                     |

### 十、Nginx 避坑

| 问题             | 原因                      | 解决方案                                  |
|:-------------- |:----------------------- |:------------------------------------- |
| **配置不生效**      | 配置文件语法错误                | `docker exec dev-nginx nginx -t` 检查语法 |
| **热加载失败**      | `nginx -s reload` 不支持容器 | 使用 `docker kill -s HUP dev-nginx`     |
| **代理后端 502**   | 后端服务未启动或服务名错误           | 检查 `upstream` 中的服务名和端口                |
| **静态资源 404**   | `html` 目录未挂载或路径错误       | 确认 `./nginx/html` 存在且包含文件             |
| **HTTPS 无法访问** | 缺少证书                    | 挂载证书目录并配置 `ssl_certificate`           |

### 十一、Grafana + Prometheus 避坑

| 问题                    | 原因                       | 解决方案                                                |
|:--------------------- |:------------------------ |:--------------------------------------------------- |
| **Prometheus 启动失败**   | `./data/prometheus` 权限不足 | `chmod -R 755 ./data/prometheus`                    |
| **Grafana 插件安装超时**    | 外网访问受限                   | 可注释 `GF_INSTALL_PLUGINS`，手动安装                       |
| **Prometheus 无法抓取指标** | `targets` 地址错误           | 使用 `host.docker.internal:端口` 访问宿主机服务                |
| **Grafana 数据源连接失败**   | 数据源 URL 错误               | 内网使用 `http://prometheus:9090`                       |
| **仪表盘不显示**            | 未配置 provisioning         | 挂载 `./grafana/datasources` 和 `./grafana/dashboards` |

### 十二、端口冲突完整清单

| 端口    | 默认服务          | 常见冲突源              | 解决方案             |
|:----- |:------------- |:------------------ |:---------------- |
| 3306  | MySQL         | 本地 MySQL / MariaDB | 改为 `3307:3306`   |
| 6379  | Redis         | 本地 Redis 服务        | 改为 `6380:6379`   |
| 5672  | RabbitMQ      | 其他消息中间件            | 改为 `5673:5672`   |
| 15672 | RabbitMQ 管理   | —                  | 改为 `15673:15672` |
| 9200  | Elasticsearch | 本地 ES 实例           | 改为 `9201:9200`   |
| 9000  | MinIO API     | 本地 Web 服务          | 改为 `9002:9000`   |
| 9001  | MinIO 控制台     | —                  | 改为 `9003:9001`   |
| 8848  | Nacos         | 其他 Nacos 实例        | 改为 `8849:8848`   |
| 9848  | Nacos gRPC    | —                  | 改为 `9849:9848`   |
| 8858  | Sentinel      | —                  | 改为 `8859:8858`   |
| 8091  | Seata         | —                  | 改为 `8092:8091`   |
| 8080  | SkyWalking UI | IDEA / 本地 Web 服务   | 改为 `8081:8080`   |
| 9090  | Prometheus    | —                  | 改为 `9091:9090`   |
| 3000  | Grafana       | React/Vue 开发服务器    | 改为 `3001:3000`   |
| 3100  | Loki          | —                  | 改为 `3101:3100`   |
| 80    | Nginx         | IIS / 其他 Web 服务    | 改为 `8080:80`     |

---

## ✅ 部署前检查清单

| 检查项                   | 命令/操作                                 |
|:--------------------- |:------------------------------------- |
| **Docker 版本**         | `docker --version`（需 ≥ 20.10）         |
| **Docker Compose 版本** | `docker compose version`（需 ≥ 2.0）     |
| **可用磁盘空间**            | `df -h`（至少 20GB 可用）                   |
| **可用内存**              | `free -h`（至少 4GB 可用）                  |
| **端口占用检查**            | `netstat -ano \| findstr :3306`（逐个检查） |
| **vm.max_map_count**  | `sysctl vm.max_map_count`（需 ≥ 262144） |
| **目录权限**              | `chmod -R 755 ./data ./logs ./minio`  |
| **.env 文件**           | 确认所有密码非默认（生产环境）                       |
| **配置文件语法**            | `docker-compose config`（检查 YAML 语法）   |
| **网络连通性**             | `docker network ls`（确认网络未冲突）          |

---

## 📋 一键创建目录脚本（Windows PowerShell）

```powershell
# 在项目根目录执行
$dirs = @(
    "data/mysql", "data/redis", "data/rabbitmq", "data/elasticsearch",
    "data/prometheus", "data/grafana", "data/loki",
    "logs/nacos", "logs/skywalking",
    "nginx/conf.d", "nginx/html",
    "loki", "promtail",
    "minio/data",
    "init-scripts",
    "prometheus",
    "grafana/datasources", "grafana/dashboards"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir
}
Write-Host "所有目录已创建完成！" -ForegroundColor Green
```

---

## 💎 总结：最关键的三条避坑原则

1. **先检查 `vm.max_map_count`**：Elasticsearch 启动前必须执行 `sysctl -w vm.max_map_count=262144`，否则 ES 容器会直接退出。
2. **不要同时映射 `127.0.0.1:端口` 和暴露端口到外网**：本地开发建议保持默认（`0.0.0.0`），生产环境务必改为 `127.0.0.1:端口:端口` 或使用防火墙。
3. **按需启动，不要一次性拉起所有服务**：16GB 内存能跑完整栈，但建议使用 `docker-compose up -d mysql redis nacos minio` 先启动核心依赖，按需增加其他服务。





## 📄 完整版 `docker-compose.yml`

```yaml
version: '3.8'

# ============================================
# 0. 全局日志配置（所有服务生效）
# ============================================
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

# ============================================
# 1. 网络配置
# ============================================
networks:
  dev-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1

# ============================================
# 2. 服务定义
# ============================================
services:

  # ==========================================
  # 2.1 基础中间件层
  # ==========================================

  # ---------- MySQL 8.0 ----------
  mysql:
    image: mysql:8.0
    container_name: dev-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-microservice_dev}
      MYSQL_USER: ${MYSQL_USER:-dev_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-dev_pass}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
      - ./init-scripts:/docker-entrypoint-initdb.d
      - /etc/localtime:/etc/localtime:ro
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb_buffer_pool_size=256M
      - --max_connections=100
      - --log-bin=mysql-bin
      - --binlog-format=ROW
      - --gtid-mode=ON
      - --enforce-gtid-consistency=ON
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD:-root123}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - dev-network

  # ---------- Redis 7.0 ----------
  redis:
    image: redis:7.0-alpine
    container_name: dev-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - ./data/redis:/data
      - /etc/localtime:/etc/localtime:ro
    command: >
      redis-server
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
      --save 60 10000
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- RabbitMQ ----------
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: dev-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-admin123}
      RABBITMQ_VM_MEMORY_HIGH_WATERMARK: 256MB
    ports:
      - "${RABBITMQ_PORT:-5672}:5672"
      - "${RABBITMQ_MANAGEMENT_PORT:-15672}:15672"
    volumes:
      - ./data/rabbitmq:/var/lib/rabbitmq
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Elasticsearch ----------
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    container_name: dev-elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms256m -Xmx512m"
    ports:
      - "${ELASTICSEARCH_PORT:-9200}:9200"
      - "${ELASTICSEARCH_CLUSTER_PORT:-9300}:9300"
    volumes:
      - ./data/elasticsearch:/usr/share/elasticsearch/data
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9200/_cluster/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    deploy:
      resources:
        limits:
          memory: 768M
        reservations:
          memory: 512M
    networks:
      - dev-network

  # ---------- MinIO（对象存储） ----------
  minio:
    image: minio/minio:latest
    container_name: dev-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin123}
    ports:
      - "${MINIO_API_PORT:-9000}:9000"
      - "${MINIO_CONSOLE_PORT:-9001}:9001"
    volumes:
      - ./minio/data:/data
      - /etc/localtime:/etc/localtime:ro
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - dev-network

  # ==========================================
  # 2.2 微服务治理层
  # ==========================================

  # ---------- Nacos 2.x ----------
  nacos:
    image: nacos/nacos-server:v2.2.3
    container_name: dev-nacos
    restart: unless-stopped
    environment:
      MODE: standalone
      PREFER_HOST_MODE: hostname
      SPRING_DATASOURCE_PLATFORM: derby
      JVM_XMS: 256m
      JVM_XMX: 256m
      NACOS_AUTH_ENABLE: "false"
    ports:
      - "${NACOS_PORT:-8848}:8848"
      - "${NACOS_GRPC_PORT:-9848}:9848"
    volumes:
      - ./logs/nacos:/home/nacos/logs
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8848/nacos/v1/console/health/readiness"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - dev-network

  # ---------- Sentinel Dashboard ----------
  sentinel:
    image: bladex/sentinel-dashboard:1.8.6
    container_name: dev-sentinel
    restart: unless-stopped
    environment:
      JAVA_OPTS: "-Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858 -Dproject.name=sentinel-dashboard -Xmx256m"
    ports:
      - "${SENTINEL_PORT:-8858}:8858"
    volumes:
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8858/"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Seata Server ----------
  seata:
    image: seataio/seata-server:1.6.1
    container_name: dev-seata
    restart: unless-stopped
    environment:
      SEATA_IP: seata
      SEATA_PORT: 8091
      STORE_MODE: file
    ports:
      - "${SEATA_PORT:-8091}:8091"
    volumes:
      - ./data/seata:/seata-server/resources
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8091/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Spring Cloud Gateway（示例） ----------
  # 如果你有自定义网关镜像，取消注释以下配置
  # gateway:
  #   image: your-gateway-image:latest
  #   container_name: dev-gateway
  #   restart: unless-stopped
  #   environment:
  #     SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: nacos:8848
  #     SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR: nacos:8848
  #   ports:
  #     - "${GATEWAY_PORT:-8080}:8080"
  #   depends_on:
  #     - nacos
  #   deploy:
  #     resources:
  #       limits:
  #         memory: 512M
  #       reservations:
  #         memory: 256M
  #   networks:
  #     - dev-network

  # ==========================================
  # 2.3 网关与负载均衡层
  # ==========================================

  # ---------- Nginx ----------
  nginx:
    image: nginx:stable-alpine
    container_name: dev-nginx
    restart: unless-stopped
    ports:
      - "${NGINX_HTTP_PORT:-80}:80"
      - "${NGINX_HTTPS_PORT:-443}:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/html:/usr/share/nginx/html:ro
      - /etc/localtime:/etc/localtime:ro
    # 如果网关未启用，先注释 depends_on
    # depends_on:
    #   - gateway
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 128M
        reservations:
          memory: 64M
    networks:
      - dev-network

  # ==========================================
  # 2.4 可观测性层
  # ==========================================

  # ---------- SkyWalking OAP ----------
  skywalking-oap:
    image: apache/skywalking-oap-server:9.7.0
    container_name: dev-skywalking-oap
    restart: unless-stopped
    environment:
      SW_STORAGE: h2
      SW_AGENT_COLLECTOR_BACKEND_SERVICES: skywalking-oap:11800
      JAVA_OPTS: "-Xmx512m"
    ports:
      - "${SKYWALKING_OAP_GRPC_PORT:-11800}:11800"
      - "${SKYWALKING_OAP_HTTP_PORT:-12800}:12800"
    volumes:
      - ./logs/skywalking:/logs
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:12800/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - dev-network

  # ---------- SkyWalking UI ----------
  skywalking-ui:
    image: apache/skywalking-ui:9.7.0
    container_name: dev-skywalking-ui
    restart: unless-stopped
    environment:
      SW_OAP_ADDRESS: http://skywalking-oap:12800
    ports:
      - "${SKYWALKING_UI_PORT:-8080}:8080"
    volumes:
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - skywalking-oap
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Prometheus ----------
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: dev-prometheus
    restart: unless-stopped
    ports:
      - "${PROMETHEUS_PORT:-9090}:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./data/prometheus:/prometheus
      - /etc/localtime:/etc/localtime:ro
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=7d'
      - '--web.enable-lifecycle'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9090/-/healthy"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Grafana ----------
  grafana:
    image: grafana/grafana:10.2.0
    container_name: dev-grafana
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_USER: ${GRAFANA_USER:-admin}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
      GF_INSTALL_PLUGINS: grafana-piechart-panel,grafana-clock-panel
    ports:
      - "${GRAFANA_PORT:-3000}:3000"
    volumes:
      - ./data/grafana:/var/lib/grafana
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - prometheus
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Loki（轻量级日志存储） ----------
  loki:
    image: grafana/loki:2.9.0
    container_name: dev-loki
    restart: unless-stopped
    ports:
      - "${LOKI_PORT:-3100}:3100"
    volumes:
      - ./loki/loki-config.yaml:/etc/loki/loki-config.yaml:ro
      - ./data/loki:/loki
      - /etc/localtime:/etc/localtime:ro
    command: -config.file=/etc/loki/loki-config.yaml
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3100/ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    networks:
      - dev-network

  # ---------- Promtail（日志采集器） ----------
  promtail:
    image: grafana/promtail:2.9.0
    container_name: dev-promtail
    restart: unless-stopped
    volumes:
      - ./promtail/promtail-config.yaml:/etc/promtail/promtail-config.yaml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /etc/localtime:/etc/localtime:ro
    command: -config.file=/etc/promtail/promtail-config.yaml
    depends_on:
      - loki
    deploy:
      resources:
        limits:
          memory: 128M
        reservations:
          memory: 64M
    networks:
      - dev-network
```

---

## 🔧 完整 `.env` 环境变量文件

```bash
# ============================================
# MySQL
# ============================================
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=microservice_dev
MYSQL_USER=dev_user
MYSQL_PASSWORD=dev_pass
MYSQL_PORT=3306

# ============================================
# Redis
# ============================================
REDIS_PORT=6379

# ============================================
# RabbitMQ
# ============================================
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# ============================================
# Elasticsearch
# ============================================
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_CLUSTER_PORT=9300

# ============================================
# MinIO
# ============================================
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001

# ============================================
# Nacos
# ============================================
NACOS_PORT=8848
NACOS_GRPC_PORT=9848

# ============================================
# Sentinel
# ============================================
SENTINEL_PORT=8858

# ============================================
# Seata
# ============================================
SEATA_PORT=8091

# ============================================
# Gateway
# ============================================
GATEWAY_PORT=8080

# ============================================
# Nginx
# ============================================
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

# ============================================
# SkyWalking
# ============================================
SKYWALKING_OAP_GRPC_PORT=11800
SKYWALKING_OAP_HTTP_PORT=12800
SKYWALKING_UI_PORT=8081

# ============================================
# Prometheus & Grafana
# ============================================
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin

# ============================================
# Loki
# ============================================
LOKI_PORT=3100
```

---

## 📄 新增组件配置文件

### 1. Nginx 配置

**`nginx/nginx.conf`**

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    keepalive_timeout 65;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    include /etc/nginx/conf.d/*.conf;
}
```

**`nginx/conf.d/default.conf`**

```nginx
upstream gateway_cluster {
    server gateway:8080;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://gateway_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /minio/ {
        proxy_pass http://minio:9001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Loki 配置

**`loki/loki-config.yaml`**

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  instance_addr: 127.0.0.1
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2024-01-01
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

compactor:
  working_directory: /loki/compactor
  compaction_interval: 10m
  retention_enabled: true
  retention_delete_delay: 2h
  retention_delay: 2h

limits_config:
  retention_period: 168h

table_manager:
  retention_deletes_enabled: true
  retention_period: 168h
```

### 3. Promtail 配置

**`promtail/promtail-config.yaml`**

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container_name'
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'service'
      - source_labels: ['__meta_docker_container_label_com_docker_compose_project']
        target_label: 'project'
      - source_labels: ['__meta_docker_container_label_com_docker_compose_project']
        regex: 'your-project-name'
        action: keep
```

---

## 📊 完整资源占用汇总

| 组件             | 内存限制      | 实际常驻          | CPU 占用     | 端口           |
|:-------------- |:---------:|:-------------:|:----------:|:------------:|
| MySQL          | 512M      | 200-350MB     | 5-15%      | 3306         |
| Redis          | 256M      | 60-100MB      | 1-5%       | 6379         |
| RabbitMQ       | 256M      | 100-150MB     | 1-5%       | 5672, 15672  |
| Elasticsearch  | 768M      | 400-600MB     | 10-25%     | 9200, 9300   |
| MinIO          | 512M      | 200-400MB     | 2-10%      | 9000, 9001   |
| Nacos          | 512M      | 200-350MB     | 3-8%       | 8848, 9848   |
| Sentinel       | 256M      | 100-150MB     | 1-3%       | 8858         |
| Seata          | 256M      | 100-150MB     | 1-3%       | 8091         |
| Nginx          | 128M      | 10-30MB       | 1-3%       | 80, 443      |
| SkyWalking OAP | 512M      | 200-350MB     | 5-15%      | 11800, 12800 |
| SkyWalking UI  | 256M      | 80-150MB      | 1-5%       | 8081         |
| Prometheus     | 256M      | 100-200MB     | 3-8%       | 9090         |
| Grafana        | 256M      | 80-150MB      | 1-5%       | 3000         |
| Loki           | 256M      | 100-200MB     | 2-8%       | 3100         |
| Promtail       | 128M      | 30-80MB       | 1-5%       | 9080         |
| **合计**         | **5.1GB** | **1.9-3.4GB** | **30-90%** | —            |

---

## 🚀 完整启动命令

```bash
# 1. 创建所有必要目录
mkdir -p data/mysql data/redis data/rabbitmq data/elasticsearch data/prometheus data/grafana data/loki
mkdir -p logs/nacos logs/skywalking
mkdir -p nginx/conf.d nginx/html
mkdir -p loki promtail
mkdir -p minio/data
mkdir -p init-scripts
mkdir -p prometheus
mkdir -p grafana/datasources grafana/dashboards

# 2. 创建 Prometheus 配置
cat > prometheus/prometheus.yml <<EOF
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']
EOF

# 3. 启动所有服务
docker-compose up -d

# 4. 查看状态
docker-compose ps

# 5. 按需启动精简版
# docker-compose up -d mysql redis nacos minio nginx
```

---

## 💎 访问地址汇总

| 服务            | 地址                          | 默认账号/密码                  |
|:------------- |:--------------------------- |:------------------------ |
| Nacos         | http://localhost:8848/nacos | nacos/nacos              |
| Sentinel      | http://localhost:8858       | sentinel/sentinel        |
| Seata         | http://localhost:8091       | —                        |
| MinIO         | http://localhost:9001       | minioadmin/minioadmin123 |
| SkyWalking UI | http://localhost:8081       | —                        |
| Prometheus    | http://localhost:9090       | —                        |
| Grafana       | http://localhost:3000       | admin/admin              |
| Loki          | http://localhost:3100       | —                        |
| RabbitMQ      | http://localhost:15672      | admin/admin123           |
| Nginx         | http://localhost            | —                        |

---

## ⚡ 常用运维命令速查

```bash
# 启动所有服务
docker-compose up -d

# 启动部分服务
docker-compose up -d mysql redis nacos minio nginx

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f nacos

# 进入容器
docker-compose exec mysql bash

# 停止所有服务
docker-compose stop

# 停止并清理所有数据（谨慎）
docker-compose down -v

# 热加载 Nginx
docker kill -s HUP dev-nginx

# 查看资源占用
docker stats
```

这份完整配置已经可以直接复制使用。如果需要调整某个组件的具体配置，随时告诉我。
