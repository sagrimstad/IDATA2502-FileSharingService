FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]