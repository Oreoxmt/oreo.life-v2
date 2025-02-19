---
slug: 2025-02-19-always-use-braces-around-variables-bash-zsh
title: "Always Use Braces Around Variables in Bash/Zsh"
authors: [Oreo]
tags: [Shell, Tips & Tricks]
---

*How a missing pair of curly braces `{}` cost me an hour of debugging.*

<!-- truncate -->

## The mysterious `rclone` error

While setting up [`rclone`](https://rclone.org) to connect to a Tencent Cloud storage bucket on my local machine (running Zsh), I encountered this error:

```shell
# Zsh
export TENCENTCLOUD_SECRET_ID=1234
export TENCENTCLOUD_SECRET_KEY=1234
rclone ls ":s3,endpoint=cos.ap-seoul.myqcloud.com,access_key_id=$TENCENTCLOUD_SECRET_ID,secret_access_key=$TENCENTCLOUD_SECRET_KEY:api/"

# highlight-next-line
CRITICAL: Failed to create file system for ":s3,endpoint=cos.ap-seoul.myqcloud.com,access_key_id=1234,secret_access_key=/Users/test/1234pi/": unquoted config value must end with `,` or `:`
```

I was baffled. Why was `$TENCENTCLOUD_SECRET_KEY:api` being interpreted as a local file path (`/Users/test/1234pi`) instead of the expected environment variable value? This unexpected behavior was clearly causing the error, but I couldn't understand why it was happening.

## The culprit: Zsh parameter expansion

After extensive testing and some AI consultation, I discovered something surprising: Zsh treats `:a` as a **parameter expansion modifier**, which converts a filename into an absolute path. To better understand this behavior, I ran the following tests, which demonstrate how Zsh interprets `:a` in different contexts:

```shell
# Zsh
export A=1234
echo $A:a
# /Users/test/1234
echo ${A:a}
# /Users/test/1234
cd test
# /Users/test/test/1234
echo ${A}:a
# 1234:a
echo "$A":a
# 1234:a
```

In my `rclone` command, `$TENCENTCLOUD_SECRET_KEY:a` matched the pattern of parameter expansion with a modifier (`$variable:colon_modifier` or `${variable:colon_modifier}`). As a result, `$TENCENTCLOUD_SECRET_KEY:a` was interpreted as "perform the `a` modifier on the expansion of `$TENCENTCLOUD_SECRET_KEY`", resulting in `/Users/test/1234`.

For more details, see [Zsh Expansion](https://zsh.sourceforge.io/Doc/Release/Expansion.html).

:::info quote

Note that the Zsh Development Group accepts no responsibility for any brain damage which may occur during the reading of the following rules.

7\. Modifiers

    Any modifiers, as specified by a trailing `#`, `%`, `/` (possibly doubled) or by a set of modifiers of the form `:...`, are applied to the words of the value at this level.

—— [Zsh Parameter Expansion Rules](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Rules)

:::

While Zsh modifiers can be powerful, they must be used intentionally and with a clear understanding of their effects. For example, modifiers can be handy for converting strings to uppercase or lowercase:

```shell
# Zsh
export A=test
echo ${A:u}
# TEST
export A=TEST
echo ${A:l}
# test
```

Notably, this behavior is specific to Zsh. In Bash, the same command behaves differently:

```shell
# Bash
export A=1234
echo $A:a
# 1234:a
```

## The simple fix: adding braces `{}`

The solution turned out to be straightforward: adding braces `{}` around the variable names resolved the issue. The following is the corrected command:

```diff
- rclone ls ":s3,endpoint=cos.ap-seoul.myqcloud.com,access_key_id=$TENCENTCLOUD_SECRET_ID,secret_access_key=$TENCENTCLOUD_SECRET_KEY:api/"
+ rclone ls ":s3,endpoint=cos.ap-seoul.myqcloud.com,access_key_id=${TENCENTCLOUD_SECRET_ID},secret_access_key=${TENCENTCLOUD_SECRET_KEY}:api/"
```

With the braces in place, `${TENCENTCLOUD_SECRET_KEY}:api/` is correctly parsed as `1234:api/`. The `:a` is no longer within the parameter expansion and is treated as a literal string.

The braces explicitly define the variable boundaries, preventing Zsh from applying its parameter expansion modifiers where you don't want them.

## What I learned

~~Avoid using Zsh~~

- **Brace all variables religiously**

    Always use `${VAR}` instead of `$VAR`. The braces prevent unexpected parameter expansion and make variable boundaries explicit. This is especially important when special characters are involved.

- **Shell variant matters**

    Always test your scripts in the same shell environment (Bash/Zsh) that you'll use in production. Their expansion rules can differ subtly but significantly. In my case, the `rclone` command worked in GitHub Actions (which uses Bash) but failed on my local machine (which uses Zsh).

- **Quote liberally**

    When in doubt, wrap variable expansions in quotes: `"${VAR}"`. This protects against word splitting and glob expansion, unless you intentionally want whitespace to be interpreted as a delimiter in Bash.

- **Understand the Order of Expansion**

    Take the time to understand how parameter expansion works in your shell. This knowledge will save you countless debugging hours and prevent unexpected behaviors in your scripts.
