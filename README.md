---
description: 'hey dreamer, let''s create'
---

# Welcome

Hi there! Welcome to my notes.

Please note that most of the content on this website is copied from somewhere else. I will try to provide proper links and attribution but in case I miss something, please let me know on [twitter](https://twitter.com/vikram_tiwari).

With that out of the way, let's get other things settled as well. These are my notes. Stuff that I want to jot down for future. I am not planning on making this collaborative writing space. Stuff might be outdated, opinionated, useless and whatever. I don't care. You shouldn't either.

Enjoy!


## How to run locally

This project uses [HonKit](https://github.com/honkit/honkit) to generate the static website.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run docs:serve
   ```

3. Build the static site:
   ```bash
   npm run docs:build
   ```

### 4. Update Home Page content
The home page is a separate repository cloned into `home/`. To update it:
```bash
npm run home:update
```
