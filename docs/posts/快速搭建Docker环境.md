---
title: 快速搭建Docker环境
date: 2021-08-13
cover: //cdn.smallyoung.cn/article/cover/0a3803478de5493c8369b5995fae7d34.jpg!/format/webp
category: Docker
tags:
  - Docker
  - 搭建
description: "一、概述 Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。容器是完全使用沙"
author: smallyoung
---

## 一、概述
`Docker` 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 `Linux`或`Windows` 机器上，也可以实现`虚拟化`。容器是完全使用`沙箱机制`，相互之间不会有任何接口。

## 二、安装

### 1、安装Docker的依赖库

```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```

![安装Docker的依赖库](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/83368ca928c94329b44345c8a8df0999.png!/format/webp)

### 2、添加Docker CE的软件源信息

```bash
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

![添加Docker CE的软件源信息](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/86254df58842408097115dab6c16c5da.png!/format/webp)

### 3、安装Docker CE

```bash
yum makecache fast
yum -y install docker-ce
```

![安装Docker CE](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/3b0597b6d2b34ec49e6872cb06afd6f0.png!/format/webp)

### 4、启动Docker服务并开机自启

``` bash
systemctl start docker
systemctl enable docker
```

## 三、配置阿里云镜像仓库（镜像加速）

`Docker`的默认官方远程仓库是 hub.docker.com，由于网络原因，下载一个`Docker`官方镜像可能会需要很长的时间，甚至下载失败。为此，阿里云容器镜像服务ACR提供了官方的镜像站点，从而加速官方镜像的下载。下面介绍如何使用阿里云镜像仓库。

### 1、登录阿里云镜像服务

首先登录阿里云账号，找到镜像服务

![镜像服务](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/15d3ff62c57c41c589069305621b7dac.png!/format/webp)

### 2、镜像加速器

选择左侧菜单栏中的`镜像工具`-> `镜像加速器`

![镜像加速器](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/df59a44d2f9e4b97aee3f07d55afe1f9.png!/format/webp)

### 3、 配置Docker的自定义镜像仓库地址

直接运行阿里云提供的配置命令即可

``` bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://***.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

![配置命令](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/915303d60c284aab88fba02f43b8aba1.png!/format/webp)

![执行配置](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/04b512409b754bbdaf20e6c85ba013d0.png!/format/webp)

## 四、使用Docker安装Nginx服务

### 1、查看可用版本

``` bash
docker search nginx
```

![Nginx的可用版本](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/67464748b3424d768252768bc8f1ca5b.png!/format/webp)

### 2、拉取最新版的Nginx镜像

```bash
docker pull nginx:latest
```

![拉取最新版的Nginx镜像](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/fb4a174f4eb3478e96b74644c605e438.png!/format/webp)

### 3、查看本地镜像

```bash
docker images
```

![查看本地镜像](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/21111dd1f1784009a0f23312c55ffd8b.png!/format/webp)

### 4、运行容器

```bash
docker run --name nginx-test -p 8080:80 -d nginx
```

命令参数说明：

* –name nginx-test：容器名称。
* -p 8080:80： 端口进行映射，将本地8080端口映射到容器内部的80端口。
* -d nginx： 设置容器在后台一直运行。

命令输出如下所示：

![运行容器](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/6d62153a46a64eba9b6980d05cb49d66.png!/format/webp)

### 5、访问Nginx

在浏览器地址栏输入 `http://<IP>:8080` 访问Nginx服务

![访问Nginx](//cdn.smallyoung.cn/article/612d8ff5e4b07c4e9d65949d/7336458efb62418499e906629191a4e0.png!/format/webp)

## 五、问题

`CentOS 8` 在执行`yum makecache fast`时，会报`yum makecache: error: argument timer: invalid choice: 'fast' (choose from 'timer')`的错误，这是由于`CentOS 8`没有`fast`参数，执行时直接去掉即可

