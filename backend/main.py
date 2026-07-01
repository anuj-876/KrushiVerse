from fastapi import FastAPI
from api.chat import ChatRequest, ChatResponse
from langchain_core.messages import HumanMessage
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
        "messages": [
            HumanMessage(content=request.question)
        ],
    }
    config = {
        "configurable":{
            "thread_id": request.thread_id
        }
    }

    result = graph.invoke(
        state,
        config=config
        )

    response = ChatResponse(
        status="success",
        answer=result["messages"][-1].content,
        thread_id=request.thread_id
    )

    print(response.answer)
    return response