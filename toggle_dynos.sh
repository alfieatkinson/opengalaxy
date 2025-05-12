#!/bin/bash

# Check if the user is logged in to Heroku
if ! heroku auth:whoami &>/dev/null; then
    echo "You are not logged in. Logging in now..."
    heroku login
fi

# Prompt user for action
echo "Choose action:"
echo "1. Stop dynos"
echo "2. Start dynos"
read -p "Enter number: " choice

# Set the app name
APP_NAME="opengalaxy-backend"

case $choice in
    1)
        echo "Stopping dynos..."
        heroku ps:stop web --app $APP_NAME
        ;;
    2)
        echo "Starting dynos..."
        heroku ps:scale web=1 --app $APP_NAME
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac
