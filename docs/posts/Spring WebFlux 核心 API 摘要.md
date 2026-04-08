---
title: Spring WebFlux 核心 API 摘要
date: 2025-04-02
cover: //cdn.smallyoung.cn/article/cover/b5f70113-b186-4069-8f99-fdd687624846.png
category: 后端开发
tags:
  - Spring WebFlux
  - Java
  - 响应式
description: "Spring WebFlux 核心 API 摘要 Spring WebFlux 提供了一个响应式（reactivestack）Web 框架，它是完全非阻塞的，支持响应式流（Reactive Strea"
author: smallyoung
---

Spring WebFlux 提供了一个响应式（reactive-stack）Web 框架，它是完全非阻塞的，支持响应式流（Reactive Streams）的背压（back pressure），并且可以在 Netty、Undertow 以及 Servlet 容器等服务器上运行。它提供了两种主要的编程模型：基于注解（@Controller, @RequestMapping）和函数式端点（Functional Endpoints）。本摘要侧重于函数式端点模型和响应式 WebClient。

## 函数式端点 (Functional Endpoints)

函数式 Web 框架 (`WebFlux.fn`) 提供了一种轻量级的、基于库的方式，使用函数来定义端点。

### `HandlerFunction<T extends ServerResponse>` (处理器函数)

*   **目的:** 处理传入的 HTTP 请求并生成响应。它等同于基于注解的 `@RequestMapping` 方法的方法体。
*   **签名:** 接收一个 `ServerRequest` 对象作为输入，返回一个 `Mono<ServerResponse>`。`Mono` 表示一个包含 0 或 1 个元素的异步序列。
*   **用法:**
    *   这是你编写核心业务逻辑的地方。`HandlerFunction` 通常实现为一个 Lambda 表达式或方法引用。
    *   在函数体内，你可以通过 `ServerRequest` 参数访问请求的详细信息（如路径变量、查询参数、请求头、请求体）。
    *   处理完请求后，你需要构建一个 `ServerResponse` 对象（通常使用 `ServerResponse` 的静态 builder 方法，如 `ok()`, `created()`, `badRequest()` 等），并将其包装在 `Mono` 中返回。
    *   可以使用 `BodyInserters` 工具类来方便地将数据（如普通对象、`Mono`、`Flux`）设置到响应体中。

```java
// HandlerFunction 示例 (概念性)
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import reactor.core.publisher.Mono;

// 假设有一个简单的服务
// MyService myService = ...;

HandlerFunction<ServerResponse> helloHandler = request ->
    ServerResponse.ok() // 返回 200 OK 状态码
        .contentType(MediaType.TEXT_PLAIN) // 设置响应内容类型
        .body(BodyInserters.fromValue("你好, WebFlux!")); // 设置简单的字符串响应体

HandlerFunction<ServerResponse> getUserHandler = request -> {
    String userId = request.pathVariable("id"); // 从路径获取 'id' 参数
    Mono<User> userMono = myService.findUserById(userId); // 调用服务层获取用户 (返回 Mono<User>)
    return ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(userMono, User.class); // 将 Mono<User> 作为响应体
        // 或者处理找不到用户的情况:
        // return userMono.flatMap(user -> ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).bodyValue(user))
        //       .switchIfEmpty(ServerResponse.notFound().build());
};
```

### `RouterFunction<T extends ServerResponse>` (路由函数)

*   **目的:** 将传入的请求路由到相应的 `HandlerFunction`。它充当了 `@RequestMapping` 注解的替代方案。
*   **签名:** 接收一个 `ServerRequest` 对象作为输入，返回一个 `Mono<HandlerFunction<ServerResponse>>`。如果请求与路由的断言（predicate）匹配，则返回对应的处理器函数；否则返回一个空的 `Mono`。
*   **用法:**
    *   用于定义 API 的路由规则。你需要指定请求的匹配条件（称为 `RequestPredicate`），并将这些条件映射到相应的 `HandlerFunction`。
    *   `RequestPredicates` 工具类提供了许多静态方法来创建常用的匹配条件，例如 `GET(path)`, `POST(path)`, `accept(MediaType)`, `contentType(MediaType)` 等。可以组合使用这些条件（如 `and()`, `or()`）。
    *   `RouterFunctions` 工具类提供了流式（fluent）API 来构建路由。最常用的是 `route()` 方法，它允许你链式地定义多个路由规则。`andRoute()` 用于在现有路由基础上添加新规则。
    *   通常将所有路由定义在一个或多个 `@Bean` 方法中，返回一个 `RouterFunction` 实例。

