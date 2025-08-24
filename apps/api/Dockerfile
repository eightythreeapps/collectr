# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package.json and pnpm workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages (for workspace dependencies)
COPY packages/ ./packages/

# Copy api app
COPY apps/api/ ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API
RUN pnpm --filter @collectr/api build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Expose port (assuming it uses 3000 or 8080)
EXPOSE 8080

# Start the application
CMD ["pnpm", "--filter", "@collectr/api", "start"]