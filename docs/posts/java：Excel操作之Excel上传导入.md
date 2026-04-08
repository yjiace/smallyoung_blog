---
title: java：Excel操作之Excel上传导入
date: 2016-11-06
cover: //cdn.smallyoung.cn/article/cover/8eca86dd27e349d1bdc4839de8958d7c.jpg!/format/webp
category: 后端开发
tags:
  - Java
  - Excel
description: "一、导入jar包 二、创建Servlet 创建servlet命名为UploadExcelServlet，url为UploadExcelServlet java package com.mhss.ser"
author: smallyoung
---


## 一、导入jar包

![导入jar包](//cdn.smallyoung.cn/article/5fd85eb5e4b01dc74778c5c9/e31001dac55b4dc29ab9e51412de14d6.png)

## 二、创建Servlet

创建servlet命名为`UploadExcelServlet`，url为`UploadExcelServlet`


``` java
package com.mhss.servlet;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.mhss.util.ExcelBatchUtil;

public class UploadExcelServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");

		// 接收文件流信息
		DiskFileItemFactory dfif = new DiskFileItemFactory();
		ServletFileUpload sfu = new ServletFileUpload(dfif);

		// 解析请求对象 request
		try {
			// 所有表单项 FileItem
			@SuppressWarnings("rawtypes")
			List list = sfu.parseRequest(request);
			
			for (int i = 0; i < list.size(); i++) {
				FileItem fi = (FileItem) list.get(i);
				if (fi.isFormField()) {
					// 普通文本域
				} else {
					// 文件域
					String fileName = fi.getName();
					System.out.println(fileName);
					// 得到 文件 要上传的 一个 服务端 目标路径
					String path = this.getServletContext().getRealPath("\\upload");
					Date today = new Date();
					// 利用 服务器端路径 加上 要上传的 文件名 创建文件对象
					File newFile = new File(path + "/" + today.getTime() + fileName);
					// 把文件流 写到 新创建对象对象中 并且把文件 写到硬盘上
					ExcelBatchUtil e = new ExcelBatchUtil();
					fi.write(newFile);
					e.uploadExcel(newFile , request);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		response.sendRedirect("index.jsp");
		
	}

}

```

## 三、批量处理

创建Excel的批量处理方法`ExcelBatchUtil`

``` java
package com.mhss.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import jxl.Cell;
import jxl.CellType;
import jxl.DateCell;
import jxl.LabelCell;
import jxl.Sheet;
import jxl.Workbook;

/**
 * Excel批量处理
 * @author 梦幻逝水
 *
 */
public class ExcelBatchUtil {
	private Sheet sheet;
	private String[][] excelValue;
	private int successRow;
	private int failRow;
	private StringBuilder msg = new StringBuilder();
	private String finalMsg;

	
	/**
	 * excel导入的总方法
	 * @throws ParseException 
	 */
	public void uploadExcel(File upload , HttpServletRequest request) throws ParseException {
		initExcel(upload); // 初始化
		readExcel(); // 读取
		insertIntoDB(request); //处理数据
	}

	/**
	 * 读取excel文件中数据，保存到sheet对象中
	 * 
	 * @param upload
	 */
	private void initExcel(File upload) {
		Workbook rwb = null;
		try {
			InputStream is = new FileInputStream(upload);
			rwb = Workbook.getWorkbook(is);

			sheet = rwb.getSheet(0);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 读取excel中数据进入excelValue数组中
	 */
	private void readExcel() {
		excelValue = new String[sheet.getRows()][sheet.getColumns()];
		for (int i = 0; i < sheet.getRows(); i++)
			for (int j = 0; j < sheet.getColumns(); j++) {
				Cell cell = sheet.getCell(j, i);
				if ("".equals(cell.getContents().toString().trim())) {
					excelValue[i][j] = "";
				}
				if (cell.getType() == CellType.LABEL) {
					LabelCell labelcell = (LabelCell) cell;
					excelValue[i][j] = labelcell.getString().trim();
				} else if (cell.getType() == CellType.NUMBER) {
					excelValue[i][j] = cell.getContents();
				} else if (cell.getType() == CellType.DATE) {
					DateCell datcell = (DateCell) cell;
					excelValue[i][j] = datcell.getDate().toString();
				} else {
					excelValue[i][j] = cell.getContents().toString().trim();
				}
			}
	}

	/**
	 * 3.保存进入数据库
	 * 
	 * @param course
	 * @throws ParseException 
	 */
	private void insertIntoDB(HttpServletRequest request) throws ParseException {
		int excelRows = excelValue.length;
		// 将消息清空
		msg.delete(0, msg.length());
		finalMsg = "";
		successRow = 0;
		failRow = 0;
		if (excelValue.length > 1) {
			for (int i = 1; i < excelRows; i++) { // 从第二排开始，第一排为文字说明
				String[] DBValue = excelValue[i]; // 取一行数据
				if (validateInfor(i, DBValue)) {//校验
					successRow += 1;
					finalInsert(DBValue);//获取信息，可再次方法中处理数据存入数据库。
				} else {
					failRow += 1;
				}
			}
			finalMsg = "导入成功结束：" + "</br>" + "目标导入：" + (successRow + failRow)
					+ "</br>" + "成功录入数：" + (successRow) + "</br>" + "失败录入数："
					+ (failRow) + "</br>" + msg.toString();
		} else {
			finalMsg = "excel中无任何数据！";
		}
		System.out.println(finalMsg);
	}
	
	/**
	 * 检验信息，并返回检验结果。这里不做检验，直接返回true
	 * @param i
	 * @param DBValue
	 * @return
	 */
	private boolean validateInfor(int i, String[] DBValue) {
		Boolean bol = true;
		//检验方法，根据所需要的需求。进行校验。
		return bol;
	}
	
	/**
	 * 信息处理，对Excel中的信息进行处理。
	 * @param DBValue
	 * @throws ParseException
	 */
	private void finalInsert(String[] DBValue) throws ParseException {
		System.out.println(DBValue[0]+"=="+DBValue[1]+"=="+DBValue[2]);
	}
}
```

## 四、上传Excel

index.jsp上传Excel，此处未对上传的数据进行校验，可自行根据需求，对上传的文件进行excel文件类型判断。

> 注：form中请求必须为post，必须有`enctype="multipart/form-data" `属性。

``` html
<form action="UploadExcelServlet" enctype="multipart/form-data" method="post">
	<input id="excelFile" name="uploadExcel" type="file"/>
	<input type="submit" value="提交"/>
</form>
```

## 五、效果

![效果](//cdn.smallyoung.cn/article/5fd85eb5e4b01dc74778c5c9/c7687ac5d1864e68aedff79a3dc5ba0c.png)


> 注意：此Demo只支持Excel中的xls文件类型。不支持新版的xlsx文件类型


