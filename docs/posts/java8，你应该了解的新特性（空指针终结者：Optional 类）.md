---
title: java8，你应该了解的新特性（空指针终结者：Optional 类）
date: 2017-09-16
cover: //cdn.smallyoung.cn/article/cover/c6d5a398e65144ae996756eb9ea458ab.jpg!/format/webp
category: 后端开发
tags:
  - Java8
  - Optional
description: "一、概述 java.lang.NullPointerException是最常见也是最令人讨厌的一种异常，如果一个对象可能为null，在调用其方法之前必须进行非空检查，否则就会引发java.lang.N"
author: smallyoung
---

## 一、概述

`java.lang.NullPointerException`是最常见也是最令人讨厌的一种异常，如果一个对象可能为null，在调用其方法之前必须进行非空检查，否则就会引发`java.lang.NullPointerException`。但是，很多对象永远都不会为null，如果能把那些可能为null的对象明确的标识出来，只对null嫌疑者进行判断，岂不是既可避免`java.lang.NullPointerException`有可避免不必要的非空判断？

`Optional<T>` 类(java.util.Optional) 是一个容器类，它明确指示开发者哪些对象需要非空检查的。代表一个值存在或不存在，原来用 null 表示一个值不存在，现在 `Optional` 可以更好的表达这个概念。并且可以避免空指针异常。

## 二、常用方法

* Optional.of(T t) : 创建一个 Optional 实例
* Optional.empty() : 创建一个空的 Optional 实例
* Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例
* isPresent() : 判断是否包含值
* orElse(T t) : 如果调用对象包含值，返回该值，否则返回t
* orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值
* map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty()
* flatMap(Function mapper):与 map 类似，要求返回值必须是Optional

## 三、演示

测试实体类

![测试实体类](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/d65157cccb8144c9a50121af11eee44b.png)

### 1、Optional.of(T t) 

![Optional.of](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/7a1018d947554a9eb9adb43cc8372739.png)

**注意：在测试时，我们会直接new一个对象，但是在实际开发中，可能会传入某个对象，当这个对象为空时依然会报空指针异常**。如下图。

![空指针异常](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/1298b13a15964593a283833f1ff14b89.png)

### 2、Optional.empty()

Optional.empty()会给我们创建一个本身就是空的Optional 实例。Optional.ofNullable(T t)会先进行判断，当传入的对象不为空时，调用of()方法，当对象为空时，调用.empty()方法。

![Optional.empty](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/d6d5389252444d53997e12a8a590d397.png)

### 3、isPresent() : 判断是否包含值

![isPresent](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/22f7436fabee48b4acabddd3293720ae.png)

**注意：如果我们直接使用of()方法创建的Optional实例，如果传入的是null，则该判断依然会报NullPointerException**

![NullPointerException](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/f67133201d3148d09d538d79c7d13343.png)

分析

当传入null时，ofNullable会进行null判断，当时of不会进行判断。而是直接调用new Optional<>(value)方法创建实例，而Optional在创建实例时会调用Objects的requireNonNull(value)方法进行非空校验，当时null值时，会抛出NullPointerException错误。

![分析1](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/acf9ba295251475d8d15c17aec7cc508.png)
![分析2](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/b34a60e6485c4eb5b45881170ff1c66f.png)
![分析3](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/cea5dcf4b31f4f4b96fc3e596953a45b.png)

### 4、orElse(T t)与orElseGet(Supplier s)

当传入的对象不为空时：

![传入的对象不为空](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/e6ac54330b3145f99baf64e4afdedda2.png)

当传入的对象为空时：

![传入的对象为空](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/8d0962ca5c804e9fb318c21dd44b6e3f.png)

orElseGet(Supplier s)区别在于，传入的为Supplier（供给型接口），可以对对象进行相对于的操作。

### 5、map(Function f)与flatMap(Function mapper)

![map与flatMap](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/aa2ba91988d54ef0bc0d33d696927d40.png)

**区别：两个方法的返回值类型不同，以示例为例，map要求返回值类型是Emp及其子类，而flatmap则要求返回值类型必须为Optional 。**

## 四、应用

1. 假设UserDao不一定会被注入进UserService，原来必须使用@Autowired(required = false)，但是现在直接使用Optional即可。

![应用-1](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/f764e48151d14c60bc462b3fcf4a53a1.png)

2. 在Spring MVC中，下面的代码表示userName参数是可选的，即请求参数可不包含userName。

![应用-2](//cdn.smallyoung.cn/article/5fda08ebe4b0b655d86e8de2/14e2d5e278ca4642bb1029d0708df256.png)

