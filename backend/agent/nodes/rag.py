from langchain_core.messages import AIMessage, HumanMessage

from model.groq_client import llm
from rag.retriever import get_retriever
from rag.formatter import format_documents
from prompts.rag_prompt import build_rag_prompt


def rag_node(state):

    retriever = get_retriever()

    question = ""

    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            question = message.content
            break

    documents = retriever.invoke(question)

    if not documents:
        return {
            "messages": [
                AIMessage(
                    content="I don't have enough information in my knowledge base to answer that question."
                )
            ]
        }

    context = format_documents(documents)

    prompt = build_rag_prompt(
        question=question,
        context=context
    )

    response = llm.invoke(prompt)

    return {
        "messages": [response]
    }