---
description: some docker commands I don't wanna search over internet
---

# Docker

```text
# access bash inside a running container
sudo docker exec -it container-name bash

# remove all stopped containers
docker rm -v $(docker ps -a -q -f status=exited)

# stop and remove all docker containers
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)

# remove all docker images
docker rmi $(docker images -a -q)

# prune docker system
docker system prune

# one liner for docker cleanup
docker stop $(docker ps -a -q) && \
    docker rm $(docker ps -a -q) && \
    docker rmi $(docker images -a -q) && \
    docker system prune
```

Some scripts for Docker related systems

{% code-tabs %}
{% code-tabs-item title="logger.sh" %}
```bash
#!/bin/bash
function _exit {
  kill $(jobs -p)
}

trap _exit EXIT

for name in $(docker ps --format "{{.Names}}"); do
  eval "docker logs -f --tail=5 \"$name\" | sed -e \"s/^/[$name] /\" &";
done

wait
# to exit logging, bring the process in foreground and exit
# $ fg
# $ Command + C

# from https://stackoverflow.com/a/54917272/1724300
```
{% endcode-tabs-item %}
{% endcode-tabs %}



