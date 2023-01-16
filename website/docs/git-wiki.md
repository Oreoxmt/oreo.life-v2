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

  ```
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
