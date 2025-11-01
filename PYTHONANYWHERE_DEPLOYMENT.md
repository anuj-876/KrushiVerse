# PythonAnywhere Deployment Guide for KrushiVerse Backend

## Step 1: Create PythonAnywhere Account
1. Go to https://www.pythonanywhere.com
2. Sign up for free account
3. Free tier gives: 3GB storage, 1 web app, Python 3.x support

## Step 2: Upload Project Files
### Method 1: Git Clone (Recommended)
```bash
# In PythonAnywhere console
cd ~
git clone https://github.com/anuj-876/KrushiVerse.git agriculture_chatbot
cd agriculture_chatbot
```

### Method 2: File Upload
- Use PythonAnywhere file manager
- Upload project files to /home/yourusername/agriculture_chatbot/

## Step 3: Install Dependencies
```bash
# In PythonAnywhere console
cd ~/agriculture_chatbot
pip3.11 install --user -r requirements-pythonanywhere.txt
```

## Step 4: Configure Web App
1. Go to PythonAnywhere Dashboard > Web
2. Click "Add a new web app"
3. Choose "Manual Configuration"
4. Select Python 3.11
5. Set Source code: /home/yourusername/agriculture_chatbot
6. Set WSGI file: /var/www/yourusername_pythonanywhere_com_wsgi.py

## Step 5: Edit WSGI File
Replace WSGI file content with our wsgi.py content:
```python
import sys
import os

project_home = '/home/yourusername/agriculture_chatbot'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ['GOOGLE_API_KEY'] = 'your_actual_google_api_key'
os.environ['ENVIRONMENT'] = 'production'

from api_server import app
application = app
```

## Step 6: Set Environment Variables
In PythonAnywhere web app settings:
- Add environment variables in "Environment variables" section
- GOOGLE_API_KEY = your_google_api_key
- ENVIRONMENT = production

## Step 7: Reload Web App
- Click "Reload" button in web app settings
- Your API will be available at: https://yourusername.pythonanywhere.com

## API Endpoints:
- GET /: Health check
- POST /chat: Chat with agricultural assistant
- GET /health: System health check

## Frontend Integration:
Update your React app's API base URL to:
https://yourusername.pythonanywhere.com

## Troubleshooting:
- Check error logs in PythonAnywhere dashboard
- Ensure all dependencies are installed
- Verify GOOGLE_API_KEY is set correctly
- Check file permissions if needed