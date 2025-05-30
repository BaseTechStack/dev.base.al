# Simple static file server based on nginx
FROM nginx:alpine

# Copy custom nginx config with proper MIME types for modern JS
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the pre-built VitePress static files
COPY ./docs/.vitepress/dist /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Command to run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
