# ------------------------
# Stage 1: Build frontend
# ------------------------
FROM node:18-alpine AS build

# 1️⃣ Set working directory
WORKDIR /app

# 2️⃣ Copy package files and install dependencies
COPY package*.json ./

# 3️⃣ Install dependencies (including devDependencies for build)
RUN npm ci

# 4️⃣ Copy the rest of the source files
COPY . .

# 5️⃣ Build the project (TypeScript + Vite)
RUN npm run build


# ------------------------
# Stage 2: Serve with Nginx
# ------------------------
FROM nginx:stable-alpine

# 6️⃣ Copy built files from builder stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# 7️⃣ Expose port 80
EXPOSE 80

# 8️⃣ Start Nginx
CMD ["nginx", "-g", "daemon off;"]
