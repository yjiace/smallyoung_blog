---
title: 访问Mysql出错Connection closed by foreign host
date: 2022-03-02
cover: //cdn.smallyoung.cn/article/cover/e57cc4daba2a4297a6e785ae0423890b.jpg!/format/webp
category: 数据库
tags:
  - Mysql
  - 连接错误
description: "Centos8中的Docker+spring boot服务无法访问局域网内的mysql服务。 通过telnet测试端口情况，发下如下错误 YB|m0A9mysqlnativepassword pack"
author: smallyoung
---

`Centos8`中的`Docker+spring boot`服务无法访问局域网内的mysql服务。

通过telnet测试端口情况，发下如下错误

`YB|m0A9mysql_native_password packets out of orderConnection closed by foreign host`

执行命令：

```bash
getsebool -a|grep httpd
```

发现 `httpd_can_network_connect off`

解决：

```bash
setsebool httpd_can_network_connect 1
setsebool httpd_can_network_connect_cobbler 1
setsebool httpd_can_network_connect_db 1
setsebool httpd_can_network_relay 1
```

需要重新系统

``` bash
reboot
```



