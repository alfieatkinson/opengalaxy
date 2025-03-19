# Use a lightweight Python image
FROM python:3.12-alpine

# Set environment variables to ensure Python outputs are directed to the console
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set the working directory for the container
WORKDIR /app/backend

# Copy the Python dependencies file into the container
COPY requirements.txt .

# Install system dependencies required for GeoDjango, including compilation dependencies and geospatial libraries
RUN apk update && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev python3-dev && \
    apk add --no-cache geos gdal proj binutils postgresql-client && \
    pip install --no-cache-dir -r requirements.txt && \
    apk del .build-deps

# Copy the entire project into the container
COPY . .

# Copy the wait-for-postgres.sh script into the container and make it executable
COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Copy the entrypoint.sh script into the container and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Conditional ENTRYPOINT
# If DJANGO_ENV is 'production', don't use entrypoint.sh for Heroku.
# Otherwise, use entrypoint.sh for local development.
ARG DJANGO_ENV
RUN if [ "$DJANGO_ENV" != "production" ]; then \
    echo "Using entrypoint.sh for development..."; \
    ENTRYPOINT ["/entrypoint.sh"]; \
    else \
    echo "Production environment: skipping entrypoint.sh"; \
    ENTRYPOINT ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:$PORT"]; \
    fi
