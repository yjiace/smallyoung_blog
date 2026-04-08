---
title: java8，你应该了解的新特性（并行流优化篇）
date: 2017-09-15
cover: //cdn.smallyoung.cn/article/cover/86b913eaa6094c62bc807bf42ebdc11e.jpg!/format/webp
category: 后端开发
tags:
  - Java8
  - 并行流
  - Stream
description: "一、概述 并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。 Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。Stream API 可以声明性地通过 pa"
author: smallyoung
---

## 一、概述

`并行流`就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。

`Java 8` 中将并行进行了优化，我们可以很容易的对数据进行并行操作。`Stream API` 可以声明性地通过 `parallel()` 与`sequential()` 在并行流与顺序流之间进行切换。

## 二、Fork/Join 框架

在必要的情况下，将一个大任务，进行拆分(`fork`)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 `join` 汇总。

![Fork/Join](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/880a8bff6a4d47ce8a0cfbe5a5cf4b24.png)

## 三、Fork/Join 框架与传统线程池的区别

采用 “工作窃取”模式（`work-stealing`）：当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。

相对于一般的线程池实现,`fork/join`框架的优势体现在对其中包含的任务的处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能 。

## 四、演示，不严谨测试

要求：求0-90000000000相加之和。

### 1、普通的for循环

![1、普通的for循环](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/3bc233f26266420390e3f8bcf5f9f241.png)

### 2、Fork/Join 框架

首先我们需要创建`RecursiveTask`的继承`ForkJoinCalculate`类。

![RecursiveTask](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/da65834cdb2a4f2090f60358e99edab6.png)

![执行](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/94c4afc1ef3c48129bb7e3ada67bd4fb.png)


### 3、java8并行流

![java8并行流](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/b931e7fb40ab4237a860edc316d24a25.png)

## 五、最终结果比较

![结果比较](//cdn.smallyoung.cn/article/5fd9cfcbe4b0b655d86e8de1/2f877b2bd80646daac621389447d5b44.png)

