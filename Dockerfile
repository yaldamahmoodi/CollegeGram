# -----------------------------
# Base build stage
# -----------------------------
FROM node:24-slim AS base
WORKDIR /app

# Enable corepack and prepare for pnpm 10.14.0
RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate
RUN npm install -g turbo

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy all package.json files to respect workspace structure
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/doc/package.json ./apps/doc/

# Verify pnpm version and install all dependencies
RUN pnpm --version
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ ./apps/
COPY turbo.json ./

# Build all apps using Turbo
RUN turbo run build


# -----------------------------
# API final image
# -----------------------------
FROM node:24-slim AS api
WORKDIR /app

# Enable corepack and prepare for pnpm 10.14.0
RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate
RUN npm install -g turbo

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/

# Verify pnpm version and install all dependencies for API
RUN pnpm --version
RUN pnpm install --filter=api

# Copy built app and source from base stage
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/src ./apps/api/src
COPY --from=base /app/turbo.json ./
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

WORKDIR /app
EXPOSE 3001
CMD ["npx", "turbo", "start", "--filter=api"]


# -----------------------------
# Web final image
# -----------------------------
FROM node:24-slim AS web
WORKDIR /app

# Enable corepack and prepare for pnpm 10.14.0
RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate
RUN npm install -g turbo

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/

# Verify pnpm version and install all dependencies for Web
RUN pnpm --version
RUN pnpm install --filter=web

# Copy built app and source from base stage
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/apps/web/src ./apps/web/src
COPY --from=base /app/turbo.json ./
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

WORKDIR /app
EXPOSE 3000
CMD ["npx", "turbo", "start", "--filter=web"]


# -----------------------------
# Doc final image
# -----------------------------
FROM node:24-slim AS doc
WORKDIR /app

# Enable corepack and prepare for pnpm 10.14.0
RUN corepack enable
RUN corepack prepare pnpm@10.14.0 --activate
RUN npm install -g turbo

# Copy workspace metadata
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/doc/package.json ./apps/doc/

# Verify pnpm version and install all dependencies for Doc
RUN pnpm --version
RUN pnpm install --filter=doc

# Copy built app and source from base stage
COPY --from=base /app/apps/doc/dist ./apps/doc/dist
COPY --from=base /app/apps/doc/src ./apps/doc/src
COPY --from=base /app/turbo.json ./
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

WORKDIR /app
EXPOSE 3002
CMD ["npx", "turbo", "start", "--filter=doc"]