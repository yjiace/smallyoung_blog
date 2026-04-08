---
title: 使用 Cloudflare 部署临时邮箱服务
date: 2025-04-11
cover: //cdn.smallyoung.cn/article/cover/ed8bf38e-6139-4524-991c-1f0c6de7f800.png
category: 其他
tags:
  - Cloudflare
  - 临时邮箱
  - cloudflare_temp_email
  - 电子邮件
description: "一、引言 在当今数字化时代，临时邮箱服务已成为保护个人隐私、避免垃圾邮件的重要工具。dreamhunter2333 开发的 cloudflaretempemail 项目利用 Cloudflare Wo"
author: smallyoung
---

## 一、引言
在当今数字化时代，临时邮箱服务已成为保护个人隐私、避免垃圾邮件的重要工具。dreamhunter2333 开发的 `cloudflare_temp_email` 项目利用 Cloudflare Workers 平台，提供了一个轻量级、高性能的临时邮箱解决方案。本文将详细介绍如何部署和使用这一开源项目。

cloudflare_temp_email 是一个基于 Cloudflare Workers 的临时电子邮件服务系统，具有以下特点：

* 完全开源且免费（MIT 许可证）
* 使用 Cloudflare Workers 和 D1 数据库
* 支持自定义域名
* 无需维护服务器
* 自动过期机制

## 二、准备工作

在开始部署前，请确保您已准备好以下内容：

Cloudflare 账户：注册并验证的 Cloudflare 账户
自定义域名：您拥有管理权限的域名（已在 Cloudflare 上托管）
Git：用于克隆项目仓库

## 三、详细安装步骤

> 本教程是通过 Github Actions 的方式部署的项目，优点是可以自动更新部署项目，可直接访问[官方仓库](https://github.com/dreamhunter2333/cloudflare_temp_email)

### 1、D1 数据库

打开 cloudflare 控制台，选择 `Workers & Pages` -> `D1` -> `Create Database`，点击创建数据库

![创建数据库](//cdn.smallyoung.cn/article/f1343265-897e-454c-b667-a85e658814f5/d3577b28-87f4-4e4e-94dd-84a09e3046cd.png)

创建完成后，我们在 cloudflare 的控制台可以看到 D1 数据库

打开 Console 标签页，输入 [db/schema.sql](https://github.com/dreamhunter2333/cloudflare_temp_email/blob/main/db/schema.sql) 的内容，点击 Execute 执行

![创建数据库](//cdn.smallyoung.cn/article/f1343265-897e-454c-b667-a85e658814f5/b0b96ef5-5392-4282-9030-6282760c854e.png)

更新数据库 schema

找到需要执行的 patch 文件(晚于D1建库日期的sql), 执行, 例如: `db/2024-01-13-patch.sql`

### 2、配置和部署

1. 在 GitHub fork 仓库

![GitHub fork](//cdn.smallyoung.cn/article/f1343265-897e-454c-b667-a85e658814f5/a72b0b74-9699-43dd-a722-ad2b0ec8987a.png)

2. 打开仓库的 `Actions` 页面，找到` Deploy Backend Production` 和 `Deploy Frontend`，点击 `enable workflow` 启用 `workflow`

3. 然后在仓库页面 Settings -> Secrets and variables -> Actions -> Repository secrets, 添加以下 secrets:

* `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID, [参考文档](https://developers.cloudflare.com/workers/wrangler/ci-cd/#cloudflare-account-id)
* `CLOUDFLARE_API_TOKEN`: Cloudflare API Token, [参考文档](https://developers.cloudflare.com/workers/wrangler/ci-cd/#api-token)
* `BACKEND_TOML`: 后端配置文件，[参考此处](https://temp-mail-docs.awsl.uk/zh/guide/cli/worker.html#%E4%BF%AE%E6%94%B9-wrangler-toml-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
* `FRONTEND_ENV`: 前端配置文件，请复制 frontend/.env.example 的内容，[并参考此处修改](https://temp-mail-docs.awsl.uk/zh/guide/cli/pages.html)
* `FRONTEND_NAME`: 你在 Cloudflare Pages 创建的项目名称，**需要在cloud flare的pages中创建对应名称的pages**
* `FRONTEND_BRANCH`: (可选) pages 部署的分支，可不配置，默认 `production`
* `TG_FRONTEND_NAME`: (可选) 你在` Cloudflare Pages` 创建的项目名称，同 `FRONTEND_NAME`，如果需要 `Telegram Mini App` 功能，请填写
* `DEBUG_MODE`: (可选) 是否开启调试模式，配置为 true 开启, 默认 worker 部署日志不会输出到 Github Actions 页面，开启后会输出
* `BACKEND_USE_MAIL_WASM_PARSER`: (可选) 是否使用 wasm 解析邮件，配置为 true 开启, 功能参考 [配置 worker 使用 wasm 解析邮件](https://temp-mail-docs.awsl.uk/zh/guide/feature/mail_parser_wasm_worker.html)

4. 打开仓库的 Actions 页面，找到 `Deploy Backend Production` 和 `Deploy Frontend`，点击 `Run workflow` 选择分支手动部署

### 3、如何配置自动更新
打开仓库的 `Actions` 页面，找到 `Upstream Sync`，点击 `enable workflow` 启用 workflow

如果`Upstream Sync` 运行失败，到仓库主页点击 `Sync` 手动同步即可

### 4、配置邮件转发

1. 在 CF 控制台网页的对应域名的 `Email Routing` 下，配置 `电子邮件 DNS 记录`, 如果是多个域名，需要配置多个域名的 `电子邮件 DNS 记录`

2. 在将电子邮件地址绑定到您的 Worker 之前，您需要启用电子邮件路由并拥有至少一个经过验证的电子邮件地址(目标地址)。

3. 配置每个域名的 `Email Routing` 的路由规则中的 `Catch-all` 地址 发送到 worker

![Email Routing](//cdn.smallyoung.cn/article/f1343265-897e-454c-b667-a85e658814f5/94922eb4-f598-4f4a-b9b8-f350efc5d051.png)


