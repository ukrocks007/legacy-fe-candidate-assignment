# Multi-stage build for React frontend

# Build stage
FROM node:20-alpine AS builder

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++ py3-pip

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create directories for non-root user
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp /var/log/nginx /tmp/nginx

# Create non-root user
RUN addgroup -g 1001 -S frontend && \
    adduser -S frontend -u 1001 -G frontend

# Change ownership and permissions
RUN chown -R frontend:frontend /var/cache/nginx /var/log/nginx /tmp/nginx \
    /usr/share/nginx/html /etc/nginx/conf.d
RUN chmod -R 755 /var/cache/nginx /var/log/nginx /tmp/nginx

# Update nginx.conf to run as non-root
RUN sed -i 's/user  nginx;/user frontend;/' /etc/nginx/nginx.conf && \
    sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i 's/listen  \[::\]:80;/listen  [::]:8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i '/pid/c\pid /tmp/nginx/nginx.pid;' /etc/nginx/nginx.conf

# Expose port 8080 instead of 80
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Switch to non-root user
USER frontend

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
