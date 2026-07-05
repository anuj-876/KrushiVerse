from langchain_core.messages import AIMessage

from model.groq_client import llm
from rag.retriever import get_retriever
from rag.formatter import format_documents
from prompts.rag_prompt import build_rag_prompt
from utils.message_utils import get_recent_messages
from utils.message_formatter import format_messages


def rag_node(state):
    # Step 1: Get retriever
    retriever = get_retriever()

    # Step 2: Get recent conversation
    recent_messages = get_recent_messages(
        state["messages"],
        limit=4
    )

    # Step 3: Convert conversation into text
    conversation = format_messages(
        recent_messages
    )

    # Step 4: Retrieve relevant documents
    documents = retriever.invoke(
        conversation
    )

    # Step 5: Handle no retrieval results
    if not documents:
        return {
            "messages": [
                AIMessage(
                    content=(
                        "I don't have enough information in my "
                        "knowledge base to answer that question."
                    )
                )
            ]
        }

    # Step 6: Format retrieved documents
    context = format_documents(
        documents
    )

    # Step 7: Build RAG prompt
    prompt = build_rag_prompt(
        conversation=conversation,
        context=context
    )

    # Step 8: Generate response
    response = llm.invoke(prompt)

    # Step 9: Return updated state
    return {
        "messages": [response]
    }