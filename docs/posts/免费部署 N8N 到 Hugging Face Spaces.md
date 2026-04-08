---
title: 免费部署 N8N 到 Hugging Face Spaces
date: 2025-05-27
cover: //cdn.smallyoung.cn/article/cover/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9.png
category: 人工智能
tags:
  - N8N
  - Hugging Face Spaces
  - AI
description: "一、概述 N8N 支持通过 PostgreSQL 存储工作流数据。Hugging Face 本身没有直接提供 PostgreSQL 服务，但你可以使用外部 PostgreSQL 数据库，例如 Supa"
author: smallyoung
---

## 一、概述

N8N 支持通过 PostgreSQL 存储工作流数据。Hugging Face 本身没有直接提供 PostgreSQL 服务，但你可以使用外部 PostgreSQL 数据库，例如 Supabase、自托管的 PostgreSQL 实例或云服务（如 AWS RDS、Google Cloud SQL 等）。

## 二、创建 Hugging Face Space
1. 登录 Hugging Face 账号。
2. 访问 https://hf.co/new-space 创建一个新的 Space。本次演示spaces空间名为：`n8n_test`
3. 在选择 SDK 时，选择 Docker，这样可以灵活部署 N8N。
4. Space hardware配置的话，选择免费的（`CPU basic · 2 vCPU · 16 GB · FREE`）即可
![新建 Space](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/96242dad-74ed-41d7-aef5-4db9d48569e2.png)
5. 设置环境变量
进入设置，在设置中添加环境变量。
![进入设置](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/39c344fe-a620-410b-aa49-729967efcece.png)
![添加环境变量](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/aff1d705-14e3-4fa4-8e29-d1ff442f0f10.png)
```shell
POSTGRES_HOST="postgresql 数据库地址"
POSTGRES_USER="postgresql 账号"
N8N_ENCRYPTION_KEY="N8N 密钥，通过此密码对数据加密解密"
POSTGRES_PASSWORD="数据库密码"
```
> 环境变量有两种模式，`Variables`和`Secrets`,Variables为明文，Secrets 设置后不会在回显

6. 下载仓库
然后再回到我的`APP`菜单，按照教程，将我们的仓库下载到本地即可
![APP](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/d7d785b2-813d-41d0-91c9-16626b604666.png)
![下载](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/0b5baba8-22ad-4145-baa0-9c7aa002284f.png)

## 三、配置 Docker 环境

在下载的仓库中，创建一个名为 Dockerfile 的文件，并添加以下内容：

```dockerfile
# 使用官方 Node.js 22 镜像作为基础
FROM node:22

# 设置工作目录
WORKDIR /data

# 安装 tini (一个简单的 init 系统，用于处理信号和僵尸进程) 和 curl (可能需要用于健康检查或调试)
RUN apt-get update && \
    apt-get install -y tini curl sudo --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 全局安装 N8N 最新版本
# 如果需要特定版本，可以使用 npm install -g n8n@<version>
RUN npm install -g n8n

# 复制启动脚本到容器中
COPY start.sh /usr/local/bin/start.sh

# 赋予启动脚本执行权限
RUN chmod +x /usr/local/bin/start.sh

# 切换到 root 用户
USER root

# 设置容器入口点，使用 tini 运行启动脚本
ENTRYPOINT ["tini", "--"]

# 容器启动时执行的命令
# 可以通过环境变量 N8N_RUN_WORKER_ONLY=true 来仅启动worker进程
CMD ["/usr/local/bin/start.sh"]

```

## 四、编写启动脚本start.sh

