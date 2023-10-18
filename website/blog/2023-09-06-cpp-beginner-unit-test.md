---
slug: 2023-09-06-cpp-beginner-unit-test
title: "C++ Beginner's Guide: Writing Unit Tests"
authors: [Oreo]
tags: [C++, Test]
---

```mdxcodeblock
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

介绍如何使用 Catch2 给一个开源项目写单元测试。

https://www.jetbrains.com/help/clion/catch-tests-support.html

项目背景

项目使用的测试框架是 [Catch2](https://github.com/catchorg/Catch2)。

### 下载模型

### 加载模型

可以参考项目的其它代码：

```cpp title="backend/llama/LlamaModel_test.cpp"
#include "config/Config.h"
#include "llama/LlamaModel.h"
#include "llama/LlamaParams.h"
#include "llama/LlamaScope.h"

auto config = muton::playground::llm::Config::Read();
muton::playground::llm::LlamaScope scope(true);
muton::playground::llm::LlamaParams params(config->getParams());
muton::playground::llm::LlamaModel model(config->getModel().cStr(), params);
```

### 单元测试

#### 创建测试文件

#### 链接 Catch2

参考 [CMake integration](https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md)。

根据 Catch2 文档说明，不需要 custom `main` 函数时，使用 `Catch2::Catch2WithMain`。

```cmake title="backend/CMakeLists.txt"
target_link_libraries(backend_test PRIVATE Catch2::Catch2WithMain)
```

LlamaModel 用于加载 Llama 模型，主要包括以下几个功能：

- `LlamaModel::GetVocabulary()`：获取模型的词表
- `LlamaModel::GetTokenString()`：根据数字获得对应 token 的 string
- `LlamaModel::GetBos()`：获取 stream token 的开头
- `LlamaModel::GetEos()`：获取 stream token 的结尾
