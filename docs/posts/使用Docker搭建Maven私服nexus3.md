---
title: 使用Docker搭建Maven私服nexus3
date: 2021-09-13
cover: //cdn.smallyoung.cn/article/cover/11f4366b4e864991a094519b6c9613f1.jpg!/format/webp
category: Docker
tags:
  - Docker
  - Maven私服
  - Nexus3
description: "一、概述 Nexus 是一个强大的 Maven 仓库管理器，它极大地简化了自己内部仓库的维护和外部仓库的访问。利用 Nexus 你可以只在一个地方就能够完全控制访问 和部署在你所维护仓库中的每个 Ar"
author: smallyoung
---

## 一、概述

`Nexus` 是一个强大的 `Maven` 仓库管理器，它极大地简化了自己内部仓库的维护和外部仓库的访问。利用 `Nexus` 你可以只在一个地方就能够完全控制访问 和部署在你所维护仓库中的每个 `Artifact`。`Nexus` 是一套“`开箱即用`”的系统不需要数据库，它使用文件系统加 `Lucene` 来组织数据。`Nexus` 使用 `ExtJS` 来开发界面，利用 `Restlet` 来提供完整的 `REST APIs`，通过 `m2eclipse` 与 `Eclipse` 集成使用。`Nexus` 支持 `WebDAV` 与 `LDAP` 安全身份认证。

## 二、拉取镜像

```bash
docker pull sonatype/nexus3
```

![拉取镜像](//cdn.smallyoung.cn/article/613f038ce4b07c4e9d6594a2/a7e135792c694fb99c05f97e3843ee6f.png!/format/webp)

## 三、启动镜像

```bash
docker run -d --name=nexus3 --restart=always -p 8081:8081 -v /mnt/nexus3/data:/var/nexus-data sonatype/nexus3
```

![启动镜像](//cdn.smallyoung.cn/article/613f038ce4b07c4e9d6594a2/ebedfe3ebaa74f53a531b5b53486a018.png!/format/webp)

* -d：表示后台运行
* --name： 表示为docker容器起的别名
* --restart=always：当docker启动时，自动启动该容器，类似开机自启的功能
* -p：开放的端口（宿主机端口:容器端口）
* -v：挂载文件，将容器文件挂载到宿主机目录（宿主机目录:容器内部目录）

容器启动需要几分钟，此时我们可以使用docker命令查看容器是否启动成功

```bash
 docker logs sonatype/nexus3
 ```

![查看日志](//cdn.smallyoung.cn/article/613f038ce4b07c4e9d6594a2/e82ac51321614da09254058b1da58cb9.png!/format/webp)

## 四、登录系统

> 登录地址：http://ip:8081

在登陆时，默认账号为admin，密码为随机密码，需要进入到容器内部查看密码文件

``` bash
# 进入容器
docker exec -it sonatype/nexus3 /bin/bash
# 查看密码
cat /nexus-data/admin.password
```

![查看密码](//cdn.smallyoung.cn/article/613f038ce4b07c4e9d6594a2/357bf71dd2f24d369eb28761935fec50.png!/format/webp)

![登录系统](//cdn.smallyoung.cn/article/613f038ce4b07c4e9d6594a2/f61c87527a424cdd806ee81d4df6ed4c.png!/format/webp)

## 五、配置setting

找到`Maven`的安装目录，在`maven/conf/setting.xml`中找到`servers`标签增加`mavne`私服的账号密码。

```xml
<servers>
  <server>
    <id>test-releases</id>
    <username>admin</username>
    <password>password123</password>
  </server>
  <server>
    <id>test-snapshots</id>
    <username>admin</username>
    <password>password123</password>
  </server>
</servers>
```

## 六、配置项目pom

1. 设置需要打包的项目，这样在调用maven deploy 命令时就会自动打包上传到maven私服了

```xml
<distributionManagement>
  <repository>
    <!--id的名字可以任意取，但是在setting文件中的属性<server>的ID与这里一致-->
    <id>test-releases</id>
    <!--指向仓库类型为host(宿主仓库）的储存类型为Release的仓库-->
    <url>http://127.0.0.1:8081/repository/maven-releases/</url>
  </repository>
  <snapshotRepository>
    <!--id的名字可以任意取，但是在setting文件中的属性<server>的ID与这里一致-->
    <id>test-snapshots</id>
    <!--指向仓库类型为host(宿主仓库）的储存类型为Snapshot的仓库-->
    <url>http://127.0.0.1:8081/repository/maven-snapshots/</url>
  </snapshotRepository>
</distributionManagement>
```

2. 同时将maven的仓库地址设置为私服地址，保证项目在本地没有找到的情况下先去私服寻找

```xml
<repositories>
  <repository>
    <id>test-releases</id>
    <url>http://127.0.0.1:8081/repository/maven-public</url>
  </repository>
</repositories>
```

> 注：此处采用的是在pom文件设置的方案，另外也可以在setting文件中全局设置，如果在setting中设置的话需要注意仓库的id要与services中的id相匹配；如果配置在pom文件中，也要注意，在setting中的仓库的 `mirrorOf` 节点一定不要设置为 `*` ，否则pom文件不会生效。
