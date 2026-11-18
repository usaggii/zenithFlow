# development stage
# Use a lightweight Node base image
FROM node:20-alpine AS development

# Install pnpm globally inside the container
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy configuration files first (for efficient caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install

# Copy the rest of your application code
COPY . .

# COPY prisma ./prisma  #already mounted prisma in docker-compose.yml

# RUN npx prisma generate  #do not run generate prisma client for development, generating in package.json(instart:dev script) for development.

# Expose your NestJS port
EXPOSE 3000

# Start NestJS in watch/development mode
CMD ["pnpm", "run", "start:dev"]


# # Build stage
# FROM node:20-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npx prisma generate

# RUN npm run build

# # production stage
# FROM node:20-alpine as production

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci --omit=dev

# COPY --from=build /app/dist ./dist
# COPY --from=build /app/prisma ./prisma 

# RUN npx prisma generate

# EXPOSE 3000

# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
