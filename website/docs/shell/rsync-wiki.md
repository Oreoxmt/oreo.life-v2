---
title: "rsync"
description: "Introduce the rsync tool."
---

[Rsync (Remote sync)](https://linux.die.net/man/1/rsync) 是一个文件同步工具，可以用于同步以下文件：

- 本地文件与本地文件，类似 [`cp`](https://linux.die.net/man/1/cp) 命令
- 本地文件与远端文件，类似 [`scp`](https://linux.die.net/man/1/scp) 命令

与 `cp` 和 `scp` 等文件全量复制工具不同的是，Rsync 可以实现**增量同步**，即只同步文件的修改部分，而不是复制整个文件。所以 Rsync 适合用于文件数量多、文件体积大的场景。

默认情况下，Rsync 只会同步文件大小修改或最后修改时间修改的文件。如果需要同步内容修改的文件，需要使用 [`--checksum`](#-c---checksum) 选项。

## 示例：一个增强版的 `cp`

下面示例是用于将本地 `docs/markdown-pages/` 目录及其子目录 (`--include='*/'`) 中的 `TOC.md`、`_index.md` 和 `_docHome.md` 文件同步到本地 `docs-scaffold/markdown-pages/` 目录中 (`--include='TOC.md' --include='_index.md' --include='_docHome.md' --exclude='*'`)。同时保证 `docs-scaffold/markdown-pages/` 中只有这三个文件 ([`--delete`](#--delete))。

```bash
SRC="docs/markdown-pages/"
DEST="docs-scaffold/markdown-pages/"

rsync -av --delete --checksum --include='*/' --include='TOC.md' --include='_index.md' --include='_docHome.md' --exclude='*' "$SRC" "$DEST"
```

与 `cp "$SRC" "$DEST"` 不同的是，上面的 `rsync` 命令可以实现**更细粒度**的文件同步，例如只同步指定的文件、保持目标目录中只有指定的文件等。当 `docs-scaffold` 目录存在但是 `markdown-pages` 目录不存在时，`cp` 命令会报错，而 `rsync` 命令会自动创建 `markdown-pages` 目录。

:::tip

在下面命令中，如果 `docs-scaffold/markdown-pages` 目录不存在，`rsync` 会报错。

```bash
rsync docs/markdown-pages/ docs-scaffold/markdown-pages/test/
```

:::

## 过滤规则

:::info quote

The filter rules allow for flexible selection of which files to transfer (include) and which files to skip (exclude). The rules either directly specify include/exclude patterns or they specify a way to acquire more include/exclude patterns (e.g. to read them from a file).

As the list of files/directories to transfer is built, rsync checks each name to be transferred against the list of include/exclude patterns in turn, and the first matching pattern is acted on: if it is an exclude pattern, then that file is skipped; if it is an include pattern then that filename is not skipped; if no matching pattern is found, then the filename is not skipped.

Rsync builds an ordered list of filter rules as specified on the command-line.

—[Filter Rules](https://linux.die.net/man/1/rsync)
:::

在使用 [`--include`](#--includepattern) 和 [`--exclude`](#--excludepattern) 时，Rsync 的过滤规则工作原理如下：

1. 从命令行参数中读取 `--include` 和 `--exclude` 规则，按照命令行参数的顺序，将规则添加到过滤规则列表中。
2. 对于每一个文件和目录，Rsync 会从过滤规则列表的头部开始，检查它是否匹配列表中的每一个模式。它会在找到第一个匹配的模式时停止。

   - 如果符合 `--exclude` 规则，则跳过该文件。
   - 如果符合 `--include` 规则，则不跳过该文件。
   - 如果没有匹配的规则，则不跳过该文件。

所以同时使用 `--include` 和 `--exclude` 时，需要注意规则的顺序。

- 下面 `rsync` 命令会跳过所有文件：

    ```bash
    rsync -av --exclude='*' --include='*.md' --exclude='*.txt' "$SRC" "$DEST"
    ```

- 下面 `rsync` 命令会同步所有文件，不仅仅是 `.md` 文件：

    ```bash
    rsync -av --include='*.md' "$SRC" "$DEST"
    ```

## 选项

### `-a`, `--archive`

`-a` 选项等价于 `-rlptgoD`，即**递归** (`-r`) + **保留所有属性** (`-lptgoD`)。

### `--delete`

`--delete` 选项会让 Rsync 删除目标目录中存在但是源目录中不存在的文件。可以用于保持目标目录与源目录的一致性。

### `--include=PATTERN`

`--include` 选项用于指定需要同步的文件。`--include='*'` 表示同步所有文件。关于过滤规则的更多信息，参考[过滤规则](#过滤规则)。

### `--exclude=PATTERN`

`--exclude` 选项用于指定哪些文件应该被忽略。`--exclude='*'` 表示忽略所有文件。关于过滤规则的更多信息，参考[过滤规则](#过滤规则)。

### `-v`, `--verbose`

`-v` 选项可以让 Rsync 输出一些基本的信息，例如哪些文件被同步了。

`-vv` 选项可以让 Rsync 输出更详细的信息，可以在 debug 时使用。

### `-c`, `--checksum`

默认情况下，Rsync 只会同步文件大小修改或最后修改时间修改的文件。如果需要更精确地判断文件是否需要同步，可以使用 `--checksum` 选项，这样 Rsync 会检查文件的 checksum 值是否变化。

:::note

计算和校验 checksum 的过程会消耗大量的 IO 资源，所以会导致同步速度变慢。

:::

### `-m`, `--prune-empty-dirs`

`-m` 选项可以让 Rsync 不同步空的目录。

例如，下面的命令会同步 `docs/markdown-pages/` 目录及其子目录中的所有文件，包括空的目录。

```bash
rsync -av docs/markdown-pages/ docs-scaffold/markdown-pages/
```

如果不想同步空的目录，可以使用 `-m` 选项。

```bash
rsync -avm docs/markdown-pages/ docs-scaffold/markdown-pages/
```
