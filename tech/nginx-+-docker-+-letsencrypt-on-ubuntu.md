---
description: How to setup a webservice using nginx + docker + LetsEncrypt on Ubuntu VMs
---

# Nginx + Docker + Let'sEncrypt on Ubuntu

## Pre-requisites

* A VM with Ubuntu 18.04 LTS running on it
* Ability to SSH into the VM
* VM should be connected to internet to get the IP address
* Access to DNS server for your domain, in order to add an entry there to create a domain name mapping to your server

Now let's prepare our VM for the task at hand. Install various packages:

```bash
# Update dependencies
sudo apt update
sudo apt -y upgrade
sudo apt install -y docker.io
sudo apt install -y nginx
```

Update Firewall

```bash
# check firewall options
sudo ufw app list

# enable all HTTP and HTTPs traffic from firewall
sudo ufw allow 'Nginx Full'

# confirm updated status
sudo ufw status

# NOTE: On GCP, the status will show inactive since firewall is external
```

## Start docker container

```text
sudo docker run -p 3000:8080 -e NODE_ENV='production' --name website-prod \
    --restart=always -d gcr.io/ivikramtiwari/website:prod
```

## Configure Nginx for HTTP access

Before we can enable HTTPs access, we need to have HTTP access enabled for our app.

* Make sure application has HTTP traffic enables from Compute Engine page

```text
# it's a good idea to create a new file for each subdomain
sudo nano /etc/nginx/sites-available/vikramtiwari.com
```

{% code-tabs %}
{% code-tabs-item title="nginx.conf" %}
```
server {
      listen 80;
      listen [::]:80;
      listen 443 ssl;
      listen [::]:443 ssl;
      server_name     vikramtiwari.com      www.vikramtiwari.com;

      include snippets/ssl-vikram.tiwari.dev.conf;
      include snippets/ssl-params.conf;

      server_tokens                   off;
      root /var/www/html;

      location / {
              proxy_read_timeout      300;
              proxy_connect_timeout   300;
              proxy_redirect          off;
              proxy_http_version      1.1;
              proxy_set_header        Host                    $http_host;
              proxy_set_header        X-Real-IP               $remote_addr;
              proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;
              proxy_set_header        X-Forwarded-Proto       $scheme;
              proxy_pass              http://0.0.0.0:3000;
      }

      location ~ /.well-known {
        allow all;
      }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

```text
# create a symlink in sites-enabled
sudo ln -s /etc/nginx/sites-available/vikramtiwari.com /etc/nginx/sites-enabled/
```

```text
# check if nginx config is correct
sudo nginx -t

# restart nginx
sudo systemctl restart nginx

# check nginx status
sudo systemctl status nginx

# find your IP address
dig +short myip.opendns.com @resolver1.opendns.com.
```

Now use your IP address to create a "**A**" type DNS record on your provider. As soon as the DNS settings are live, you should be able to access your app on your website.

## Setup LetsEncrypt

```text
# add repository
sudo add-apt-repository ppa:certbot/certbot

# install certbot
sudo apt install python-certbot-nginx

# get certificates
sudo certbot --nginx -d vikramtiwari.com -d www.vikramtiwari.com

# Follow through the options in the terminal until it shows "Congratulations!" message
```

At this point everything is setup and you are ready to receive HTTPs traffic.

Verification of HTTPs

* Using website [https://www.ssllabs.com/ssltest/analyze.html?d=vikramtiwari.com&latest](https://www.ssllabs.com/ssltest/analyze.html?d=vikramtiwari.com&latest)
* Using CLI

```text
sudo certbot renew --dry-run
```

* From nginx file. Your Nginx file should have following entries now

```text
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/vikramtiwari.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/vikramtiwari.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
```

