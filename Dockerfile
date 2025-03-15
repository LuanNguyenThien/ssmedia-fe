FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables to ignore ESLint
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

# Build app
RUN npm run build

# Install serve to run production build
RUN npm install -g serve

EXPOSE 3000

# Run production build with serve
CMD ["serve", "-s", "build", "-l", "3000"]