---
description: 'Mongo, MySQL, Redis and BigQuery. Mostly!'
---

# Databases

## Mongo

Export a collection to be used for import later

```bash
mongoexport --host <host>:<port> --db <database> --username <username> --password <password> --collection <collection> --out <collection>.json
```

Import the collection from exported `json` file

```bash
mongoimport --host <host>:<port> --ssl --username <username> --password <password> --authenticationDatabase admin --db <collection> --collection <collection> --type json --file <collection>.json
```

