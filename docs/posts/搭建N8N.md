---
title: 搭建N8N
date: 2025-04-12
cover: //cdn.smallyoung.cn/article/cover/ec06c048-20b2-49c9-852e-e714f7cc3806.png
category: 人工智能
tags:
  - N8N
  - AI
  - 工作流自动化
description: "一、概述 n8n 是一款强大的工作流自动化工具，它允许用户通过可视化界面创建自动化工作流，无需编写复杂代码。作为一个开源的自动化平台，N8N支持连接各种服务和应用程序，实现数据流转和任务自动化。 核心"
author: smallyoung
---

## 一、概述
n8n 是一款强大的工作流自动化工具，它允许用户通过可视化界面创建自动化工作流，无需编写复杂代码。作为一个开源的自动化平台，N8N支持连接各种服务和应用程序，实现数据流转和任务自动化。

### 核心特点

* 开源免费: 基于Apache 2.0许可证发布，可以自由使用和修改
* 自托管: 可以在自己的服务器上部署，保证数据隐私和安全
* 可视化界面: 通过拖拽方式创建工作流，无需编程知识
* 丰富的集成: 支持500+种服务和应用的集成
* 灵活的扩展性: 支持自定义节点和JavaScript代码

### 同类产品对比

以下是N8N与商业产品Zapier、Make（原Integromat）的详细对比表格，从多个关键维度分析它们的区别：

| **对比维度**       | **N8N**                          | **Zapier**                      | **Make (原Integromat)**         |
|--------------------|----------------------------------|---------------------------------|--------------------------------|
| **许可证与费用**    | 开源免费（Apache 2.0）           | 商业付费（免费版有限制）         | 商业付费（免费版有限制）         |
| **部署方式**        | 支持自托管（本地/云服务器）       | 仅SaaS云端服务                   | 仅SaaS云端服务                   |
| **数据隐私**        | 数据完全自主控制                 | 数据存储在第三方服务器           | 数据存储在第三方服务器           |
| **集成数量**        | 400+节点，支持自定义开发         | 7,000+应用                       | 2,000+应用                      |
| **工作流复杂度**    | 支持复杂逻辑（JavaScript自定义） | 适合简单到中等复杂度自动化       | 支持高级逻辑（可视化编排）       |
| **执行频率**        | 无限制（取决于服务器资源）        | 免费版15分钟/次，付费版可缩短    | 免费版5分钟/次，付费版可缩短     |
| **错误处理**        | 自定义错误处理流程               | 基础错误通知                     | 可视化错误路由和重试机制         |
| **定价模型**        | 完全免费                         | 按任务数量阶梯收费             ）| 按操作次数收费                 |
| **学习曲线**        | 较高（需技术背景）               | 最低（面向非技术用户）           | 中等（可视化界面但逻辑复杂）     |
| **API调用限制**     | 无限制（自托管）                 | 付费计划限制API调用量            | 付费计划限制操作次数             |
| **自定义开发**      | 支持自定义节点和代码（JavaScript）| 仅支持有限的自定义（Webhooks）   | 支持自定义脚本（但限制较多）     |
| **企业功能**        | 需自行开发或社区支持             | 提供SSO、审计日志等企业功能      | 提供团队协作和企业级管控         |
| **社区与支持**      | 活跃开源社区（GitHub）           | 官方文档+付费支持                | 官方文档+付费支持               |
| **典型使用场景**    | 需要深度定制和数据隐私的企业      | 个人/中小企业快速集成常见SaaS工具| 需要复杂业务逻辑的中大型企业     |
| **执行延迟**        | 即时（取决于服务器性能）          | 免费版有延迟，付费版可缩短       | 免费版有延迟，付费版可缩短       |
| **历史记录保留**    | 可自定义存储周期（自托管）        | 付费计划限制保留时长             | 付费计划限制保留时长             |

### **关键差异总结：**

1. **开源 vs 商业**  
   - N8N是唯一开源且支持自托管的产品，适合对数据隐私和控制权要求高的用户  
   - Zapier/Make提供"开箱即用"的便捷性，但需持续付费

