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

# Remove default Nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom Nginx configuration for production
RUN echo 'server { \n\
    listen 80; \n\
    server_name stellarion.duckdns.org; \n\
    \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    \n\
    # Enable gzip compression \n\
    gzip on; \n\
    gzip_vary on; \n\
    gzip_min_length 1024; \n\
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json; \n\
    \n\
    # Security headers \n\
    add_header X-Frame-Options "SAMEORIGIN" always; \n\
    add_header X-Content-Type-Options "nosniff" always; \n\
    add_header X-XSS-Protection "1; mode=block" always; \n\
    add_header Referrer-Policy "no-referrer-when-downgrade" always; \n\
    \n\
    # Serve static files with caching \n\
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ { \n\
        expires 1y; \n\
        add_header Cache-Control "public, immutable"; \n\
    } \n\
    \n\
    # API proxy to backend \n\
    location /api/ { \n\
        proxy_pass http://stellarion-backend:5000/; \n\
        proxy_http_version 1.1; \n\
        \n\
        # WebSocket support \n\
        proxy_set_header Upgrade $http_upgrade; \n\
        proxy_set_header Connection "upgrade"; \n\
        \n\
        # Standard proxy headers \n\
        proxy_set_header Host $host; \n\
        proxy_set_header X-Real-IP $remote_addr; \n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \n\
        proxy_set_header X-Forwarded-Proto $scheme; \n\
        \n\
        # Timeouts \n\
        proxy_connect_timeout 60s; \n\
        proxy_send_timeout 60s; \n\
        proxy_read_timeout 60s; \n\
        \n\
        # Disable caching for API requests \n\
        proxy_cache_bypass $http_upgrade; \n\
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \n\
    } \n\
    \n\
    # Socket.io proxy \n\
    location /socket.io/ { \n\
        proxy_pass http://stellarion-backend:5000/socket.io/; \n\
        proxy_http_version 1.1; \n\
        proxy_set_header Upgrade $http_upgrade; \n\
        proxy_set_header Connection "upgrade"; \n\
        proxy_set_header Host $host; \n\
        proxy_set_header X-Real-IP $remote_addr; \n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \n\
        proxy_set_header X-Forwarded-Proto $scheme; \n\
    } \n\
    \n\
    # Admin panel proxy \n\
    location /admin { \n\
        proxy_pass http://stellarion-backend:5000/admin; \n\
        proxy_http_version 1.1; \n\
        proxy_set_header Host $host; \n\
        proxy_set_header X-Real-IP $remote_addr; \n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \n\
        proxy_set_header X-Forwarded-Proto $scheme; \n\
    } \n\
    \n\
    # React Router: serve index.html for all other routes \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
    \n\
    # Error pages \n\
    error_page 500 502 503 504 /50x.html; \n\
    location = /50x.html { \n\
        root /usr/share/nginx/html; \n\
    } \n\
} \n\
' > /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
