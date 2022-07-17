---
layout: post
title: '[轮子再造] 使用 GitHub Actions 自动部署 Hexo 博客 - 上篇'
excerpt: 一个新轮子。再也不用在本地配置环境啦~
date: 2020-09-01 19:00:00
tags:
- Start with Me
- GitHub Actions
- Hexo
---

# [轮子再造] 使用 GitHub Actions 自动部署 Hexo 博客 - 上篇

Oreo 同学最近开始记笔记和写心情了，但是就是不走寻常路偏偏想整一个自己的网站来写博客。正巧之前有一个 oreo.life 的域名，很快就定下来了 Hexo + GitHub Pages + Cloudflare CDN 的方案，Oreo 自己折腾了一段时间，成功部署了现在你看到的博客并在坚持更新，可喜可贺可喜可贺。

但是有个问题，GitHub Pages 对应的 [Repo](https://github.com/Oreoxmt/Oreoxmt.github.io) 存的是渲染过后的 HTML 文件，我们总得有个地方来存原始的 Markdown 文档。于是更新博客首先需要在 `_source` 目录写 Markdown，然后在根目录执行 `hexo generate` 和 `hexo deploy` 更新网站。命令行操作就先不说了，还要研究什么 Node.js、npm 是不是太过分了，在 Windows 配置环境超麻烦的好吗。世界如此美好，我却还要存 node_modules，这样不好，不好。

成，好歹咱也是做过 CI 的，GitHub Actions 也出来一段时间了看起来反响不错，那肯定也可以用 Actions 完成从博客源码到 Pages 部署的完整流程。Google 一搜发现已经有很多很多人做了类似的事情了，但是总有一些小地方不够好看或者是不满足需求，那就只能自己重新造一遍轮子了。

## Hexo 的网页渲染逻辑

说实话这部分，由于我根本不懂 JS 所以并没有深究，自己大致猜测了一个简化流程：

- 预处理：通过 Front-matter 和文件属性等获得文章类型、标题、时间等信息
- 渲染：将文章信息以及 Markdown 原文喂给渲染器，转成 HTML
- 生成：将一系列的文章信息和 HTML 喂给主题，产生最终的静态网站

渲染这个很好理解，自带的 `hexo-renderer-marked` 渲染器就是通过 `hexo.extend.renderer.register()` 注册了 Markdown 文件的渲染 ([ref](https://github.com/hexojs/hexo-renderer-marked/blob/master/index.js))，Hexo 会在遇到 .md 等后缀的文件的时候就会调用 [`renderer.js`](https://github.com/hexojs/hexo-renderer-marked/blob/master/lib/renderer.js#L120) 里的对应函数，把 .md 转发到 `marked.Renderer` 完成 Markdown 到 HTML 的转换。

生成静态网站的话，可以认为 Hexo 的主题就是一堆 HTML 模板，Hexo 自己集成了几套模板引擎的接口，主题开发者需要按照一定的目录结构来编写主题。完成所有文章的渲染后，Hexo 把文章数据和 HTML 一并喂给模板引擎，产生的就是一个静态网站。

这么看其实还是非常简单的，而且 Hexo 定义了足够多的 [Filter](https://hexo.io/api/filter)（其实我觉得叫做 Hook 更合适），可以在渲染和生成的前后做很多自定义的事情，这么一来可定制性就基本足够了。

## 进行博客配置

之前 Oreo 已经在本地有一份可用的博客源码了，但是为了做一个比较通用的教程，这里还是从零开始进行 Hexo 博客的搭建。

### 初始化 Hexo 博客

使用 `hexo init` 初始化一个新的博客，会产生如下的一个目录结构：

```
|- .gitignore
|- _config.yml
|- package.json
|- scaffolds/
|- source/
   |- _drafts/
   |- _posts/
|- themes/
   |- landscape/
```

- `.gitignore` 是 Hexo 帮我们创建的，里边包含了 Node.js 相关的文件还有 Hexo 的生成目录等条目
- `_config.yml` 是 [Hexo 的配置文件](https://hexo.io/docs/configuration)
- `package.json` 定义了生成 Hexo 博客的一些基础依赖包
- `scaffolds` 是 `hexo new` 时会用到的模板，与生成的静态网页无关，这里可以删掉
- `source/` 是存储博客正文 Markdown 的目录
- `themes/` 是存储博客主题源码的目录，现在包含的是官方默认的 Landscape 主题

由于之前 Oreo 已经选取了 [Fluid](https://fluid-dev.github.io/hexo-fluid-docs/) 作为博客主题，那我们也没有必要保留默认主题了，所以可以直接把 `themes/landscape/` 整个目录删掉。

嗯看起来已经有一个最基本最基本的结构了，Hexo 甚至可以在没有主题的情况下使用 `hexo g` 生成静态网页，只是文件内容全是空的而已... 嗯要不先交个代码？

等等，好像有什么事情没有干...... 哦对当前目录还不是一个 Git repo......

那来吧，先随便写一个 README.md 作为 initial commit 这样：

```shell
$ git init
Initialized empty Git repository in .git/
$ echo "# oreo.life-src" > README.md
$ git add README.md
$ git commit -m "Initial commit"
```

然后把我们现在什么都没有的 Hexo 博客提交上去：

```shell
$ git commit -a -m "Initialize Hexo blog (without theme)"
```

### 使用 git submodules 添加主题

上面提到了，`hexo init` 的时候会在 `themes/landscape` 放一个默认主题。由于我们不用，就把它删了。我们现在要把新的 Fluid 主题加到我们的 Repo 里。

当然可以像 `hexo` 工具一样直接拷贝一份 [Fluid 主题的 release](https://github.com/fluid-dev/hexo-theme-fluid/releases/) 到 `themes/` 下，但是显然「博客的源码包含主题源码的一份拷贝」这件事是非常不合理的，想更新主题版本或者是更换主题的话，会给博客带来一堆不应出现的 commit。于是，我们选择 Git Submodules 来引用 Fluid Repo，这样带来的好处是博客源码只需要记录主题地址和版本 (commit)，其他全部交给 git 来处理，此外博客 Repo 的体积也会相应变小。

直接使用 submodule 命令添加 Fluid 主题源码，并 checkout 到当前的最新版本（需要在 [release 页面](https://github.com/fluid-dev/hexo-theme-fluid/releases/) 查看，本文撰写时为 `v1.8.2`）

```shell
$ git submodule add https://github.com/fluid-dev/hexo-theme-fluid themes/fluid
Cloning into 'themes/fluid'...
Resolving deltas: 100% (2849/2849), done.
$ cd themes/fluid
$ git checkout v1.8.2
Note: checking out 'v1.8.2'.
HEAD is now at c5ff53a :label: 发布 1.8.2 版本
```

这样，我们就在 `themes/fluid` 目录添加了一份主题。在博客源码的目录下，我们看到了这样一个 `.gitmodules` 文件：

```ini
[submodule "themes/fluid"]
	path = themes/fluid
	url = https://github.com/fluid-dev/hexo-theme-fluid.git
```

它代表我们在 `themes/fluid` 目录下，以 submodules 的形式添加了 Fluid 源码 Repo。具体指向的是哪个 Commit，感兴趣的话可以研究一下 `.git/modules/themes/fluid/` 里的文件内容，这里不详述。

修改 `_config.yml` 下的 `theme` 字段：

```yaml
theme: fluid
```

然后执行 `hexo generate`，会发现 Hexo 可以正确在 `public` 目录下生成一份带有主题和 Hello World 博文的静态网页。

然后顺手交个代码吧...

```shell
$ git commit -a -m "Add fluid theme by submodule"
```

## 配置 GitHub Actions

事实上到这里，我们已经实现了「在配置好的环境下，`hexo g` 可以正确生成一份静态网页」这件事。那我们在 GitHub Actions 里做的事情就可以概括成下面的流程了：

1. Clone 博客源码
2. 配置 Node.js 环境
3. 配置 Hexo 环境
4. 使用 `hexo g` 生成静态网页
5. 将 `public/` 目录下的静态网页部署到 GitHub Pages

我们先完成 1-4。

### GitHub Actions 的语法

在这里强烈建议先阅读 [官方指南](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)。本文不会很详细地介绍 Actions 的基础知识。

<details>
  <summary>官方的 Workflow 配置样例</summary>

```yaml
name: Greet Everyone
# This workflow is triggered on pushes to the repository.
on: [push]
jobs:
  build:
    # Job name is Greeting
    name: Greeting
    # This job runs on Linux
    runs-on: ubuntu-latest
    steps:
      # This step uses GitHub's hello-world-javascript-action: https://github.com/actions/hello-world-javascript-action
      - name: Hello world
        uses: actions/hello-world-javascript-action@v1
        with:
          who-to-greet: 'Mona the Octocat'
        id: hello
      # This step prints an output (time) from the previous step's action.
      - name: Echo the greeting's time
        run: echo 'The time was ${{ steps.hello.outputs.time }}.'
```
</details>

看这个 Workflow 配置，其实它非常简单。`name` 定义的是名字，会显示在 Repo 的 Actions 页面；`on` 字段定义的是触发条件，GitHub Actions 定义了一系列的 [Workflow 触发器](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)，例如 Pull Request / Push / 手动触发等；`jobs` 则定义了一个 Workflow 的具体会做什么，我们主要关注 `build/steps` 这个字段。

`build` 也是个名字。`steps` 是一个数组，在执行 `build` 这个任务时，会按照先后顺序触发 `steps` 里的任务。每一项任务可以是使用 `uses` 定义的，调用 GitHub 预置的 (也可以是第三方提供的) 一些函数来进行环境配置、下载源码等操作；也可以是使用 `run` 定义的 Shell 脚本。

### 编写生成博客静态网页的 Workflow 代码

我们先回顾一下需求：在更新博客源码，或者说更新 Markdown 文档时，自动根据博客源码产生静态网页。那翻译成 GitHub 的说法就可以是，「当向 `master` 分支提交代码时，自动触发 Workflow 来生成网页」。那么，配置文件的框架就出来了：

```yaml
name: Generate Hexo Blog
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # To fill...
```

下面我们依次向 `jobs/build/steps` 中添加我们的任务。

第一步，我们需要把博客的源码 clone 到运行环境中。使用 GitHub 官方提供的 [`actions/checkout@v2`](https://github.com/actions/checkout) 来 clone 源码：

```yaml
- name: Checkout source
  uses: actions/checkout@v2
  with:
    submodules: 'true'
```

注意，这里如果不指定 Repo 名称，则默认是当前 Repo，也就是博客源码 Repo。此外，由于我们使用了 submoudule 来配置主题，所以 `submodules` 需要设置成 `true`。这里使用字符串的原因是似乎 [官方 README](https://github.com/actions/checkout#usage) 里写的就是个字符串，这里为了避免产生奇奇怪怪的问题所以就 follow 了。

第二步，配置 Node.js 环境。使用 GitHub 官方提供的 [`actions/setup-node@v1`](https://github.com/actions/setup-node) 来配置：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v1
  with:
    node-version: '12'
```

我们在这里选用最新 LTS，Node.js v12。

第三步，配置 Hexo 环境。首先我们需要安装 Hexo 的命令行工具 `hexo-cli`，此外还需要根据我们 Repo 里的 `package-lock.json` 来安装一个完全一致的 `node_modules` 以还原正确的环境。

```yaml
- name: Setup Hexo environment
  run: |
    npm install -g hexo-cli
    npm ci
```

这里 `run: |` 中的 `|` 是 YAML 的多行字符串语法。

注意，我们这里用的是 `npm ci` 而不是 `npm install`。按照 [官方文档](https://docs.npmjs.com/cli/ci.html)，`npm ci` 会移除现有的 `node_modules` 目录后，按照 `package-lock.json` 的内容来安装依赖包以确保环境完全一致，并且不会修改 `package.json` 和 `package-lock.json`。

到这里，我们就把 Hexo 的环境设置好了。现在我们在当前目录有了博客源码和原始 Markdown 文件、系统中有了 Node.js 和 Hexo、`node_modules` 下有了所有我们需要的依赖，接下来就是：

第四步，生成博客静态网页。

```yaml
- name: Generate pages
  run: |
    hexo generate
    ls -R public/
```

非常简单。到这里就大功告成了。

由于我们还没有添加部署任务，所以先加一个 `ls` 显示 `public/` 下的所有文件，用来确认我们的网页是否被正确生成。

### 将 Workflow 部署到 GitHub Actions

这一步也非常非常简单。把上述 YAML 文件放到 Repo 的 `.github/workflows/` 下，任意命名，保存，提交 Commit。

<details>
  <summary>完整的 Workflow 配置文件</summary>

```yaml
name: Generate Hexo Blog
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout source
      uses: actions/checkout@v2
      with:
        submodules: 'true'
    - name: Setup Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '12'
    - name: Setup hexo environment
      run: |
        npm install -g hexo-cli
        npm ci
    - name: Generate pages
      run: |
        hexo generate
        ls -R public/
```
</details>


然后再添加 Git remote 指向在 GitHub 用于储存博客源码的 Repo 地址（注意不是 Pages 对应的 Repo），执行 `git push` 即可。

稍等片刻，就可以在 Repo 的 Actions 页面下看到一个新触发的任务。不出意外，log 中将显示 Hexo 成功生成了一份静态网页。大功告成~