2. **技术门槛**  
   - N8N需要一定的技术能力（部署/维护/自定义开发）  
   - Zapier最适合非技术用户，Make适合有一定技术背景的业务人员

3. **扩展能力**  
   - N8N通过自定义节点和代码可实现无限扩展  
   - Zapier/Make的扩展受限于平台提供的功能模块

4. **成本效益**  
   - N8N长期成本最低（无订阅费，仅服务器成本）  
   - Zapier/Make在高用量场景下费用可能急剧上升

5. **企业适用性**  
   - 大型企业倾向N8N（数据主权+定制化）  
   - 中小企业更偏好Zapier/Make（快速部署+免运维）

## 二、配置

### 1、默认位置:

最常见和默认的位置是：
```shell
~/.n8n/
```

这里：

- `~` 代表当前用户的主目录。例如，如果你是以 `pi` 用户身份运行 n8n，那么路径就是 `/home/pi/.n8n/`。
- `.n8n` 是一个隐藏目录（以点开头）。你需要使用 `ls -a` 命令才能看到它。

这个 `.n8n` 目录包含了：

* **database.sqlite** : (默认情况下) SQLite 数据库文件，存储了你的工作流 (Workflows)、凭证 (Credentials)、执行记录 (Executions) 等核心数据。如果你配置了外部数据库（如 PostgreSQL 或 MySQL），这个文件可能不存在或不被主要使用。
* **config** : 可能包含一些本地配置信息的文件。
* **Workflows** 和 **Credentials**: 工作流和凭证的定义也存储在数据库中。
* **其他运行时文件**: 例如加密密钥等。

> 如果N8N是以`root`用户身份运行的（而不是 `pi` 用户）,则配置文件在`/root/.n8n/` 目录下，而不是 `/home/pi/.n8n/`

### 2、配置(.env)

#### (1)时区和本地化

```bash
#n8n 实例时区。对于调度节点（例如 Cron）来说很重要。
GENERIC_TIMEZONE=Asia/Shanghai
#与Accept-Language 标头兼容的区域标识符。n8n 不支持区域标识符，例如de-AT。在默认区域以外的区域设置中运行时，n8n 会以所选区域设置显示 UI 字符串，并回退到en任何未翻译的字符串。
N8N_DEFAULT_LOCALE=zh-CN
```

#### (2)与 PostgreSQL 一起使用

