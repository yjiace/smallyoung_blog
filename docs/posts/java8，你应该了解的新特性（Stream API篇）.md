---
title: java8，你应该了解的新特性（Stream API篇）
date: 2017-09-14
cover: //cdn.smallyoung.cn/article/cover/b3d0e292899540cea53501e5a6adbfae.jpg!/format/webp
category: 后端开发
tags:
  - Java8
  - Stream
description: "一、新特性简介 1. 速度更快 2. 代码更少（增加了新的语法Lambda表达式） 3. 强大的Stream API 4. 便于并行 5. 最大化减少了空指针异常Optional 其中最为核心的为 L"
author: smallyoung
---

## 一、新特性简介

1. 速度更快
2. 代码更少（增加了新的语法`Lambda`表达式）
3. 强大的`Stream API`
4. 便于并行
5. 最大化减少了空指针异常`Optional`

**其中最为核心的为 `Lambda` 表达式与`Stream API`**

## 二、了解Stream API

`Stream` 是 `Java8` 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用`Stream API` 对集合数据进行操作，就类似于使用 `SQL` 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

流 (`Stream`)  是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。

**集合讲的是数据，流讲的是计算！**

> 注意：
> 1. Stream 自己不会存储元素。
> 2. Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。
> 3. Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。

Stream的操作三个步骤：

1. 创建Stream，一个数据源（如：集合、数组），获取一个流；
2. 中间操作，一个中间操作链，对数据源的数据进行处理；
3. 终止操作，一个终止操作，执行中间操作链，并产生结果。

## 三、创建Stream

1. 可以通过Collection系列集合提供的Stream() 顺序流或 ParallelStream()并行流；
2. 通过 Arrays 中的 stream() 获取一个数组流；
3. 通过 Stream 类中静态方法 of()；
4. 创建无限流。

![创建Stream](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/67e26ce0524f47a4842e27f1ea4f5694.png)

## 四、中间操作

多个中间操作可以连接起来形成一个 流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！而在终止操作时一次性全部处理，这种方式称为“`惰性求值`”。

测试数据，其中实体类包含了各自的get、set方法，有参、无参构造函数，hashCode以及equals（后期测试需要）。

![实体类](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/ac65773e24f145fa99891160e84cfbfd.png)


![生成List](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/5d3a45a5511b412a9b7eefdbb78d0b56.png)
	
### 1、筛选与切片
	
* filter——接收 Lambda ， 从流中排除某些元素。
* limit——截断流，使其元素不超过给定数量及当数量满足条件时停止循环。
* skip(n) —— 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素不足 n 个，则返回一个空流。与 limit(n) 互补
* distinct——筛选，通过流所生成元素的 hashCode() 和 equals() 去除重复元素，因此需要实体类中有这两个方法的实现。

![筛选与切片](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/56c060e53d90496d892734de427528b0.png)

### 2、映射
	
1. map——接收 Lambda，将元素转换成其他形式或提取信息。接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。

![map](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/6b9baf94291a42b3b268c9a6f8fd44e5.png)

示例中：map会循环list中的每个元素，为每个元素调用toUpperCase()方法。

2. flatMap——接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流。
	
![flatMap](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/cd3f36eca5f34c9fb0f609efb3837f53.png)

3. 排序

* sorted()——自然排序。
* sorted(Comparator com)——定制排序。

![排序](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/9ea57b4e358f4979a4036d291b8275cc.png)

## 五、终止操作

### 1、查找与匹配

* allMatch——检查是否匹配所有元素
* anyMatch——检查是否至少匹配一个元素
* noneMatch——检查是否没有匹配的元素
* findFirst——返回第一个元素
* findAny——返回当前流中的任意元素
* count——返回流中元素的总个数
* max——返回流中最大值
* min——返回流中最小值

![查找](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/14e581c0230d45318addcf9aa465f190.png)

![匹配](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/22f76c115d5d4a61aa62879b64dfd518.png)

### 2、归约

reduce(T identity, BinaryOperator) / reduce(BinaryOperator) ——可以将流中元素反复结合起来，得到一个值。

![归约](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/ae1861006ef144829bd2bfb99f2370dc.png)

示例1中，归约会把0做为第一个x，list中的第一个元素（1）做为y，进行运算x+y，然后结果做为下一次的x，list中的第二个元素做为y，再次进行x+y运算，直至list循环完成。

### 3、收集collect

将流转换为其他形式。接收一个 Collector接口的实现（实现类为Collectors），用于给Stream中元素做汇总的方法。

Collector 接口中方法的实现决定了如何对流执行收集操作(如收集到 List、Set、Map)。

![收集collect](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/40e0f56d704947a3ae31f9fc0269409b.png)

## 六、其他常用接口方法

![其他常用接口方法](//cdn.smallyoung.cn/article/5fd9c923e4b0b655d86e8de0/4e236a051f3945ad9a8e5888cd69281b.jpg)
	

