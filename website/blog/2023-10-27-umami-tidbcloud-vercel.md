---
slug: 2023-10-27-umami-tidbcloud-vercel
title: "Collect, Store, and Visualize Website Analytics with Umami, TiDB Cloud, and Vercel"
authors: [Oreo]
tags: [Website Analytics, Umami, TiDB Cloud, Vercel]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

I used Google Analytics to analyze my blog's data before. But after the standard Universal Analytics stopped collecting data, I found it's not easy to use GA4 and the data is not accurate (I am using Vivaldi to block trackers like Google Analytics). So I decided to migrate to an open-source tool that can be self-hosted by myself. I found [Umami](https://umami.is/) and I think it's a good choice. Umami is a simple and open-source alternative, and I can store my data in a MySQL/PostgreSQL compatible database. It's a good time for me to try to use TiDB Cloud to integrate with Umami.

<!--truncate-->
