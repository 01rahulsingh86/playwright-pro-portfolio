# Dockerfile
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci

# Bring in the rest (tests, config, snapshots)
COPY . .

# Default: run the suite (list reporter is CI-friendly)
CMD ["npx", "playwright", "test", "--reporter=list"]
