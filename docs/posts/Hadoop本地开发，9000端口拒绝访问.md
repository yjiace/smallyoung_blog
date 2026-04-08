---
title: Hadoop本地开发，9000端口拒绝访问
date: 2016-12-22
cover: //cdn.smallyoung.cn/article/cover/5061119fe99d4419a4d06c1fb3be3a76.jpg!/format/webp
category: 后端开发
tags:
  - Hadoop
  - 拒绝访问
  - 分布式
  - 集群
description: "最近在学习Hadoop，忙了好几天，终于学会了Hadoop的分布式部署。可是在MyEclipse开发中，总是无法远程连接到Hadoop集群的9000端口。今天终于明白哪里配置错误了，在这分享给大家。希"
author: smallyoung
---

最近在学习`Hadoop`，忙了好几天，终于学会了`Hadoop`的分布式部署。可是在`MyEclipse`开发中，总是无法远程连接到`Hadoop`集群的`9000`端口。今天终于明白哪里配置错误了，在这分享给大家。希望对大家有用。

## 一、环境说明

* hadoop-2.7.3
* jdk1.8.0_112
* 阿里云 Ubuntu 14.04 64位

## 二、配置端口

在配置文件是我配置的是9000端口。

![配置](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/dca96cf8b4604b4882e7b073780421e8.jpg)

## 三、连接

`MyEclipse`连接`9000`代码（需要dfs相关jar包）

![连接9000](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/4a86097bb04c421180f2b00b0ab09892.jpg)

## 四、端口访问

之前在网上查了许多相关资料，无外乎是设置防火墙，开放`9000`端口；关闭防火墙；配置文件换成IP地址；等等。我不能说这些方法不对，至少有些问题确实是防火墙的限制。或者其他，毕竟同一个错误，会有许多引发原因。我的这个方法也只是解决一小部分的问题。首先，利用`netstat -tpnl`查看的端口开放情况（之前一直没留意是这的问题）。

![查看端口](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/e401dcb8fa304fb4a71fbfcdaab4f25e.jpg)

 而与之相对于的`hosts`配置文件为

![hosts](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/9b899852bdfd42d498643d49f9198186.jpg)


通过查看端口发现，`9000`端口只允许本机访问，我远程连接当然会提示拒绝访问了。可能是`Hadoop`为了保证集群的安全性，默认的是本集群之间的访问，只允许配置的某一个IP访问吧。于是我想能不能把这个端口放开，允许所以IP访问。于是我把`hosts`中的文件做了下面的修改。

![修改hosts](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/3a457a7aa22a492e8a00a304dbdb00fe.jpg)

将`hadoop-master`指向的IP地址指向`0.0.0.0`，然后重启hadoop查看端口占用。

![端口占用](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/5941550902694ee6b0184280fc628e78.jpg)

再用`MyEclipse-hadoop`插件，测试连接成功。

![连接成功](//cdn.smallyoung.cn/article/5fd944f6e4b0b655d86e8dd1/3411329676824923b609d974874cdc4b.jpg)

> 注：本人刚开始学习`Hadoop`，说的不对的地方希望大家指正。同时也希望这个方法对大家有用。另外，这种方法不建议大家在生产环境使用，毕竟任何一个IP地址都可以访问到你的Hadoop文件系统。
