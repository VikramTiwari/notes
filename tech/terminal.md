---
description: Various terminal commands that I don't wanna remember
---

# Terminal

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

{% code-tabs %}
{% code-tabs-item title="upgrades.sh" %}
```bash
# check 
for updates
sudo apt-get update

# upgrade
sudo apt-get upgrade

# install new package
sudo apt-get install new_package
```
{% endcode-tabs-item %}
{% endcode-tabs %}

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

Virtual Screen

{% code-tabs %}
{% code-tabs-item title="virtual-screen.sh" %}
```bash
# Note: you will still need to install all the dependencies for xvfb to run
xvfb-run --server-args='-screen 0 1024x768x24' node src
```
{% endcode-tabs-item %}

{% code-tabs-item title="xvfb-deps.sh" %}
```bash
apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb
apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb
```
{% endcode-tabs-item %}
{% endcode-tabs %}

