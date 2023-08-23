# Project: pingcap-worker

## Overview

## How to initialize the project?

### Prerequisites

Cloudflare account

### 1. Configure your project

Update the wrangler.toml file or copy the wrangler_template.toml file to wrangler.toml and fill in the following values:

### 2. Initialize the project

```bash
wrangler d1 create <D1_DATABASE_NAME>
```}

```bash
? Select an account › - Use arrow-keys. Return to submit.
❯   Account
➜  Playground wrangler d1 create D1_DATABASE_NAME
✔ Select an account › Oreo and Mut
--------------------
🚧 D1 is currently in open alpha and is not recommended for production data and traffic
🚧 Please report any bugs to https://github.com/cloudflare/workers-sdk/issues/new/choose
🚧 To request features, visit https://community.cloudflare.com/c/developers/d1
🚧 To give feedback, visit https://discord.gg/cloudflaredev
--------------------

✅ Successfully created DB 'D1_DATABASE_NAME' in region WNAM

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "D1_DATABASE_NAME"
database_id = "D1_DATABASE_ID"
```

```bash
wrangler kv:namespace create <KV_NAMESPACE_NAME>
```

```bash
 ⛅️ wrangler 3.1.2
------------------
🌀 Creating namespace with title "worker-<KV_NAMESPACE_NAME>"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "<KV_NAMESPACE_NAME>", id = "<KV_NAMESPACE_ID>" }

➜  Playground wrangler kv:namespace create <KV_NAMESPACE_NAME> --preview
 ⛅️ wrangler 3.1.2
------------------
🌀 Creating namespace with title "worker-<KV_NAMESPACE_NAME>_preview"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "<KV_NAMESPACE_NAME>", preview_id = "<KV_NAMESPACE_PREVIEW_ID>" }
```

```bash
wrangler d1 execute <D1_DATABASE_NAME> --file=./sql/init.sql
```

wrangler dev 没有报错之后

- wrangler deploy --env staging

```bash
➜ wrangler deploy --env staging
 ⛅️ wrangler 3.1.2
------------------
▲ [WARNING] Processing wrangler.toml configuration:

    - "env.staging" environment configuration
      - D1 Bindings are currently in alpha to allow the API to evolve before general availability.
        Please report any issues to https://github.com/cloudflare/workers-sdk/issues/new/choose
        Note: Run this command with the environment variable NO_D1_WARNING=true to hide this message

        For example: `export NO_D1_WARNING=true && wrangler <YOUR COMMAND HERE>`

Your worker has access to the following bindings:
- KV Namespaces:
  - <KV_NAMESPACE>: <KV_NAMESPACE_ID>
- D1 Databases:
  - DB: <D1_DATABASE_NAME> (<D1_DATABASE_ID>)
- Vars:
  - DEV: "true"
  - ENVIRONMENT: "staging"
Total Upload: 10.47 KiB / gzip: 2.98 KiB
Uploaded <WORKER_NAME_STAGING> (1.33 sec)
Published <WORKER_NAME_STAGING> (2.59 sec)
  staging.example.com (custom domain)
Current Deployment ID: <DEPLOYMENT_ID>
```

- wrangler deploy --env production

```bash
> wrangler deploy --env production
 ⛅️ wrangler 3.1.2
------------------
▲ [WARNING] Processing wrangler.toml configuration:

    - "env.production" environment configuration
      - D1 Bindings are currently in alpha to allow the API to evolve before general availability.
        Please report any issues to https://github.com/cloudflare/workers-sdk/issues/new/choose
        Note: Run this command with the environment variable NO_D1_WARNING=true to hide this message

        For example: `export NO_D1_WARNING=true && wrangler <YOUR COMMAND HERE>`

Your worker has access to the following bindings:
- KV Namespaces:
  - <KV_NAMESPACE>: <KV_NAMESPACE_ID>
- D1 Databases:
  - DB: <D1_DATABASE_NAME> (<D1_DATABASE_ID>)
- Vars:
  - DEV: "false"
  - ENVIRONMENT: "production"
Total Upload: 10.47 KiB / gzip: 2.98 KiB
Uploaded <WORKER_NAME_PRODUCTION> (1.36 sec)
Published <WORKER_NAME_PRODUCTION> (2.64 sec)
  example.com (custom domain)
Current Deployment ID: <DEPLOYMENT_ID>
```

确认 custom domain 的 DNS 已经生效
测试

- wrangler secret put xxxx --env staging
- wrangler secret put xxxx --env production

```bash
wrangler secret:bulk <JSON> [OPTIONS]
```

```
echo "-----BEGIN PRIVATE KEY-----\nM...==\n-----END PRIVATE KEY-----\n" | wrangler secret put PRIVATE_KEY
```

### 3. Create a GitHub App and a Feishu Bot

#### GitHub App

权限 ???

#### Feishu Bot

权限 ???

### 4. Test the project
