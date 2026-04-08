---
title: 使用Docker搭建LobeChat
date: 2025-04-11
cover: //cdn.smallyoung.cn/article/cover/e0a46072-8876-44e3-8d72-b293a1820b88.png
category: 人工智能
tags:
  - LobeChat
  - AI
  - Docker
description: "一、引言 LobeChat是一款基于大型语言模型(LLM)的开源AI聊天框架，它为用户提供了高度可定制化的智能对话体验。作为新一代AI助手平台，LobeChat不仅支持文本对话，还集成了多模态交互、插"
author: smallyoung
---


## 一、引言

LobeChat是一款基于大型语言模型(LLM)的开源AI聊天框架，它为用户提供了高度可定制化的智能对话体验。作为新一代AI助手平台，LobeChat不仅支持文本对话，还集成了多模态交互、插件系统和可视化提示词编排等创新功能，使其在众多AI聊天工具中脱颖而出。

### 1、LobeChat的核心架构

LobeChat采用前后端分离的设计架构，主要由以下组件构成：

1. **前端界面**：基于React/Next.js构建的现代化用户界面，提供流畅的交互体验。
2. **后端服务**：处理业务逻辑，连接各种LLM API服务。
3. **数据库层**：存储用户配置、对话历史等数据。
4. **插件系统**：可扩展的功能模块，增强AI助手的能力。

### 2、LobeChat的独特优势

1. **开源与可定制性**：
   - 完全开源(MIT许可证)，用户可以自由修改和扩展功能
   - 支持自定义UI主题、布局和交互方式
   - 可以集成自研模型或第三方API服务

2. **多模型支持**：
   - 兼容OpenAI GPT系列、Anthropic Claude、国内大模型等多种LLM
   - 支持在同一会话中切换不同模型
   - 可配置模型参数(温度、top_p等)以获得不同风格的回复

3. **隐私保护**：
   - 支持本地部署，对话数据完全由用户掌控
   - 可选择不存储敏感对话历史
   - 提供数据加密和访问控制机制

4. **专业级功能**：
   - 可视化提示词编排工具，无需编程即可创建复杂Agent
   - 知识库集成功能，可上传专业文档增强AI知识
   - 支持函数调用和工具使用，实现自动化工作流

### 3、客户端数据库与服务端数据库的区别

LobeChat的数据库使用根据部署方式不同而有显著差异：

| 特性 | 客户端数据库 | 服务端数据库 |
|------|------------|------------|
| **存储位置** | 用户本地设备(浏览器IndexedDB或本地文件) | 服务器/云端数据库 |
| **数据内容** | 仅存储当前设备的会话历史和设置 | 存储所有用户的完整数据 |
| **隐私性** | 极高，数据不离开用户设备 | 取决于服务提供商的隐私政策 |
| **同步能力** | 仅限单一设备，无跨设备同步 | 支持多设备实时同步 |
| **容量限制** | 受设备存储空间限制(通常5-50MB) | 理论上无限制，可按需扩展 |
| **备份恢复** | 需手动导出/导入，易丢失 | 自动备份，恢复方便 |
| **典型场景** | 个人隐私敏感型用户 | 团队协作或企业部署 |

**技术实现差异**：
- 客户端数据库通常使用浏览器内置的IndexedDB或本地SQLite
- 服务端数据库多采用PostgreSQL、MySQL等关系型数据库或MongoDB等NoSQL方案
- 客户端数据加密由前端实现，服务端数据加密由后端处理

### 4、技术架构优势

1. **模块化设计**：
   - 各组件松耦合，便于替换和升级
   - 插件系统采用标准化接口，易于扩展

2. **性能优化**：
   - 支持流式响应，减少等待时间
   - 智能缓存机制，降低API调用成本
   - 支持大上下文窗口(最高128K tokens)

3. **跨平台支持**：
   - Web应用，兼容主流浏览器
   - 提供桌面客户端(Windows/macOS/Linux)
   - 移动端适配响应式设计

LobeChat的这些特性使其不仅是一个聊天界面，而是一个完整的AI应用开发框架，能满足从个人用户到企业级应用的各种需求。通过灵活的部署选项和丰富的定制功能，用户可以根据自身需求打造专属的AI助手解决方案。

## 二、配置文件（lobe-chat.env.env）

### 1、S3对象存储

#### （1）配置并获取 S3 存储桶

