from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    language: str
    thread_id: str
    user_id: str

class ChatResponse(BaseModel):
    status: str
    answer: str
    thread_id : str