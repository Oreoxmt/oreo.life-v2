---
sidebar_label: "Iterator"
title: "Understanding Iterator in Python"
description: "Explore the concept of iterators in Python and describe how to create and utilize custom iterator objects."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

# Understanding Iterator in Python

In Python, the iterator is an object representing a **stream** of data. The iterator object can be used in a `for` loop, or in a `next()` function. Common Python iterator objects, such as `list`, `str`, `tuple`, `dict`, and `file`, integrate seamlessly with `for` loops. The following is an example:

```python
a = [1, 2, 3]
for item in a:
    print(item)
```

The output is as follows:

```shell
1
2
3
```

To create a custom iterator, you need to define two methods in your class:

1. `__iter__()`: return an iterator object itself.
2. `__next__()`: return the next item from the iterator. When there are no more items, it must raise a `StopIteration` exception.

The following example shows how to create an iterator object that returns the next token from a message queue:

```python
from queue import Queue


class Message:
    def __init__(self):
        # Fill the queue with numbers from 0 to 9
        self._tokens = Queue()
        for item in range(10):
            self._tokens.put(item)
    
    def __iter__(self):
        return self
    
    def __next__(self):
        next_token = self._tokens.get()
        if next_token is None:
            raise StopIteration # raise StopIteration exception if the next_token is marked as None
        return next_token # return the next token
```

The following example shows how to use the iterator object:

```python
message = Message()
for token in message:
    print(token)
```

The output is as follows:

```shell
0
1
2
3
4
5
6
7
8
9
```

To demystify the iterator, the preceding `for` loop is functionally equivalent to the following:

```python
message = Message()
mess_iter = iter(message) # Equivalent to message.__iter__()
while True:
    try:
        token = next(mess_iter) # Equivalent to mess_iter.__next__()
        print(token)
    except StopIteration:
      break
```
