---
title: "💸 Infrastructure Costs & Inverted Unit Economics"
description: "If scaling users drives server bills higher than ad or subscription revenue can cover, high growth will simply bankrupt the company."
date: 2026-06-15
---
# 💸 Infrastructure Costs & Inverted Unit Economics

If scaling users drives server bills higher than ad or subscription revenue can cover, high growth will simply bankrupt the company.

---

## Vidme (YC W14)
* **What they built**: Vidme launched as "Imgur for video"—a lightweight, pure software platform where users could upload and share short videos anonymously without creating an account or navigating YouTube's heavy interface.
* **The Failure**: They grew massively, reaching millions of monthly active users. However, video hosting is the most brutal pure software business in the world. Unlike text or images, processing and serving video requires astronomical server and bandwidth costs. To survive, Vidme needed to build a highly profitable ad network or a massive subscription business. They simply couldn't monetize their users fast enough to outpace their ballooning Amazon Web Services (AWS) bills.
* **The Outcome**: In 2017, after attempting to pivot to a paid creator-first model, they ran out of runway and suspended operations. It stands as a classic warning that in consumer software, explosive growth can literally bankrupt a company if the unit economics of the infrastructure are inherently negative.
---

## Locket (YC W14)
* **What they built**: A pure software Android app that took over your smartphone's lock screen to display advertisements. In exchange for looking at an ad every time you unlocked your phone, the app paid you real money.
* **The Failure**: Locket achieved explosive user growth because, quite literally, they were handing out free money. However, their core business was an arbitrage play that broke down entirely. The revenue they generated from advertisers per "swipe" was consistently lower than the payouts they owed the users and the server costs required to run the infrastructure. The more users they acquired, the faster they bled cash.
* **The Outcome**: Realizing the fundamental math of the business was permanently inverted, they pivoted several times before abandoning the lock-screen model entirely. The founder (Yunha Kim) eventually sold the remaining assets to Wish in 2015 and went on to successfully found the meditation app Simple Habit.
---

## Anywhere.FM (YC S07)
* **What they built**: Long before Spotify dominated streaming, Anywhere.FM built a brilliant pure software web application that allowed you to upload your entire MP3 collection to their servers and stream it from any browser in the world.
* **The Failure**: They solved the software problem perfectly, but the underlying infrastructure of the internet in 2007 couldn't support the business model. Amazon Web Services (AWS) was still in its infancy, making the cost of hosting, storing, and streaming massive amounts of user-uploaded audio files astronomically expensive for a free consumer app. Plus, navigating the looming threat of music piracy and copyright strikes without a massive legal team was a ticking time bomb.
* **The Outcome**: Just months after launching, they were acqui-hired by another early music startup called Imeem, and the Anywhere.FM software was shut down. (Ironically, Imeem's server costs also crushed them shortly after, and they were sold for scrap to MySpace).
---

## Spool (YC S11)
* **What they built**: Often pitched as "Instapaper for video," Spool was a pure software mobile app that allowed you to bookmark videos on your desktop and automatically cache them to your smartphone so you could watch them later without an internet connection (or without burning through your data plan).
* **The Failure**: The app was beloved, but they were fighting a losing battle against the mobile infrastructure of 2011. Transcoding massive video files on the backend to fit different mobile screens required astronomical AWS server costs. Furthermore, trying to seamlessly push heavy video files over clunky 3G networks to early-generation smartphones resulted in constant technical debt and buggy software performance. The core business simply couldn't monetize fast enough to cover the massive processing overhead.
* **The Outcome**: Recognizing the standalone app couldn't survive the unit economics of mobile video hosting, they were acqui-hired by Facebook in 2012. Facebook primarily wanted the engineering team to help build out their own mobile infrastructure, and the Spool software was permanently shut down.
---

## Kifi (YC S14)
* **What they built**: A pure software knowledge management tool. It was a highly sophisticated browser extension that analyzed everything you read online, created deep-searchable bookmarks, and allowed remote teams to share complex knowledge graphs.
* **The Failure**: They fell into the classic "vitamins vs. painkillers" trap in B2B software. Users genuinely loved the tool, but they didn't love it enough to pay enterprise SaaS rates for it. Bookmarking and link-sharing are utility features that employees expect to get for free (via browser defaults or Slack). Meanwhile, the server costs for deep-indexing millions of web pages for a predominantly free user base completely outpaced their revenue.
* **The Outcome**: After struggling to find a viable, venture-scale business model for a standalone bookmarking tool, they were acqui-hired by Google in 2016. Google bought the team to work on a messaging app called Google Spaces, and the Kifi software—along with all user knowledge graphs—was deleted.
---

### 💡 Key Takeaway
For startups in this category, the core challenge is not the code but the surrounding market dynamics. Ensure you validate this bottleneck before scaling.
