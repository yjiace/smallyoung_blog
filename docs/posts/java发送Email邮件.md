---
title: java发送Email邮件
date: 2016-11-01
cover: //cdn.smallyoung.cn/article/cover/adf0e496671e4cd187efe33c9f05268e.jpg!/format/webp
category: 后端开发
tags:
  - Eamil
  - 邮件
description: "一、概述 JAVA MAIL是利用现有的邮件账户发送邮件的工具，比如说，我在网易注册一个邮箱账户，通过JAVA Mail的操控，我可以不亲自登录网易邮箱，让程序自动的使用网易邮箱发送邮件。这一机制被广"
author: smallyoung
---

## 一、概述

`JAVA MAIL`是利用现有的邮件账户发送邮件的工具，比如说，我在网易注册一个邮箱账户，通过`JAVA Mail`的操控，我可以不亲自登录网易邮箱，让程序自动的使用网易邮箱发送邮件。这一机制被广泛的用在`注册激活`和`垃圾邮件`的发送等方面。

本次以QQ邮箱为例。

## 二、开通邮箱的stmp功能

获取授权码，在登录时所用到的密码就是此授权码。

![邮箱的stmp](//cdn.smallyoung.cn/article/5fd82fc9e4b01dc74778c5c6/05f1c057146a4051a7668eaaed2b8b24.png)

![邮箱的stmp](//cdn.smallyoung.cn/article/5fd82fc9e4b01dc74778c5c6/70e316bbe97240109b5aae84541104f0.png)

![邮箱的stmp](//cdn.smallyoung.cn/article/5fd82fc9e4b01dc74778c5c6/7fb8c4e8256146768bfe96cb446072d4.png)

## 三、下载jar包

这里我们用到了`mailapi.jar`和`smtp.jar`

![所需jar包](//cdn.smallyoung.cn/article/5fd82fc9e4b01dc74778c5c6/85c1331138af42feb28fc670f5d87898.png)

## 四、创建Email公用类
	

``` java
package com.lumitest.util;

import java.util.ArrayList;
import java.util.List;

public class Email {
	
	private String smtpServer; // SMTP服务器地址
	private String port; // 端口
	private String username; // 登录SMTP服务器的用户名
	private String password; // 登录SMTP服务器的密码
	private List<String> recipients = new ArrayList<String>(); // 收件人地址集合
	private String subject; // 邮件主题
	private String content; // 邮件正文
	private List<String> attachmentNames = new ArrayList<String>(); // 附件路径信息集合

	

	public Email() {
		super();
	}

	public Email(String smtpServer, String port, String username,
			String password, List<String> recipients, String subject,
			String content, List<String> attachmentNames) {
		super();
		this.smtpServer = smtpServer;
		this.port = port;
		this.username = username;
		this.password = password;
		this.recipients = recipients;
		this.subject = subject;
		this.content = content;
		this.attachmentNames = attachmentNames;
	}

	public String getSmtpServer() {
		return smtpServer;
	}

	public void setSmtpServer(String smtpServer) {
		this.smtpServer = smtpServer;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<String> getRecipients() {
		return recipients;
	}

	public void setRecipients(List<String> recipients) {
		this.recipients = recipients;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<String> getAttachmentNames() {
		return attachmentNames;
	}

	public void setAttachmentNames(List<String> attachmentNames) {
		this.attachmentNames = attachmentNames;
	}
}
```

## 五、创建SendMailBySSL类

用于发送Email。

``` java
package com.lumitest.util;

import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

public class SendMailBySSL {

	private final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

	/**
	 * 正式发邮件
	 **/
	public boolean sendMail(Email email) {
		Properties properties = new Properties();
		properties.put("mail.smtp.host", email.getSmtpServer());
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.socketFactory.class", SSL_FACTORY); // 使用JSSE的SSL
		properties.put("mail.smtp.socketFactory.fallback", "false"); // 只处理SSL的连接,对于非SSL的连接不做处理
		properties.put("mail.smtp.port", email.getPort());
		properties.put("mail.smtp.socketFactory.port", email.getPort());

		Session session = Session.getInstance(properties);
		//session.setDebug(true);   //调试模式
		MimeMessage message = new MimeMessage(session);

		try {
			// 发件人
			Address address = new InternetAddress(email.getUsername());
			message.setFrom(address);
			// 收件人
			for (String recipient : email.getRecipients()) {
				Address toAddress = new InternetAddress(recipient);
				// 设置收件人,并设置其接收类型为TO,TO：代表有健的主要接收者。 CC：代表有健的抄送接收者。 BCC：代表邮件的暗送接收者。
				message.setRecipient(MimeMessage.RecipientType.TO, toAddress);
			}
			// 主题
			message.setSubject(email.getSubject());
			// 时间
			message.setSentDate(new Date());
			Multipart multipart = new MimeMultipart();
			// 添加文本
			BodyPart text = new MimeBodyPart();
			text.setText(email.getContent());
			multipart.addBodyPart(text);
			// 添加附件
			if(email.getAttachmentNames() != null){
				for (String fileName : email.getAttachmentNames()) {
					BodyPart adjunct = new MimeBodyPart();
					FileDataSource fileDataSource = new FileDataSource(fileName);
					adjunct.setDataHandler(new DataHandler(fileDataSource));
					adjunct.setFileName( MimeUtility.encodeText((fileDataSource.getName())));
					multipart.addBodyPart(adjunct);
				}
				// 清空收件人集合，附件集合
				email.getRecipients().clear();
				email.getAttachmentNames().clear();
			}
			message.setContent(multipart);
			message.saveChanges();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		try {
			Transport transport = session.getTransport("smtp");
			transport.connect(email.getSmtpServer(), email.getUsername(), email.getPassword());
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
}

```

## 六、创建Servlet

命名为SendMailServlet，url为SendMailServlet。也可以在main方法中调用。
	

``` java
package com.lumitest.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lumitest.util.Email;
import com.lumitest.util.SendMailBySSL;

/**
 * 发送邮件的请求servlet
 * 
 * @author 梦幻逝水
 *
 */
public class SendMailServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		//收件人
		List<String> recipients = new ArrayList<String>();
		recipients.add("123456789@qq.com");
		//主题
		String subject = "这封邮件是为了测试SMTP的SSL加密传输";
		//内容
		String content = "这是这封邮件的正文";
		//附件
		List<String> attachmentNames = new ArrayList<String>();
		attachmentNames.add("D://测试test.txt");
		
		Email email = new Email("smtp.qq.com", "465","12356789@qq.com", "授权码", recipients, subject, content, attachmentNames);
		new SendMailBySSL().sendMail(email);
	}

}

```
## 七、效果展现

![效果展现](//cdn.smallyoung.cn/article/5fd82fc9e4b01dc74778c5c6/2813c72b4f0544a48272fc5ab9808e46.png)

