#!/bin/bash

# Check if the user is logged in to Heroku
if ! heroku auth:whoami &>/dev/null; then
    echo "You are not logged in. Logging in now..."
    heroku login
fi

# Set the app name
APP_NAME="opengalaxy-backend"

# Default action is to stop dynos
ACTION="stop"

# Parse command line arguments
while getopts "s|S|t|T" flag; do
    case "${flag}" in
        s|S) ACTION="start" ;;
        t|T) ACTION="stop" ;;
        *) echo "Invalid option. Use -s to start and -t to stop."; exit 1 ;;
    esac
done

# Perform the selected action
case $ACTION in
    start)
        echo "Starting dynos..."
        heroku ps:scale web=1 --app $APP_NAME
        ;;
    stop)
        echo "Stopping dynos..."
        heroku ps:scale web=0 --app $APP_NAME
        ;;
    *)
        echo "Invalid action. Exiting."
        exit 1
        ;;
esac
