---
description: All the goodness of Google Cloud Platform
---

# Google Cloud

* Free
  * [Free QwikLabs to build your skills using hands-on labs](https://cloud.google.com/training/free-labs)
  * [All free services from Google Cloud Platform](https://cloud.google.com/free/)
* Quick Blogs
  * [Self destruct VMs](https://medium.com/google-cloud/how-to-make-a-self-destructing-vm-on-google-cloud-platform-b99883745b62)
* Quick command line actions

```text
# add project id to the environment variable
export PROJECT_ID=$(gcloud config list --format 'value(core.project)')
```

Build docker images and push to container registry

```bash
# authentication for docker
# from https://cloud.google.com/container-registry/docs/advanced-authentication
gcloud auth configure-docker

# build a docker image locally and push to GCP container registry
docker build -t gcr.io/ivikramtiwari/website:latest .
gcloud docker -- push gcr.io/omni-daeos-runner/website:latest

# or just use cloud builds which will automatically store the image in registry
gcloud builds submit --timeout 2h --tag gcr.io/ivikramtiwari/website:latest .

# pull image for usage
gcloud docker -- pull gcr.io/ivikramtiwari/website:latest

# -- (double dashes) are used to pass parameters to docker.
# If advanced authentication is set up properly, you can skip using 
# gcloud docker
# and just use
# docker
```

VMs

### Copy data from VM to Local
```bash
# copy files from a VM to local
gcloud compute scp --recurse my-vm://home/vikramtheone1/my-files/ ./ --zone=us-central1-b
```

### Second Tab


BigQuery

### De-dupe complete table
```bash
# this will de-deup data based on all rows matching each other
CREATE OR REPLACE TABLE `project.dataset.table`
PARTITION BY timestamp
AS SELECT DISTINCT * FROM `project.dataset.table`
```

### Second Tab


