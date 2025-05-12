#!/bin/bash

# Check if the user is logged in to Heroku
if ! heroku auth:whoami &>/dev/null; then
    echo "You are not logged in. Logging in now..."
    heroku login
fi

# Set the app name
APP_NAME="opengalaxy-backend"

# Check if web dynos are currently running
if heroku ps --app $APP_NAME | grep -q "web.*up"; then
    echo "Dynos are running. Stopping them..."
    heroku ps:stop web --app $APP_NAME
else
    echo "Dynos are stopped. Starting them..."
    heroku ps:scale web=1 --app $APP_NAME
fi
