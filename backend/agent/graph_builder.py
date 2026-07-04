from langgraph.graph import (StateGraph, START, END)
from langgraph.checkpoint.memory import MemorySaver
from agent.state import AgentState
from agent.nodes.chatbot import chatbot_node
from agent.nodes.rag import rag_node
from agent.nodes.router import router_node
from agent.routes import Route


builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot_node)
builder.add_node("rag", rag_node)
builder.add_node("router", router_node)


builder.add_edge(START, "router")

ROUTE_MAPPING = {
    Route.CHATBOT: "chatbot",
    Route.RAG: "rag"
}
builder.add_conditional_edges(
    "router",
    lambda state: state["route"],
    ROUTE_MAPPING)
builder.add_edge("rag", END)

memory = MemorySaver()
graph = builder.compile(
    checkpointer=memory
)