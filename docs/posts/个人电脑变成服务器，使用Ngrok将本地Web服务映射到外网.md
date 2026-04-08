---
title: 个人电脑变成服务器，使用Ngrok将本地Web服务映射到外网
date: 2016-11-08
cover: //cdn.smallyoung.cn/article/cover/0803950bf1dd4d28a66050d0a4b8701f.jpg!/format/webp
category: 其他
tags:
  - Nginx
  - 服务器
description: "一、什么是ngrok ngrok 是一个反向代理，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。ngrok 可捕获和分析所有通道上的流量，便于后期分析和重放。 二、为什么要使用n"
author: smallyoung
---

## 一、什么是ngrok

`ngrok` 是一个反向代理，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。ngrok 可捕获和分析所有通道上的流量，便于后期分析和重放。

## 二、为什么要使用ngrok

作为一个Web开发者，我们有时候会需要临时地将一个本地的Web网站部署到外网，以供他人体验评价或协助调试等等，通常我们会这么做：找到一台运行于外网的Web服务器，服务器上有网站所需要的环境，然后自行搭建网站，部署到服务器调试结束后，再将网站从服务器上删除只不过是想向朋友展示一下网站而已，要不要这么麻烦，累感不爱╰（`□′）╯

## 三、ngrok可以做什么

启动ngrok后，会获得一个随机的二级域名，当我们启动电脑上的tomcat（或其他）时，我们就可以通过ngrok获取的这个域名访问到我们的这个web项目，就如同我们访问本机的localhost一样。

## 四、获取ngrok

在ngrok[官网](https://ngrok.com/download)下载;

> 注：访问官方网站需要翻墙，也可以自行百度下载

![ngrok](//cdn.smallyoung.cn/article/5fd86410e4b01dc74778c5cb/ffef0cc2e1894cf092e3b95a75415804.png)

## 五、启动ngrok

双击`ngrok.exe`，会弹出一个cmd命令框，然后输入`ngrok http +端口`，如`ngrok http 80`，即可以启动程序。网上大多数都是“打开CMD命令行，进入ngrok.exe所在目录，运行ngrok.exe+端口，如ngrok.exe 80。”可是本人测试这样不能正常启动，需要输入的命令换成ngrok.exe http+端口才可以正常启动。

![ngrok](//cdn.smallyoung.cn/article/5fd86410e4b01dc74778c5cb/8adf91aaf5ee458387bb30a793f86192.png)

输入ngrok http 80启动后

![启动后](//cdn.smallyoung.cn/article/5fd86410e4b01dc74778c5cb/6897ffe35c09414dbbdbeaa55cfc0350.png)

获取的二级域名就是 `http://cc5e1e4e.ngrok.io`

## 六、访问

这时当我们创建一个java web项目时，启动tomcat就可以通过这个域名访问到我们本地的项目了

![访问](//cdn.smallyoung.cn/article/5fd86410e4b01dc74778c5cb/8d958fd1b83a49168c01b4f553338e3b.png)





