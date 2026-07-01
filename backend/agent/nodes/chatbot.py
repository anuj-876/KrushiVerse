from langchain_core.messages import SystemMessage
from prompts.chatbot import get_chatbot_prompt
from model.groq_client import llm

def chatbot_node(state):
    messages = [
        SystemMessage(content=get_chatbot_prompt()),
        *state["messages"]
    ]
    response = llm.invoke(messages)
    
    return {"messages": [response]}
    