```java
// RouterFunction 示例 (概念性)
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import static org.springframework.web.reactive.function.server.RequestPredicates.*; // 静态导入 RequestPredicates
import static org.springframework.web.reactive.function.server.RouterFunctions.*;   // 静态导入 RouterFunctions

// 假设 helloHandler 和 userHandler 已定义

// 单个路由
RouterFunction<ServerResponse> route = route(
    GET("/hello"), // 匹配 GET /hello 请求
    helloHandler   // 使用 helloHandler 处理
);

// 链式定义多个路由
@Bean // 通常定义为 Spring Bean
public RouterFunction<ServerResponse> userRoutes(UserHandler userHandler) { // 注入 Handler Bean
    return route() // 开始构建路由
        .GET("/users/{id}", accept(MediaType.APPLICATION_JSON), userHandler::getUser) // 匹配 GET /users/{id} 且 Accept 头是 JSON
        .GET("/users", accept(MediaType.APPLICATION_JSON), userHandler::getAllUsers) // 匹配 GET /users 且 Accept 头是 JSON
        .POST("/users", contentType(MediaType.APPLICATION_JSON), userHandler::createUser) // 匹配 POST /users 且 Content-Type 是 JSON
        .build(); // 构建最终的 RouterFunction
}
```

### `ServerRequest` (服务器请求)

*   **目的:** 在函数式模型中代表一个传入的 HTTP 请求。它提供了对请求头、查询参数、路径变量和请求体（作为响应式流，例如 `Mono` 或 `Flux`）的不可变的、JDK 8 友好的访问方式。
*   **用法:**
    *   作为 `HandlerFunction` 的输入参数传入。
    *   使用其方法访问请求的各个部分：
        *   `pathVariable("name")`: 获取路径变量。
        *   `queryParam("name")`: 获取查询参数（返回 `Optional<String>`）。
        *   `queryParams()`: 获取所有查询参数（返回 `MultiValueMap<String, String>`）。
        *   `headers()`: 访问请求头 (`Headers` 对象)。
        *   `bodyToMono(Class<T>)`: 将请求体提取为 `Mono<T>`。
        *   `bodyToFlux(Class<T>)`: 将请求体提取为 `Flux<T>`。
        *   `formData()`: 获取表单数据（返回 `Mono<MultiValueMap<String, String>>`）。

### `ServerResponse` (服务器响应)

*   **目的:** 在函数式模型中代表一个传出的 HTTP 响应。它提供了一个不可变的、流式（fluent）的 builder API 来定义响应状态码、响应头和响应体。
*   **用法:**
    *   由 `HandlerFunction` 返回（包装在 `Mono` 中）。
    *   使用其静态 builder 方法开始构建响应：
        *   `ok()`: 200 OK
        *   `created(URI location)`: 201 Created
        *   `accepted()`: 202 Accepted
        *   `noContent()`: 204 No Content
        *   `badRequest()`: 400 Bad Request
        *   `notFound()`: 404 Not Found
        *   `status(HttpStatus status)` 或 `status(int status)`: 指定任意状态码
    *   链式调用实例方法来设置响应细节：
        *   `contentType(MediaType type)`: 设置 `Content-Type` 响应头。
        *   `header(String name, String... values)`: 添加响应头。
        *   `cookie(ResponseCookie cookie)`: 添加 Cookie。
        *   `body(Publisher<T> publisher, Class<T> elementClass)`: 设置响应体（来自 `Mono` 或 `Flux`）。
        *   `bodyValue(Object body)`: 设置一个简单的对象作为响应体。
        *   `body(BodyInserter<?, ? super ServerHttpResponse> inserter)`: 使用 `BodyInserter` 设置响应体（更灵活）。
    *   最后调用 `build()` (如果需要返回 `Mono<ServerResponse>`) 或者直接返回 builder (如果 `HandlerFunction` 返回 `Mono<ServerResponse>`)。

