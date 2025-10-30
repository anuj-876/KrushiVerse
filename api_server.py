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
import uuid
from typing import Dict, List, Optional

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="KrushiVerse Agricultural Assistant API")

# Session storage for conversation tracking
session_storage: Dict[str, List[Dict[str, str]]] = {}

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
    session_id: Optional[str] = None  # Optional session ID for conversation tracking

class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None

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
# Use HuggingFace embeddings (quota-free, works offline)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
)
logger.info("✅ Using Multilingual HuggingFace Embeddings (supports Hindi/Marathi)")

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
    "English": """You are an experienced farmer from Pune district who gives direct, practical farming advice.

Context: {context}
{history}
Current Question: {question}

Give a direct answer in 2-3 sentences. If this is the first question in conversation, you may use a simple, neutral greeting like "Hello!" or "Hi there!" once. For follow-up questions, skip greetings and give direct advice. Use simple farming language and focus on actionable steps with specific methods, quantities, and timing.

Answer:""",
    
    "Hindi": """आप पुणे जिले के एक अनुभवी किसान हैं जो सीधी व्यावहारिक खेती की सलाह देते हैं।

संदर्भ: {context}
{history}
वर्तमान प्रश्न: {question}

2-3 वाक्य में सीधा जवाब दें। अगर यह बातचीत का पहला प्रश्न है तो सिर्फ सरल अभिवादन जैसे "हेलो!" या "नमस्ते!" का उपयोग करें। बाकी प्रश्नों के लिए सीधी सलाह दें। सरल खेती की भाषा का प्रयोग करें और व्यावहारिक कदमों, मात्रा और समय पर ध्यान दें।

उत्तर:""",
    
    "Marathi": """तुम्ही पुणे जिल्ह्यातील एक अनुभवी शेतकरी आहात जो थेट व्यावहारिक शेतीचा सल्ला देतात।

संदर्भ: {context}
{history}
सध्याचा प्रश्न: {question}

2-3 वाक्यात थेट उत्तर द्या। जर हा संभाषणातील पहिला प्रश्न असेल तर फक्त साधे अभिवादन जसे "नमस्कार!" किंवा "हाय!" वापरा। इतर प्रश्नांसाठी थेट सल्ला द्या। साधी शेतीची भाषा वापरा आणि व्यावहारिक पायऱ्या, प्रमाण आणि वेळेवर लक्ष द्या।

उत्तर:"""
}

# Create QA chains for each language
qa_chains = {}
for lang, template in PROMPT_TEMPLATES.items():
    prompt = PromptTemplate(
        template=template,
        input_variables=["context", "question", "history"]
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
async def chat_endpoint(
    request: Request, 
    chat_request: ChatRequest
):
    """Chat endpoint with RAG-enhanced responses and conversation memory"""
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
        
        # Handle session management
        session_id = chat_request.session_id or str(uuid.uuid4())
        user_context = ""
        
        # Initialize session if new
        if session_id not in session_storage:
            session_storage[session_id] = []
        
        # Build conversation history
        history_text = ""
        if session_storage[session_id]:
            history_text += "Previous conversation:\n"
            for exchange in session_storage[session_id][-3:]:  # Last 3 exchanges
                history_text += f"Q: {exchange['question']}\nA: {exchange['answer']}\n"
            history_text += "\n"
        
        logger.info(f"Chat request: {sanitized_message[:50]}... | Language: {chat_request.language} | Session: {session_id[:8]}...")
        
        # Get QA chain for selected language  
        qa_chain = qa_chains.get(chat_request.language, qa_chains["English"])
        
        # Get relevant documents from vector store
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        relevant_docs = retriever.get_relevant_documents(sanitized_message)
        context = "\n".join([doc.page_content for doc in relevant_docs])
        
        # Format prompt with history and context
        prompt_template = PROMPT_TEMPLATES[chat_request.language]
        formatted_prompt = prompt_template.format(
            context=context,
            question=sanitized_message,
            history=history_text
        )
        
        # Generate response
        response_text = llm(formatted_prompt)
        
        # Enhance response if needed
        enhanced_response = enhance_biofertilizer_response(response_text, chat_request.language)
        
        # Store conversation in session
        session_storage[session_id].append({
            "question": sanitized_message,
            "answer": enhanced_response
        })
        
        # Keep only last 10 exchanges per session to prevent memory bloat
        if len(session_storage[session_id]) > 10:
            session_storage[session_id] = session_storage[session_id][-10:]
        
        logger.info(f"Response generated successfully (length: {len(enhanced_response)})")
        
        return ChatResponse(response=enhanced_response, session_id=session_id)
    
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
