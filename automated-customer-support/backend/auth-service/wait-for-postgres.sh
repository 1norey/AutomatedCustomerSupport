#!/bin/sh

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ PostgreSQL is up - starting auth-service"
exec node index.js