## 响应式 Web 客户端 (Reactive Web Client)

### `WebClient`

*   **目的:** 一个用于执行 HTTP 请求的非阻塞、响应式客户端。它是传统 `RestTemplate` 的响应式替代品。
*   **用法:**
    *   用于异步调用外部服务或其他端点。
    *   提供流式 API 来定义请求（HTTP 方法、URI、请求头、请求体）并以响应式方式处理响应（例如，将响应体检索为 `Mono` 或 `Flux`）。
    *   创建实例：通常使用 `WebClient.create(baseUrl)` 或 `WebClient.builder()` 进行更详细的配置（如设置超时、过滤器等）。
    *   构建请求：
        *   选择 HTTP 方法：`get()`, `post()`, `put()`, `delete()`, `patch()`, `method(HttpMethod method)`。
        *   指定 URI：`uri("/path/{id}", idValue)` 或 `uri(URI uri)`。
        *   设置请求头：`header(name, value)`, `accept(MediaType...)`, `contentType(MediaType)`。
        *   设置请求体（对于 POST/PUT/PATCH）：`bodyValue(object)`, `body(Publisher<T>, Class<T>)`, `body(BodyInserter<?, ? super ClientHttpRequest>)`。
    *   发送请求并处理响应：
        *   `retrieve()`: 最简单的方式，直接处理响应体。如果状态码是 4xx 或 5xx，会触发错误信号 (`WebClientResponseException`)。
        *   `exchangeToMono(Function<ClientResponse, Mono<T>>)` / `exchangeToFlux(Function<ClientResponse, Flux<T>>)`: 提供对 `ClientResponse` 的完全控制，允许你检查状态码和响应头，并决定如何处理响应体，包括错误处理。
    *   提取响应体：
        *   `bodyToMono(Class<T>)`: 将响应体转换为 `Mono<T>`。
        *   `bodyToFlux(Class<T>)`: 将响应体转换为 `Flux<T>`。

```java
// WebClient 用法示例 (概念性)
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

// 创建 WebClient 实例
WebClient client = WebClient.builder()
    .baseUrl("http://example.org")
    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
    .build();

// 发送 GET 请求并获取单个对象 (Mono)
Mono<UserDetails> userMono = client.get()
    .uri("/users/{id}", 123) // 使用 URI 模板
    .accept(MediaType.APPLICATION_JSON)
    .retrieve() // 发送请求并准备处理响应体
    .bodyToMono(UserDetails.class); // 将响应体转换为 Mono<UserDetails>

userMono.subscribe(
    userDetails -> System.out.println("User: " + userDetails),
    error -> System.err.println("Error fetching user: " + error.getMessage())
);

// 发送 POST 请求并获取响应状态码
Mono<Void> postResultMono = client.post()
    .uri("/users")
    .contentType(MediaType.APPLICATION_JSON)
    .bodyValue(new NewUser("John Doe", "john.doe@example.com")) // 设置请求体
    .retrieve()
    .bodyToMono(Void.class); // 如果只关心成功/失败，可以转换为 Mono<Void>

postResultMono.subscribe(
    null, // 成功时无操作
    error -> System.err.println("Error creating user: " + error.getMessage()),
    () -> System.out.println("User created successfully") // 完成时打印消息
);

// 使用 exchangeToMono 进行更精细的控制
Mono<String> responseMono = client.get()
    .uri("/some/resource")
    .exchangeToMono(response -> {
        if (response.statusCode().is2xxSuccessful()) {
            return response.bodyToMono(String.class);
        } else if (response.statusCode().is4xxClientError()) {
            // 可以记录日志或返回特定的错误 Mono
            return Mono.error(new RuntimeException("Client error: " + response.statusCode()));
        } else {
            return response.createException().flatMap(Mono::error); // 转换为异常
        }
    });

```

## Project Reactor 核心操作符 (Mono / Flux)

