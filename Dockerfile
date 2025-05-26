# Build stage
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies and build the Angular app
RUN npm install
RUN npm run build --prod

# Serve stage
FROM nginx:1.25-alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from build stage
COPY --from=build /app/dist/Modernize /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
