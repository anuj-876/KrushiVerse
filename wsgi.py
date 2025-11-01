# /var/www/anujsutar876_pythonanywhere_com_wsgi.py
# PythonAnywhere WSGI configuration

import sys
import os

# Add your project directory to sys.path
project_home = '/home/anujsutar876/agriculture_chatbot'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['GOOGLE_API_KEY'] = 'your_google_api_key_here'
os.environ['ENVIRONMENT'] = 'production'

# Import your FastAPI app
from api_server import app

# WSGI application
application = app