FROM node:24-slim   

WORKDIR /app

# Copy monorepo config files
COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install


# Build only the ERP app using Turbo
RUN  pnpm run build

EXPOSE 3000
# Run Turbo preview for ERP app
CMD ["pnpm","start"]