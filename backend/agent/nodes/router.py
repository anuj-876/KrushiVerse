# from langchain_core.messages import HumanMessage
from agent.routes import Route
from model.groq_client import llm
from prompts.router_prompt import build_router_prompt
from utils.message_utils import get_recent_messages
from utils.message_formatter import format_messages

def router_node(state):
    # Step 1: Get recent conversation
    recent_messages = get_recent_messages(
        state["messages"],
        limit=4
    )

    # Step 2: Convert conversation to text
    conversation = format_messages(recent_messages)

    # Step 3: Build router prompt
    prompt = build_router_prompt(
        conversation=conversation,
        routes=Route
    )

    # Step 4: Ask the LLM
    response = llm.invoke(prompt)

    # Step 5: Normalize output
    route = (
        response.content
        .strip()
        .lower()
        .rstrip(".")
    )

    # Step 6: Validate route
    try:
        validated_route = Route(route)
    except ValueError:
        valid_routes = ", ".join(
            route.value for route in Route
        )

        raise ValueError(
            f"Invalid route '{route}'. "
            f"Expected one of: {valid_routes}"
        )

    # Step 7: Return state update
    return {
        "route": validated_route.value
    }