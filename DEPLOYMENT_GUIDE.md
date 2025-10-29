# 🚀 Deployment Guide for KrushiVerse Agricultural Chatbot

## ⚠️ **CRITICAL SECURITY ISSUES TO FIX BEFORE DEPLOYMENT**

### 🔴 **HIGH PRIORITY - MUST FIX**

#### 1. **API Key Exposure**
**Issue**: Your Google API key is visible in `.env` file and could be accidentally committed to Git.

**Solution**:
```bash
# Ensure .env is in .gitignore (already done)
# NEVER commit .env file to repository
# For production, use environment variables from hosting platform
```

#### 2. **CORS Configuration - Security Risk**
**Current Issue**: CORS allows only localhost origins, which won't work in production.

**Fix Required**: Update `api_server.py`
```python
# BEFORE (Development):
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", ...]

# AFTER (Production):
allow_origins=[
    "https://your-production-domain.com",  # Your actual domain
    "https://www.your-production-domain.com",
    os.getenv("FRONTEND_URL", "http://localhost:3001")  # Fallback for dev
]
```

#### 3. **Hardcoded Backend URL in Frontend**
**Current Issue**: Frontend has hardcoded `http://127.0.0.1:8002/chat`

**Fix Required**: Create environment variable
```javascript
// In HomePage.jsx, replace:
const response = await fetch("http://127.0.0.1:8002/chat", {

// With:
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002";
const response = await fetch(`${API_URL}/chat`, {
```

#### 4. **Database Security**
**Issue**: ChromaDB directory is local and not secured.

**Solutions**:
- Keep `chroma_db/` in `.gitignore` ✅ (already done)
- For production, use persistent volume storage
- Consider encrypting sensitive data

#### 5. **Rate Limiting**
**Issue**: No rate limiting on API endpoints - vulnerable to abuse.

**Fix Required**: Add rate limiting middleware
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/chat")
@limiter.limit("10/minute")  # 10 requests per minute
async def chat_endpoint(request: ChatRequest):
    ...
```

---

## 🟡 **MEDIUM PRIORITY - RECOMMENDED FIXES**

### 1. **Error Handling**
Add better error messages and logging for production.

### 2. **API Key Validation**
Add startup check to ensure API keys are valid.

### 3. **Health Check Enhancement**
Add database connectivity check in health endpoint.

### 4. **Input Validation**
Add length limits and sanitization for user inputs.

---

## 📋 **DEPLOYMENT OPTIONS**

### **Option 1: Deploy to Railway (Recommended - Easiest)**

#### **Advantages:**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Easy environment variable management
- ✅ Supports Python + Node.js
- ✅ Built-in PostgreSQL/Redis if needed

#### **Steps:**

1. **Prepare Your Project**
```bash
# Create Procfile for backend
echo "web: uvicorn api_server:app --host 0.0.0.0 --port $PORT" > Procfile

# Create railway.json
```

2. **Sign up at Railway.app**
```
https://railway.app/
```

3. **Deploy Backend**
- Click "New Project" → "Deploy from GitHub"
- Select your repository
- Add environment variables:
  - `GOOGLE_API_KEY` = your-api-key
  - `FRONTEND_URL` = https://your-frontend-domain.com
- Railway will auto-detect Python and deploy

4. **Deploy Frontend**
- Create new service for frontend
- Build command: `cd KrushiVerse && npm install && npm run build`
- Start command: `cd KrushiVerse && npm run preview`
- Add environment variable:
  - `VITE_API_URL` = https://your-backend-url.railway.app

---

### **Option 2: Deploy to Render**

#### **Advantages:**
- ✅ Free tier with automatic SSL
- ✅ Easy database integration
- ✅ Good for full-stack apps

#### **Steps:**

1. **Create `render.yaml`** (Infrastructure as Code)
```yaml
services:
  - type: web
    name: krushiverse-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn api_server:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: GOOGLE_API_KEY
        sync: false
      - key: PYTHON_VERSION
        value: 3.10.0
    
  - type: web
    name: krushiverse-frontend
    env: node
    buildCommand: "cd KrushiVerse && npm install && npm run build"
    startCommand: "cd KrushiVerse && npm run preview"
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: krushiverse-backend
          property: host
