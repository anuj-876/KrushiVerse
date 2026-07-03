from langgraph.graph import (StateGraph, START, END)
from langgraph.checkpoint.memory import MemorySaver
from agent.state import AgentState
from agent.nodes.chatbot import chatbot_node
from agent.nodes.rag import rag_node

builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot_node)
builder.add_node("rag", rag_node)

builder.add_edge(START, "rag")
builder.add_edge("rag", END)

memory = MemorySaver()
graph = builder.compile(
    checkpointer=memory
)