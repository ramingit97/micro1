#!/bin/bash
# Run migrations
npm run migration:create --name=init
npm run migration:generate --name=users

npm run migration:run
# Start the application
exec npm run start:dev