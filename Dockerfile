# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

RUN npm install -g pnpm@9.1.0


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

# Install node modules
COPY --link ./apps/server/package.json .

# Copy application code
COPY --link ./apps/server .
RUN pnpm install
RUN pnpm run build


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Set production environment
ENV NODE_ENV=production

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start" ]
