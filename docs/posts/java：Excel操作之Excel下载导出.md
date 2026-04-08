---
title: java：Excel操作之Excel下载导出
date: 2016-11-06
cover: //cdn.smallyoung.cn/article/cover/e7acc26b5a014584aece50bfde4605bc.jpg!/format/webp
category: 后端开发
tags:
  - Java
  - Excel
description: "一、下载jar包 二、创建servlet 创建servlet命名为DownloadServlet，请求url为DownloadServlet； java public void doPost(Http"
author: smallyoung
---

## 一、下载jar包

![jar包](//cdn.smallyoung.cn/article/5fd8619be4b01dc74778c5ca/0e8f71a189164eaaa42725ce5f3547e1.png)

## 二、创建servlet

创建servlet命名为`DownloadServlet`，请求url为`DownloadServlet`；

``` java
public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setCharacterEncoding("UTF-8");
		
		List<Student> list = new ArrayList<Student>();
		list.add(new Student(111, "张三", 20));
		list.add(new Student(112, "李四", 21));
		list.add(new Student(113, "王五", 22));
		list.add(new Student(114, "斯柯达", 23));
		list.add(new Student(115, "收到了", 24));
		list.add(new Student(116, "啦看是", 25));
		list.add(new Student(117, "撒旦", 26));

		//获取缓存路径
		String path = this.getServletContext().getRealPath("\\");
		path = path+"student.xls";
		Vector<Student> v = new Vector<Student>();
		for (int i = 0; i < list.size(); i++) {
			v.add((Student) list.get(i));
		}
		exportExcel(path, v);
		// 下载本地文件
		String fileName = "学生student.xls".toString(); // 文件的默认保存名
		// 读到流中
		InputStream inStream = new FileInputStream(path);// 文件的存放路径
		// 设置输出的格式
		response.reset();
		response.setContentType("bin");
		//将字符串转成ios8859-1可以解决中文乱码的问题。
		response.addHeader("Content-Disposition", "attachment; filename=\""	+ new String(fileName.getBytes(), "iso8859-1") + "\"");
		// 循环取出流中的数据
		byte[] b = new byte[100];
		int len;
		try {
			while ((len = inStream.read(b)) > 0)
				response.getOutputStream().write(b, 0, len);
			inStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

```

## 三、数据封装

将数据封装到excel中

``` java
/**
	 * 数据封装 将数据封装到excel中
	 * 
	 * @param fileName	
	 * 				文件位置
	 * @param content	
	 * 				数据列表
	 */
	public static void exportExcel(String fileName, Vector<Student> content) {
		WritableWorkbook wwb;
		FileOutputStream fos;
		try {
			fos = new FileOutputStream(fileName);
			wwb = Workbook.createWorkbook(fos);
			WritableSheet ws = wwb.createSheet("学生名单", 10); // 创建一个工作表

			// 填充数据的内容
			Student[] p = new Student[content.size()];
			for (int i = 0; i < content.size(); i++) {
				p[i] = (Student) content.get(i);
				ws.addCell(new Label(0, i + 1, i + ""));
				ws.addCell(new Label(1, i + 1, p[i].getId() + ""));
				ws.addCell(new Label(2, i + 1, p[i].getName()));
				ws.addCell(new Label(3, i + 1, p[i].getAge() + ""));
				if (i == 0) {
					//填充表头信息
					ws.addCell(new Label(0, i, "序号"));
					ws.addCell(new Label(1, i, "学号"));
					ws.addCell(new Label(2, i, "姓名"));
					ws.addCell(new Label(3, i, "年龄"));
				}
			}
			wwb.write();
			wwb.close();
		} catch (Exception e) {

		}
	}
```

## 四、页面请求

index.jsp页面请求，可忽略。直接浏览器输入请求地址。

``` html
<form action="DownloadServlet" method="post">
  <input type="submit" value="下载Excel">
</form>
```

## 五、效果

![效果](//cdn.smallyoung.cn/article/5fd8619be4b01dc74778c5ca/439c5892269247a491087d022e497c74.png)


