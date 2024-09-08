---
sidebar_label: "Deploy OpenAPI using Netlify"
title: "How to Deploy an OpenAPI Documentation on Netlify"
description: "Introduce how to deploy an OpenAPI documentation using GitHub API and `redoc-cli` on Netlify."
---
## Scenario

1. There is an API definition file `open-api-swagger.json` in a private repository `production/api` and I have no write access to it.
2. I want to deploy a preview website of the `open-api-swagger.json`:
    - test some Redoc configuration in my repository `Oreoxmt/preview-api`
    - build the `open-api-swagger.json` specification file into an HTML file `index.html` using [`redoc-cli build`](https://redocly.com/docs/redoc/deployment/cli/#redoc-cli-commands)
    - deploy it on Netlify or other services

<!-- truncate -->

## Step 1. Import my repository to Netlify

:::info
For more details, refer to [Import from an existing repository](https://docs.netlify.com/welcome/add-new-site/#import-from-an-existing-repository).
:::

1. Log in to [Netlify](https://app.netlify.com).

2. In the **Team overview** page, click **Add new site** and select **Import an existing project**.

3. Connect to Git provider using the **GitHub** option and select the `Oreoxmt/preview-api` repository.

4. Select **Deploy site**.

## Step 2. Get the private repository content using GitHub API

To get the repository content of the `open-api-swagger.json` in the `production/api` repository, you can use the GitHub API. For more details, refer to [Get repository content](https://docs.github.com/en/rest/repos/contents#get-repository-content).

:::caution
To get the repository content, you need to [create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) first.
:::

The cURL code sample in GitHub Docs is as follows:

```bash
curl \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token <TOKEN>" \
  https://api.github.com/repos/OWNER/REPO/contents/PATH
```

Replace `<TOKEN>` with your personal access token and replace `<OWNER>`, `<REPO>`, and `PATH` with the repository owner, repository name and the path of repository content you want to get. The following is an example:

```bash
curl --request GET \
  --url https://api.github.com/repos/production/api/contents/open-api-swagger.json \
  --header 'Accept: application/vnd.github+json' \
  --header 'Authorization: token <MY-TOKEN>'
```

The output is as follows:

```json
{
  "type": "file",
  "encoding": "base64",
  "size": 5362,
  "name": "open-api-swagger.json",
  "path": "open-api-swagger.json",
  // highlight-start
  "content": "encoded content ...",
  // highlight-end
  "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
  "url": "https://api.github.com/repos/production/api/contents/open-api-swagger.json",
  "git_url": "https://api.github.com/repos/production/api/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
  "html_url": "https://github.com/production/api/blob/master/open-api-swagger.json",
  "download_url": "https://raw.githubusercontent.com/production/api/master/open-api-swagger.json",
  "_links": {
    "git": "https://api.github.com/repos/production/api/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
    "self": "https://api.github.com/repos/production/api/contents/open-api-swagger.json",
    "html": "https://github.com/production/api/blob/master/open-api-swagger.json"
  }
}
```

The preceding `"content"` is a base64 encoded string of the `open-api-swagger.json` file. To decode the file, you can refer to the [answer in Stack Overflow](https://stackoverflow.com/a/70136393) using the following command:

```bash
curl --request GET \
  --url https://api.github.com/repos/production/api/contents/open-api-swagger.json \
  --header 'Accept: application/vnd.github+json' \
  // highlight-start
  --header 'Authorization: token <MY-TOKEN>' \
  | jq -r ".content" | base64 --decode
  // highlight-end
```

The output is as follows:

```json
{
  "swagger": "3.0",
  "info": {
    ...
  },
  ...
}
```

It is not reasonable to use the `base64` command to decode. So, I read the [About the Repository contents API](https://docs.github.com/en/rest/repos/contents#about-the-repository-contents-api) again. To retrieve the contents of the JSON file, you can use the `.raw` media type. The following is an example:

```bash
curl --request GET \
  --url https://api.github.com/repos/production/api/contents/open-api-swagger.json \
  // highlight-start
  --header 'Accept: application/vnd.github.raw' \
  // highlight-end
  --header 'Authorization: token <MY-TOKEN>'
```

The output is the original content as follows:

```json
{
  "swagger": "3.0",
  "info": {
    ...
  },
  ...
}
```

## Step 3. Configure the build settings

After the step 2, you can get the JSON content of the `open-api-swagger.json` file. To execute the command using Netlify, you can refer to [Build configuration overview](https://docs.netlify.com/configure-builds/overview/).

- Set a `GITHUB_TOKEN` **environment variable**.

    For security reason, it is recommended to set a `GITHUB_TOKEN` environment variable and use the variable to get the repository content.

    It is easy to [declare variables](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables). In the Netlify UI, under **Site settings > Build & deploy > Environment > Environment variables**, you can click **Edit variables** and create a new variable named `GITHUB_TOKEN`. To use the variable in build commands, the following is an example:

    ```bash
    curl --request GET \
    --url https://api.github.com/repos/production/api/contents/open-api-swagger.json \
    --header 'Accept: application/vnd.github.raw' \
    // highlight-start
    --header "Authorization: token $GITHUB_TOKEN"
    // highlight-end
    ```

  :::info

  Difference between single and double quotes in Bash:

  Single quotes won't interpolate anything, but double quotes will. For example: variables, backticks, certain `\` escapes, etc.

  ```shell-session
  $ echo "$(echo "upg")"
  upg
  $ echo '$(echo "upg")'
  $(echo "upg")
  ```

  —— [Stack Overflow](https://stackoverflow.com/a/6697781)

  :::

- Build the JSON file into an HTML file `index.html`.

    To build the specification file into an HTML file, you can use the following [`redoc-cli build`](https://redocly.com/docs/redoc/deployment/cli/#redoc-cli-commands) command:

    ```bash
    redoc-cli build openapi-spec.swagger.json -o build/index.html
    ```

- Configure the build settings.

    For more information about common configuration directives, refer to [Framework integrations](https://docs.netlify.com/integrations/frameworks/).

    - Set the build command to the following:

    ```bash
    curl --request GET --url https://api.github.com/repos/production/api/contents/open-api-swagger.json --header 'Accept: application/vnd.github.raw' --header "Authorization: token $GITHUB_TOKEN" -O && redoc-cli build openapi-spec.swagger.json -o build/index.html
    ```

  :::tip

  The [curl `-O` option](https://curl.se/docs/manpage.html#-O) extracts the name in the given URL and saves the file content to the extracted name (which is `open-api-swagger.json` in the preceding command).

  :::

    - Set the publish directory to `build`

Then, you can trigger a deployment and preview the website on the **Deploys** page.
