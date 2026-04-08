---
title: Redis常用命令总结
date: 2017-09-05
cover: //cdn.smallyoung.cn/article/cover/e1d4da4764ce4e3495931d067fca102c.jpg!/format/webp
category: 数据库
tags:
  - 数据库
  - Redis
  - 命令
description: "一、启动Redis 1、查询Redis是否启动 bash ps ef|grep redis 2、启动Redis bash redisserver redis.conf 3、连接 bash redisc"
author: smallyoung
---

## 一、启动Redis

### 1、查询Redis是否启动

``` bash
ps -ef|grep redis
```

![是否启动](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/ac4d798b0bbd482f93906d8fa509b16a.png!/format/webp)

### 2、启动Redis

``` bash
redis-server redis.conf
```

### 3、连接

```bash
redis-cli -p 6379
```

### 4、测试

发送ping，如果连接正常就返回一个 PONG ，否则返回一个连接错误。

![4、测试](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/1309254243b0436ea36eef98068b43e9.png!/format/webp)

## 二、字符串(String)操作

1. set/get/del/append/strlen:添加、获取、删除、拼接、长度；
2. Incr/decr/incrby/decrby,一定要是数字才能进行加减；
3. getrange：获取指定区间范围内的值，类似between...and；
4. setrange：设置指定区间范围内的值，格式setrange key 值；
5. setex:设置带过期时间的key，动态设置。setex 键 秒值 真实值；
6. setnx:只有在 key 不存在时设置 key 的值。setex 键 真实值；
7. mset/mget/msetnx：同时设置、获取多个值，msetnx仅当所有给定key都不存在时才生效。

## 三、列表(List)操作
	
1. lpush/rpush/lrange；添加、获取；

![lpush/rpush/lrange](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/42f175c8a324467dbd5274fe2c11ecd0.png!/format/webp)
	
2. lpop/rpop：左/右移除一个；

![lpop/rpop](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/f09f485be0c04f83a71b5bb58b77ca08.png!/format/webp)

3. lindex，按照索引下标获得元素(从上到下)；

![lindex](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/edf19c88b1e14f54b80ffbf2d96b170c.png!/format/webp)
	
4. llen：长度；
	
5. lrem key 删除N个value；
	
6. ltrim key 开始index 结束index，截取指定范围的值后再赋值给key；
	
![这里写图片描述](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/637d0b83546b4d7d88e6aa5975be0d14.png!/format/webp)
	
7. rpoplpush 源列表 目的列表，将源列表的最后一个移动到目的列表的第一个。

![rpoplpush](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/d82e0290c17f4a97a71127634cf9adc3.png!/format/webp)
	
8. lset key index value：给key中下标是index的赋值为value。
	
9. linsert key  before/after 值1 值2：在key列表中，在值1的前面/后面插入值2。
	
## 四、集合(Set)操作

1. sadd/smembers/sismember：添加（不允许重复）、查看、判断元素是否是集合中成员；
2. scard，获取集合里面的元素个数；
3. srem key value：删除集合中元素；
4. srandmember key：某个整数(随机出key个数)；
5. spop key：随机一个出栈；
6. smove key1 key2 在key1里某个值：将key1里的某个值赋给key2；
7. sdiff/sinter/sunion：差集（在第一个set里面而不在后面任何一个set里面的项）、交集、并集；

![Set](//cdn.smallyoung.cn/article/5fd9a76ce4b0b655d86e8ddc/55459165e69149c1a9604c77d426d3d6.png!/format/webp)

## 五、哈希(Hash)操作

KV键值对模式不变，但是V也是一个键值对。

1. hset/hget/hmset/hmget/hgetall/hdel；
2. hlen；
3. hexists key 在key里面的某个值的key：判断key中是否有某个值；
4. hkeys/hvals：获取key中的键/值；
5. hincrby/hincrbyfloat key 在key里面的某个值的key num：key中的某个键的值加num（整数型、浮点型）；
6. hsetnx：不存在赋值，存在了无效；

## 六、有序集合Zset(sorted set)操作

在set基础上加入了一个score值。之前set是k1 v1 v2  v3，现在zset则是k1 score1 v1 score2 v2 score3 v3。

1. zadd/zrange/zrevrange：添加、查看、反序查看。当zrange最后带入withscore时，表示所有都显示；
2. zrangebyscore key 开始score 结束score：查询score范围内的值，当范围score带“（”时，表示不等于；
3. zrem key 某score下对应的value值：删除元素；
4. zcard key/zcount key score区间：获取个数/分数区间内的个数；
5. zrank key values：获取values值得下标。
6. zscore key 对应值：获得分数；
7. zrevrank key values值：逆序获得下标值；
8. zrevrangebyscore  key 结束score 开始score：反序查询score范围内的值；

## 七、其他

1. select：命令切换数据库；
2. dbsize：查看当前数据库的key的数量；
3. flushdb：清空当前库；
4. Flushall：通杀全部库；
5. keys *：本库的所以键；
6. exists key的名字，判断某个key是否存在；
7. move key db：移动key到db库；
8. expire key 秒钟：为给定的key设置过期时间；
9. ttl key 查看还有多少秒过期，-1表示永不过期，-2表示已过期；
10. persist key：移除key的过期时间，key将持久保存；
11. type key 查看你的key是什么类型；
12. del key：删除key；
13. dump key：序列化给定的key，并返回被序列化的值；