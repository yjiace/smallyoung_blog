---
title: 安装 SQL智能优化与改写工具--小米SOAR
date: 2019-03-30
cover: //cdn.smallyoung.cn/article/cover/f3f5535646c845c2884c9c014f7d8ab2.jpg!/format/webp
category: 数据库
tags:
  - SOAR
  - Sql优化
description: "一、SOAR 即 SQL Optimizer And Rewriter，是一款 SQL 智能优化与改写工具，由小米运维 DBA 团队出品，官网：https://github.com/XiaoMi/so"
author: smallyoung
---

## 一、[SOAR](https://github.com/XiaoMi/soar)

即 SQL Optimizer And Rewriter，是一款 SQL 智能优化与改写工具，由小米运维 DBA 团队出品，官网：https://github.com/XiaoMi/soar

SOAR 主要由语法解析器、集成环境、优化建议、重写逻辑、工具集五大模块组成，相比业内其他优秀产品有自己的优势。

![SOAR](//cdn.smallyoung.cn/article/5fdabd56e4b0b655d86e8de9/957da27cd3944977955c20e508014c38.jpg!/format/webp)

![SOAR对数据库的支持](//cdn.smallyoung.cn/article/5fdabd56e4b0b655d86e8de9/397f0fec30434d118cfd1c1cc1bb09b4.jpg!/format/webp)
功能特性：

1. 跨平台支持（支持 Linux、Mac 环境，Windows 环境理论上也支持，不过未全面测试）
2. 支持基于启发式算法的语句优化
3. 支持复杂查询的多列索引优化（UPDATE, INSERT, DELETE, SELECT）
4. 支持 EXPLAIN 信息丰富解读
5. 支持SQL 指纹、压缩和美化
6. 支持同一张表多条 ALTER 请求合并
7. 支持自定义规则的 SQL 改写

## 二、关于Go语言

由于SOAR依赖Go语言。大多数论坛提示需要安装Go，但是小杨测试发现，即使没有安装Go，SOAR也是可以正常运行的。附带[Go安装地址](https://studygolang.com/dl)。

## 三、下载安装[SOAR](https://github.com/XiaoMi/soar/releases)

下载地址：[https://github.com/XiaoMi/soar/releases](https://github.com/XiaoMi/soar/releases)

（1）windows安装：

修改文件名为soar.exe(可以不做修改，如果不修改输入命令时需要将扩展名补全命令才可生效)
在任意位置创建文件夹soar（如果在c盘请留意权限问题）。并将soar.windows-amd64复制到该目录下。

（2）Linux安装：

下载linux二进制文件，并改名为soar，或者执行命令

```bash
https://github.com/XiaoMi/soar/releases/download/0.9.0/soar.linux-amd64 -O soar
# 修改权限
chmod a+x soar
```

## 四、配置：

（1）在soar目录下创建配置文件soar.yaml。

（2）配置说明：请参考官网[请参考官网](https://github.com/XiaoMi/soar/blob/master/doc/config.md)（注：请注意修改配置说明中的${your_log_dir}参数，并将环境中的disable设置为true）

## 五、测试执行

控制台进入创建的文件夹（也可配置到环境变量中），输入命令：windows：soar -query "select * from t_parent"；Linux：./soar -query "select * from t_parent"（需要根据实际情况修改sql）

![sql分析](//cdn.smallyoung.cn/article/5fdabd56e4b0b655d86e8de9/b2b7ee37587041e7b5a372f6e5a056e0.png!/format/webp)

## 六、使用扩展

在实际使用中，经常会遇见复杂的sql，这时候使用命令行是非常恶心的事情。官方没有提供 Web 界面的支持，但社区已经有相当多的同学基于 SOAR 开发了衍生的 Web 平台。可以参考如下 ISSUE 的讨论。[https://github.com/XiaoMi/soar/issues/51](https://github.com/XiaoMi/soar/issues/51)
