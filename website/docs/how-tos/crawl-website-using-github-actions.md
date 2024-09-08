---
sidebar_label: "Crawl Your Website Automatically Using GitHub Actions"
title: "How to Crawl Your Website Automatically Using GitHub Actions"
description: "Introduce how to configure Algolia DocSearch for your Docusaurus website and crawl your website automatically using GitHub Actions."
---

This document introduces how to configure [Algolia DocSearch](https://docsearch.algolia.com) for your [Docusaurus](https://docusaurus.io/docs) website and crawl your website automatically using GitHub Actions.

<!-- truncate -->

## Step 1: Apply for Algolia DocSearch

Algolia DocSearch provides a free service for open-source projects. If your website is open-source, you can apply for Algolia DocSearch by [filling out the form](https://docsearch.algolia.com/apply/). For more details, refer to [Who can apply for DocSearch?](https://docsearch.algolia.com/docs/who-can-apply/).

After applying, you will receive an invitation email from Algolia DocSearch. After accepting the invitation, you can manage your website crawler in the [Algolia Crawler](https://crawler.algolia.com/) and access your data in the [Algolia Dashboard](https://algolia.com/dashboard).

## Step 2: Configure Algolia in Docusaurus

In the `docusaurus.config.js` file, add the following configuration:

```javascript title="docusaurus.config.js"

/** @type {import('@docusaurus/types').Config} */
const config = {
    // ...
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // ...
      // highlight-start
      algolia: {
        appId: 'ALGOLIA_APPLICATION_ID',
        apiKey: 'ALGOLIA_SEARCH_API_KEY',
        indexName: 'ALGOLIA_INDEX_NAME',
      },
      // highlight-end
    }),
};

module.exports = config;
},
```

To get `appId` and `apiKey`, follow the steps below:

1. Log in to the [Algolia Dashboard](https://algolia.com/dashboard) and navigate to the [**API Keys**](https://www.algolia.com/account/api-keys/all) page.

2. On the **API Keys** page, select your **Application** and you can see the **Application ID** (`appId`) and **Search API Key** (`apiKey`).

:::note

The `apiKey` is a public key and you can commit it to your repository.

:::

To get the `indexName`, follow the steps below:

1. Log in to the [Algolia Dashboard](https://algolia.com/dashboard).

2. In the left navigation pane, click **Data sources** and then click **Indices**.

3. On the **Indices** page, select your **Application** and you can see all indices of this application. The **Index** field corresponds to `indexName`.

For more details, refer to [Docusaurus: connecting Algolia](https://docusaurus.io/docs/search#connecting-algolia) and [DocSearch: API reference](https://docsearch.algolia.com/docs/api/#searchparameters).

## Step 3: Crawl your website automatically

:::info quote

How often will DocSearch crawl my website?

Crawls are scheduled at a random time once a week. You can [configure this schedule from the config file](https://www.algolia.com/doc/tools/crawler/apis/configuration/schedule/) or trigger one manually from [the Crawler interface](https://crawler.algolia.com/).

——[Algolia Support](https://support.algolia.com/hc/en-us/articles/10156769900945-How-often-will-DocSearch-crawl-my-website-)

:::

If you want to trigger Algolia Crawler every time you update your website, you can use the [`algoliasearch-crawler-github-actions`](https://github.com/algolia/algoliasearch-crawler-github-actions).

1. Get the **Crawler User ID**, **Crawler API Key**, **Application ID**, and **API Key** of your Algolia account. **Application ID** and **API Key** are the same as the `appId` and `apiKey` in the previous step. To get **Crawler User ID** and **Crawler API Key**, follow the steps below:

    1. Log in to the [Algolia Crawler](https://crawler.algolia.com/) and navigate to the [**Account settings**](https://crawler.algolia.com/admin/user/settings/) page.
    2. On the **Account settings** page, you can see the **Crawler User ID** (`ALGOLIA_CRAWLER_USER_ID`) and **Crawler API Key** (`ALGOLIA_CRAWLER_API_KEY`).

2. Configure the following secrets in the **Settings** > **Secrets and variables** > **Actions** page of your GitHub repository:

    - `ALGOLIA_CRAWLER_USER_ID`: the **Crawler User ID** of your Algolia Crawler account.
    - `ALGOLIA_CRAWLER_API_KEY`: the **Crawler API Key** of your Algolia Crawler account.
    - `ALGOLIA_APPLICATION_ID`: the **Application ID** of your Algolia account.
    - `ALGOLIA_API_KEY`: the **API Key** of your Algolia account.

3. Create a new workflow in your GitHub repository.

    The following example shows how to trigger Algolia Crawler when you push to the `main` branch or manually trigger the workflow.

    ```yaml title=".github/workflows/crawl.yml"
    name: Crawl

    on:
      push:
        branches: [ "main" ]
      workflow_dispatch:

    jobs:
      crawl:
        runs-on: ubuntu-latest
        steps:
          - name: Algolia Crawler Automatic Crawl
            uses: algolia/algoliasearch-crawler-github-actions@v1.1.0
            with:
              crawler-user-id: ${{ secrets.ALGOLIA_CRAWLER_USER_ID }}
              crawler-api-key: ${{ secrets.ALGOLIA_CRAWLER_API_KEY }}
              github-token: ${{ github.token }}
              crawler-name: YOUR_CRAWLER_NAME
              algolia-app-id: ${{ secrets.ALGOLIA_APPLICATION_ID }}
              algolia-api-key: ${{ secrets.ALGOLIA_API_KEY }}
              // Change YOUR_SITE_URL to your own site URL
              site-url: YOUR_SITE_URL
    ```

4. Trigger the workflow manually or push a commit to the `main` branch.

    After the `Crawl` workflow is completed, you can check the crawl results in the [Algolia Crawler](https://crawler.algolia.com/).
