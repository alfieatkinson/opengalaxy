#!/bin/sh

# Wait for Postgres to be ready
/wait-for-postgres.sh postgresdb

# If in production, don't run migrations in entrypoint.sh, as they will be handled by heroku.yml
if [ "$DJANGO_ENV" == "development" ]; then
  echo "Running migrations and collecting static files (Development)..."
  poetry run python manage.py migrate
  poetry run python manage.py collectstatic --noinput
fi

# Start Django application with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
