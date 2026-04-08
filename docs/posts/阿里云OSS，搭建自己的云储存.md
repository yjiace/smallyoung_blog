---
title: 阿里云OSS，搭建自己的云储存
date: 2017-01-09
cover: //cdn.smallyoung.cn/article/cover/644d592605e6422aa1f604c07b398a23.jpg!/format/webp
category: 其他
tags:
  - 阿里云
  - OSS
  - 云储存
description: "目前，对于互联网的疯狂发展，数据储存成为了大多数个人或小公司的瓶颈。由于服务器的磁盘空间不是很大、宽带也不是很充足。储存网站的内容成为了一笔较大的开销。尤其是有下载、视频、音乐等业务的网站来说，那更是"
author: smallyoung
---

目前，对于互联网的疯狂发展，数据储存成为了大多数个人或小公司的瓶颈。由于服务器的磁盘空间不是很大、宽带也不是很充足。储存网站的内容成为了一笔较大的开销。尤其是有下载、视频、音乐等业务的网站来说，那更是一笔庞大的开销。

较比之前，我们可以通过各大厂商提供的网络云盘进行数据的储备。但是进来由于国家的某些政策，各大厂商纷纷关闭了网盘服务。目前也就百度云还能正常使用，但是受限很大。

因此我们迫切的需要一个可以储存信息的服务。小编新建的网站采用了阿里云的oss云储存。储备一些下载资源。下面我们就谈谈阿里云的OSS吧。

## 一、对象存储

对象存储（`Object Storage Service`，简称`OSS`），是阿里云对外提供的海量、安全和高可靠的云存储服务。RESTful API的平台无关性，容量和处理能力的弹性扩展，按实际容量付费真正使您专注于核心业务。

![对象存储](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/8fa0b1c309e94c7e961879ce79fa194e.jpg)

在这里我们直接点击开通就可以了。

## 二、新建Bucket

小编的理解就是新建一个硬盘名称，不过这个硬盘只有名称。

![新建Bucket](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/24e5607f9084433788528ea3c9166c9d.jpg)

![新建Bucket](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/105dcd2b078445869e81ec2aee39b8c5.jpg)

创建完之后我们就可以在下面看到我们创建的Bucket了。

![新建Bucket](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/c9e56a93a5404ebd9f2a0612dec659ef.jpg)

## 三、购买流量包

Bucket创建完成后，我们就要购买流量包，也就是为我们要购买硬盘了。要不然光有硬盘的名字也是不能储存文件的。

点击页面右侧资源包的购买。

![购买流量包](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/e4480bd5512448d191544dc545835c1d.jpg)

![购买流量包](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/01e7a260f475478d82efe1959cb70e2c.jpg)

包年的话40G一年是9块，还是比较便宜的。就当是充了个阿里云的会员吧。不过之前小编买的是100G一年也是9块，不过现在好像没有这个活动了

## 四、上传

这样我们的一个网盘就创建完成了。然后就让我们往硬盘里传文件的。点击Bucket右上角的齿轮。进入设置页面。

![设置页面](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/cc8d399d719b4fa8acd17dd9df5166c6.jpg)

![设置](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/6a4baa0556bc4b5bb386c18319071034.jpg)

我们可以在这里设置Bucket的一些属性，然后点击Object管理。这里就是我们需要进行文件管理的地方的。我们可以通过上传文件、创建文件夹、刷新来对我们储存的文件进行操作。

![文件管理](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/a92efa8f32c842d0a2b69126ad2e409e.jpg)

## 五、下载

如果我们需要获取某个文件的下载地址的话，只要点击文件后面的“获取地址”即可。

## 六、关于带宽

关于带宽，由于浏览器限制500M，因此此处使用的是客户端上传测试。

### 1、360极速浏览器（下载

![360极速浏览器](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/9f60cb04f89f4c8c911fe9d8d1cf88f7.png)

### 2、上传（OSS客户端）

![OSS客户端](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/ab9a18718b474a90bc21f8e8c6da2efa.png)

### 3、带宽

测试环境时间段带宽（共享50M）

![带宽](//cdn.smallyoung.cn/article/5fd969aae4b0b655d86e8dd3/c206fe0659f944489fa0c71abaa5c876.png)

## 七、关于安全性。
1. 我们可以在Bucket属性中设置文件的读写权限。分别有：
* 私有：对object的所有访问操作需要进行身份验证。
* 公共读：对object写操作需要进行身份验证；可以对object进行匿名读。
* 公共读写：所有人都可以对object进行读写操作。
2. 可以设置防盗链，避免其他网站盗用我们的某些资源。
3. 也可以自定义我们自己的域名，不过需要提前备案。
4. 同时阿里云也提供了一些图片处理技术，比如常用的加水印，可以通过阿里云设置，对网页引用的图片进行加水印处理等。

