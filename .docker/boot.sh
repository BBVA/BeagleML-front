#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o errtrace

set_custom_config() {
  if [ -z "$API" ]; then
    echo "ERROR: Need to set API environment variable."
    exit 1
  fi

  if [ -z "$BASE_URL" ]; then
    echo "ERROR: Need to set BASE_URL environment variable."
    exit 1
  fi

	cp /var/www/html/prod/js/app.js.template /var/www/html/prod/js/app.js
  sed -i 's;##API##;'"${API}"';g' /var/www/html/prod/js/app.js
  sed -i 's;##BASE_URL##;'"${BASE_URL}"';g' /var/www/html/prod/js/app.js

  sed 's;##BASE_URL##;'"${BASE_URL}"';g' /var/www/html/prod/index.html.template > /var/www/html/prod/index.html
}

set_custom_config

nginx
