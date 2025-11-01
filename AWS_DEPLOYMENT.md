# AWS Elastic Beanstalk Deployment Guide for KrushiVerse Backend

## Prerequisites:
1. AWS Account (Free tier available for 12 months)
2. AWS CLI installed on local machine
3. EB CLI (Elastic Beanstalk CLI) installed

## Step 1: Install AWS CLI & EB CLI

### Windows (PowerShell):
```powershell
# Install AWS CLI
winget install Amazon.AWSCLI

# Install EB CLI using pip
pip install awsebcli
```

## Step 2: Configure AWS Credentials
```bash
# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

## Step 3: Prepare Application for AWS
```bash
# Copy requirements for AWS
cp requirements-elasticbeanstalk.txt requirements.txt

# Ensure application.py is the entry point
# AWS EB looks for 'application' variable in application.py
```

## Step 4: Initialize Elastic Beanstalk Application
```bash
# Navigate to project directory
cd agriculture_chatbot

# Initialize EB application
eb init

# Follow prompts:
# 1. Select region (us-east-1 recommended)
# 2. Create new application: krushiverse-api
# 3. Select Python platform
# 4. Choose Python 3.11
# 5. Do you want to set up SSH? (Yes recommended)
```

## Step 5: Create Environment and Deploy
```bash
# Create environment and deploy
eb create krushiverse-production

# This will:
# - Create EC2 instance
# - Install dependencies
# - Deploy application
# - Set up load balancer
# - Provide public URL
```

## Step 6: Set Environment Variables
```bash
# Set Google API key
eb setenv GOOGLE_API_KEY=your_google_api_key_here

# Set other environment variables
eb setenv ENVIRONMENT=production
eb setenv PYTHONPATH=/var/app/current
```

## Step 7: Deploy Updates
```bash
# After making changes, deploy updates:
eb deploy
```

## Step 8: Monitor Application
```bash
# Check application status
eb status

# View logs
eb logs

# Open application in browser
eb open
```

## Cost Estimation:
- **t3.micro instance**: ~$8-10/month
- **Application Load Balancer**: ~$16/month
- **Data transfer**: Minimal for low traffic
- **Total**: ~$25-30/month

## Benefits of AWS Elastic Beanstalk:
✅ **Scalability**: Auto-scaling based on traffic
✅ **Reliability**: AWS infrastructure
✅ **Monitoring**: Built-in CloudWatch monitoring  
✅ **SSL**: Free SSL certificates
✅ **Rolling Updates**: Zero-downtime deployments
✅ **Easy Management**: Simple CLI commands

## Frontend Integration:
After deployment, update React app API base URL to:
```
https://krushiverse-production.us-east-1.elasticbeanstalk.com
```

## Troubleshooting:
- Check `eb logs` for error details
- Ensure all environment variables are set
- Verify requirements.txt has all dependencies
- Check AWS service limits if deployment fails