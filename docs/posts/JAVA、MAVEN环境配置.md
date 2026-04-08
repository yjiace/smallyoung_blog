---
title: JAVA、MAVEN环境配置
date: 2021-02-08
cover: //cdn.smallyoung.cn/article/cover/8aa5b477bb53404d95c1349302545025.jpg!/format/webp
category: 后端开发
tags:
  - Java
  - Maven
  - 环境变量
description: "一、JAVA环境配置 1、下载地址 https://www.oracle.com/java/technologies/javase/javasejdk8downloads.html 2、配置环境变量 "
author: smallyoung
---

## 一、JAVA环境配置

### 1、下载地址

https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html

### 2、配置环境变量

1. 右键“此电脑”—>属性–>左侧“高级系统设置”–>环境变量

![高级系统设置](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/f4618c61a6e44aff8091b8f9782bf331.png)


![环境变量](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/930afaee322a432b85ed548fac5cf5d3.png)

2. “系统变量”增加，添加`JAVA_HOME`，地址指向java安装目录

![系统变量](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/5bc32f1a581646fb8d63cc36bda7add7.png)


![JAVA_HOME](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/db3e3bb52f814d7689899f4e1e1126b7.png)

3. 编辑“Path”，找到Path变量，选中然后点击编辑，在编辑页面点击新建，增加 `%JAVA_HOME%\Java\jdk-17\bin、%JAVA_HOME%\Java\jdk-17\lib`

![新建Path变量](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/f10306187d164a3ab2896f2ef717e8c9.png)

4. 验证，win+R键输入cmd，弹出的命令窗口输入`java -version`

![验证](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/56632d67ec494e04911a08952ddc4d77.png)

## 二、MAVEN环境配置

### 1、下载地址

http://maven.apache.org/download.cgi

### 2、安装

将下载的压缩文件解压到指定目录

### 3、配置环境变量

1. 配置`MAVEN_HOME`到环境变量

![MAVEN_HOME](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/07ea2feaf7bc4516bfa4fbb5a3278dbf.png)

2. 修改Path环境变量，增加`MAVEN_HOME`

![增加Path变量](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/3a3b1833ebc047ffa1f3ab7caac13205.png)

3. 验证，命令窗口输入`mvn --version`

![验证](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/471c85cf07ce4279816a2d3797e9a2be.png)

### 4、更改数据源和仓库地址

在解压缩的文件中找到conf文件夹，打开里面的`settings.xml`配置文件

1. 配置数据源（搜索mirrors），增加如下配置，这里配置的是阿里云的镜像

``` xml
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>
```

![配置数据源](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/859153687ed54617ab50e054ba272074.png)

2. 更改仓库（搜索localRepository）

```xml
<localRepository>D:/epository</localRepository>
```

![更改仓库](//cdn.smallyoung.cn/article/6020f720e4b0f3530e83d41a/08f9e517aa8743e8b60e69ccc464fae3.png)


