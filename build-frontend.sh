#!/bin/bash
# Frontend Build and Deploy Script for AWS S3
# Run this script on your local machine

set -e

echo "🏗️ Building KrushiVerse Frontend for AWS..."

# Navigate to frontend directory
cd KrushiVerse

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create production environment file
echo "🔧 Configuring production environment..."
echo "Enter your EC2 public IP address:"
read EC2_IP

cat > .env.production << EOF
VITE_API_URL=http://$EC2_IP:8002
EOF

# Build for production
echo "🔨 Building frontend..."
npm run build

echo "✅ Frontend build complete!"
echo "📁 Built files are in: ./dist/"
echo ""
echo "To deploy to S3:"
echo "1. Install AWS CLI: https://aws.amazon.com/cli/"
echo "2. Configure AWS CLI: aws configure"
echo "3. Create S3 bucket: aws s3 mb s3://your-unique-bucket-name"
echo "4. Upload files: aws s3 sync ./dist s3://your-bucket-name --acl public-read"
echo "5. Enable static website hosting on the bucket"
echo ""
echo "Example S3 sync command:"
echo "aws s3 sync ./dist s3://krushiverse-frontend-\$(date +%s) --acl public-read"