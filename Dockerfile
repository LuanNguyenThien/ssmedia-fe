# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Install serve to run production build
RUN npm install -g serve

# Expose the port (optional)
EXPOSE 3000

# Run production build with serve
CMD ["serve", "-s", "build", "-l", "3000"]