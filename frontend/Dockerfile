FROM node:20-alpine as build

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the frontend using the root script
RUN npm run build

# Use nginx to serve the frontend
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
