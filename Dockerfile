# -----------------------------
# Base build stage
# -----------------------------
    FROM node:24-slim AS base
    WORKDIR /app
    RUN npm install -g pnpm
    
    # Copy only manifests for caching
    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
    COPY apps/*/package.json apps/*/
    
    # Install all deps
    RUN pnpm install --frozen-lockfile
    
    # Copy everything else (excluding node_modules/.turbo via .dockerignore)
    COPY . .
    
    # Build all apps
    RUN pnpm run build
    
    
    
    # -----------------------------
    # API final image
    # -----------------------------
    FROM node:24-slim AS api
    WORKDIR /app
    RUN npm install -g pnpm
    
    # Copy workspace metadata + manifests
    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
    COPY apps/*/package.json apps/*/
    
    # Install only production deps for API
    RUN pnpm install --prod --filter=api
    
    # Copy built app
    COPY --from=base /app/apps/api/dist ./apps/api/dist
    
    WORKDIR /app/apps/api
    EXPOSE 3001
    CMD ["pnpm", "start"]
    
    
    # -----------------------------
    # Web final image
    # -----------------------------
    FROM node:24-slim AS web
    WORKDIR /app
    RUN npm install -g pnpm
    
    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
    COPY apps/*/package.json apps/*/
    
    # Install only production deps for Web
    RUN pnpm install --prod --filter=web
    
    COPY --from=base /app/apps/web/dist ./apps/web/dist
    
    WORKDIR /app/apps/web
    EXPOSE 3000
    CMD ["pnpm", "start"]
    
    
    # -----------------------------
    # Doc final image
    # -----------------------------
    FROM node:24-slim AS doc
    WORKDIR /app
    RUN npm install -g pnpm
    
    COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
    COPY apps/*/package.json apps/*/
    
    # Install only production deps for Doc
    RUN pnpm install --prod --filter=doc
    
    COPY --from=base /app/apps/doc/dist ./apps/doc/dist
    
    WORKDIR /app/apps/doc
    EXPOSE 3002
    CMD ["pnpm", "start"]
    