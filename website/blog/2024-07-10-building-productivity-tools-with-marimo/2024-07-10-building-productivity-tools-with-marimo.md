---
slug: "2024-07-10-building-productivity-tools-with-marimo"
title: "Building Productivity Tools with marimo"
summary: "Discover how marimo, an open-source Python reactive notebook, can revolutionize your workflow. This post describes the journey in creating three powerful productivity tools: a Working Day Calculator, a Holiday Announcement Parser, and an Automatic Release Scheduler."
authors: [Oreo]
tags: [Python]
---

```mdx-code-block
import ReactPlayer from 'react-player';
```

Have you ever dreamed of creating custom tools to simplify your work life? In recent weeks, I've been exploring the capabilities of [marimo](https://marimo.io), an innovative open-source Python reactive notebook. This powerful tool has enabled me to create three applications that have significantly streamlined my work planning process. In this post, I'm excited to share my journey with marimo and showcase the tools I've developed.

:::info quote

marimo is an open-source reactive notebook for Python — reproducible, git-friendly, executable as a script, and shareable as an app.

—[marimo](https://marimo.io)

:::

<!-- truncate -->

## Showcasing the tools

Let's dive into the tools I built using marimo:

- [**Working Day Calculator**](https://tool.oreo.life/workcalc/): calculates dates before or after a specified number of working days, taking into account official public holidays and compensatory working days in China.

    <ReactPlayer playing controls url='/img/workcalc-demo.mp4' width="100%" height="auto" />

- [**Holiday Announcement Parser**](https://tool.oreo.life/holiparse/): parses official holiday announcements from the General Office of the State Council and generates data for annual public holidays and compensatory working days in China.

    <ReactPlayer playing controls url='/img/holiparse-demo.mp4' width="100%" height="auto" />

- **Automatic Release Scheduler**: streamlines the product release process by automatically scheduling tasks based on a given release date.

    <ReactPlayer playing controls url='/img/autosched-demo.mp4' width="100%" height="auto" />

## From idea to implementation

The journey of creating these tools was an organic process, driven by real-world needs and continuous improvement:

1. It all began with the **Automatic Release Scheduler**. Manually calculating working days in China, especially around public holidays, was a significant pain point. I wanted a tool that could take a product release date and automatically schedule tasks, accounting for these complexities.
2. During this process, I realized that calculating a date a certain number of working days before or after a given date was a fundamental need applicable to various scenarios. This led to the creation of the **Working Day Calculator** as a standalone tool.
3. Initially, I planned to manually configure annual holidays and compensatory workdays through the UI. However, I soon realized that keeping this information up-to-date would be tedious. This realization sparked the development of the **Holiday Announcement Parser**, which automatically extracts this data from official government notifications.
4. For the parser, I initially considered using an AI model but found it occasionally omitted holidays. I then explored regex but encountered limitations with capturing multiple repeated groups.
5. Finally, I refactored the **Automatic Release Scheduler** to leverage the code from the **Working Day Calculator**, showcasing the power of code reusability in marimo.

## My Experience with marimo

Here are some key takeaways from my time with marimo:

- **Version control friendly**: marimo stores notebooks as `.py` files, making them git-friendly and easy to version control.
- **Visualized dependencies**: marimo provides helpful visualizations of variables and dependencies, making code optimization and understanding a smoother process.
- **Code reusability**: marimo enables you to reuse code defined in one notebook across other notebooks or Python files. This came in handy when I refactored the Automatic Release Scheduler using the Working Day Calculator's code.
- **Data analysis capabilities**: marimo offers `marimo.ui.table` for data analysis. You can filter. But it's not a UI for display. To display a list of lists as a table, it would need to be converted to a list of dict.
- **WebAssembly support**: marimo notebooks can be run in the browser using WebAssembly. For deployment, however, Docker is currently required, which might present a hurdle for beginners. Thankfully, [Marimo Cloud](https://docs.marimo.io/guides/deploying/deploying_marimo_cloud.html) is in beta and might provide a simplified deployment process.

## Beyond the code: the importance of user experience

While the development process itself took around 15 hours, a significant amount of time was dedicated to crafting a user-friendly interface. Finding the right combination and arrangement of UI elements was crucial for a positive user experience. Inspiration for the UI layout came from the designs generated by [Claude 3.5](https://www.anthropic.com/news/claude-3-5-sonnet).

## Conclusion

I hope this blog post has given you a taste of the possibilities marimo offers for building innovative tools. If you're a Python developer looking to streamline your workflow or create custom applications, marimo is definitely worth exploring!

By leveraging marimo, I was able to create three interconnected tools that have significantly improved my work planning process. The journey from identifying a need to developing a solution was not only rewarding but also a great learning experience in terms of tool development and user interface design.

Whether you're looking to solve a specific problem in your workflow or just want to explore new ways of working with Python, I encourage you to give marimo a try.
