---
description: some docker and k8s commands I don't wanna search over internet
---

# Docker and Kubernetes

 Docker ecosystem

{% tabs %}
{% tab title="docker-basics.sh" %}
```bash
# create an image with a tag from git (courtesy of @ahmetb: https://twitter.com/ahmetb/status/1154882328813924352)
docker build -t website:${git describe --always --tags --dirty} .

# run container
docker run -p 3000:8080 -e NODE_ENV='production' --name website-prod \
    --restart=always -d gcr.io/ivikramtiwari/website:prod

# access bash inside a running container
docker exec -it container-name bash

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
{% endtab %}

{% tab title="logger.sh" %}
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
{% endtab %}
{% endtabs %}

Kubernetes

{% code title="deployments-using-kubectl.sh" %}
```bash
# all commands: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

# get credentials for your gcp cluster
gcloud container clusters get-credentials dev-cluster --zone=us-central1-f

# create a deployment on your cluster
kubectl run website-deployment --image=gcr.io/ivikramtiwari/website

# check if deployment was successful
kubectl get deployments

# get pods
kubectl get pods

# scale deployments
kubectl scale deployment website-deployment --replicas=4

# rolling updates
kubectl set image deployments/website-deployment website-deployment=gcr.io/ivikramtiwari/website@sha256:$SHA

# remove evicted pods
kubectl get pods | grep Evicted | awk '{print $1}' | xargs kubectl delete pod

# remove all pods
kubectl delete --all pods 

# tail a deployment
kubectl logs deployment/website-deployment --tail 10 -f

# ssh into a pod
kubectl exec -it my-pod -- /bin/bash
```
{% endcode %}



