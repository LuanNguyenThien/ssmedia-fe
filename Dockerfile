# Use Node.js as the base image
# FROM node:18-alpine
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Clear npm cache and remove lock file
# RUN rm -rf package-lock.json node_modules
RUN rm -rf node_modules

# Install dependencies with legacy peer deps flag
RUN npm cache clean --force && \
    npm ci --legacy-peer-deps && \
    npm install @rollup/rollup-linux-x64-gnu --save-optional --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Set environment variables to ignore ESLint
# ENV CI=false
# ENV DISABLE_ESLINT_PLUGIN=true

# Build the app
RUN npm run build

# Install serve to run production build
RUN npm install -g serve

# Expose the port (optional)
EXPOSE 3000

# Serve from dist folder (Vite default)
CMD ["serve", "-s", "dist", "-l", "3000"]