#!/bin/sh

set -e

# For production, ensure the environment variables are set.
if [ "$DJANGO_ENV" = "production" ]; then
  # Optionally, you could re-export them as you already do:
  export DATABASE_HOST="$DATABASE_HOST"
  export POSTGRES_USER="$POSTGRES_USER"
  export POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
  export POSTGRES_DB="$POSTGRES_DB"
fi

# If DATABASE_HOST is empty, use the first argument as fallback.
if [ -z "$DATABASE_HOST" ]; then
  DATABASE_HOST="$1"
fi

# The first argument is consumed (if not already set via env)
shift

# Wait for Postgres to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DATABASE_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "DEBUG: DATABASE_HOST is '$DATABASE_HOST'"
  >&2 echo "DEBUG: POSTGRES_USER is '$POSTGRES_USER'"
  >&2 echo "DEBUG: POSTGRES_DB is '$POSTGRES_DB'"
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec "$@"
