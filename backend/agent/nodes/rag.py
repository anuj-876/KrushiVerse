from langchain_core.messages import AIMessage

from model.groq_client import llm
from rag.retriever import get_retriever
from rag.formatter import format_documents
from prompts.rag_prompt import build_rag_prompt
from utils.message_utils import get_recent_messages
from utils.message_formatter import format_messages
from agent.services.query_rewriter import rewrite_query

def rag_node(state):
    # Step 1: Get retriever
    retriever = get_retriever()

    # Step 2: Get recent conversation
    recent_messages = get_recent_messages(
        state["messages"],
        limit=4
    )

    # Step 3: Convert conversation into text
    conversation_text = format_messages(
        recent_messages
    )

    # step 4: Rewriting Standalone Query
    rewritten_query = rewrite_query(
        conversation_text
    )

    # Step 5: Retrieve relevant documents
    documents = retriever.invoke(
        rewritten_query
    )

    # Step 6: Handle no retrieval results
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

    # Step 7: Format retrieved documents
    context = format_documents(
        documents
    )

    # Step 8: Build RAG prompt
    prompt = build_rag_prompt(
        question=rewritten_query,
        context=context
    )

    # Step 9: Generate response
    response = llm.invoke(prompt)

    #testing
    # print("=" * 60)
    # print("Retrieved Documents")

    # for i, document in enumerate(documents):
    #     print(f"\nDocument {i+1}")
    #     print(document.page_content[:300])

    # print("=" * 60)

    # Step 10: Return updated state
    return {
        "messages": [response]
    }

