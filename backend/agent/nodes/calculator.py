from langchain_core.messages import AIMessage

from model.groq_client import llm
from prompts.calculator_prompt import calculator_prompt
from tools.calculator import calculate
from utils.message_formatter import format_messages
from utils.message_utils import get_recent_messages


def calculator_node(state):
    # Step 1: Get recent conversation
    recent_messages = get_recent_messages(
        state["messages"],
        limit = 1
    )

    # Step 2: Convert conversation into text
    conversation = format_messages(
        recent_messages
    )

    # Step 3: Build calculator prompt
    prompt = calculator_prompt(
        conversation=conversation
    )

    # Step 4: Extract mathematical expression
    expression = llm.invoke(
        prompt
    ).content.strip()

    # Step 5: Handle non-calculation queries
    if expression == "INVALID":
        return {
            "messages": [
                AIMessage(
                    content=(
                        "I couldn't identify a mathematical "
                        "calculation in your request."
                    )
                )
            ]
        }

    print("=" * 50)
    print("Expression from LLM:")
    print(repr(expression))
    print("=" * 50)

    # Step 6: Evaluate expression
    try:
        result = calculate(
            expression
        )

    except ValueError:
        return {
            "messages": [
                AIMessage(
                    content=(
                        "I couldn't evaluate the mathematical "
                        "expression."
                    )
                )
            ]
        }

    # Step 7: Return updated state
    return {
        "messages": [
            AIMessage(
                content=result
            )
        ]
    }