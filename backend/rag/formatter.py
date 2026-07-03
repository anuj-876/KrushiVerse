from langchain_core.documents import Document


def format_documents(documents: list[Document]) -> str:
	context = [
		document.page_content.strip()
		for document in documents
		if document.page_content and document.page_content.strip()
	]
	joined_context = "\n\n".join(context)
	return f"""Context:
    {joined_context}
    """
