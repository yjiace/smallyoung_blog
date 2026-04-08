---
title: Hadoop启动停止的三种方式
date: 2016-12-06
cover: //cdn.smallyoung.cn/article/cover/cb4bc3f5609a4df28b78e6166aca29f5.jpg!/format/webp
category: 后端开发
tags:
  - Hadoop
  - 分布式
  - 集群
description: "一、分别启动HDFS和MapReduce bash 启动 startdfs.sh startmapred.sh 停止 stopmapred.sh stopdfs.sh 二、全部启动或停止 bash 启"
author: smallyoung
---

## 一、分别启动HDFS和MapReduce

```bash
#启动
start-dfs.sh
start-mapred.sh
#停止
stop-mapred.sh
stop-dfs.sh
```

## 二、全部启动或停止

```bash
#启动：
start-all.sh
#启动顺序：
NameNode->DataNode->SecondaryNameNode->JobTracker->TaskTracker
#停止：
stop-all.sh
#停止顺序：
JobTracker->TaskTracker->NameNode->DataNode->SecondaryNameNode
```

## 三、逐一启动

```bash
#启动：
hadoop-daemon.sh start namenode
hadoop-daemon.sh start datanode
hadoop-daemon.sh start secondarynamenode
hadoop-daemon.sh start jobtracker
hadoop-daemon.sh start tasktracker
#停止：
hadoop-daemon.sh stop jobtracker
hadoop-daemon.sh stop tasktracker
hadoop-daemon.sh stop namenode
hadoop-daemon.sh stop datanode
hadoop-daemon.sh stop secondarynamenode
```
	
> 注意　正常情况下，我们是不使用`start-all.sh`和`stop-all.sh`来启动和停止`Hadoop`集群的。这样出错了不好找原因。建议读者一个一个守护进程来启动，哪个启动失败就去看相应的log日志，这样就缩小了找错的范围。