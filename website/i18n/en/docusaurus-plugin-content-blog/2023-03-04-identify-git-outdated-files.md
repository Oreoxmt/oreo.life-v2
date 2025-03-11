---
slug: 2023-03-04-identify-git-outdated-files
title: How to Identify Outdated Files in a Git Repository
authors: [Oreo]
tags: [Git, Shell, Tips & Tricks, How-tos]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Scenario

When maintaining a Git repository, particularly one for documentation, it is common to have files that haven't been updated in a while. To address this issue, you can link a section or sentence in the document to the corresponding code or an existing issue, so that the document can be updated when the code changes or the issue is resolved. This is useful when starting a new project, but it can be difficult to maintain these links for an existing large project.

To identify potential outdated files, you can use the `git log` command to retrieve the last commit log of each file and find long-term inactive files. The following sections describe how to generate a last commit report for a repository and how to write the script step by step.

<!-- truncate -->

## Usage

:::note

If you want to use the script on macOS, you need to first install `gnu-sed` and `findutils`:

```bash
brew install gnu-sed findutils
```

:::

1. Get the [`generate_last_commit_report.sh`](https://gist.github.com/Oreoxmt/862f24cec9a5915c71019dea2795c423) script:
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

2. Clone a documentation repository and check out the branch you want to generate the report for:

    ```bash
    git clone https://github.com/{OWNER}/{REPO}.git {DOC_REPO}
    cd {DOC_REPO}
    git checkout {BRANCH}
    ```

3. Run the `generate_last_commit_report.sh` script to generate a report in Markdown format. The first argument `{DOC_REPO}` is the path to the documentation repository, and the second argument `{OWNER}/{REPO}` is the repository name on GitHub:

    ```bash
    ./scripts/generate_last_commit_report.sh {DOC_REPO} {OWNER}/{REPO}
    ```

## Code reading

The following uses [pingcap/docs](https://github.com/pingcap/docs) as an example to show how to write the script step by step.

```bash
git clone https://github.com/pingcap/docs.git docs
cd docs
```

### Step 1: Get the last commit of a file

1. To get the **commit logs** of a file, use the `git log` command:

    > Wiki: [How to show the commit logs of a specific file?](/git-wiki#how-to-show-the-commit-logs-of-a-specific-file)

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

2. Get the **last** commit log of a file:

    To limit only the last commit to output, you can use the [`-<number>`, `-n <number>`, `--max-count=<number>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt--ltnumbergt) option.

    > Wiki: [How to show the latest commit log of a specific file?](/git-wiki#how-to-show-the-latest-commit-log-of-a-specific-file)

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

3. **Customize** the last commit information of a file:

    To customize the commit logs, you can use the [`--format=format:<string>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---formatltformatgt) option. For more details, refer to [pretty formats](https://git-scm.com/docs/git-log#_pretty_formats).

    The following example uses a custom format to show "last commit time (UNIX), commit hash, author name, last commit date in YYYY-MM-DD format, last commit relative time":

    > Wiki: [How to show commit logs in a custom format?](/git-wiki#how-to-show-commit-logs-in-a-custom-format)

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

4. Get the last commit log of a file **without pager** using the [`-P`, `-no-pager`](https://git-scm.com/docs/git/2.26.0#Documentation/git.txt--P) option:

    > Wiki: [How to show the commit logs without paging?](/git-wiki#how-to-show-the-commit-logs-without-paging)

    ```bash
    git --no-pager log -1 --format=format:"%at,%H,%an,%as,%ar%n" _index.md
    ```

### Step 2: Get the last commit of a repository and sort by commit date

1. Get **all Markdown files** in a repository:

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

    The preceding command uses a `for` loop to iterate all Markdown files. If there is a file with a space in its name, the command handles it incorrectly. For example:

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

    —[SC2044: ShellCheck Wiki](https://www.shellcheck.net/wiki/SC2044)
    :::

    To avoid this issue, you can use the `while read -r` loop to iterate all `.md` files:

    ```bash
    gfind . -name '*.md' | while read -r FILE; do
        echo "$FILE"
    done
    ```

2. Get the last commit log of **all Markdown files in a repository**:

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

3. Remove the `./` prefix from the file path using `sed 's~^./~~'` and then **sort** the results by the Unix timestamp:

    > Wiki: [`sed 's/regexp/replacement/'`](/shell/sed-wiki#sregexpreplacement)

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

4. Remove the meaningless Unix timestamp using `sed -E 's~^[0-9]+,~~'`:

    > Wiki: [`sed -E 's/regexp/replacement/'`](/shell/sed-wiki#-e--r---regexp-extended)

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

### Step 3: Generate the last commit report

To make the report more readable, the following steps generate a Markdown table from the output of the previous step.

1. Change the delimiter in `--format` to `|`, and modify the `sed` command to `'s~^[0-9]+ ~~'`:

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

2. Add a link to the `FILE` file using the GitHub repository address, commit hash value, and file name:

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

3. Add table headers and output it to the `docs_commit_log.md` file:

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

4. Use the `DIR` and `REPO` variables to make the script more generic:

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

5. Use `gfind` and `gsed` to make the script compatible with macOS:

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
