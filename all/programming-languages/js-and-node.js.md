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
const referrer = urlParams.get('referrer') // google
const sizes = urlParams.getAll('sizes') // ['small', 'medium']
```

DOM Manipulation methods

```javascript
/**
 * get an element DOM node from xpath
 * 
 * @param {string} path
 * @returns {HTMLElement}
 */
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

/** 
 * Query Selectors
 */
let node 
// by id
node = document.querySelector(`#id`)
// by class
node = document.querySelector(`.class`)
// by property of an element
node = document.querySelector(`[aria-label="Search"]`)
// by DOM path
node = document.querySelector(`#body > div#id > p.class`)
```

Bash commands

```bash
# use a specific branch as a nodejs package
npm i VikramTiwari/tools#v1
```

My packages

* [geo-from-ip](https://www.npmjs.com/package/geo-from-ip)
* [reverse-geocode](https://www.npmjs.com/package/reverse-geocode)



