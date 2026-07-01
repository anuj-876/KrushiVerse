from fastapi import FastAPI
from api.chat import ChatRequest, ChatResponse

app = FastAPI()

@app.get('/health')
def health_check():
    return {
        "status": "healthy",
        "service": "KrushiVerse API",
        "version": "1.0.0"
    }

@app.post('/chat')
def chat(request: ChatRequest) -> ChatResponse:
    print(request.model_dump())
    
    response = ChatResponse(
        status="success",
        answer=request.question,
        thread_id=request.thread_id
    )
    return response