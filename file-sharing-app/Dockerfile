# Step 1: Build the React app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build
COPY . .
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built React files to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 for the server
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]