---
sidebar_label: "Manage Your Python Projects Using Poetry"
title: "How to Manage Your Python Projects Using Poetry"
description: "Introduce how to manage your Python projects using Poetry."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

前段时间在写 [tidbcloudy](https://github.com/Oreoxmt/tidbcloudy)（一个 TiDB Cloud Python SDK）的时候用到了 [Poetry](https://python-poetry.org) 来管理依赖以及发布到 PyPI。经历了五次小版本的迭代，感觉 Poetry 时常让我有一种“写 SDK 也不难，发版也可以很简单”的错觉，所以决定记录一下我是如何使用 Poetry 来完成我的第一个 SDK 的。

<!-- truncate -->

## Poetry 是什么

> Poetry is a tool for dependency management and packaging in Python. It allows you to declare the libraries your project depends on and it will manage (install/update) them for you. Poetry offers a lockfile to ensure repeatable installs, and can build your project for distribution.

Poetry 是一个管理 Python 依赖的工具，它可以帮助你声明你的项目依赖的库，然后帮你管理（安装/更新）它们。Poetry 提供了一个 `poetry.lock` 文件来确保可复现，也可以将你的项目打包。

## 安装 Poetry

下面以在 Ubuntu 20.04 上安装及使用 Poetry 为例。详细的安装方法，请参考 [Poetry 官方文档](https://python-poetry.org/docs/#installation)。

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

输出结果示例：

```
Retrieving Poetry metadata

# Welcome to Poetry!

This will download and install the latest version of Poetry,
a dependency and package manager for Python.

It will add the `poetry` command to Poetry's bin directory, located at:

/home/oreo/.local/bin

You can uninstall at any time by executing this script with the --uninstall option,
and these changes will be reverted.

Installing Poetry (1.2.2): Creating environment
Installing Poetry (1.2.2): Done

Poetry (1.2.2) is installed now. Great!

You can test that everything is set up by executing:

`poetry --version`
```

查看 Poetry 版本：

```bash
poetry --version
```

输出结果示例：

```
Poetry (version 1.2.2)
```

## 开启 tab 自动补全（可选）

`poetry` 命令支持在 Bash、Fish 和 Zsh 中开启 tab 自动补全功能。详细的开启方法，请参考 [Poetry 官方文档](https://python-poetry.org/docs/#enable-tab-completion-for-bash-fish-or-zsh)。

:::note

在写这篇文章的时候，测试发现 `poetry` Bash 自动补全无法正常使用。具体 issue 可以关注 [#6835](https://github.com/python-poetry/poetry/issues/6835)。

:::

:::tip

查看当前使用的 shell：

```bash
echo $SHELL
```

:::

下面以开启 Zsh 自动补全为例：

```bash
poetry completions zsh > ~/.zfunc/_poetry
```

使用效果：

```
$ poetry [TAB]
about    -- Shows information about Poetry.
add      -- Adds a new dependency to pyproject.toml.
build    -- Builds a package, as a tarball and a wheel by default.
cache    -- Interact with Poetry's cache
check    -- Checks the validity of the pyproject.toml file.
config   -- Manages configuration settings.
debug    -- Debug various elements of Poetry.
env      -- Interact with Poetry's project environments.
export   -- Exports the lock file to alternative formats.
help     -- Display the manual of a command
```

## 初始化项目

<Tabs groupId="poetry-init">
<TabItem value="新项目">

使用 [`poetry new`](https://python-poetry.org/docs/cli/#new) 命令创建并初始化一个新项目 `tidbcloudy`：

```bash
poetry new tidbcloudy
```

输出结果示例：

```bash
Created package tidbcloudy in tidbcloudy
```

查看新创建的 `tidbcloudy` 项目目录结构：

```
$ tree tidbcloudy
tidbcloudy
├── README.md
├── pyproject.toml
├── tests
│   └── __init__.py
└── tidbcloudy
    └── __init__.py

2 directories, 4 files
```

文件说明：

- `README.md`：项目说明文件
- `pyproject.toml`：项目配置文件，包含项目的名称、版本、作者等项目基本信息以及项目的依赖信息等。详细说明可参考 [Poetry 官方文档](https://python-poetry.org/docs/pyproject#the-pyprojecttoml-file)。

    ```toml
    [tool.poetry]
    name = "tidbcloudy"
    version = "0.1.0"
    description = ""
    authors = ["Oreo <aolinz@outlook.com>"]
    readme = "README.md"

    [tool.poetry.dependencies]
    python = "^3.8"

    [build-system]
    requires = ["poetry-core"]
    build-backend = "poetry.core.masonry.api"
    ```

- `tests`：单元测试文件夹
- `tidbcloudy`：项目源码文件夹

</TabItem>
<TabItem value="已有项目">

如果你已经有了一个项目，可以使用 [`poetry init`](https://python-poetry.org/docs/cli/#init) 命令进行初始化：

```bash
cd tidbcloudy
poetry init
```

根据提示输入项目的信息，最后会生成一个 `pyproject.toml` 文件。详细说明可参考 [Poetry 官方文档](https://python-poetry.org/docs/pyproject#the-pyprojecttoml-file)。

```
[tool.poetry]
name = "tidbcloudy"
version = "0.1.0"
description = ""
authors = ["Oreo <aolinz@outlook.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.8"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

</TabItem>
</Tabs>

## 管理依赖

在 `pyproject.toml` 文件中，`tool.poetry.dependencies` 字段用于管理项目的依赖。你可以通过修改该字段或使用 `poetry` 命令来管理依赖。

### 编辑依赖

`tidbcloudy` 是一个 TiDB Cloud SDK，需要使用 `requests` 发送 HTTP 请求。下面提供了直接修改 `pyproject.toml` 文件和使用 [`poetry add`](https://python-poetry.org/docs/cli/#add) 命令两种方式：

<Tabs groupId="poetry-usage">
  <TabItem value="配置文件">

  ```toml title="pyproject.toml"
  [tool.poetry.dependencies]
  // highlight-start
  requests = "^2.27.1"
  // highlight-end
  ```

  </TabItem>
  <TabItem value="命令行">

  ```bash
  poetry add requests@^2.27.1
  ```

  </TabItem>
</Tabs>

### 安装依赖

在完成项目依赖的编辑之后，你可以使用 [`poetry install`](https://python-poetry.org/docs/cli/#install) 命令安装 `pyproject.toml` 中的依赖：

```bash
poetry install
```

在第一次执行 `poetry install` 时，该命令会生成 `poetry.lock` 文件，用于锁定依赖的版本，实现可复现的构建。当项目中已经存在 `poetry.lock` 文件时，`poetry` 会根据 `pyproject.toml` 中的依赖名称和 `poetry.lock` 中具体的版本及 Hash 等信息来安装依赖。

:::note

如果你通过编辑 `pyproject.toml` 文件来更新依赖，可能会出现 `pyproject.toml` 与 `poetry.lock` 文件不一致的情况，你可以通过如下方式解决：

- 执行 [`poetry update`](https://python-poetry.org/docs/cli/#update) 命令来更新 `poetry.lock` 文件并安装依赖
- 执行 [`poetry lock`](https://python-poetry.org/docs/cli/#lock) 命令来更新 `poetry.lock` 文件，然后执行 [`poetry add`](https://python-poetry.org/docs/cli/#add) 安装依赖。

:::

## 管理项目版本

你可以通过修改 `pyproject.toml` 文件或使用 [`poetry version`](https://python-poetry.org/docs/cli#version) 来管理项目版本。

<Tabs groupId="poetry-usage">
  <TabItem value="配置文件">

  ```toml title="pyproject.toml"
  [tool.poetry]
  // highlight-start
  version = "0.1.1"
  // highlight-end
  ```

  </TabItem>
  <TabItem value="命令行">

  ```bash
  poetry version 0.1.1
  ```

  </TabItem>
</Tabs>

## 发布项目

下面以发布 `tidbcloudy` 项目到 [PyPI](https://pypi.org/) 为例。

### 配置 token

参考 [PyPI 官方文档](https://pypi.org/help/#apitoken) 申请你的 PyPI token，然后使用 [`poetry config`](https://python-poetry.org/docs/cli/#config) 命令配置：

```bash
poetry config pypi-token.pypi my-token
```

### 打包

使用 [`poetry build`](https://python-poetry.org/docs/cli/#build) 命令打包：

```bash
poetry build
```

输出结果示例：

```
Building tidbcloudy (0.1.1)
  - Building sdist
  - Built tidbcloudy-0.1.1.tar.gz
  - Building wheel
  - Built tidbcloudy-0.1.1-py3-none-any.whl
```

:::note

如果遇到 `[Errno 2] No such file or directory: 'python'` 错误，可以参考 [poetry/issue/6841](https://github.com/python-poetry/poetry/issues/6841#issuecomment-1284590137) 执行如下命令：

```bash
rm -rf $(poetry config virtualenvs.path)/*
```

:::

### 上传

使用 [`poetry publish`](https://python-poetry.org/docs/cli/#publish) 命令上传：

```bash
poetry publish
```

上传完成后，你可以通过 [PyPI](https://pypi.org/) 网站查看你的项目，以及使用 `pip install` 命令进行安装：

```bash
pip install tidbcloudy
```
