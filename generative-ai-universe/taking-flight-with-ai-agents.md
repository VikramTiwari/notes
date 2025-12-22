---
description: Building the Wingspan Agent, your feathered friend finder!
---

# Taking Flight with AI Agents

Have you ever been strolling through a park, heard a distinct chirp, or spotted a flash of vibrant color flit past, and thought, "Wow, what bird _is_ that?" Me too! My strolls along San Francisco's piers often make me pause and stare in wonder. However, identifying my feathered visitors usually involves frantic googling or flipping through dense field guides.

Wouldn't it be cool if learning about birds was as simple as... just asking?

That spark of an idea led me down a fascinating rabbit hole and resulted in the **Wingspan Agent** – a conversational AI buddy I built to help anyone (including myself!) learn more about birds. And the best part? I built it using Google's recently released Agent Development Kit (ADK), making the journey into AI agents development surprisingly smooth and incredibly fun.

You can check out the repo on GitHub: [`https://github.com/VikramTiwari/wingspan-agent`](https://www.google.com/search?q=%5Bhttps://github.com/VikramTiwari/wingspan-agent%5D\(https://github.com/VikramTiwari/wingspan-agent\)) It's a work in progress, so please create new issues for features that you would like to see.

#### From Curiosity to Code: The Agent Hatches

My goal was simple: create an agent you could chat with to get quick facts about different bird species. I envisioned asking things like "Tell me about the Blue Jay" or "What's the wingspan of a Bald Eagle?" and getting instant, easy-to-understand answers.

Enter [Google's Agent Development Kit (ADK)](https://google.github.io/adk-docs/). I'd been keen to try it out, and this seemed like the perfect project. The ADK promises to simplify building sophisticated AI agents, providing tools and frameworks to handle various tasks that are part of building an AI agent.

To get started, I wanted to create a proof-of-concept and understand cost mechanics. First challenge, identify bird names in a conversation. I started with the goal of identifying the smallest (thus fastest and cheapest model) in the Gemini family of models for this task. [AI Studio](https://aistudio.google.com/) is the best place for these proof-of-concepts since it allows you to play around with different models and their configurations to find a good fit. Very quickly, I found out that Gemini Flash Lite was good at identifying the bird names. It's also the smallest and the fasted model in the 2.0 series of Gemini models.

<figure><img src="../.gitbook/assets/Screenshot 2025-04-20 at 5.34.26 PM.png" alt=""><figcaption><p>AI Studio Screenshot for the initial exploration</p></figcaption></figure>

Now that we have confirmation that the model can recognize and extract bird names from conversations, next step is to gather factual information about these birds. For this sample agent, I focused on sourcing key information like common names, scientific names, wing span and habitat. Sourcing and structuring this data was a mini-adventure in itself! This is where the [Wingspan game](https://stonemaiergames.com/games/wingspan/)'s data sheet was very helpful. If you are a bird enthusiast, this board game is a must have!

The goal of this tool is to provide factual information about birds, to our agent. The agent can then use this information to answer the user's question. We could pass in the complete dataset for all the birds to our model, on each user query. However, for our use case, a simpler lookup method would be much more economical to get information about one bird at a time.

Note: Passing in complete documents has it's advantages especially when it's a non-structured document and parts of the text might correlate with each other.

#### Tools for the Agents to talk "Bird"

Tools are crucial for agents to reason, extract information and perform actions on your behalf. Using the ADK, I started defining the first tool for our agents `get_bird` . This tool starts by loading a JSON of the bird facts into memory to act as it's database. It then uses the bird name extracted by the agent to retrieve the bird's factual information. This ensures that we are retrieving authoritative and factual information, rather than hallucinating details about a bird.

This is a fairly rigid and constrained retrieval system. We are looking for specific bird names, and loosely matching them against our database. This setup is brittle and is not production ready, but it works for our demonstration. Keep an eye out for future blog posts and code samples where we explore more sophisticated approaches with keyword, vector and symbolic search systems. These approaches make retrieval systems more robust against a wide variety of user questions.

Now, let's connect this tool to an agent which identifies the bird names from the user's query.

#### Spreading it's wings: Features of our agent

While it started as a learning project, the Wingspan Agent can already do some neat things:

1. **Identify Bird Facts:** Ask about a specific bird in its knowledge base, and it'll tell you what it knows.
2. **Key Information:** Get details like wingspan, habitat, diet, and more.
3. **Conversational Interface:** Chat naturally to get the info you need.

Here's a peek at how the agent might respond when asked about a bird or it's specific characteristics.

<figure><img src="../.gitbook/assets/Screenshot 2025-04-20 at 6.43.27 PM.png" alt=""><figcaption><p>ADK's web UI is very helpful to play around with your agents and get an insight into their working</p></figcaption></figure>

#### Ready for the maiden flight?

As a developer, I am too close to the agent and thus my testing isn't really a good indication of real world use cases. I wanted to do some actual user testing to get a good gauge of where my agent is falling short. ADK is great for local development, and it has tools to deploy your agents to Google Cloud in a production environment. However, I wanted a more simpler setup. As much as I like my friends, I didn't want to host a party just to try out this agent.

I considered using Twilio to allow friends to text to my bot. However, my hobby projects have a habit of being forgotten until I am hit with a sudden bill of hundreds of \$$. I decided against using Twilio and turned to Telegram which offers a bot API. I ended up building a Telegram bot that I could serve from my machine.

Lo and behold, as soon as I gave my friends access to this bot, their testing revealed a few things:

* Most people don't know the name of most birds. They generally see a bird and want to know more facts about it.
  * I am taking this as a feature request for a new sub-agent. It will take in an image sent by the user and try to identify the bird in that image.
* Even when folks know the bird names, the way they ask the questions can cause Gemini Flash Lite, to not find the correct bird name and thus fail often.
  * I ended up upgrading the model to `gemini-2.0-flash` . This instantly improved the accuracy of identifying bird names. I am sure I can get there by tuning the prompt for Gemini Flash Lite model as well. More on this in the evaluation process.

#### A Quick Demo

Seeing is believing! Here's a short walkthrough of a typical conversation with the Wingspan Agent on Telegram

[Watch on YouTube](https://youtube.com/shorts/ql1e7TEYswU?feature=share)
Please excuse my slow typing and enjoy some birdsongs as background music

#### A note on agent's "Memory"

One interesting tidbit here. This whole conversation is maintained with an in-memory session for the user. We are using Telegram's user identifier and chat session identifier to distinguish between different users and their different conversation sessions.

This concept of memory for agents is becoming more and more crucial to make agents more personalized. This allows agents to refer back to the previous messages in the conversation and pick it back up from where a user left it off last. Developers are starting to distill the information from the user's conversations to form arbitrary user preferences, which can be used in future conversations for a more personalized results.

ADK provides more ways to store and retrieve session information. In-memory is great for development, but you probably want something more robust for your production use cases.

#### Evaluating your AI Agents

When Google released agent development kit at Google Cloud Next, I ended up chasing down some folks at the expo floor to talk more about evaluating these agents. I have been working on evaluating retrieval and agentic systems for a bit and I was very curious about how folks at Google were thinking about it. I will write a standalone blogpost about evaluations very soon.

In the meantime, I was pleasantly surprised by how easy the ADK team made it to create and evaluate your AI agents. I started with creating a new session on the ADK web UI. Conversed with my agent. And with a click of a button, I was able to use a conversation session to build my first evaluation dataset.

With a little bit of more tooling, it was easy to run `pytest` to evaluate my agent across real conversations. Remember, your agent is only as good as it's evaluations. You will be surprised to find what your agent can and can-not do. Evaluations are a great place to track them and consistently improve.

<figure><img src="../.gitbook/assets/Screenshot 2025-04-20 at 6.53.12 PM.png" alt=""><figcaption><p>Adding a new evaluation is as easy as clicking a few buttons and ADK takes care of the rest for you.</p></figcaption></figure>

#### Future flights and how you can help

This is just the beginning for the Wingspan Agent! There are so many more possibilities:

* Adding more bird species and their factual information. The dataset doesn't contain birds from Asia. I would also love to add bird call audio snippets. Are you even a birdwatcher if you can't recognize a bird from it's call?
* Adding image recognition capabilities so that you can just snap a photo and get the bird information. Does it give Pokémon vibes?
* Quizzes, generating collectible cards, ...

This project was a fantastic way to get my hands into the internals of Google's Agent Development Kit and build something practical and fun. If you're curious about AI, conversational agents, or just love birds, I encourage you to:

1. **Check out the GitHub repo:** [`https://github.com/VikramTiwari/wingspan-agent`](https://www.google.com/search?q=%5Bhttps://github.com/VikramTiwari/wingspan-agent%5D\(https://github.com/VikramTiwari/wingspan-agent\))
2. **Try running it yourself!** (Instructions are in the README).
3. **Contribute!** Found a bug? Want to add a bird? Feel free to open an issue or pull request.
4. **Get inspired!** Build your own agent about something _you're_ passionate about using the ADK.

Building the Wingspan Agent felt like teaching a digital friend about the wonders of the avian world. Hopefully this blog post demystified some aspects of AI agents development and showed how powerful tools like Google's ADK can make creating intelligent applications more accessible than ever.



Happy birding, and happy coding! :hatching\_chick:

