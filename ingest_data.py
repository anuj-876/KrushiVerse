"""
ingest_data.py
Reads documents from ./data, splits into chunks, creates embeddings using
Google Generative AI embeddings (via langchain-google-genai), and stores them
in a persistent ChromaDB at ./chroma_db.

Run this once before starting the Streamlit app.
"""
import os
from pathlib import Path
import toml

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
import chromadb


def ingest(data_dir: str = "./data", persist_directory: str = "./chroma_db"):
    # Load Google API key using the same method as api_server.py
    google_api_key = os.environ.get("GOOGLE_API_KEY")
    
    # If not found in environment, try to load from .env file
    if not google_api_key:
        env_path = Path(__file__).parent / ".env"
        if env_path.exists():
            with open(env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        if key.strip() == "GOOGLE_API_KEY":
                            google_api_key = value.strip().strip('"').strip("'")
                            os.environ["GOOGLE_API_KEY"] = google_api_key
                            break
    
    # If still not found, try legacy streamlit secrets (for backward compatibility)
    if not google_api_key:
        secrets_path = Path(__file__).parents[0] / ".streamlit" / "secrets.toml"
        if secrets_path.exists():
            data = toml.loads(secrets_path.read_text())
            google_api_key = data.get("GOOGLE_API_KEY")

    if not google_api_key:
        raise ValueError(
            "GOOGLE_API_KEY not found: set GOOGLE_API_KEY environment variable or add to .env file"
        )

    # Load all .md and .txt docs from the data directory (skip CSVs to avoid long partitioning)
    docs = []
    data_path = Path(data_dir)
    if not data_path.exists():
        raise ValueError(f"Data directory {data_dir} not found")

    for path in data_path.rglob('*'):
        if path.is_file() and path.suffix.lower() in ('.md', '.txt'):
            try:
                text = path.read_text(encoding='utf-8', errors='ignore')
                docs.append(Document(page_content=text, metadata={"source": str(path.relative_to(data_path))}))
            except Exception as e:
                print(f"Error loading file {path}: {e}")
        else:
            # skip other files (csvs, binary) for now
            continue

    print(f"Loaded {len(docs)} documents from {data_dir}")

    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    documents = splitter.split_documents(docs)
    print(f"Split into {len(documents)} document chunks")

    # Initialize embeddings - try Google first, fallback to HuggingFace if quota exceeded
    embeddings = None
    
    try:
        # Try Google embeddings first
        embedding_model = os.environ.get("GOOGLE_EMBEDDING_MODEL", "models/embedding-001")
        embeddings = GoogleGenerativeAIEmbeddings(model=embedding_model, google_api_key=google_api_key)
        print("Using Google embeddings")
        
        # Test with a small batch to check if quota allows
        test_embeddings = embeddings.embed_documents(["test document"])
        print("Google embeddings working successfully")
        
    except Exception as e:
        print(f"Google embeddings failed: {e}")
        print("Falling back to HuggingFace embeddings...")
        
        # Fallback to HuggingFace embeddings
        from langchain_community.embeddings import HuggingFaceEmbeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        print("Using HuggingFace embeddings: sentence-transformers/all-MiniLM-L6-v2")

    # Create or connect to a persistent chroma client using new API
    client = chromadb.PersistentClient(path=persist_directory)

    collection_name = "pune_agriculture"
    try:
        collection = client.get_collection(collection_name)
    except Exception:
        collection = client.create_collection(name=collection_name)

    # Prepare metadata and texts
    texts = [d.page_content for d in documents]
    metadatas = [
        {"source": getattr(d, 'metadata', {}).get('source', 'unknown')} for d in documents
    ]

    # Create embeddings and add to collection in batches
    BATCH = 64
    for i in range(0, len(texts), BATCH):
        batch_texts = texts[i : i + BATCH]
        batch_metadatas = metadatas[i : i + BATCH]
        ids = [f"doc_{i + j}" for j in range(len(batch_texts))]
        # compute embeddings
        embs = embeddings.embed_documents(batch_texts)
        # add to chroma
        collection.add(ids=ids, documents=batch_texts, metadatas=batch_metadatas, embeddings=embs)
        print(f"Added batch {i}//{len(texts)} to collection")

    # Data is automatically persisted with PersistentClient
    print("Data ingestion complete.")


if __name__ == "__main__":
    data_dir = os.environ.get("DATA_DIR", "./data")
    persist_dir = os.environ.get("CHROMA_DB_DIR", "./chroma_db")
    ingest(data_dir, persist_dir)
