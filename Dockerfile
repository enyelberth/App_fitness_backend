# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy root files (lockfile and workspace config)
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source
COPY . .

# Build application
RUN pnpm build

# Prune to production only (optional, for size optimization)
RUN pnpm prune --prod

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Install pnpm
RUN npm install -g pnpm@latest

# Copy node_modules and built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 4000

# Use dumb-init to ensure proper signal handling
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start application
CMD ["node", "dist/main"]
