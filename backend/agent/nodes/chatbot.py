from model.groq_client import llm
def chatbot_node(state):
    response = llm.invoke(
        state["messages"]
    )
    return {"messages": [response]}
    