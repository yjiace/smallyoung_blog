---
title: java验证码生成（二）
date: 2016-11-01
cover: //cdn.smallyoung.cn/article/cover/0319cf5c449c48b7876019909dec95a6.jpg!/format/webp
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

1. 原生的Java通过二维图像，画出一个包含验证码的图片。
2. 使用Jcaptcha生产验证码图片。

本次讲解使用`Jcaptcha`生产验证码图片。由于是第三方的框架，因此在开发前需要导入开发所需要的jar包。

![开发所需jar包](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/a335373767db4dfba94bd52b4e9e495c.png)

## 二、简单应用

### 1、创建servlet

创建`servlet`命名为`ValidateServlet`，请求url为`ValidateServlet`

``` java
package com.mhss.servlet;

import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mhss.service.SampleImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/**
 * 验证码生成
 * @author smallyoung
 *
 */
public class ValidateServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public static ImageCaptchaService service = SampleImageCaptchaService.getInstance();
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.DefaultManageableImage(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}
	
	/**
	 * 采用了一个 JCaptcha 的默认实现类 DefaultManageableImageCaptchaService，
	 * 在代码中，我们需要通过获取 service 对象，根据 Session ID 来生成验证码图片。
	 */
	public void DefaultManageableImage(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setHeader("Cache-Control", "no-store");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setContentType("image/jpeg");
		BufferedImage bufferedImage = service.getImageChallengeForID(request
				.getSession(true).getId());

		ServletOutputStream servletOutputStream = response.getOutputStream();
		ImageIO.write(bufferedImage, "jpg", servletOutputStream);
		try {
			servletOutputStream.flush();
		} finally {
			servletOutputStream.close();
		}
	}
}
```

### 2、创建SampleImageCaptchaService类
	

``` java
package com.mhss.service;

import com.octo.captcha.service.image.DefaultManageableImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/**
 * 
 * 
 * @author smallyoung
 *
 */
public class SampleImageCaptchaService  {

	private static ImageCaptchaService instance;

	public static ImageCaptchaService getInstance() {
		if (instance == null) {
			instance = new DefaultManageableImageCaptchaService();
		}
		return instance;
	}

}
```

### 3、验证方法

创建servlet命名为`CaptchaValidationServlet`，请求url为`CaptchaValidationServlet`

``` java
package com.mhss.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mhss.service.SampleImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/**
 * 验证码验证
 * @author smallyoung
 *
 */
public class CaptchaValidationServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public static ImageCaptchaService service = SampleImageCaptchaService.getInstance();
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		super.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userCaptchaResponse = request.getParameter("captcha_input");
		System.out.println(userCaptchaResponse);
		boolean isValid = validateResponse(request, userCaptchaResponse);
		System.out.println(isValid);
		if (isValid) {
			request.setAttribute("SUCCESS", "验证码验证通过!");
			this.getServletConfig().getServletContext().getRequestDispatcher(
					"/index.jsp").forward(request, response);
		} else {
			request.setAttribute("ERROR", "抱歉，验证码输入错误，请重新输入!");
			this.getServletConfig().getServletContext().getRequestDispatcher(
					"/index.jsp").forward(request, response);
		}
	}

	/**
	 * 验证码验证
	 * @param request
	 * @param userCaptchaResponse
	 * @return
	 */
	private  boolean validateResponse(HttpServletRequest request,
			String userCaptchaResponse) {
		boolean validated = false;
		try {
			validated = service.validateResponseForID(request.getSession(true).getId(), 
					userCaptchaResponse).booleanValue();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return validated;
	}
}
```

### 4、index.jsp页面
	
``` java
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>验证码展现</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
  <form action="CaptchaValidationServlet" method="post"> 
	 <table> 
	  <tr> 
	    <td colspan="2"><img src="ValidateServlet" id="imgNumber"/></td>
	    <td><a href="javascript:newCode()">看不清,换一张</a></td>
	  </tr> 
	  <tr> 
	    <td> 请输入您所看到的字符 :</td> 
	    <td><input type="text" name="captcha_input" value="" /> 
	    	<%=request.getAttribute("ERROR") == null ? "" : request.getAttribute("ERROR")%>
	    	<%=request.getAttribute("SUCCESS") == null ? "" : request.getAttribute("SUCCESS")%>
	    </td> 
	  </tr> 
	  <tr> 
	    <td><input type="submit" value="提交" /></td> 
	  </tr> 
	 </table> 
 </form>
  </body>
  <script type="text/javascript"> 
	     function newCode(){
	    	 var  today = new  Date();
	    	 document.getElementById("imgNumber").src="ValidateServlet?tm="+today.getTime();
	     }
	</script>
</html>

```

