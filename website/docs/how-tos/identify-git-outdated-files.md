---
sidebar_label: "如何找出 Git 仓库中可能过时的文件"
title: "如何找出 Git 仓库中可能过时的文件"
description: "介绍如何写一个 bash 脚本来找出 Git 仓库中可能过时的文件。"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## 使用场景

在维护 Git 仓库，特别是文档类型的仓库，随着文档数量的增加，很容易出现信息不准确或过时的情况。为了解决这个问题，你可以将文档的内容与对应功能的代码或存在的 issue 绑定，当上游代码发生变化时，自动触发文档的更新。这种方式适合文档项目从 0 到 1 的初期，但是对于已经存在的文档项目重新维护这样的绑定关系就会变得很麻烦。

为了及时发现文档仓库中可能过时的内容，你可以使用 [`git log`](https://git-scm.com/docs/git-log) 命令获取文档的最后一次更新信息，以发现长期未更新的文档。下面具体介绍如何使用 `git log` 生成指定目录下所有 Markdown 文件的最后一次 commit 信息。

<!-- truncate -->

## 使用方法

:::note

如果在 macOS 上使用该脚本，需要先安装 `gnu-sed` 和 `findutils`：

```bash
brew install gnu-sed findutils
```

:::

1. 获取需要使用的脚本 [`generate_last_commit_report.sh`](https://gist.github.com/Oreoxmt/862f24cec9a5915c71019dea2795c423)：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    git clone https://gist.github.com/862f24cec9a5915c71019dea2795c423.git scripts
    chmod +x scripts/generate_last_commit_report.sh
    ```

    </TabItem>
    <TabItem value="script" label="Shell script">

    ```bash title="generate_last_commit_report.sh"
    #!/bin/bash
    set -e

    DIR=$1
    REPO=$2

    FIND=$(which gfind || which find)
    SED=$(which gsed || which sed)

    (
        echo '| File | Last Commit Author | Last Commit Date | Relative Date |'
        echo '| ---- | ------------------ | ---------------- | ------------- |'
        (
            cd "$DIR"
            $FIND . -name '*.md' | $SED 's~^./~~' | while read -r FILE; do
                git --no-pager log -1 --format=format:'%at | '"[$FILE](https://github.com/$REPO/blob/%H/$FILE)"' | %an | %as | %ar |%n' "$FILE"
            done
        ) | sort --numeric-sort | $SED -E 's~^[0-9]+ ~~'
    ) >"$DIR"_commit_log.md
    ```

    </TabItem>
    </Tabs>

2. 获取某个文档仓库、某个分支的最新内容：

    ```bash
    git clone https://github.com/{OWNER}/{REPO}.git {DOC_REPO}
    cd {DOC_REPO}
    git checkout {BRANCH}
    ```

3. 运行 `generate_last_commit_report.sh` 脚本生成报告，其中第一个参数 `{DOC_REPO}` 为要生成报告的文件路径，第二个参数 `{OWNER}/{REPO}` 为文档仓库的 GitHub 地址：

    ```bash
    ./scripts/generate_last_commit_report.sh {DOC_REPO} {OWNER}/{REPO}
    ```

## 源码解读

下面以 [pingcap/docs](https://github.com/pingcap/docs) 为例介绍如何一步步写出这个脚本。

```bash
git clone https://github.com/pingcap/docs.git docs
cd docs
```

### 1. 获取一个文件的最后一次 commit

1. 要获取一个文件的所有 **commit log**，你可以使用 [`git log`](https://git-scm.com/docs/git-log) 命令。下面以 `_index.md` 文件为例：

    > Wiki: [How to show the commit logs of a specific file?](/docs/git-wiki.md#how-to-show-the-commit-logs-of-a-specific-file)

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    git log _index.md
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    commit b364250639205bd054ada454749a0dc8df04d811
    Author: TomShawn <41534398+TomShawn@users.noreply.github.com>
    Date:   Mon Feb 20 18:35:06 2023 +0800

        add 6.6.0 release notes (#12321)

    commit c97100c4832287dd970c10eb5ca43a8a3fcc1a35
    Author: xixirangrang <hfxsd@hotmail.com>
    Date:   Mon Jan 30 14:01:54 2023 +0800

        Update _index.md (#12270)

    commit 8cf82718ba95b00b02beb2ef0786421826545fa7
    Author: Ran <huangran@pingcap.com>
    Date:   Thu Dec 1 11:58:00 2022 +0800

        *: add annotations for l10n (#11468)

    commit d45bb4b2d39d7e7da68bd3f2cedfa98fe41f4a61
    Author: xixirangrang <hfxsd@hotmail.com>
    Date:   Wed Nov 30 10:48:00 2022 +0800

        *: change NewSQL to distributed SQL (#11463)
    :
    ```

    </TabItem>
    </Tabs>

2. 获取指定文件的**最后一次** commit 信息：

    要限制 commit logs 的数量，可以使用 [`-<number>`, `-n <number>`, `--max-count=<number>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt--ltnumbergt) 选项：

    > Wiki: [How to show the latest commit log of a specific file?](/docs/git-wiki.md#how-to-show-the-latest-commit-log-of-a-specific-file)

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    git log -1 _index.md
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    commit b364250639205bd054ada454749a0dc8df04d811
    Author: TomShawn <41534398+TomShawn@users.noreply.github.com>
    Date:   Mon Feb 20 18:35:06 2023 +0800

        add 6.6.0 release notes (#12321)
    ```

    </TabItem>
    </Tabs>

3. **自定义**最后一次 commit 信息的内容：

    如果需要自定义 commit 信息的内容，可以使用 [`--format=format:<string>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---formatltformatgt) 选项。更多使用方法，可参考 [pretty formats](https://git-scm.com/docs/git-log#_pretty_formats)。

    下面示例的自定义格式为：*最后一次 commit 的 UNIX 时间,commit 哈希值,最后一次 commit 作者名称,最后一次 commit 的 YYYY-MM-DD 格式时间,最后一次 commit 的相对时间*：

    > Wiki: [How to show commit logs in a custom format?](/docs/git-wiki.md#how-to-show-commit-logs-in-a-custom-format)

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    git log -1 --format=format:"%at,%H,%an,%as,%ar%n" _index.md
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    1676889306,b364250639205bd054ada454749a0dc8df04d811,TomShawn,2023-02-20,9 days ago
    ```

    </TabItem>
    </Tabs>

4. 使用 [`-P`, `-no-pager`](https://git-scm.com/docs/git/2.26.0#Documentation/git.txt--P) 选项**不分页**输出自定义的 commit 信息：

    > Wiki: [How to show the commit logs without paging?](/docs/git-wiki.md#how-to-show-the-commit-logs-without-paging)

    ```bash
    git --no-pager log -1 --format=format:"%at,%H,%an,%as,%ar%n" _index.md
    ```

### 2. 获取一个仓库所有 Markdown 文件的最后一次 commit 信息并按 commit 日期排序

1. 获取一个仓库**所有 Markdown 文件**：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    for FILE in $(gfind . -name "*.abc"); do
        echo "$FILE"
    done
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    ./upgrade-tidb-using-tiup.md
    ./benchmark/v6.1-performance-benchmarking-with-tpcc.md
    ./benchmark/benchmark-tpch.md
    ./benchmark/v6.0-performance-benchmarking-with-tpcc.md
    ./benchmark/benchmark-sysbench-v4-vs-v3.md
    ```

    </TabItem>
    </Tabs>

    上面使用 `for` 循环遍历所有 `.md` 文件，当一个文件名中包含空格时，上面的命令会将其分割为多个文件名，例如：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    touch "a b c.abc"
    for FILE in $(gfind . -name "*.abc"); do
        echo "$FILE"
    done
    ```

    </TabItem>
    <TabItem value="actual-output" label="Actual output">

    ```bash
    ./a
    b
    c.abc
    ```

    </TabItem>
    <TabItem value="expected-output" label="Expected output">

    ```bash
    ./a b c.abc
    ```

    </TabItem>
    </Tabs>

    :::info quote

    For loops over find output are fragile. Use `find -exec` or a `while read` loop.

    —— [SC2044: ShellCheck Wiki](https://www.shellcheck.net/wiki/SC2044)
    :::

    为了避免这种情况，可以使用 `while read -r` 循环遍历所有 `.md` 文件：

    ```bash
    gfind . -name '*.md' | while read -r FILE; do
        echo "$FILE"
    done
    ```

2. 获取所有 Markdown 文件的**最后一次 commit 信息**：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    gfind . -name '*.md' | while read -r FILE; do
        # highlight-next-line
        git --no-pager log -1 --format=format:"%at,$FILE,%H,%an,%as,%ar%n" "$FILE"
    done
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    1676889306,./upgrade-tidb-using-tiup.md,b364250639205bd054ada454749a0dc8df04d811,TomShawn,2023-02-20,9 days ago
    1654775911,./benchmark/v6.1-performance-benchmarking-with-tpcc.md,41a452b01c2bf6cc002f5186b9ca82cbabb8ba3f,Ran,2022-06-09,9 months ago
    1594713672,./benchmark/benchmark-tpch.md,decf86b4271609e410e5a010c6e608c83b8d49cf,TomShawn,2020-07-14,2 years, 8 months ago
    1649244992,./benchmark/v6.0-performance-benchmarking-with-tpcc.md,61182802103a69f29461097670b087c220d4e6b1,Ran,2022-04-06,11 months ago
    1671763694,./benchmark/benchmark-sysbench-v4-vs-v3.md,288076c2080722d524bd7d1275209c9139c941d0,TomShawn,2022-12-23,10 weeks ago
    ```

    </TabItem>
    </Tabs>

3. 使用 `sed 's~^./~~'` 将输出结果中文件路径的 `./` 前缀删除，然后按照最后一次 commit 对应的 Unix 时间戳**排序**：

    > Wiki: [`sed 's/regexp/replacement/'`](/shell/sed-wiki.md#sregexpreplacement)

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    (
        # highlight-next-line
        gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
            git --no-pager log -1 --format=format:"%at,$FILE,%H,%an,%as,%ar%n" "$FILE"
        done
    # highlight-next-line
    ) | sort --numeric-sort
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    1663658825,auto-random.md,485bd6b46d7b6e3a247bd80c56fbad7f22d7a47c,Aolin,2022-09-20,3 days ago
    1663660145,develop/dev-guide-get-data-from-single-table.md,76e4f85c9cb9f4ff289ff24058490bc81dba68b3,Cheese,2022-09-20,3 days ago
    1663731427,functions-and-operators/string-functions.md,fb4c4a25a4c318ee5872befbe0dc77db836fa2c1,xzhangxian1008,2022-09-21,2 days ago
    1663754703,troubleshoot-data-inconsistency-errors.md,e6cc1dffc4e40870d171b813f08af1e8059580a4,Grace Cai,2022-09-21,2 days ago
    1663757943,TOC.md,00c2a76a616a3ade3987ec60fafe82c3dc314c08,Grace Cai,2022-09-21,2 days ago
    1663757943,tune-operating-system.md,00c2a76a616a3ade3987ec60fafe82c3dc314c08,Grace Cai,2022-09-21,2 days ago
    1663825023,sql-statements/sql-statement-create-index.md,e70cfc3d440520b92cd63d069da2d4ebb4c8a563,Grace Cai,2022-09-22,21 hours ago
    1663847463,encryption-at-rest.md,66ccdb35d497aaff4cb33a449a3b9ceff81e1220,lidezhu,2022-09-22,15 hours ago
    ```

    </TabItem>
    </Tabs>

4. 使用 `sed -E 's~^[0-9]+,~~'` 去掉无意义的 Unix 时间戳：

    > Wiki: [`sed -E 's/regexp/replacement/'`](/shell/sed-wiki.md#-e--r---regexp-extended)

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    (
        gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
            git --no-pager log -1 --format=format:"%at,$FILE,%H,%an,%as,%ar%n" "$FILE"
        done
    # highlight-next-line
    ) | sort --numeric-sort | sed -E 's~^[0-9]+,~~'
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```bash
    auto-random.md,485bd6b46d7b6e3a247bd80c56fbad7f22d7a47c,Aolin,2022-09-20,3 days ago
    develop/dev-guide-get-data-from-single-table.md,76e4f85c9cb9f4ff289ff24058490bc81dba68b3,Cheese,2022-09-20,3 days ago
    functions-and-operators/string-functions.md,fb4c4a25a4c318ee5872befbe0dc77db836fa2c1,xzhangxian1008,2022-09-21,2 days ago
    troubleshoot-data-inconsistency-errors.md,e6cc1dffc4e40870d171b813f08af1e8059580a4,Grace Cai,2022-09-21,2 days ago
    TOC.md,00c2a76a616a3ade3987ec60fafe82c3dc314c08,Grace Cai,2022-09-21,2 days ago
    tune-operating-system.md,00c2a76a616a3ade3987ec60fafe82c3dc314c08,Grace Cai,2022-09-21,2 days ago
    sql-statements/sql-statement-create-index.md,e70cfc3d440520b92cd63d069da2d4ebb4c8a563,Grace Cai,2022-09-22,21 hours ago
    encryption-at-rest.md,66ccdb35d497aaff4cb33a449a3b9ceff81e1220,lidezhu,2022-09-22,15 hours ago
    ```

    </TabItem>
    </Tabs>

### 3. 生成报告

为了方便查看，下面的步骤将输出的结果生成 Markdown 表格。

1. 将 `--format` 中的分隔符改为 `|`，同时将 `sed` 命令修改为 `'s~^[0-9]+ ~~'`：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    (
        gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
            # highlight-next-line
            git --no-pager log -1 --format=format:"%at | $FILE | %H | %an | %as | %ar |%n" "$FILE"
        done
    # highlight-next-line
    ) | sort --numeric-sort | sed -E 's~^[0-9]+ ~~'
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```markdown
    | auto-random.md | 485bd6b46d7b6e3a247bd80c56fbad7f22d7a47c | Aolin | 2022-09-20 | 3 days ago |
    | develop/dev-guide-get-data-from-single-table.md | 76e4f85c9cb9f4ff289ff24058490bc81dba68b3 | Cheese | 2022-09-20 | 3 days ago |
    | functions-and-operators/string-functions.md | fb4c4a25a4c318ee5872befbe0dc77db836fa2c1 | xzhangxian1008 | 2022-09-21 | 2 days ago |
    | troubleshoot-data-inconsistency-errors.md | e6cc1dffc4e40870d171b813f08af1e8059580a4 | Grace Cai | 2022-09-21 | 2 days ago |
    | TOC.md | 00c2a76a616a3ade3987ec60fafe82c3dc314c08 | Grace Cai | 2022-09-21 | 2 days ago |
    | tune-operating-system.md | 00c2a76a616a3ade3987ec60fafe82c3dc314c08 | Grace Cai | 2022-09-21 | 2 days ago |
    | sql-statements/sql-statement-create-index.md | e70cfc3d440520b92cd63d069da2d4ebb4c8a563 | Grace Cai | 2022-09-22 | 22 hours ago |
    | encryption-at-rest.md | 66ccdb35d497aaff4cb33a449a3b9ceff81e1220 | lidezhu | 2022-09-22 | 15 hours ago |
    ```

    </TabItem>
    </Tabs>

2. 使用 GitHub 仓库地址、commit 哈希值以及文件名为文件 `FILE` 添加链接：

    <Tabs>
    <TabItem value="command" label="Command">

    ```bash
    (
        gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
            # highlight-next-line
            git --no-pager log -1 --format=format:'%at | '"[$FILE](https://github.com/pingcap/docs/blob/%H/$FILE)"' | %an | %as | %ar |%n' "$FILE"
        done
    ) | sort --numeric-sort | sed -E 's~^[0-9]+ ~~'
    ```

    </TabItem>
    <TabItem value="output" label="Output">

    ```markdown
    | [functions-and-operators/string-functions.md](https://github.com/pingcap/docs/blob/fb4c4a25a4c318ee5872befbe0dc77db836fa2c1/functions-and-operators/string-functions.md) | xzhangxian1008 | 2022-09-21 | 2 days ago |
    | [troubleshoot-data-inconsistency-errors.md](https://github.com/pingcap/docs/blob/e6cc1dffc4e40870d171b813f08af1e8059580a4/troubleshoot-data-inconsistency-errors.md) | Grace Cai | 2022-09-21 | 2 days ago |
    | [TOC.md](https://github.com/pingcap/docs/blob/00c2a76a616a3ade3987ec60fafe82c3dc314c08/TOC.md) | Grace Cai | 2022-09-21 | 2 days ago |
    | [tune-operating-system.md](https://github.com/pingcap/docs/blob/00c2a76a616a3ade3987ec60fafe82c3dc314c08/tune-operating-system.md) | Grace Cai | 2022-09-21 | 2 days ago |
    | [sql-statements/sql-statement-create-index.md](https://github.com/pingcap/docs/blob/e70cfc3d440520b92cd63d069da2d4ebb4c8a563/sql-statements/sql-statement-create-index.md) | Grace Cai | 2022-09-22 | 22 hours ago |
    | [encryption-at-rest.md](https://github.com/pingcap/docs/blob/66ccdb35d497aaff4cb33a449a3b9ceff81e1220/encryption-at-rest.md) | lidezhu | 2022-09-22 | 15 hours ago |
    ```

    </TabItem>
    </Tabs>

3. 为表格加表头，并输出到文件 `docs_commit_log.md`：

    ```bash
    (
        # highlight-start
        echo '| File | Last Commit Author | Last Commit Date | Relative Date |'
        echo '| ---- | ------------------ | ---------------- | ------------- |'
        # highlight-end
        (
            gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
                git --no-pager log -1 --format=format:'%at | '"[$FILE](https://github.com/pingcap/docs/blob/%H/$FILE)"' | %an | %as | %ar |%n' "$FILE"
            done
        ) | sort --numeric-sort | sed -E 's~^[0-9]+ ~~'
    )>"$PWD"/docs_commit_log.md
    ```

4. 使用 `DIR` 和 `REPO` 变量，使脚本更通用：

    ```bash
    #!/bin/bash
    set -e

    # highlight-start
    DIR=$1
    REPO=$2
    # highlight-end

    (
        echo '| File | Last Commit Author | Last Commit Date | Relative Date |'
        echo '| ---- | ------------------ | ---------------- | ------------- |'
        (
            cd "$DIR"
            gfind . -name '*.md' | sed 's~^./~~' | while read -r FILE; do
                git --no-pager log -1 --format=format:'%at | '"[$FILE](https://github.com/$REPO/blob/%H/$FILE)"' | %an | %as | %ar |%n' "$FILE"
            done
        ) | sort --numeric-sort | sed -E 's~^[0-9]+ ~~'
    )>"$PWD"/docs_commit_log.md
    ```

5. 为了兼容 macOS，在脚本中使用 `gfind` 和 `gsed`：

    ```bash
    #!/bin/bash
    set -e

    DIR=$1
    REPO=$2

    # highlight-start
    FIND=$(which gfind || which find)
    SED=$(which gsed || which sed)
    # highlight-end

    (
        echo '| File | Last Commit Author | Last Commit Date | Relative Date |'
        echo '| ---- | ------------------ | ---------------- | ------------- |'
        (
            cd "$DIR"
            $FIND . -name '*.md' | $SED 's~^./~~' | while read -r FILE; do
                git --no-pager log -1 --format=format:'%at | '"[$FILE](https://github.com/$REPO/blob/%H/$FILE)"' | %an | %as | %ar |%n' "$FILE"
            done
        ) | sort --numeric-sort | $SED -E 's~^[0-9]+ ~~'
    ) >"$PWD"/docs_commit_log.md
    ```
