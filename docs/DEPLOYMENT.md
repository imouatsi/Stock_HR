# Deployment Guide

This document provides step-by-step instructions for deploying the Stock & HR Management System to different environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Deployment](#local-deployment)
- [Production Deployment](#production-deployment)
  - [Traditional Server Deployment](#traditional-server-deployment)
  - [Docker Deployment](#docker-deployment)
  - [Cloud Deployment](#cloud-deployment)
- [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
- [Database Migration](#database-migration)
- [Backup and Restore](#backup-and-restore)
- [Monitoring and Logging](#monitoring-and-logging)
- [Scaling](#scaling)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the Stock & HR Management System, ensure you have the following:

- Node.js v14.x or later
- MongoDB v4.4 or later
- Git
- npm or yarn
- Docker (for containerized deployment)
- Access to a cloud provider (for cloud deployment)

## Environment Setup

### Environment Variables

Create appropriate `.env` files for different environments:

**Frontend (.env.production)**:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
REACT_APP_SENTRY_DSN=your_sentry_dsn (optional)
```

**Backend (.env.production)**:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/stockhr
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### Security Considerations

1. Use strong, unique values for secrets and keys
2. Never commit `.env` files to version control
3. Use a secret management tool in production environments
4. Rotate secrets periodically

## Local Deployment

For testing deployment locally before moving to production:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

3. Serve the frontend using a static file server:
   ```bash
   npx serve -s frontend/build
   ```

4. Run the backend:
   ```bash
   cd backend
   NODE_ENV=production node dist/server.js
   ```

## Production Deployment

### Traditional Server Deployment

#### Backend Deployment

1. Prepare the server (Ubuntu example):
   ```bash
   # Update packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   sudo apt-get install -y mongodb
   sudo systemctl enable mongodb
   sudo systemctl start mongodb
   
   # Install PM2 process manager
   sudo npm install -g pm2
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-hr.git
   cd stock-hr
   ```

3. Install dependencies and build:
   ```bash
   cd backend
   npm install --production
   npm run build
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

5. Start the backend with PM2:
   ```bash
   pm2 start dist/server.js --name "stock-hr-api"
   pm2 save
   pm2 startup
   ```

#### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Configure web server (Nginx example):
   ```bash
   sudo apt-get install -y nginx
   ```

3. Create an Nginx configuration:
   ```
   # /etc/nginx/sites-available/stock-hr
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           root /path/to/stock-hr/frontend/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/stock-hr /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. Set up SSL using Let's Encrypt:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### Docker Deployment

1. Ensure Docker and Docker Compose are installed:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. Create a docker-compose.yml file in the project root:
   ```yaml
   version: '3'
   services:
     mongodb:
       image: mongo:4.4
       volumes:
         - mongo-data:/data/db
       networks:
         - app-network
       restart: always
   
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       depends_on:
         - mongodb
       environment:
         - MONGODB_URI=mongodb://mongodb:27017/stockhr
         - NODE_ENV=production
         - JWT_SECRET=${JWT_SECRET}
         - PORT=5000
         - CORS_ORIGIN=${CORS_ORIGIN}
       networks:
         - app-network
       restart: always
   
     frontend:
       build: ./frontend
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - backend
       networks:
         - app-network
       restart: always
   
   networks:
     app-network:
   
   volumes:
     mongo-data:
   ```

3. Create a frontend Dockerfile in the frontend directory:
   ```Dockerfile
   # frontend/Dockerfile
   FROM node:14 as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. Create a backend Dockerfile in the backend directory:
   ```Dockerfile
   # backend/Dockerfile
   FROM node:14
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["node", "dist/server.js"]
   ```

5. Create an Nginx configuration file for the frontend:
   ```
   # frontend/nginx.conf
   server {
       listen 80;
       server_name localhost;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://backend:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. Deploy with Docker Compose:
   ```bash
   # Create a .env file for Docker environment variables
   echo "JWT_SECRET=your_secure_jwt_secret" > .env
   echo "CORS_ORIGIN=https://yourdomain.com" >> .env
   
   # Build and start the containers
   docker-compose up -d
   ```

### Cloud Deployment

#### AWS Deployment

1. **Set up infrastructure**:
   - Create an EC2 instance (t3.small or larger recommended)
   - Set up a Security Group allowing ports 22, 80, 443
   - Allocate an Elastic IP and associate it with the instance
   - Point your domain to the Elastic IP using DNS A records

2. **Deploy using Docker**:
   - SSH into your EC2 instance
   - Install Docker and Docker Compose
   - Follow the Docker deployment steps above

3. **Alternative: AWS Elastic Beanstalk**:
   - Create a `Dockerrun.aws.json` file to define your containers
   - Create a new Elastic Beanstalk application
   - Deploy your application using the AWS CLI or web console

#### Heroku Deployment

1. **Backend deployment**:
   ```bash
   cd backend
   heroku create stock-hr-api
   heroku addons:create mongolab:sandbox
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set CORS_ORIGIN=https://stock-hr-frontend.herokuapp.com
   
   # Deploy
   git push heroku main
   ```

2. **Frontend deployment**:
   ```bash
   cd frontend
   heroku create stock-hr-frontend
   
   # Set environment variables
   heroku config:set REACT_APP_API_URL=https://stock-hr-api.herokuapp.com/api
   
   # Create static.json for static site hosting
   echo '{ "root": "build/", "routes": { "/**": "index.html" } }' > static.json
   
   # Deploy
   git push heroku main
   ```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Example

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy Stock & HR Management System

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          cd ../frontend
          npm ci
      - name: Run tests
        run: |
          cd backend
          npm test
          cd ../frontend
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/stock-hr
            git pull
            cd frontend
            npm install
            npm run build
            cd ../backend
            npm install
            npm run build
            pm2 restart stock-hr-api
```

## Database Migration

### Backing Up MongoDB

```bash
# Create a backup
mongodump --uri="mongodb://localhost:27017/stockhr" --out=/backup/stockhr-$(date +%Y%m%d)

# Compress the backup
tar -zcvf /backup/stockhr-$(date +%Y%m%d).tar.gz /backup/stockhr-$(date +%Y%m%d)
```

### Restoring MongoDB

```bash
# Extract backup
tar -zxvf /backup/stockhr-20230101.tar.gz -C /tmp

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/stockhr" --drop /tmp/stockhr-20230101/stockhr
```

### Automated Backups

Create a cron job for daily backups:

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2am
0 2 * * * /path/to/backup-script.sh
```

## Backup and Restore

### Creating a Backup Script

Create a file named `backup-script.sh`:

```bash
#!/bin/bash
BACKUP_DIR=/backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE=${BACKUP_DIR}/stockhr_${TIMESTAMP}

# Create MongoDB backup
mongodump --uri="mongodb://localhost:27017/stockhr" --out=${BACKUP_FILE}

# Compress backup
tar -zcvf ${BACKUP_FILE}.tar.gz ${BACKUP_FILE}
rm -rf ${BACKUP_FILE}

# Keep only the last 7 backups
find ${BACKUP_DIR} -name "stockhr_*.tar.gz" -type f -mtime +7 -delete

# Optional: Upload to S3 or other cloud storage
# aws s3 cp ${BACKUP_FILE}.tar.gz s3://your-bucket/backups/
```

Make the script executable:
```bash
chmod +x backup-script.sh
```

## Monitoring and Logging

### Setting Up Monitoring

1. **Using PM2 for basic monitoring**:
   ```bash
   pm2 monit
   pm2 plus  # For PM2 Plus monitoring service
   ```

2. **Setting up Prometheus and Grafana**:
   - Install Prometheus and Grafana
   - Configure Node.js exporter for metrics
   - Set up dashboards for server and application metrics

3. **Using cloud monitoring services**:
   - AWS CloudWatch
   - New Relic
   - Datadog

### Centralized Logging

1. **ELK Stack (Elasticsearch, Logstash, Kibana)**:
   - Install the ELK stack
   - Configure Winston logger to send logs to Logstash
   - View and analyze logs in Kibana

2. **Using Sentry for error tracking**:
   - Create a Sentry account and project
   - Add Sentry SDK to both frontend and backend

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup (Nginx)**:
   ```
   upstream backend {
       server backend1.example.com;
       server backend2.example.com;
       server backend3.example.com;
   }
   
   server {
       listen 80;
       server_name api.example.com;
       
       location / {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **MongoDB Replication**:
   - Set up a MongoDB replica set for redundancy
   - Configure your application to connect to the replica set

### Vertical Scaling

1. **Increasing Server Resources**:
   - Upgrade EC2 instance type
   - Add more RAM/CPU to your server

2. **Optimizing Application**:
   - Implement caching
   - Optimize database queries
   - Use connection pooling

## Security Best Practices

1. **Keep Dependencies Updated**:
   ```bash
   npm audit
   npm update
   ```

2. **Set Up Firewall Rules**:
   ```bash
   # Allow only necessary ports
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

3. **Secure MongoDB**:
   - Create dedicated users with appropriate permissions
   - Enable authentication
   - Limit network access

4. **Set Up HTTPS**:
   - Acquire and install SSL certificates
   - Configure HSTS headers
   - Redirect HTTP to HTTPS

5. **Implement Rate Limiting**:
   - Add rate limiting middleware to the API
   - Configure fail2ban for brute force protection

## Troubleshooting

See the [Troubleshooting Guide](TROUBLESHOOTING.md) for common deployment issues and solutions.

---

This deployment guide covers the basics of deploying the Stock & HR Management System. For complex deployments or specialized environments, additional configuration may be required. If you encounter issues, consult the documentation or seek assistance from the development team.
