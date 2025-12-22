---
description: >-
  What I learned building a realtime race coach using Gemini 3, Antigravity,
  Chrome and Firebase
---

# The Race for Real-Time

If you look at the commit history for the **Gemini Field Test**, you’ll see a blur of activity around mid-December. To the outside observer, it looks like a standard software sprint. But from where I was sitting—staring at a monitor with multiple terminal windows open, trying to get a 3D car to render at 60FPS while a local LLM analyzed its telemetry—it felt more like a pit stop in Formula 1.

We set out to build something ambitious: a real-time **Performance Coach** for motorsport. We wanted to prove that Google’s [**Gemini 3**](https://aistudio.google.com/models/gemini-3) model family could act as a performance coach for a race car driver as they raced live.

This was a team effort, but I wanted to test a hypothesis of mine: An individual developer can build production-grade software using AI when powered with the right tools. While we collaborated on the hardware and the hardware-to-software bridge, we diverged in our implementation approaches.

The result was the replay engine. It was a week of high-velocity engineering, hard lessons about model latency, and one massive architectural pivot that saved the project. Here is the story behind the code.

#### Build Context: Visually

To effectively prepare for the upcoming sprint and ensure a deep, foundational understanding of the racing domain, a crucial "Build Context" phase was initiated one week prior. This involved the collection and distribution of highly specific, real-world data directly from AJ, our professional race car driver. The core resources provided included a substantial collection of VBOX files and onboard video footage.

The VBOX files, which typically contain detailed telemetry data—such as speed, GPS coordinates, g-forces, steering angle, brake pressure, and throttle position—served as the primary technical input. Analyzing this data was essential for understanding driving dynamics, identifying cornering lines, and quantifying performance metrics. Simultaneously, the accompanying video footage offered a crucial visual and qualitative complement to the raw numbers. By watching AJ's laps from both the in-car and telemetry perspectives, I could link the technical data points to the real-world action, gaining context on track features, driver inputs, and the car's behavior under various conditions.

I learn visually—I understand best when I can see things like charts, graphs, or spatial layouts. I quickly realized that just reading a bunch of CSV files wouldn't give me the deep, intuitive understanding I needed. So, I jumped right into building a system to turn all that raw data into visuals. This visualization isn't just key for me to "get it," but it's also the best way to clearly share the complex patterns in the data with everyone else.

I started with a "fast-fail" philosophy. I used Antigravity with Gemini 3 Pro to spin up the replay repo using Vite and Tailwind. I needed speed, both in the car and in the build pipeline. I deployed my initial version to Firebase hosting immediately because, in a project moving this fast, if it isn't live, it doesn't exist.

#### The First Wall: The Physics of Rendering

The first challenge wasn't AI; it was physics. A racing car generates massive amounts of data—speed, RPM, G-force, suspension travel—thousands of times per second.

Initially, I tried doing things the "React way," passing props down to components. But when you are trying to render a 3D track map and move a car mesh at 60FPS, React’s reconciliation process is just too slow. The car would stutter. And in racing, stutter is death.

I had to break some rules.

I pushed a commit titled Optimize performance with lazy loading and imperative 3D updates. Basically, I bypassed React for the 3D scene. I started using Float32Array—raw binary data blocks—to handle the telemetry. This allowed us to upload data directly to the GPU without the memory overhead of standard JavaScript objects. The result? A "Glass Cockpit" that was buttery smooth, featuring real-time G-force meters and a "Ghost Car" that synchronized perfectly with the user’s lap.

#### The "Bypass": When AI Met Reality

Once the visualization was working, it was time to plug in the brain: Gemini models.

The original dream was a tight loop:

1. Car enters corner.
2. Telemetry goes to Gemini models.
3. Gemini tells the driver "Brake harder!"
4. Driver reacts.

**It didn't work.**

Even with an efficient model like Gemini 3 Flash with the thought level set to minimal, inference takes time, and we were doing it over the wire. If I waited for the LLM to "think" before rendering the next frame, the whole application became useless. You can't tell a driver to hit the brakes 500 milliseconds after they’ve missed the apex.

This led to the most critical commit of the project: fix: bypass the LLM.

I realized I was asking the AI to do the wrong job. I didn't need an LLM to perform mathematical calculations that come with high-speed race data—simple functions in JavaScript can do that in microseconds. Also, during our weekly team sessions, I learned about my teammates' work with Gemini Nano, which provided a new perspective on the system.

The system was re-architected into four tiers of increasing complexity: Code, Nano, Flash, and Pro.

* **Hot Path (The Bypass):** This tier utilizes deterministic code for split-second, instant, and zero-latency actions.
* **Warm Path (Local LLM):** Gemini Nano, embedded within Chrome, served as our Local LLM to provide functionality while the car was on the track.
* **Cold Path (Networked):** This system, utilizing Gemini Flash and Pro, aggregates data across an entire run, analyzing information like turns and segments. After a lap is completed, it identifies patterns and uses these observations to generate detailed, data-backed suggestions for improving performance on the subsequent lap.
* **Post-Run Data Dive:** Following the race, a comprehensive data analysis was conducted using Gemini 3 Pro. This analysis served as the basis for a podcast created by experts Chip and Stig. The podcast was then converted to audio using Gemini for the driver's convenient listening during their leisure time.

This was the breakthrough. The AI became a strategic coach, not a co-pilot.

#### Engineering the Personality

One of my favorite parts of this sprint was tuning the prompt. A generic AI is polite. A racing coach needs to be visceral.

If you dig through the logs, you’ll find a commit (requested by our driver) called feat: don't be a wuss. I had to tune the system prompts to stop hedging. I needed the AI to say, "Trust the car," or "You're braking too early," with authority. I learned a lot from the regular catchup calls and the team’s codebase.

#### The Final Sprint

The last 48 hours (Dec 19–21) were a blur of optimization. I was hitting the limits of what a browser tab can handle. I created a dedicated perf/react-optimizations branch and started logging everything.

I found that running 3D graphics, physics calculations, and an LLM inference simultaneously creates a resource cage match for the CPU. I had to be ruthless with code splitting and lazy loading. I ensured that nothing loaded until the user absolutely needed it.

#### Race Day

So many things went wrong.

**Critical Resource Depletion:** We faced an Antigravity Credit Crisis. The account ran out of credits due to the insane number of last-minute changes I was doing while on the track.

**The Peril of Last-Minute Coaching Changes:** High-risk changes to the proactive coaching mode were implemented less than eight hours before the race. I rushed these changes and didn’t test them across various variations. Instead of marginal gains, they introduced crippling instability where the system didn’t even work as soon as the car went past the start line.

**The Geospatial Hallucination Handicap:** One of the frustrating errors was the lack of a reliable, real-time spatial awareness system. Not having a real GPS map of the track caused the LLM to "hallucinate" the turns and segments. The LLM defaulted to generating plausible-but-incorrect turn names while coaching the user.

**The Importance of Context Engineering:** Despite using the same laptop with the same Gemini Nano model, the competitive difference was defined by the sophistication of context engineering. The critical lesson was that pre-computing metrics (e.g., probability of tire slip, optimal power curve) was essential. Pre-processing raw sensor data into meaningful, high-level metrics offloaded tasks from the LLM, reduced computational latency, and allowed the LLM to focus on higher-order strategic decision-making.

**But some things went very well:**

It was a breakthrough weekend at Thunderhill Raceway. The entire team showed incredible progress and dedication, impressing the track's management. Matt, the CEO of Thunderhill Raceway, praised the team's rapid development, stating, "What you all have done in a few days, we haven’t seen in 40 years!" He even promised to provide a high-resolution, professional-grade LIDAR and GPS-generated map of the racetrack for future simulations.

The experimental Reactive Coach system performed exceptionally well, providing timely, data-driven, and actionable suggestions to the driver using real-time telemetry and predictive modeling. Furthermore, the post-race podcast analysis—despite the hosts being highly critical of the driver—was extremely helpful in identifying specific areas for immediate driver and car-setup improvement.

The weekend provided a clear direction, leading to the solidification of ideas and specifications for the next version of the entire system, focusing on integrating lessons learned, new map data, and addressing performance gaps.

#### The Future of Edge AI

Building the replay engine taught me that **AI is not a replacement for a human coach.**

The future of real-time AI isn't about making the models do everything; it's about architecture. It's about knowing when to use a simple script and when to use a neural network. It's about the "Bypass"—keeping your hot loop blazing fast and letting the AI provide deep intelligence in the cold loop. And when everything fails, rely on years of instinct and trust the car!

The Gemini Field Test was a race in every sense of the word. We crashed a few times, we pivoted hard, but in the end, we crossed the finish line with a system that actually works.

Now, if you'll excuse me, I need to sleep.

\- Vik
