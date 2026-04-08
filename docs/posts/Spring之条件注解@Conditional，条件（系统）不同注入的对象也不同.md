---
title: Spring之条件注解@Conditional，条件（系统）不同注入的对象也不同
date: 2017-12-14
cover: //cdn.smallyoung.cn/article/cover/8792e89bdd904bc9bbdce5ea487a31a7.jpg!/format/webp
category: 后端开发
tags:
  - Spring
  - 注入
description: "一、概述 条件注解，可以根据不同的条件来做出不同的事情。在Spring中条件注解可以说是设计模式中状态模式的一种体现方式，同时也是面向对象编程中多态的应用部分。 在Spring框架中，当我们使用条件注"
author: smallyoung
---

## 一、概述

**条件注解**，可以根据不同的条件来做出不同的事情。在Spring中条件注解可以说是设计模式中状态模式的一种体现方式，同时也是面向对象编程中多态的应用部分。

在Spring框架中，当我们使用条件注解时，我们会为每种独立的条件创建一个类，根据这个类对应的条件的成立情况我们来选择不同的任务来执行。当然我们在声明任务时，一般使用接口来声明。因为我们会在Spring的配置类中指定具体条件下的具体类。接下来，我们将来看一下Spring框架中@Conditional注解的具体使用方式。

本次演示，我们将根据操作系统的不同，寻找对应系统的Tomcat的存储目录，并执行Tomcat的启动操作。

1. windows环境：win10系统，Tomcat目录地址：D:\apache-tomcat-7.0.78\bin；
2. Linux环境：Ubuntu14系统，Tomcat目录地址：/myweb/apache-tomcat-9.0.0.M26/bin;

## 二、创建常量

创建常量类`ConfigUtil`，以便常量的管理。

``` java
/**
 * 常量配置类
 */
public class ConfigUtil {

    public final static String LINUX_TOMCAT_PATH = "/myweb/apache-tomcat-9.0.0.M26/bin/";

    public final static String WIN_TOMCAT_PATH = "D:\apache-tomcat-7.0.78\bin\";

    public final static String STARTUP_BAT = "startup.bat";

    public final static String STARTUP_SH = "startup.sh";

    public final static String SHUTDOWN_BAT = "shutdown.bat";

    public final static String SHUTDOWN_SH = "shutdown.sh";

}
```

## 三、创建接口

创建对应的`Service`接口`TomcatService`。

``` java
public interface TomcatService {

    /**
     * 获取tomcat启动文件路径
     * @return
     */
    String getTomcatStartupPath();

    /**
     * 获取tomcat停止文件路径
     * @return
     */
    String getTomcatShutdownPath();

}
```

## 四、创建实现类

创建`Service`接口的不同实现类`WindowsTomcatServiceImpl`、`LinuxTomcatServiceImpl`；

### 1、LinuxTomcatServiceImpl

``` java
public class LinuxTomcatServiceImpl implements TomcatService {

    /**
     * 获取tomcat启动文件
     * @return
     */
    @Override
    public String getTomcatStartupPath() {
        return ConfigUtil.LINUX_TOMCAT_PATH + ConfigUtil.STARTUP_SH;
    }

    /**
     * 获取tomcat停止文件
     * @return
     */
    public String getTomcatShutdownPath(){
        return ConfigUtil.WIN_TOMCAT_PATH + ConfigUtil.SHUTDOWN_SH;
    }

}
```

### 2、WindowsTomcatServiceImpl

``` java
public class WindowsTomcatServiceImpl implements TomcatService {

    /**
     * 获取tomcat启动文件
     * @return
     */
    @Override
    public String getTomcatStartupPath() {
        return ConfigUtil.WIN_TOMCAT_PATH + ConfigUtil.STARTUP_BAT;
    }

    /**
     * 获取tomcat停止文件
     * @return
     */
    public String getTomcatShutdownPath(){
        return ConfigUtil.WIN_TOMCAT_PATH + ConfigUtil.SHUTDOWN_BAT;
    }
}
```

