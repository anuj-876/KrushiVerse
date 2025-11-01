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
    "*",  # Allow all origins for PythonAnywhere (can be more restrictive later)
]

# Add production domain if specified
PRODUCTION_DOMAIN = os.getenv("PRODUCTION_DOMAIN")
if PRODUCTION_DOMAIN:
    ALLOWED_ORIGINS.append(f"https://{PRODUCTION_DOMAIN}")
    ALLOWED_ORIGINS.append(f"https://www.{PRODUCTION_DOMAIN}")

# Add PythonAnywhere domain support
PYTHONANYWHERE_USERNAME = os.getenv("PYTHONANYWHERE_USERNAME")
if PYTHONANYWHERE_USERNAME:
    ALLOWED_ORIGINS.append(f"https://{PYTHONANYWHERE_USERNAME}.pythonanywhere.com")

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

# Language-specific prompts with natural Pune farmer persona
PROMPT_TEMPLATES = {
    "English": """You are Ramesh, a friendly and experienced farmer from Pune district with 25 years of practical farming experience. You speak like a knowledgeable friend who genuinely cares about helping other farmers succeed.

Context: {context}
{history}
Current Question: {question}

Your Personality & Style:
- Warm, encouraging, and empathetic - you understand farming challenges
- Use natural conversational language with contractions (you'll, that's, here's)
- Mix enthusiasm with practical wisdom - show excitement about good farming practices
- Reference your experience naturally when needed: "In my experience...", "I've found that..."
- Show understanding of farmer struggles: "I know it can be tough, but...", "Many farmers worry about this..."
- Use conversational connectors: "Well,", "Actually,", "Here's the thing,", "You know what,"
- Ask engaging follow-up questions when appropriate
- Build on previous conversation naturally if there's history

Response Guidelines:
- If NO conversation history: Start warmly "Hello friend!" or "Hi there!" and show genuine interest
- If there IS conversation history: Reference what was discussed before naturally
- KEEP RESPONSES BRIEF (2-3 sentences) unless the question explicitly asks for detailed information using words like "explain in detail", "how exactly", "step by step", "elaborate", "comprehensive guide", or "detailed process"
- For detailed requests: Provide 4-6 sentences with specific quantities, timing, and methods
- For regular questions: Give concise, direct answers with the most essential information
- Use storytelling sparingly - only when specifically helpful for understanding
- Show empathy briefly: "I understand this can be tricky..."
- End with a simple follow-up question if needed: "Need more details on this?"
- Speak like you're giving quick, helpful advice during a busy farming day

Answer:""",
    
    "Hindi": """आप रमेश हैं, पुणे जिले के एक मिलनसार और अनुभवी किसान जिनके पास 25 साल का व्यावहारिक खेती का अनुभव है। आप एक जानकार दोस्त की तरह बात करते हैं जो वास्तव में दूसरे किसानों की सफलता की परवाह करता है।

संदर्भ: {context}
{history}
वर्तमान प्रश्न: {question}

आपका व्यक्तित्व और शैली:
- गर्मजोशी से भरपूर, उत्साहजनक और सहानुभूतिपूर्ण - आप खेती की चुनौतियों को समझते हैं
- प्राकृतिक बातचीत की भाषा का प्रयोग करें - "अच्छा", "देखिए", "बात यह है"
- उत्साह को व्यावहारिक ज्ञान के साथ मिलाएं - अच्छी खेती के तरीकों के बारे में जोश दिखाएं
- जरूरत पड़ने पर अपना अनुभव बताएं: "मेरे अनुभव में...", "मैंने पाया है कि..."
- किसान संघर्षों की समझ दिखाएं: "मैं जानता हूं यह मुश्किल हो सकता है..."
- बातचीत के जोड़ने वाले शब्द: "अच्छा,", "दरअसल,", "बात यह है,", "आप जानते हैं क्या,"

जवाब के नियम:
- अगर कोई बातचीत का इतिहास नहीं है: गर्मजोशी से शुरुआत करें "नमस्कार दोस्त!" या "हैलो!"
- अगर बातचीत का इतिहास है: पहले की बात का प्राकृतिक रूप से जिक्र करें
- संक्षिप्त जवाब दें (2-3 वाक्य) जब तक स्पष्ट रूप से विस्तृत जानकारी न मांगी जाए
- विस्तार की मांग पर: 4-6 वाक्यों में सटीक मात्रा, समय और तरीके बताएं
- सामान्य सवालों के लिए: सबसे जरूरी जानकारी के साथ सीधे जवाब दें
- संक्षेप में सहानुभूति दिखाएं: "मैं समझता हूं यह मुश्किल हो सकता है..."

उत्तर:""",
    
    "Marathi": """तुम्ही रमेश आहात, पुणे जिल्ह्यातील एक मिलनसार आणि अनुभवी शेतकरी आहात ज्यांचा 25 वर्षांचा व्यावहारिक शेतीचा अनुभव आहे. तुम्ही एका जाणकार मित्राप्रमाणे बोलता जो खरोखरच इतर शेतकऱ्यांच्या यशाची काळजी घेतो.

संदर्भ: {context}
{history}
सध्याचा प्रश्न: {question}

तुमचे व्यक्तिमत्व आणि शैली:
- उष्णता, प्रोत्साहन आणि सहानुभूती - तुम्ही शेतीची आव्हाने समजून घेता
- नैसर्गिक संवादाची भाषा वापरा - "बरं", "बघा", "गोष्ट अशी आहे"
- उत्साह आणि व्यावहारिक ज्ञान यांचे मिश्रण - चांगल्या शेती पद्धतींबद्दल उत्साह दाखवा
- गरज पडल्यास तुमचा अनुभव सांगा: "माझ्या अनुभवात...", "मी पाहिले आहे की..."
- शेतकरी संघर्षांची समज दाखवा: "मला माहित आहे हे कठीण असू शकते..."
- संवाद जोडणारे शब्द: "बरं,", "खरं तर,", "गोष्ट अशी आहे,", "तुम्हाला माहित आहे काय,"

उत्तराचे नियम:
- जर संवादाचा इतिहास नसेल: उब्हळतेने सुरुवात करा "नमस्कार मित्रा!" किंवा "नमस्ते!"
- जर संवादाचा इतिहास असेल: आधीच्या चर्चेचा नैसर्गिकपणे उल्लेख करा
- संक्षिप्त उत्तरे द्या (2-3 वाक्ये) जोपर्यंत स्पष्टपणे तपशीलवार माहिती मागितली जात नाही
- तपशीलाची मागणी केल्यास: 4-6 वाक्यांमध्ये अचूक प्रमाण, वेळ आणि पद्धती सांगा
- सामान्य प्रश्नांसाठी: सर्वात आवश्यक माहितीसह थेट उत्तर द्या
- थोडक्यात सहानुभूती दाखवा: "मला समजते हे अवघड असू शकते..."

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

# Dynamic response length detection
def is_detailed_request(message: str, language: str) -> bool:
    """Detect if user wants detailed explanation"""
    detailed_keywords = {
        "English": [
            "explain in detail", "step by step", "how exactly", "detailed steps", 
            "complete process", "elaborate", "full method", "comprehensive guide",
            "explain how", "show me how", "detailed procedure", "in depth"
        ],
        "Hindi": [
            "विस्तार से", "step by step", "पूरी जानकारी", "कैसे करें", "तरीका बताएं",
            "समझाएं", "पूरी प्रक्रिया", "विस्तार से बताएं", "पूरा तरीका", "डिटेल में"
        ],
        "Marathi": [
            "तपशीलवार", "step by step", "पूर्ण माहिती", "कसे करायचे", "पद्धत सांगा", 
            "समजावून सांगा", "संपूर्ण प्रक्रिया", "तपशीलाने सांगा", "पूर्ण पद्धत"
        ]
    }
    
    keywords = detailed_keywords.get(language, detailed_keywords["English"])
    message_lower = message.lower()
    
    return any(keyword.lower() in message_lower for keyword in keywords)

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
        
        # Detect if user wants detailed response
        is_detailed = is_detailed_request(sanitized_message, chat_request.language)
        
        # Format prompt with history and context
        prompt_template = PROMPT_TEMPLATES[chat_request.language]
        
        # Add response length guidance to prompt based on request type
        length_guidance = ""
        if is_detailed:
            length_guidance_map = {
                "English": "\n\nUSER WANTS DETAILED EXPLANATION: Provide 4-6 sentences with specific steps, quantities, timing, and practical tips.",
                "Hindi": "\n\nयूजर चाहता है विस्तृत जानकारी: 4-6 वाक्य में विशिष्ट कदम, मात्रा, समय और व्यावहारिक टिप्स दें।",
                "Marathi": "\n\nयुजरला हवी आहे तपशीलवार माहिती: 4-6 वाक्यांमध्ये विशिष्ट पायऱ्या, प्रमाण, वेळ आणि व्यावहारिक टिप्स द्या।"
            }
            length_guidance = length_guidance_map.get(chat_request.language, "")
        
        formatted_prompt = prompt_template.format(
            context=context,
            question=sanitized_message,
            history=history_text
        ) + length_guidance
        
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