`Mono` (0..1 个元素) 和 `Flux` (0..N 个元素) 是 Project Reactor 库的核心类型，WebFlux 建立在其之上。它们都提供了丰富的操作符（方法）来处理异步数据流。以下是一些核心操作符的分类及其用法：

### 1. 创建操作符 (Creating Publishers)

这些操作符用于从各种来源创建 `Mono` 或 `Flux`。

*   **`Mono.just(T data)` / `Flux.just(T... data)`:**
    *   **目的:** 从一个或多个已知的、现有的数据项创建 `Mono` 或 `Flux`。
    *   **用法:** 直接传入数据。`Mono.just` 接收一个元素，`Flux.just` 接收零个或多个元素。
    *   **示例:** `Mono<String> m = Mono.just("Hello");` `Flux<Integer> f = Flux.just(1, 2, 3);`

*   **`Mono.empty()` / `Flux.empty()`:**
    *   **目的:** 创建一个立即完成（onComplete）但**不发出任何数据**的 `Mono` 或 `Flux`。
    *   **用法:** `Mono<Void> m = Mono.empty();` `Flux<Object> f = Flux.empty();`

*   **`Mono.error(Throwable error)` / `Flux.error(Throwable error)`:**
    *   **目的:** 创建一个立即以指定错误（onError）终止的 `Mono` 或 `Flux`。
    *   **用法:** `Mono<String> m = Mono.error(new RuntimeException("Boom!"));`

*   **`Flux.range(int start, int count)`:**
    *   **目的:** 创建一个发出指定范围内连续整数的 `Flux`。
    *   **用法:** `Flux<Integer> f = Flux.range(5, 3);` // 发出 5, 6, 7

*   **`Flux.fromIterable(Iterable<T> it)` / `Flux.fromStream(Stream<T> s)`:**
    *   **目的:** 从 Java 集合（Iterable）或流（Stream）创建 `Flux`。
    *   **用法:** `Flux<String> f = Flux.fromIterable(List.of("a", "b"));`

*   **`Mono.fromCallable(Callable<T> supplier)` / `Mono.fromSupplier(Supplier<T> supplier)`:**
    *   **目的:** 从一个可能抛出受检异常的 `Callable` 或不抛出受检异常的 `Supplier` 延迟地获取值来创建 `Mono`。代码在订阅时执行。
    *   **用法:** `Mono<Long> m = Mono.fromCallable(() -> System.currentTimeMillis());`

*   **`Mono.defer(Supplier<Mono<T>> supplier)` / `Flux.defer(Supplier<Publisher<T>> supplier)`:**
    *   **目的:** 延迟创建 `Mono` 或 `Flux`。每次有新的订阅者时，`Supplier` 都会被调用，从而为每个订阅者创建一个新的实例。这对于确保每次订阅都获得最新的状态或资源非常重要。
    *   **用法:** `Mono<Long> m = Mono.defer(() -> Mono.just(System.currentTimeMillis()));`

*   **`Flux.create(Consumer<FluxSink<T>> emitter)`:**
    *   **目的:** 以编程方式创建 `Flux`，允许你手动调用 `next()`, `error()`, `complete()` 来发出信号。提供了对背压的处理 (`FluxSink`)。
    *   **用法:** 适用于桥接非响应式 API。需要谨慎处理 `FluxSink` 的状态和背压。

### 2. 转换操作符 (Transforming Publishers)

这些操作符用于修改流中的数据或流本身的结构。

*   **`map(Function<T, R>)`:** (已在之前部分详细说明)
    *   同步地将每个元素 `T` 转换为 `R`。

*   **`flatMap(Function<T, Publisher<R>>)`:** (已在之前部分详细说明)
    *   异步地将每个元素 `T` 转换为 `Publisher<R>` (通常是 `Mono` 或 `Flux`)，并将结果扁平化。不保证顺序。

*   **`flatMapSequential(Function<T, Publisher<R>>)` (仅 Flux):**
    *   **目的:** 类似于 `flatMap`，但保证**结果的顺序**与源 `Flux` 中元素的顺序一致。它会按顺序订阅内部 Publisher，但会并发执行它们，最后按原始顺序重新排列结果。
    *   **用法:** 当你需要异步转换且保持原始顺序时使用。

