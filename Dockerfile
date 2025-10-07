# -----------------------------
# Base build stage
# -----------------------------
    FROM node:24-slim AS base
    WORKDIR /app
    
    # Copy workspace configuration first (for better caching)
    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
    
    # Install pnpm
    RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
    RUN npm i -g turbo
    
    # Copy package.json files first (for dependency caching)
    COPY apps/api/package.json ./apps/api/
    COPY apps/web/package.json ./apps/web/
    COPY apps/doc/package.json ./apps/doc/
    
    # Install dependencies
    RUN pnpm install --reporter=append-only
    
    # Copy source code
    COPY apps/ ./apps/
    
    # Build all apps
    RUN npx turbo run build
    
    # Verify builds
    RUN ls -la /app/apps/api/dist/ && ls -la /app/apps/web/dist/ && ls -la /app/apps/doc/dist/
    
    
    # -----------------------------
    # API final image
    # -----------------------------
    FROM base AS api
    WORKDIR /app/apps/api
    EXPOSE 3001
    CMD ["pnpm", "run", "start"]
    
    
    # -----------------------------
    # Web final image  
    # -----------------------------
    FROM base AS web
    WORKDIR /app/apps/web
    EXPOSE 3000
    CMD ["npx", "turbo", "run", "preview", "--filter", "web"]
    
    
    # -----------------------------
    # Doc final image
    # -----------------------------
    FROM base AS doc
    WORKDIR /app/apps/doc
    EXPOSE 3002
    CMD ["npx", "turbo", "run", "preview", "--filter", "doc"]