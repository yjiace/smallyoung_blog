---
title: Maven学习（一）搭建Maven环境
date: 2016-10-28
cover: //cdn.smallyoung.cn/article/cover/36adde97637449f4a7231f3b13056740.jpg!/format/webp
category: 后端开发
tags:
  - maven
  - 搭建
description: "一、概述 安装 Maven 之前要求先确定你的 JDK 已经安装配置完成。Maven是 Apache 下的一个项目，目前我的新版本是 3.3.9，我用的也是这个。 首先去官网下载 Maven：http"
author: smallyoung
---

## 一、概述

安装 Maven 之前要求先确定你的 JDK 已经安装配置完成。Maven是 Apache 下的一个项目，目前我的新版本是 3.3.9，我用的也是这个。

首先去官网下载 Maven：http://www.apache.org/dyn/closer.cgi/maven/binaries/apache-maven-3.3.9-bin.tar.gz

## 二、配置 maven 环境变量

系统变量：`MAVEN_HOME = C:\Program Files\Java\apache-maven-3.3.9`

系统变量：`path = %MAVEN_HOME%\bin`

相信大家都有配过环境变量的，详细步骤就不说了，对着把属性名和属性值配上的OK了。

打开 cmd，在里面敲

```bash
mvn -version
```

![mvn -version](//cdn.smallyoung.cn/article/5fd71a9de4b01369b5abb6dd/c2527a98fe9947b0a6f367f6547b3ec2.png)
   
如果能打印如上信息，说明到此 Maven3 已经在你的电脑上安装完成。

mvn 是 maven 的一个指令，`mvn -version` 是查看版本信息，我的操作系统是 64位的 WIN10，安装的 maven 是 `3.3.9`

如果能打印如上信息，说明到此 Maven3 已经在你的电脑上安装完成。

## 三、修改 maven 本地仓库存放位置

找到 apache-maven-3.3.9下的 conf 下的 settings.xml 配置文件，我的是在 `C:\Program Files\Java\apache-maven-3.3.9\conf\settings.xml`
       
![修改本地仓库](//cdn.smallyoung.cn/article/5fd71a9de4b01369b5abb6dd/3f8fff8d24fa4a5991f857d890ba4296.png)
       
`apache-maven-3.3.9`的仓库默认是放在本地用户的临时文件夹下面的 .m2 文件夹下的 repository 下，我的是在 `C:\Users\Administrator\.m2\repository` 目录下，现在我们来修改将它指定到我们自己的路径下，我现在要将仓库指定到 `D:\mvnRespo` 目录下，只需要将上面注销的本地仓库打开，然后把相应的路径值写到里面去就行了：

![修改maven默认地址](//cdn.smallyoung.cn/article/5fd71a9de4b01369b5abb6dd/3c68d43f1e154efa8a0d2f23a54bd2b0.png)

## 四、MyEclipse配置 maven

(1)在Preferences-->MyEclipse-->Maven4MyEclipse-->Installations点击 Add 按钮，选到你本机安装 Maven 的路径值。
        
![MyEclipse配置 maven](//cdn.smallyoung.cn/article/5fd71a9de4b01369b5abb6dd/12db39035d0448d9b86d6b2db7c2a329.png)
        
(2)在Preferences-->MyEclipse-->Maven4MyEclipse-->User Settings中，点击Update Settings，加载刚才我们 对settings.xml的更改
        
![MyEclipse配置 maven](//cdn.smallyoung.cn/article/5fd71a9de4b01369b5abb6dd/5e1c7207e8754213bbef701bafe30ae3.png)
 