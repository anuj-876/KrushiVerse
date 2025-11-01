# PowerShell script for AWS Full-Stack Deployment on Windows

Write-Host "🚀 Starting AWS Full-Stack Deployment for KrushiVerse" -ForegroundColor Green

# Variables (Update these)
$BUCKET_NAME = "krushiverse-frontend-$(Get-Date -Format 'yyyyMMddHHmmss')"
$REGION = "us-east-1"
$EB_APP_NAME = "krushiverse-backend"
$EB_ENV_NAME = "krushiverse-api-prod"

Write-Host "📦 Bucket name: $BUCKET_NAME" -ForegroundColor Cyan

# Part 1: Backend Deployment
Write-Host "🔧 Deploying Backend to Elastic Beanstalk..." -ForegroundColor Yellow

Write-Host "Please run the following commands manually:" -ForegroundColor Magenta
Write-Host "1. eb init" -ForegroundColor White
Write-Host "   Choose: Region ($REGION), New application ($EB_APP_NAME), Python 3.11" -ForegroundColor Gray
Write-Host "2. eb create $EB_ENV_NAME" -ForegroundColor White
Write-Host "3. eb setenv GOOGLE_API_KEY=your_google_api_key" -ForegroundColor White
Write-Host "4. eb deploy" -ForegroundColor White

Read-Host "Press Enter after completing backend deployment..."

# Get backend URL
Write-Host "Getting backend URL..." -ForegroundColor Yellow
$EB_OUTPUT = eb status
$EB_URL = ($EB_OUTPUT | Select-String "CNAME:" | ForEach-Object { $_.ToString().Split()[1] })
Write-Host "✅ Backend URL: https://$EB_URL" -ForegroundColor Green

# Part 2: Frontend Deployment
Write-Host "🌐 Deploying Frontend to S3..." -ForegroundColor Yellow

# Create S3 bucket
aws s3 mb "s3://$BUCKET_NAME" --region $REGION

# Enable static website hosting
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

# Update bucket policy
$policyContent = Get-Content "aws-configs/s3-bucket-policy.json" | ForEach-Object { $_ -replace "krushiverse-frontend-bucket", $BUCKET_NAME }
$policyContent | Out-File "temp-policy.json" -Encoding UTF8

# Apply bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "file://temp-policy.json"

# Build and upload frontend
Write-Host "Building React frontend..." -ForegroundColor Cyan
Set-Location "KrushiVerse"

# Update production API URL
"VITE_API_URL=https://$EB_URL" | Out-File ".env.production" -Encoding UTF8

# Build React app
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Building React app for production..." -ForegroundColor Yellow
npm run build

# Upload to S3
Write-Host "Uploading frontend files to S3..." -ForegroundColor Cyan
aws s3 sync "dist" "s3://$BUCKET_NAME" --delete

Set-Location ".."

# Get S3 website URL
$S3_URL = "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🔗 Backend API: https://$EB_URL" -ForegroundColor Cyan
Write-Host "🔗 Frontend: $S3_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Update frontend API base URL to: https://$EB_URL" -ForegroundColor White
Write-Host "2. Rebuild and redeploy frontend with updated API URL" -ForegroundColor White
Write-Host "3. (Optional) Set up CloudFront for HTTPS and CDN" -ForegroundColor White

# Cleanup
Remove-Item "temp-policy.json" -ErrorAction SilentlyContinue