### 5、效果展示

![验证码展现](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/d37cc116acf44824a0bab4703214b45c.png)

## 二、自定义验证码样式

上面讲解了应用`Jcaptcha`生产验证码图片，但是由于在实际应用中，不够灵活、不美观、不智能、不能自定义等原因，常常需要我们实现`ImageCaptchaService`接口来创建我们自己所需要的 service 对象，使用自己开发的图形验证码生成引擎（`SampleListImageCaptchaEngine`）来生成更为复杂的图形验证码。

### 1、修改SampleImageCaptchaService方法。
	

``` java
package com.mhss.service;


import com.mhss.engine.SampleListImageCaptchaEngine;
import com.octo.captcha.engine.CaptchaEngine;
import com.octo.captcha.engine.image.ListImageCaptchaEngine;
import com.octo.captcha.service.captchastore.CaptchaStore;
import com.octo.captcha.service.captchastore.FastHashMapCaptchaStore;
import com.octo.captcha.service.image.AbstractManageableImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/**
 * 通过实现 ImageCaptchaService 接口来创建我们自己所需要的 service 对象，
 * 使用自己开发的图形验证码生成引擎（SampleListImageCaptchaEngine）来生成更为复杂的图形验证码。
 * 
 * @author smallyoung
 *
 */
public class SampleImageCaptchaService  extends AbstractManageableImageCaptchaService implements ImageCaptchaService {

	private static SampleImageCaptchaService instance;

	public static SampleImageCaptchaService getInstance() {
		if (instance == null) {
			//use customized engine
			ListImageCaptchaEngine engine = new SampleListImageCaptchaEngine();
			instance = new SampleImageCaptchaService(new FastHashMapCaptchaStore(), engine, 180, 100000, 75000);
		}
		return instance;
	}
	
	public SampleImageCaptchaService(CaptchaStore captchaStore,
			CaptchaEngine captchaEngine, int minGuarantedStorageDelayInSeconds,
			int maxCaptchaStoreSize, int captchaStoreLoadBeforeGarbageCollection) {
		super(captchaStore, captchaEngine, minGuarantedStorageDelayInSeconds,
				maxCaptchaStoreSize, captchaStoreLoadBeforeGarbageCollection);
	}
}

```

### 2、创建SampleListImageCaptchaEngine类，用于配置验证码的各项参数。
	

