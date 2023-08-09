# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

ENV PORT=8080

RUN set -ex && \
    adduser node root

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm ci

# Copy local code to the container image.
COPY . ./

RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "run", "start" ]
