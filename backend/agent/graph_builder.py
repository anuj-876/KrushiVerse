from langgraph.graph import (StateGraph, START, END)
from agent.state import AgentState
from agent.nodes.chatbot import chatbot_node

builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot_node)

builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)

graph = builder.compile()