``` java
package com.mhss.engine;

import java.awt.Color;

import com.octo.captcha.component.image.backgroundgenerator.FunkyBackgroundGenerator;
import com.octo.captcha.component.image.color.SingleColorGenerator;
import com.octo.captcha.component.image.fontgenerator.TwistedRandomFontGenerator;
import com.octo.captcha.component.image.textpaster.DecoratedRandomTextPaster;
import com.octo.captcha.component.image.textpaster.TextPaster;
import com.octo.captcha.component.image.textpaster.textdecorator.BaffleTextDecorator;
import com.octo.captcha.component.image.textpaster.textdecorator.TextDecorator;
import com.octo.captcha.component.image.wordtoimage.ComposedWordToImage;
import com.octo.captcha.component.word.wordgenerator.RandomWordGenerator;
import com.octo.captcha.engine.image.ListImageCaptchaEngine;
import com.octo.captcha.image.ImageCaptchaFactory;
import com.octo.captcha.image.gimpy.GimpyFactory;

/**
 * 
 * 生成验证码的参数配置
 * 
 * @author smallyoung
 * 
 */
public class SampleListImageCaptchaEngine extends ListImageCaptchaEngine {

	public SampleListImageCaptchaEngine() {
		super();
	}

	/** 图片宽度 */
	private static final int IMAGE_WIDTH = 80;

	/** 图片高度 */
	private static final int IMAGE_HEIGHT = 28;

	/** 最小字体大小 */
	private static final int MIN_FONT_SIZE = 12;

	/** 最大字体大小 */
	private static final int MAX_FONT_SIZE = 16;

	/** 最小字符个数 */
	private static final int MIN_WORD_LENGTH = 4;

	/** 最大字符个数 */
	private static final int MAX_WORD_LENGTH = 4;

	/** 随机字符 */
	private static final String CHAR_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	/**
	 * 验证码图片生成
	 */
	protected void buildInitialFactories() {
		 //DecoratedRandomTextPaster 的第一个参数用于设置验证码最少字符数，
		//第二个参数为最多的字符数，第三个参数 SingleColorGenerator 为字体颜色，这里为黑色，
		//TextDecorator 为干扰设置，这里是一个字符一个干扰点，并且干扰点为白色。 
		 TextPaster textPaster = new DecoratedRandomTextPaster(MIN_WORD_LENGTH, 
				 MAX_WORD_LENGTH , new SingleColorGenerator(Color.BLACK), 
		 new TextDecorator[] { new BaffleTextDecorator(new Integer(1), Color.WHITE) }); 
		 //在 ImageCaptchaFactory 中，第一个参数设置了随机字库，
		 //在第二个参数中，TwistedRandomFontGenerator 设置了生成的字符字体，
		 //FunkyBackgroundGenerator 则用于生成干扰背景，除了设置字体大小外，还需要设置生成的图片大小。 
		 ImageCaptchaFactory factory = new GimpyFactory(new RandomWordGenerator(CHAR_STRING), 
		        new ComposedWordToImage(new TwistedRandomFontGenerator(MIN_FONT_SIZE, MAX_FONT_SIZE), 
		        		new FunkyBackgroundGenerator(IMAGE_WIDTH, IMAGE_HEIGHT), textPaster)); 
		    
		 ImageCaptchaFactory characterFactory[] = { factory}; 
		 addFactories(characterFactory);
	}

}

```

### 3、效果展示

![验证码展现](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/a651595fdf7d456f91933db0aef5b5c2.png)
	
### 4、自定义背景图片

同时修改SampleListImageCaptchaEngine类。并且需要背景图片，本次demo图片位置在`com/mhss/captcha`下，图片大小根据`SampleListImageCaptchaEngine`类中的`IMAGE_WIDTH`、`IMAGE_HEIGHT`两个参数决定。

![图片地址](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/7602b829c91e457a9cac4ab75ee3ff89.png)
	

