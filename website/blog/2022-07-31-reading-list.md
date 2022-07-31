---
slug: RL 01 | I don't need to know how it works
title: RL 01 | I don't need to know how it works
authors: [Oreo]
tags: [Reading List, Git]
---

# RL 01 I don't need to know how it works

My Reading List from July 16, 2022 to July 31, 2022.

## Lists

| Reading List | Comments | Tags |
| :---: | :---: | :---: |
| [Things I wish everyone knew about Git (Part I)](#git-part-1) | The opposite of `git-push` is not `git-pull`. | [`Git`](/blog/tags/git) |
| [Things I wish everyone knew about Git (Part II)](#git-part-2) | Type something. | [`Git`](/blog/tags/git) |

## [Things I wish everyone knew about Git (Part I)](https://blog.plover.com/prog/git/tips.html) {#git-part-1}

:::info quote

I don't need to know how it works. I just want to know which commands to run. But with Git, this does not work.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

I have been used GitHub for two years now. Before the spring this year, what I did most frequently is click the buttons on VScode to pull, stage changes, commit changes, and push changes to GitHub. These buttons are all what Git means to me.

On October 8, 2021, I was been asked a question during a Project Management interview. The interviewer asked me "What is git rebase?". I know nothing about that command. After the interview, my friend told me that the `git rebase` is a high-level command.

From the blog, something interesting about Git is:

- > `git-reset` does up to three different things, depending on flags

    For more details, see [git-reset](https://blog.plover.com/prog/git-reset.html).

- > `git-checkout` is worse

    - `git checkout` a file
    - `git checkout` a branch
    - `git checkout` a commit

- > The opposite of `git-push` is not `git-pull`, it's `git-fetch`

To learn the Git underlying model, [Mark Dominus](https://blog.plover.com/meta/about-me.html) recommends to read the magic key [Git from the buttom up](https://jwiegley.github.io/git-from-the-bottom-up/). I have already added the link to my reading list 👀.

:::info quote

It is very hard to permanently lose work. If something seems to have gone wrong, don't panic. Remain calm and ask an expert.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Since my job now is inseparable with Git, I have used `git merge`, `git rebase`, `git reset`, `git amend` those high-level or high-risk commands, though I still know nothing about Git. These commands look high-risk and you might lose your work if operated incorrectly, but [don't panic](https://blog.plover.com/prog/two-things-about-git.html), just backup before your high-risk commands and then you can do anything.

## [Things I wish everyone knew about Git (Part II)](https://blog.plover.com/prog/git/tips-2.html) {#git-part-2}

:::info quote

Finding old stuff with `git-reflog`
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Though it is really hard to lose stuff, you can use [`git reflog`](https://git-scm.com/docs/git-reflog) to find old stuff. I have not used it before, but I tried it and the command lists the places that `HEAD` has been, which seems useful for me in the future.

:::info quote
Good advice is Commit early and often. If you don't commit, at least add changes with git-add. Files added but not committed are saved in the repository, although they can be hard to find because they haven't been packaged into a commit with a single SHA id.
——[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Yes, it is necessary to commit often with a meaningful commit message.

## [Shell productivity tips and tricks](https://blog.balthazar-rouberol.com/shell-productivity-tips-and-tricks.html)

This week, I used <kbd>Control+A</kbd> shortcut to go to the beginning of the line in shell. Twitter recommends a tweet about to me.

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">好奇有些零碎的知识如何系统性学习。在没有一个已经系统学习过的人来带的话，感觉几乎是不可能的任务。<br/><br/>举个例子，readline<br/><br/>直到前几天我才知道，之所以ctrl+a ctrl+e 在zsh里面能进行行首和行尾的跳转，是因为有个东西叫做readline. (1 / N)</p>&mdash; whsloef (@whsloef) <a href="https://twitter.com/whsloef/status/1551586422498291712?ref_src=twsrc%5Etfw">July 25, 2022</a></blockquote>
