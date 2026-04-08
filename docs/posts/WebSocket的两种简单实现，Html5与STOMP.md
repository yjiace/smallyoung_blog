---
title: WebSocket的两种简单实现，Html5与STOMP
date: 2017-12-18
cover: //cdn.smallyoung.cn/article/cover/234f2482daf44f39ad731a0c7c975640.jpg!/format/webp
category: 前端
tags:
  - WebSocket
  - Stomp
description: "一、概述 WebSocket 是通过一个socket来实现双工异步通信的功能，即浏览器可以向服务端发送消息，服务端也可以向浏览器发送消息。但是直接使用WebSocket 或者SocketJs（WebS"
author: smallyoung
---

## 一、概述

`WebSocket` 是通过一个`socket`来实现双工异步通信的功能，即浏览器可以向服务端发送消息，服务端也可以向浏览器发送消息。但是直接使用`WebSocket` 或者`SocketJs`（WebSocket协议的模拟），增加了当浏览器不支持`WebSocket`的时候的兼容支持。本文以HTML5规范中的`WebSocket API`、WebSocket的子协议`STOMP`作为演示。STOMP是一个更高级的协议，它使用一个基于帧（frame）的格式来定义消息，与HTTP的request和response类似。

> 本演示以Spring Boot搭建的项目

## 二、HTML5的实现

### 1、添加Jar包依赖

``` xml
<dependency>
	<groupId>javax</groupId>
	<artifactId>javaee-api</artifactId>
	<version>7.0</version>
	<scope>provided</scope>
</dependency>
```
### 2、html5页面

``` html
<!DOCTYPE HTML>
<html>
<head>
    <title>Html5 标签演示WebSocket</title>
</head>

<body>
Welcome<br/>
<input id="text" type="text" /><button onclick="send()">发送</button>    <button onclick="closeWebSocket()">关闭</button>
<div id="message">
</div>
</body>

<script type="text/javascript">
    var websocket = null;

    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        websocket = new WebSocket("ws://localhost:8080/websocket");
    }
    else{
        alert('对不起，您的浏览器不支持websocket')
    }

    //连接发生错误的回调方法
    websocket.onerror = function(){
        setMessageInnerHTML("error");
    };

    //连接成功建立的回调方法
    websocket.onopen = function(event){
        setMessageInnerHTML("open");
    }

    //接收到消息的回调方法
    websocket.onmessage = function(event){
        setMessageInnerHTML(event.data);
    }

    //连接关闭的回调方法
    websocket.onclose = function(){
        setMessageInnerHTML("close");
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
        websocket.close();
    }

    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML){
        document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }

    //关闭连接
    function closeWebSocket(){
        websocket.close();
    }

    //发送消息
    function send(){
        var message = document.getElementById('text').value;
        websocket.send(message);
    }
</script>
</html>
```

### 3、项目配置项

``` java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfig {
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}
```

### 4、后台控制层实现代码

``` java
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/websocket")
@Component
public class MyWebSocket {

    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;
    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<MyWebSocket> webSocketSet = new CopyOnWriteArraySet<MyWebSocket>();
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    /**
     * 连接建立成功调用的方法*/
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        System.out.println("有新连接加入！当前在线人数为" + getOnlineCount());
        try {
            sendMessage("测试");
        } catch (IOException e) {
            System.out.println("IO异常");
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        subOnlineCount();           //在线数减1
        System.out.println("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("来自客户端的消息:" + message);

        //群发消息
        for (MyWebSocket item : webSocketSet) {
            try {
                item.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


     public void onError(Session session, Throwable error) {
        System.out.println("发生错误");
        error.printStackTrace();
     }


     public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
     }


     /**
      * 群发自定义消息
      * */
    public static void sendInfo(String message) throws IOException {
        for (MyWebSocket item : webSocketSet) {
            try {
                item.sendMessage(message);
            } catch (IOException e) {
                continue;
            }
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        MyWebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        MyWebSocket.onlineCount--;
    }
}
```

## 二、Spring Boot中使用WebSocket。

### 1、添加Jar包依赖（主要是Thymeleaf和Websocket）

``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 2、项目配置项


``` java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * 配置WebSocket,需要在配置类上使用@EnableWebSocketMessageBroker开启WebSocket支持
 * @EnableWebSocketMessageBroker注解同时会开启使用STOMP协议来传输基于代理（message broker）用的消息，
 * 这时控制器支持使用@MessageMapping，就像使用@RequestMapping一样。
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    /**
     * 注册STOMP协议的节点（endpoint）并映射指定的URL
     * @param registry
     */
    public void registerStompEndpoints(StompEndpointRegistry registry){
        //注册一个STOMP的endpoint，并指定使用SockJs协议
        registry.addEndpoint("/endpointWisely").withSockJS();
    }

    /**
     * 配置消息代理类
     * @param registry
     */
    public void configureMessageBroker(MessageBrokerRegistry registry){
        //广播式应配置一个/topic消息代理
        registry.enableSimpleBroker("/topic");
    }
}
```

### 3、后台控制层实现代码

``` java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class WebSocketController {

    /**
     * 当浏览器向服务端发送请求时，通过@MessageMapping映射/welcome这个地址，类似于@RequestMapping
     * 当服务端有消息时，会对订阅了@SendTo中的路径的浏览器发送消息
     * @param msg
     * @return
     */
    @MessageMapping("/welcome")
    @SendTo("/topic/getResponse")
    public String say(String msg){
        return msg;
    }
}
```

### 4、Thymeleaf模板页面

``` html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8"/>
    <title>SocketJs演示WebSocket</title>
</head>
<body onload="disconnect()">
<div>
    <div>
        <button id="connect" onclick="connect();">连接</button>
        <button id="disconnect" disabled="disabled" onclick="disconnect();">断开连接</button>
    </div>

    <div id="conversationDIV">
        <label>输入你的名字</label>
        <input type="text" id="name"/>
        <button id="sendName" onclick="sendName();">发送</button>
        <p id="response"></p>
    </div>

</div>
<script th:src="@{https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js}"></script>
<script th:src="@{https://cdn.bootcss.com/sockjs-client/1.1.4/sockjs.min.js}"></script>
<script th:src="@{https://cdn.bootcss.com/stomp.js/2.3.3/stomp.js}"></script>
<script type="text/javascript">
    var stompClient = null;

    function setConnected(connected){
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDIV').style.visibility = connected ? 'visible':'hidden';
        $('#response').html();
    }

    function connect(){
        //链接Socket的endpoint名称为endpointWisely
        var socket = new SockJS('/endpointWisely');
        //使用STOMP子协议的WebSocket客户端
        stompClient = Stomp.over(socket);
        //链接WebSocket服务端
        stompClient.connect({},function (frame) {
            setConnected(true);
            console.log('Connected:' + frame);
            //通过stompClient.subscribe订阅/topic/getResponse目标发送的消息，即控制器中的@SendTo
            stompClient.subscribe('/topic/getResponse',function (response) {
                showResponse(JSON.parse(response.body));
            });
        });
    }

    function disconnect(){
        if(stompClient != null){
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnecteed");
    }

    function sendName(){
        var name = $('#name').val();
        stompClient.send("/welcome",{},name);
    }

    function showResponse(message){
        $('#response').append($('#response').val() + message + '<br/>');
    }

</script>
</body>
</html>
```