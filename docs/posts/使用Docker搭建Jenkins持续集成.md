---
title: 使用Docker搭建Jenkins持续集成
date: 2021-09-17
cover: //cdn.smallyoung.cn/article/cover/14bd580620c54e62acfd884ba40ab18d.jpg!/format/webp
category: Docker
tags:
  - Docker
  - Jenkins
  - 持续集成
description: "一、系统要求 1、最低推荐配置: 256MB可用内存 1GB可用磁盘空间(作为一个Docker容器运行jenkins的话推荐10GB) 2、为小团队推荐的硬件配置: 1GB+可用内存 50 GB+ 可"
author: smallyoung
---

## 一、系统要求
### 1、最低推荐配置:

* 256MB可用内存
* 1GB可用磁盘空间(作为一个Docker容器运行jenkins的话推荐10GB)

### 2、为小团队推荐的硬件配置:

* 1GB+可用内存
* 50 GB+ 可用磁盘空间

### 3、软件配置

* Java 8—​无论是Java运行时环境（JRE）还是Java开发工具包（JDK）都可以。

> 注意: 如果将Jenkins作为Docker 容器运行，这不是必需的

## 二、安装

### 1、查询Jenkins镜像

``` bash
docker search jenkins
```

![查询Jenkins镜像](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/d36795116a5c470d94a65a5e44828a24.png!/format/webp)

> 建议使用的Docker映像是`jenkinsci/blueocean image`(来自 `the Docker Hub repository`)。 该镜像包含当前的长期支持 (LTS) 的Jenkins版本 （可以投入使用） ，捆绑了所有Blue Ocean插?件和功能。这意味着你不需要单独安装Blue Ocean插件。

### 2、启动 Jenkins

此处是执行执行docker的run命令，当执行run时，系统会先在本地查找镜像，如果本地没有的话，会自动去远程仓库拉取，省略了 `docker pull jenkinsci/blueocean` 步骤。

``` bash
docker run -d --restart=always 
 --name jenkins-blueocean -u root 
 -p 8082:8080 -p 50000:50000 
 -e JAVA_TOOL_OPTIONS='-Dsun.jnu.encoding=UTF-8 -Dfile.encoding=UTF-8' 
 -v /usr/bin/docker:/usr/bin/docker 
 -v /usr/local/jenkins:/var/jenkins_home 
 -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean
```

* -d：表示后台运行
* --name：表示为docker容器起的别名
* -u root：表示以root身份启动，避免在自动化部署项目时出现权限不足的情况，当然也会损失安全性
* --restart=always：当docker启动时，自动启动该容器，类似开机自启的功能
* -p：开放的端口（宿主机端口:容器端口），50000端口是集群使用的，可以忽略
* -e：设置系统变量，这里指定了java的环境变量，避免控制台乱码
* -v：挂载文件，将容器文件挂载到宿主机目录（宿主机目录:容器内部目录）

这里第一行（`/usr/bin/docker:/usr/bin/docker`）将docker命令的目录挂载到宿主机的docker命令目录，这样可以是jenkins拥有调用宿主机docker命令的能力；第二行（`/usr/local/jenkins:/var/jenkins_home`）映射的是Jenkins的安装目录；第三行（`/var/run/docker.sock:/var/run/docker.sock`）则表示jenkins容器与Docker守护进程通信。

如果 jenkins 容器需要实例化其他Docker容器，则该守护进程（`-v /var/run/docker.sock:/var/run/docker.sock`）是必需的。 如果运行声明式管道，其语法包含agent部分用 docker 。例如， agent { docker { … } } 此该守护进程同样也是必需的。

![启动 Jenkins](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/b0057d26ef3c44f4975009a596a14e78.png!/format/webp)

### 3、查看启动日志和登录密码

由于是后台启动，我们无法判断是启动完成，此时我们可以使用`docker logs`命令查询启动日志

首先我们需要使用 `docker ps` 命令获取服务的`container id`

![docker ps](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/cbc78acf01dc452591e701f50e32fe24.png!/format/webp)

然后使用 `docker logs` 命令查看启动日志，其中 -f 表示跟踪日志输出

``` bash
docker logs -f 91b6dbb50413
```

![启动日志](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/e73f445f21be4617beac3caad6ce0d34.png!/format/webp)

日志输出中的`2ff2d857a7cb4f40b20ba393b16c1872`就是我们初始化系统用到的密码。此时我们访问地址 `http://ip:8082`

![登录系统](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/ce214a6d8e334b4cb631d3c433c678e6.png!/format/webp)


我们也可以通过登录界面的提示，进入容器内部查询密码

``` bash
docker exec -it jenkins-blueocean /bin/bash

cat /var/jenkins_home/secrets/initialAdminPassword

```

![容器内部查询密码](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/7e387d29acc74cb5ac7741118e425013.png!/format/webp)


### 3、初始化系统

在输入密码，点击继续后，会进入选择插件页面，此时我们选择安装推荐的插件 即可。

![安装推荐的插件](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/dbb052de892c4d61b920ee530ff3152e.png!/format/webp)

![安装中](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/66a8421caffe4b01bcffec7cd1f1b521.png!/format/webp)

### 4、设置账号密码

安装完成后会自动进入设置账号密码页面，此时我们设置好账号、密码保存完成即可。

![设置账号密码](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/f4db3288427e4f1d85ea602f51b39216.png!/format/webp)

![开始使用](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/e285c52ad5804e44938308a8cc2c6304.png!/format/webp)

![首页](//cdn.smallyoung.cn/article/61440025e4b07c4e9d6594a7/ae1588807e2942168ae0413d95e4b5ad.png!/format/webp)
