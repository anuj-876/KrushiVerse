from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader

from .hash_utils import calculate_file_hash
from .vector_store import (
    get_file_hash,
    delete_document,
    get_vector_store
)
from .splitter import get_text_splitter

ROOT_DIR = Path(__file__).resolve().parents[2]
PDF_DIRECTORY = ROOT_DIR / "knowledge_base" / "raw"


def ingest():

    vector_store = get_vector_store()
    splitter = get_text_splitter()
    for pdf_file in PDF_DIRECTORY.rglob("*.pdf"):
        source = pdf_file.relative_to(ROOT_DIR).as_posix()

        try:
            print(f"Processing {pdf_file.name}")
            file_hash = calculate_file_hash(pdf_file)
            stored_hash = get_file_hash(source)

            if stored_hash == file_hash:
                print("Already indexed. Skipping.")
                continue

            loader = PyPDFLoader(str(pdf_file))
            documents = loader.load()
            print(f"Pages: {len(documents)}") #
            print(f"Length of first page: {len(documents[0].page_content)}")
            chunks = splitter.split_documents(documents)
            print(f"Chunks: {len(chunks)}") #
            non_empty_chunks = [ #
            chunk for chunk in chunks     #
            if chunk.page_content.strip()  #
            ]        #

            print(f"Non Empty Chunks: {len(non_empty_chunks)}")  #

            for chunk in chunks:
                chunk.metadata["source"] = source
                chunk.metadata["file_hash"] = file_hash

            delete_document(source)
            vector_store.add_documents(chunks)

            print(f"Indexed {len(chunks)} chunks from {pdf_file.name}")
        except Exception as exc:
            print(f"Failed to process {pdf_file.name}: {exc}")
            continue