---
title: 10分钟教你搭建自己的Ngrok服务器
date: 2018-02-23
cover: //cdn.smallyoung.cn/article/cover/0803950bf1dd4d28a66050d0a4b8701f.jpg!/format/webp
category: 其他
tags:
  - ngrok
description: "内网穿透想必开发过微信的同志都很了解，大部分人选择网上寻找各种现成的，比如ngrok官网、ittunngrok、sunnyngrok或者花生壳之类的。但是世界上没有免费的午餐，要不就是收费，要不就是免"
author: smallyoung
---

内网穿透想必开发过微信的同志都很了解，大部分人选择网上寻找各种现成的，比如[ngrok官网](https://ngrok.com/)、[ittun-ngrok](https://www.ittun.com/)、[sunny-ngrok](https://www.ngrok.cc/)或者[花生壳](https://hsk.oray.com/)之类的。但是世界上没有免费的午餐，要不就是收费，要不就是免费但是偶尔会出现连接失败的问题（当然大多数时间是没有问题的）。

偶然，正在测试微信的某些功能，但是正在使用的ittun-ngrok连接失败了。导致测试无法进行，最终萌生出自己搭建一个ngrok服务器的想法。

## 一、必要条件

（1）服务器，用来搭建ngrok的服务器，必须有公网ip，并且可以正常访问（本次测试使用的是Ubuntu 16.04 64位）。
（2）域名，用来生成访问域名。

## 二、安装git 和Golang
 
```bash
apt-get install build-essential golang mercurial git
```

Golang，Go语言支持，因为Ngrok是基于Go语言编写的

## 三、下载源码

当然也可以不安装git，但是需要手动上传代码到需要的位置。

此处使用非官方地址，修复了部分包无法获取（摘自网络）

``` bash
git clone https://github.com/tutumcloud/ngrok.git ngrok
```

![git 下载](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/792151a9f2534347ab00eb14ea2f2ae7.png!/format/webp)

下载下来的目录结构
![目录结构](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/ca2cb2cd68414561b10ef957ddfdff40.png!/format/webp)

## 四、生成自签名证书

使用ngrok.com官方服务时，我们使用的是官方的SSL证书。自建ngrokd服务，如果不想买SSL证书，我们需要生成自己的自签名证书，并编译一个携带该证书的ngrok客户端。

证书生成过程需要一个NGROK_BASE_DOMAIN。 以ngrok官方随机生成的地址xxx.ngrok.com为例，其NGROK_BASE_DOMAIN就是“ngrok.com”，如果你要提供服务的地址为“example.ngrok.xxx.com”，那NGROK_BASE_DOMAIN就应该 是“ngrok.xxx.com”。本次测试，由于没有多余的域名，我替换成自己的二级域名“weixin.yangjiace.xyz”。

``` bash
cd ngrok

NGROK_DOMAIN="weixin.yangjiace.xyz"

openssl genrsa -out base.key 2048

openssl req -new -x509 -nodes -key base.key -days 10000 -subj "/CN=$NGROK_DOMAIN" -out base.pem

openssl genrsa -out server.key 2048

openssl req -new -key server.key -subj "/CN=$NGROK_DOMAIN" -out server.csr

openssl x509 -req -in server.csr -CA base.pem -CAkey base.key -CAcreateserial -days 10000 -out server.crt
```

![生成证书](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/d2389e0a23c34a89b46c17a38f257823.png!/format/webp)
执行完成后需要替换证书

``` bash
cp base.pem assets/client/tls/ngrokroot.crt
```

## 五、编译

``` bash
make release-server release-client
```

![编译](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/e5fc5353b62444e7a4abfd3b0901284b.png!/format/webp)

编译成功后会在bin目录下找到ngrokd和ngrok这两个文件。其中ngrokd 就是服务端程序了。
![编译后服务端的执行程序](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/fb6e1e0f7a83493dac89fb71708d5997.png!/format/webp)

## 六、启动服务端

``` bash
./bin/ngrokd -tlsKey=server.key -tlsCrt=server.crt -domain="weixin.yangjiace.xyz" -httpAddr=":80" -httpsAddr=":443"
```

httpAddr、httpsAddr 分别是 ngrok 用来转发 http、https 服务的端口，可以随意指定。ngrokd 还会开一个 4443 端口用来跟客户端通讯（可通过 -tunnelAddr=":xxx" 指定）。由于微信限制不能出现端口号，因此这个使用了80、443端口。

## 七、编译客户端

（1）windows

``` bash
GOOS=windows GOARCH=amd64 make release-client  
```

（2）mac

``` bash
GOOS=darwin GOARCH=amd64 make release-client
```

执行对应的命令会在bin目录下生成相对应的windows、mac目录，ngrok.exe就存放在对应目录下。将对应的ngrok.exe下载到本地。

## 八、设置本地客户端

（1）在同级目录下新建一个配置文件ngrok.cfg

```bash
server_addr: "weixin.yangjiace.xyz:4443"  
trust_host_root_certs: false  
```

（2）同级目录下新建一个启动脚本startup.bat

``` bash
@echo on
cd %cd%
#ngrok -proto=tcp 22
#ngrok start web
ngrok -config=ngrok.cfg -log=ngrok.log -subdomain=yjc 8080
```

其中，-config指向配置文件，-log存放日志文件位置，-subdomain为自定义的域名前缀。8080为端口号。

（3）启动，点击启动脚本startup.bat完成启动。
![启动](//cdn.smallyoung.cn/article/5fda948be4b0b655d86e8de7/34938e35e6f240829d005949e2fea6f8.png!/format/webp)

## 九、设置为系统程序，并后台运行。

服务器在运行ngrok时，如果关闭会话窗口，会导致服务中断，很显然这不是我们想要的结果，我们需要服务不断的在后台运行，当需要的时候在停止。

在/etc/systemd/system/目录下创建服务ngrok.service，内容为

``` bash
[Unit]
Description=ngrok
After=network.target

[Service]
ExecStart=/myweb/ngrok/bin/ngrokd -tlsKey=/myweb/ngrok/server.key -tlsCrt=/myweb/ngrok/server.crt -domain="weixin.yangjiace.xyz" -httpAddr=":80" -httpsAddr=":443"

[Install]
WantedBy=multi-user.target
```

其中要根据自己的实际目录修改相对应的目录。

这样我们就可以了通过systemctl start ngrok.service启动服务。然后就可以愉快的玩耍了。
