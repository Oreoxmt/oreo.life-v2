---
slug: 2026-09-17-keeping-docs-in-sync-my-journey
title: "Keeping Docs in Sync: My Journey So Far"
authors: [Oreo]
tags: [Technical Writing, Memoir]
---

I first came across technical writing in 2021, when I was looking for a job in my final year at university. I'd never considered it a career, but the job description felt familiar enough that I applied.

I'd been keeping a blog for a year or two, recording how I got things working and what went wrong along the way, in case I needed to do it again. I wrote about assignments from a Python data analysis course, deploying Hadoop, and sharing one mouse and keyboard across multiple computers. Beyond the blog, I wrote a handover guide at the end of an internship, explaining how to run a program I'd built.

At the time, my understanding of technical documentation came entirely from those personal how-to guides. I assumed documentation was simply a record of a process that had already worked: someone did the work, wrote down the steps, and anyone who followed them would get the same result.

That assumption didn't survive what came next.

<!-- truncate -->

## What happened when I tried to follow the docs

Shortly after applying, I got a take-home assignment: review and revise a technical document for a database. I had no idea how to review documentation, so I fell back on the one thing I did know how to do: use the product. I deployed the database myself and followed every step exactly as written.

But I never made it past the environment setup.

The guide didn't mention the IAM roles and permissions needed for Amazon EBS, so I was blocked before I could even reach step one. I remember this clearly, because I missed a few resources when cleaning up afterward and AWS kept billing me for them ☹️.

The assignment was supposed to test my grasp of style guides, information architecture, and user perspective. Instead, I spent most of my time just trying to get the database working. Later in the interview, I gave them the simplest feedback I had: I couldn't do what the document told me to do.

Looking back, perhaps that experience did set me apart from the other candidates. More importantly, it became the first dot in a line that would shape my career: trying to make sure that documentation reflects what the product actually does.

That assignment changed how I read documentation. I started reading it literally instead of skimming. Once I did, I noticed the same pattern everywhere. The more products I used, the more descriptions I found that were outdated, wrong, or inconsistent with the actual behavior. Documentation from large, well-known technology companies was no exception.

That's when I recognized the gap between the documentation we want and the documentation we actually have. Eventually, I accepted that imperfect documentation is normal, just as it's hard to find a product without bugs or requests for new features.

## Why docs drift from the product

It took several years of working in documentation before I could explain why this kept happening. Over time, I noticed two patterns:

- **A feature ships, but nobody validates the docs.**

    A new tutorial or how-to guide might not have a clear goal, or nobody actually runs through it from beginning to end. Technical errors can remain in the original document if reviewers don't catch them.

    Even a document that was accurate on day one can drift over time. Later updates might change its original purpose, or someone might update one section without retesting the entire procedure. Automated tests are a standard part of software development, but documentation is rarely tested with the same discipline.

- **The product changes, but the docs don't.**

    This becomes more common as the documentation set grows. When hundreds of Markdown files live separately from the code they describe, it's easy for an engineer making a change to miss a related document or not realize that one exists at all. And even when AI agents generate and manage every document, the problem doesn't just go away.

## How I've tried to keep docs in sync

Throughout my career, I kept trying to figure out how to get documentation to truly reflect what the product does. After trying a lot of different approaches, I can see that my journey has taken me through three stages:

- Check docs manually.
- Generate docs from code.
- Treat docs as executable tests.

Each stage has a story behind it, which I'll share in future posts.

### Check docs manually

One straightforward way to find out whether a guide works is to have someone follow it and see what breaks. That someone can be a user or a person inside the company.

- **Reactive user feedback**: waiting for users to report problems they encounter while following the docs. The benefit is hearing from people using the product in real-world situations that internal testing might miss. But many users never report anything. Even when they do, they've already had a frustrating experience and might have given up on the guide or even the product.
- **Proactive internal testing**: having development, QA, or documentation teams periodically work through the instructions themselves. Besides checking that each step works as described, they can also assess the guide's clarity, tone, and organization. The main limitation is scale: nobody can manually test every combination of operating system, environment, and deployment configuration.

### Generate docs from code

Some docs repeat information that's already defined in the code. Generating those docs from the code means the same details don't have to be maintained in two places. For example, a field's name, type, and default value can be used to generate its reference entry.

This approach is common for API references and programming language documentation, such as Rust's. As long as the docs are regenerated whenever the code changes, the reference details stay in sync. But explanations, such as when to use a field, still need to be written and updated by engineers, even when they're stored in code comments.

Not every kind of reference documentation has tools that support this out of the box. When I ran into that problem with product-specific reference docs, I built my own generator to turn definitions in the code into documentation. I had to work out which definitions mapped to which parts of the docs, decide how to present them as readable entries, and fit the generator into the development workflow.

This approach only works if the source code is structured enough to generate something useful from it. Building a custom generator also requires a deep understanding of both the codebase and how the documentation is organized and maintained.

### Treat docs as executable tests

At some point, I started to see the procedures and code samples in a document as test cases with expected outcomes. And if they were test cases, they could be run automatically and on a schedule, like any other test.

It works much like software testing. Unit tests check that individual pieces of code behave as expected. Integration tests check that components work together. Documentation tests check that users can actually do what the docs say they can do.

This approach also scales much better than manual checks. Once the infrastructure is in place, the same document can be tested across different operating systems, environments, configurations, and product versions. The tests can also run continuously as part of the development workflow, so nobody has to remember to go back and check the docs.

But building a system like this isn't easy. The infrastructure needs to know how the product is deployed and how each document maps to real user workflows. And since every product has its own requirements, there's no one-size-fits-all solution.
