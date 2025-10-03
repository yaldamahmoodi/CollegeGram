# -----------------------------
# Base build stage
# -----------------------------
FROM node:24-slim AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy all package.json files to respect workspace structure
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/doc/package.json ./apps/doc/

# Install all dependencies (including Turbo)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ ./apps/
COPY turbo.json ./

# Build all apps using Turbo
RUN pnpm run build


# -----------------------------
# API final image
# -----------------------------
FROM node:24-slim AS api
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/

# Install only production deps for API
RUN pnpm install --prod --filter=api

# Copy built app from base stage
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Copy source files needed at runtime (if any)
COPY --from=base /app/apps/api/src ./apps/api/src

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/server.js"]


# -----------------------------
# Web final image
# -----------------------------
FROM node:24-slim AS web
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/

# Install only production deps for Web (Vite needs to be available for preview)
RUN pnpm install --filter=web

# Copy built app from base stage
COPY --from=base /app/apps/web/dist ./apps/web/dist

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]


# -----------------------------
# Doc final image
# -----------------------------
FROM node:24-slim AS doc
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/doc/package.json ./apps/doc/

# Install only production deps for Doc (Vite needs to be available for preview)
RUN pnpm install --filter=doc

# Copy built app from base stage
COPY --from=base /app/apps/doc/dist ./apps/doc/dist

WORKDIR /app/apps/doc
EXPOSE 3002
CMD ["pnpm", "start"]