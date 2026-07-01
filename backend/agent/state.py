from typing import TypedDict

class AgentState(TypedDict):
    question: str
    thread_id: str
    user_id: str
    messages: list
    answer: str