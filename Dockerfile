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


# -----------------------------
# API final image
# -----------------------------
FROM base AS api
WORKDIR /app

# Copy only what's needed for API runtime
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/src ./apps/api/src

# Install only production dependencies for API
RUN pnpm install --filter=api --prod --reporter=append-only

WORKDIR /app
EXPOSE 3001
CMD ["npx", "turbo", "start", "--filter=api"]


# -----------------------------
# Web final image
# -----------------------------
FROM base AS web
WORKDIR /app

# Copy only what's needed for Web runtime
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/apps/web/src ./apps/web/src

# Install only production dependencies for Web
RUN pnpm install --filter=web --prod --reporter=append-only

WORKDIR /app
EXPOSE 3000
CMD ["npx", "turbo", "start", "--filter=web"]


# -----------------------------
# Doc final image
# -----------------------------
FROM base AS doc
WORKDIR /app

# Copy only what's needed for Doc runtime
COPY --from=base /app/apps/doc/dist ./apps/doc/dist
COPY --from=base /app/apps/doc/src ./apps/doc/src

# Install only production dependencies for Doc
RUN pnpm install --filter=doc --prod --reporter=append-only

WORKDIR /app
EXPOSE 3002
CMD ["npx", "turbo", "start", "--filter=doc"]