*   **`concatMap(Function<T, Publisher<R>>)` (仅 Flux):**
    *   **目的:** 类似于 `flatMap`，但保证**严格的顺序执行**。它会等待前一个内部 Publisher 完成后，才会订阅并执行下一个。
    *   **用法:** 当你需要按顺序执行异步操作，且后一个操作依赖前一个操作完成时使用。性能通常低于 `flatMap` 和 `flatMapSequential`。

*   **`cast(Class<R> clazz)`:**
    *   **目的:** 将流中的每个元素强制类型转换为指定的类型 `R`。如果转换失败，会发出 `onError` 信号。
    *   **用法:** `Flux<Object> objects = Flux.just(1, "two"); Flux<String> strings = objects.cast(String.class);` // 第二个元素转换成功，第一个失败并报错

*   **`handle(BiConsumer<T, SynchronousSink<R>> handler)`:**
    *   **目的:** 更灵活的同步转换操作，允许基于每个元素进行 1 对 1 的转换、过滤或错误处理。
    *   **用法:** `BiConsumer` 接收当前元素 `T` 和一个 `SynchronousSink<R>`。你可以调用 `sink.next(R)` 发出转换后的元素（最多一次），调用 `sink.complete()` 完成，或 `sink.error(Throwable)` 发出错误。也可以不调用任何方法来过滤元素。

### 3. 过滤操作符 (Filtering Publishers)

这些操作符用于根据条件选择或跳过流中的元素。

*   **`filter(Predicate<T>)`:** (已在之前部分详细说明)
    *   只保留满足 `Predicate` 的元素。

*   **`take(long n)` / `take(Duration duration)`:**
    *   **目的:** 只取流中前 `n` 个元素或在指定 `Duration` 内发出的元素。
    *   **用法:** `Flux.range(1, 10).take(3)` // 发出 1, 2, 3

*   **`skip(long n)` / `skip(Duration duration)`:**
    *   **目的:** 跳过流中前 `n` 个元素或在指定 `Duration` 内发出的元素。
    *   **用法:** `Flux.range(1, 10).skip(7)` // 发出 8, 9, 10

*   **`distinct()` / `distinct(Function<T, V> keySelector)`:**
    *   **目的:** 去除流中重复的元素。默认基于 `equals()` 方法。可以提供 `keySelector` 函数来根据元素的某个属性进行去重。
    *   **用法:** `Flux.just(1, 2, 1, 3, 2).distinct()` // 发出 1, 2, 3

*   **`ignoreElements()`:**
    *   **目的:** 忽略所有正常发出的元素，只关心完成（onComplete）或错误（onError）信号。返回 `Mono<Void>`。
    *   **用法:** 当你只关心某个操作是否成功完成，而不需要其结果时。`someFluxOperation.ignoreElements()`

### 4. 组合操作符 (Combining Publishers)

这些操作符用于将多个 `Mono` 或 `Flux` 合并或组合成一个新的流。

*   **`zip(Publisher<?>... sources)` / `zipWith(Publisher<T2>, BiFunction<T1, T2, R>)`:** (已在之前部分详细说明)
    *   按顺序将多个流的元素配对组合。

*   **`merge(Publisher<?>... sources)` / `mergeWith(Publisher<T> other)`:**
    *   **目的:** 将多个流的元素**交错合并**到一个 `Flux` 中，元素到达的顺序取决于它们在各自源流中发出的时间。
    *   **用法:** `Flux.merge(flux1, flux2)`

*   **`concat(Publisher<?>... sources)` / `concatWith(Publisher<T> other)`:**
    *   **目的:** 按顺序**连接**多个流。只有当前一个流完全结束后，才会订阅并发出下一个流的元素。
    *   **用法:** `Flux.concat(flux1, flux2)` // 先发出 flux1 的所有元素，再发出 flux2 的所有元素

*   **`combineLatest(Publisher<?>... sources, Function<Object[], R> combiner)`:**
    *   **目的:** 当**任何一个**源流发出新元素时，结合**所有源流的最新元素**，并通过 `combiner` 函数生成一个新的结果发出。
    *   **用法:** 适用于需要根据多个输入的最新值进行计算的场景。

