---
description: Various linux commands that I don't wanna remember
---

# Linux

## Super Powers

Let there be life!

{% code-tabs %}
{% code-tabs-item title="create.sh" %}
```bash
# create file with name george
touch george

# create directory named george
mkdir george
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Upgrades.

```bash
# check for updates
sudo apt-get update

# upgrade
sudo apt-get upgrade

# install new package
sudo apt-get install new_package
```

Destruction superpowers! **Be careful**.

{% code-tabs %}
{% code-tabs-item title="destroy.sh" %}
```bash
# find process running on port 5000
sudo lsof -i tcp:5000

# kill a process with pid 1990
kill -9 1990

# find and kill a process running on port 5000
sudo kill $( sudo lsof -i tcp:5000 -t )

# kill all processes named Preview
killall -9 Preview
```
{% endcode-tabs-item %}
{% endcode-tabs %}



