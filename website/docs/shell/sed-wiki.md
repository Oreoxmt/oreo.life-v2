---
title: sed
description: "A stream editor for filtering and transforming text."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

For more details, refer to [`sed`](https://linux.die.net/man/1/sed).

## `s/regexp/replacement/`

:::info quote

Attempt to match regexp against the pattern space. If successful, replace that portion matched with replacement. The replacement might contain the special character `&` to refer to that portion of the pattern space which matched, and the special escapes \1 through \9 to refer to the corresponding matching sub-expressions in the regexp.

:::

For example, the following `sed` command removes the `./` prefix from the beginning of a string if it exists:

```bash
echo "./test.md" | sed 's~^./~~'
# test.md
```

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

In the preceding substitution command <code>s~**^./**~~</code>:

- `s` is the `sed` command that specifies a string substitution.
- `~` is the delimiter used to separate the different parts of the command.
- `^./` is a regular expression that matches any string that starts with `./`.
- The replacement string is an empty string.

When you use `find ${DIR_PATH}` command to search for files, the result will be prefixed with `${DIR_PATH}`. To remove the prefix, you can use the [`#` operator](bash-wiki.md#remove-the-prefix-using-) or the `sed` command. For example:

```bash
find ${DIR_PATH} | while IFS= read -r DIR; do
    echo "${DIR}" | sed "s~^${DIR_PATH}~~"
done
```

## `-E`, `-r`, `--regexp-extended`

To use [extended regular expressions](https://www.gnu.org/software/sed/manual/sed.html#ERE-syntax) in `sed`, use the `-E` option. For example, the following `sed` command removes the number prefix and the comma from the beginning of a string:

```bash
echo "12345678,test.md,..." | sed -E 's~^[0-9]+,~~'
# test.md,...
```

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

For more details, refer to [`--regexp-extended`](https://www.gnu.org/software/sed/manual/sed.html).
