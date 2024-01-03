---
sidebar_label: "time.time() vs time.monotonic()"
title: "使用 Python 处理时间：time.time() vs time.monotonic()"
description: "介绍 Python 中获取时间函数 time.time() 与 time.monotonic() 的区别，以及时间同步与时钟的相关概念。"
---

在写 TiDB Cloud 的 Python SDK 时，我需要实现一个等待集群创建成功的函数 [`wait_for_available()`](https://github.com/Oreoxmt/tidbcloudy/blob/6ecac49ce60e47872b573f3619b7097a5c18f5c0/tidbcloudy/cluster.py#L56-L70)
，以便用户等待集群变为可用状态。这个函数需要计算集群创建所花费的时间，并在超过用户设置的超时时间时抛出异常。这是一个常见的计算时间差的场景。可以通过记录集群创建的开始时间、获取当前时间，然后计算与开始时间开始时间的差值来实现该功能。伪代码如下：

```python
start_time = GetCurrentTime()
while True:
    current_time = GetCurrentTime()
    duration = current_time - start_time
    if duration > timeout:
        raise TimeoutError
    if cluster.status == "AVAILABLE":
        break
```

<!--truncate-->

## Python 中获取当前时间的函数

在 Python 中，获取当前时间的函数有很多，例如 `time.time()`、`time.monotonic()`、`datetime.datetime.now()` 等。那在这个场景应该选择哪个函数来获取时间并计算时间差呢？

### `time.time()`

:::info quote

Return the **time in seconds since the epoch** as a floating point number. The handling of leap seconds is platform dependent. On Windows and most Unix systems, the **leap seconds are not counted** towards the time in seconds since the epoch. This is commonly referred to as **Unix time**.

Note that even though the time is always returned as a floating point number, not all systems provide time with a better precision than 1 second. While this function normally returns non-decreasing values, it can **return a lower value than a previous call if the system clock has been set back between the two calls**.

—— [Python 官方文档](https://docs.python.org/3/library/time.html#time.time)

:::

根据上面文档的描述，[`time.time()`](https://docs.python.org/3/library/time.html#time.time) 有以下特点：

- 返回的是从 epoch 到当前时间的秒数，即 Unix 时间戳
- 由于平台的不同，可能会忽略闰秒 (leap second)
- 返回的值可能会比上次调用获得的值小，这是因为系统时间可能会被回拨

下面是一个使用 `time.time()` 获取当前时间的例子：

```python
import time

print(time.time())
# 1678526843.67069
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>

在计算时间差的场景时，如果使用 `time.time()`，那么计算的时间差可能不准确，甚至可能出现负数，具体原因可以参考[日历时钟](#日历时钟-time-of-day-clock)。

### `time.monotonic()`

:::info quote

Return the value (in fractional seconds) of a **monotonic clock**, i.e. **a clock that cannot go backwards**. The clock is not affected by system clock updates. The reference point of the returned value is undefined, so that only the difference between the results of two calls is valid.

—— [Python 官方文档](https://docs.python.org/3/library/time.html#time.monotonic)

:::

根据上面文档的描述，[`time.monotonic()`](https://docs.python.org/3/library/time.html#time.monotonic) 有以下特点：

- 返回的是一个[单调时钟 (monotonic clock)](#单调时钟-monotonic-clock) 的值，即值不会减小
- 返回的值本身没有意义
- 只有两次调用的差值才有意义

下面是一个使用 `time.monotonic()` 获取当前时间的例子：

```python
import time

print(time.monotonic())
# 672615.062683958
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>

在计算时间差的场景时，使用 `time.monotonic()` 可以保证计算的时间差不会出现负数，具体原因可以参考[单调时钟](#单调时钟-monotonic-clock)。

### `datetime.datetime.now()`

[`datetime.datetime.now()`](https://docs.python.org/3/library/datetime.html#datetime.datetime.now) 返回的是一个 `datetime` 对象，下面是一个例子：

```python
import datetime

print(datetime.datetime.now())
# 2023-03-11 17:33:59.999052
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>

在计算时间差的场景时，使用 `datetime.datetime.now()` 计算的时间差是 `timedelta` 对象，是更人类友好的时间差表示方式。但是 `datetime.datetime` 采用的是日历时钟，因此计算的时间差可能不准确，具体原因可以参考[日历时钟](#日历时钟-time-of-day-clock)。

## 时间同步与时钟

下面介绍一些与时间同步和时钟相关的概念，以便更好地理解 `time.time()` 与 `time.monotonic()` 的区别。

关于时间同步更详细的内容，可以参考 [Concurrent and Distributed Systems Lecture 3](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/)。

### 网络时间协议 (NTP)

NTP (Network Time Protocol) 是一种网络时间协议，用于同步多台机器的时间。NTP 服务器会定期向客户端发送时间戳，客户端会根据时间戳来调整自己的时间。NTP 能够提供相对精确的时间同步，以确保多台机器之间的时间保持一致。

例如，在 macOS 上，你可以在 **System Preferences** > **Date & Time** > **Source** 中设置 NTP 服务器。

![Set time source on macOS](/img/macos-set-time-source.png)

### 日历时钟 (time-of-day clock)

日历时钟通常返回基于 1970/1/1 epoch 以来的秒数或毫秒数。

在使用 NTP 同步时，日历时钟存在很多**不确定性**。如果客户端与 NTP 服务器的时间出现偏差，那么系统会尝试缓慢调整日历时钟，以使其与 NTP 服务器的时间保持一致。但是，如果客户端与 NTP 服务器的时间偏差过大（例如在 `[125ms, 1000s)` 范围内），系统会直接重置日历时钟，这会导致时钟回拨。

### 单调时钟 (monotonic clock)

单调时钟通常返回从系统启动以来的秒数或毫秒数，其数值不会减小。因此，单调时钟的数值本身没有意义，也不能比较不同机器上的单调时钟的数值。

单调时钟不会回拨，因此计算时间间隔更加准确。当 NTP 服务器时间与系统时间存在偏差时，NTP 服务器只会**调整单调时钟的频率**，而不是直接回拨。

## 总结

### 程序设计中时间的处理

在处理**时间戳**时，通常需要进行以下两种操作：

- 计算时间间隔：例如计算函数的执行时间。这种情况下，为了保证计算的准确性，应该使用单调时钟，例如 Python 中的 `time.monotonic()` 或 `time.monotonic_ns()`。
- 获取时间点：例如获取当前时间。这种情况下，为了确保获取的时间是真实的时间，应该使用日历时钟，例如 Python 中的 `time.time()` 或 `time.time_ns()`。

在处理**业务逻辑**时，通常需要对时间进行复杂的转换，例如将时间戳转换为日期字符串、不同时区之间的时间转换等。这种情况下，可以使用 Python 中的 `datetime` 模块。

另外，在程序中处理时间相关**变量**时，为了避免出现时间单位的混乱，可以在变量名中加上时间单位，例如 `timeout_in_seconds`。

### 日历时钟与单调时钟

| | 日历时钟 | 单调时钟 |
| --- | --- | --- |
| 示例值 | `1678526843.67069` | `672615.062683958` |
| 适用场景 | 获取当前时间 | 计算时间间隔 |
| 数值含义 | 从某个时间点（如 epoch）到当前时间的秒数 | 从任意时间点（如机器启动）到当前时间的秒数 |
| 数值比较 | 可以跨机器比较时间 | 不适合跨机器比较时间 |
| 时钟回拨 | 可能出现 | 不会出现 |
| 单调性 | 不保证 | 保证 |
| Python 函数 | `time.time()` | `time.monotonic()` |
