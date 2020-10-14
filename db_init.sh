#!/bin/bash

DB_CONTAINER=${DB_CONTAINER:-"earthquake-hazard-tool-db"}
WS_CONTAINER=${WS_CONTAINER:-"earthquake-hazard-tool"}
DB_USER=${DB_USER:-"postgres"}
DB_NAME=${DB_NAME:-"earthquake"}

docker exec ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} -c "CREATE SCHEMA ${DB_NAME} AUTHORIZATION ${DB_USER}"
docker exec ${WS_CONTAINER} php /var/www/apps/earthquake-hazard-tool/lib/db/setup.php