---
title: "C++"
description: "A collection of useful C++ usage and tips."
---

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
