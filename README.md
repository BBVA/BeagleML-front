# Automod Front

This project was build with [Angular Seed](https://github.com/mgechev/angular-seed)

## Dev with docker

You can dev with docker and when you modify any file, the container will rebuild and update the browser. However deving with docker cannot run karma tests inside the container (no headless browser).

```
docker-compose build
docker-compose up
```

## Dev without docker

You can run the project directly from your filesystem and start a mountebank container to provide mocks. This way you can use
the start.deving script to automatically run tests on every code change, and automated browser update.

```
# start app serving and testing
npm run start.deving
```

```
# up the mountebank docker image from the seed root
docker run -it -p 8010:8010 -p 2525:2525 -v $(pwd)/mountebank/imposters/:/mb/ automod/mountebank /bin/bash
#inside the container
mb --configfile /mb/imposters.ejs --allowInjection --allowCORS
```

## Mountebank

[Mountebank](http://www.mbtest.org/) was added to the docker workflow to provide a mock server.

You can add imposters in `mountebank/imposters` and they will be loaded in the mock server when
the container is started.

The mountebank server is started in `http://localhost:8010`

## Deploy

### Build/Upload using Jenkins

There is a Jenkins file that builds, tags, and pushes the image to an ECR, and uploads it to Openshift catalog.

### Deploy on OpenShift

The easiest way to deploy it is using Openshift catalog.

### Delete service from console

Since all different objects of the deployment (service, route, and deploymentconfig) are labeled with ```label:@{APP}```:
- you can request the objects to delete by typing:
 ```
 oc get all -l app=automodeling-front
 ```

- and you can delete all by typing:
```
oc delete all -l app=automodeling-front
```

### Usage of ServiceAccount

In ```openshift.yml``` file we force the DeploymentConfig to use ```omodeling-bot``` service account (SA) (in automodeling-scheduler's Readme.md there are instructions to create it).

```
spec:
  serviceAccountName: modeling-bot
  serviceAccount: modeling-bot
```

Due to ```automodeling-front``` nginx-based current docker image, it is necessary to add ```anyuid``` policy to this SA:
```
oc adm policy add-scc-to-user anyuid system:serviceaccount:modeling:modeling-bot
```
Moreover, this SA must be able to download images from AWS registry.

## Mountebank Sample Edpoints
http://localhost:8010/api/v1/projects
http://localhost:8010/api/v1/systems
http://localhost:8010/api/v1/projects/58f5ceb3e14b0a10074c6daf
http://localhost:8010/api/v1/projects/58f9ceb3e14b0a00074c6daf/experiments?offset=0&limit=10000


## Local API Sample Edpoints
http://localhost:5000/api/v1/projects
http://localhost:5000/api/v1/systems
http://localhost:5000/api/v1/projects/58f5ceb3e14b0a10074c6daf
http://localhost:5000/api/v1/projects/58f9ceb3e14b0a00074c6daf/experiments?offset=0&limit=10000