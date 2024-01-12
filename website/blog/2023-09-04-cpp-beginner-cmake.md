---
slug: 2023-09-04-cpp-beginner-cmake
title: "C++ Beginner's Guide: Managing Your Project Using CMake"
authors: [Oreo]
tags: [C++]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

作为一个 C++ 初学者，在学习基本语法和练习示例代码时，需要频繁使用 `g++ ... input.cpp -o output && ./output` 类似的命令编译和运行程序。虽然这种方式有助于熟悉 `g++`，但是对于想要快速测试代码的新手来说，这种方式不够友好。

本文介绍如何利用 CMake 来管理一个 C++ 学习项目，帮助你快速实现编译和运行。

<!--truncate-->

## 什么是 CMake？

简单来说，[CMake](https://cmake.org) 是一个**跨平台**的**构建系统**，它可以帮助你定义如何编译和链接你的项目，而不必关心具体的编译命令。CMake 会为你生成项目所需的 Makefile 或其他构建文件，所以你只需要关心代码即可。

## 如何安装 CMake？

在 macOS 中可以直接通过 homebrew 安装：

```bash
brew install cmake
```

本文以 CMake 3.27.4 为例。 其他操作系统的安装方式，请参考 [Getting and Installing CMake on Your Computer](https://cmake.org/cmake/help/book/mastering-cmake/chapter/Getting%20Started.html#getting-and-installing-cmake-on-your-computer)。

## 如何使用 CMake 管理项目？

每个使用 CMake 的项目都需要定义 `CMakeLists.txt` 文件，即 CMake 的配置文件，用于告诉 CMake 如何构建你的项目。使用 CMake 管理项目的常见流程为：

1. 按需配置或更新 `CMakeLists.txt`
2. 生成构建文件：CMake 会根据 `CMakeLists.txt` 配置并生成项目所需的构建文件
3. 调试或运行项目

下面是一个 `CMakeLists.txt` 的示例：

```cmake title="cpp_learning/CMakeLists.txt"
cmake_minimum_required(VERSION 3.26)

project(cpp_learning)

set(CMAKE_CXX_STANDARD 20)
add_executable(cpp_learning main.cpp)
```

- `cmake_minimum_required(VERSION 3.26)`：配置需要的最低 CMake 版本，例如 `3.26`。注意：`CMakeLists.txt` 的第一行必须是 `cmake_minimum_required`
- `project(cpp_learning)`：配置项目名称，例如 `cpp_learning`
- `set(CMAKE_CXX_STANDARD 20)`：配置 C++ 版本，例如 `20`
- `add_executable(cpp_learning main.cpp)`：将 `main.cpp` 编译为可执行文件 `cpp_learning`

在学习 C++ 的过程中，我们需要编写非常多的程序。引入 CMake 之后，只需要在 `CMakeLists.txt` 中添加 `add_executable` 即可。例如 `add_executable(hello hacking_cpp/hello.cpp)` 将 `hacking_cpp/hello.cpp` 编译为可执行文件 `hello`。

在配置 `CMakeLists.txt` 后，需要使用 `cmake` 命令生成构建文件。例如下面命令：

```bash
mkdir build # Create a directory for the build
cd build
cmake .. # Generate build files using CMake, .. indicates the parent directory where CMakeLists.txt is located
make # This will execute the build files and build the project
```

:::tip

如果使用[集成 CMake 的 IDE](https://cmake.org/cmake/help/latest/guide/ide-integration/index.html)，则无需手动运行上述 `cmake ..`、`make` 命令。例如在 CLion 中每次更新 `CMakeLists.txt` 后只需要点击 **Load CMake Changes** 图标即可实现 `cmake ..`。具体使用方法参考 [Reload CMake on changes in CMakeLists.txt](https://www.jetbrains.com/help/clion/reloading-project.html#manual-reload)。

:::

## 如何引入第三方库？

在 C++ 项目中，经常需要使用一些第三方库来更高效地实现某些功能。下面以使用 [`fmt`](https://fmt.dev/latest/index.html)（一个现代 C++ 格式化库）为例，介绍如何更新 `CMakeLists.txt` 并在程序中使用 `fmt`。

### 源码编译

当你希望从源码编译 `fmt` 时，首先需要将 `fmt` 源码下载到你的项目目录中。下面提供了 `git subtree` 和 `git submodule` 两种方式：

<Tabs>
  <TabItem value="git-subtree" label="git subtree">

  ```bash
  cd cpp_learning
  git subtree add --prefix thirdparty/fmt https://github.com/fmtlib/fmt.git master --squash
  ```

  输出结果示例：

  ```bash
  git fetch https://github.com/fmtlib/fmt.git master
  remote: Enumerating objects: 32297, done.
  remote: Counting objects: 100% (993/993), done.
  remote: Compressing objects: 100% (85/85), done.
  remote: Total 32297 (delta 928), reused 934 (delta 900), pack-reused 31304
  Receiving objects: 100% (32297/32297), 13.73 MiB | 12.03 MiB/s, done.
  Resolving deltas: 100% (21894/21894), done.
  From https://github.com/fmtlib/fmt
   * branch              master     -> FETCH_HEAD
  Added dir 'thirdparty/fmt'
  ```

  此时查看 `git log` 可以发现 `fmt` 被 squash 为一个 commit 以及新增了一个 merge commit：

  ```bash
  commit dd05d0f6812ddcfb72d5e1425e7bad88f424451f
  Merge: e5b1c472 20d0c586
  Author: Oreo
  Date:   Mon Sep 4 21:37:57 2023 +0800
  
      Merge commit '20d0c58622d07bf66f125efff52cc440b88fe2eb' as 'thirdparty/fmt'
  
  commit 20d0c58622d07bf66f125efff52cc440b88fe2eb
  Author: Oreo
  Date:   Mon Sep 4 21:37:57 2023 +0800
  
      Squashed 'thirdparty/fmt/' content from commit e8259c52
  
      git-subtree-dir: thirdparty/fmt
      git-subtree-split: e8259c5298513e8cdbff05ce01c46c684fe758d8
  ```

  之后需要更新 `fmt` 时，只需要运行 `git subtree pull`：

  ```bash
  git subtree pull --prefix thirdparty/fmt https://github.com/fmtlib/fmt.git master --squash
  ```

  </TabItem>
  <TabItem value="git-submodule" label="git submodule（不推荐）">

  ```bash
  cd cpp_learning
  mkdir thirdparty
  git submodule add https://github.com/fmtlib/fmt fmt
  ```

  输出结果示例：

  ```bash
  Cloning into 'cpp-learning/thirdparty/fmt'...
  remote: Enumerating objects: 32886, done.
  remote: Counting objects: 100% (1261/1261), done.
  remote: Compressing objects: 100% (103/103), done.
  remote: Total 32886 (delta 1188), reused 1188 (delta 1149), pack-reused 31625
  Receiving objects: 100% (32886/32886), 14.09 MiB | 23.39 MiB/s, done.
  Resolving deltas: 100% (22295/22295), done.
  ```
  
  查看 `git status`：

  ```bash
  git status
  On branch main
  
  No commits yet
  
  Changes to be committed:
    (use "git rm --cached <file>..." to unstage)
    new file:   .gitmodules
    new file:   fmt
  ```

  新增了 `fmt` 和 `.gitmodules`。其中 `.gitmodules` 内容如下：

  ```yaml title="cpp_learning/.gitmodules"
  [submodule "fmt"]
    path = fmt
    url = https://github.com/fmtlib/fmt
  ```

之后需要更新 `fmt` 时，只需要运行 `git submodule update`：

  ```bash
  git submodule update --remote
  ```

  </TabItem>
</Tabs>

接着更新 `CMakeLists.txt`，需要告诉 CMake 如何找到 `fmt` 并链接到 `hello` 应用程序。可以通过 `add_subdirectory` 和 `target_link_libraries` 实现查找和链接：

```cmake title="cpp_learning/CMakeLists.txt"
cmake_minimum_required(VERSION 3.26)

project(cpp_learning)

set(CMAKE_CXX_STANDARD 20)

#highlight-next-line
add_subdirectory(thirdparty/fmt)

add_executable(cpp_learning main.cpp)
add_executable(hello hacking_cpp/hello.cpp)

#highlight-next-line
target_link_libraries(hello fmt::fmt)
```

- `add_subdirectory`：指定 `fmt` 源码及其 `CMakeLists.txt` 所在位置，CMake 会直接将 `fmt` 的 `CMakeLists.txt` 包含到当前的构建中
- `target_link_libraries`：将查找到的 `fmt` 库链接到目标应用程序 `hello`

### 二进制分发

当你通过 homebrew 或其他包管理器安装 `fmt` 时，可以通过 `find_package` 和 `target_link_libraries` 实现查找和链接：

```cmake title="cpp_learning/CMakeLists.txt"
cmake_minimum_required(VERSION 3.26)

project(cpp_learning)

set(CMAKE_CXX_STANDARD 20)

#highlight-next-line
find_package(fmt REQUIRED)

add_executable(cpp_learning main.cpp)
add_executable(hello hacking_cpp/hello.cpp)

#highlight-next-line
target_link_libraries(hello fmt::fmt)
```

- `find_package`：搜索并加载系统中的 `fmt` 库
- `target_link_libraries`：将查找到的 `fmt` 库链接到目标应用程序 `hello`

### 使用 `fmt` 实现格式化输出示例

下面示例代码使用了 `std::cout`、`fmt::print` 和 `fmt::println` 三种方式进行字符串的输出：

```cpp title="cpp_learning/hacking_cpp/hello.cpp"
#include <fmt/format.h>

#include <iostream>
int main() {
  std::cout << "std::cout: Hello World\n";
  fmt::print("fmt::print: Hello!");
  fmt::println("fmt::println: Hello, {}, {}, and {}", 0, 1, 2);
  fmt::print("fmt::print: Bye");
  return 0;
}
```

运行结果如下：

```bash
std::cout: Hello World
fmt::print: Hello!fmt::println: Hello, 0, 1, and 2
fmt::print: Bye
```
