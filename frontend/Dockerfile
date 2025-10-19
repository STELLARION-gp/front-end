# ============================================
# Stage 1: Build React Application
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_BACKEND_URL
ARG VITE_API_ENDPOINT
ARG VITE_CHATBOT_PROVIDER
ARG VITE_CHATBOT_API_URL

# Set environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://stellarion.duckdns.org}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL:-http://stellarion.duckdns.org}
ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT:-/api}
ENV VITE_CHATBOT_PROVIDER=${VITE_CHATBOT_PROVIDER:-custom}
ENV VITE_CHATBOT_API_URL=${VITE_CHATBOT_API_URL:-http://stellarion.duckdns.org/api}

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production Nginx Server
# ============================================
FROM nginx:stable-alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
