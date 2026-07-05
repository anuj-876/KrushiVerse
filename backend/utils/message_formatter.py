from langchain_core.messages import (
    BaseMessage,
    HumanMessage,
    AIMessage,
    SystemMessage
)

def format_messages(
        messages: list[BaseMessage],
) -> str:
    formatted_messages =[]
    for message in messages:
        if isinstance(message, HumanMessage):
            role = "Human"
        elif isinstance(message, AIMessage):
            role = "Assistant"
        elif isinstance(message, SystemMessage):
            role = "System"
        else:
            role = "Unknown"
        formatted_messages.append(
            f"{role}: \n{message.content}"
        )
        return "\n\n".join(formatted_messages)