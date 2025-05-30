# Use Alpine variant with Node.js
FROM node:18-alpine

# Install system dependencies (openssl for Prisma, python3/g++/make for bcrypt and Nest CLI)
RUN apk add --no-cache openssl \
    && apk add --no-cache python3 g++ make

# Set working directory
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies and Nest CLI globally in a single layer
RUN npm install && npm install -g @nestjs/cli

# Copy the rest of your application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose application port
EXPOSE 3000

# Start application in development mode
CMD ["npm", "run", "start:dev"]
