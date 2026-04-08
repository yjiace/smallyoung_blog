---
title: IDEA初始配置
date: 2021-02-08
cover: //cdn.smallyoung.cn/article/cover/d73eea4b509448a890ad7ff4d850214c.jpg!/format/webp
category: 其他
tags:
  - IDEA
  - 配置
description: "一、下载地址 https://www.jetbrains.com/idea/ 二、参数配置 1、取消每次启动默认打开最后关闭的项目 File Settings Appearance & Behavio"
author: smallyoung
---

## 一、下载地址
https://www.jetbrains.com/idea/

## 二、参数配置
### 1、取消每次启动默认打开最后关闭的项目

> File --> Settings --> Appearance & Behavior --> System Settings

![取消启动默认打开项目](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/7a1fd388939d4ac8a5a7beacb1d25143.png!/format/webp)

### 2、配置Git

> File --> Settings --> git

![配置Git](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/3e4dbcfe55cb4841a1fa3e139b6ba561.png!/format/webp)

### 3、配置maven

> File --> Settings --> Build,Execution,Deployment --> Build Tools --> Maven

![配置maven](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/cd65651c117a4224a53462a3f154b3f3.png!/format/webp)

### 4、配置文件编码为UTF-8

> File --> Settings --> Editor -> File Encodings

![配置文件编码](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/67ba811b04794ce4a980d6f8dbb2b6ed.png!/format/webp)

### 5、代码自动提示不区分大小写

> File --> Settings --> Editor -> General --> Code Completion

![自动提示不区分大小写](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/0861203f8df640c5b705e88fe86613a2.png!/format/webp)

### 6、设置自动导包

> File --> Settings --> Editor -> General --> Auto Import

![自动导包](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/46bf0aff2f5d48d5b35852260d4c1d8d.png!/format/webp)

### 7、关闭重复代码提示

> File --> Settings --> Editor -> Inspections

搜索General，取消二级选项中的Duplicated code fragment勾选

![自动关闭重复代码提示导包](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/28ace5034fd446038924fcee0a808cac.png!/format/webp)

### 8、去掉xml中黄色背景

> File --> Settings --> Editor -> Inspections

搜索SQL，取消二级选项中的No data sources configured（没有配置数据源）、SQL dialect detection（SQL方言检测）勾选

![xml中黄色背景](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/284b8b2c2d514a40b61d283dfb0fe473.png!/format/webp)

### 9、自动生成 serialVersionUID

> File --> Settings --> Editor -> Inspections

搜索Serialization issues，勾选Serializable class without 'serialVersionUID'

![自动生成 serialVersionUID](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/90b5fe370ef54dffa0b9c39e6b423c16.png!/format/webp)

### 10、隐藏.idea文件夹和.iml等文件

> File --> Settings --> Editor --> File Types

在底部”Ignore files and folders”一栏添加 .idea;.iml;

![隐藏.idea文件夹和.iml等文件](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/85748242148b4a999bc7b601413c48ce.png!/format/webp)


### 11、打开多个文件显示在多行tab上

> File --> Settings --> Editor --> General --> Editor Tabs

![多行tab](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/423f479595784494b771bff927cd07c1.png!/format/webp)

### 12、类注释模板

> File --> Settings --> Editor --> File and Code Templates

![类注释模板](//cdn.smallyoung.cn/article/6020f192e4b0f3530e83d419/6e09918beb15444cb078b408e06775d2.png!/format/webp)