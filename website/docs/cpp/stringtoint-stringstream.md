---
title: "Get an Integer from a String Using string stream"
description: "During the CS 106L course, I learned a lot of C++ streams. This document describes how to use basic_stringstream to get an integer from a string."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

During the CS 106L course, I learned a lot of C++ streams. This document describes how to use [`basic_stringstream`](https://en.cppreference.com/w/cpp/io/basic_stringstream) to get an integer from a string.

:::info quote

The basic unit of communication between a program and its environment is a _stream_. A stream is a channel between a _source_ and _destination_ which allows the source to push formatted data to the destination.

—[CS 106L Course Reader](https://web.stanford.edu/class/cs106l/full_course_reader.pdf)

:::

## Overview of string stream

To create a string stream, we need to include the `<sstream>` header file. Then, we can create a string stream object using the following code:

```cpp
#include <sstream>

int main() {
  std::istringstream iss("9.15 pounds.");
  std::ostringstream oss("The price of the shirt is ");
}
```

For C++ beginners, we usually use `std::cin` to get input from the user and use `std::cout` to output something to the console. Here, `std::cin` and `std::cout` are both streams. The following is an example:

```cpp
#include <iostream>

int main() {
  int value;
  std::cin >> value;
  std::cout << value << std::endl;
}
```

In the preceding example, `>>` is the stream **extraction** operator, and `<<` is the stream **insertion** operator. For string streams, we also use `>>` and `<<` to extract and insert data.

To extract the price and unit from the string stream `iss`, use the following code:

<Tabs>
  <TabItem value="extract-price-double-code" label="Extract price (double) and unit">

  ```cpp
  #include <iostream>
  #include <sstream>

  int main() {
    std::istringstream iss("9.15 pounds.");
    std::ostringstream oss("The price of the shirt is ");
    double price;
    std::string unit;
    iss >> price >> unit;
    std::cout << oss.str() << price << " " << unit << std::endl;
  }
  ```
  <codapi-snippet sandbox="cpp" init-delay="500">
  </codapi-snippet>

  </TabItem>
  <TabItem value="extract-price-double-output" label="Output">

  ```text
  The price of the shirt is 9.15 pounds.
  ```

  </TabItem>
</Tabs>

What is the behavior of `iss >> price >> unit`? We can modify the type of `price` to `int` and see what happens:

<Tabs>
  <TabItem value="extract-price-int-code" label="Extract price (int) and unit">

  ```cpp
  #include <iostream>
  #include <sstream>

  int main() {
    std::istringstream iss("9.15 pounds.");
    std::ostringstream oss("The price of the shirt is ");
    // highlight-next-line
    int price;
    std::string unit;
    iss >> price >> unit;
    std::cout << oss.str() << price << " " << unit << std::endl;
  }
  ```
  <codapi-snippet sandbox="cpp" init-delay="500">
  </codapi-snippet>

  </TabItem>
  <TabItem value="extract-price-int-output" label="Output">

  ```text
  The price of the shirt is 9 .15
  ```

  </TabItem>
</Tabs>

The output shows that the value of `price` is `9`, and the value of `unit` is `.15`. This is because the `>>` operator will stop extracting data when it encounters a whitespace or an invalid character for the type. In this case, the `>>` operator in `iss >> price` stops extracting data at `.`. Then, the `>>` operator in `iss >> unit` extracts `.15` into `unit` and stops extracting data at ` `.

## Implement `stringToInteger()` without error-checking

Now, we can use `>>` to extract an integer from a string. Let's implement a function `stringToInteger()` to convert a string to an integer. The code is as follows:

<Tabs>
  <TabItem value="string-to-int-first" label="Extract an integer from a string">

  ```cpp name="stringToInteger.cpp"
  #include <iostream>
  #include <sstream>

  int stringToInteger(const std::string& str) {
    std::istringstream iss(str);
    int value;
    iss >> value;
    return value;
  }

  int main() {
    std::string str = "123";
    int value = stringToInteger(str);
    std::cout << "The value is: " << value << std::endl;
  }
  ```
  <codapi-snippet sandbox="cpp" init-delay="500">
  </codapi-snippet>

  </TabItem>
  <TabItem value="string-to-int-first-output" label="Output">

  ```text
  The value is: 123
  ```

  </TabItem>
</Tabs>

## Stream state

What if the string contains invalid characters? For example, the string `"123abc"` contains non-numeric characters. In this case, the `>>` operator stops extracting data at `a`. Then, the value of `value` will be `123`. However, we want to return an error message to the user. To do this, we need to check whether any error occurs during the extraction process.

A new concept is introduced here: **stream state**. There are four stream states:

- **good**: no error occurs. The I/O operations are available.
- **eof**: reaching the **end of the stream**.
- **fail**: the input/output operation failed and all future operations frozen, such as the type mismatch.
- **bad**: **irrecoverable** stream error. For example, the file you are reading is deleted suddenly.

To check the stream state, we can use the `good()`, `eof()`, `fail()`, and `bad()` functions. The following shows some examples:

<Tabs>
  <TabItem value="stream-state-code" label="Check stream state">

  ```cpp
  #include <iostream>
  #include <sstream>
  #include <vector>

  void get_stream_state(std::istringstream &iss) {
    if (iss.good()) {
      std::cout << "G";
    }
    if (iss.eof()) {
      std::cout << "E";
    }
    if (iss.fail()) {
      std::cout << "F";
    }
    if (iss.bad()) {
      std::cout << "B";
    }
    std::cout << std::endl;
  }

  int stringToInteger(const std::string &str) {
    std::istringstream iss(str);
    std::cout << "Before: ";
    get_stream_state(iss);
    int value;
    iss >> value;
    std::cout << "After: ";
    get_stream_state(iss);
    return value;
  }

  int main() {
    std::vector<std::string> test_strings{"123", "123abc", "abc123", ""};
    for (const auto &str : test_strings) {
      std::cout << "stringToInteger(\"" << str << "\"):\n"
                << stringToInteger(str) << std::endl;
    }
  }
  ```
  <codapi-snippet sandbox="cpp" init-delay="500">
  </codapi-snippet>

  </TabItem>
  <TabItem value="stream-state-output" label="Output">

  ```text
  stringToInteger("123"):
  Before: G
  After: E
  123
  stringToInteger("123abc"):
  Before: G
  After: G
  123
  stringToInteger("abc123"):
  Before: G
  After: F
  0 # undefined behavior
  stringToInteger(""):
  Before: G
  After: EF
  -514166240 # undefined behavior
  ```

  </TabItem>
</Tabs>

## Implement `stringToInteger()` with error-checking

Using the stream state, we can implement `stringToInteger()` with error-checking. From the preceding example, to ensure that the string only contains numeric characters, we need to consider the following cases:

- After the extraction, the stream state is `good` : the string might contain non-numeric characters after the number.
- After the extraction, the stream state is `fail`: the string contains non-numeric characters before the number.

The following code shows how to implement `stringToInteger()` with error-checking:

```cpp name="stringToInteger.cpp"
#include <iostream>
#include <sstream>

int stringToInteger(const std::string &str) {
  std::istringstream iss(str);
  int result;
  // highlight-start
  char remain;  // Record remaining characters after the integer
  iss >> result;
  if (iss.fail() || iss.bad()) {
    throw std::domain_error("The string does not start with an integer.");
  }
  iss >> remain;
  if (!iss.fail()) {
    throw std::domain_error(
        "The string contains extra characters after the integer.");
  }
  // highlight-end
  return result;
}

int main() {
  std::string str = "123";
  int value = stringToInteger(str);
  std::cout << "The value is: " << value << std::endl;
}
```
<codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
</codapi-snippet>

In the preceding code, the program first tries to extract an integer from the string. If the stream state is `fail` or `bad`, it throws an error. Otherwise, it tries to extract a character from the remaining string. If the stream state is not `fail`, it means that the string contains extra characters after the integer. Then, the program throws an error.

Since `if ((iss >> result).fail())` is equivalent to `if (!(iss >> result))`, we can simplify the code as follows:

```cpp name="stringToInteger.cpp"
#include <iostream>
#include <sstream>

int stringToInteger(const std::string &str) {
  std::istringstream iss(str);
  int result;
  char remain;  // Record remaining characters after the integer
  // highlight-start
  if (!(iss >> result) || iss >> remain) {
    throw std::domain_error(
        "Failed to get integer from string. Please check the string.");
  }
  // highlight-end
  return result;
}

int main() {
  std::string str = "123";
  int value = stringToInteger(str);
  std::cout << "The value is: " << value << std::endl;
}
```
<codapi-snippet sandbox="cpp" editor="basic" init-delay="500">
</codapi-snippet>
