---
sidebar_label: "Negative Division"
title: "Negative Division Pitfalls in Python"
description: "The unexpected behavior of negative division in Python and how to handle it as expected."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

While working on automated accounting transactions with [Beancount](https://github.com/beancount/beancount), I ran into an unexpected issue involving floating-point number conversions. In financial calculations, it's common practice to convert floating-point values to integers (for example, converting 1.55 to 155) by multiplying by 100, perform the necessary calculations, and then convert the result back by dividing by 100. This method helps maintain precision when dealing with currency values.

Sounds straightforward, doesn't it? That's what I thought until negative numbers entered the equation.

To my surprise, when I attempted to convert -155 back to -1.55, Python returned **-2.45** instead. Let's dive into why this happens.

### The unexpected behavior

Here's the Python function where the issue occurs:

```python
def int_to_float(value: int, decimal: int):
    exp = 1
    for _ in range(decimal):
        exp = exp * 10
    return f"{value // exp:,}.{str(value % exp).zfill(decimal)}"

print(int_to_float(100, 2))  # 1.00
print(int_to_float(-100, 2))  # -1.00
print(int_to_float(155, 2))  # 1.55
print(int_to_float(-155, 2))  # -2.45 # Oops!
```

<codapi-snippet sandbox="python" init-delay="500">
</codapi-snippet>

As you can see, when the input is `-155`, the function returns `-2.45` instead of the expected `-1.55`. This happens because Python handles integer division and modulo operations in a way that might not match our intuitive expectations. Here's what's happening behind the scenes:

- `-155 // 100` results in `-2` (integer division)
- `-155 % 100` results in `45` (modulo)

This behavior is explained in the [Python FAQ: Why does `-22 // 10` return -3?](https://docs.python.org/3/faq/programming.html#why-does-22-10-return-3)

## The math behind the mystery

[Wikipedia: Modulo](https://en.wikipedia.org/wiki/Modulo) provides helpful insights into how different programming languages implement modulo operations.

Python uses floored division for its `%` operator, which is defined as:

$$
q = \left\lfloor \frac{a}{n} \right\rfloor, r = a - n\left\lfloor \frac{a}{n} \right\rfloor
$$

Under this implementation, the remainder `r` always shares the same sign as the divisor `n`.

For examples:

```python
print(10 % 3)  # 1
print(-10 % 3)  # 2
print(-10 % -3)  # -1
print(10 % -3)  # -2
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>

In contrast, Bash, C++ `%`, and Python's `math.fmod()` use truncated division:

$$
q = \operatorname{trunc}\left(\frac{a}{n}\right), r = a - n\operatorname{trunc}\left(\frac{a}{n}\right)
$$

With truncated division, the remainder `r` shares the same sign as the dividend `a`.

For examples:

<Tabs>
  <TabItem value="bash" label="Bash (%)">

  ```shell-session
  echo "10 % 3 =" $((10 % 3))  # 1
  echo "-10 % 3 =" $((-10 % 3))  # -1
  echo "-10 % -3 =" $((-10 % -3))  # -1
  echo "10 % -3 =" $((10 % -3))  # 1
  ```

  <codapi-snippet sandbox="bash" editor="basic" init-delay="500">
  </codapi-snippet>

  </TabItem>

  <TabItem value="cpp" label="C++ (%)">

  ```cpp
  #include <iostream>

  int main() {
      std::cout << "10 % 3 = " << (10 % 3) << '\n'; // 1
      std::cout << "-10 % 3 = " << (-10 % 3) << '\n'; // -1
      std::cout << "-10 % -3 = " << (-10 % -3) << '\n'; // -1
      std::cout << "10 % -3 = " << (10 % -3) << '\n'; // 1
      return 0;
  }
  ```

  <codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
  </codapi-snippet>

  </TabItem>

  <TabItem value="python" label="Python (math.fmod)">

  ```python
  from math import fmod

  print(f"10 % 3 = {fmod(10, 3)}")  # 1.0
  print(f"-10 % 3 = {fmod(-10, 3)}")  # -1.0
  print(f"-10 % -3 = {fmod(-10, -3)}")  # -1.0
  print(f"10 % -3 = {fmod(10, -3)}")  # 1.0
  ```

  <codapi-snippet sandbox="python" editor="basic" init-delay="500">
  </codapi-snippet>

  </TabItem>
</Tabs>

## The solution

The following is an updated version of the function that correctly handles negative numbers:

```python
def int_to_float(value: int, decimal: int):
    exp = 1
    for _ in range(decimal):
        exp = exp * 10
    if value < 0:
        value = -value
        sign = "-"
    else:
        sign = ""
    ret = f"{sign}{value // exp:,}.{str(value % exp).zfill(decimal)}"
    return ret

print(int_to_float(100, 2))  # 1.00
print(int_to_float(-100, 2))  # -1.00
print(int_to_float(155, 2))  # 1.55
print(int_to_float(-155, 2))  # -1.55
```

<codapi-snippet sandbox="python" init-delay="500">
</codapi-snippet>

This solution handles negative numbers by separating the sign from the absolute value and performing division and modulo operations on the absolute value, ensuring correct results for both positive and negative numbers. Now, `int_to_float(-155, 2)` correctly returns `-1.55` instead of `-2.45`.

## What I learned

~~Avoid using negative division~~

The main takeaway here is simple: **be cautious when working with negative division** in programming.

- Understand how your programming language handles division and modulo operations.
- Write comprehensive tests that cover edge cases, especially with negative numbers.
