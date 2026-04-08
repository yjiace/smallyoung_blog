---
title: API接口实现统一格式返回
date: 2021-04-23
cover: //cdn.smallyoung.cn/article/cover/ff2f74ba8d2340b9be43f899ae1bfed6.jpg!/format/webp
category: 后端开发
tags:
  - API
  - 接口
  - 统一格式
description: "一、背景 在移动互联网，分布式、微服务盛行的今天，伴随着项目的复杂性和多客户端性绝大部分都采用的微服务框架，实现了项目的前后端分离方式。保证技术人员各司其职，极大的避免的各自的相互影响。因此对于接口的"
author: smallyoung
---

## 一、背景

在移动互联网，分布式、微服务盛行的今天，伴随着项目的复杂性和多客户端性绝大部分都采用的微服务框架，实现了项目的前后端分离方式。保证技术人员各司其职，极大的避免的各自的相互影响。因此对于接口的返回格式有了新的要求，此时，前端就需要后端统一返回格式，便于前端根据状态码快速定位，解决问题。

## 二、代码实现

### 1、定义状态码枚举类ResultStatus

``` java
package cn.smallyoung.demo.result.util;

import lombok.Getter;

/**
 * @author smallyoung
 */

@Getter
public enum ResultStatus {
    /**
     * 请求成功
     */
    SUCCESS(200, "OK"),

    /**
     * 400
     */
    BAD_REQUEST(400, "Bad Request"),

    /**
     * 401
     */
    UNAUTHORIZED(401, "Unauthorized"),

    /**
     * 403
     */
    FORBIDDEN(403, "Forbidden"),


    /**
     * 系统错误
     */
    INTERNAL_SERVER_ERROR(500, "Internal Server Error");


    /** 业务异常码 */
    private final Integer code;
    /** 业务异常信息描述 */
    private final String message;

    ResultStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

### 2、定义统一返回体类：Result

```java
package cn.smallyoung.demo.result.util;

import lombok.Getter;

import java.io.Serializable;

/**
 * @author smallyoung
 */
@Getter
public class Result<T> implements Serializable {

    private static final long serialVersionUID = -3937755350175676600L;

    private Integer code;

    private String message;

    private T data;

    private Result() { }

    private Result(ResultStatus resultStatus, T data) {
        this.code = resultStatus.getCode();
        this.message = resultStatus.getMessage();
        this.data = data;
    }

    public static <T> Result<T> result(ResultStatus resultStatus, T data) {
        return new Result<T>(resultStatus, data);
    }

    public static Result<Void> success() {
        return result(ResultStatus.SUCCESS, null);
    }

    public static <T> Result<T> success(T data) {
        return result(ResultStatus.SUCCESS, data);
    }

    public static Result<Void> failure() {
        return result(ResultStatus.INTERNAL_SERVER_ERROR, null);
    }

    public static <T> Result<T> failure(T data) {
        return result(ResultStatus.INTERNAL_SERVER_ERROR, data);
    }
}
```
### 3、自定义注解

用于类或方法，指定需要统一格式返回的接口

``` java
package cn.smallyoung.demo.result.interfaces;

import org.springframework.web.bind.annotation.ResponseBody;

import java.lang.annotation.*;

/**
 * @author smallyoung
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@Documented
@ResponseBody
public @interface ResponseResultBody {

}
```

### 4、定义拦截器

拦截请求，是否此请求返回的值需要包装，运行时解析` @ResponseResultBody `注解

``` java
package cn.smallyoung.demo.result.component;

import cn.smallyoung.demo.result.util.Result;
import cn.smallyoung.demo.result.interfaces.ResponseResultBody;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.annotation.Annotation;

/**
 * @author smallyoung
 */
@RestControllerAdvice
public class ResponseResultBodyAdvice implements ResponseBodyAdvice<Object> {

    private static final Class<? extends Annotation> ANNOTATION_TYPE = ResponseResultBody.class;

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), ANNOTATION_TYPE) || returnType.hasMethodAnnotation(ANNOTATION_TYPE);
    }

    @SneakyThrows
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof String || (returnType.getMethod() != null && "java.lang.String".equals(returnType.getMethod().getReturnType().getName()))) {
            ObjectMapper om = new ObjectMapper();
            return om.writeValueAsString(Result.success(body));
        }
        if (body instanceof Result) {
            return body;
        }
        return Result.success(body);
    }

    /**
     * 异常处理
     */
    @ExceptionHandler(value = Exception.class)
    public Result<?> handler(Exception e) {
        return Result.failure(e.getMessage());
    }

}
```

### 5、应用

创建测试Controller（`ResultController`），并添加注解`@ResponseResultBody`

```java
package cn.smallyoung.demo.result;

import cn.hutool.core.lang.Dict;
import cn.smallyoung.demo.result.interfaces.ResponseResultBody;
import cn.smallyoung.demo.result.util.Result;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author SmallYoung
 * @date 2021/4/23
 */
@Controller
@ResponseResultBody
@RequestMapping("/result")
public class ResultController {

    /**
     * 没有返回值
     */
    @GetMapping("noReturn")
    public void noResult(){
        System.out.println("noResult");
    }

    /**
     * String类型的返回值
     */
    @GetMapping("returnString")
    public String returnString(){
        System.out.println("returnString");
        return "resultString";
    }

    /**
     * Result类型的返回值
     */
    @GetMapping("returnResult")
    public Result<Void> returnResult(){
        System.out.println("returnResult");
        return Result.success();
    }

    /**
     * 其他类型的返回值
     */
    @GetMapping("returnObject")
    public Dict returnObject(){
        System.out.println("returnObject");
        return Dict.create().set("test", "test");
    }
}
```

## 三、接口调用

![noReturn](//cdn.smallyoung.cn/article/60827b9ae4b07ec3ca66d64d/1356aa22bff04daa88bf1adcc1c7accc.png!/format/webp)

![returnString](//cdn.smallyoung.cn/article/60827b9ae4b07ec3ca66d64d/8e5ae97aa8654718ad1cf0cc9969cdb8.png!/format/webp)

![returnResult](//cdn.smallyoung.cn/article/60827b9ae4b07ec3ca66d64d/48d5b1f513c948bdacc37f953be6a5f8.png!/format/webp)

![returnObject](//cdn.smallyoung.cn/article/60827b9ae4b07ec3ca66d64d/32e73f84a45c4c64b4e44ccefefe4d4d.png!/format/webp)

## 四、注意

在拦截器 `ResponseResultBodyAdvice` 中，需要对原返回数据结构的类型判断

```java
if (body instanceof String || (returnType.getMethod() != null && "java.lang.String".equals(returnType.getMethod().getReturnType().getName()))) {
    ObjectMapper om = new ObjectMapper();
    return om.writeValueAsString(Result.success(body));
}
if (body instanceof Result) {
    return body;
}
return Result.success(body);
```

* 对`Result`类型的判断，避免重复嵌套
* 对`String`类型的判断，避免程序 `cannot be cast to java.lang.String` 错误

![cannot be cast to java.lang.String](//cdn.smallyoung.cn/article/60827b9ae4b07ec3ca66d64d/b04898c7c62d46748aab4ba3db091c44.png!/format/webp)


