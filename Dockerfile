# Use official Node image
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variables (optional, for production)
ENV NODE_ENV=production

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
