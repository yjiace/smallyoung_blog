---
title: Shadowsocks服务端安装
date: 2021-03-08
cover: //cdn.smallyoung.cn/article/cover/5f807c3ce0bb4fda9884eeb7d1a8ba9f.jpg!/format/webp
category: 其他
tags:
  - Shadowsocks
  - 服务端
  - 安装
description: "一、安装pythonpip 系统为： ubuntu/images/hvmssd/ubuntubionic18.04amd64server20210224 bash aptget install pyt"
author: smallyoung
---

## 一、安装python-pip

> 系统为： ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20210224

```bash
apt-get install python-pip
```

> 有时我们直接安装python-pip会出现错误

![python-pip错误](//cdn.smallyoung.cn/article/6040635ae4b0bf4688e54f1c/2ffa33424f7948a38d34417e9efbc4e8.png!/format/webp)

此时需要我们先执行下 update

```bash
apt-get update
```

然后在执行安装就可以了

## 二、安装shadowsocks

安装命令

```bash
pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```

![安装shadowsocks](//cdn.smallyoung.cn/article/6040635ae4b0bf4688e54f1c/665ace4d724d417da4878fe7c23190ba.png!/format/webp)

安装后，我们可以通过ssserver --version查看版本信息

![版本信息](//cdn.smallyoung.cn/article/6040635ae4b0bf4688e54f1c/b4cb079b53434e2ab874ec850d171db5.png!/format/webp)


## 三、配置shadowsocks

启动编辑

```bash
vi /etc/shadowsocks.json
```

输入以下内容

```json
{ 
   "server":"0.0.0.0", 
   "server_port":443,
   "local_address": "127.0.0.1", 
   "local_port":1080, 
   "password":"123456789",
   "timeout":300, 
   "method":"aes-256-gcm", 
   "fast_open": true
}
```

* server，你的VPS服务器的IP地址
* server_port，你的shadowsocks服务端口。一般可以填一个1025到49151之间的数字。不过如果使用一个知名端口，比如25（电子邮件）、21（FTP），“可能”会更安全，因为GFW对这些基础互联网服务下手的可能性似乎会小一些。注意不要和你的VPS上已经有的服务冲突。
* local_address，本地IP地址，作为服务器使用的时候可以不用关注，填127.0.0.1即可。
* local_port，本地端口，也不用关注。
* password，你的shadowsocks服务密码，客户端连接时需要填写的。
* timeout，超时时间，如果当心网络不好可以设置大一点。
* method，加密方式，建议填写aes-256-cfb，安全性比较高。
* fast_open，在Ubuntu上建议填True。


## 四、启动

```bash
# 启动
ssserver -c /etc/shadowsocks.json -d start
# 停止
ssserver -c /etc/shadowsocks.json -d stop
# 重启
ssserver -c /etc/shadowsocks.json -d restart
# 查询进程
ps -ef | grep ssserver | grep -v ps | grep -v grep
```

![启动](//cdn.smallyoung.cn/article/6040635ae4b0bf4688e54f1c/38aca6e10455444489d1a0e518d7a887.png!/format/webp)

## 五、定时重启

```bash
crontab -u root -e
```

![定时重启](//cdn.smallyoung.cn/article/6040635ae4b0bf4688e54f1c/f7ab78241f4e422692d26e99b0cb3945.png!/format/webp)

然后在编辑器输入 `0 0 1 * * /etc/init.d/shadowsocks restart`

说明是第一次运行该命令，这里是让选择编译器的意思，喜欢用vim的童鞋可以选择3。

补充两点：

1. 如果选择了2，那个nano编辑器，可以按ctrl+x退出。
2. 如果不小心选择了2，那么又想改回vim怎么办呢？运行这个命令
