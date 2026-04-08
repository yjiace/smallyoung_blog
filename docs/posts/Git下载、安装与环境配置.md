---
title: Git下载、安装与环境配置
date: 2020-12-21
cover: //cdn.smallyoung.cn/article/cover/1ec015a740a54d07a2908e77e89bd413.jpg!/format/webp
category: 其他
tags:
  - Git
  - 配置
description: "一、下载 下载地址：https://gitscm.com/download 文档地址：https://gitscm.com/book/zh/v2 二、环境配置 1、配置用户名 bash 配置用户名（ "
author: smallyoung
---

## 一、下载
下载地址：https://git-scm.com/download

文档地址：https://git-scm.com/book/zh/v2

## 二、环境配置

### 1、配置用户名

```bash
# 配置用户名（ "username"是自己的账户名，）
git config --global user.name "" 
# 配置邮箱("username@email.com"注册账号时用的邮箱)
git config --global user.email "" 
```

### 2、查看

```bash
git config --global --list
```

![查看](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/0088eb31d16a4689b1216819cdcf11d0.png!/format/webp)

### 3、生成ssh

```bash
ssh-keygen -t rsa
```

![生成ssh](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/a31d796575aa4d7a8843ceb7cf7e6262.png!/format/webp)

### 4、阿里云code配置ssh

1. 进入设置–>SSH公钥，点击右上角添加，

![生成ssh](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/a31d796575aa4d7a8843ceb7cf7e6262.png!/format/webp)

2. 将公钥（ id_rsa.pub）文件中内容复制粘贴到key中，然后点击Ass SSH key就好啦

![粘贴公钥](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/c5ea2c5778c1409b947b5b7681ca5ca7.png!/format/webp)

![公钥列表](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/98b0bda09e4d45749a02a6998c9e89a9.png!/format/webp)

### 5、验证

```bash
ssh -T git@code.aliyun.com
```

![验证](//cdn.smallyoung.cn/article/5f2279e442210bb9bc883c09/3c720945d0f74d0c8b48b25dc969698e.png!/format/webp)