# Use official Node.js image as base
FROM node:23

# Set working directory
WORKDIR /frontend

# Copy the package.json and install dependencies
COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the React app for production
RUN npm run build

# Expose port for React app
EXPOSE 3000

# Command to run React app in production (use serve to serve static files)
CMD ["npx", "serve", "build"]
