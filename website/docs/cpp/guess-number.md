---
sidebar_label: "Build a Guess Number Game"
title: "How to Build a Guess Number Game"
description: "Introduce how to build a guess number game in C++."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

这篇记录了我跟着 [C++ Beginner's Guide](https://hackingcpp.com/cpp/beginners_guide.html) 学习 C++ 的第一天，并通过一个猜数字游戏的实践来加深对 I/O、基本数据类型、控制流等基础知识的理解。

## 准备开发环境

在 macOS 上，可以直接使用 clang/clang++ 来编译 C++ 代码，也可以使用 gcc/g++ 命令，因为他们指向的均为 clang：

```bash
# highlight-next-line
> gcc --version
Apple clang version 14.0.0 (clang-1400.0.29.202)
Target: arm64-apple-darwin22.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
# highlight-next-line
> g++ --version
Apple clang version 14.0.0 (clang-1400.0.29.202)
Target: arm64-apple-darwin22.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
# highlight-next-line
> clang --version
Apple clang version 14.0.0 (clang-1400.0.29.202)
Target: arm64-apple-darwin22.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
# highlight-next-line
> clang++ --version
Apple clang version 14.0.0 (clang-1400.0.29.202)
Target: arm64-apple-darwin22.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

你也可以使用 [`cpp.sh`](https://cpp.sh) 在线运行 C++ 代码。其它平台的安装方式可以参考 [C++ Development Setup](https://hackingcpp.com/cpp/tools/beginner_dev_setup.html)。

## 学习基础知识

首先，参考 [Hello World](https://hackingcpp.com/cpp/hello_world.html) 学习如何编写、编译并运行一个简单的 C++ 程序。

1. 创建一个名为 `hello.cpp` 的文件，内容如下：

  ```cpp title="hello.cpp"
  #include <iostream>
  int main()
  {
      std::cout << "Hello World!\n";
  }
  ```

2. 将 `hello.cpp` 编译为可执行文件 `hello` 并运行：

  ```bash
  g++ hello.cpp -o hello && ./hello

  # Hello World!
  ```

第一个简单的 `hello.cpp` 程序主要包含了以下几个部分：

- `#include <iostream>`：包含了 C++ 标准库中的 `iostream` 头文件，该头文件包含了 `std::cout` 和 `std::cin` 等用于输入输出的对象。
- `int main()`：程序的入口函数，所有的 C++ 程序都必须包含一个 `main` 函数。
- `std::cout << "Hello World!\n";`：输出字符串 `"Hello World!"`，并在末尾添加一个换行符 `\n`。

### 输入与输出

C++ 中的输入输出可以通过 [`std::cin`](https://en.cppreference.com/w/cpp/io/cin) 和 [`std::cout`](https://en.cppreference.com/w/cpp/io/cout) 对象来实现：

- `std::cin`：用于从标准输入（通常是键盘）读取数据。
- `std::cout`：用于向标准输出（通常是屏幕）输出数据。

下面是一个使用 `std::cin` 和 `std::cout` 的简单示例：

```cpp title="io.cpp"
#include <iostream>

int main(){
    int a, b;
    std::cout << "Enter two numbers: ";
    std::cin >> a >> b;
    std::cout << "The numbers you entered are: " << a << " and " << b << '\n';
}
```

将 `io.cpp` 编译为可执行文件 `a.out`（未指定 `-o` 时的默认值）并运行：

```bash
g++ --std=c++20 io.cpp && ./a.out

# Enter two numbers: 2 3
# The numbers you entered are: 2 and 3
```

在上面的示例程序中：

- 输入时使用了 `std::cin >> a >> b;` 语句读取两个数值并分别赋值给 `a` 和 `b`。
- 输出时使用了 `std::cout << "The numbers you entered are: " << a << " and " << b << '\n';` 语句将 `a` 和 `b` 的值输出到屏幕上。
- `>>` 和 `<<` 为流操作符，用于将数据从流中读取或写入到流中。

更多信息可以参考 [Input & Output (Basics)](https://hackingcpp.com/cpp/std/io_basics.html)。

### 变量声明与数据类型

C++ 中声明变量的语法为：

```cpp
type variable = value;
```

例如，声明一个整型变量 `a` 并赋值为 `5`：

```cpp
int a = 5;
```

更多信息可以参考 [Fundamental Types](https://hackingcpp.com/cpp/lang/fundamental_types.html)。

### 控制流

关于控制流的详细信息可以参考 [Control Flow (Basics)](https://hackingcpp.com/cpp/lang/control_flow_basics.html)。

#### 条件

条件语句可以通过 `if`、`else` 和 `else if` 关键字来实现，语法如下：

```cpp
if (condition1) {
  // do this if condition1 is true
}
else if (condition2) {
  // else this id condition2 is true
}
else {
  // otherwise do this
}
```

下面是判断输入的数字是正数、负数还是零的示例程序：

```cpp title="condition.cpp"
#include <iostream>

int main()
{
    int i = 0;
    std::cout << "Enter a number: ";
    std::cin >> i;
    if (i == 0)
    {
        std::cout << "zero\n";
    }
    else if (i > 0)
    {
        std::cout << "positive\n";
    }
    else
    {
        std::cout << "negative\n";
    }
}
```

将 `condition.cpp` 编译为可执行文件并运行：

```bash
g++ --std=c++20 condition.cpp && ./a.out

#Enter a number: 0
# zero

# Enter a number: 1
# positive

# Enter a number: -1
# negative
```

### 循环

C++ 中的循环语句可以通过 `while`、`do while` 和 `for` 关键字来实现，使用示例如下：

### `while`

下面示例输出结果为 `5 6 7 8 9`：

```cpp title="while.cpp"
#include <iostream>

int main() {
    int i = 5;
    while (i < 10) {
        std::cout << i << ' ';
        i = i + 1;
    }
}
```

### `do ... while`

下面示例输出结果为 `10`：

```cpp title="do_while.cpp"
#include <iostream>

int main() {
    int i = 10;
    do {
        std::cout << i << ' ';
        i = i + 1;
    } while (i < 10);
}
```

#### `for`

下面示例输出结果为 `5 6 7 8 9`：

```cpp title="for.cpp"
#include <iostream>

int main() {
    for (int i = 5; i < 10; i = i + 1) {
        std::cout << i << ' ';
        }
}
```

## 实践：猜数字游戏

编写一个猜数字游戏，程序随机生成一个 1 到 100 之间的整数，用户输入一个数字，程序判断用户输入的数字是否正确，如果错误则提示用户输入的数字过大或过小，直到用户猜中为止。

### 伪代码

```text
1. 生成一个 1 到 100 之间的随机数
2. 用户输入一个数字 guess_number
3. 如果 guess_number == random_number，则提示用户猜中，游戏结束
4. 如果 guess_number > random_number，则提示用户输入的数字过大，然后跳转到第 2 步
5. 如果 guess_number < random_number，则提示用户输入的数字过小，然后跳转到第 2 步
```

### 生成随机数

首先需要解决的问题是如何生成一个 1 到 100 之间的随机数。可以在 [cppreference.com](https://en.cppreference.com/w/cpp/io/cin) 中搜索 `rand`，找到 [`std::rand`](https://en.cppreference.com/w/cpp/numeric/random/rand) 函数。该函数用于生成一个 `[0, RAND_MAX]` 之间的随机数，并不符合我们的需求。但是，在 [`std::rand`](https://en.cppreference.com/w/cpp/numeric/random/rand) 文档的 See also 章节可以看到：

:::info quote

- uniform_int_distribution: produces **integer** values **evenly** distributed **across a range**
- srand: seeds pseudo-random number generator
- RAND_MAX: maximum possible value generated by `std::rand`
- randint: generates a **random integer in the specified range**

:::

因此可以使用 [`std::uniform_int_distribution`](https://en.cppreference.com/w/cpp/numeric/random/uniform_int_distribution) 生成一个 `[min, max]` 之间的随机数。

```cpp title="guess_number.cpp"
#include <iostream>
// highlight-next-line
#include <random>

int main()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(1, 100);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer;
}
```

### 处理用户输入

用户输入的数字可以通过 `std::cin` 来获取：

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(1, 100);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer << '\n';

    // highlight-start
    int guess_number;
    std::cout << "Guess the number: ";
    std::cin >> guess_number;
    // highlight-end

    std::cout << "The guess_number is: " << guess_number << '\n';
}
```

### 判断用户输入的数字是否正确

使用 `if` 语句来判断用户输入的数字是否正确：

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(1, 100);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer << '\n';

    int guess_number;
    std::cout << "Guess the number: ";
    std::cin >> guess_number;

    std::cout << "The guess_number is: " << guess_number << '\n';

    // highlight-start
    if (guess_number == answer)
    {
        std::cout << "Congratulations!\n";
    }
    else if (guess_number < answer)
    {
        std::cout << "Guess a higher number!\n";
    }
    else
    {
        std::cout << "Guess a lower number!\n";
    }
    // highlight-end
}
```

### 添加循环

使用 `while` 循环在用户没有猜中的情况下一直提示用户输入：

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(1, 100);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer << '\n';

    // highlight-next-line
    while (true)
    {
        int guess_number;
        std::cout << "Guess the number: ";
        std::cin >> guess_number;

        if (guess_number == answer)
        {
            std::cout << "Congratulations!\n";
            // highlight-next-line
            break;
        }
        else if (guess_number < answer)
        {
            std::cout << "Guess a higher number!\n";
        }
        else
        {
            std::cout << "Guess a lower number!\n";
        }
    }
}
```

使用示例如下：

```bash
g++ --std=c++20 guess_number.cpp && ./a.out
# The answer is: 5
# Guess the number: 2
# Guess a higher number!
# Guess the number: 4
# Guess a higher number!
# Guess the number: 5
# Congratulations!
```

### 提供当前猜数字的范围

在提示用户输入更大或更小数值时，可以提供更准确的正确数字范围。在程序处理中，需要在 `while` 循环内记录并维护当前的数字范围：

- 当 `guess_number < answer` 时，`min_val` 应该更新为 `guess_number + 1`，`max_val` 不变。
- 当 `guess_number > answer` 时，`min_val` 不变，`max_val` 应该更新为 `guess_number - 1`。

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    // highlight-start
    int min_val = 1;
    int max_val = 100;
    // highlight-end
    std::random_device rd;
    std::mt19937 gen(rd());
    // highlight-next-line
    std::uniform_int_distribution<> distrib(min_val, max_val);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer << '\n';

    while (true)
    {
        int guess_number;
        std::cout << "Guess the number: ";
        std::cin >> guess_number;

        if (guess_number == answer)
        {
            std::cout << "Congratulations!\n";
            break;
        }
        else if (guess_number < answer)
        {
            // highlight-start
            min_val = guess_number + 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
            // highlight-end
        }
        else
        {
            // highlight-start
            max_val = guess_number - 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
            // highlight-end
        }
    }
}
```

在测试时发现，如果猜测的数字不在当前范围内，程序给出的提示信息不准确。例如，如果当前范围为 `[56, 69]`，而用户输入的数字为 `52`，此时程序提示的范围为 `[53, 69]`，这是不正确的。

```bash
g++ --std=c++20 guess_number.cpp && ./a.out
# The answer is: 57
# Guess the number: 50
# Guess the number from 51 to 100
# Guess the number: 70
# Guess the number from 51 to 69
# Guess the number: 55
# Guess the number from 56 to 69
# Guess the number: 52
# Guess the number from 53 to 69
```

为了解决这个问题，需要在更改 `min_val` 或 `max_val` 时，判断取值是否在当前范围内：

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    int min_val = 1;
    int max_val = 100;
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(min_val, max_val);
    int answer = distrib(gen);

    std::cout << "The answer is: " << answer << '\n';

    while (true)
    {
        int guess_number;
        std::cout << "Guess the number: ";
        std::cin >> guess_number;

        if (guess_number == answer)
        {
            std::cout << "Congratulations!\n";
            break;
        }
        else if (guess_number < answer)
        {
            // highlight-next-line
            min_val = guess_number < min_val ? min_val : guess_number + 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
        }
        else
        {
            // highlight-next-line
            max_val = guess_number > max_val ? max_val : guess_number - 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
        }
    }
}
```

修改后的程序输出如下：

```bash
g++ --std=c++20 guess_number.cpp && ./a.out
# The answer is: 57
# Guess the number: 50
# Guess the number from 51 to 100
# Guess the number: 70
# Guess the number from 51 to 69
# Guess the number: 55
# Guess the number from 56 to 69
# Guess the number: 52
# Guess the number from 56 to 69
```

### 整体代码

```cpp title="guess_number.cpp"
#include <iostream>
#include <random>

int main()
{
    int min_val = 1;
    int max_val = 100;
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(min_val, max_val);
    int answer = distrib(gen);

    while (true)
    {
        int guess_number;
        std::cout << "Guess the number: ";
        std::cin >> guess_number;

        if (guess_number == answer)
        {
            std::cout << "Congratulations!\n";
            break;
        }
        else if (guess_number < answer)
        {
            min_val = guess_number < min_val ? min_val : guess_number + 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
        }
        else
        {
            max_val = guess_number > max_val ? max_val : guess_number - 1;
            std::cout << "Guess the number from " << min_val << " to " << max_val << '\n';
        }
    }
}
```
