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
This command uses a pipe (|) to chain together several commands:

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

## [`git fetch`](https://git-scm.com/docs/git-fetch)

### How to fetch the remaining commits after creating a shallow clone?

After [creating a shallow clone](#how-to-create-a-shallow-clone), you can use the following command to fetch the remaining commits.

```bash
git fetch --unshallow
```

The `git pull --unshallow` command is equivalent to the preceding command.


## [`git log`](https://git-scm.com/docs/git-log)

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
