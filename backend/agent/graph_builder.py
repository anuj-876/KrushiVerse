from langgraph.graph import (StateGraph, START, END)
from langgraph.checkpoint.memory import MemorySaver
from agent.state import AgentState
from agent.nodes.chatbot import chatbot_node

builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot_node)

builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)

memory = MemorySaver()
graph = builder.compile(
    checkpointer=memory
)