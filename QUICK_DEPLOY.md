# Quick Deployment Guide - Railway (Easiest Option)

## 🚀 Deploy in 15 Minutes

### Prerequisites
- GitHub account
- Railway account (free: https://railway.app)
- Vercel account (free: https://vercel.com) for frontend

---

## Step 1: Prepare Your Code (5 minutes)

### 1.1 Update API Server
```bash
# Rename production file to main file
cp api_server_production.py api_server.py
```

### 1.2 Update Requirements
```bash
# Use production requirements
cp requirements-production.txt requirements.txt
```

### 1.3 Commit to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway (5 minutes)

### 2.1 Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2.2 Configure Environment Variables
Click on your project → Variables → Add Variables:
```
GOOGLE_API_KEY=AIzaSyCbu-f5YHD-SnEqtISIZPpxU0RqMu5dx4Q
FRONTEND_URL=http://localhost:3001
PORT=8002
```

### 2.3 Deploy
- Railway will automatically detect Python
- It will use the `Procfile` to start the server
- Wait 2-3 minutes for deployment

### 2.4 Get Your Backend URL
- Click on your deployment
- Copy the URL (e.g., `https://krushiverse-backend.up.railway.app`)
- Save it for the next step

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Update Frontend Environment
```bash
cd KrushiVerse

# Edit .env.production
# Replace with your Railway backend URL
VITE_API_URL=https://krushiverse-backend.up.railway.app
```

### 3.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Scope: Your account
# - Link to existing project? No
# - Project name: krushiverse
# - Directory: ./
# - Override settings? No
```

### 3.3 Configure Environment Variables in Vercel
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://krushiverse-backend.up.railway.app
   ```
5. Redeploy: Deployments → Click "Redeploy"

---

## Step 4: Update Backend CORS (2 minutes)

### 4.1 Get Your Vercel URL
- Copy your Vercel URL (e.g., `https://krushiverse.vercel.app`)

### 4.2 Update Railway Environment Variables
Go to Railway → Your project → Variables → Add:
```
FRONTEND_URL=https://krushiverse.vercel.app
PRODUCTION_DOMAIN=krushiverse.vercel.app
```

### 4.3 Redeploy Backend
- Railway will automatically redeploy
- Wait 1-2 minutes

---

## Step 5: Test Your Deployment (3 minutes)

### 5.1 Test Backend
```bash
# Health check
curl https://krushiverse-backend.up.railway.app/health

# Expected response:
# {"status":"healthy","database_status":"connected","document_count":55}
```

### 5.2 Test Frontend
1. Open your Vercel URL in browser
2. Click the chatbot icon
3. Send a message: "What are bio fertilizers?"
4. Test language switching
5. Test speech recognition

---

## 🎉 You're Live!

### Your URLs:
- **Frontend**: https://krushiverse.vercel.app
- **Backend API**: https://krushiverse-backend.up.railway.app
- **API Docs**: https://krushiverse-backend.up.railway.app/docs

---

## 🔄 How to Update After Deployment

### Automatic Updates (Recommended)
```bash
# Make your code changes
# Commit and push to GitHub
git add .
git commit -m "Update feature X"
git push origin main

# Railway and Vercel will automatically redeploy! ✅
```

---

## ⚠️ Important Security Notes

### ✅ What's Secure Now:
- ✅ API key stored in Railway environment (not in code)
- ✅ HTTPS automatically enabled by Railway/Vercel
- ✅ CORS configured for your production domain
- ✅ Rate limiting active (20 requests/minute)
- ✅ Input validation and sanitization

### 🔴 Critical Actions:
1. **Never commit `.env` file to Git**
   ```bash
   # Verify it's in .gitignore
   cat .gitignore | grep .env
   ```

2. **Rotate API Key Every 90 Days**
   - Set calendar reminder
   - Generate new key in Google Cloud Console
   - Update in Railway environment variables

3. **Monitor Your Usage**
   - Check Railway dashboard for CPU/memory
   - Monitor Google API quota
   - Check error logs regularly

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Update `FRONTEND_URL` in Railway to match your Vercel domain exactly.

### Issue: 500 Internal Server Error
**Solution**: Check Railway logs:
1. Railway dashboard → Your project
2. Click "View Logs"
3. Look for error messages

### Issue: Database Not Found
**Solution**: Need to upload ChromaDB to Railway:
```bash
# Option 1: Include in Git (not recommended for large DBs)
# Remove chroma_db/ from .gitignore

# Option 2: Use Railway volumes
# Railway dashboard → Your project → Settings → Volumes
```

### Issue: Rate Limit Hit Quickly
**Solution**: Increase rate limit in `api_server.py`:
```python
@limiter.limit("50/minute")  # Increase from 20 to 50
```

---

## 💰 Costs

### Free Tier Limits:
- **Railway**: $5 credit/month (enough for hobby projects)
- **Vercel**: 100GB bandwidth/month
- **Google Gemini API**: 15 requests/minute free tier

### When You Might Need to Pay:
- High traffic (>1000 messages/day)
- Need faster response times (upgrade to GPU)
- Custom domain ($12/year for domain)

---

## 📈 Next Steps

### Optional Enhancements:
1. **Custom Domain**
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel: Settings → Domains

2. **Analytics**
   - Add Google Analytics to track usage
   - Monitor chatbot engagement

3. **Error Tracking**
   - Sign up for Sentry (free tier)
   - Get real-time error notifications

4. **Database Backups**
   - Set up automatic ChromaDB backups
   - Store in Google Cloud Storage

---

## 📞 Need Help?

- **Railway Issues**: https://railway.app/help
- **Vercel Issues**: https://vercel.com/support
- **Code Issues**: Check GitHub repository issues

---

**Congratulations! Your agricultural chatbot is now live! 🎉🌾**