默认情况下，n8n 使用 SQLite。n8n 还支持 PostgreSQL。n8n在 v1.0 中删除了对 MySQL 和 MariaDB 的支持。详细参数请参考[官方文档](https://docs.n8n.io/hosting/configuration/environment-variables/database/#postgresql)

```bash
# 要使用的数据库。默认：sqlite，可选值：sqlite，postgresdb
DB_TYPE=postgresdb
# PostgreSQL 数据库的名称。默认：n8n
DB_POSTGRESDB_DATABASE=n8n
#PostgreSQL 主机。默认：localhost
DB_POSTGRESDB_HOST=localhost
#PostgreSQL 端口。默认：5432
DB_POSTGRESDB_PORT=5432
#PostgreSQL 用户。默认：postgres
DB_POSTGRESDB_USER=postgres
#PostgreSQL 密码。
DB_POSTGRESDB_PASSWORD=password123
```

#### (3) Reids 配置

> 在 n8n 配置 Redis 的主要作用是提升工作流的执行效率和可靠性

```bash
#使用的Redis数据库。默认：0
QUEUE_BULL_REDIS_DB=0
# Redis 主机。默认：0
QUEUE_BULL_REDIS_HOST=localhost
# 使用的 Redis 端口。默认：6379
QUEUE_BULL_REDIS_PORT=6379
#Redis 密码
QUEUE_BULL_REDIS_PASSWORD=123456
```

#### (4)S3外部数据存储

```bash
#S3 兼容外部存储中 n8n 存储桶的主机。例如，s3.us-east-1.amazonaws.com
N8N_EXTERNAL_STORAGE_S3_HOST=s3.us-east-1.amazonaws.com
#S3 兼容外部存储中的 n8n 存储桶的名称
N8N_EXTERNAL_STORAGE_S3_BUCKET_NAME=bucket
#S3 兼容外部存储中 n8n bucket 的区域。例如，us-east-1
N8N_EXTERNAL_STORAGE_S3_BUCKET_REGION=us-east-1
#S3 兼容外部存储中的访问密钥
N8N_EXTERNAL_STORAGE_S3_ACCESS_KEY=123456
#访问与 S3 兼容的外部存储中的机密。
N8N_EXTERNAL_STORAGE_S3_ACCESS_SECRET=123456
```

#### (5)其他配置

```bash
# 当部署环境不是本机，且没有域名时，需要配置此项，否则无法访问
#N8N_SECURE_COOKIE=false
#用户可访问编辑器的公共 URL。也用于从 n8n 发送的电子邮件以及基于 SAML 身份验证的重定向 URL。
N8N_EDITOR_BASE_URL=
#提供用于加密 n8n 数据库中凭证的自定义密钥。默认情况下，n8n 在首次启动时会生成一个随机密钥。
N8N_ENCRYPTION_KEY=
#设置为true以禁用 UI。默认：false
N8N_DISABLE_UI=false
#设置为true以预览模式运行。默认：false
N8N_PREVIEW_MODE=false
#启用工作流模板(true) 或禁用 (false)。默认：false
N8N_TEMPLATES_ENABLED=true
#n8n 运行的 HTTP 端口。默认：5678
N8N_PORT=5678
# 用于实现 n8n 的协议。默认：http，枚举字符串：http，https
N8N_PROTOCOL=http
# n8n 应该监听的 IP 地址。默认：0.0.0.0
N8N_LISTEN_ADDRESS=0.0.0.0
#HTTPS 协议的 SSL 密钥。
N8N_SSL_KEY=
HTTPS 协议的 SSL 证书。
N8N_SSL_CERT=
```

> 更多详细配置，可参考[官网](https://docs.n8n.io/hosting/configuration/environment-variables/deployment/)

## 部署

### 1、docker部署
```shell
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

> `n8n_data` 为容器映射的配置文件，可在映射任意宿主机目录，配置文件`.evn`需要在该目录下

### 2、npm部署

```shell
npm n8n
```

### 3、npm启动脚本

> 脚本和日志目录位于 `/usr/local/n8n`,需要根据实际情况修改

1. 保存脚本: 将下面的代码保存到一个文件，例如 `n8n_service.sh`

```shell
#!/bin/bash

# 服务名称
SERVICE_NAME="n8n"

# n8n 安装目录 (请根据你的实际安装目录修改)
N8N_HOME="/usr/local/n8n"  # 假设全局安装

# n8n 名称
N8N_START_CMD="n8n"

# 用户名 (可选，如果需要以特定用户运行 n8n)
# N8N_USER="pi"  # 替换为你的用户名

# 日志文件路径
LOG_FILE="/usr/local/n8n/n8n.log"

# 函数：获取PID（关键修改）
get_pid() {
  # 匹配包含n8n的node进程
  pgrep -f "node.*n8n"
}

# 函数：启动服务
start() {
  echo "启动 $SERVICE_NAME 服务..."
  if [ -n "$(get_pid)" ]; then
    echo "$SERVICE_NAME 已经在运行。"
    return 0
  fi

  cd "$N8N_HOME" || exit 1
  source /root/.n8n/.env && nohup npx n8n >> "$LOG_FILE" 2>&1 &
  echo "$SERVICE_NAME 启动成功，PID: $!，日志: $LOG_FILE"
}

# 函数：停止服务（关键修改）
stop() {
  echo "停止 $SERVICE_NAME 服务..."
  PIDS=$(get_pid)
  
  if [ -z "$PIDS" ]; then
    echo "$SERVICE_NAME 没有运行。"
    return 0
  fi

  # 将PID列表转换为数组
  IFS=$'\n' read -d '' -r -a PID_ARRAY <<< "$PIDS"
  
  # 杀死所有进程
  for pid in "${PID_ARRAY[@]}"; do
    if [ -n "$pid" ]; then
      kill "$pid"
    fi
  done

  # 等待所有进程结束
  for pid in "${PID_ARRAY[@]}"; do
    if [ -n "$pid" ]; then
      while kill -0 "$pid" 2>/dev/null; do
        sleep 1
      done
    fi
  done

  echo "$SERVICE_NAME 已停止。"
}

# 函数：重启服务
restart() {
  echo "重启 $SERVICE_NAME 服务..."
  stop
  sleep 2  # 等待服务停止
  start
  echo "$SERVICE_NAME 重启完成。"
}

# 函数：更新服务
update() {
  echo "更新 $SERVICE_NAME 服务..."
  stop
  sleep 5  # 等待服务彻底停止

  sudo npm update n8n -g

  start
  echo "$SERVICE_NAME 更新完成。"
}

# 函数：检查服务状态
status() {
  PID=$(pgrep -x "$N8N_START_CMD")
  if [ -z "$PID" ]; then
    echo "$SERVICE_NAME 未运行。"
  else
    echo "$SERVICE_NAME 正在运行，PID: $PID"
  fi
}

# 开机自启配置
enable_autostart() {
    sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=n8n workflow automation platform
After=network.target

[Service]
Type=simple
User=$N8N_USER
WorkingDirectory=$N8N_HOME
ExecStart=/usr/bin/npm start
Restart=on-failure
StandardOutput=append:$LOG_FILE
StandardError=append:$LOG_FILE

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable $SERVICE_NAME.service
    echo "$SERVICE_NAME 已配置为开机自启动."
}

disable_autostart() {
    sudo systemctl disable $SERVICE_NAME.service
    sudo rm /etc/systemd/system/$SERVICE_NAME.service
    sudo systemctl daemon-reload
    echo "$SERVICE_NAME 已禁用开机自启动."
}

# 主逻辑
case "$1" in
  start)
    start
    ;;  # 启动
  stop)
    stop
    ;;   # 停止
  restart)
    restart
    ;; # 重启
  update)
    update
    ;;  # 更新
  status)
    status
    ;;  # 状态
  enable_autostart)
    enable_autostart
    ;;
  disable_autostart)
    disable_autostart
    ;;
  *)
    echo "用法: $0 {start|stop|restart|update|status|enable_autostart|disable_autostart}"
    exit 1
    ;;
