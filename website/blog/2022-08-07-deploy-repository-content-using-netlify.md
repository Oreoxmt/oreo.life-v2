---
slug: 2022-08-07-deploy-repository-content-using-netlify
title: How to deploy a repository content using Netlify
authors: [Oreo]
tags: [CDN, Tips & Tricks]
---

## How to deploy a repository content using Netlify

### Scenario

- There is an API definition file `open-api-swagger.json` in a private repository `production/api` and I have no write access to it.
- I want to deploy a preview website of the `open-api-swagger.json`:
    - test some configuration options in my repository `Oreoxmt/preview-api`
    - build the `open-api-swagger.json` specification file into a HTML file `index.html` using [`redoc-cli build`](https://redocly.com/docs/redoc/deployment/cli/#redoc-cli-commands)
    - deploy it using Netlify or other services

### 1. Import my repository to Netlify

1. Log in to [Netlify](https://app.netlify.com).

2. In the **Team overview** page, click **Add new site** and select **Import an existing project**.

3. Connect to Git provider using the **GitHub** option and select the `Oreoxmt/preview-api` repository.

4. Select **Deploy site**.

### 2. Get the private repository content using GitHub API

### 3. Configure the build settings

### 4. Trigger a deploy