``` java
package com.mhss.engine;

import java.awt.Color;
import java.awt.Font;

import com.octo.captcha.component.image.backgroundgenerator.BackgroundGenerator;
import com.octo.captcha.component.image.backgroundgenerator.FileReaderRandomBackgroundGenerator;
import com.octo.captcha.component.image.backgroundgenerator.FunkyBackgroundGenerator;
import com.octo.captcha.component.image.color.RandomListColorGenerator;
import com.octo.captcha.component.image.color.SingleColorGenerator;
import com.octo.captcha.component.image.fontgenerator.FontGenerator;
import com.octo.captcha.component.image.fontgenerator.RandomFontGenerator;
import com.octo.captcha.component.image.fontgenerator.TwistedRandomFontGenerator;
import com.octo.captcha.component.image.textpaster.DecoratedRandomTextPaster;
import com.octo.captcha.component.image.textpaster.TextPaster;
import com.octo.captcha.component.image.textpaster.textdecorator.BaffleTextDecorator;
import com.octo.captcha.component.image.textpaster.textdecorator.TextDecorator;
import com.octo.captcha.component.image.wordtoimage.ComposedWordToImage;
import com.octo.captcha.component.word.wordgenerator.RandomWordGenerator;
import com.octo.captcha.engine.image.ListImageCaptchaEngine;
import com.octo.captcha.image.ImageCaptchaFactory;
import com.octo.captcha.image.gimpy.GimpyFactory;

/**
 * 
 * 生成验证码的参数配置
 * 
 * @author smallyoung
 * 
 */
public class SampleListImageCaptchaEngine extends ListImageCaptchaEngine {

	public SampleListImageCaptchaEngine() {
		super();
	}

	/** 图片宽度 */
	private static final int IMAGE_WIDTH = 80;

	/** 图片高度 */
	private static final int IMAGE_HEIGHT = 28;

	/** 最小字体大小 */
	private static final int MIN_FONT_SIZE = 12;

	/** 最大字体大小 */
	private static final int MAX_FONT_SIZE = 16;

	/** 最小字符个数 */
	private static final int MIN_WORD_LENGTH = 4;

	/** 最大字符个数 */
	private static final int MAX_WORD_LENGTH = 4;

	/** 随机字符 */
	private static final String CHAR_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	/** 随机背景图片路径 */
	private static final String BACKGROUND_IMAGE_PATH = "com/mhss/captcha/";

	/**
	 * 随机字体
	 */
	private static final Font[] FONTS = new Font[] { new Font("nyala", Font.BOLD, MAX_FONT_SIZE), 
		new Font("Arial", Font.BOLD, MAX_FONT_SIZE), new Font("nyala", Font.BOLD, MAX_FONT_SIZE), 
		new Font("Bell", Font.BOLD, MAX_FONT_SIZE), new Font("Bell MT", Font.BOLD, MAX_FONT_SIZE), 
		new Font("Credit", Font.BOLD, MAX_FONT_SIZE), new Font("valley", Font.BOLD, MAX_FONT_SIZE),
		new Font("Impact", Font.BOLD, MAX_FONT_SIZE) };

	/**
	 * 随机颜色
	 */
	private static final Color[] COLORS = new Color[] { new Color(255, 255, 255), 
		new Color(255, 220, 220), new Color(220, 255, 255), 
		new Color(220, 220, 255), new Color(255, 255, 220), 
		new Color(220, 255, 220) };

	/**
	 * 验证码图片生成
	 */
	protected void buildInitialFactories() {
		FontGenerator fontGenerator = new RandomFontGenerator(MIN_FONT_SIZE, MAX_FONT_SIZE, FONTS);
		BackgroundGenerator backgroundGenerator = new FileReaderRandomBackgroundGenerator(IMAGE_WIDTH, IMAGE_HEIGHT, 
				BACKGROUND_IMAGE_PATH);
		TextPaster textPaster = new DecoratedRandomTextPaster(MIN_WORD_LENGTH, MAX_WORD_LENGTH, 
				new RandomListColorGenerator(COLORS), new TextDecorator[] {});
		addFactory(new GimpyFactory(new RandomWordGenerator(CHAR_STRING), 
				new ComposedWordToImage(fontGenerator, backgroundGenerator, textPaster)));
	}
	
	/**
	 * 验证码图片生成
	 */
	/*protected void buildInitialFactories2() {
		 //DecoratedRandomTextPaster 的第一个参数用于设置验证码最少字符数，
		//第二个参数为最多的字符数，第三个参数 SingleColorGenerator 为字体颜色，这里为黑色，
		//TextDecorator 为干扰设置，这里是一个字符一个干扰点，并且干扰点为白色。 
		 TextPaster textPaster = new DecoratedRandomTextPaster(MIN_WORD_LENGTH, 
				 MAX_WORD_LENGTH , new SingleColorGenerator(Color.BLACK), 
		 new TextDecorator[] { new BaffleTextDecorator(new Integer(1), Color.WHITE) }); 
		 //在 ImageCaptchaFactory 中，第一个参数设置了随机字库，
		 //在第二个参数中，TwistedRandomFontGenerator 设置了生成的字符字体，
		 //FunkyBackgroundGenerator 则用于生成干扰背景，除了设置字体大小外，还需要设置生成的图片大小。 
		 ImageCaptchaFactory factory = new GimpyFactory(new RandomWordGenerator(CHAR_STRING), 
		        new ComposedWordToImage(new TwistedRandomFontGenerator(MIN_WORD_LENGTH, MAX_WORD_LENGTH), 
		        		new FunkyBackgroundGenerator(IMAGE_WIDTH, IMAGE_HEIGHT), textPaster)); 
		    
		 ImageCaptchaFactory characterFactory[] = { factory}; 
		 addFactories(characterFactory);
	}*/

}

```
### 5、效果展示

![效果展示](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/ad82b5ec26ec49c9b39bb36eaf3ab3a5.png)

## 三、验证忽略大小写

`JCaptcha`在默认情况下，验证时会区别大小写，这在平时开发中是很不方便的，如今大多数的网站都忽略大小写，所以，我们需要改写`Gimpy`和`MyGimpyFactory`来实现验证时的大小写忽略。

