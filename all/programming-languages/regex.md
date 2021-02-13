---
description: Various regex resources that I have found useful
---

# Regex

Websites

* [RegExr](https://regexr.com/)
* [RegExp Test](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)

Samples

```javascript
// Duration Timestamp check. 00:00 to 999:999
// Increase 8 to larger number to check for longer timestamps.
const isDurationTimestamp = /^([0-9:]{5,8})$/.test(`00:01`)
```

