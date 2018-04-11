FROM nginx:1.9

RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends\
    apt-transport-https \
    libnss3-dev \
    bzip2 \
    curl \
    git \
    rlwrap \
    vim \
  && curl https://deb.nodesource.com/node_6.x/pool/main/n/nodejs/nodejs_6.11.2-1nodesource1\~jessie1_amd64.deb > node.deb \
  && dpkg -i node.deb \
  && rm node.deb \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV APP_HOME=/opt/app

RUN chown -R root.root /var/cache/nginx && \
    chmod -R g+rw /var/cache/nginx  && \
    chown -R root.root /tmp  && \
    chmod -R g+rw /tmp

COPY . $APP_HOME/

WORKDIR $APP_HOME

RUN npm install --no-save
RUN ./node_modules/.bin/gulp build.prod --base=##BASE_URL## --color --env-config prod --build-type prod
RUN cp $APP_HOME/dist/prod/js/app.js $APP_HOME/dist/prod/js/app.js.template
RUN cp $APP_HOME/dist/prod/index.html $APP_HOME/dist/prod/index.html.template


FROM nginx:1.9

ENV NGINX_HOME=/var/www/html

RUN mkdir -p $NGINX_HOME/prod && \
    mkdir -p /etc/nginx/sites-enabled

COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/nginx-site.conf /etc/nginx/sites-enabled/nginx-site.conf
COPY --from=0 /opt/app/dist/prod $NGINX_HOME/prod


WORKDIR /
ADD .docker/boot.sh /

EXPOSE 8080

CMD ["/boot.sh"]

