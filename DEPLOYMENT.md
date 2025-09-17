# Web3Store Deployment Guide

This guide covers deploying Web3Store to production environments using Encore Cloud and other deployment options.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Encore Cloud Deployment](#encore-cloud-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [File Storage Configuration](#file-storage-configuration)
7. [Domain and SSL](#domain-and-ssl)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Performance Optimization](#performance-optimization)
11. [Security Considerations](#security-considerations)
12. [Troubleshooting](#troubleshooting)

## Overview

Web3Store is designed to be deployed on Encore Cloud, which provides:
- **Automatic Scaling**: Scales based on demand
- **Built-in Monitoring**: Comprehensive observability
- **Database Management**: Managed PostgreSQL
- **CDN Integration**: Global content delivery
- **Security**: Built-in security features

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (React)       │───▶│   (Encore)      │───▶│   Services      │
│                 │    │                 │    │   (Encore.ts)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      CDN        │    │   Load Balancer │    │   PostgreSQL    │
│   (CloudFlare)  │    │   (Encore)      │    │   (Managed)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Required Tools
- **Encore CLI**: Latest version
- **Node.js**: Version 18 or higher
- **Git**: For version control
- **Docker**: For local development (optional)

### Accounts and Services
- **Encore Cloud Account**: For deployment
- **Domain Name**: For custom domain (optional)
- **CloudFlare Account**: For CDN (optional)
- **Email Service**: For notifications (optional)

### Installation
```bash
# Install Encore CLI
curl -L https://encore.dev/install.sh | bash

# Verify installation
encore version

# Login to Encore
encore auth login
```

## Encore Cloud Deployment

### Initial Setup

1. **Create Encore App**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/web3store.git
   cd web3store
   
   # Create Encore app
   encore app create web3store
   ```

2. **Configure App Settings**
   ```bash
   # Set app configuration
   encore app configure
   ```

3. **Deploy to Staging**
   ```bash
   # Deploy to staging environment
   encore deploy --env staging
   ```

4. **Deploy to Production**
   ```bash
   # Deploy to production environment
   encore deploy --env production
   ```

### Deployment Configuration

#### encore.app
```json
{
  "id": "web3store",
  "name": "Web3Store",
  "environments": {
    "staging": {
      "name": "Staging",
      "type": "development"
    },
    "production": {
      "name": "Production",
      "type": "production"
    }
  }
}
```

#### Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deploying Web3Store..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Run tests
echo "🧪 Running tests..."
npm test

# Deploy to Encore Cloud
echo "☁️ Deploying to Encore Cloud..."
encore deploy --env production

echo "✅ Deployment complete!"
```

### Environment-Specific Configuration

#### Staging Environment
```bash
# Set staging environment variables
encore env set --env staging DATABASE_URL="postgresql://..."
encore env set --env staging JWT_SECRET="staging-secret"
encore env set --env staging FRONTEND_URL="https://staging.web3store.com"
```

#### Production Environment
```bash
# Set production environment variables
encore env set --env production DATABASE_URL="postgresql://..."
encore env set --env production JWT_SECRET="production-secret"
encore env set --env production FRONTEND_URL="https://web3store.com"
```

## Environment Configuration

### Environment Variables

#### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30d

# Frontend
FRONTEND_URL=https://web3store.com

# File Storage
S3_BUCKET=web3store-assets
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# External Services
CLERK_SECRET_KEY=your-clerk-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Optional Variables
```bash
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key
```

### Configuration Management

#### Using Encore Secrets
```bash
# Set secrets
encore secret set --env production JWT_SECRET
encore secret set --env production DATABASE_URL
encore secret set --env production S3_SECRET_KEY

# List secrets
encore secret list --env production

# Update secrets
encore secret set --env production JWT_SECRET --update
```

#### Configuration Validation
```typescript
// config/validation.ts
import { z } from 'zod';

const configSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url(),
  S3_BUCKET: z.string(),
  S3_REGION: z.string(),
});

export function validateConfig() {
  try {
    configSchema.parse(process.env);
    console.log('✅ Configuration valid');
  } catch (error) {
    console.error('❌ Configuration invalid:', error);
    process.exit(1);
  }
}
```

## Database Setup

### PostgreSQL Configuration

#### Database Schema
```sql
-- Create databases
CREATE DATABASE web3store_production;
CREATE DATABASE web3store_staging;

-- Create users
CREATE USER web3store_prod WITH PASSWORD 'secure_password';
CREATE USER web3store_staging WITH PASSWORD 'staging_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE web3store_production TO web3store_prod;
GRANT ALL PRIVILEGES ON DATABASE web3store_staging TO web3store_staging;
```

#### Connection Configuration
```bash
# Production
DATABASE_URL="postgresql://web3store_prod:secure_password@db.example.com:5432/web3store_production?sslmode=require"

# Staging
DATABASE_URL="postgresql://web3store_staging:staging_password@db.example.com:5432/web3store_staging?sslmode=require"
```

### Database Migrations

#### Migration Strategy
```bash
# Run migrations on deployment
encore migrate --env production

# Check migration status
encore migrate status --env production

# Rollback if needed
encore migrate rollback --env production --steps 1
```

#### Migration Scripts
```sql
-- migrations/001_initial_schema.up.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_apps_search ON apps USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX CONCURRENTLY idx_apps_category_published ON apps(category_id, published) WHERE published = true;
```

### Database Optimization

#### Performance Tuning
```sql
-- PostgreSQL configuration
shared_preload_libraries = 'pg_stat_statements'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

#### Monitoring Queries
```sql
-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## File Storage Configuration

### S3-Compatible Storage

#### Bucket Configuration
```bash
# Create buckets
aws s3 mb s3://web3store-assets-prod
aws s3 mb s3://web3store-assets-staging

# Set bucket policy
aws s3api put-bucket-policy --bucket web3store-assets-prod --policy file://bucket-policy.json
```

#### Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::web3store-assets-prod/*"
    }
  ]
}
```

#### CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://web3store.com", "https://staging.web3store.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### CDN Configuration

#### CloudFlare Setup
```bash
# Configure CloudFlare for assets
# 1. Add CNAME record: assets.web3store.com -> web3store-assets-prod.s3.amazonaws.com
# 2. Enable caching rules
# 3. Set cache TTL to 1 year for static assets
```

#### Cache Rules
```javascript
// CloudFlare Worker for cache optimization
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Cache static assets for 1 year
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js|woff|woff2)$/)) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000');
    return newResponse;
  }
  
  return fetch(request);
}
```

## Domain and SSL

### Domain Configuration

#### DNS Setup
```bash
# A records
web3store.com.          A    1.2.3.4
www.web3store.com.      A    1.2.3.4
api.web3store.com.      A    1.2.3.4

