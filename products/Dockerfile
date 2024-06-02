FROM node:20

WORKDIR /app

COPY package*.json ./

# RUN npm install

COPY . .

# Copy the entrypoint script to the container
COPY docker-entrypoint.sh .

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh
RUN chmod 777 docker-entrypoint.sh

# Specify the entrypoint script
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]