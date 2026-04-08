---
title: java8，你应该了解的新特性（新时间与日期API）
date: 2017-09-16
cover: //cdn.smallyoung.cn/article/cover/5f6a3a6f60c34451b9002906749eabe4.jpg!/format/webp
category: 后端开发
tags:
  - Java8
  - 日期
  - LocalDate
description: "一、使用 LocalDate、LocalTime、LocalDateTime 类的实例是不可变的对象，分别表示使用 ISO8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含"
author: smallyoung
---

## 一、使用

`LocalDate`、`LocalTime`、`LocalDateTime` 类的实例是**不可变的对象**，分别表示使用 `ISO-8601`日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息。也不包含与时区相关的信息。

> 注：ISO-8601日历系统是国际标准化组织制定的现代公民的日期和时间的表示法

![java8 新时间和日期API](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/c3c233bd10d04503b4a4ec1e481775cf.png)

## 二、Instant 时间戳

用于“时间戳”的运算。它是以`Unix`元年(传统的设定为UTC时区1970年1月1日午夜时分)开始所经历的描述进行运算。

![时间戳](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/b11febac020d4c738a0f75565511b404.png)

**Instant 时间戳默认获取UTC（世界协调时间）时区的时间戳**

我们可以通过`Instant`的`atOffset()`方法对时间戳进行偏移

![偏移](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/d067110bcf444cc5b541c9bf77755478.png)

如果想要获取时间戳，则需要使用`toEpochMilli()`方法。

![toEpochMilli](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/9a02c6eef43541288f7ee9c4053bac45.png)

## 三、Duration  和 Period

### 1、Duration

用于计算两个“时间”间隔

![Duration](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/7d8b406bcd1d41c494c6fac8d19d22de.png)

另外Duration也提供了将间隔时间转换的方法

![时间转换](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/9ac5631b266d4adf8411acce02192ee0.png)

![toMillis](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/3ed0c9a4bcd4479488fd3f5c62696386.png)

> 注意：当比较的精度太高（毫秒）时，在获取当前时间Instant2时也会消耗相当少的时间，此时间有时也会被计入相差时间内。

![Instant消耗时间](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/2d3d1fb05db6415d81ed41daad1ecb10.png)

### 2、Period

用于计算两个“日期”间隔

![Period](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/d84ab78ce49c4b279e6d10c967f72c28.png)

## 四、日期的操作

* `TemporalAdjuster` : 时间校正器。有时我们可能需要获取例如：将日期调整到“下个周日”等操作
* `TemporalAdjusters` : 该类通过静态方法提供了大量的常用 `TemporalAdjuster` 的实现。例如获取下个周日：

![获取下个周日](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/d025a22cc40f44fdae5a1c6a3cbdfdc2.png)

同样，我们也可以自定义规则，如：获取下个工作日：

![下个工作日](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/4ea9cdf7d40c4ded9fee3d7e0cc31ac5.png)

## 五、解析与格式化

`java.time.format.DateTimeFormatter`类：该类提供了三种格式化方法：
* 预定义的标准格式
* 语言环境相关的格式
* 自定义的格式。

![DateTimeFormatter](//cdn.smallyoung.cn/article/5fda0d0de4b0b655d86e8de3/bfb188e3bab349b1a7fc563ad7ee6b29.png)

## 六、时区的处理

Java8 中加入了对时区的支持，带时区的时间为分别为：`ZonedDate`、`ZonedTime`、`ZonedDateTime`

其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式例如 ：`Asia/Shanghai` 等；

* ZoneId：该类中包含了所有的时区信息；
* getAvailableZoneIds() : 可以获取所有时区时区信息；
* of(id) : 用指定的时区信息获取 ZoneId 对象。

