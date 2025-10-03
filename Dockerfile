# Multi-stage Dockerfile for monorepo
FROM node:24-slim AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy all package.json files for dependency resolution
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/doc/package.json ./apps/doc/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code for all apps
COPY apps/api/ ./apps/api/
COPY apps/web/ ./apps/web/
COPY apps/doc/ ./apps/doc/

# Build all applications
RUN pnpm run build

# API stage
FROM base AS api
WORKDIR /app/apps/api
EXPOSE 3001
CMD ["pnpm", "start"]

# Web stage
FROM base AS web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]

# Doc stage
FROM base AS doc
WORKDIR /app/apps/doc
EXPOSE 3002
CMD ["pnpm", "start"]
