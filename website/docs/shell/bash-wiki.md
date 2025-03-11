---
title: "bash"
description: "A collection of useful bash commands and tips."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Bash script execution methods

| Method           | Makes script executable | Runs in current session |
|------------------|-------------------------|-------------------------|
| `source test.sh` | No                      | Yes                     |
| `. test.sh`      | No                      | Yes                     |
| `./test.sh`      | Yes                     | No                      |
| `bash ./test.sh` | No                      | No                      |
| `sh ./test.sh`   | No                      | No                      |

## Capture or ignore the standard output (STDOUT) and standard error (STDERR) of your command

This section uses the following directory structure as an example:

```text
tree .
.
├── bar
│   ├── test1
│   ├── test2
│   └── test3
└── foo
    ├── test1
    ├── test2
    └── test3

3 directories, 6 files
```

When you run `ls bar foo test`, it produces both output and error:

```shell
ls bar foo test
#ls: test: No such file or directory
#bar:
#test1 test2 test3
#
#foo:
#test1 test2 test3
```

- To capture `STDOUT` to the `output.txt` file while displaying `STDERR`:

    ```shell
    #highlight-next-line
    ls bar foo test > output.txt
    #ls: test: No such file or directory

    cat output.txt
    #bar:
    #test1
    #test2
    #test3
    #
    #foo:
    #test1
    #test2
    #test3
    ```

- To capture `STDOUT` to the `output.txt` file and capture `STDERR` to the `error.txt` file:

    ```shell
    #highlight-next-line
    ls bar foo test > output.txt 2>error.txt

    cat output.txt
    #bar:
    #test1
    #test2
    #test3
    #
    #foo:
    #test1
    #test2
    #test3

    cat error.txt
    #ls: test: No such file or directory
    ```

- To capture both `STDOUT` and `STDERR` to the `log.txt` file:

    ```shell
    #highlight-next-line
    ls bar foo test > log.txt 2>&1

    cat log.txt
    #ls: test: No such file or directory
    #bar:
    #test1
    #test2
    #test3
    #
    #foo:
    #test1
    #test2
    #test3
    ```

    To append both `STDOUT` and `STDERR` to an existing log file:

    ```shell
    echo "Logs:" > log.txt
    #highlight-next-line
    ls bar foo test >> log.txt 2>&1

    cat log.txt
    #highlight-next-line
    #Logs:
    #ls: test: No such file or directory
    #bar:
    #test1
    #test2
    #test3
    #
    #foo:
    #test1
    #test2
    #test3
    ```

- To ignore `STDOUT`:

    ```shell
    ls bar foo test > /dev/null
    #ls: test: No such file or directory
    ```

- To ignore both `STDOUT` and `STDERR`:

    ```shell
    ls bar foo test > /dev/null 2>&1
    ```

- The following command might not work as expected:

    ```shell
    ls bar foo test 2>&1 > /dev/null
    #ls: test: No such file or directory
    ```

    For more information, see [Stackoverflow/16283739](https://stackoverflow.com/a/16283739/22557497).

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

## History expansion

Bash provides a history expansion feature that enables you to recall or edit commands from the history list using [event designators](https://www.gnu.org/software/bash/manual/html_node/Event-Designators.html).

The following is an example:

```shell
$ cd Projects/docs-1
$ find . -name "TOC.md"
./TOC.md
$ cd ../docs-2

# Refer to the command 2 lines back.
$ !-2
find . -name "TOC.md"
./TOC.md
$ history | grep "find"
10000  find . -name "TOC.md"

# Refer to command line 10000.
$ !10000
find . -name "TOC.md"
./TOC.md
```

:::info quote

- Use touch to create a new file called `semester` in `missing`.
- Write the following into that file, one line at a time:

    ```bash
    #!/bin/sh
    curl --head --silent https://missing.csail.mit.edu
    ```

    The first line might be tricky to get working. It’s helpful to know that `#` starts a comment in Bash, and `!` has a special meaning even within double-quoted (`"`) strings. Bash treats single-quoted strings (`'`) differently: they will do the trick in this case.

—[The Missing Semester of Your CS Education > Course overview + the shell > Exercises](https://missing.csail.mit.edu/2020/course-shell/)

:::

Using double-quoted strings here returns an error:

```bash
echo "#!/bin/sh\ncurl --head --silent https://missing.csail.mit.edu" > semester
#sh: event not found: /bin/sh\ncurl
```

To complete this task, use the following command:

```shell
echo '#!/bin/sh\ncurl --head --silent https://missing.csail.mit.edu' > semester
cat semester
```

The output is as follows:

```shell
#!/bin/sh
curl --head --silent https://missing.csail.mit.edu
```

For more details, refer to [History Expansion](https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html).

## Remove a substring from a string

You can get more solutions from [Stackoverflow/16623835](https://stackoverflow.com/questions/16623835/remove-a-fixed-prefix-suffix-from-a-string-in-bash).

For more details about `#`, `##`, `%`, and `%%`, refer to [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html).

### Remove the prefix using `#`

In `${parameter#word}`, `#` is used to remove the **shortest matching pattern** `word` from the beginning of `parameter`.

```bash
var="test-123"
echo "${var#test-}" # 123
```

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

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

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

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

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

:::

### Remove the suffix using `%`

In `${parameter%word}`, `%` is used to remove the **shortest matching pattern** `word` word from the end of `parameter`.

```bash
var="test-123"
echo "${var%-123}" # test
```

<codapi-snippet sandbox="bash" editor="basic" init-delay="500">
</codapi-snippet>

:::tip

What is the difference between `%` and `%%`?

- `%` removes the **shortest** matching pattern `word` from the end of `parameter`.
- `%%` removes the **longest** matching pattern `word` from the end of `parameter`.

:::
