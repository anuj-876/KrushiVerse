from typing import (TypedDict,Annotated)
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage
from agent.routes import Route

class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]   
    route: Route | None