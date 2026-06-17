# Dockerfile for backend with Puppeteer support
# Based on official Node 18 slim image with required system dependencies for Chromium

FROM node:18-slim

# Install necessary system dependencies for Chromium/Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    wget \
    gnupg \
    dirmngr \
    gnupg2 \
    apt-transport-https \
    lsb-release \
    xdg-utils \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (this will also download Chromium for puppeteer)
RUN npm ci --only=production

# Copy application source
COPY . .

# Build TypeScript if present
RUN npm run build || true

EXPOSE 3001

CMD ["npm", "start"]
