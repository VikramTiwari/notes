---
title: "🏕️ Platform Risk & Rented Land"
description: "Building a business entirely dependent on another platform's APIs or search algorithms leaves you vulnerable to changes you cannot control."
date: 2026-06-15
---
# 🏕️ Platform Risk & Rented Land

Building a business entirely dependent on another platform's APIs or search algorithms leaves you vulnerable to changes you cannot control.

---

## Parse (YC S11)
* **What they built**: A Backend-as-a-Service (BaaS) that allowed mobile app developers to build databases and push notifications with a few lines of code.
* **The Failure**: It was acquired by Facebook in 2013 for &#36;85M. However, Facebook later realized that hosting cloud backend infrastructure for third-party developers did not align with their core ad-selling business.
* **The Outcome**: Facebook shut down Parse in 2016, causing chaos in the mobile development community.

---

## Socialcam (YC W12)
* **What they built**: A mobile video-sharing app with filters that achieved viral growth to tens of millions of users in months.
* **The Failure**: Their growth relied on a Facebook Open Graph API loophole that auto-posted watched videos to users' Facebook timelines. Once Facebook changed the algorithm to block this spam, Socialcam's traffic fell off a cliff.
* **The Outcome**: Quickly sold to Autodesk in 2012 for &#36;60M, who ultimately retired the consumer app.

---

## Tutorspree (YC W11)
* **What they built**: A marketplace matching parents and students with local, vetted tutors.
* **The Failure**: They depended entirely on SEO for user acquisition. In 2013, Google updated its search algorithm, wiping out Tutorspree's rankings overnight. They also suffered from disintermediation (tutors and clients taking transactions offline).
* **The Outcome**: Shut down in September 2013 and returned remaining capital to investors.

---

## Kimono Labs (YC W14)
* **What they built**: A popular developer tool that allowed users to turn any website into a structured API feed using a browser extension.
* **The Failure**: Despite serving over 125,000 developers, the platform was acquired by data-mining giant Palantir, which wanted the technology solely for internal use.
* **The Outcome**: Palantir instantly shut down the public API hosting service, breaking thousands of developer apps overnight.

---

## Yotta (YC W20)
* **What they built**: A gamified, pure software fintech app. It was a beautifully designed front-end application that encouraged users to save money by offering prize-linked savings accounts (essentially acting as a no-loss lottery for your bank deposits).
* **The Failure**: Yotta didn't actually hold any customer money; they were just a pure software UI. They completely relied on the API middleware of *another* YC company (Synapse) to route their users' funds to the actual banks. When Synapse's ledgers imploded and they went bankrupt in 2024, the partner banks froze everything. Yotta's front-end software worked perfectly, but their connection to the backend banking infrastructure was permanently severed.
* **The Outcome**: Because their API provider collapsed, Yotta's users were suddenly locked out of millions of dollars of their own life savings. It effectively destroyed Yotta's business and reputation overnight. It stands as the ultimate horror story of software platform dependency: your code can be flawless, but if your API provider dies, you die with them.

---

### 💡 Key Takeaway
For startups in this category, the core challenge is not the code but the surrounding market dynamics. Ensure you validate this bottleneck before scaling.
