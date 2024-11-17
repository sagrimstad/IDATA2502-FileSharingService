# Stage 1: Build the React app
FROM node:22

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@latest

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
