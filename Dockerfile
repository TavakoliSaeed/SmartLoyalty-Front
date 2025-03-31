# Stage 1: Build the Next.js app
FROM node:22.12.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy build output and required files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Set production environment
ENV NODE_ENV=production

# Expose the default Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
