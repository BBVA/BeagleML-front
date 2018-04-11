# BeagleML Front

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