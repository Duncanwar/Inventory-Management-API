# Stage 1: Build the project
FROM node:18-bullseye-slim AS base

WORKDIR /usr/src/app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the TypeScript configuration and source code
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src

# Build the project (will output to ./dist)
RUN npm run build

# Stage 2: Create a smaller image for production
FROM node:18-bullseye-slim AS production

WORKDIR /usr/src/app

# Copy the build output from the previous stage
COPY --from=base /usr/src/app/dist ./dist

# Copy necessary files for running in production
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY ./package.json ./package.json

# Expose the port (if your app runs on port 5000, adjust if needed)
EXPOSE 5000

# Run the application
CMD ["npm", "run", "start"]
