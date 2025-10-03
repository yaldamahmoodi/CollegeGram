# Multi-stage Dockerfile for monorepo - OPTIMIZED
FROM node:24-slim AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace configuration files first (for better layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install dependencies first (this layer will be cached if package files don't change)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ ./apps/

# Build applications (this will be cached if source doesn't change)
RUN pnpm run build

# API stage
FROM node:24-slim AS api
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only production dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/src ./apps/api/src

WORKDIR /app/apps/api
EXPOSE 3001


# Web stage
FROM node:24-slim AS web
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only production dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/web/dist ./apps/web/dist

WORKDIR /app/apps/web
EXPOSE 3000


# Doc stage
FROM node:24-slim AS doc
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only production dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/doc/package.json ./apps/doc/
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/doc/dist ./apps/doc/dist

WORKDIR /app/apps/doc
EXPOSE 3002


FROM node:24-slim AS final
WORKDIR /app
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/apps/doc/dist ./apps/doc/dist
CMD ["pnpm", "start"]