# CNAME records
staging.web3store.com.  CNAME  staging-web3store.encore.app.
assets.web3store.com.   CNAME  web3store-assets.s3.amazonaws.com.
```

#### SSL Certificate
```bash
# Encore automatically provides SSL certificates
# Custom domains are configured through Encore dashboard

# Verify SSL
curl -I https://web3store.com
```

### Custom Domain Setup

#### Encore Configuration
```bash
# Add custom domain
encore domain add web3store.com --env production
encore domain add staging.web3store.com --env staging

# Verify domain
encore domain verify web3store.com
```

#### Domain Validation
```bash
# Check domain status
encore domain list

# Test domain resolution
nslookup web3store.com
dig web3store.com
```

## Monitoring and Logging

### Built-in Monitoring

#### Encore Dashboard
- **Request Metrics**: Response times, error rates
- **Database Metrics**: Query performance, connection pool
- **System Metrics**: CPU, memory, disk usage
- **Custom Metrics**: Business-specific metrics

#### Custom Metrics
```typescript
// metrics/custom.ts
import { metric } from 'encore.dev/metrics';

export const appDownloads = metric.counter('app_downloads', {
  description: 'Number of app downloads',
  labels: ['app_id', 'category'],
});

export const userSignups = metric.counter('user_signups', {
  description: 'Number of user signups',
  labels: ['source'],
});

// Usage
appDownloads.inc({ app_id: '123', category: 'defi' });
userSignups.inc({ source: 'organic' });
```

### External Monitoring

#### Sentry Integration
```typescript
// monitoring/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export { Sentry };
```

#### Health Checks
```typescript
// health/check.ts
import { api } from 'encore.dev/api';

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  services: {
    database: 'up' | 'down';
    storage: 'up' | 'down';
  };
}

