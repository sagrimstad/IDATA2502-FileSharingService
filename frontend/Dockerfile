# Stage 1: Build the React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Set environment variables
ENV PORT 8080

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration template to the templates directory
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose the port
EXPOSE 8080

# Start Nginx with the provided configuration
CMD ["nginx", "-g", "daemon off;"]