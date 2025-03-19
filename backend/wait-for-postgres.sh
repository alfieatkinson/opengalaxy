#!/bin/sh

set -e

# For production, use DATABASE_URL environment variable provided by Heroku
if [ "$DJANGO_ENV" = "production" ]; then
  export DATABASE_HOST="$DATABASE_HOST"
  export POSTGRES_USER="$POSTGRES_USER"
  export POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
  export POSTGRES_DB="$POSTGRES_DB"
fi

# The first argument is the host (Postgres host), the rest are the commands to run after waiting for Postgres
host="$1"
shift
cmd="$@"

# Wait for Postgres to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DATABASE_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
