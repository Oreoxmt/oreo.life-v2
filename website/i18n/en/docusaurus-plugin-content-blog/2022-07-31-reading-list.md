---
slug: 2022-07-31-reading-list
title: RL 01 | I Don't Need to Know How It Works
authors: [Oreo]
tags: [Reading List, Git, Tips & Tricks]
---

My Reading List from July 16, 2022 to July 31, 2022.

## Lists

| Reading List | Inspiration | Tags |
| :---: | :---: | :---: |
| [Things I wish everyone knew about Git (Part I)](#git-part-1) | _The opposite of `git-push` is not `git-pull`._ | [Git](/blog/tags/git) |
| [Things I wish everyone knew about Git (Part II)](#git-part-2) | _Good advice is commit early and often_ | [Git](/blog/tags/git) |
| [Shell productivity tips and tricks](#shell-tips) | _We will cover some shell features you can leverage to make your shell do more of the work for you._| [Tips & Tricks](/blog/tags/Tips-Tricks) |
| [6 deprecated Linux commands and the tools you should be using instead](#deprecated-linux-commands) | _Swap your old Linux commands for new and improved alternatives that provide the same functionality, if not more._ | [Tips & Tricks](/blog/tags/Tips-Tricks) |

<!--truncate-->

## [Things I wish everyone knew about Git (Part I)](https://blog.plover.com/prog/git/tips.html) {#git-part-1}

:::info quote

I don't need to know how it works. I just want to know which commands to run. But with Git, this does not work.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

I have been using GitHub for two years. Before the spring this year, what I did most is clicking the buttons in VSCode's Git panel to pull, stage changes, commit, and push to GitHub. These buttons are what "Git everything" means to me.

On October 8, 2021, I was asked a question during a Project Manager interview. The interviewer asked me _"What is `git rebase`?"_. I know nothing about that command. After the interview, my friend told me that the `git rebase` is a _professional_ command, and must be used with caution.

From the blog, something interesting about Git is:

-  `git-reset` does up to three different things, depending on flags. For more details, see [git-reset](https://blog.plover.com/prog/git-reset.html).

-  `git-checkout` is worse.

-  The opposite of `git-push` is not `git-pull`, it's `git-fetch`.

To learn the Git underlying model, [Mark Dominus](https://blog.plover.com/meta/about-me.html) recommends to read the magic key [Git from the bottom up](https://jwiegley.github.io/git-from-the-bottom-up/). I have already added the link to my reading list 👀.

:::info quote

It is very hard to permanently lose work. If something seems to have gone wrong, don't panic. Remain calm and ask an expert.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Since my job now is inseparable from Git, I have learned to use high-level or high-risk commands like `git merge`, `git rebase`, `git reset`, `git amend`, though I still know nothing about Git. You might lose your work if operated incorrectly, but [don't panic](https://blog.plover.com/prog/two-things-about-git.html), just backup before executing high-risk commands and then you can do anything.

## [Things I wish everyone knew about Git (Part II)](https://blog.plover.com/prog/git/tips-2.html) {#git-part-2}

:::info quote

Finding old stuff with `git-reflog`
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Though it is really hard to lose work, [`git reflog`](https://git-scm.com/docs/git-reflog) can help you recover some worktree histories. I have not used it before, but I tried it and the command lists the places where `HEAD` has been, which seems useful to me in the future.

:::info quote
Good advice is Commit early and often. If you don't commit, at least add changes with git-add. Files added but not committed are saved in the repository, although they can be hard to find because they haven't been packaged into a commit with a single SHA id.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Yes, it is necessary to commit often with a meaningful commit message.

## [Shell productivity tips and tricks](https://blog.balthazar-rouberol.com/shell-productivity-tips-and-tricks.html) {#shell-tips}

:::info quote
When you are typing in your shell, I suggest you treat the Tab key as a superpower.
:::

Auto-completion is a great feature. I am using  [Fig](https://fig.io) to add visual autocomplete to my shell.

This article introduces some keyboard shortcuts when using the shell or vi. With these shortcuts, you can navigate the current line, edit, cut, paste, and control your terminal.

This week, I found the <kbd>Control+A</kbd> shortcut which is to go to the beginning of the line I am currently typing on. This shortcut saves me from relying on the ←. Shortly after I used the <kbd>Control+A</kbd>, Twitter recommends a tweet below about `readline` to me.

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">好奇有些零碎的知识如何系统性学习。在没有一个已经系统学习过的人来带的话，感觉几乎是不可能的任务。<br/><br/>举个例子，readline<br/><br/>直到前几天我才知道，之所以ctrl+a ctrl+e 在zsh里面能进行行首和行尾的跳转，是因为有个东西叫做readline. (1 / N)</p>&mdash; whsloef (@whsloef) <a href="https://twitter.com/whsloef/status/1551586422498291712?ref_src=twsrc%5Etfw">July 25, 2022</a></blockquote>

:::info quote
The shell uses a library called [`readline`](https://tiswww.case.edu/php/chet/readline/rltop.html) to provide you with many keyboard shortcuts to navigate, edit, cut, paste, search, etc, in the command line.

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