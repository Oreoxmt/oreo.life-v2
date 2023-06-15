---
title: "bash"
description: "A collection of useful bash commands and tips."
---

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

