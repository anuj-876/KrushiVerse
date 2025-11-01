# AWS Full-Stack Deployment Guide for KrushiVerse

## Architecture Overview:
- **Backend**: AWS Elastic Beanstalk (FastAPI)
- **Frontend**: AWS S3 + CloudFront (React)
- **Domain**: Route 53 (optional)
- **SSL**: AWS Certificate Manager (free)

## Part 1: Backend Deployment (AWS Elastic Beanstalk)

### Step 1: Install Required Tools
```powershell
# Already installed:
# - AWS CLI ✅
# - EB CLI ✅
```

### Step 2: Configure AWS Credentials
```bash
# Configure AWS (need Access Key & Secret Key from AWS Console)
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)
```

### Step 3: Backend Deployment
```bash
# Navigate to backend directory
cd agriculture_chatbot

# Initialize EB application
eb init
# Choose: Region (us-east-1), New application (krushiverse-backend), Python 3.11

# Create environment and deploy
eb create krushiverse-api-prod
# This creates: EC2 instance, Load balancer, Auto-scaling group

# Set environment variables
eb setenv GOOGLE_API_KEY=your_google_api_key_here
eb setenv ENVIRONMENT=production
eb setenv CORS_ORIGINS=https://your-frontend-domain.com

# Deploy
eb deploy
```

## Part 2: Frontend Deployment (AWS S3 + CloudFront)

### Step 1: Build React App for Production
```bash
# Navigate to frontend directory
cd agriculture_chatbot/frontend  # or wherever your React app is

# Update API base URL to EB endpoint
# Edit src/config.js or wherever API URL is defined
# Set API_BASE_URL = "https://krushiverse-api-prod.us-east-1.elasticbeanstalk.com"

# Build production version
npm run build
# This creates 'build' folder with optimized static files
```

### Step 2: Create S3 Bucket for Frontend
```bash
# Create S3 bucket (name must be globally unique)
aws s3 mb s3://krushiverse-frontend-bucket-unique-name

# Enable static website hosting
aws s3 website s3://krushiverse-frontend-bucket-unique-name \
  --index-document index.html \
  --error-document error.html

# Upload build files
aws s3 sync ./build s3://krushiverse-frontend-bucket-unique-name --delete

# Make files publicly readable
aws s3api put-bucket-policy --bucket krushiverse-frontend-bucket-unique-name --policy file://s3-bucket-policy.json
```

### Step 3: Create CloudFront Distribution (CDN)
```bash
# Create CloudFront distribution for global CDN
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## Part 3: Configuration Files

### S3 Bucket Policy (s3-bucket-policy.json):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::krushiverse-frontend-bucket-unique-name/*"
    }
  ]
}
```

### CloudFront Configuration (cloudfront-config.json):
```json
{
  "CallerReference": "krushiverse-frontend-2025",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-krushiverse-frontend",
        "DomainName": "krushiverse-frontend-bucket-unique-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-krushiverse-frontend",
    "ViewerProtocolPolicy": "redirect-to-https"
  }
}
```

## Part 4: Cost Estimation (Monthly)

### Backend (Elastic Beanstalk):
- t3.micro EC2: ~$8-10
- Application Load Balancer: ~$16
- **Total Backend**: ~$25/month

### Frontend (S3 + CloudFront):
- S3 Storage (1GB): ~$0.02
- S3 Requests: ~$0.50
- CloudFront: ~$1-5 (based on traffic)
- **Total Frontend**: ~$2-6/month

### **Total Cost**: ~$30-35/month

## Part 5: Deployment Benefits

### ✅ **Scalability**:
- Auto-scaling based on traffic
- Global CDN for fast loading

### ✅ **Reliability**:
- 99.99% uptime SLA
- Multiple availability zones

### ✅ **Security**:
- Free SSL certificates
- AWS WAF protection available

### ✅ **Performance**:
- CloudFront CDN worldwide
- Auto-scaling backend

## Part 6: Domain Setup (Optional)

### Custom Domain with Route 53:
```bash
# Buy domain through Route 53 (~$12/year for .com)
# Create hosted zone
# Point domain to CloudFront distribution
```

## Part 7: Continuous Deployment (Optional)

### AWS CodePipeline Setup:
- Auto-deploy from GitHub commits
- Separate pipelines for frontend/backend
- Zero-downtime deployments