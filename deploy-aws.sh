#!/bin/bash
# AWS Deployment Script for KrushiVerse
# Run this script on your EC2 instance

set -e

echo "🚀 Starting KrushiVerse AWS Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install dependencies
echo "🐍 Installing Python and Git..."
sudo yum install python3.11 python3.11-pip git nginx -y

# Clone repository (replace with your repo)
echo "📁 Cloning repository..."
if [ ! -d "KrushiVerse" ]; then
    git clone https://github.com/anuj-876/KrushiVerse.git
fi
cd KrushiVerse

# Create virtual environment
echo "🔧 Setting up Python environment..."
python3.11 -m venv venv
source venv/bin/activate

# Install requirements
echo "📋 Installing Python dependencies..."
pip install -r requirements-aws.txt

# Set up environment variables
echo "🔑 Setting up environment variables..."
echo "Please enter your Google API key:"
read -s GOOGLE_API_KEY

cat > .env << EOF
GOOGLE_API_KEY=$GOOGLE_API_KEY
FRONTEND_URL=http://your-s3-bucket.s3-website-region.amazonaws.com
PORT=8002
EOF

# Create systemd service
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/krushiverse.service > /dev/null << EOF
[Unit]
Description=KrushiVerse FastAPI App
After=network.target

[Service]
User=ec2-user
WorkingDirectory=$PWD
Environment=PATH=$PWD/venv/bin
EnvironmentFile=$PWD/.env
ExecStart=$PWD/venv/bin/uvicorn api_server:app --host 0.0.0.0 --port 8002
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start service
echo "🔄 Starting KrushiVerse service..."
sudo systemctl daemon-reload
sudo systemctl enable krushiverse
sudo systemctl start krushiverse

# Check status
echo "✅ Checking service status..."
sudo systemctl status krushiverse --no-pager

# Test endpoint
echo "🧪 Testing health endpoint..."
sleep 5
curl -f http://localhost:8002/health || echo "⚠️ Service might still be starting..."

# Configure firewall (if needed)
echo "🔒 Configuring firewall..."
sudo firewall-cmd --permanent --add-port=8002/tcp || true
sudo firewall-cmd --reload || true

echo "🎉 KrushiVerse backend deployment complete!"
echo "📍 Backend URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8002"
echo "📖 API Docs: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8002/docs"
echo ""
echo "Next steps:"
echo "1. Build and upload frontend to S3"
echo "2. Update CORS settings with your S3 URL"
echo "3. Test the complete application"