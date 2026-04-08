---
title: Java的递归算法
date: 2016-11-08
cover: //cdn.smallyoung.cn/article/cover/f37abf09d5764064b68bd357435e75d9.jpg!/format/webp
category: 后端开发
tags:
  - Java
  - 递归
  - 算法
description: "一、定义 程序调用自身的编程技巧称为递归（recursion）。递归做为一种算法在程序设计语言中广泛应用。 一个过程或函数在其定义或说明中有直接或间接调用自身的一种方法，它通常把一个大型复杂的问题层层"
author: smallyoung
---

## 一、定义

程序调用自身的编程技巧称为递归（`recursion`）。递归做为一种算法在程序设计语言中广泛应用。 一个过程或函数在其定义或说明中有直接或间接调用自身的一种方法，它通常把一个大型复杂的问题层层转化为一个与原问题相似的规模较小的问题来求解，递归策略只需少量的程序就可描述出解题过程所需要的多次重复计算，大大地减少了程序的代码量。递归的能力在于用有限的语句来定义对象的无限集合。一般来说，递归需要有边界条件、递归前进段和递归返回段。当边界条件不满足时，递归前进；当边界条件满足时，递归返回。

## 二、递归算法四个特性

1. 递归就是方法里调用自身，在策略上，必须有一个明确的递归结束条件，称为递归出口；
2. 子问题在规模上比原问题小，或更接近终止条件；
3. 子问题可通过再次递归调用求解或因满足终止条件而直接求解；
4. 在递归调用的过程当中系统为每一层的返回点、局部量等开辟了栈来存储。递归次数过多容易造成栈溢出等，所以一般不提倡用递归算法设计程序。

在做递归算法的时候，一定要把握住出口，也就是做递归算法必须要有一个明确的递归结束条件。这一点是非常重要的。其实这个出口是非常好理解的，就是一个条件，当满足了这个条件的时候我们就不再递归了。

## 三、递归在实际中的应用

### 加和计算
	 

``` java
/**
	 * 递归运用:1：加和计算
	 * @param num
	 * 			需要递归加和计算的数字
	 * @return	
	 * 			返回递归加和结果
	 */
	public static int sum(int num){
		if(num == 1 || num == 0){
			return num;         
		}else{
			return num + sum(num-1);
		}
	}
```

### 阶乘计算
	

``` java
/**
	 * 递归运用:2：阶乘计算
	 * @param num
	 * 			需要递归计算的数字
	 * @return	
	 * 			返回递归阶乘结果
	 */
	public static int multiply(int num){
		if(num == 1 || num == 0){
			return num;         
		}else{
			return num*multiply(num-1);
		}
	}
```

### 删除文件夹内所有的内容
	
``` java
/**
	  * 递归运用之3：删除文件夹内所有的内容
	  * 
	  * @param file
	  * 		需要删除内容的文件
	  */
    public static void deleteAll(File file) {
        if(file != null){
            if (file.isFile()) {
                file.delete();
            } else {
                File[] files = file.listFiles();
                if(files == null) return;
                for (int i = 0; i < files.length; i++) {
                    deleteAll(files[i]);
                    files[i].delete();
                }
                if (file.exists()) // 如果文件本身就是目录 ，就要删除目录
                    file.delete();
            }
        }
    }
```

运行结果

![运行结果](//cdn.smallyoung.cn/article/5fd86b97e4b01dc74778c5cc/e8301af14c6845f3943ee52a89c18b96.png)


