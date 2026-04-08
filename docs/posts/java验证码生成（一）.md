---
title: java验证码生成（一）
date: 2016-10-31
cover: //cdn.smallyoung.cn/article/cover/66f756bc220340d5aabc5799c940ed6d.jpg!/format/webp
category: 后端开发
tags:
  - Java
  - 验证码
description: "一、概述 验证码（CAPTCHA）是Completely Automated Public Turing test to tell Computers and Humans Apart（全自动区分计算"
author: smallyoung
---

## 一、概述

验证码（`CAPTCHA`）是`Completely Automated Public Turing test to tell Computers and Humans Apart`（全自动区分计算机和人类的图灵测试）的缩写，是一种区分用户是计算机还是人的公共全自动程序。可以防止：恶意破解密码、刷票、论坛灌水，有效防止某个黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试，实际上用验证码是现在很多网站通行的方式，我们利用比较简易的方式实现了这个功能。这个问题可以由计算机生成并评判，但是必须只有人类才能解答。由于计算机无法解答CAPTCHA的问题，所以回答出问题的用户就可以被认为是人类。

验证码的生成目前常用的有两种方式：
1、原生的java通过二维图像，画出一个包含验证码的图片。
2、使用Jcaptcha生产验证码图片。

本次讲解使用二维图像画出验证码图片。

## 二、index.jsp页面

``` html
<script type="text/javascript"> 
        function newCode(){
            var  today = new  Date();
            document.getElementById("imgNumber").src="ValidateServlet?tm="+today.getTime();
        }
</script>
</head>
<body>
  <form action="">  
   验证码： <input type="text" name="text" />
   <img src="ValidateServlet" id="imgNumber"/>
     <a href="javascript:newCode()">看不清,换一张</a>
  </form>
</body>
```

## 三、java后台代码

创建`servlet`命名为`ValidateServlet`，请求url为`ValidateServlet`。
	

``` java
package com.mhss.servlet;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 通过二维画图 生成验证码图片
 * @author 梦幻逝水
 *
 */
public class ValidateServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** 验证码图片的宽度 */
	private int width = 150;
	/** 验证码图片的高度 */
	private int height = 55;
	/** 验证码字符个数 */
	private int codeCount = 4;

	// 字符间距
	private int x = 0;
	// 字体高度
	private int fontHeight;
	private int codeY;

	char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
			'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
			'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.service(request, response);
	}

	public void init() {
		// 宽度
		String strWidth = this.getInitParameter("width");
		// 高度
		String strHeight = this.getInitParameter("height");
		// 字符个数
		String strCodeCount = this.getInitParameter("codeCount");
		if (strWidth != null && strWidth.length() != 0) {
			width = Integer.parseInt(strWidth);
		}
		if (strHeight != null && strHeight.length() != 0) {
			height = Integer.parseInt(strHeight);
		}
		if (strCodeCount != null && strCodeCount.length() != 0) {
			codeCount = Integer.parseInt(strCodeCount);
		}
		// 计算验证码在图片中位置
		x = width / (codeCount + 1);
		fontHeight = height - 2;
		codeY = height - 4;
	}

	/**
	 * 产生随机码图片
	 */
	public void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// 产生图片
		BufferedImage bi = new BufferedImage(width, height,
				BufferedImage.TYPE_INT_RGB);
		// 网图片中加载图片的工具
		Graphics2D g = bi.createGraphics();
		// 添加背景
		g.setColor(Color.WHITE);
		g.fillRect(0, 0, width, height);
		// 创建字体
		Font font = new Font("Fixedsys", Font.PLAIN | Font.BOLD, fontHeight);
		// 设置字体
		g.setFont(font);
		// 画边框
		g.setColor(Color.black);
		g.drawRect(0, 0, width - 1, height - 1);
		// 画干扰线
		Random random = new Random();
		g.setColor(Color.PINK);
		for (int i = 0; i < 100; i++) {
			int x = random.nextInt(width);
			int y = random.nextInt(height);
			int xl = random.nextInt(12);
			int yl = random.nextInt(12);
			g.drawLine(x, y, x + xl, y + yl);

		}
		StringBuffer sbnumber = new StringBuffer();
		// 生成随机码
		for (int i = 0; i < this.codeCount; i++) {
			String strRand = String.valueOf(codeSequence[random.nextInt(36)]);
			// 随机产生颜色分量来创建颜色
			int red = random.nextInt(255);
			int green = random.nextInt(255);
			int blue = random.nextInt(255);
			//
			g.setColor(new Color(red, green, blue));
			g.drawString(strRand, (i + 1) * x - 6, codeY);
			// 把每次生成的验证码放在缓冲区
			sbnumber.append(strRand);

		}
		// 把生成的验证码放在session中
		request.getSession().setAttribute("sbnumber", sbnumber.toString());
		// 把最终生成 图片 响应到页面去
		response.setContentType("image/jpeg");
		ServletOutputStream sos = response.getOutputStream();
		// 把图片 发送出去
		ImageIO.write(bi, "jpeg", sos);
		sos.close();
	}
}

```

所展现的效果如下：

![验证码展现](//cdn.smallyoung.cn/article/5fd818eee4b01dc74778c5c4/03c5fb28708f4e5f947cbeda6b708fb2.png)
