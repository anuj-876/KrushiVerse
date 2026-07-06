from model.groq_client import llm
from prompts.query_rewriter_prompt import build_query_rewriter_prompt


def rewrite_query(
        conversation: str
    ) -> str:
    prompt = build_query_rewriter_prompt(
        conversation=conversation
    )
    try:
        response = llm.invoke(prompt)
        rewritten_query = response.content.strip()

        #testing
        # print("=" * 60)
        # print("Conversation")
        # print(conversation)

        # print("=" * 60)
        # print("Rewritten Query")
        # print(rewritten_query)
        # print("=" * 60)

        if not rewritten_query:
            return conversation
        return rewritten_query
    except Exception:
        return conversation