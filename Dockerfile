# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm globally (if needed)
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy everything from the build context
COPY . .

# Install dependencies in the frontend directory
RUN cd frontend && npm install

# Build the application
RUN cd frontend && npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