你需要前往你的 S3 服务提供商（如 AWS S3、Cloudflare R2 等）并创建一个新的存储桶（Bucket）。接下来以 Cloudflare R2 为例，介绍创建流程。

下图是 Cloudflare R2 的界面：

![ Cloudflare R2](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/6e9da87c-553f-44b0-98d0-792262a6d303.png)

创建存储桶时将指定其名称，然后点击创建。

![指定名称](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/f9d8b699-f8ae-4844-af60-c1cb701764bc.png)

#### （2）获取存储桶相关环境变量

在 R2 存储桶的设置中，可以看到桶配置的信息：

![桶配置信息](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/022a35cb-fe4d-462c-bf29-6bd01c65602d.png)

其对应的环境变量为：

```shell
# 存储桶的名称
S3_BUCKET=lobechat
# 存储桶的请求端点(注意此处链接的路径带存储桶名称，必须删除该路径，或使用申请 S3 API token 页面所提供的链接)
S3_ENDPOINT=https://0b33a03b5c993fd2f453379dc36558e5.r2.cloudflarestorage.com
# 存储桶对外的访问域名
S3_PUBLIC_DOMAIN=https://s3-for-lobechat.your-domain.com
```

> S3_ENDPOINT必须删除其路径，否则会无法访问所上传文件

#### （3）获取 S3 密钥环境变量

你需要获取 S3 的访问密钥，以便 LobeChat 的服务端有权限访问 S3 存储服务。在 R2 中，你可以在账户详情中配置访问密钥：

![配置访问密钥](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/1d8c4f24-d7ef-4258-8366-b77ffe9672a0.png)

点击右上角按钮创建 API token，进入创建 API Token 页面

![ API Token](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/20adf3aa-62ff-4538-8ceb-3bf1f0bff00c.png)

鉴于我们的服务端数据库需要读写 S3 存储服务，因此权限需要选择对象读与写，然后点击创建。

![创建](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/022a35cb-fe4d-462c-bf29-6bd01c65602d.png)

创建完成后，就可以看到对应的 S3 API token

![创建](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/677437d2-b69f-492a-931e-bcb7803bf3bf.png)

其对应的环境变量为：

```shell
S3_ACCESS_KEY_ID=9998d6757e276cf9f1edbd325b7083a6
S3_SECRET_ACCESS_KEY=55af75d8eb6b99f189f6a35f855336ea62cd9c4751a5cf4337c53c1d3f497ac2
```

#### （4）配置跨域

由于 S3 存储服务往往是一个独立的网址，因此需要配置跨域访问。

在 R2 中，你可以在存储桶的设置中找到跨域配置：

![跨域配置](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/37097d1e-0447-4419-9f4a-9b9ae45888e3.png)

添加跨域规则，允许你的域名（在上文是 https://your-project.vercel.app）来源的请求：

![允许你的域名](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/e482fabf-2726-4339-a787-348654b7f3bf.png)

示例配置如下：

``` json
[
  {
    "AllowedOrigins": ["https://your-project.vercel.app"],
    "AllowedMethods": ["GET", "PUT", "HEAD", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```
配置后点击保存即可。

#### （5）环境变量一览

```shell
# S3 秘钥
S3_ACCESS_KEY_ID=9998d6757e276cf9f1edbd325b7083a6
S3_SECRET_ACCESS_KEY=55af75d8eb6b99f189f6a35f855336ea62cd9c4751a5cf4337c53c1d3f497ac2

# 存储桶的名称
S3_BUCKET=lobechat
# 存储桶的请求端点
S3_ENDPOINT=https://0b33a03b5c993fd2f453379dc36558e5.r2.cloudflarestorage.com
# 存储桶对外的访问域名
S3_PUBLIC_DOMAIN=https://s3-dev.your-domain.com

# 桶的区域，如 us-west-1，一般来说不需要添加，但某些服务商则需要配置
# S3_REGION=us-west-1
```

### 2、Cloudflare Zero Trust 配置流程

#### （1）在 Cloudflare Zero Trust 中创建应用

我们现在默认您已经了解了如何使用 Cloudflare Zero Trust 平台且假设您的 LobeChat 实例部署在 https://chat.example.com 中。

首先我们需要访问 https://one.dash.cloudflare.com/ 并前往 Access - Applications 中。

