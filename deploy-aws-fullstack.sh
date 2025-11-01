#!/bin/bash

# AWS Full-Stack Deployment Script for KrushiVerse
# Run this script after configuring AWS CLI

echo "🚀 Starting AWS Full-Stack Deployment for KrushiVerse"

# Variables (Update these)
BUCKET_NAME="krushiverse-frontend-$(date +%s)"  # Unique bucket name
REGION="us-east-1"
EB_APP_NAME="krushiverse-backend"
EB_ENV_NAME="krushiverse-api-prod"

echo "📦 Bucket name: $BUCKET_NAME"

# Part 1: Backend Deployment
echo "🔧 Deploying Backend to Elastic Beanstalk..."

# Initialize EB (interactive)
echo "Please run manually: eb init"
echo "Choose: Region ($REGION), New application ($EB_APP_NAME), Python 3.11"
read -p "Press Enter after completing 'eb init'..."

# Create and deploy backend
eb create $EB_ENV_NAME --region $REGION

# Set environment variables
eb setenv GOOGLE_API_KEY=$GOOGLE_API_KEY
eb setenv ENVIRONMENT=production

echo "✅ Backend deployed! Getting backend URL..."
EB_URL=$(eb status | grep CNAME | awk '{print $2}')
echo "Backend URL: https://$EB_URL"

# Part 2: Frontend Deployment
echo "🌐 Deploying Frontend to S3 + CloudFront..."

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# Update bucket policy with actual bucket name
sed "s/krushiverse-frontend-bucket/$BUCKET_NAME/g" aws-configs/s3-bucket-policy.json > temp-policy.json

# Apply bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://temp-policy.json

# Build and upload frontend
echo "Building React frontend..."
cd KrushiVerse

# Update production API URL
echo "VITE_API_URL=https://$EB_URL" > .env.production

# Build React app
npm install
npm run build

# Upload to S3
aws s3 sync dist s3://$BUCKET_NAME --delete

cd ..

# Get S3 website URL
S3_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Deployment Complete!"
echo "🔗 Backend API: https://$EB_URL"
echo "🔗 Frontend: $S3_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend API base URL to: https://$EB_URL"
echo "2. Rebuild and redeploy frontend"
echo "3. (Optional) Set up CloudFront for HTTPS and better performance"

# Cleanup
rm -f temp-policy.json