# 📋 Pre-Deployment Checklist

## ⚡ Quick Checklist (5 Minutes)

### 1. Code Preparation ✅
- [x] Production-ready `api_server_production.py` created
- [x] Rate limiting added (20 req/min)
- [x] Input validation implemented
- [x] CORS security configured
- [x] Frontend uses environment variables
- [ ] Copy `api_server_production.py` to `api_server.py`
- [ ] Copy `requirements-production.txt` to `requirements.txt`

### 2. Security Verification ✅
- [x] `.env` in `.gitignore`
- [x] No API keys in code
- [x] HTTPS-ready configuration
- [ ] Verify no sensitive data in Git history:
  ```bash
  git log --all --full-history --source -- .env
  ```

### 3. Environment Variables 🟡
**Backend (Railway/Render):**
- [ ] `GOOGLE_API_KEY` = AIzaSyCbu-f5YHD-SnEqtISIZPpxU0RqMu5dx4Q
- [ ] `FRONTEND_URL` = https://your-frontend-domain.vercel.app
- [ ] `PRODUCTION_DOMAIN` = your-frontend-domain.vercel.app
- [ ] `PORT` = 8002 (or use $PORT for auto-assignment)

**Frontend (Vercel):**
- [ ] `VITE_API_URL` = https://your-backend.railway.app

### 4. Testing 🟡
- [ ] Test locally first:
  ```bash
  python api_server_production.py
  cd KrushiVerse && npm run dev
  ```
- [ ] Verify health endpoint: http://localhost:8002/health
- [ ] Test chat functionality
- [ ] Test all 3 languages (English, Hindi, Marathi)
- [ ] Test speech recognition

### 5. Git Preparation 🟡
- [ ] Initialize Git repository:
  ```bash
  git init
  git add .
  git commit -m "Initial deployment-ready commit"
  ```
- [ ] Create GitHub repository
- [ ] Push to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push -u origin main
  ```

---

## 🚀 Deployment Steps

### Option 1: Railway + Vercel (Recommended)
Follow: `QUICK_DEPLOY.md`
- ⏱️ Time: 15 minutes
- 💰 Cost: Free
- 🔧 Difficulty: Easy

### Option 2: Render
Follow: `DEPLOYMENT_GUIDE.md` → Option 2
- ⏱️ Time: 20 minutes
- 💰 Cost: Free
- 🔧 Difficulty: Medium

---

## 🔒 Security Checklist

### Critical ⚠️
- [ ] API key NOT in Git repository
- [ ] `.env` file in `.gitignore`
- [ ] CORS restricted to production domain
- [ ] HTTPS enabled
- [ ] Rate limiting active

### Recommended 💡
- [ ] Error tracking setup (Sentry)
- [ ] Logging configured
- [ ] Database backups scheduled
- [ ] Monitoring dashboard reviewed

---

## ✅ Post-Deployment Verification

### 1. Backend Health
```bash
# Should return: {"status":"healthy","database_status":"connected"}
curl https://your-backend.railway.app/health
```

### 2. Chat API
```bash
curl -X POST https://your-backend.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","language":"English"}'
```

### 3. Frontend
- [ ] Open https://your-frontend.vercel.app
- [ ] Chatbot icon visible
- [ ] Can send messages
- [ ] Receives responses
- [ ] Language switching works
- [ ] Speech recognition works
- [ ] Mobile responsive

### 4. Rate Limiting
```bash
# Send 25 requests rapidly - last 5 should fail
for i in {1..25}; do
  curl -X POST https://your-backend.railway.app/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"test $i\",\"language\":\"English\"}"
done
```

### 5. CORS
- [ ] Test from production domain ✅
- [ ] Test from localhost (should fail) ✅
- [ ] Test from other domains (should fail) ✅

---

## 📊 Performance Checklist

### Response Time
- [ ] Health endpoint: < 200ms
- [ ] Chat endpoint: < 3s (first request)
- [ ] Chat endpoint: < 1s (subsequent)

### Database
- [ ] ChromaDB accessible
- [ ] 47 documents present
- [ ] Query returns results

### Error Rate
- [ ] < 1% error rate
- [ ] No 500 errors
- [ ] Graceful error handling

---

## 🔄 Update Process Checklist

### Before Making Changes
- [ ] Test locally first
- [ ] Review security implications
- [ ] Update documentation if needed

### Deployment
- [ ] Commit changes with clear message
- [ ] Push to GitHub
- [ ] Verify auto-deployment succeeded
- [ ] Test in production
- [ ] Monitor logs for errors

---

## 🐛 Common Issues & Fixes

### ❌ Issue: "Module not found"
✅ **Fix**: Update `requirements.txt`
```bash
pip freeze > requirements.txt
```

### ❌ Issue: "CORS error"
✅ **Fix**: Update `FRONTEND_URL` in Railway env vars to match Vercel domain exactly

### ❌ Issue: "Database not found"
✅ **Fix**: Upload `chroma_db/` to production or re-run ingestion:
```bash
railway run python ingest_data.py
```

### ❌ Issue: "API key invalid"
✅ **Fix**: Verify `GOOGLE_API_KEY` in Railway environment variables

### ❌ Issue: "Rate limit too strict"
✅ **Fix**: Increase in `api_server.py`:
```python
@limiter.limit("50/minute")  # Change from 20 to 50
```

---

## 📈 Monitoring Checklist

### Daily (First Week)
- [ ] Check error logs
- [ ] Monitor API quota usage
- [ ] Review response times
- [ ] Check user engagement

### Weekly
- [ ] Review Railway/Vercel costs
- [ ] Check database size
- [ ] Review security logs
- [ ] Monitor uptime

### Monthly
- [ ] API key rotation (every 90 days)
- [ ] Database backup verification
- [ ] Performance optimization review
- [ ] Security audit

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Health endpoint returns "healthy"
- ✅ Chat messages receive responses
- ✅ All 3 languages work correctly
- ✅ Speech recognition functional
- ✅ Rate limiting prevents abuse
- ✅ No sensitive data exposed
- ✅ HTTPS enabled
- ✅ Error handling graceful
- ✅ Mobile responsive
- ✅ Can update via Git push

---

## 📞 Support Resources

### Documentation
- [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Security Audit](SECURITY_AUDIT.md)
- [Quick Deploy](QUICK_DEPLOY.md)

### Platform Docs
- [Railway](https://docs.railway.app/)
- [Vercel](https://vercel.com/docs)
- [FastAPI](https://fastapi.tiangolo.com/)

### Help
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- GitHub Issues: Create an issue in your repository

---

## ✨ Final Notes

**Remember:**
1. **Never** commit `.env` files
2. **Always** test locally before pushing
3. **Monitor** your deployment regularly
4. **Rotate** API keys every 90 days
5. **Backup** your database weekly

**You're ready to deploy! 🚀**

Follow `QUICK_DEPLOY.md` for fastest deployment (15 minutes).
