## layer - 4 
# FROM nginx:alpine

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

## Web-server
# Use the official lightweight Nginx image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy your website's static files to the Nginx root directory
COPY ./html /usr/share/nginx/html

# Expose port 80 to allow external access
EXPOSE 80

# Start Nginx in the foreground so the container stays running
CMD ["nginx", "-g", "daemon off;"]
