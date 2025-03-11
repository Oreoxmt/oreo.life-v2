---
sidebar_label: "Git"
title: "Reading List about Git"
description: "Something I have learned about Git"
---

## Lists

|                          Reading List                          |                   Inspiration                   |
|:--------------------------------------------------------------:|:-----------------------------------------------:|
| [Things I wish everyone knew about Git (Part I)](#git-part-1)  | _The opposite of `git-push` is not `git-pull`._ |
| [Things I wish everyone knew about Git (Part II)](#git-part-2) |     _Good advice is commit early and often_     |

## [Things I wish everyone knew about Git (Part I)](https://blog.plover.com/prog/git/tips.html) {#git-part-1}

:::info quote

I don't need to know how it works. I just want to know which commands to run. But with Git, this does not work.
—[Mark Dominus](https://blog.plover.com/meta/about-me.html)
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
—[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Since my job now is inseparable from Git, I have learned to use high-level or high-risk commands like `git merge`, `git rebase`, `git reset`, `git amend`, though I still know nothing about Git. You might lose your work if operated incorrectly, but [don't panic](https://blog.plover.com/prog/two-things-about-git.html), just backup before executing high-risk commands and then you can do anything.

## [Things I wish everyone knew about Git (Part II)](https://blog.plover.com/prog/git/tips-2.html) {#git-part-2}

:::info quote

Finding old stuff with `git-reflog`
—[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Though it is really hard to lose work, [`git reflog`](https://git-scm.com/docs/git-reflog) can help you recover some worktree histories. I have not used it before, but I tried it and the command lists the places where `HEAD` has been, which seems useful to me in the future.

:::info quote
Good advice is Commit early and often. If you don't commit, at least add changes with git-add. Files added but not committed are saved in the repository, although they can be hard to find because they haven't been packaged into a commit with a single SHA id.
—[Mark Dominus](https://blog.plover.com/meta/about-me.html)
:::

Yes, it is necessary to commit often with a meaningful commit message.