export const healthCheck = api<void, HealthResponse>(
  { expose: true, method: 'GET', path: '/health' },
  async () => {
    // Check database
    const dbStatus = await checkDatabase();
    
    // Check storage
    const storageStatus = await checkStorage();
    
    const allHealthy = dbStatus === 'up' && storageStatus === 'up';
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      services: {
        database: dbStatus,
        storage: storageStatus,
      },
    };
  }
);
```

### Log Management

#### Structured Logging
```typescript
// logging/logger.ts
import log from 'encore.dev/log';

export const logger = {
  info: (message: string, data?: any) => {
    log.info(message, data);
  },
  
  error: (message: string, error?: Error, data?: any) => {
    log.error(message, { error: error?.message, stack: error?.stack, ...data });
  },
  
  warn: (message: string, data?: any) => {
    log.warn(message, data);
  },
};

// Usage
logger.info('User signed up', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', error, { query: 'SELECT * FROM users' });
```

#### Log Aggregation
```bash
# Configure log forwarding to external services
# Encore automatically forwards logs to configured destinations

# Example: Forward to DataDog
encore env set --env production DATADOG_API_KEY="your-api-key"
encore env set --env production LOG_DESTINATION="datadog"
```

## Backup and Recovery

### Database Backups

#### Automated Backups
```bash
# Encore provides automated database backups
# Configure backup retention and frequency

encore backup configure --env production --retention 30d --frequency daily
```

#### Manual Backups
```bash
# Create manual backup
encore backup create --env production --name "pre-deployment-backup"

# List backups
encore backup list --env production

# Restore from backup
encore backup restore --env production --backup-id "backup-123"
```

#### Backup Verification
```bash
#!/bin/bash
# scripts/verify-backup.sh

BACKUP_ID=$1
TEST_DB="web3store_backup_test"

# Restore backup to test database
encore backup restore --backup-id $BACKUP_ID --target $TEST_DB

# Run verification queries
psql $TEST_DB -c "SELECT COUNT(*) FROM users;"
psql $TEST_DB -c "SELECT COUNT(*) FROM apps;"

# Cleanup
dropdb $TEST_DB

echo "Backup verification complete"
```

### Disaster Recovery

#### Recovery Plan
1. **Assess Impact**: Determine scope of outage
2. **Communicate**: Notify stakeholders
3. **Restore Service**: Use latest backup
4. **Verify Integrity**: Check data consistency
5. **Monitor**: Watch for issues
6. **Post-Mortem**: Document lessons learned

#### Recovery Scripts
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

echo "🚨 Starting disaster recovery..."

# 1. Stop traffic to affected services
encore service stop --env production

# 2. Restore from latest backup
LATEST_BACKUP=$(encore backup list --env production --format json | jq -r '.[0].id')
encore backup restore --env production --backup-id $LATEST_BACKUP

# 3. Run database migrations
encore migrate --env production

# 4. Verify service health
encore health check --env production

# 5. Restart services
encore service start --env production

echo "✅ Disaster recovery complete"
```

## Performance Optimization

### Application Performance

#### Caching Strategy
```typescript
// cache/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },
  
  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};

// Usage in API endpoints
export const getApp = api<GetAppParams, App>(
  { expose: true, method: 'GET', path: '/apps/:slug' },
  async ({ slug }) => {
    // Try cache first
    const cached = await cache.get<App>(`app:${slug}`);
    if (cached) return cached;
    
    // Fetch from database
    const app = await fetchAppFromDB(slug);
    
    // Cache for 1 hour
    await cache.set(`app:${slug}`, app, 3600);
    
    return app;
  }
);
```

#### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_apps_category_featured 
ON apps(category_id, featured) 
WHERE published = true;

CREATE INDEX CONCURRENTLY idx_apps_downloads_desc 
ON apps(downloads_count DESC) 
WHERE published = true;

CREATE INDEX CONCURRENTLY idx_reviews_app_created 
ON app_reviews(app_id, created_at DESC);

-- Optimize full-text search
CREATE INDEX CONCURRENTLY idx_apps_search_gin 
ON apps USING gin(to_tsvector('english', name || ' ' || description));
```

### Frontend Optimization

#### Build Optimization
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

#### CDN Configuration
```bash
# Configure CloudFlare for optimal performance
# 1. Enable Brotli compression
# 2. Set up page rules for caching
# 3. Enable HTTP/2 and HTTP/3
# 4. Configure image optimization
```

### Monitoring Performance

#### Performance Metrics
```typescript
// monitoring/performance.ts
import { metric } from 'encore.dev/metrics';

export const apiResponseTime = metric.histogram('api_response_time', {
  description: 'API response time in milliseconds',
  labels: ['endpoint', 'method'],
});

export const databaseQueryTime = metric.histogram('db_query_time', {
  description: 'Database query time in milliseconds',
  labels: ['table', 'operation'],
});

// Middleware to track performance
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    apiResponseTime.observe(
      { endpoint: req.path, method: req.method },
      duration
    );
  });
  
  next();
}
```

## Security Considerations

### Application Security

#### Security Headers
```typescript
// middleware/security.ts
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
}
```

#### Input Validation
```typescript
// validation/schemas.ts
import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(5000),
  category_id: z.number().positive(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  package_name: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/),
});

