---
title: Java中整型的缓存机制
date: 2021-03-03
cover: //cdn.smallyoung.cn/article/cover/6875eb893747423eb514662de6a4d373.jpg!/format/webp
category: 后端开发
tags:
  - 缓存
  - 整型
description: "一、基础概念 在Java 5中，在Integer的操作上引入了一个新功能来节省内存和提高性能。整型对象通过使用相同的对象引用实现了缓存和重用。 Java的编译器把基本数据类型自动转换成封装类对象的过程"
author: smallyoung
---


## 一、基础概念

在Java 5中，在Integer的操作上引入了一个新功能来节省内存和提高性能。整型对象通过使用相同的对象引用实现了缓存和重用。

Java的编译器把基本数据类型自动转换成封装类对象的过程叫做`自动装箱`，相当于使用`valueOf`方法：

```java
//自动装箱
Integer a = 10;
//底层实现
Integer b = Integer.valueOf(10); 
```

## 二、效果演示

```java
@Test
public void test(){
    Integer a = 127;
    Integer b = 127;

    if (a == b){
        System.out.println("a == b");
    } else {
        System.out.println("a != b");
    }
    Integer c = 128;
    Integer d = 128;

    if (c == d) {
        System.out.println("c == d");
    }else {
        System.out.println("c != d");
    }
}
```

猜猜执行结果会是什么？

可能有人会说了，这有什么可疑问的，在Java中，`==`比较的是对象应用，而`equals`比较的是值。所以在进行比较的时候都将返回false。然而结果真的是这样吗？？？

![执行结果](//cdn.smallyoung.cn/article/603f4cffe4b0bf4688e54f1b/fb1926b0f6d346cf83470a8fc6ae5250.png!/format/webp)

是不是很出人意料，这其中就设计到了整型的缓存机制，且听我一一道来。

## 三、Integer底层实现

现在我们知道了这种机制在源码中哪里使用了，那么接下来我们就看看JDK中的`valueOf`方法。下面是`JDK 1.8.0 build 25`的实现：

``` java
/**
 * Returns an {@code Integer} instance representing the specified
 * {@code int} value.  If a new {@code Integer} instance is not
 * required, this method should generally be used in preference to
 * the constructor {@link #Integer(int)}, as this method is likely
 * to yield significantly better space and time performance by
 * caching frequently requested values.
 *
 * This method will always cache values in the range -128 to 127,
 * inclusive, and may cache other values outside of this range.
 *
 * @param  i an {@code int} value.
 * @return an {@code Integer} instance representing {@code i}.
 * @since  1.5
 */
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

在创建`Integer`对象时，会先从`IntegerCache`的`cache`中查找，如果没有找到，则会使用new创建对象。

## 四、IntegerCache 底层实现

`IntegerCache`是`Integer`类中定义的一个`内部类`

``` java
/**
 * Cache to support the object identity semantics of autoboxing for values between
 * -128 and 127 (inclusive) as required by JLS.
 *
 * The cache is initialized on first usage.  The size of the cache
 * may be controlled by the {@code -XX:AutoBoxCacheMax=} option.
 * During VM initialization, java.lang.Integer.IntegerCache.high property
 * may be set and saved in the private system properties in the
 * sun.misc.VM class.
 */

private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        // high value may be configured by property
        int h = 127;
        String integerCacheHighPropValue =
            sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;

        cache = new Integer[(high - low) + 1];
        int j = low;
        for(int k = 0; k < cache.length; k++)
            cache[k] = new Integer(j++);

        // range [-128, 127] must be interned (JLS7 5.1.7)
        assert IntegerCache.high >= 127;
    }

    private IntegerCache() {}
}
```

源码中的doc已经进行了详细说明

* 缓存在第一次使用时被初始化。
* 缓存支持-128到127之间的自动装箱过程
* 最大值可以通过`XX:AutoBoxCacheMax`修改

## 五、其他缓存的对象

* 有`ByteCache`用于缓存`Byte`对象
* 有`ShortCache`用于缓存`Short`对象
* 有`LongCache`用于缓存`Long`对象
* 有`CharacterCache`用于缓存`Character`对象

`Byte`, `Short`, `Long` 有固定范围: -128 到 127。对于`Character`, 范围是 0 到 127。除了`Integer`以外，这个范围都不能改变。

