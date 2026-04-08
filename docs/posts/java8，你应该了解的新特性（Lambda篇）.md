---
title: java8，你应该了解的新特性（Lambda篇）
date: 2017-09-13
cover: //cdn.smallyoung.cn/article/cover/0ec539f4e3864808b63215209b3310ad.jpg!/format/webp
category: 后端开发
tags:
  - Java8
  - Lambda
description: "一、新特性简介 1. 速度更快 2. 代码更少（增加了新的语法Lambda表达式） 3. 强大的Stream API 4. 便于并行 5. 最大化减少了空指针异常Optional 其中最为核心的为 L"
author: smallyoung
---

## 一、新特性简介

1. 速度更快
2. 代码更少（增加了新的语法`Lambda`表达式）
3. 强大的`Stream API`
4. 便于并行
5. 最大化减少了空指针异常`Optional`

**其中最为核心的为 Lambda 表达式与Stream API**

## 二、Lambda

`Lambda`是一个 匿名函数，我们可以把 `Lambda` 表达式理解为是 一段可以传递的代码（将代码像数据一样进行传递）。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使`Java`的语言表达能力得到了提升。

`Lambda` 表达式的基础语法：Java8中引入了一个新的操作符 "`->`" 该操作符称为`箭头操作符`或 `Lambda 操作符`，箭头操作符将 Lambda 表达式拆分成两部分： 

* 左侧：Lambda 表达式的参数列表
* 右侧：Lambda 表达式中所需执行的功能， 即 Lambda 体

**Lambda 表达式的参数列表的数据类型可以省略不写，因为`JVM编译器`通过上下文推断出，数据类型，即“`类型推断`”**

### 1、实例一：无参数，无返回值

![无参数，无返回值](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/17052ebf2f4249ec935a7d6d72c33910.png)

### 2、实例二：有一个参数，无返回值

小括号可以省略不写。

![一个参数无返回值](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/3b59b8d97a5d486d993f57ba752cbe94.png)

### 3、有两个以上的参数，有返回值

如果 Lambda 体中有多条语句时，需要使用大括号。

![两个以上参数有返回值](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/00e2b8676c5a4467b9f7083a33bcd081.png)

如果 Lambda 体中只有一条语句， return 和 大括号都可以省略不写

![省略return和大括号](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/24a89228049149a288eaf34826dd94a0.png)

## 三、Lambda 表达式的“函数式接口”

接口中只有一个抽象方法、并用`@FunctionalInterface` 注解修饰的接口，称之为`函数式接口`

### 1、创建接口MyFun.java

![MyFun](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/7888e789cbc9420180f290142840ac71.png)

### 2、接口调用的方法

![接口调用](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/efc110c6735a4389931c6cac2d466b62.png)

### 3、使用Lambda函数式接口

![接口使用](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/0b7311959a5e480d934430bd17756b0d.png)

## 四、常用内置的四大核心函数式接口

### 1、消费型接口

``` java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

![消费型接口](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/836af290d37b42df8c91b758e62014a3.png)
	
### 2、供给型接口

``` java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```
			
![2、供给型接口](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/efd86ff2a9ca46f2a2597910a8484246.png)

### 3、函数型接口

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

![函数型接口](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/9fcf709f46dc4e62baef3ca8209882d1.png)

### 4、断言型接口

```java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}
```

![4、断言型接口](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/5f82f36f53f14bea9b819e723ec0ecfc.png)

## 五、方法引用

若 `Lambda` 体中的功能，已经有方法提供了实现，可以使用方法引用（可以将方法引用理解为 `Lambda` 表达式的另外一种表现形式）

### 1、对象 `::` 实例方法名

![实例方法名](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/5c9451ff93ee4e748374c46a47bda88b.png)

### 2、类名 :: 静态方法名

![静态方法名](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/f136b592d885413a91d6d1fad77f1118.png)
	
### 3、类名 :: 实例方法名

![这里写图片描述](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/7aca2bcb4ca944569d219b67d15c8da4.png)

> 注意：
> 1. 方法引用所引用的方法的参数列表与返回值类型，需要与函数式接口中抽象方法的参数列表和返回值类型保持一致！
> 2. 若Lambda 的参数列表的第一个参数，是实例方法的调用者，第二个参数(或无参)是实例方法的参数时，格式： ClassName::MethodName

## 六、构造器引用

构造器的参数列表，需要与函数式接口中参数列表保持一致！格式：`类名::new`。可以简单的理解为创建对象。

![构造器引用](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/a708f103e5f74cd9b5bd91340b959579.png)

## 七、数组引用

类型[] :: new。

![数组引用](//cdn.smallyoung.cn/article/5fd9b7ffe4b0b655d86e8ddf/ad17d555c6134deeb05a6c7326f611f1.png)