```shell
####################### N8N 基础配置 ############################
export N8N_HOST="0.0.0.0"                                   # 绑定到所有网络接口，确保可以从外部访问
export N8N_PROTOCOL="https"
export NODE_ENV="production"
export GENERIC_TIMEZONE="Asia/Shanghai"
export TZ="Asia/Shanghai"
export N8N_DEFAULT_LOCALE="zh-CN"
export WEBHOOK_URL="https://${SPACE_HOST}/"                                        # N8N 的公开访问 URL
export N8N_ENCRYPTION_KEY="${N8N_ENCRYPTION_KEYn}"                                 #设置 n8n 实例中数据加密的密钥
export NODE_FUNCTION_ALLOW_BUILTIN=*                                               #允许使用所有内置的 Node.js 模块
export NODE_FUNCTION_ALLOW_EXTERNAL=*                                              #允许导入和使用所有外部模块
export N8N_CUSTOM_EXTENSIONS="~/.n8n/nodes"                                        # 指定社区节点的本地安装位置

####################### Postgresql 配置 ############################
export DB_TYPE="postgresdb"
export DB_POSTGRESDB_HOST="${POSTGRES_HOST:-your_postgres_host}"  # 从环境变量 POSTGRES_HOST 读取，否则使用占位符
export DB_POSTGRESDB_PORT="${POSTGRES_PORT:-5432}"                # 从环境变量 POSTGRES_PORT 读取，否则使用默认值 5432
export DB_POSTGRESDB_DATABASE="${POSTGRES_DB:-n8n}"               # 从环境变量 POSTGRES_DB 读取，否则使用默认值 n8n
export DB_POSTGRESDB_USER="${POSTGRES_USER:-n8nuser}"             # 从环境变量 POSTGRES_USER 读取，否则使用占位符
export DB_POSTGRESDB_SCHEMA="${POSTGRES_SCHEMA:-public}"          # 从环境变量 POSTGRES_SCHEMA 读取，否通常是 public
export DB_POSTGRESDB_PASSWORD="${POSTGRES_PASSWORD}"              # 从环境变量 POSTGRES_PASSWORD 读取

####################### 其他优化配置 ############################
# 数据清理配置
export EXECUTIONS_DATA_PRUNE=true                     #是否启用定期清理（pruning）n8n 存储的执行数据
export EXECUTIONS_DATA_MAX_AGE=36                     #执行数据可以保留的最长时间，单位是小时
export EXECUTIONS_DATA_PRUNE_MAX_COUNT=1000           #每个工作流最多保留的成功和失败的执行记录数量
export EXECUTIONS_DATA_SAVE_ON_ERROR=all              #保存所有失败执行的详细数据
export EXECUTIONS_DATA_SAVE_ON_SUCCESS=all            #保存所有成功执行的详细数据
export EXECUTIONS_DATA_SAVE_ON_PROGRESS=true          #不保存正在执行中的中间数据
export EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true    #不保存手动触发的执行数据

# N8N 功能配置
export N8N_DIAGNOSTICS_ENABLED=true                   #是否启用 n8n 的诊断功能
export N8N_VERSION_NOTIFICATIONS_ENABLED=true         #是否在 n8n UI 中显示新版本可用的通知
export N8N_TEMPLATES_ENABLED=true                     #是否启用 n8n UI 中的模板功能，允许用户导入和导出工作流模板
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true     #自动修正配置文件权限，是否强制执行设置文件的权限。启用此选项可以提高安全性，确保只有运行 n8n 的用户才能访问敏感的配置文件
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true

# 性能优化配置
export N8N_PROCESS_THREADED=true                      #是否使用多线程来处理工作流执行
export N8N_METRICS_ENABLED=false                      #是否启用 n8n 的指标 (metrics) 功能。启用后，n8n 会暴露 Prometheus 等监控系统可以抓取的性能指标，用于监控 n8n 实例的运行状况
export N8N_HIRING_BANNER_ENABLED=false                #是否在 n8n UI 中显示一个招聘横幅
export N8N_USER_MANAGEMENT_DISABLED=false             #是否禁用用户管理功能。如果禁用，则只有一个默认用户可以访问 n8n，并且无法创建或管理其他用户
export N8N_PERSONALIZATION_ENABLED=false              #是否启用 n8n UI 的个性化功能。启用后，可能会收集一些匿名数据以改善用户体验
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true     #自动修正配置文件权限
export N8N_RUNNERS_ENABLED=true                       # 任务运行器是否启用。

# 获取当前时间
current_time=$(date +"%Y-%m-%d %H:%M:%S")

# 定义要安装的社区节点列表
COMMUNITY_NODES="n8n-nodes-mcp"

# 安装社区节点
for node in $COMMUNITY_NODES; do
    echo "[$current_time] 正在安装社区节点: $node"
    # 确保自定义节点目录存在
    sudo mkdir -p ${N8N_CUSTOM_EXTENSIONS}
    # 在指定的本地目录安装节点
    npm install --prefix ${N8N_CUSTOM_EXTENSIONS} $node
    if [ $? -eq 0 ]; then
        echo "[$current_time] 社区节点 $node 安装成功到 ${N8N_CUSTOM_EXTENSIONS}"
    else
        echo "[$current_time] 社区节点 $node 安装失败"
    fi
done

echo "[$current_time] 社区节点安装完成"


echo "[$current_time] 开始启动n8n，绑定到 ${N8N_HOST}:${N8N_PORT}..."

# 启动主进程
exec n8n start

# --- 启动 N8N ---
echo "[$current_time]正在启动 n8n..."
echo "配置信息概览:"
echo "  端口 (N8N_PORT): ${N8N_PORT}"
echo "  运行环境 (NODE_ENV): ${NODE_ENV}"
echo "  数据库类型 (DB_TYPE): ${DB_TYPE}"
echo "  PostgreSQL 主机 (DB_POSTGRESDB_HOST): ${DB_POSTGRESDB_HOST}"
echo "  PostgreSQL 端口 (DB_POSTGRESDB_PORT): ${DB_POSTGRESDB_PORT}"
echo "  PostgreSQL 数据库名 (DB_POSTGRESDB_DATABASE): ${DB_POSTGRESDB_DATABASE}"
echo "  PostgreSQL 用户名 (DB_POSTGRESDB_USER): ${DB_POSTGRESDB_USER}"
echo "  N8N 主机名 (N8N_HOST): ${N8N_HOST}"
echo "  Webhook URL (WEBHOOK_URL): ${WEBHOOK_URL}"

```

## 五、 编辑README.md文件

```markdown
---
title: N8n
emoji: 🐨
colorFrom: green
colorTo: pink
sdk: docker
pinned: false
license: mit
app_port: 5678
---

这里写你的说明
```
>  注意：app_port表示对外的端口

## 六、启动和访问

当我们上传文件到Hugging Face Spaces后，Hugging Face Spaces会自动部署，我们可以检查日志，查看部署是否成功。

![检查日志](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/eeec7c47-6eed-4d73-ade0-2e23cc6ff47c.png)

![访问](//cdn.smallyoung.cn/article/0ac5a6d9-b5e6-48b8-a61d-f9e632f769e9/f1bfa5c0-7fd5-4982-bae3-ccf1b4280441.png)

> 当然了，如果不想动手的话，也可以访问我的空间地址（`https://huggingface.co/spaces/smallyoung/n8n` ），直接复制空间也是可以的。







