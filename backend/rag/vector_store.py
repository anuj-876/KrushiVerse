from pathlib import Path
from langchain_chroma import Chroma
from .embedding_model import get_embedding_model
from functools import lru_cache

# Project Directories
ROOT_DIR = Path(__file__).resolve().parents[2]
CHROMA_DB_DIR = ROOT_DIR / "chroma_db"

@lru_cache(maxsize=1)
def get_vector_store() -> Chroma:
    """
    Returns a configured Chroma vector store.
    """

    embeddings = get_embedding_model()

    return Chroma(
        persist_directory=CHROMA_DB_DIR.as_posix(),
        embedding_function=embeddings,
    )


def get_file_hash(source: str) -> str | None:
    """
    Returns the stored hash of a document.
    Returns None if the document has never been indexed.
    """

    vector_store = get_vector_store()

    result = vector_store.get(
        where={"source": source},
        include=["metadatas"]
    )

    if not result["ids"]:
        return None

    return result["metadatas"][0]["file_hash"]


def delete_document(source: str) -> None:
    """
    Deletes all chunks belonging to a document.
    """

    vector_store = get_vector_store()

    vector_store.delete(
        where={"source": source}
    )