// Usage in API endpoints
export const createApp = api<CreateAppRequest, CreateAppResponse>(
  { expose: true, method: 'POST', path: '/apps' },
  async (req) => {
    // Validate input
    const validatedData = createAppSchema.parse(req);
    
    // Process request
    return await processCreateApp(validatedData);
  }
);
```

### Infrastructure Security

#### Network Security
```bash
# Configure firewall rules
# Allow only necessary ports: 80, 443, 22 (SSH)

# Database security
# - Use SSL connections
# - Restrict access to application servers only
# - Regular security updates

# API security
# - Rate limiting
# - Authentication required for sensitive endpoints
# - Input validation and sanitization
```

#### Secrets Management
```bash
# Use Encore secrets for sensitive data
encore secret set --env production DATABASE_PASSWORD
encore secret set --env production JWT_SECRET
encore secret set --env production API_KEYS

# Rotate secrets regularly
encore secret rotate --env production JWT_SECRET
```

### Security Monitoring

#### Security Alerts
```typescript
// security/monitoring.ts
import { logger } from '../logging/logger';

export function logSecurityEvent(event: string, details: any) {
  logger.warn(`Security event: ${event}`, {
    ...details,
    timestamp: new Date().toISOString(),
    severity: 'high',
  });
  
  // Send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToSecurityService(event, details);
  }
}

// Usage
logSecurityEvent('failed_login_attempt', {
  email: 'user@example.com',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});
```

## Troubleshooting

### Common Issues

#### Deployment Failures
```bash
# Check deployment logs
encore logs --env production --service api

# Check service status
encore status --env production

# Rollback if needed
encore deploy rollback --env production
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
encore logs --env production --service api | grep "database"

# Monitor active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Performance Issues
```bash
# Check system metrics
encore metrics --env production

# Analyze slow queries
psql $DATABASE_URL -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Check memory usage
encore logs --env production | grep "memory"
```

### Debug Tools

#### Local Development
```bash
# Run with debug logging
DEBUG=* encore run

# Test API endpoints
curl -X GET http://localhost:4000/apps

# Check database locally
psql postgresql://localhost:5432/web3store_dev
```

#### Production Debugging
```bash
# Access production logs
encore logs --env production --tail

# Run health checks
curl https://api.web3store.com/health

# Check specific service
encore service logs --env production --service apps
```

### Support and Escalation

#### Internal Support
1. **Check Documentation**: Review this guide and API docs
2. **Search Logs**: Look for error patterns
3. **Check Monitoring**: Review metrics and alerts
4. **Test Locally**: Reproduce issues in development

#### External Support
1. **Encore Support**: For platform-specific issues
2. **Database Support**: For PostgreSQL issues
3. **CDN Support**: For CloudFlare issues
4. **Security Team**: For security incidents

#### Escalation Process
1. **Severity Assessment**: Determine impact level
2. **Initial Response**: Immediate mitigation steps
3. **Investigation**: Root cause analysis
4. **Resolution**: Implement fix
5. **Post-Mortem**: Document lessons learned

---

For additional support, contact our DevOps team at [devops@web3store.com](mailto:devops@web3store.com) or refer to the [Encore documentation](https://encore.dev/docs).
