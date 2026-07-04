from langchain_core.messages import BaseMessage, HumanMessage


def get_latest_message(
    messages: list[BaseMessage],
    message_type: type[BaseMessage],
) -> BaseMessage:

    for message in reversed(messages):
        if isinstance(message, message_type):
            return message

    raise ValueError(
        f"No {message_type.__name__} found."
    )