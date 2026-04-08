---
title: MySql学习之Join查询
date: 2017-08-25
cover: //cdn.smallyoung.cn/article/cover/6501b84993654cb09c44dce3569ade2e.jpg!/format/webp
category: 数据库
tags:
  - Mysql
  - Join
  - 查询
description: "一、SQL执行顺序 1、手写sql顺序 2、机读sql顺序 二、7种Join的sql编写 注：图中 full outer join在mysql中是不支持的。可通过 1、全有 sql SELECT <s"
author: smallyoung
---

## 一、SQL执行顺序
	
### 1、手写sql顺序
	
![手写sql顺序](//cdn.smallyoung.cn/article/5fd97aa9e4b0b655d86e8dd7/14491e7245144e30958a701487d93ab1.png!/format/webp)
	
### 2、机读sql顺序

![机读sql顺序](//cdn.smallyoung.cn/article/5fd97aa9e4b0b655d86e8dd7/548ab1d223664b7db05be4b6bcbc14c1.png!/format/webp)

![机读sql顺序](//cdn.smallyoung.cn/article/5fd97aa9e4b0b655d86e8dd7/44b549f3485b4a42a83e7f1b77ddcf2b.png!/format/webp)

## 二、7种Join的sql编写

![7种 SQL Joins](//cdn.smallyoung.cn/article/5fd97aa9e4b0b655d86e8dd7/00b15a020ad9471680b3ee2eb9cb0a17.jpg!/format/webp)

> 注：图中 full outer join在mysql中是不支持的。可通过

### 1、全有

``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key
UNION
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key
```

### 2、A的独有和B的独有

``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL
UNION
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key WHERE A.Key IS NULL
```



