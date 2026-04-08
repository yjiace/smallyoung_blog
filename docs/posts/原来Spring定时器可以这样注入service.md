---
title: 原来Spring定时器可以这样注入service
date: 2017-01-08
cover: //cdn.smallyoung.cn/article/cover/5a16823bac954843b78f6b71cd4e27e2.jpg!/format/webp
category: 后端开发
tags:
  - Spring
  - 定时器
description: "近日项目开发中需要执行一些定时任务，比如需要在每天凌晨时候，分析一次前一天的日志信息，借此机会整理了一下定时任务的几种实现方式，由于项目采用spring框架，所以我都将结合spring框架来介绍。 一"
author: smallyoung
---

近日项目开发中需要执行一些定时任务，比如需要在每天凌晨时候，分析一次前一天的日志信息，借此机会整理了一下定时任务的几种实现方式，由于项目采用spring框架，所以我都将结合spring框架来介绍。

## 一、定时器的配置

> 注意配图中beans里面，要有相关的引用

![beans引用](//cdn.smallyoung.cn/article/5fd966e5e4b0b655d86e8dd2/a06f084cc61648d18ca28bef3a525f95.jpg)


``` xml
----------------------------------------
xmlns:task="http://www.springframework.org/schema/task"
------------------------------------------
http://www.springframework.org/schema/task
http://www.springframework.org/schema/task/spring-task-3.2.xsd
-------------------------------------------
<!-- task任务扫描注解 -->
<task:annotation-driven />
<context:component-scan base-package="所需要扫描的包或类"></context:component-scan>
```

## 二、创建方法

创建相对应的处理业务的Task方法


![业务方法](//cdn.smallyoung.cn/article/5fd966e5e4b0b655d86e8dd2/e66e006422ae4e5e979a6e43019e1359.jpg)
	
> 注：需要添加相关的注解。`@Component`、`@Scheduled`

## 三、注入

定时器已经基本满足了基本业务的开发，但是，由于定时器的执行优先于注入，因此我们不能通过`@Resource`注入`service`。因此我们需要创建一个类ApplicationContextUtil，用来获取service。

![ApplicationContextUtil](//cdn.smallyoung.cn/article/5fd966e5e4b0b655d86e8dd2/39848ae484a0480f8e20354d273380b1.jpg)

## 四、获取service

定时器中通过`ApplicationContextUtil`类，获得`service`

![获取service](//cdn.smallyoung.cn/article/5fd966e5e4b0b655d86e8dd2/1ef26bfebaf54e08af51f23676cf1be1.jpg)
	
> 注：相对应的，在`service`中需要配置`service`名称。

![service名称](//cdn.smallyoung.cn/article/5fd966e5e4b0b655d86e8dd2/30dc630e9efa48c9bb78dade9786825b.jpg)

这样我们就可以获取到`service`对象进行相对应的业务处理，而不需要再创建`jdbc`来操作了。