当然也可以将验证码都设置成大写（小写），在后台获取时，统一将输入的验证码修改为大写（小写），也可以变相的实现忽略大小写功能，
	
### 1、创建MyGimpy，继承ImageCaptcha类

``` java
package com.mhss.engine;

import java.awt.image.BufferedImage;
import java.io.Serializable;

import com.octo.captcha.image.ImageCaptcha;

/**
 * 改写Gimpy，支持“忽略大小写”功能
 * @author smallyoung
 *
 */
public class MyGimpy extends ImageCaptcha implements Serializable {
    
	private static final long serialVersionUID = 1L;
	
	private String response;
	
    MyGimpy(String question, BufferedImage challenge, String response) {
        super(question, challenge);
        this.response = response;
    }
    public final Boolean validateResponse(final Object response) {
        return (null != response && response instanceof String)
                ? validateResponse((String) response) : Boolean.FALSE;
    }
    private final Boolean validateResponse(final String response) {
        //主要改的是这里
        return new Boolean(response.toLowerCase().equals(this.response.toLowerCase()));
    }
}

```

### 2、创建MyGimpyFactory类，继承ImageCaptchaFactory类
	
``` java
package com.mhss.engine;

import java.awt.image.BufferedImage;
import java.security.SecureRandom;
import java.util.Locale;
import java.util.Random;

import com.octo.captcha.CaptchaException;
import com.octo.captcha.CaptchaQuestionHelper;
import com.octo.captcha.component.image.wordtoimage.WordToImage;
import com.octo.captcha.component.word.wordgenerator.WordGenerator;
import com.octo.captcha.image.ImageCaptcha;
import com.octo.captcha.image.ImageCaptchaFactory;
import com.octo.captcha.image.gimpy.Gimpy;

/**
 * 改写MyGimpyFactory，支持“忽略大小写”功能
 * @author smallyoung
 *
 */
public class MyGimpyFactory extends ImageCaptchaFactory {
	private Random myRandom = new SecureRandom();
	private WordToImage wordToImage;
	private WordGenerator wordGenerator;
	public static final String BUNDLE_QUESTION_KEY = Gimpy.class.getName();

	public MyGimpyFactory(WordGenerator generator, WordToImage word2image) {
		if (word2image == null) {
			throw new CaptchaException("Invalid configuration"
					+ " for a GimpyFactory : WordToImage can't be null");
		}
		if (generator == null) {
			throw new CaptchaException("Invalid configuration"
					+ " for a GimpyFactory : WordGenerator can't be null");
		}
		wordToImage = word2image;
		wordGenerator = generator;
	}

	public ImageCaptcha getImageCaptcha() {
		return getImageCaptcha(Locale.getDefault());
	}

	public WordToImage getWordToImage() {
		return wordToImage;
	}

	public WordGenerator getWordGenerator() {
		return wordGenerator;
	}

	public ImageCaptcha getImageCaptcha(Locale locale) {
		Integer wordLength = getRandomLength();
		String word = getWordGenerator().getWord(wordLength, locale);
		BufferedImage image = null;
		try {
			image = getWordToImage().getImage(word);
		} catch (Throwable e) {
			throw new CaptchaException(e);
		}
		//这里用我们自己写的MyGimpy
		ImageCaptcha captcha = new MyGimpy(CaptchaQuestionHelper.getQuestion(
				locale, BUNDLE_QUESTION_KEY), image, word);
		return captcha;
	}

	protected Integer getRandomLength() {
		Integer wordLength;
		int range = getWordToImage().getMaxAcceptedWordLength()
				- getWordToImage().getMinAcceptedWordLength();
		int randomRange = range != 0 ? myRandom.nextInt(range + 1) : 0;
		wordLength = new Integer(randomRange
				+ getWordToImage().getMinAcceptedWordLength());
		return wordLength;
	}
}
```

### 3、修改SampleListImageCaptchaEngine类

![修改SampleListImageCaptchaEngine类](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/7099bc28fe2a49518f6ea3dcae4235b6.png)


![修改SampleListImageCaptchaEngine类](//cdn.smallyoung.cn/article/5fd81b26e4b01dc74778c5c5/34ea1710d02c4bf1a0b731264db90e8a.png)

