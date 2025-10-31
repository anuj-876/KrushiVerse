# AWS Free Tier Monitoring for KrushiVerse
# PowerShell script to check your AWS usage

Write-Host "🔍 AWS Free Tier Usage Monitor for KrushiVerse" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not installed. Please install from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Check EC2 instances
Write-Host "`n📊 EC2 Instances:" -ForegroundColor Yellow
try {
    $instances = aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,LaunchTime]' --output table
    Write-Host $instances
} catch {
    Write-Host "❌ Error checking EC2 instances" -ForegroundColor Red
}

# Check S3 buckets
Write-Host "`n📊 S3 Buckets:" -ForegroundColor Yellow
try {
    $buckets = aws s3 ls
    Write-Host $buckets
} catch {
    Write-Host "❌ Error checking S3 buckets" -ForegroundColor Red
}

# Estimated costs
Write-Host "`n💰 Free Tier Limits:" -ForegroundColor Cyan
Write-Host "• EC2 t2.micro: 750 hours/month (31 days = 744 hours)" -ForegroundColor White
Write-Host "• S3: 5GB storage + 20,000 requests" -ForegroundColor White
Write-Host "• Data Transfer: 1GB/month" -ForegroundColor White
Write-Host "• CloudFront: 50GB/month" -ForegroundColor White

Write-Host "`n📝 Monitoring Tips:" -ForegroundColor Cyan
Write-Host "• Check AWS Billing Dashboard regularly" -ForegroundColor White
Write-Host "• Set up billing alerts at $1, $5, $10" -ForegroundColor White
Write-Host "• Stop EC2 when not needed to save hours" -ForegroundColor White
Write-Host "• Monitor S3 storage usage" -ForegroundColor White

Write-Host "`n🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "• Billing Dashboard: https://console.aws.amazon.com/billing/" -ForegroundColor White
Write-Host "• Free Tier Usage: https://console.aws.amazon.com/billing/home#/freetier" -ForegroundColor White
Write-Host "• Cost Explorer: https://console.aws.amazon.com/cost-management/home" -ForegroundColor White