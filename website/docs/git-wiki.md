# Git

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## [`git branch`](https://git-scm.com/docs/git-branch)

### How to delete a local branch?

```bash
git branch -D {branch-name}
```

### How to delete all local branches except for the `main` branch?

```bash
git branch | grep -v "main" | xargs git branch -D
```

The following is the detailed explanation according to [ChatGPT](https://openai.com/blog/chatgpt/):

:::info quote
This command uses a pipe (`|`) to chain together several commands:

1. `git branch` lists all of the local branches in the repository.
2. `grep -v "main"` filters out the "main" branch from the list of branches. The `-v` flag inverts the match, so it shows all branches that do not match the pattern `main`.
3. `xargs git branch -D` takes the remaining branches and passes them as arguments to the command `git branch -D`, which deletes the branches.

Please be careful when running this command as it will delete all branches except main.

:::

## [`git clone`](https://git-scm.com/docs/git-clone)

### How to create a shallow clone?

`--depth` is used to specify the number of commits to be cloned. When cloning a large repository, you can use this option to reduce the time required to clone it.

```bash
git clone --depth 1 {YOUR_REPO_URL}
```

And then, you can get only the latest commit.

```bash
cd {YOUR_REPO_NAME}
git log
```

For more information about how to fetch the remaining commits, refer to [How to fetch the remaining commits after creating a shallow clone](#how-to-fetch-the-remaining-commits-after-creating-a-shallow-clone).

## [`git commit`](https://git-scm.com/docs/git-commit)

### How to create an empty commit?

To create an empty commit, you can use the `--allow-empty` option.

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git commit --allow-empty -m "init commit"
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  [main (root-commit) 0b090a0] init commit
  ```

  </TabItem>
</Tabs>

You can also use the `--allow-empty-message` option to create an empty commit with an empty commit message.

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git commit --allow-empty-message --allow-empty
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  [main 0b090a0]
  ```

  </TabItem>
</Tabs>

This is useful in the following scenarios:

- to create the first commit of a new project (initial commit)
- to trigger a CI/CD pipeline

## [`git fetch`](https://git-scm.com/docs/git-fetch)

### How to fetch the remaining commits after creating a shallow clone?

After [creating a shallow clone](#how-to-create-a-shallow-clone), you can use the following command to fetch the remaining commits.

```bash
git fetch --unshallow
```

The `git pull --unshallow` command is equivalent to the preceding command.

## [`git log`](https://git-scm.com/docs/git-log)

### How to show the commit logs of a specific file?

```bash
git log {FILE_PATH}
```

### How to show the latest commit log of a specific file?

To limit the number of commits to output, use the [`-<number>`, `-n <number>`, `--max-count=<number>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt--ltnumbergt) option:

```bash
git log -1 {FILE_PATH}
# git log -n 1 {FILE_PATH}
# git log --max-count=1 {FILE_PATH}
```

### How to show the commit logs without paging?

```bash
git --no-pager log
```

### How to show commit logs in a custom format?

To pretty-print the commit logs in a given format, use the [`--format=<format>`](https://git-scm.com/docs/git-log#Documentation/git-log.txt---formatltpatterngt) option. For more details, refer to [Pretty Formats](https://git-scm.com/docs/pretty-formats).

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git log -1 --format=format:"%at,%H,%an,%as,%ar%n"
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  1676889306,b364250639205bd054ada454749a0dc123456789,AuthorName,2023-01-01,10 days ago
  ```

  </TabItem>
</Tabs>

The description of the format is as follows:

- `%at`: The author date, **UNIX** timestamp.
- `%H`: The commit hash.
- `%an`: The author name.
- `%as`: The author date in the `YYYY-MM-DD` format.
- `%ar`: The author date, relative format.

### How to find which commit introduced/deleted a specific text?

Refer to [this answer](https://stackoverflow.com/a/12591569).

```bash
git log -c -S "text" {file-path}
```

The following is an example of finding the commit that introduced `Reading List` in the `website/sidebars.js` file.

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git log -c -S "Reading List" website/sidebars.js
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  commit 53c6c72c60579d3f5fc2014b73ea9183dcad22e5
  Date:   Sun Jul 31 08:26:34 2022 +0800

      add git group in reading list

  diff --git a/website/sidebars.js b/website/sidebars.js
  index b757a3f..d8ee08f 100644
  --- a/website/sidebars.js
  +++ b/website/sidebars.js
  @@ -19,6 +19,16 @@ const sidebars = {
    // But you can create a sidebar manually
    docs: [
      'intro',
  +    {
  +      type: 'category',
  +      label: 'My Reading List',
  +      link:{
  +        type: 'generated-index',
  +      },
  +      items: [
  +        'reading-list/git',
  +      ],
  +    },
      {
        type: 'category',
        label: 'Python',
  ```

  </TabItem>
</Tabs>

### How to find which commit deleted a specific file?

```bash
git log --diff-filter=D -- {FILE_PATH}
```

The following is an example of finding the commit that deleted `frontend/src/types/sqlReviewConfig.yaml` file in the `bytebase/bytebase` repository.

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git log --diff-filter=D -- frontend/src/types/sqlReviewConfig.yaml
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  commit 660487fc99e62a4a8e2faf8afc0c1a920d91598f
  Author: ecmadao <wlec@outlook.com>
  Date:   Wed Jul 27 01:44:11 2022 +0800

      chore: update sql review config file (#2032)

      * chore: update sql review config file

      * chore: add comment

      * chore: fix lint
  ```

  </TabItem>
</Tabs>

### How to find which commit changed a specific file?

```bash
git log --full-history -- {FILE_PATH}
```

Refer to [this answer](https://stackoverflow.com/a/7203551).

The following is an example of finding the commit that changed `frontend/src/types/sqlReviewConfig.yaml` file in the `bytebase/bytebase` repository.

<Tabs>
  <TabItem value="command" label="Command">

  ```bash
  git log --full-history -- frontend/src/types/sqlReviewConfig.yaml
  ```

  </TabItem>
  <TabItem value="output" label="Output">

  ```bash
  commit 660487fc99e62a4a8e2faf8afc0c1a920d91598f
  Author: ecmadao <wlec@outlook.com>
  Date:   Wed Jul 27 01:44:11 2022 +0800

      chore: update sql review config file (#2032)

      * chore: update sql review config file

      * chore: add comment

      * chore: fix lint

  commit f778edb7b574769430025be3871f7fb9b6b7cc0c
  Author: ecmadao <wlec@outlook.com>
  Date:   Mon Jul 25 10:49:08 2022 +0800

      chore: update the naming convention for drop table (#1993)

      * chore: update the naming convention for drop table

      * chore: update the default value

  commit d4a48e71b753927619358b42157c7149f0e8f5fd
  Author: ecmadao <wlec@outlook.com>
  Date:   Tue Jul 19 10:06:12 2022 +0800

      chore(sql review): support drop database rule (#1914)

      * chore: support drop db rule
  ```

  </TabItem>
</Tabs>

## [`git rebase`](https://git-scm.com/docs/git-rebase)

### How to retain the commit signature after interactive rebase?

If you sign your commits using GPG, you can add the `--gpg-sign` option or `-S` option to retain the commit signature in the `git rebase -i` command.

```bash
git rebase -i {COMMIT_HASH} --gpg-sign
```

If you sign your commits using the `Signed-off-by` line, you can add the `--signoff` or `-s` option to retain the `Signed-off-by` line in the `git rebase -i` command.

```bash
git rebase -i {COMMIT_HASH} --signoff
```

For more information, see [`git rebase --gpg-sign`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---gpg-signltkeyidgt) and [`git rebase --signoff`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---signoff).

### How to modify the initial commit?

To modify the commit message or author information of your project's initial commit, use the `git rebase -i --root` and `git commit --amend` commands.

**Scenario**: the initial commit message contains a typo and an incorrect author.

1. Set up the project:

    <Tabs>
      <TabItem value="command" label="Command">

      ```shell
      mkdir test
      cd test
      git init
      git commit -m "iinit" --allow-empty
      git log
      ```

      </TabItem>
      <TabItem value="output" label="Output">

      ```bash
      Initialized empty Git repository in test/.git/
      [main (root-commit) abcdefg] iinit
      commit abcdefg
      Author: ttest <ttest@ttest.com>

      iinit
      ```

      </TabItem>
    </Tabs>

2. Start an interactive rebase and change the word "pick" to "edit" in your text editor:

    <Tabs>
      <TabItem value="command" label="Command">

      ```shell
      git rebase -i --root
      # edit abcdefg iinit # empty
      ```

      </TabItem>
      <TabItem value="output" label="Output">

      ```bash
      Stopped at abcdefg...  iinit # empty
      You can amend the commit now, with

        git commit --amend '-S'

      Once you are satisfied with your changes, run

        git rebase --continue
      ```

      </TabItem>
    </Tabs>

3. Amend the commit to fix the message and author:

    <Tabs>
      <TabItem value="command" label="Command">

      ```shell
      git commit --amend -m "init" --author="test <test@test.com>" --allow-empty
      ```

      </TabItem>
      <TabItem value="output" label="Output">

      ```bash
      [detached HEAD 1234567] init
      Author: test <test@test.com>
      ```

      </TabItem>
    </Tabs>

4. Continue the rebase:

    <Tabs>
      <TabItem value="command" label="Command">

      ```shell
      git rebase --continue
      # git push --force
      ```

      </TabItem>
      <TabItem value="output" label="Output">

      ```bash
      Successfully rebased and updated refs/heads/main.
      ```

      </TabItem>
    </Tabs>

## [`git remote`](https://git-scm.com/docs/git-remote)

### How to remove multiple remotes except for the `origin` and `upstream` remotes?

```bash
git remote | grep -vE '^(origin|upstream)$' | xargs -L1 git remote remove
```

1. `git remote` lists all of the remote names.
2. `grep -vE '^(origin|upstream)$'` filters out the `origin` and `upstream` remotes.
3. `xargs -L1 git remote remove`: for each remote, `xargs` runs the `git remote remove` command with the remote name as the argument.
