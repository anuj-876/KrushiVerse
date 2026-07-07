from fastapi import FastAPI
from api.chat import ChatRequest, ChatResponse
from langchain_core.messages import (HumanMessage,AIMessage)
from agent.graph_builder import graph
from utils.message_utils import get_latest_message

app = FastAPI()

@app.get('/health')
def health_check():
    return {
        "status": "healthy",
        "service": "KrushiVerse API",
        "version": "1.0.0"
    }

@app.post('/chat')
async def chat(request: ChatRequest) -> ChatResponse:
    print(request.model_dump())
    
    state = {
        "messages": [
            HumanMessage(content=request.question)
        ],
        "route": None
    }
    config = {
        "configurable":{
            "thread_id": request.thread_id,
            "user_id": request.user_id
        }
    }

    final_state = graph.invoke(
        state,
        config=config
        )

    response = get_latest_message(
        final_state["messages"],
        AIMessage
    )
    print(response.content)
    
    return ChatResponse(
    status="success",
    answer=response.content,
    thread_id=request.thread_id
    )