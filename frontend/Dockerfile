# Stage 1: Build the React app
FROM node:22 AS build
WORKDIR /app
COPY package.json ./
RUN npm install -g npm@latest
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires the container to listen on port 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
