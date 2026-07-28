---
slug: 2026-07-28-my-first-product-pingcap-docsite-preview
title: "The Story of My First Product: PingCAP Docsite Preview"
authors: [Oreo]
tags: [Product, User Experience]
---

I've published open-source projects and written plenty of scripts over the years, but [PingCAP Docsite Preview](https://pdp.oreo.life/intro.html) is the first thing I think of as my own product: the one I built for every docs contributor, not just myself. It shows what documentation changes will look like on the live site while you're still writing or reviewing them.

That turned out to matter more than I expected. Reviewers can read an actual rendered page instead of a diff in a pull request. It even doubles as a staging site, where customers can read the docs for private-preview features. Broken builds and rendering issues also show up before deployment, which CI doesn't catch.

It has been four years since I first wished something like this existed, and nearly three since I shipped v1.0.

Looking back, this product exists because I happened to be standing in the gap between two teams: the frontend engineers building our documentation platform, and the technical writers using it every day. This post is the story of how a tool grew out of that gap, and how building it helped me grow as well.

<!-- truncate -->

If you've ever used a modern docs framework, you might wonder why we couldn't just rely on its out-of-the-box PR previews.

The problem is that the PingCAP documentation site isn't built from a single docs repository. Its content is spread across multiple repositories, covering different products and languages, and goes through heavy processing before it's published. You can't just hand a branch to Vercel and say "build this".

## No preview without an engineer

**One preview, one hour, every edit**

In 2022, upcoming docs had to stay hidden until release day, so we couldn't just publish unreleased docs to the live site.

To give internal teams early access, a writer would ask a frontend engineer to deploy the release branch containing the newly merged doc PRs to a temporary URL. Because the deployment rebuilt the entire site, getting a preview took over an hour. Only after that could other teams review the changes.

And that was the good case. If someone spotted a rendering bug or needed a small change, we repeated the entire cycle: push the update, ping the engineer, trigger the build, and wait another hour just to verify the fix. Every minor edit meant repeating the same cycle.

**A local workaround almost nobody used**

In March 2022, a teammate found a way to preview docs locally before deployment. The approach reproduced the production build by hand. You had to install the site's full build environment (including Node.js and Gatsby) and manually place your Markdown files into an exact, deeply nested directory path.

The people who needed previews most, like technical writers and product managers, balked at that setup. Some didn't try it at all. Others tried, ran into build errors, and asked engineers for help, only to hear "it works on my machine". It's a familiar trap. Someone hands you a script and says "just run this", but using it means changing parameters, fixing environment mismatches, and learning build details you never asked for.

Worse, even for those who got it running, the preview lived only on their local machine. Exposing a local port to the internet, just so a reviewer could see the preview, was harder than the setup itself.

**Gluing existing services into our workflow**

By July 2022, three months into my technical writing internship, I saw firsthand how badly release notes needed previews. Every release required sign-offs from multiple teams, and most reviewers would never run a local build. So writers needed a way to preview docs with zero setup, and a link anyone could open.

Services like Netlify and Cloudflare Pages already solved parts of this, but what was missing was the glue to integrate them into our specific workflow. So I worked out the configuration, benchmarked build times across scenarios, and wrote a step-by-step guide.

That solved the environment barrier, but it immediately exposed an existing problem, where writers still had to manually maintain directory structures and TOC files. Those files were built for deploying a website, not for authoring content, making them completely unfamiliar to the team.

## Breaking change, crash course

**A frontend change broke the old preview**

In September 2022, a change to the frontend repository restructured the deployment pipeline, making the previous preview method obsolete. The site was now built through an intermediate repository, where the doc content folder still lives today.

To make previews work again, I needed to understand what that intermediate repository actually did. Along the way, I learned how a document flows from raw Markdown through post-processing to the final website. That knowledge later saved me hours debugging production issues: when a document changed but the website didn't update, I could usually pinpoint the failing step quickly. By the end, I had almost the same mental model of the publishing pipeline as the frontend developer who designed it.

The important decision was to make previews follow the same path as production. Contributors still needed to put docs in the expected content path, but the tool filled in the surrounding site files automatically, including TOC files and home pages. They no longer had to maintain the whole website structure just to preview one page.

**Every fix revealed another limitation**

Throughout 2023, using the tool every day surfaced one new requirement after another.

First, previewing a document required updating files in both the docs repository and the preview repository. It was tedious and easy to forget. I realized that most preview scenarios boiled down to "preview the changes in one PR", so I built automatic PR previews on top of GitHub Actions. The branch name included the PR information, such as `preview/pingcap/docs/1234`, and creating the branch automatically triggered a preview.

Then I ran into multilingual documentation. Since each language lived in a separate repository, reviewing one feature often meant opening several preview links, one for each language. I solved this with a dedicated template branch and a new script that merged the separate builds, so one preview could combine changes from multiple PRs.

Finally, some PRs remained under review for a month or more and needed continuously refreshed previews. A scheduled GitHub Actions workflow handled that, but the schedule was tied to a single branch. Any other branch still had to be triggered manually.

