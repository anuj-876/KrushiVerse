from langchain_core.messages import HumanMessage

from agent.routes import Route
from model.groq_client import llm
from prompts.router_prompt import build_router_prompt
from utils.message_utils import get_latest_message


def router_node(state):

    # Step 1: Extract latest user question
    question = get_latest_message(
        state["messages"],
        HumanMessage
    ).content

    # Step 2: Build router prompt
    prompt = build_router_prompt(
        question=question,
        routes=Route
    )

    # Step 3: Ask the LLM
    response = llm.invoke(prompt)

    # Step 4: Normalize output
    route = (
        response.content
        .strip()
        .lower()
        .rstrip(".")
    )

    # Step 5: Validate
    try:
        validated_route = Route(route)
    except ValueError:
        raise ValueError(
            f"Invalid route returned by LLM: {route}"
        )

    # Step 6: Return state update
    return {
        "route": validated_route
    }