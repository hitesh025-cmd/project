FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the backend server
CMD ["node", "backend/index.js"]
