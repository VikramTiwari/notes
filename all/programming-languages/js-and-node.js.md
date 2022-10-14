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

Usage stats

```
{
    "cpu": {
        "percentCPUUsage": 1.0680278390927143, // Percentage of CPU used since the last call to getCPUUsage. First call returns 0
        "idleWakeupsPerSecond": 29 // The number of average idle CPI wakeups per second since the last call to getCPUUsage. First call returns 0. Will always return 0 on windows since it's a mac only optimization.
    },
    "io": {},
    "heap": {
        "totalHeapSize": 262736, // number of bytes V8 has allocated for the heap. This can grow if used heap needs more.
        "totalHeapSizeExecutable": 4608, // number of bytes for compiled bytecode and JITed code
        "totalPhysicalSize": 261440, // committed size
        "totalAvailableSize": 1872611, // available heap size
        "usedHeapSize": 238739, // number of bytes in use by application data
        "heapSizeLimit": 2121728, // the absolute limit the heap cannot exceed. Default limit or --max_old_space_size
        "mallocedMemory": 520, // current amount of memory, obtained via malloc
        "peakMallocedMemory": 5735, // peak amount of memory, obtained via malloc
        "doesZapGarbage": false // V8 overwrites heap garbage with a bit pattern
    },
    "memory": {
        "blink": {
            "allocated": 0, // allocated memory to the BrowserWindow for electron app
            "total": 0 // total memory for the BrowserWindow for electron app
        },
        "system": {
            "total": 8388608, // total RAM on the machine in kbs
            "free": 73072 // free RAM on the machine in kbs
        },
        "process": {
            "private": 370596, // the amount of memory not shared by other processes, such as JS heap or HTML content in kbs
            "shared": 0 // the amount of memory shared between processes, typically memory consumed by the electron code itself in kbs
        }
    }
}
```



My packages

* [geo-from-ip](https://www.npmjs.com/package/geo-from-ip)
* [reverse-geocode](https://www.npmjs.com/package/reverse-geocode)

