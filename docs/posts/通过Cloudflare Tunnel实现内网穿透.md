---
title: 通过Cloudflare Tunnel实现内网穿透
date: 2025-04-08
cover: //cdn.smallyoung.cn/article/cover/2da4824d-40d0-4064-8244-cfd6ba638c56.png
category: 其他
tags:
  - Cloudflare Tunnel
  - 内网穿透
  - cloudflared
  - Zero Trust
  - 反向代理
description: "一、引言 内网穿透是许多开发者和系统管理员经常面临的需求，它允许将内网服务安全地暴露到公网，便于远程访问或演示。传统的内网穿透方案往往涉及复杂的端口转发配置、动态 DNS 或 VPN 设置，不仅配置繁"
author: smallyoung
---

## 一、引言
内网穿透是许多开发者和系统管理员经常面临的需求，它允许将内网服务安全地暴露到公网，便于远程访问或演示。传统的内网穿透方案往往涉及复杂的端口转发配置、动态 DNS 或 VPN 设置，不仅配置繁琐，还可能带来安全隐患。Cloudflare Tunnel（原 Argo Tunnel）提供了一种更为安全、便捷的内网穿透解决方案，无需公网 IP，也无需在防火墙上开放端口。本文将详细介绍如何利用 Cloudflare Tunnel 实现内网穿透，并分享一些最佳实践。

本次是在树莓派上设置Cloudflare Tunnel以支持多服务转发的完整指南。这将允许您通过不同域名访问树莓派上运行的多个服务，即使运营商屏蔽了80和443端口。


## 二、Cloudflare Tunnel 的工作原理

在深入了解配置步骤之前，先简单理解 Cloudflare Tunnel 的工作原理是很有帮助的：

1. 反向连接: Cloudflare Tunnel 通过在内网服务器上运行 cloudflared 客户端，建立从内网到 Cloudflare 网络的外向连接
2. 无需开放端口: 由于连接是从内部发起的，因此无需在防火墙上开放入站端口
3. 流量加密: 所有流量都通过 TLS 加密隧道传输，确保数据安全
4. 身份验证: 使用 Cloudflare 的身份验证机制，可以集成各种身份提供商
5. DNS 集成: 自动与 Cloudflare DNS 集成，提供自定义域名访问

## 三、前提条件

在开始配置 Cloudflare Tunnel 之前，您需要准备以下内容：

- 一个已注册的Cloudflare账户
- 一个已添加到 Cloudflare 的域名（如果您想使用自定义域名）
- 运行中的树莓派，已连接到互联网
- 管理员权限（用于安装和配置 cloudflared）
- 树莓派上运行的多个服务（在不同端口）

## 四、在树莓派上安装cloudflared

### 1、下载并安装cloudflared

```bash
# 下载适用于ARM的cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm -O cloudflared

# 添加执行权限
chmod +x cloudflared

# 移动到系统路径
sudo mv cloudflared /usr/local/bin/

# 验证安装
cloudflared version
```

## 五、设置Cloudflare Tunnel

### 1、登录Cloudflare账户

```bash
cloudflared tunnel login
```
此命令会生成一个链接，在浏览器中打开该链接并授权cloudflared访问您的Cloudflare账户。授权成功后，证书会自动保存到`~/.cloudflared/cert.pem`。

### 2、创建隧道

```bash
cloudflared tunnel create raspberry-services
```

这会创建一个名为"raspberry-services"的隧道，并生成一个凭证文件，通常保存在`~/.cloudflared/[UUID].json`。
记下隧道ID（UUID），后续配置需要使用：

```bash
cloudflared tunnel list
```

## 六、配置隧道路由

### 1、创建配置目录

```bash
sudo mkdir -p /etc/cloudflared
```

### 2、复制凭证文件到配置目录

```bash
sudo cp ~/.cloudflared/*.json /etc/cloudflared/
```

### 3、创建配置文件

```bash
sudo vim /etc/cloudflared/config.yml
```

添加以下内容（替换[TUNNEL_ID]为您的隧道ID）：


```yaml
tunnel: [TUNNEL_ID]
credentials-file: /etc/cloudflared/[TUNNEL_ID].json

# 日志设置（可选）
logfile: /var/log/cloudflared.log

ingress:
  # 服务1 - 例如网站
  - hostname: www.yourdomain.com
    service: http://localhost:80
  
  # 服务2 - 例如Nextcloud
  - hostname: cloud.yourdomain.com
    service: http://localhost:8080
  
  # 服务3 - 例如Home Assistant
  - hostname: home.yourdomain.com
    service: http://localhost:8123
  
  # 服务4 - 例如Jellyfin
  - hostname: media.yourdomain.com
    service: http://localhost:8096
  
  # 服务5 - 例如Grafana
  - hostname: monitor.yourdomain.com
    service: http://localhost:3000
  
  # 默认规则（必须放在最后）
  - service: http_status:404
```

保存并退出编辑器。

## 七、配置DNS记录

### 1、为每个服务创建DNS路由

``` bash
cloudflared tunnel route dns raspberry-services www.yourdomain.com
cloudflared tunnel route dns raspberry-services cloud.yourdomain.com
cloudflared tunnel route dns raspberry-services home.yourdomain.com
cloudflared tunnel route dns raspberry-services media.yourdomain.com
cloudflared tunnel route dns raspberry-services monitor.yourdomain.com
```

## 八、设置为系统服务

### 1、安装为系统服务

``` bash
sudo cloudflared service install
```

### 2、启动服务

``` bash
sudo systemctl start cloudflared
```

### 3、设置开机自启

``` bash
sudo systemctl enable cloudflared
```
### 4、检查服务状态

``` bash
sudo systemctl status cloudflared
```

## 九、验证配置

### 1、检查隧道是否正常运行

``` bash
cloudflared tunnel info raspberry-services
```

### 2、检查日志

``` bash
sudo tail -f /var/log/cloudflared.log
```

## 十、Cloudflare控制面板配置

### 1、SSL/TLS设置

1. 登录Cloudflare控制面板
2. 选择您的域名
3. 转到SSL/TLS选项
4. 将SSL/TLS加密模式设置为"Full"或"Full (Strict)"

### 2、其他优化设置（可选）

1. 在Rules部分创建页面规则来优化缓存
2. 启用Cloudflare的Always Online功能
3. 启用Automatic HTTPS Rewrites

## 十一、进阶配置选项（可选）

如果您需要更高级的配置，可以在config.yml中添加以下选项：

``` bash
# 连接超时设置
originRequest:
  connectTimeout: 30s
  noTLSVerify: true  # 如果服务使用自签名证书

# 重试策略
retries: 5
```

## 十二、故障排除

### 1、查看隧道状态

``` bash
cloudflared tunnel status raspberry-services
```

### 2、检查连接问题

``` bash
cloudflared tunnel diagnose
```

### 3、重启服务

``` bash
sudo systemctl restart cloudflared
```

## 十三、更新cloudflared（定期检查更新）

``` bash
# 下载最新版本
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm -O cloudflared.new

# 添加执行权限
chmod +x cloudflared.new

# 停止服务
sudo systemctl stop cloudflared

# 替换旧版本
sudo mv cloudflared.new /usr/local/bin/cloudflared

# 重启服务
sudo systemctl start cloudflared
```



