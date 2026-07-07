from langgraph.graph import (StateGraph, START, END)
from langgraph.checkpoint.memory import MemorySaver
from agent.state import AgentState
from agent.nodes.chatbot import chatbot_node
from agent.nodes.rag import rag_node
from agent.nodes.router import router_node
# from agent.routes import Route
from agent.nodes.calculator import calculator_node


builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot_node)
builder.add_node("rag", rag_node)
builder.add_node("router", router_node)
builder.add_node("calculator", calculator_node)


builder.add_edge(START, "router")

ROUTE_TO_NODE_MAPPING = {
    "chatbot": "chatbot",
    "rag": "rag",
    "calculator": "calculator",
}

def route_selector(state):
    return state["route"]

builder.add_conditional_edges(
    "router",
    route_selector,
    ROUTE_TO_NODE_MAPPING)
builder.add_edge("chatbot", END)
builder.add_edge("rag", END)
builder.add_edge("calculator", END)

checkpointer = MemorySaver()
graph = builder.compile(
    checkpointer=checkpointer
)