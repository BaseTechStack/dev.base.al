# Simple static file server based on nginx
FROM nginx:alpine

# Copy custom nginx config (for SPA routing)
RUN echo 'server {\
  listen 80;\
  server_name _;\
  root /usr/share/nginx/html;\
  index index.html;\
  location / {\
    try_files $uri $uri/ /index.html;\
  }\
}' > /etc/nginx/conf.d/default.conf

# Copy the pre-built VitePress static files
COPY ./docs/.vitepress/dist /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Command to run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
