FROM oven/bun:1 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install

# Copy project files
COPY . .

# Build the VitePress site
RUN bun run docs:build

# Production stage with nginx for serving static files
FROM nginx:alpine

# Copy built static files to nginx
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html

# Copy nginx config (optional, can use default)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
