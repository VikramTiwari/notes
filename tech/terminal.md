---
description: Various terminal commands that I don't wanna remember
---

# Terminal

## Super Powers

Let there be life!

{% tabs %}
{% tab title="create.sh" %}
```bash
# create directory named george
mkdir george

# create file with name george
touch george

# edit file
nano george

# edit with vi
vi george
```
{% endtab %}

{% tab title="upgrades.sh" %}
```bash
# check for updates
sudo apt-get update

# upgrade
sudo apt-get upgrade

# install new package
sudo apt-get install new_package

# cleanup
sudo apt-get autoremove
```
{% endtab %}

{% tab title="destroy.sh" %}
```bash
# find process running on port 5000
sudo lsof -i tcp:5000

# kill a process with pid 1990
kill -9 1990

# find and kill a process running on port 5000
sudo kill $( sudo lsof -i tcp:5000 -t )

# kill all processes named Google Chrome Helper
killall -9 "Google Chrome Helper"
```
{% endtab %}

{% tab title="usage.sh" %}
```bash
# check docker usage
sudo docker stats

# check process usage
top

# check memory usage
free -h

# check disk usage
df -lh

# list all directories in current folder with their size
du -h
```
{% endtab %}

{% tab title="process.sh" %}
```bash
# full process tree
ps -axfo pid,uname,cmd
```
{% endtab %}

{% tab title="security.sh" %}
```bash
# check application certificate
spctl -a -vv /Applications/Google\ Chrome.app
# /Applications/Google Chrome.app: accepted
# source=Notarized Developer ID
# origin=Developer ID Application: Google, Inc. (EQHXZ8M8AV)
```
{% endtab %}
{% endtabs %}





Virtual Screen

{% tabs %}
{% tab title="virtual-screen.sh" %}
```bash
# Note: you will still need to install all the dependencies for xvfb to run
xvfb-run --server-args='-screen 0 1024x768x24' node src
```
{% endtab %}

{% tab title="xvfb-deps.sh" %}
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
{% endtab %}
{% endtabs %}

Loops

{% tabs %}
{% tab title="for.sh" %}
```bash
# For loop using counter
for COUNTER in `seq 1 10`;
do
    echo The counter is $COUNTER
done

# For loop using other values
for i in $( ls ); do
    echo item: $i
done
```
{% endtab %}

{% tab title="while.sh" %}
```bash
COUNTER=0
while [  $COUNTER -lt 10 ]; do
    echo The counter is $COUNTER
    let COUNTER=COUNTER+1
done
```
{% endtab %}

{% tab title="until.sh" %}
```bash
COUNTER=20
until [  $COUNTER -lt 10 ]; do
    echo COUNTER $COUNTER
    let COUNTER-=1
done
```
{% endtab %}
{% endtabs %}

