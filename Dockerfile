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
COPY turbo.json ./

# Copy all package.json files to respect workspace structure
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/doc/package.json ./apps/doc/

# Install all dependencies for the entire monorepo
RUN pnpm --version
RUN pnpm install --reporter=append-only

# Copy source code
COPY apps/ ./apps/

# Build all apps using Turbo (handles dependencies automatically)
RUN turbo run build

# Verify the build output
RUN ls -la /app/apps/api/dist/
RUN ls -la /app/apps/web/dist/
RUN ls -la /app/apps/doc/dist/

CMD ["pnpm", "turbo", "run", "start"]