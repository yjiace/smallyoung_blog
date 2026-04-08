---
title: QRCode二维码生成
date: 2016-10-29
cover: //cdn.smallyoung.cn/article/cover/079c2979af374c96b5c0184d39f4f4f3.jpg!/format/webp
category: 后端开发
tags:
  - maven
  - Java
description: "一、概述 java有很多生成二维码的方式，这里介绍一下用qrcode生成的代码。 1.先去下载QRCode要用到的jar包 2.废话不说了，直接贴源代码，此处采用原生的servlet处理页面发送过来的"
author: smallyoung
---

## 一、概述

java有很多生成二维码的方式，这里介绍一下用qrcode生成的代码。

* 1.先去下载QRCode要用到的jar包
* 2.废话不说了，直接贴源代码，此处采用原生的servlet处理页面发送过来的请求，请求地址QRCodeServlet。
	
## 二、JAVA代码

```java
public void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		
		String content = request.getParameter("content");
		int size = 7;
		BufferedImage bufImg = null;
		Qrcode qrcodeHandler = new Qrcode();
		// 设置二维码排错率，可选L(7%)、M(15%)、Q(25%)、H(30%)，排错率越高可存储的信息越少，但对二维码清晰度的要求越小
		qrcodeHandler.setQrcodeErrorCorrect('M');
		qrcodeHandler.setQrcodeEncodeMode('B');
		// 设置设置二维码尺寸，取值范围1-40，值越大尺寸越大，可存储的信息越大
		qrcodeHandler.setQrcodeVersion(size);
		// 获得内容的字节数组，设置编码格式
		byte[] contentBytes = content.getBytes("utf-8");
		// 图片尺寸
		int imgSize = 67 + 12 * (size - 1);
		bufImg = new BufferedImage(imgSize, imgSize, BufferedImage.TYPE_INT_RGB);
		Graphics2D gs = bufImg.createGraphics();
		// 设置背景颜色
		gs.setBackground(Color.WHITE);
		gs.clearRect(0, 0, imgSize, imgSize);

		// 设定图像颜色> BLACK
		gs.setColor(Color.BLACK);
		// 设置偏移量，不设置可能导致解析出错
		int pixoff = 2;
		// 输出内容> 二维码
		if (contentBytes.length > 0 && contentBytes.length < 800) {
			boolean[][] codeOut = qrcodeHandler.calQrcode(contentBytes);
			for (int i = 0; i < codeOut.length; i++) {
				for (int j = 0; j < codeOut.length; j++) {
					if (codeOut[j][i]) {
						gs.fillRect(j * 3 + pixoff, i * 3 + pixoff, 3, 3);
					}
				}
			}
		}
		// 把最终生成 图片 响应到页面去
		response.setContentType("image/jpeg");
		ServletOutputStream sos = response.getOutputStream();
		// 把图片 发送出去
		ImageIO.write(bufImg, "jpeg", sos);
		gs.dispose();
		bufImg.flush();
		sos.close();
	}
```

## 三、页面请求（纯文本内容）

```html
<div>
	<img src="QRCodeServlet?content=123" />
</div>
```

## 四、页面请求（超链接内容）

```html
<div>
	<img src="QRCodeServlet?content=http://www.toutiao.com/" />
</div>
```

![二维码展现](//cdn.smallyoung.cn/article/5fd815bbe4b01dc74778c5c3/f1969bbc60ee45b980a18e57d6b454f4.png)