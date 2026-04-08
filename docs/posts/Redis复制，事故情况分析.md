---
title: Redis复制，事故情况分析
date: 2017-09-07
cover: //cdn.smallyoung.cn/article/cover/f08eb71723ac4fc19f4ad7da9e158192.jpg!/format/webp
category: 数据库
tags:
  - 数据库
  - Redis
  - 事故
  - 分析
description: "一、概念 主机数据更新后根据配置和策略，自动同步到备机的master/slaver机制，Master以写为主，Slave以读为主。 二、能做什么 1. 读写分离 2. 容灾恢复 三、复制原理 1. s"
author: smallyoung
---

## 一、概念

主机数据更新后根据配置和策略，自动同步到备机的master/slaver机制，Master以写为主，Slave以读为主。

## 二、能做什么

1. 读写分离
2. 容灾恢复

## 三、复制原理

1. `slave`启动成功连接到`Master`后会发送一个`sync`命令；
2. `Master`接到命令启动后台的存盘进程，同时收集所有接收到的用于修改数据集命令，在后台进程执行完毕之后，`Master`将传送整个数据文件到`slave`,以完成一次完全同步；
3. 全量复制：而`slave`服务在接收到数据库文件数据后，将其存盘并加载到内存中；
4. 增量复制：`Master`继续将新的所有收集到的修改命令依次传给slave,完成同步；
5. 但是只要是重新连接`Master`,一次完全同步（`全量复制`）将被自动执行；

## 四、配置

> 配从不配主（主库不用配置，在从库进行配置）。

每次`master`断开后，都需要重新连接，除非配置进`redis.conf`文件中。

从库配置命令：`slaveof 主库IP 主库端口`。

## 五、事故情况分析

启动不同端口的`redis`，端口号分别为`6379`、`6380`、`6381`（以下简称79、80、81），演示以79为主库，80、81为从库。

1. 查看信息命令

``` bash
info replication。
```

![查看信息](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/7878d1224a0b4aceae7be928492d916c.png!/format/webp)

2. 正常情况下，79端口插入数据，其他从库都可以取得数据。

![正常情况](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/1fc1291986124402bdf9a4f0638026ef.png!/format/webp)

3. 主库可以添加、查看。从库只能查看不能添加。
	
![添加主库正常从库异常](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/e61b5f5cf1fc48a3ac544a1517d5a05d.png!/format/webp)

	（4）主库突然出现事故。

![主库异常](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/3436f14ee35f4923a9ff49c157fdddd4.png!/format/webp)

当主库出现事故后，从库原地待命，只能查询数据。

![从库原地待命](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/271e7dd83ab64397959408a5d72dba51.png!/format/webp)

当主库重新运行时，主从复制恢复正常。

5. 主库正常，从库出现事故。

当从库重新启动后，如果主从复制没有配置到文件，那么这个从库将成为一台新的独立的redis服务。
	
![从库状态](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/5fda8c960aee4f569a520ffb53847f01.png!/format/webp)

6. 上一个Slave可以是下一个slave的Master，Slave同样可以接收其他slaves的连接和同步请求，那么该slave作为了链条中下一个的master,可以有效减轻master写的压力。

> 中途变更转向:会清除之前的数据，重新建立拷贝最新的数据。

7. 主库（79）出现事故，人为手动将某一从库（80）设置为主库。如果当主库（79）恢复之后，不在与之前的系统有关联。

```bash
#使当前数据库停止与其他数据库的同步，转成主数据库
SLAVEOF no one
```

![事故状态](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/b1f97d1bf1be490b951666ab94d585cb.png!/format/webp)

![事故后状态](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/f616f82c4aa14332ba9a6595598b61b4.png!/format/webp)

## 六、哨兵模式

反客为主的自动版，能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库。

### 1、配置
	
1. 创建配置文件`sentinel.conf`；
2. 内容： `sentinel monitor name IP port num`，name为被监控数据库名字(自己起名字)，IP为要监控的IP地址，port端口号，num为slave投票超过此数字的为主库，一般设为1。
3. 启动哨兵：`redis-sentinel sentinel.conf`。

### 2、主库出现事故

当主库出现事故后，哨兵会检测主库故障，自动进行从库投票，当票数超过设置值是，则会将该库设置为主库。

![出现事故](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/8c90c1f65c9a46c1949759f989e803f1.png!/format/webp)

![投票](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/7e7e595530f847df9685c924fe5296fe.png!/format/webp)
	
### 3、主库恢复

当主库恢复时，会自动设置为从库。但是这个过程有一定的延迟。

![主库恢复](//cdn.smallyoung.cn/article/5fd9afc5e4b0b655d86e8ddd/ae5cd61727814742854a48e5f7d7d09b.png!/format/webp)

**一组sentinel可以同时监控多个Master**

## 七、复制的缺点

由于所有的写操作都是先在`Master`上操作，然后同步更新到`Slave`上，所以从`Master`同步到`Slave`机器有一定的延迟，当系统很繁忙时，延迟的问题就会更加严重，`Slave`机器数量的增加也会使这个问题更加的严重。