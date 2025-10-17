# ------------------------
# Stage 1: Build frontend
# ------------------------
FROM node:18-alpine AS build

# 1️⃣ Set working directory
WORKDIR /app

# 2️⃣ Copy package files and install dependencies
#    We explicitly set NODE_ENV=development so devDependencies are installed
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install

# 3️⃣ Copy the rest of the source files
COPY . .

# 4️⃣ Build the project (TypeScript + Vite)
RUN npm run build


# ------------------------
# Stage 2: Serve with Nginx
# ------------------------
FROM nginx:stable-alpine

# 5️⃣ Copy built files from builder stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# 6️⃣ Expose port 80
EXPOSE 80

# 7️⃣ Start Nginx
CMD ["nginx", "-g", "daemon off;"]
