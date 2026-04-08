---
title: MySql学习之性能分析Explain使用
date: 2017-08-26
cover: //cdn.smallyoung.cn/article/cover/adba553f281a43c4ad80cf2b8861a4cf.jpg!/format/webp
category: 数据库
tags:
  - Mysql
  - Explain
  - 性能分析
description: "一、MySql Query Optimizer 查询优化器 MySql中有专门负责优化SELECT语句的优化器模块，主要功能：通过计算分析系统中收集到的统计信息，为客户端请求的Query提供他认为最优"
author: smallyoung
---

## 一、MySql Query Optimizer 查询优化器
	
`MySql`中有专门负责优化`SELECT`语句的优化器模块，主要功能：通过计算分析系统中收集到的统计信息，为客户端请求的Query提供他认为最优的执行计划（他认为最优的数据检索方式，但是不见得是DBA认为是最优的，这部分最消耗时间）。

当客户端向MySql请求一条Query，命令解析器模块完成请求分类，区别出是SELECT并转发给`MySql Query Optimizer`时，`MySql Query Optimizer`首先对整条Query进行优化，处理掉一些常量表达式的预算，直接换算成常量值。并对Query中的查询条件进行简化和转换，如去掉一些无用或显而易见的条件、结构调整等。然后分析Query中的Hint信息（如果有），看显示Hint信息是否可以完全确认该Query的执行计划。如果没有Hint或Hint信息还不足以完全确定执行计划，则会读取所涉及对象的统计信息，根据Query进行写相对应的计算分析，然后再得出最后的执行计划。

## 二、MySql常见瓶颈

1. CPU:CPU在饱和的时候一般发生在数据装入内存或从磁盘上读取数据的时候。
2. IO:磁盘I/O瓶颈发生在装入数据远大于内存容量的时候。
3. 服务器硬件的性能瓶颈：top、free、iostat和vmstat来查看系统的性能状态。

## 三、Explain简介

使用`EXPLAIN`关键字可以模拟优化器执行SQL查询语句，从而知道MySql是如何处理你的SQL语句的。分析查询语句或是表结构的性能瓶颈。

## 四、Explain使用

Explain + sql

## 五、包含的信息

