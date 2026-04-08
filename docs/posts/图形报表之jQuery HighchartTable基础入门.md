---
title: 图形报表之jQuery HighchartTable基础入门
date: 2016-11-02
cover: //cdn.smallyoung.cn/article/cover/d25676f7ca2e44ca83b116f4945f95cc.jpg!/format/webp
category: 前端
tags:
  - Jquery
  - 报表
  - Highcharts
description: "一、简介 1、介绍 HighchartsTable是一款基于jQuery编写的HTML表格转换Highcharts图表的插件。 利用它，你只需要关注HTML表格配置即可创建Highcharts图表！ "
author: smallyoung
---

## 一、简介

### 1、介绍

`HighchartsTable`是一款基于jQuery编写的HTML表格转换Highcharts图表的插件。	利用它，你只需要关注HTML表格配置即可创建Highcharts图表！
	
### 2、运行原理
	
`HighchartsTable`利用HTML5 的 `data-*` 属性来指定图表渲染选项。
	
### 3、浏览器兼容性
	
`HighchartsTable`兼容目前主流浏览器

![浏览器兼容性](//cdn.smallyoung.cn/article/5fd8476ee4b01dc74778c5c7/a3222bab89d14bf08453fd91fb2ee4a6.png)

> 注意：jQuery 版本需要 >= 1.4.3

`HighchartsTable`的兼容性取决于`Highcharts`的兼容性，

`Highcharts`兼容目前主流浏览器，包括`IE6`，详情请查看 Highcharts兼容性
	
### 4、许可（License）
	
`HighchartsTable` 基于 `MIT` 许可协议发布

## 二、简单使用

`HighchartsTable`需要从一个HTML表格中读取数据和属性，分析并创建一个`Hightcharts`图表。所有利用`HighchartsTable`创建图表的重点在于HTML表格的创建。下面详细说明创建图表的过程。

### 1、下载并引入必须的js文件

``` html
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="highcharts.js"></script>
<script type="text/javascript" src="jquery.highchartsTable.js"></script>
```

### 2、创建图表渲染容器

``` html
<div class="container"></div>
```

### 3、创建HTML表格

在<table>，你必须设置一些属性，如图表类型和图表渲染容器等，其中数据列（`Series`）的名字在<thead>中定义，值在<tbody>中定义<tr>的第一个<td>代表X轴（`xAxis`）的值，其他<td>代表每个系列的Y值（`Value`），在`data-graph-type`中，`column`代表柱状图、`pie`代表饼状图、`line`代表折线图、`area`代表区域、`spline`代表曲线图。示例代码如下：

``` html
<table class="highchart" data-graph-container-before="1" data-graph-type="line" style="display:none">
 <caption>学员数量统计</caption>
  <thead>
      <tr>
          <th>数量</th>
          <th>城市</th>
          <th>未知</th>
      </tr>
   </thead>
   <tbody>
      <tr>
          <td>重庆</td>
          <td>50</td>
          <td>40</td>
      </tr>
      <tr>
          <td>北京</td>
          <td>150</td>
          <td>140</td>
      </tr>
      <tr>
          <td>成都</td>
          <td>500</td>
          <td>490</td>
      </tr>
      <tr>
          <td>上海</td>
          <td>240</td>
          <td>230</td>
      </tr>
      <tr>
          <td>南京</td>
          <td>200</td>
          <td>190</td>
      </tr>
      <tr>
          <td>河北</td>
          <td>400</td>
          <td>390</td>
      </tr>
  </tbody>
</table>
```

### 4、调用图表转换函数

最后，在Table上调用highchartTable()函数即可，代码如下
	
``` js
$(document).ready(function() {
    $("table.highchart").highchartTable();
});
```

### 5、效果

![效果](//cdn.smallyoung.cn/article/5fd8476ee4b01dc74778c5c7/b667356ab7e54fff9cc31a6792fec724.png)

当将table中的`data-graph-type`修改为`column`时，会变成相对应的报表图形。

![column](//cdn.smallyoung.cn/article/5fd8476ee4b01dc74778c5c7/d3a79f5a97b2457a8ecbe093df1f153a.png)

### 6、复合图形

在复杂的数据中，我们会经常将不同图形的报表整合成一张报表图形提供给运营人员。这无疑大大的加重了后台开发人员的工作量。`jQuery HighchartTable`在这方便做的也是非常不错的。我们一柱状图和区域图为例：

``` html
<table class="highchart" data-graph-container-before="1" data-graph-type="column" style="display:none">
 <caption>学员数量统计</caption>
  <thead>
      <tr>
          <th>数量</th>
          <th>城市</th>
          <th data-graph-type="area">未知</th>
      </tr>
   </thead>
   <tbody>
      <tr>
          <td>重庆</td>
          <td>50</td>
          <td>40</td>
      </tr>
      <tr>
          <td>北京</td>
          <td>150</td>
          <td>140</td>
      </tr>
      <tr>
          <td>成都</td>
          <td>500</td>
          <td>490</td>
      </tr>
      <tr>
          <td>上海</td>
          <td>240</td>
          <td>230</td>
      </tr>
      <tr>
          <td>南京</td>
          <td>200</td>
          <td>190</td>
      </tr>
      <tr>
          <td>河北</td>
          <td>400</td>
          <td>390</td>
      </tr>
  </tbody>
</table>
</div>
</body>
<script>
	$(document).ready(function() {
  		$('table.highchart').highchartTable();
	});
</script>
```

效果：

![效果](//cdn.smallyoung.cn/article/5fd8476ee4b01dc74778c5c7/250836c0fea94f9bad4cde0119cdcc08.png)

### 7、其他说明

1. jQuery HighchartTable在各个浏览器中的兼容性非常好，基本上满足了日常开发使用，并且支持浏览器自适应。
2. 在形成的图形报表中，点击报表下面相对应的名称，可隐藏相对应的报表数据。

![报表数据](//cdn.smallyoung.cn/article/5fd8476ee4b01dc74778c5c7/e92cd073f4b34ecd9a3937b481ca8e3d.gif)

> 注：如果data-graph-type设置成pie时，每个tr标签中，只允许有两个td标签。jQuery HighchartTable默认情况下生效的就只有前两个，如果大于2个td标签，后面的数据会失效。
