from fastapi import FastAPI
from api.chat import ChatRequest, ChatResponse
from agent.graph_builder import graph

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
    
    state = {
        "question": request.question,
        "thread_id": request.thread_id,
        "user_id": request.user_id,
        "messages": [],
        "answer": ""
    }
    result = graph.invoke(state)

    response = ChatResponse(
        status="success",
        answer= result["answer"],
        thread_id= result["thread_id"]
    )
    print(response.answer)
    return response