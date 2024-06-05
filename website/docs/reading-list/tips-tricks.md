---
sidebar_label: "Tips & Tricks"
title: "Reading List about Tips & Tricks"
description: "Some tips and tricks about Shell, Linux commands"
---

## Lists

| Reading List | Inspiration |
| :---: | :---: |
| [Shell productivity tips and tricks](#shell-tips) | _We will cover some shell features you can leverage to make your shell do more of the work for you._|
| [6 deprecated Linux commands and the tools you should be using instead](#deprecated-linux-commands) | _Swap your old Linux commands for new and improved alternatives that provide the same functionality, if not more._ |

## [Shell productivity tips and tricks](https://blog.balthazar-rouberol.com/shell-productivity-tips-and-tricks.html) {#shell-tips}

:::info quote
When you are typing in your shell, I suggest you treat the Tab key as a superpower.
:::

Auto-completion is a great feature. I am using  [Fig](https://fig.io) to add visual autocomplete to my shell.

This article introduces some keyboard shortcuts when using the shell or vi. With these shortcuts, you can navigate the current line, edit, cut, paste, and control your terminal.

This week, I found the <kbd>Control+A</kbd> shortcut which is to go to the beginning of the line I am currently typing on. This shortcut saves me from relying on the ←. Shortly after I used the <kbd>Control+A</kbd>, Twitter recommends a tweet below about `readline` to me.

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">好奇有些零碎的知识如何系统性学习。在没有一个已经系统学习过的人来带的话，感觉几乎是不可能的任务。<br/><br/>举个例子，readline<br/><br/>直到前几天我才知道，之所以ctrl+a ctrl+e 在zsh里面能进行行首和行尾的跳转，是因为有个东西叫做readline. (1 / N)</p>&mdash; whsloef (@whsloef) <a href="https://twitter.com/whsloef/status/1551586422498291712?ref_src=twsrc%5Etfw">July 25, 2022</a></blockquote>

:::info quote
The shell uses a library called [`readline`](https://tiswww.case.edu/php/chet/readline/rltop.html) to provide you with many keyboard shortcuts to navigate, edit, cut, paste, search, etc. in the command line.

The default shortcuts are inspired by the [`emacs`](https://www.gnu.org/software/emacs/) terminal-based text editor.

`emacs` isn't the only famous text editor in the history of computers though: another one, dating back from 1976, is [`vi`](https://en.wikipedia.org/wiki/Vi). `vi` and `emacs` are designed in two very different ways, and have two very different logics.
:::

I don't know `readline` before, and I just want to know which shortcuts I can use. But I still add this pages into my reading list 👀.

:::info quote
While the obvious way to re-execute a previous command might seem to just bash on the ↑ key until you find the command you want, there are faster and smarter ways to accomplish this.
:::

I usually type some commands frequently and use ↑ to find commands. The article introduces the <kbd>Control+R</kbd> which helps to navigate through history. This is really useful when API testing 🥳.

## [6 deprecated Linux commands and the tools you should be using instead](https://www.redhat.com/sysadmin/deprecated-linux-command-replacements) {#deprecated-linux-commands}

- To extend regular expression pattern, use `grep -E` instead of `egrep`.
- To search for the specified strings in a file, use `grep -F` instead of `fgrep`.
- To resolve a domain, use `dig` instead of `nslookup`.
- To display network connections, use `ss` instead of `netstat`.
- To get the network interface configuration, use `ip` instead of `ifconfig`.
- To manipulate entries in the kernel routing tables , use `ip route` instead of `route`.