## 五、创建注解条件类

创建完`Service`接口及其实现类后，需要创建`@Conditional`注解所需的条件类。每个条件类对应着一种独立的情况，在`Spring`中的条件类需要实现`Condition`接口。下方是我们创建的两个条件类`WindowsCondition`、`LinuxCondition`。

### 1、LinuxCondition

``` java
public class LinuxCondition implements Condition {

    public boolean matches(ConditionContext context , AnnotatedTypeMetadata metadata){
        return context.getEnvironment().getProperty("os.name").contains("Linux");
    }
}
```

### 2、WindowsCondition

``` java
public class WindowsCondition implements Condition {

    public boolean matches(ConditionContext context , AnnotatedTypeMetadata metadata){
        return context.getEnvironment().getProperty("os.name").contains("Windows");
    }
}
```

## 六、关联

Service的接口、Service的类以及相应的条件创建完毕后，接下来我们就该在Java的配置类中将条件类与Service类对象进行关联了。

``` java
@Configuration
public class ConditionConfig {

    @Bean
    @Conditional(WindowsCondition.class) //指定条件类
    public TomcatService windowsListService(){
        return new WindowsTomcatServiceImpl();
    }


    @Bean
    @Conditional(LinuxCondition.class) //指定条件类
    public TomcatService linuxListService(){
        return new LinuxTomcatServiceImpl();
    }
}
```

## 七、测试，使用main方法测试。

``` java
@SpringBootApplication
public class MyserviceApplication {

	public static void main(String[] args) {
		
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(ConditionConfig.class);

		TomcatService listService = context.getBean(TomcatService.class);

		System.out.println(listService.getTomcatShutdownPath());

	}
}
```

最终打印出我们在windows下的执行结果

![执行结果](//cdn.smallyoung.cn/article/5fda8a6ee4b0b655d86e8de4/8a9095d00b764dc68236fed3b6f7726c.png)

## 八、执行命令

使用Runtime执行Tomcat的启动或停止命令（项目已通过Spring boot搭建为web项目，可通过路径访问执行操作，已忽略test测试）。

``` java
@Controller
@RequestMapping("/operation")
public class OperationController {

    @Resource
    private TomcatService tomcatService;

    /**
     * 启动Tomcat
     * @return
     */
    @RequestMapping(value = "/startup")
    @ResponseBody
    public boolean startup(){
        String command = tomcatService.getTomcatStartupPath();
        return callCommand(command);
    }


    /**
     * 停止Tomcat
     * @return
     */
    @RequestMapping(value = "/shutdown")
    @ResponseBody
    public boolean shutdown(){
        String command = tomcatService.getTomcatShutdownPath();
        return callCommand(command);
    }

    /**
     * 执行命令
     */
    private static boolean callCommand(String command){
        boolean isok = false;
        String content = "";
        try {
            //返回与当前的Java应用相关的运行时对象
            Runtime runtime = Runtime.getRuntime();
            //指示Java虚拟机创建一个子进程执行指定的可执行程序，并返回与该子进程对应的Process对象实例
            Process process = runtime.exec(command);
            //运行垃圾回收器
            runtime.gc();
            String line;
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            while((line = br.readLine()) != null) {
                content += line + "
";
            }
            isok = true;
        } catch (IOException e) {
            System.out.println("执行命令时出错：" + e.getMessage());
        }
        System.out.println(content);
        return isok;
    }

}
```

在执行时，需要将Tomcat的路径添加到环境变量中，如果发现没有启动Tomcat，并且控制台打印如下信息：

![启动Tomcat错误信息](//cdn.smallyoung.cn/article/5fda8a6ee4b0b655d86e8de4/78e356eb342f49aeb587e5db185768d0.png)

这时我们需要将CATALINA_HOME配置到环境变量中。

![配置环境变量](//cdn.smallyoung.cn/article/5fda8a6ee4b0b655d86e8de4/0dc1636de26c45cd8eff167d628c578a.png)