### 5. 错误处理操作符 (Error Handling)

这些操作符用于处理流中可能发生的错误。

*   **`onErrorReturn(T fallbackValue)` / `onErrorReturn(Predicate<Throwable>, T fallbackValue)`:**
    *   **目的:** 当发生错误时，用一个**备用的静态值**替换错误信号，然后正常完成流。可以根据错误类型选择性替换。
    *   **用法:** `mono.onErrorReturn("Default Value")`

*   **`onErrorResume(Function<Throwable, Publisher<T>> fallback)`:**
    *   **目的:** 当发生错误时，通过一个 `Function` 提供一个**备用的 `Publisher`** (Mono 或 Flux) 来继续流。这是更灵活的错误恢复方式。
    *   **用法:** `mono.onErrorResume(error -> Mono.just(getDefaultValueFromError(error)))`

*   **`onErrorMap(Function<Throwable, Throwable> mapper)`:**
    *   **目的:** 将原始的错误 `Throwable` 转换为另一种 `Throwable`。
    *   **用法:** 用于包装或转换异常类型。`mono.onErrorMap(IOException.class, e -> new MyCustomException("IO failed", e))`

*   **`retry(long numRetries)` / `retryWhen(Retry retrySpec)`:**
    *   **目的:** 当发生错误时，重新订阅原始流，尝试重新执行。可以指定重试次数或使用更复杂的重试逻辑（如带延迟、指数退避的 `Retry` 策略）。
    *   **用法:** `flux.retry(3)`

*   **`doOnError(Consumer<Throwable> errorConsumer)`:**
    *   **目的:** 在错误发生时执行一个**副作用**操作（如记录日志），但**不处理或改变**错误信号本身。错误会继续向下游传播。
    *   **用法:** `mono.doOnError(e -> log.error("Operation failed", e))`

### 6. 工具/副作用操作符 (Utility / Side-Effect)

这些操作符通常用于观察流的事件、添加延迟或记录日志，而不改变流本身。

*   **`doOnNext(Consumer<T> onNext)`:**
    *   **目的:** 在每个元素发出时执行副作用操作。
    *   **用法:** `flux.doOnNext(item -> System.out.println("Processing: " + item))`

*   **`doOnComplete(Runnable onComplete)`:**
    *   **目的:** 在流成功完成时执行副作用操作。
    *   **用法:** `mono.doOnComplete(() -> System.out.println("Mono completed"))`

*   **`doFinally(Consumer<SignalType> onFinally)`:**
    *   **目的:** 在流终止（无论是成功完成、错误还是取消）时执行副作用操作。
    *   **用法:** `flux.doFinally(signalType -> releaseResource())`

*   **`log()`:**
    *   **目的:** 记录流中发生的所有 Reactor 信号（订阅、请求、发出、完成、错误、取消），通常用于调试。
    *   **用法:** `mono.log()`

*   **`delayElements(Duration delay)` (仅 Flux):**
    *   **目的:** 在发出每个元素之前增加指定的延迟。
    *   **用法:** `Flux.range(1, 3).delayElements(Duration.ofSeconds(1))`

*   **`subscribe(...)`:** (已在之前部分详细说明)
    *   触发流的执行。在 WebFlux 应用中通常由框架调用。

### 7. 阻塞操作符 (Blocking Operators) - 谨慎使用!

这些操作符会阻塞当前线程，直到流发出结果。**在响应式编程（如 WebFlux）的核心流程中应极力避免使用它们**，因为这会破坏非阻塞的特性。它们主要用于测试或桥接阻塞代码。

*   **`block()`:**
    *   **目的:** 阻塞当前线程，直到 `Mono` 发出其元素（或 `Flux` 发出最后一个元素）并返回该元素。如果流为空，则抛出异常。如果流是 `Flux`，只返回最后一个元素。
    *   **用法:** `String result = mono.block();`

*   **`blockOptional()`:**
    *   **目的:** 类似于 `block()`，但如果流为空，则返回 `Optional.empty()` 而不是抛出异常。
    *   **用法:** `Optional<String> result = mono.blockOptional();`

