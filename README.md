# 🌱 Krishi Verse - Modern Agricultural AI Assistant

**Krishi Verse** is now a modern **React.js + FastAPI** multilingual agricultural chatbot designed specifically for farmers in Pune district. The system provides expert agricultural advice in Hindi, Marathi, and English using advanced RAG (Retrieval-Augmented Generation) technology.

## 🏗️ System Architecture

### ✅ Backend (FastAPI) - Currently Running
- **Status**: ✅ Active on http://localhost:8000
- **Technology**: FastAPI + Python with Google Gemini 2.0 Flash
- **Features**: RAG with ChromaDB, multilingual support, expert farmer persona

### ⏳ Frontend (React.js) - Ready for Deployment
- **Status**: ⏳ Awaiting Node.js installation
- **Technology**: React 18 + Material-UI + Vite
- **Features**: ChatGPT-style interface, responsive design, real-time chat

## 🚀 Quick Start Guide

### Current Status (Backend Ready)
The FastAPI backend is already running! You can:
1. **Test API**: Visit http://localhost:8000/docs for interactive documentation
2. **Health Check**: GET http://localhost:8000/health
3. **Chat API**: POST http://localhost:8000/chat

### Next Steps (After Node.js Installation)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm run dev
```

## 📁 Project Structure
```
agriculture_chatbot/
├── 📂 Backend (FastAPI) ✅
│   ├── api_server.py         # Main FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── chromadb/            # Vector database (120+ docs)
│   └── data/                # Agricultural knowledge base
├── 📂 Frontend (React) ⏳
│   ├── src/App.jsx          # Modern chat interface
│   ├── package.json         # Node.js dependencies
│   └── services/            # API integration
└── 📂 Legacy
    └── app.py              # Original Streamlit (deprecated)
```

## 🌐 API Endpoints (Available Now)

### Chat with AI Assistant
```http
POST http://localhost:8000/chat
Content-Type: application/json

{
  "message": "टमाटर में रोग की पहचान कैसे करें?",
  "session_id": "optional_session_id"
}
```

### Interactive Documentation
Open: **http://localhost:8000/docs**

## 🎯 Features

### ✅ Currently Available (Backend)
- **Multilingual AI**: Hindi, Marathi, English responses
- **Agricultural Expertise**: 120+ documents about Pune farming
- **RAG System**: ChromaDB vector database with contextual retrieval
- **Expert Persona**: Responds as experienced Pune district farmer
- **API Documentation**: Interactive Swagger/OpenAPI interface

### ⏳ Coming Online (Frontend - After Node.js)
- **Modern Chat UI**: ChatGPT-style interface with Material-UI
- **Real-time Messaging**: Instant responses with typing indicators
- **Mobile Responsive**: Optimized for all devices
- **Agricultural Theme**: Green design with farming icons
- **Suggested Questions**: Quick-start prompts for farmers

## 🔧 Technology Stack

**Backend**: FastAPI • LangChain • ChromaDB • Google Gemini 2.0 • Uvicorn
**Frontend**: React 18 • Material-UI • Vite • Axios • Framer Motion

## 🌾 Agricultural Knowledge Base

Comprehensive information covering:
- **Crops**: Rice, wheat, sugarcane, cotton, tomato, onion
- **Pest Management**: IPM strategies and organic solutions
- **Weather Guidance**: Monsoon and seasonal farming advice
- **Soil Health**: Fertilizers, nutrients, pH management
- **Modern Techniques**: Precision agriculture, sustainable farming
- **Local Expertise**: Pune district specific climate and conditions

## 📞 Ready for Production

After Node.js installation, you'll have a complete modern agricultural AI system:
1. **Backend API**: http://localhost:8000 ✅ Running
2. **Frontend UI**: http://localhost:3000 ⏳ Ready to deploy
3. **Full Integration**: Professional agricultural assistant for farmers! 🚀
