---
slug: 2026-03-11-shipping-my-first-vibe-coded-feature
title: "Shipping My First Vibe-Coded Feature"
authors: [Oreo]
tags: [AI, Tips & Tricks]
---

A few days ago, I shipped my first vibe-coded feature to production. I had experimented with vibe coding before, but only for small scripts that never left my local machine. This time felt different, and the whole experience gave me a lot to think about. The night the code went live, I couldn't wait to sit down and write about it. I wanted to celebrate, recap the process, and just capture the moment before it slipped away.

This post is really about that journey: how I went from bumping along a rocky road to eventually finding a clear flight path. Since this is mainly a personal reflection, some of the technical details might not be entirely accurate.

<!-- truncate -->

A quick note on the feature I vibe-coded: it adds Mermaid diagram support to a Gatsby-based documentation site.

## Day 1: The trap: jumping on the first vehicle

I searched for "Gatsby Mermaid", and the top result was `gatsby-remark-mermaid`, a plugin that runs during the Markdown transformation phase. It also appeared in Mermaid's official documentation under [Integrations](https://mermaid.ai/open-source/ecosystem/integrations-community.html), which made it seem like the right choice.

Naturally, I launched Claude Code in the frontend repository and told it to add Mermaid support using that plugin. A few minutes later, the task was done, and everything worked on my local machine. It felt like a quick win.

However, when I actually scrolled through the changes, I noticed the plugin version it installed had not been updated in four years.

I asked both Claude Code and ChatGPT which version I should use for compatibility. They gave different answers, and neither suggested the latest version. That left me even more confused. I checked how other open-source projects were using this plugin, but that did not help much either. Curious why the latest version was not recommended, I decided to try it myself. I upgraded the plugin, fixed a dependency issue, and it worked.

Feeling confident, I committed the changes and pushed them to Vercel. I was excited to ship my first vibe-coded feature. But the build failed. It turns out that `gatsby-remark-mermaid` renders diagrams at build time using Playwright or Puppeteer (which bundles a headless Chromium browser), and the Vercel build environment lacked the necessary dependencies to run it.

## Day 2: The map: stepping back to see all the routes

I realized this "small feature" was more complex than I thought and I had rushed into implementation without enough research. So I decided to slow down and follow a more traditional process: requirements analysis, architectural design, development, and testing.

I described the requirements and project constraints to Claude and asked for different technical approaches. It categorized the options into three paths:

- Build-time rendering: what I tried first. It converts Mermaid code to SVGs during the Gatsby build, but might require Chromium in the CI/CD environment.
- Client-side rendering: this outputs a placeholder and renders diagrams directly in the user's browser using the Mermaid JavaScript library.
- Pre-rendered assets: this generates SVGs during the CI process and embeds the files into the documentation.

This gave me a clearer picture of how Mermaid rendering works at a high level. I also asked Claude to research how other documentation frameworks handle Mermaid.

This is where AI really shines. You can quickly prototype all three approaches and choose the best one based on real-world results. After comparing build times, CI/CD overhead, and website performance, it became clear that client-side rendering was the best path forward.

One interesting side story: I came across a project [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) and shared it with Claude. Claude initially concluded that it does not require a browser to generate SVGs, which sounded perfect. However, after reading the README myself, I discovered it used a custom parser that only supported a few diagram types. That compatibility risk was enough for me to rule it out.

## Day 3: The leap: moving from planning to building

With a detailed document outlining the different ways to implement Mermaid support, I asked Claude Code to try the client-side approach. Within minutes, the implementation was ready.

The logic was simple: convert code blocks that start with ` ```mermaid ` into `<pre class="mermaid">` elements. Then, the browser loads `mermaid.js` to find those elements and render them as SVGs.

To see if it actually worked, I asked Claude Code to generate a document containing several types of Mermaid diagrams. Everything worked, both locally and on Vercel. The only minor issue was FOUC (Flash of Unrendered Content), where the raw Mermaid code is visible for a split second before the JavaScript finishes rendering the diagram. I decided to leave that optimization for the AI to handle later.

## Day 4: The wrap: rebuilding with a new vehicle

Before submitting, I asked Claude Code and ChatGPT to review the code. Claude Code flagged a potential issue where an `escapeHtml` function might break special characters. ChatGPT pointed out that while I used a `<pre>` element, modern frameworks like Docusaurus use `<div>` containers instead. After checking Docusaurus and Writerside, I noticed they indeed take that approach.

So I asked ChatGPT to dig deeper into how Docusaurus actually supports Mermaid and what the rendering pipeline looks like. It turns out that Docusaurus uses a remark plugin to transform Mermaid code blocks into a `<Mermaid />` React component during the MDX compilation phase. This component then lazy-loads the library and renders the diagram via React hooks.

ChatGPT even suggested specific changes to a `Mermaid.tsx` component. Since the project already used similar components, this felt like a natural fit.

I then asked Claude Code to redo the work following this Docusaurus-inspired approach. This time, everything worked.

But the earlier warning about `escapeHtml` was still on my mind. I asked Claude Code to add another test case with special characters. During testing, I noticed that the `&` character rendered differently inside diagrams compared to the main text.

I also wanted the diagrams to use the same font as the rest of the site for a consistent look. So I asked Claude Code to check which font the site uses and apply it to the Mermaid diagrams as well. After that, everything finally looked the way I wanted.

The funny part is, while writing this post, I went back and rechecked the original `escapeHtml` concern. It turns out the issue never actually existed in the Day 3 solution. And according to the Mermaid documentation, both `<pre>` and `<div>` are officially supported. But the Day 4 solution feels cleaner, more React-idiomatic, and aligns with industry standards.

## Day 5: The recap: learning to think alongside AI

Writing these logs made me realize how much my relationship with AI has changed.

In the beginning, I would just sit and wait for the AI to finish generating, not really knowing what to do with myself. My attention would often drift away.

Over time, I started actually collaborating with it. While the AI is "thinking", I follow its reasoning step-by-step. If it uses a term I don't know, I'll ask another AI to explain it or cross-check it against documentation.

As a result, I've become much more familiar with the code I'm committing and the systems the AI is helping me build. The more I understand what the AI is doing, the better we seem to work together.

Gradually, some of that knowledge sticks in my mind. But what stays with me is not specific code or syntax. It is something more like a set of skills, a deeper intuition about how things work and how to approach a problem.

Looking back, it was a bit like planning a trip:

On Day 1, I picked a vehicle without checking the distance or the terrain, and ended up bumping along a rocky road.

On Day 2, I mapped out where I was, where I needed to go, and the available routes, then chose the one that best fit my needs.

On Day 3, I finally reached the destination, even though it was not a direct ride and required a short stop at a midway station.

On Day 4, I called in a specialist to inspect the vehicle, and they suggested an upgrade.

Now, that route is a stable flight path, carrying passengers from here to there.
