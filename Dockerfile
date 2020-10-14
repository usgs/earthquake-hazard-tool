ARG BUILD_IMAGE=usgs/node:latest
ARG FROM_IMAGE=usgs/httpd-php:latest


FROM ${BUILD_IMAGE} as buildenv

# php required for pre-install
USER root
RUN yum install -y \
        bzip2 \
        git \
        php \
        php-pdo \
        php-pgsql \
    && npm install -g grunt-cli

COPY . /earthquake-hazard-tool
WORKDIR /earthquake-hazard-tool

# Build project
RUN /bin/bash --login -c "\
    npm install --no-save \
    && php src/lib/pre-install.php --non-interactive \
    && grunt build \
    && rm dist/conf/config.ini \
    "

ENV APP_DIR=/var/www/apps

# Pre-configure template
RUN /bin/bash --login -c "\
    mkdir -p ${APP_DIR}/hazdev-template && \
    cp -r node_modules/hazdev-template/dist/* ${APP_DIR}/hazdev-template/. && \
    php ${APP_DIR}/hazdev-template/lib/pre-install.php --non-interactive \
    "

# Pre-configure app
RUN /bin/bash --login -c "\
    mkdir -p ${APP_DIR}/earthquake-hazard-tool && \
    cp -r dist/* ${APP_DIR}/earthquake-hazard-tool/. && \
    php ${APP_DIR}/earthquake-hazard-tool/lib/pre-install.php --non-interactive \
    "


FROM ${FROM_IMAGE}

COPY --from=buildenv /var/www/apps/ /var/www/apps/

# configure template and apps
RUN /bin/bash --login -c "\
    cp /var/www/apps/earthquake-hazard-tool/htdocs/_config.inc.php /var/www/html/. && \
    ln -s /var/www/apps/hazdev-template/conf/httpd.conf /etc/httpd/conf.d/hazdev-template.conf && \
    ln -s /var/www/apps/earthquake-hazard-tool/conf/httpd.conf /etc/httpd/conf.d/earthquake-hazard-tool.conf \
    "

HEALTHCHECK \
    --interval=15s \
    --timeout=1s \
    --start-period=1m \
    --retries=2 \
  CMD \
    test $(curl -s -o /dev/null -w '%{http_code}' http://localhost/hazards/interactive/) -eq 200

# this is set in usgs/httpd-php:latest, and repeated here for clarity
EXPOSE 80