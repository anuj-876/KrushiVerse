# 🚀 AWS Free Tier Deployment Guide for KrushiVerse

## 📋 AWS Free Tier Resources You'll Use
- **EC2 t2.micro**: 750 hours/month (backend hosting)
- **S3**: 5GB storage + 20,000 requests (frontend hosting)
- **Route 53**: 1 hosted zone (custom domain - optional)
- **CloudFront**: 50GB data transfer (CDN - optional)

## 🏗️ Architecture Overview
```
Internet → CloudFront (CDN) → S3 (React Frontend)
                           ↘
                            EC2 (FastAPI Backend + ChromaDB)
```

## 🔧 Step 1: Prepare Your Project

### Create Production Requirements
```bash
# Create AWS-optimized requirements
# (Lightweight version without heavy ML libs)
```

### Build Frontend for Production
```bash
cd KrushiVerse
npm run build
# Creates dist/ folder with static files
```

## 🖥️ Step 2: EC2 Backend Deployment

### Launch EC2 Instance
1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Amazon Linux 2023 (Free Tier eligible)
3. **Instance Type**: t2.micro (Free Tier)
4. **Key Pair**: Create new or use existing
5. **Security Group**: 
   - SSH (port 22) - Your IP only
   - HTTP (port 80) - Anywhere
   - Custom TCP (port 8002) - Anywhere
6. **Storage**: 8GB (Free Tier limit)

### Connect and Setup
```bash
# Connect to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Python 3.11
sudo yum install python3.11 python3.11-pip git -y

# Clone your repository
git clone https://github.com/anuj-876/KrushiVerse.git
cd KrushiVerse

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
sudo nano /etc/environment
# Add: GOOGLE_API_KEY=your_key_here

# Create systemd service
sudo nano /etc/systemd/system/krushiverse.service
```

### Systemd Service Configuration
```ini
[Unit]
Description=KrushiVerse FastAPI App
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/KrushiVerse
Environment=PATH=/home/ec2-user/KrushiVerse/venv/bin
Environment=GOOGLE_API_KEY=your_api_key_here
ExecStart=/home/ec2-user/KrushiVerse/venv/bin/uvicorn api_server:app --host 0.0.0.0 --port 8002
Restart=always

[Install]
WantedBy=multi-user.target
```

### Start the Service
```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable krushiverse
sudo systemctl start krushiverse
sudo systemctl status krushiverse

# Check if running
curl http://localhost:8002/health
```

## 🌐 Step 3: S3 Frontend Deployment

### Create S3 Bucket
```bash
# AWS CLI commands (install AWS CLI first)
aws configure
# Enter your Access Key, Secret Key, Region

# Create bucket (use unique name)
aws s3 mb s3://krushiverse-frontend-your-name

# Enable static website hosting
aws s3 website s3://krushiverse-frontend-your-name \
  --index-document index.html \
  --error-document index.html
```

### Upload Frontend Files
```bash
# From your local machine in KrushiVerse/dist folder
aws s3 sync ./dist s3://krushiverse-frontend-your-name \
  --acl public-read
```

### Bucket Policy (Make Public)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::krushiverse-frontend-your-name/*"
    }
  ]
}
```

## 🔗 Step 4: Configure API URLs

### Update Frontend Configuration
```javascript
// In your built files, update API_URL to EC2 public IP
const API_URL = "http://your-ec2-public-ip:8002";
```

### Update Backend CORS
```python
# In api_server.py, add your S3 URL to ALLOWED_ORIGINS
ALLOWED_ORIGINS = [
    "http://krushiverse-frontend-your-name.s3-website-region.amazonaws.com",
    "http://your-ec2-public-ip:8002",
    # ... existing origins
]
```

## 🚀 Step 5: Optional Enhancements

### CloudFront CDN Setup
1. **Create Distribution**
   - Origin: Your S3 bucket
   - Default Root Object: index.html
   - Custom Error Pages: /index.html for SPA routing

### Route 53 Custom Domain
1. **Register Domain** (costs ~$12/year)
2. **Create Hosted Zone**
3. **Point to CloudFront/S3**

## 💰 Cost Breakdown (Free Tier)
- **EC2 t2.micro**: $0 (750 hours free)
- **S3**: $0 (5GB + 20k requests free)
- **Data Transfer**: $0 (1GB free)
- **CloudFront**: $0 (50GB free)
- **Total Monthly**: $0 (within free tier limits)

## 🔧 Production Optimizations

### SSL Certificate (Free)
```bash
# Install certbot on EC2
sudo yum install certbot -y

# Get certificate (requires domain)
sudo certbot certonly --standalone -d yourdomain.com
```

### Nginx Reverse Proxy (Optional)
```bash
# Install nginx
sudo yum install nginx -y

# Configure reverse proxy
sudo nano /etc/nginx/nginx.conf
```

### Auto-deployment with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        # SSH and pull latest code
      - name: Deploy to S3
        # Build and sync to S3
```

## 🔍 Monitoring & Troubleshooting

### Check Backend Status
```bash
# On EC2
sudo systemctl status krushiverse
journalctl -u krushiverse -f

# Test endpoints
curl http://localhost:8002/health
curl http://localhost:8002/docs
```

### Check Frontend
```bash
# Test S3 website
curl http://krushiverse-frontend-your-name.s3-website-region.amazonaws.com
```

## 📱 Access Your Deployed App
- **Frontend**: `http://bucket-name.s3-website-region.amazonaws.com`
- **Backend API**: `http://ec2-public-ip:8002`
- **API Docs**: `http://ec2-public-ip:8002/docs`

## ⚠️ Important Notes
- **Keep within Free Tier**: Monitor usage in AWS Billing Dashboard
- **Security**: Use IAM roles, security groups, and regular updates
- **Backup**: Regular snapshots of EC2 instance
- **Domain**: Consider buying a domain for professional look

## 🎯 Next Steps After Deployment
1. Test all functionality
2. Set up monitoring (CloudWatch)
3. Configure automated backups
4. Consider CI/CD pipeline
5. Add SSL certificate for HTTPS

Your KrushiVerse app will be live on AWS Free Tier! 🚀