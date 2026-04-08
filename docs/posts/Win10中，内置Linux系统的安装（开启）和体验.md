---
title: Win10中，内置Linux系统的安装（开启）和体验
date: 2016-12-14
cover: //cdn.smallyoung.cn/article/cover/a84c9c786d0d44da8aea9eb53f47769a.jpg!/format/webp
category: 其他
tags:
  - Win
  - Linux
description: "windows系统和linux系统一直是水火不容，而在最新的win10系统却完美兼容了linux系统，但是在默认情况下是关闭的，需要我们手动来启动。 一、更新 更新至最新的win10版本。 二、 开启"
author: smallyoung
---

windows系统和linux系统一直是水火不容，而在最新的win10系统却完美兼容了linux系统，但是在默认情况下是关闭的，需要我们手动来启动。

## 一、更新

更新至最新的win10版本。

## 二、 开启开发者模式

设置— 更新与安全— 针对开发人员— 勾选开发人员模式

![开发人员模式](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/6676f91b9035434f9e3e2b625061efb8.jpg)

## 三、 开启windows功能

打开控制面板 ->卸载程序->启用或关闭windows功能->适用于Linux的windows子系统。选中后点确定

![开启功能](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/848d244194f14afc8d7d577209fef3f3.jpg)

![开启功能](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/fe3dd82b63e44c4d9fbd79ac34d0e63d.jpg)

点击立即重新启动

## 四、安装

等待电脑重新启动后，Ctrl+R，调出控制台，在控制台输入“`bash`”。

![bash](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/a5193326bff043739dd3bbba3f8abdfa.jpg)

输入Y 然后enter

![输入Y](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/1da44c08d8be411597cc88619ecaf263.jpg)

## 五、进入系统

下载完成后按提示创建 UNIX 默认用户名并输入密码（输入密码是不显示*的，输入完成直接回车即可）

![用户名](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/1fec56863c1442e1b099b1a216fd5bec.jpg)

![密码](//cdn.smallyoung.cn/article/5fd88021e4b035be6c7c8daf/1b7d9341687841cd8ef578fdcda3ace9.jpg)

## 六、操作

这样我们就可以对Ubuntu进行操作了。

另：在开始菜单中，会自动创建进入Ubuntu的快捷方式，但是小编的快捷方式创建时是错误的，需要手动更改。
进入`C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs`文件目录（也可以右击某个安装程序-》更多-》打开文件夹所在位置）将“Windows 中的Bash on Ubuntu。lnk”修改成“Windows 中的 Bash on Ubuntu.lnk”。
