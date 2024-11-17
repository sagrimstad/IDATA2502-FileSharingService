FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g npm@latest

# Copy source code
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]