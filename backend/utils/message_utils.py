from langchain_core.messages import BaseMessage


def get_latest_message(
    messages: list[BaseMessage],
    message_type: type[BaseMessage],
) -> BaseMessage:
    """
    Returns the latest message of the given type.

    Raises:
        ValueError: If no message of the requested type exists.
    """
    for message in reversed(messages):
        if isinstance(message, message_type):
            return message

    raise ValueError(
        f"No {message_type.__name__} found."
    )


def get_recent_messages(
    messages: list[BaseMessage],
    limit: int,
) -> list[BaseMessage]:
    """
    Returns the last `limit` messages from the conversation.

    Args:
        messages: Complete conversation history.
        limit: Number of most recent messages to return.

    Returns:
        List of recent messages.
    """
    if limit <= 0:
        raise ValueError("limit must be greater than 0.")

    return messages[-limit:]