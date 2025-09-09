# 🚀 Deployment Guide

## Overview
This guide covers multiple deployment options for the Personal Finance Tracker, from simple static hosting to advanced CI/CD pipelines.

## Quick Deployment Options

### 1. Vercel (Recommended)
Vercel provides the best experience for React applications with automatic deployments.

#### Setup Steps:
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Configuration**
   Create `vercel.json` in project root:
   ```json
   {
     "name": "personal-finance-tracker",
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_APP_NAME=Personal Finance Tracker
   VITE_APP_VERSION=1.0.0
   ```

#### Automatic Deployments:
- Connect GitHub repository
- Enable automatic deployments on push
- Preview deployments for pull requests

### 2. Netlify
Great alternative with form handling and edge functions.

#### Setup Steps:
1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Netlify Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [build.environment]
     NODE_VERSION = "18"
   ```

3. **Deploy via CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login and deploy
   netlify login
   netlify deploy --prod --dir=dist
   ```

### 3. GitHub Pages
Free hosting for public repositories.

#### Setup Steps:
1. **GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout
         uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build
         run: npm run build
       
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

2. **Vite Configuration**
   Update `vite.config.ts` for GitHub Pages:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/finance-tracker/', // Replace with your repo name
     build: {
       outDir: 'dist',
     },
   });
   ```

### 4. Firebase Hosting
Google's hosting platform with CDN and SSL.

#### Setup Steps:
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

3. **Firebase Configuration**
   `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Advanced Deployment

### Docker Deployment

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Docker Commands
```bash
# Build image
docker build -t finance-tracker .

# Run container
docker run -p 3000:80 finance-tracker

# Docker Compose
docker-compose up -d
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  finance-tracker:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
```

### AWS S3 + CloudFront

#### S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://finance-tracker-app

# Enable static website hosting
aws s3 website s3://finance-tracker-app \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync dist/ s3://finance-tracker-app --delete
```

#### CloudFront Distribution
```json
{
  "CallerReference": "finance-tracker-2024",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-finance-tracker-app",
        "DomainName": "finance-tracker-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-finance-tracker-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  }
}
```

## CI/CD Pipeline

### GitHub Actions (Complete)
`.github/workflows/ci-cd.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to staging
      run: |
        # Deploy to staging environment
        echo "Deploying to staging..."

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI/CD
`.gitlab-ci.yml`:
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run test
  artifacts:
    reports:
      coverage: coverage/
    expire_in: 1 week

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

deploy_staging:
  stage: deploy
  script:
    - echo "Deploy to staging"
    # Add staging deployment commands
  environment:
    name: staging
    url: https://staging.finance-tracker.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - echo "Deploy to production"
    # Add production deployment commands
  environment:
    name: production
    url: https://finance-tracker.com
  only:
    - main
  when: manual
```

## Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion'],
          utils: ['date-fns', 'clsx'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### CDN Configuration
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
```

### Service Worker (PWA)
```javascript
// sw.js
const CACHE_NAME = 'finance-tracker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

## Monitoring & Analytics

### Error Tracking (Sentry)
```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});

// Wrap App component
const SentryApp = Sentry.withErrorBoundary(App, {
  fallback: ({ error }) => <ErrorFallback error={error} />,
});
```

### Analytics (Google Analytics)
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
```typescript
// Performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
    }
  }
});

observer.observe({ entryTypes: ['navigation'] });
```

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
">
```

### Environment Variables
```bash
# Production environment variables
VITE_APP_NAME=Personal Finance Tracker
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.finance-tracker.com
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_MEASUREMENT_ID=your-ga-id
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+

# Verify build locally
npm run build
npm run preview
```

#### Deployment Issues
```bash
# Check build output
ls -la dist/

# Verify routing configuration
# Ensure SPA routing is configured for your platform

# Check environment variables
echo $VITE_APP_NAME
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Check for unused dependencies
npx depcheck

# Optimize images
npx imagemin-cli src/assets/* --out-dir=dist/assets
```

This deployment guide covers all major hosting platforms and deployment strategies for the Personal Finance Tracker application.