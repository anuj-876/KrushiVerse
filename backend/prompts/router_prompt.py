from backend.agent.routes import Route


def build_router_prompt(question: str, routes: type[Route]) -> str:
    available_routes = "\n".join(
        route.value for route in routes
    )
    return f"""
You are an intent classifier.
Your task is to decide which route should handle the user's request.
Available Routes:
{available_routes}

Rules:
1. Greetings, introductions, thanks, casual conversation,
   or questions about yourself → chatbot
2. Questions related to farming, agriculture, crops,
   cultivation, irrigation, fertilizers, pests,
   diseases, soil, harvesting or anything that requires
   agricultural knowledge → rag

Return ONLY one route name.
Do not explain your answer.
Question:
{question}
Route:
"""