esac

exit 0
```

2. 修改权限: 使脚本可执行

``` shell
chmod +x n8n_service.sh
```

3. 使用脚本:

- 启动 n8n: `sudo ./n8n_service.sh start`
- 停止 n8n: `sudo ./n8n_service.sh stop`
- 重启 n8n: `sudo ./n8n_service.sh restart`
- 更新 n8n: `sudo ./n8n_service.sh update`
- 查看状态: `sudo ./n8n_service.sh status`
- 开启自启动: `sudo ./n8n_service.sh enable_autostart`
- 关闭自启动: `sudo ./n8n_service.sh disable_autostart`
- 日志: n8n 的日志会输出到 `/var/log/n8n.log` 文件。

4. 开机自启 (Systemd):

脚本中已经包含了`enable_autostart()` 函数，它会创建一个 systemd 服务文件，并启用开机自启。你需要使用 `sudo ./n8n_service.sh enable_autostart` 命令来启用它。

解释：

- `#!/bin/bash` : 指定脚本使用 Bash 解释器。
- **变量**: 脚本开头定义了一些变量，方便修改和管理。
- **函数**: 脚本定义了多个函数，每个函数执行一个特定的操作 (启动、停止、重启等)。
- **`case`语句**: 根据用户输入的参数，执行相应的函数。
- `nohup` : 使程序在后台运行。
- `pgrep` : 查找进程 ID。
- `kill` : 停止进程。
- `npm update` : 更新 n8n 包。
- **Systemd 配置**: 使用 `systemctl` 命令来管理 systemd 服务，实现开机自启。 创建 `/etc/systemd/system/n8n.service` 文件，并配置服务的启动方式，用户，工作目录以及日志。


