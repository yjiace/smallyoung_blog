---
title: Ubuntu更改数据源
date: 2016-11-17
cover: //cdn.smallyoung.cn/article/cover/f5b55c6d9dcc477a8e4d146c770be57f.jpg!/format/webp
category: 其他
tags:
  - Ubuntu
  - 数据源
description: "Ubuntu自带的数据源在国外，受某墙的影响，会出现无法访问的情况，这就需要我们通过修改数据源来获取软件及更新。今天我们就讲解一下修改Ubuntu系统的数据源。我们以阿里云数据源为例，需要其他的可自行"
author: smallyoung
---


Ubuntu自带的数据源在国外，受某墙的影响，会出现无法访问的情况，这就需要我们通过修改数据源来获取软件及更新。今天我们就讲解一下修改Ubuntu系统的数据源。我们以阿里云数据源为例，需要其他的可自行百度获取其他网站的数据源。

## 一、进入apt文件夹

```bash
cd /etc/apt
```

## 二、备份原来的源文件，要养成良好的习惯 

```bash
sudo cp sources.list sources.list_backup
```

## 三、将之前的源全部删除 

```bash
echo '' > sources.list 
```

## 四、编辑新源文件

```bash
nano sources.list 
```

## 五、加入新的数据源（阿里云）

```bash
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ xenial-proposed main restricted universe multiverse

deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse

deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse

deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse

deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse

deb-src http://mirrors.aliyun.com/ubuntu/ xenial-proposed main restricted universe multiverse

deb http://archive.canonical.com/ubuntu/ xenial partner

deb http://extras.ubuntu.com/ubuntu/ xenial main
```

## 六、更新数据源

```bash
sudo apt-get update
```


> 注：修改sources.list 需要root权限。因此在修改时，需要提前切换到root用户。


