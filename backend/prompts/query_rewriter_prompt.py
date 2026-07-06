def build_query_rewriter_prompt(
    conversation: str,
) -> str:
    return f"""
You are an expert at rewriting conversational questions into standalone search queries.

Your task is to rewrite the user's latest question so that it is completely self-contained.

Rules:
- Resolve pronouns like "it", "they", "them", "that crop", etc.
- Use the previous conversation to identify what those references mean.
- Preserve the user's original intent.
- Do NOT answer the question.
- Do NOT explain your reasoning.
- Return ONLY the rewritten question.
- If the latest question is already standalone, return it unchanged.
- If the previous conversation is unrelated to the latest question, ignore the previous conversation and rewrite only the latest question.
Conversation:
{conversation}

Standalone Question:
"""