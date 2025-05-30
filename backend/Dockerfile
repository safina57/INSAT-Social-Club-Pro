FROM node:18-alpine

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client after copying code and installing all dependencies
RUN npx prisma generate

EXPOSE 3000

# Start in dev mode
CMD ["npm", "run", "start:dev"]
