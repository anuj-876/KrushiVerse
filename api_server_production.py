# Security & Production Fixes

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from html import escape
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="KrushiVerse Agricultural Assistant API")

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security: Get allowed origins from environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add production domain if specified
PRODUCTION_DOMAIN = os.getenv("PRODUCTION_DOMAIN")
if PRODUCTION_DOMAIN:
    ALLOWED_ORIGINS.append(f"https://{PRODUCTION_DOMAIN}")
    ALLOWED_ORIGINS.append(f"https://www.{PRODUCTION_DOMAIN}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    language: str = "English"

class ChatResponse(BaseModel):
    response: str

# Validate API key on startup
@app.on_event("startup")
async def startup_event():
    """Validate configuration on startup"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables")
        raise ValueError("GOOGLE_API_KEY is required")
    logger.info("✅ API key validated")
    logger.info(f"✅ CORS allowed origins: {ALLOWED_ORIGINS}")

# Initialize RAG components
logger.info("Initializing RAG system...")

# Try Google embeddings first, fall back to HuggingFace
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    logger.info("✅ Using Google Generative AI Embeddings")
except Exception as e:
    logger.warning(f"Google embeddings failed: {e}. Falling back to HuggingFace.")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    logger.info("✅ Using HuggingFace Embeddings")

# Load vector database
try:
    vectorstore = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )
    logger.info("✅ Vector database loaded successfully")
except Exception as e:
    logger.error(f"Failed to load vector database: {e}")
    raise

# Initialize LLM
llm = GoogleGenerativeAI(
    model="gemini-2.0-flash-exp",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

# Language-specific prompts
PROMPT_TEMPLATES = {
    "English": """You are a knowledgeable agricultural expert assistant specializing in sustainable farming practices for Pune district, Maharashtra, India.

Context from agricultural knowledge base:
{context}

User Question: {question}

Instructions:
- Provide detailed, practical advice based on the context provided
- If discussing bio-fertilizers, include: types, preparation methods, application rates, and benefits
- If the context doesn't contain relevant information, use your general agricultural knowledge
- Keep responses clear, actionable, and suitable for farmers
- Focus on sustainable and organic farming practices

Answer:""",
    
    "Hindi": """आप पुणे जिला, महाराष्ट्र, भारत के लिए टिकाऊ कृषि प्रथाओं में विशेषज्ञता रखने वाले एक जानकार कृषि विशेषज्ञ सहायक हैं।

कृषि ज्ञान आधार से संदर्भ:
{context}

उपयोगकर्ता प्रश्न: {question}

निर्देश:
- प्रदान किए गए संदर्भ के आधार पर विस्तृत, व्यावहारिक सलाह दें
- जैव-उर्वरकों पर चर्चा करते समय शामिल करें: प्रकार, तैयारी के तरीके, अनुप्रयोग दरें, और लाभ
- यदि संदर्भ में प्रासंगिक जानकारी नहीं है, तो अपने सामान्य कृषि ज्ञान का उपयोग करें
- जवाब स्पष्ट, कार्रवाई योग्य और किसानों के लिए उपयुक्त रखें
- टिकाऊ और जैविक कृषि प्रथाओं पर ध्यान दें

उत्तर:""",
    
    "Marathi": """तुम्ही पुणे जिल्हा, महाराष्ट्र, भारतासाठी शाश्वत शेती पद्धतींमध्ये विशेष ज्ञान असलेले कृषी तज्ञ सहाय्यक आहात।

कृषी ज्ञान आधारातील संदर्भ:
{context}

वापरकर्ता प्रश्न: {question}

सूचना:
- प्रदान केलेल्या संदर्भावर आधारित तपशीलवार, व्यावहारिक सल्ला द्या
- जैव-खतांवर चर्चा करताना समाविष्ट करा: प्रकार, तयारी पद्धती, वापर दर, आणि फायदे
- जर संदर्भात संबंधित माहिती नसेल तर तुमचे सामान्य कृषी ज्ञान वापरा
- उत्तरे स्पष्ट, कृती करण्यायोग्य आणि शेतकऱ्यांसाठी योग्य ठेवा
- शाश्वत आणि सेंद्रिय शेती पद्धतींवर लक्ष केंद्रित करा

उत्तर:"""
}

# Create QA chains for each language
qa_chains = {}
for lang, template in PROMPT_TEMPLATES.items():
    prompt = PromptTemplate(
        template=template,
        input_variables=["context", "question"]
    )
    
    qa_chains[lang] = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=False
    )

logger.info("✅ RAG system initialized successfully")

# Enhanced responses for specific topics
def enhance_biofertilizer_response(response: str, language: str) -> str:
    """Add additional context for bio-fertilizer queries"""
    bio_keywords = {
        "English": ["bio", "fertilizer", "organic", "compost"],
        "Hindi": ["जैव", "उर्वरक", "जैविक", "खाद"],
        "Marathi": ["जैव", "खत", "सेंद्रिय", "कंपोस्ट"]
    }
    
    if any(keyword in response.lower() for keyword in bio_keywords.get(language, [])):
        additions = {
            "English": "\n\n💡 Pro Tip: Always conduct a soil test before applying bio-fertilizers to determine exact nutrient requirements.",
            "Hindi": "\n\n💡 विशेष सलाह: जैव-उर्वरक लगाने से पहले हमेशा मिट्टी परीक्षण करें।",
            "Marathi": "\n\n💡 महत्वाचा सल्ला: जैव-खत वापरण्यापूर्वी नेहमी मातीची चाचणी करा।"
        }
        return response + additions.get(language, "")
    return response

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint with database status"""
    try:
        # Test database connection
        collection_count = vectorstore._collection.count()
        return {
            "status": "healthy",
            "database_status": "connected",
            "document_count": collection_count,
            "embeddings": "HuggingFace" if isinstance(embeddings, HuggingFaceEmbeddings) else "Google"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")  # Rate limit: 20 requests per minute
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    """Chat endpoint with RAG-enhanced responses"""
    try:
        # Input validation and sanitization
        if not chat_request.message or len(chat_request.message.strip()) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "Message cannot be empty"}
            )
        
        # Sanitize input (prevent XSS)
        sanitized_message = escape(chat_request.message)[:500]  # Limit to 500 chars
        
        # Validate language
        if chat_request.language not in PROMPT_TEMPLATES:
            chat_request.language = "English"
        
        logger.info(f"Chat request: {sanitized_message[:50]}... | Language: {chat_request.language}")
        
        # Get QA chain for selected language
        qa_chain = qa_chains.get(chat_request.language, qa_chains["English"])
        
        # Generate response
        result = qa_chain({"query": sanitized_message})
        response_text = result["result"]
        
        # Enhance response if needed
        enhanced_response = enhance_biofertilizer_response(response_text, chat_request.language)
        
        logger.info(f"Response generated successfully (length: {len(enhanced_response)})")
        
        return ChatResponse(response=enhanced_response)
    
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error. Please try again later."}
        )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "KrushiVerse Agricultural Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "chat": "/chat (POST)",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
