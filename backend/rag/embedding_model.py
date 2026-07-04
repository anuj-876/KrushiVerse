from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings

from backend.config.settings import HF_TOKEN


@lru_cache(maxsize=1)
def get_embedding_model() -> HuggingFaceEmbeddings:
    model_kwargs = {}
    if HF_TOKEN:
        model_kwargs["token"] = HF_TOKEN

    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs=model_kwargs,
    )