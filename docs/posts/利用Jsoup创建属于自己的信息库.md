---
title: 利用Jsoup创建属于自己的信息库
date: 2017-01-13
cover: //cdn.smallyoung.cn/article/cover/aa5fdeddc81d4303b2440351d567b2fa.jpg!/format/webp
category: 后端开发
tags:
  - Jsoup
  - 爬虫
description: "jsoup是一款Java的HTML解析器，可直接解析某个URL地址、HTML文本内容。它提供了一套非常省力的API，可通过DOM，CSS以及类似于jQuery的操作方法来取出和操作数据。今天小杨就以$"
author: smallyoung
---

`jsoup`是一款`Java`的`HTML`解析器，可直接解析某个URL地址、HTML文本内容。它提供了一套非常省力的API，可通过`DOM`，`CSS`以及类似于`jQuery`的操作方法来取出和操作数据。今天小杨就以[糗事百科](http://www.qiushibaike.com/)为例，爬一爬糗事百科首页的小笑话。创建一个本地的笑话库。

## 一、下载JAR包

首先去[官网](https://jsoup.org/download)下载相关的jar包，jsoup.jar。目前最新版本是1.10.2。

## 二、获取页面HTML代码

使用[官方API](http://www.open-open.com/jsoup/)获取糗事百科首页的代码

![首页代码](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/fa2f6cc3a1804c28897f321aa4ee4bd0.jpg)

是不是感觉非常简单，此处的doc就是我们获取的页面的源代码，而且jsoup会自动的根据获取的页面的编码格式来进行解码，以保证我们获取的是没有乱码的源代码。

## 三、解析

下面我们就来解析他首页的源代码吧。

通过小杨观察，糗事百科的笑话全部放在的一个class=content的div下面的span里面

![源代码](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/af22733c0db248e5b2b78678e4255a62.jpg)

然后我们根据API来解析吧

![解析](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/d285289a3c89467996595ddd8815d831.jpg)

小杨用的是图片红框里标注的两个方式，这些都是可以组合使用的。是不是感觉和jQuery选择器那么相似呢。

![解析](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/8f2cd1012dde4de895d514db2feec163.jpg)

然后就让我解析一下这个`mastheads`吧。我们在这里获取的class为content的div下面的span对象

![mastheads](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/a4082e87bf304c919443dae3d7f42278.jpg)

打印出来是不是感觉多了好多没有用的span标签呢，这是因为这是这个span对象，这是一个对象，不是内容呦。我们可以通过html()方法获取文本内容。

![解析span源码](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/fdfdce77d6b64e1aa34a4336873aef44.jpg)

![解析span结果](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/7679803d5eba4ca688ad4d6729ae4469.jpg)

至此，我们就获取的糗事百科首页的小笑话集合，是不是感觉超简单呢。赶紧来试试吧。小杨把它封装到了List容器里面。贴上完整的代码。希望对大家有帮助。

![笑话集合](//cdn.smallyoung.cn/article/5fd96fa0e4b0b655d86e8dd5/608661a3a7594283bbcc1feeb23ac032.jpg)


