# Base stage with Node and necessary libraries for Prisma
FROM node:20-bullseye-slim AS base
WORKDIR /usr/src/app

# Install dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev

# Build stage: Install dependencies and build the app
FROM base AS build
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma:generate && yarn build

# Production stage: Copy only what's necessary
FROM base AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
# Uncomment the following line if you need the .env file
# COPY --from=build /usr/src/app/.env ./.env

# Start the application
CMD ["yarn", "start"]
