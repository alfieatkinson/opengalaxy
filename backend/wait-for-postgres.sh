#!/bin/sh

set -e

# For production, use DATABASE_URL environment variable provided by Heroku
if [ "$DJANGO_ENV" = "production" ]; then
  # Extract host, user, and password from DATABASE_URL
  export DATABASE_HOST=$(echo $DATABASE_URL | sed -E 's/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([0-9]+)\/.*/\3/')
  export POSTGRES_USER=$(echo $DATABASE_URL | sed -E 's/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([0-9]+)\/.*/\1/')
  export POSTGRES_PASSWORD=$(echo $DATABASE_URL | sed -E 's/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([0-9]+)\/.*/\2/')
fi

# The first argument is the host (Postgres host), the rest are the commands to run after waiting for Postgres
host="$1"
shift
cmd="$@"

# Wait for Postgres to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DATABASE_HOST" -U "$POSTGRES_USER" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
