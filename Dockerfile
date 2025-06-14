# Use the official Node.js LTS image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies required for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json yarn.lock* pnpm-lock.yaml* ./

# Install dependencies based on available lock file
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --only=production; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

WORKDIR /app

# Copy built application from base stage
COPY --from=base --chown=nuxtjs:nodejs /app/.output ./
COPY --from=base --chown=nuxtjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nuxtjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server/index.mjs"] 