```

2. **Deploy**
- Push to GitHub
- Connect Render to your repository
- Render will auto-deploy from `render.yaml`

---

### **Option 3: Deploy to Vercel (Frontend) + Railway (Backend)**

#### **Best for**: Separating frontend and backend

**Frontend (Vercel):**
```bash
cd KrushiVerse
vercel --prod
```

**Backend (Railway):**
- Follow Railway backend steps above

---

### **Option 4: Deploy to DigitalOcean App Platform**

#### **Advantages:**
- ✅ More control
- ✅ Built-in monitoring
- ✅ Database integration

**Cost**: Starting at $5/month

---

## 🔧 **PRE-DEPLOYMENT CHECKLIST**

### **Code Changes Required:**

#### 1. **Update `api_server.py` - CORS & Security**
```python
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Add rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Update CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3001"],  # Add production URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting to endpoints
@app.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")  # Adjust as needed
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    ...
```

#### 2. **Update `requirements.txt`**
Add missing production dependencies:
```txt
slowapi==0.1.9
gunicorn==21.2.0
```

#### 3. **Create `KrushiVerse/.env.production`**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

#### 4. **Update `HomePage.jsx`**
```javascript
// At the top of the component
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002";

// Update fetch calls
const response = await fetch(`${API_URL}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: currentMessage,
    language: selectedLanguage,
  }),
});
```

#### 5. **Create `.dockerignore`** (if using Docker)
```
.venv/
__pycache__/
*.pyc
.env
chroma_db/
node_modules/
.git/
```

---

## 🔄 **CONTINUOUS DEPLOYMENT SETUP**

### **Automatic Updates After Deployment**

#### **Option 1: GitHub Actions (Recommended)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

#### **Option 2: Railway Auto-Deploy**
- Enable "Auto-deploy" in Railway dashboard
- Every push to `main` branch auto-deploys

#### **Option 3: Vercel Auto-Deploy**
- Vercel automatically deploys on every Git push
- No configuration needed

---

## 📊 **MONITORING & MAINTENANCE**

### **1. Add Logging**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    logger.info(f"Chat request: {request.message[:50]}...")
    ...
```

### **2. Set Up Error Tracking**
Use Sentry for error monitoring:
```bash
pip install sentry-sdk
```

```python
import sentry_sdk
sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"))
```

### **3. Database Backups**
- Set up automated ChromaDB backups
- Store in cloud storage (AWS S3, Google Cloud Storage)

---

## 🔐 **SECURITY BEST PRACTICES**

### **1. Environment Variables**
```bash
# Never commit these to Git:
GOOGLE_API_KEY=xxx
DATABASE_URL=xxx
SECRET_KEY=xxx
```

### **2. HTTPS Only**
- Railway/Vercel/Render provide free SSL
- Force HTTPS redirects

### **3. Input Sanitization**
```python
from html import escape

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Sanitize user input
    sanitized_message = escape(request.message)[:500]  # Limit length
    ...
```

### **4. API Key Rotation**
- Rotate Google API key every 90 days
- Keep old key for 24 hours during transition

---

## 📝 **DEPLOYMENT COMMANDS SUMMARY**

### **Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set environment variables
railway variables set GOOGLE_API_KEY=your-key
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
```

### **Vercel Deployment (Frontend)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd KrushiVerse
vercel --prod

# Set environment variables
vercel env add VITE_API_URL production
```

---

## 🎯 **POST-DEPLOYMENT TESTING**

### **1. Health Check**
```bash
curl https://your-backend.railway.app/health
```

### **2. Chat API Test**
```bash
curl -X POST https://your-backend.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what are bio fertilizers", "language": "English"}'
```

### **3. Frontend Test**
- Open https://your-frontend.vercel.app
- Test chatbot functionality
- Test speech recognition
- Test language switching

---

## 🐛 **COMMON DEPLOYMENT ISSUES & FIXES**

### **Issue 1: Module Not Found**
```bash
# Fix: Update requirements.txt
pip freeze > requirements.txt
```

### **Issue 2: CORS Error**
```python
# Fix: Add production domain to CORS
allow_origins=["https://your-domain.com"]
```

### **Issue 3: Database Not Found**
```bash
# Fix: Run ingestion on production server
railway run python ingest_data.py
```

### **Issue 4: Out of Memory**
```python
# Fix: Reduce batch size in ingestion
batch_size = 5  # Instead of 10
```

---

## 📚 **RECOMMENDED READING**

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [FastAPI Production Guide](https://fastapi.tiangolo.com/deployment/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

---

## 🎉 **FINAL CHECKLIST BEFORE GOING LIVE**

- [ ] Remove all hardcoded URLs
- [ ] Update CORS with production domains
- [ ] Add rate limiting
- [ ] Set up environment variables on hosting platform
- [ ] Test API key validation
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Test all features on production
- [ ] Set up automatic backups
- [ ] Document API endpoints
- [ ] Add error pages (404, 500)
- [ ] Test on mobile devices
- [ ] Set up domain name (optional)
- [ ] Enable auto-deployment from Git

---

**Good luck with your deployment! 🚀🌾**

For support, refer to the hosting platform's documentation or create an issue in your repository.
