# Use official Node.js 24 image
FROM node:24.6.0

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Default command to run your app
CMD ["pnpm","run", "start"]