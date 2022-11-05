#!/bin/bash

export NODE_ENV=$NODE_ENV
export APP_ID=$APP_ID
export APP_SECRET=$APP_SECRET
export ENCODING_AES_KEY=$ENCODING_AES_KEY
export MYSQL_DATABASE_NAME=$MYSQL_DATABASE_NAME
export MYSQL_HOST=$MYSQL_HOST
export MYSQL_PASSWORD=$MYSQL_PASSWORD
export MYSQL_PORT=$MYSQL_PORT
export MYSQL_USERNAME=$MYSQL_USERNAME
export ORIGIN_ID=$ORIGIN_ID
export TOKEN=$TOKEN

echo "-------------master server ------------------"
node /app/dist/main.js