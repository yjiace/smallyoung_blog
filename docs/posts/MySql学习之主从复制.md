---
title: MySql学习之主从复制
date: 2017-09-04
cover: //cdn.smallyoung.cn/article/cover/b7ef5293ab3846a4ba9df4cb6cabb6b3.jpg!/format/webp
category: 数据库
tags:
  - Mysql
  - 主从复制
description: "一、基本原理 1. master将改变记录到二进制日志（binary log）中。这些记录过程叫做二进制日志事件（binary log events）。 2. slave将master的binary "
author: smallyoung
---

## 一、基本原理

![MySql主从复制基本原理](//cdn.smallyoung.cn/article/5fd9a46ee4b0b655d86e8ddb/91b75de0a40d436586797a16308532f0.png)

1. master将改变记录到二进制日志（binary log）中。这些记录过程叫做二进制日志事件（binary log events）。
2. slave将master的binary log events拷贝到它的中继日志（relay log）中。
3. slave重做中继日志中的事件，将改变应用到自己的数据库中。

**MySql复制是异步的且串行化的。**

## 二、基本原则

* 每个slave只有一个master；
* 每个slave只能有一个唯一的服务器ID；
* 每个master可以有多个slave；

## 三、最大问题

	网络的延迟

## 四、配置

主从都配置在[mysqld]节点下，一般小写。

### 1、主机配置
	
* [必须]server-id=1，主服务器唯一ID；
* [必须]log_bin=路径，启用二进制日志。
* [可选]log_err=路径，启用错误日志。
* [可选]basedir=路径，根目录。
* [可选]tmpdir=路径,临时目录。
* [可选]datadir=路径,数据目录。
* [可选]read-only=0,主机读写都可以。
* [可选]binlog-ignore-db=mysql,设置不要复制的数据库。
* [可选]binlog-do-db=数据库名字,设置需要复制的数据库。
	
### 2、从机配置

* [必须]server-id=2，主服务器唯一ID；
	
### 3、重启服务。

## 五、主机创建账号

```sql
GRANT REPLICATION SLAVE ON *.* TO 'username'@'从机IP地址' IDENTIFIED BY 'password';
```

## 六、从机连接主机

``` sql
CHANGE MASTER TO MASTER_HOST='主机ID',
MASTER_USER='username',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='master-bin.000001',//Master服务器产生的日志
MASTER_LOG_POS=0;
```

## 七、启动Slave

``` sql
start slave;
```

## 八、验证

``` sql
show slave status/G
```

![验证](//cdn.smallyoung.cn/article/5fd9a46ee4b0b655d86e8ddb/1ac7b08505824a5b93b93551352ee1cd.png)

只有当`Slave_IO_Running:Yes`、`Slave_SQL_Running:Yes`时，代表主从复制的配置已经连通。

## 九、停止主从复制

```bash
stop slave;
```
![这里写图片描述](https://img-blog.csdn.net/20170904174342020?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQveWpjXzExMTE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

如果出现`1198：run STOP SLAVE first`，表明已经开启主从复制。

## 十、查询master状态

``` sql
show master status;
```
![查询master状态](//cdn.smallyoung.cn/article/5fd9a46ee4b0b655d86e8ddb/a6b5f5c0fd424f92b9e22f582831d1d3.png)

* File:二进制文件，从机连接主机中MASTER_LOG_FILE参数；
* Position:从哪个位置开始抄数据，从机连接主机中MASTER_LOG_POS参数；
* Binlog_Do_DB:需要复制的数据库;
* Binlog_Ignore_Db:不要复制的数据库;