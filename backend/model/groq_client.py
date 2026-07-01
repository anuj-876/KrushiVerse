from langchain_groq import ChatGroq
from config.settings import GROQ_API_KEY

def get_llm():
    return ChatGroq(
        api_key=GROQ_API_KEY,
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=1000,
    )
llm = get_llm()

