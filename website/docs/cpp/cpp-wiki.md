---
title: "C++"
description: "A collection of useful C++ usage and tips."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Avoid `using namespace std;`

It is common to encounter `using namespace std;` in various C++ sample codes, as it negates the need to prefix `std::` before each standard library object. However, it is not recommended to use it in your code. The reason is that `using namespace std;` might cause name conflicts.

Consider a scenario where you have a function or variable named `max`. If you declare `using namespace std;`, then you will get an error when you try to use `max` because it conflicts with `std::max`.

```cpp
#include <iostream>
using namespace std;

int max = 0;
int main() {
    cout << max << endl; // error: reference to 'max' is ambiguous
}
```

<codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
</codapi-snippet>

To avoid the preceding error, use the following code instead:

```cpp
#include <iostream>

int max = 0;
int main() {
    std::cout << max << std::endl; // 0
}
```

<codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
</codapi-snippet>

## `std::endl` vs `\n` for output

`std::endl` inserts a newline character (`\n`) into the output stream and flushes the buffer.

The following code examples show the difference between using `std::endl` and not using it.

<Tabs>
  <TabItem label="Output with std::endl" value="std_endl">

  ```cpp
  #include <iostream>

  int main() {
      for (int i=0; i<5; i++) {
          std::cout << i << std::endl;
      }
  }
  // 0
  // 1
  // 2
  // 3
  // 4
  ```
  <codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
  </codapi-snippet>

  </TabItem>
  <TabItem label="Output without std::endl" value="non_std_endl">

  ```cpp
  #include <iostream>

  int main() {
      for (int i=0; i<5; i++) {
          std::cout << i; // 01234
      }
  }
  ```
  <codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
  </codapi-snippet>

  </TabItem>

</Tabs>

In standard output, `\n` usually has the same effect as `std::endl`, that is, it inserts a newline character and flushes the buffer. However, in file output, `\n` does not flush the stream, while `std::endl` does.

:::info quote

In many implementations, standard output is **line-buffered**, and writing `\n` causes a flush anyway, unless `std::ios::sync_with_stdio(false)` was executed. In those situations, unnecessary `endl` only degrades the performance of file output, not standard output.

—— [C++ reference: std:endl](https://en.cppreference.com/w/cpp/io/manip/endl)

:::

The following code examples show the same output with `std::endl` and `\n` in standard output.

<Tabs>
  <TabItem label="Use std::endl in standard output" value="std_endl_std_out">

  ```cpp name="std_endl.cpp"
  #include <iostream>
  #include <unistd.h>

  int main() {
      for (int i=0; i<5; i++) {
          sleep(1);
          std::cout << i << std::endl;
      }
  }
  // Sleep 1 second
  // 0
  // Sleep 1 second
  // 1
  // Sleep 1 second
  // 2
  // Sleep 1 second
  // 3
  // Sleep 1 second
  // 4
  ```

  </TabItem>
  <TabItem label="Use new line character in standard output" value="new_line_std_out">

  ```cpp name="new_line_character.cpp"
  #include <iostream>
  #include <unistd.h>

  int main() {
      for (int i=0; i<5; i++) {
          sleep(1);
          std::cout << i << "\n";
      }
  }
  // Sleep 1 second
  // 0
  // Sleep 1 second
  // 1
  // Sleep 1 second
  // 2
  // Sleep 1 second
  // 3
  // Sleep 1 second
  // 4
  ```

  </TabItem>
</Tabs>

To see the difference between `std::endl` and `\n` in file output, run the following code examples.

<Tabs>
  <TabItem label="Use std::endl in file output" value="std_endl_file_out">

  ```shell
  g++ std_endl.cpp -o std_endl
  ./std_endl | cat
  # Sleep 1 second
  # 0
  # Sleep 1 second
  # 1
  # Sleep 1 second
  # 2
  # Sleep 1 second
  # 3
  # Sleep 1 second
  # 4
  ```

  </TabItem>
  <TabItem label="Use new line character in file output" value="new_line_file_out">

  ```shell
  g++ new_line_character.cpp -o new_line_character
  ./new_line_character | cat
  # After 5 seconds, the output appears as follows:
  # 0
  # 1
  # 2
  # 3
  # 4
  ```

  </TabItem>
</Tabs>
