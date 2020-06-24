---
description: Quick code samples that I use often times for Node and JS
---

# JS and Node.js

JS code snippets

```javascript
// async await timeout
await new Promise(resolve => setTimeout(resolve, 2000))

// get URL params from URL
const urlParams = new URLSearchParams(window.location.search)
const referrer = urlParams.get('referrer')
```

Bash commands

```bash
# use a specific branch as a nodejs package
npm i VikramTiwari/tools#v1
```

My packages

* [geo-from-ip](https://www.npmjs.com/package/geo-from-ip)
* [reverse-geocode](https://www.npmjs.com/package/reverse-geocode)



