---
title: "bash"
description: "A collection of useful bash commands and tips."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Control operators `&` and `&&`

When resolving cherry-pick conflicts on multiple branches (PRs), I often use the following command:

```bash
gh pr checkout PR_NUMBER
# Resolve conflicts
# Commit and push
git commit -a -S -m "resolve conflicts" && git push &
# Repeat for other PRs
gh pr checkout PR_NUMBER
```

The `&` operator is used to run the command in the background. The `&&` operator is used to run the `git push` command only if the `git commit` command succeeds.

:::info quote

If a command is terminated by the control operator `&`, the shell executes the command in the **background** in a subshell. The shell does not wait for the command to finish, and the return status is 0.

An AND list has the form

command1 **&&** command2

command2 is executed if, and only if, command1 returns an exit status of zero.
:::

For more details, refer to [Shell Grammar: Lists](https://linux.die.net/man/1/bash).

:::tip

You can also use the `bg` command to run a command in the background. For example:

1. Run a time-consuming command in the foreground, such as `git pull`.
2. Press `Ctrl+Z` in the terminal to stop the `git pull` command. (`Ctrl+Z` sends the `SIGTSTP` signal to the process.)
3. Run the `bg` command to continue the `git pull` command in the background.

For more details, refer to [Job Control Builtins](https://www.gnu.org/software/bash/manual/html_node/Job-Control-Builtins.html).

:::

## Remove a substring from a string

You can get more solutions from [Stackoverflow/16623835](https://stackoverflow.com/questions/16623835/remove-a-fixed-prefix-suffix-from-a-string-in-bash).

For more details about `#`, `##`, `%`, and `%%`, refer to [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html).

### Remove the prefix using `#`

In `${parameter#word}`, `#` is used to remove the **shortest matching pattern** `word` from the beginning of `parameter`.

```bash
var="test-123"
echo "${var#test-}" # 123
```

When you use `find ${DIR_PATH}` command to search for files, the result will be prefixed with `${DIR_PATH}`. To remove the prefix, you can use the `#` operator. For example:

```bash
find ${DIR_PATH} | while IFS= read -r DIR; do
    echo "${DIR#${DIR_PATH}}"
done
```

You can also use the `sed` command to perform the same operation. For more details, refer to [sed](sed-wiki.md).

```bash
find ${DIR_PATH} | while IFS= read -r DIR; do
    echo "${DIR}" | sed "s~^${DIR_PATH}~~"
done
```

The following example shows the result before and after removing the prefix:

<Tabs>

  <TabItem value="Before">

  ```bash
  find . -maxdepth 3 -mindepth 3 | while IFS= read -r DIR; do
      echo "${DIR}"
  done
  # ./website/docs
  # ./website/blog
  # ./website/yarn.lock
  # ./website/package.json
  # ./website/static
  # ./website/docsearch.json
  ```

  </TabItem>

  <TabItem value="After">

  ```bash
  find . -maxdepth 3 -mindepth 3 | while IFS= read -r DIR; do
      echo "${DIR#./}"
  done
  # website/docs
  # website/blog
  # website/yarn.lock
  # website/package.json
  # website/static
  # website/docsearch.json
  ```

  </TabItem>

</Tabs>

:::tip

What is the difference between `#` and `##`?

- `#` removes the **shortest** matching pattern `word` from the beginning of `parameter`.
- `##` removes the **longest** matching pattern `word` from the beginning of `parameter`.

```bash
var="test-test-123"
echo "${var#test-}" # test-123
echo "${var#*test-}" # test-123
echo "${var##*test-}" # 123
```

In the following example, `a*b` pattern matches any sequence that starts with `a` and ends with `b`.

```bash
var="aaabbbccc"
echo "${var#*a}" # aabbbccc
echo "${var##*a}" # bbbccc
echo "${var#a*b}" # bbccc
echo "${var##a*b}" # ccc
echo "${var#a*c}" # cc
echo "${var##a*c}" #
```

:::

### Remove the suffix using `%`

In `${parameter%word}`, `%` is used to remove the **shortest matching pattern** `word` word from the end of `parameter`.

```bash
var="test-123"
echo "${var%-123}" # test
```

:::tip

What is the difference between `%` and `%%`?

- `%` removes the **shortest** matching pattern `word` from the end of `parameter`.
- `%%` removes the **longest** matching pattern `word` from the end of `parameter`.

:::
