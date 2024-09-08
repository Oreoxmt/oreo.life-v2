---
layout: post
title: 读书笔记：2-关于 MapReduce
date: 2021-01-20 09:09:54
tags:
- Start with Me
- Book
categories:
- Reading
---

《Hadoop 权威指南》读书笔记第二篇带你初步了解一下 MapReduce

<!-- more -->

# 2 关于 MapReduce

> MapReduce 是一种可用于数据处理的编程模型，该模型比较简单，但要想写出有用的程序却不太容易。

Hadoop 可以运行各种语言版本的 MapReduce 程序，如：Java、Ruby、Python。书中提供了以上三种不同语言的代码，因为 Python 是最短的，其他的也看不懂，所以就选择用 Python 来进行实际操作啦。

MapReduce 本质上是并行运行的，因此可以将**大规模的数据**分析任务分发给任何一个拥有足够多机器的数据中心

# 2.1 气象数据集

> 分布在全球各地的很多气象传感器每隔一小时收集气象数据和收集大量日志数据，这些数据是半结构化的，而且是按照记录方式存储的，因此非常适合用 MapReduce 来分析

## 数据格式

- 数据来源：NCDC [美国国家气候数据中心](http://www.ncdc.noaa.gov/)  (*National Climatic Data Center*)
- 数据格式：每个文件按行以 ASCII 格式存储，其中每一行是一条记录
- 原始数据示例

    ```
    0067011990999991950051507004+68750+023550FM-12+038299999V0203301N00671220001CN9999999N9+00001+99999999999
    0043011990999991950051512004+68750+023550FM-12+038299999V0203201N00671220001CN9999999N9+00221+99999999999
    0043011990999991950051518004+68750+023550FM-12+038299999V0203201N00261220001CN9999999N9-00111+99999999999
    0043012650999991949032412004+62300+010750FM-12+048599999V0202701N00461220001CN0500001N9+01111+99999999999
    0043012650999991949032418004+62300+010750FM-12+048599999V0202701N00461220001CN0500001N9+00781+99999999999
    ```

- 以一行数据为例说明其格式

    ```yaml
    [0:4]        0067
    [4:10]       011990      # USAF weather station identifier
    [10:15]      99999
    [15:23]      19500515    # 观测日期
    [23:27]      0700        # 观测时间
    [27:28]      4
    [28:34]      +68750      # 纬度(1000°)
    [34:41]      +023550     # 经度(1000°)
    [41:46]      FM-12
    [46:51]      +0382       # 海拔(m)
    [51:56]      99999
    [56:60]      V020
    [60:63]      330         # 风向(度)
    [63:64]      1           # 质量代码
    [64:65]      N
    [65:69]      0067
    [69:70]      1
    [70:75]      22000       # 天顶高度(m)
    [75:76]      1           # 质量代码
    [76:77]      C
    [77:78]      N
    [78:83]      999999      # 可见度(m)
    [84:85]      9           # 质量代码
    [85:86]      N
    [86:87]      9
    [87:92]      +0000       # 空气温度(10℃)
    [92:93]      1           # 质量代码
    [93:98]      +9999       # 露点温度(10℃)
    [98:99]      9
    [99:104]     99999       # 气压(10hPa)
    [104:105]    9           # 质量代码
    ```

> Q：在这个数据集中，每年全球气温的最高记录是多少？

# 2.2 使用 Unix 工具来分析数据

先使用传统的按行存储数据的工具 `awk` 提供性能基准和结果检查，再和 Hadoop 进行对比

`*awk` 是一个编程语言，和 Python 一样，只不过它比较方便在命令行里使用，而且文本处理的能力非常强，所以非常适合在这种场景里使用*

### 编写脚本

目标：计算每年的最高气温

划重点：每年 + 最高气温

`max_temperature.sh`

```bash
#!/usr/bin/env bash
for year in all/*
do
  echo -ne `basename $year .gz`"\t"
  gunzip -c $year | \
    awk '{ temp = substr($0, 88, 5) + 0;
           q = substr($0, 93, 1);
           if (temp !=9999 && q ~ /[01459]/ && temp > max) max = temp }
         END { print max }'
done
```

### 简单翻译

凭借着瞎猜大概解释一下上述代码的功能

循环遍历按年压缩的数据文件并处理

- 读取 `all` 下的文件，如 : year → 1901.gz

    当前目录文件夹 `all` 中存放的是多个气象数据的打包文件，如: `1901.gz`  `1902.gz`

- 显示年份

    `echo -ne `basename $year.gz`"\t"`

    - echo 是显示函数

        通过 `man echo` 查看其功能，其中`-n`  不输出尾随换行符 ;  `-e` 启用反斜杠转义

        ```
        Echo the STRING(s) to standard output.
               -n     do not output the trailing newline
               -e     enable interpretation of backslash escapes
        ```

    - basename 移除 `.gz` 的后缀

        通过 `man basename` 查看其功能及示例可以发现，上述是为了实现移除路径，只保留文件名

        ```bash
        basename - strip directory and suffix from filenames
        Print NAME with any leading directory components removed.
        If specified, also remove a trailing SUFFIX.

        EXAMPLES
               basename /usr/bin/sort
                      -> "sort"
               basename include/stdio.h .h
                      -> "stdio"
               ****basename -s .h include/stdio.h
                      -> "stdio"
               basename -a any/str1 any/str2
                      -> "str1" followed by "str2"
        ```

    - 所以，最后的显示的结果是 `1901`
- 使用 `awk` 处理每一个文件
    - 从数据中提取两个字段：气温 `temp`、质量代码 `q`
    - 气温提取与转换

        `temp = substr($0, 88, 5) + 0`

        从第0个字段里的第88个字符开始，截取5个字符结束（substr的功能看起来和数据库中的功能是相似的，也相对容易理解）

        字符串类型的温度值加 0 后被 awk 转义成整数进行计算

        转换示例

        - `-0161` → `-161`
        - `+0006` → `6`
    - 质量代码提取

        `q = substr($0, 93, 1)`

        质量无问题的代码：0、1、4、5、9

    - 最高气温的计算

        `if (temp !=9999 && q ~ /[01459]/ && temp > max) max = temp`

        这里的 `q ~ /[01459]/` 的意思是，变量 `q` 满足正则表达式 `[01459]`

        如果温度是有效的（9999表示缺失值）、质量代码是无错误的，如果当前读取的温度>原先的最大值，就替换目前的最大值

    - 处理完一个文件的所有行，执行 `END`  输出最高气温

### 运行

确保脚本文件与 `all` 文件在同一目录下

`./max_temperature.sh`

### 结果

```
1901    317
1902    244
```

在 2.1 中有说明，温度的单位是 10℃，因而实际上 1901 年的最高气温为31.7℃

> 使用亚马逊的 EC2 High-CPU Extra Large Instance 运行这个程序，只需要 42 分钟就可以处理完一个世纪的气象数据，找出最高气温。

为了加快处理速度，需要通过并行处理程序来进行数据分析，理论上来说很简单，只需要用计算机上所有可用的硬件线程，每个线程处理不同年份的数据，但是仍然会有一些问题。

### 并行处理存在的问题

- 任务怎么划分为大小相同的作业？
    - 不同年份数据文件的大小差异很大，如果按照年份文件进行划分，那么有一部分线程总会比其他线程更早地结束运行，总的运行时间取决于处理最长文件所需要的时间。
    - 更好的方法是将数据分为**固定大小的块**，然后每块分到各个进程去执行
- 如何合并每个独立进程的运行结果？
    - 在计算每年最高温度时，如果某年的数据被分为多个块，那么需要对每个块的最高气温进行记录，最终将多个块的同一年数据的最高气温作为该年的最高温度。
- 受限于单台计算机的处理能力

# 2.3 使用 Hadoop 来分析数据

> 为了充分利用 Hadoop 提供的并行处理优势，我们需要将查询表示成 MapReduce 作业。

MapReduce 任务分为两个处理阶段：map 阶段和 reduce 阶段，每个阶段都以**键-值对**作为输入和输出

重要的是，你要写两个函数：map 函数和 reduce 函数

以气象数据为例

[map and reduce](https://www.notion.so/6da36aaa63f843649eb9647d20e41a75)

# 2.4 Python 版本实现

本次运行环境 ：Ubuntu 20.04

代码：气象数据的 Python 脚本在 `[ch02-mr-intro/src/main/python/](https://github.com/tomwhite/hadoop-book/tree/master/ch02-mr-intro/src/main/python)` 中，测试文件在 `[input/ncdc/](https://github.com/tomwhite/hadoop-book/tree/master/input/ncdc)` 中

## Linux Shell

首先，当然是 ... cd 到当前目录

因为原 Python 文件为 python2 版本，因而需要使用 `2to3` 将其转换为 python3 版本

### 2to3

点击[这里](https://docs.python.org/3/library/2to3.html#)查看详细文档

- 安装

    `sudo apt update`

    `sudo apt install 2to3`

- 使用

    `2to3 xxx.py`

    `2to3 -w xxx.py`

### Python 文件

将原文件中 `/usr/bin/env python` 修改为 `/usr/bin/env python3`

*为什么要有 shebang line ？*

*因为 Linux 里的后缀名是无意义的，不像 Windows，`.py` 结尾的就会用 Python 执行，所以必须有这么一行来告诉操作系统，这是个 Python 脚本*

以下是转换后的 Python3 版本，并将输出改成了 `f-string` ，应该不需要翻译 ......

`max_temperature_map.py`

```python
#!/usr/bin/env python3
import re
import sys

for line in sys.stdin:
    val = line.strip()
    year, temp, q = val[15:19], val[87:92], val[92:93]
    if (temp != "+9999" and re.match("[01459]", q)):
        print(f"{year}\t{temp}")
```

map 函数实现的是获取年份和温度，其中使用了正则表达式确认质量代码 `q` 是没有问题的

`max_temperature_reduce.py`

```python
#!/usr/bin/env python3

import sys

# (last_key, max_val) = (None, -sys.maxsize)
last_key, max_val = None, -sys.maxsize

for line in sys.stdin:
    key, val = line.strip().split("\t")
    if last_key and last_key != key:
        print(f"{last_key}\t{max_val}")
        last_key, max_val = key, int(val)
    else:
        last_key, max_val = key, max(max_val, int(val))

if last_key:
    print(f"{last_key}\t{max_val}")
```

reduce 函数实现的是计算每一年的最高温度

### 测试程序

```bash
cat input/ncdc/sample.txt | \
pipe> ch02-mr-intro/src/main/python/max_temperature_map.py | \
pipe pipe> sort | ch02-mr-intro/src/main/python/max_temperature_reduce.py
```

### 简单翻译

- 注意
    - Linux 下的路径分割符是 `/` 不能用 `\`
    - `|` 是管道 pipe 符号，作用是把上一个程序的 `stdout` 传输到下一个程序的 `stdin`
    - `\` 是换行转义符，相当于告诉命令行，”我这行代码还没写完，你要继续读下去“
- 第一行，输出原始数据

    `cat input/ncdc/sample.txt`  把 `sample.txt` 的内容输出到屏幕上

- 第二行，获取年代和气温

    `ch02-mr-intro/src/main/python/max_temperature_map.py` 是执行这个 .py 程序，输出每一行文本的年代及气温

- 第三行，计算每年最高气温

    `sort` 把从 `stdin` 读入的内容排序

    `ch02-mr-intro/src/main/python/max_temperature_reduce.py` 是执行这个 .py 程序，输出每年最高气温

---

"我这系列读书笔记还没有写完，你要继续读下去"

这样看起来，MapReduce 也没有很难的样子 ...... 虽然依然不懂，但是 ...... 但是我知道了要写 map 函数和 reduce 函数啦
