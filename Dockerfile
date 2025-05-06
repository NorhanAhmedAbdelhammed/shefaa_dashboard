#########################################################
# Build Stage: install dependencies and build the project
#########################################################

FROM node:slim As build

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY --chown=node:node ./package*.json .

# Install node modules (must install dev dependcies as well so that the build command works)
RUN npm install
RUN npm ci

# Copy the rest of the repository files and folders
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Use the node user from the image (instead of the root user)
USER node

#############################################################
# Production Stage: serves the static build files using Nginx
#############################################################

FROM nginx:stable-alpine As production

# Copy the build folder "dist" from the previous stage into the nginx html folder
COPY --chown=node:node --from=build /usr/src/app/dist /usr/share/nginx/html