![Access-Applications](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/060e3e1c-a566-4ee1-b9b1-d6af887f9f23.png)

现在，在所在页面点击 Add an application 并选择 SaaS。

![选择 SaaS](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/406df08a-c7b0-4557-8ee3-d5c7b927608b.png)

在 Application 文本框内填入应用名称，如：LobeChat SSO，然后点击 Select OIDC 后点击 Add applicaiton

![填入应用名称](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/b81a250a-9703-42cf-8dbd-4ccd92cc1ee3.png)

至此您已成功在 Clouflare Zero Trust 中创建了一个名为 LobeChat SSO 的 SaaS 应用。

接下来我们需要在 Redirect URLs 中填入 https://chat.example.com/api/auth/callback/cloudflare-zero-trust（注意此处的 chat.example.com 需要替换为您的实例地址）

![ Redirect URLs](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/d29e1a3d-2ce0-4df9-8190-e097bb83fe09.png)

最后我们将页面往下滚动，您将需要记录以下三个值 Client secret, Client ID 及 Issuer 以备后续部署 LobeChat 环境变量使用。

![密钥](//cdn.smallyoung.cn/article/ff5a9f98-dd56-422c-8d77-2bd4878c5d04/ef1b5c58-c809-4bf3-bf9f-ebde40be7c63.png)

#### （2）配置环境变量

在部署 LobeChat 时，你需要配置以下环境变量：

| 环境变量 | 类型 | 描述 |
|------|------------|------------|
| NEXT_AUTH_SECRET | 必选 | 用于加密 Auth.js 会话令牌的密钥。您可以使用以下命令生成秘钥：`openssl rand -base64 32` |
| NEXT_AUTH_SSO_PROVIDERS | 必选 | 选择 LoboChat 的单点登录提供商。使用 Cloudflare Zero Trust 请填写 `cloudflare-zero-trust` |
| AUTH_CLOUDFLARE_ZERO_TRUST_ID | 必选 | 在 Cloudflare Zero Trust 生成的 `Client ID`，示例值是 `lobe-chat` |
| AUTH_CLOUDFLARE_ZERO_TRUST_SECRET | 必选 | 在 Cloudflare Zero Trust 生成的 `Client secret`，示例值是 `insecure_secret` |
| AUTH_CLOUDFLARE_ZERO_TRUST_ISSUER | 必选 | 在 Cloudflare Zero Trust 生成的 `Issuer`，例如 `https://example.cloudflareaccess.com/cdn-cgi/access/sso/oidc/7db0f` |
| NEXTAUTH_URL | 必选 | 该 URL 用于指定 Auth.js 在执行 OAuth 验证时的回调地址，当默认生成的重定向地址发生不正确时才需要设置。`https://chat.example.com/api/auth` |

> 部署成功后，用户将可以使用 Cloudflare Zero Trust 中配置的用户通过身份认证并使用 LobeChat。

### 3、其他配置

```shell
# 网站域名
APP_URL=https://aaa.com
NEXT_PUBLIC_CUSTOM_MODELS=true

# 用于加密敏感信息的密钥，可以使用 openssl rand -base64 32 生成
KEY_VAULTS_SECRET='aaa'

# ========== postgresql ==========
DATABASE_URL=postgresql://postgres:possword@localhost:5432/lobechat

# ========== Open Ai  ==========
OPENAI_API_KEY=sk-proj-zudxxxxx

```

## 三、编写docker-compose.yml

``` yml
services:
  lobe-chat:
    image: lobehub/lobe-chat-database
    container_name: lobe-chat-database
    restart: always
    ports:
      - "3210:3210"
    env_file:
      - ./lobe-chat.env
    volumes:
      - ./data:/app/data
```

启动 Docker

```shell
docker compose up -d
```

检查日志

```shell
docker logs -f lobe-chat
```

如果你在容器中看到了以下日志，则说明已经启动成功：

```log
[Database] Start to migration...
✅ database migration pass.
-------------------------------------
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3210
  - Network:      http://0.0.0.0:3210

 ✓ Starting...
 ✓ Ready in 95ms
 ```

 访问应用

通过 http://localhost:3210 访问你的 LobeChat 服务，然后通过`Cloudflare Zero Trust`进行认证登录

更多配置可参考[官方文档](https://lobehub.com/zh/docs/self-hosting/server-database/docker-compose)
