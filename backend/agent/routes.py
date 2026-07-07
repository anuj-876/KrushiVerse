from enum import Enum


class Route(str, Enum):
    CHATBOT = "chatbot"
    RAG = "rag"
    CALCULATOR = "calculator"