![包含的信息](//cdn.smallyoung.cn/article/5fd99a9fe4b0b655d86e8dd9/3a77a057d9f44642a8e7892cf45ae770.png!/format/webp)

## 六、id（顺序号）、table（表名）

1. select查询的序列号，包含一组数字，表示查询中执行select子句或表的顺序。
	
2. 三种情况 
	
(1)id相同，执行顺序由上至下。

![id相同，执行顺序由上至下](//cdn.smallyoung.cn/article/5fd99a9fe4b0b655d86e8dd9/45f32a7dac774de6a1d595bce1739b34.png!/format/webp)

	id相同，执行顺序t1、t2、t3。

(2)id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行。

![id不同](//cdn.smallyoung.cn/article/5fd99a9fe4b0b655d86e8dd9/e90cd96db15f40018c66db135b94e63a.png!/format/webp)
	
	id不同，id值越大越先被执行，执行顺序t3、t1、t2。

(3)id相同、不同，同时存在。

![d相同、不同，同时存在](//cdn.smallyoung.cn/article/5fd99a9fe4b0b655d86e8dd9/4e22e766124c4b238037e49bb7638089.png!/format/webp)

	id相同、不同，执行顺序t3、derived2、t2。

## 七、select_type查询类型

1. SIMPLE：简单的SELECT查询，查询中不包含子查询或者UNION。
2. PRIMARY：查询中若包含任何复杂的子部分，最外层查询则被标记为PRIMARY。
3. SUBQUERY：在SELECT或WHERE列表中包含了子查询。
4. DERIVER：在FROM列表中包含的子查询被标记为DERIVER（衍生），MySql会递归执行这些子查询，把结果放在临时表里。
5. UNION：若第二个SELECT出现在UNION之后，则被标记为UNION，若UNION包含在FROM子句的子查询中，外层SELECT将被标记为DERIVER。
6. UNION RESULT：从UNION表获取结果的SELECT（两个UNION查询合并的结果）。

## 八、type

显示的是访问类型，是较为重要的一个指标。
	
1. system：表只有一行记录（等于系统表），这个const类型的特列，平时不会出现，可以忽略不计。
2. const：表示通过索引一次就找到了，const用于比较primary key或者unique索引。因为只匹配一行数据，所以很快将主键置于where列表中，MySql就能将该查询转换为一个常量。
3. eq_ref：唯一性索引扫描，对于每个索引，表中只有一条记录与之匹配。常见于主键或唯一索引扫描。
4. ref：非唯一性索引扫描，返回匹配某个单独值的所有行。本质也是一种索引访问，它返回所有匹配某个单独值的行。然而，它可能会找到多个符合条件的行，所以他应该属于查找和扫描的混合体。
5. fulltext：全文索引检索，要注意，全文索引的优先级很高，若全文索引和普通索引同时存在时，mysql不管代价，优先选择使用全文索引。
6. ref_or_null：与ref方法类似，只是增加了null值的比较。实际用的不多。
7. index_merge：表示查询使用了两个以上的索引，最后取交集或者并集，常见and ，or的条件使用了不同的索引，官方排序这个在ref_or_null之后，但是实际上由于要读取所个索引，性能可能大部分时间都不如range
8. unique_subquery：用于where中的in形式子查询，子查询返回不重复值唯一值
9. index_subquery：用于in形式子查询使用到了辅助索引或者in常数列表，子查询可能返回重复值，可以使用索引将子查询去重。
10. range：只检索给定范围的行，使用一个索引来选择行。key列显示使用了那个索引。一般就是在你的where语句中出现了between、<、>、in等查询。这种范围扫描索引比全表扫描要好，因为只需要开始于索引的某一点，而结束于另一点，不用扫描全部索引。
11. index：Full Index Scan，index与ALL区别为index类型只遍历索引数。这通常比ALL快，因为索引文件通常比数据文件小（也就是说虽然all和index都是读全表，但是index是从索引中读取，而all是从硬盘中读取）。
12. all：Full Table Scan，将遍历全表以找到匹配的行。


结果值从最好到最坏依次是：system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL

简化后（常用）为：system > const > eq_ref > ref > range > index > ALL
	
**一般来说，得保证查询至少达到range级别，最好能达到ref。**

## 九、possible_key、key和key_len

1. possible_keys：查询可能使用到的索引都会在这里列出来，但不一定被查询实际使用。
	
2. key：查询真正使用到的索引，如果为空，则没有使用索引。查询中若出现覆盖索引，则该索引会出现在key列表中。select_type为index_merge时，这里可能出现两个以上的索引，其他的select_type这里只会出现一个。

3. key_len：表示索引中使用的字节数，可通过该列计算查询中使用的索引长度。在不损失精确性的情况下，长度越短越好。key_len显示的值为索引字段的最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索所得。

## 十、ref和rows

1. ref：如果是使用的常数等值查询，这里会显示const，如果是连接查询，被驱动表的执行计划这里会显示驱动表的关联字段，如果是条件使用了表达式或者函数，或者条件列发生了内部隐式转换，这里可能显示为func。

2. rows：根据表统计信息及索引选用情况，大致估算出找到所需的记录所需要读取的行数，不是精确值。数值越小越好。

## 十一、Extra

包含不适合在其他列中显示但十分重要的额外信息。

1. Using filesort：说明MySql会对数据使用一个外部的索引排序，而不是按照表内的索引排序进行读取。MySql中无法利用索引完成的排序操作称为“文件排序”。
2. Using temporary：使用了临时表保存中间结果，MySql在对查询结果排序时使用临时表。常见于排序order by和分组查询group by。
3. USING index：表示相应的select操作中使用了覆盖索引，避免访问了表的数据行。如果同时出现Using where，表明索引被用来执行索引键值的查找；如果没有同时出现Using where，表明索引用来读取数据而非执行查找动作。
4. Using where：表明使用了where过滤。
5. Using join buffer：表明使用了连接缓存。
6. impossible where：where子句的值总是false，不能用来获取任何元组。
7. select tables optimized away：在没有GROUB BY子句的情况下，基于索引优化MIN/MAX操作或者对于MyISAM储存引擎优化COUNT(*)操作，不必等到执行阶段在进行计算，查询执行计划生成的阶段即完成优化。
8. distinct：优化distinct操作，在找到第一匹配元组后即停止查找同样值的动作。