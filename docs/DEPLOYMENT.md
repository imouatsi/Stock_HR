# Deployment Guide

## Production Setup

### Server Requirements
- Ubuntu 20.04 LTS or higher
- 4GB RAM minimum
- 2 CPU cores minimum
- 20GB SSD storage

### Security Configuration
```bash
# Update firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 27017/tcp  # MongoDB (internal only)
ufw allow 6379/tcp   # Redis (internal only)
```

### SSL Configuration
```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot --nginx -d yourdomain.com
```

### Docker Deployment
```dockerfile
# Build stage
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
EXPOSE 5000
CMD ["npm", "start"]
```