Each solution worked, but only in isolation. They solved individual cases, not a unified workflow. Some required changing the default branch, some manual triggers, and some repeated logic that should have been shared. It felt like adding patches to a foundation never designed for PR previews.

At that point, I was using these patches as experiments. I kept the rough edges because the goal was only to validate each idea, not build the final version. I already knew I needed a redesign, and I was gradually working toward a new architecture.

## Patches turned into a product

While working through those features, I started redesigning how the tool worked. Eventually, I rebuilt it from scratch. This phase wasn't just gluing services together anymore. I wanted a coherent system.

**Start with the user's action**

The core principle was to let users preview only the docs they changed, without knowing anything about what happened underneath. In practice, that meant incremental preview instead of rebuilding the whole site. A PR preview took about 3 minutes; a full production build took 40.

For most users, the interaction is simple: connect the preview project to Vercel once, and from then on, create a branch whose name describes what to preview. For more complex cases, such as previewing multiple PRs or frontend changes, users could create a branch and update a few lines of configuration.

**Build the system around it**

The architecture emerged while I was reorganizing my earlier Bash scripts. I split the system into three parts: the site scaffold (such as homepages), the doc content, and the deployment step. The product syncs the scaffold automatically, pulls the changed docs from one or more PRs, and builds them against the production frontend by default. Most users never need to know those pieces exist.

The heart of the work was recreating the documentation site's build-and-deploy workflow for incremental preview. "Recreating" mostly meant putting docs into the correct destination. Different products, languages, and versions each have their own paths, and sometimes even their own file naming rules.

The key values were modularity, testability, and maintainability. Every feature runs both locally and on GitHub Actions using the exact same script, so there is never a "works on my machine, fails in CI" mystery. Debugging CI is simply running the same script locally.

I introduced a test framework from day one, not because I love testing, but because I didn't trust my manual checks to catch everything I might break. Writing test cases became a way to define what the product should do before I knew exactly how to implement it. I wrote about that approach in [a separate post](https://oreo.life/blog/2023-08-23-python-test-shell-scripts).

**Shipping it, then keeping it useful**

In December 2023, after more than 200 hours of work, I released v1.0 together with full usage documentation.

Today, the product is used by anyone who previews docs while writing or reviewing them, not just technical writers. It has become a standard part of reviewing release notes and large new docs.

After v1.0, adding features stayed easy as the website workflow and user needs changed. Most new features could be added as new steps without changing the existing workflow. Adding a test case didn't even require touching code; one config file with the expected data was enough.

I knew the design was right when the actual doc pipeline changed and I didn't need to change the preview implementation. I had designed it to follow the workflow rather than hard-code assumptions about how production worked. For example, one product originally shipped in a single language. Years later, when production expanded to support multiple languages, the production workflow needed changes, but my design already supported the new structure.

Nothing in this product is an invention. Every piece imitates what production already does. But for the people using it, previewing a doc finally feels like a normal part of writing, not an engineering task.

## Rethinking design, users, and my role

Building this product changed how I think about design, users, and my own role between them.

**Iteration is unavoidable**

I cannot make something perfect on the first try. The product has to evolve with the requirements and the system around it. What I built first was a tool; what I ended up with was a product. For a while, that made me want to start every new idea as a complete product from day one. In practice, that mindset would have paralyzed me.

The product itself keeps teaching me this lesson. Its core idea is previewing only changed docs in a PR, which makes it "incremental preview native". Two or three years after release, a need for full-branch preview appeared, and it doesn't fit cleanly. I could hack it in somewhere, but the architecture would become awkward. If I want to keep the architecture clean, I need to sit down and design it properly. Even a design I am proud of cannot anticipate requirements that arrive years later.

What I actually took away from the process is the design itself: the test framework, the architecture, the modular structure. I now carry those ideas into other projects.

**Standing between engineers and writers**

Frontend engineers develop the documentation website and its publishing workflow. Technical writers produce the content and rely on that workflow every day.

They are part of the same process, but they see it from different sides. Engineers know how the website works, but not always how writers experience it in daily work. Writers know where the workflow is slow or awkward, but not always what can be changed underneath. As a result, some pain never becomes a bug report.

I could build this product because I was standing in the middle. I wanted to understand how the workflow worked, I was lazy enough to hate repeated manual work, and I enjoyed investigating and building. More importantly, I used the tool almost every day myself. As a heavy user, I could see which parts were quietly eating our time.

**Writing the docs taught me something unexpected**

Even as a technical writer, I found it surprisingly hard to document a product I had built myself. I knew the implementation too well, so my first draft skipped details and limitations that were obvious to me but not to a new user.

It reminded me that knowing the system is not enough. Good documentation still has to start from the user's perspective, follow a structure that matches how they learn or troubleshoot, and be tested like part of the product itself.

That experience also changed how I evaluate documentation tools. I now use JetBrains Writerside for this product, and it feels like a tool built by people who deeply understand technical writers. It resolves many of the pain points I encountered while building my own workflow, and gives me a clearer picture of what a documentation platform can be.

My first product came from standing in one gap. I wonder where the next one will come from.
