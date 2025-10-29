#!/usr/bin/env python3
"""
Test script to check RAG system functionality
"""
import os
import sys
sys.path.append('.')

from api_server import init_vectorstore, init_rag_chain_with_language

print("Testing RAG system components...")

try:
    print("1. Testing vectorstore initialization...")
    vectordb = init_vectorstore()
    print("✅ Vectorstore initialized successfully")
    
    print("2. Testing retriever...")
    retriever = vectordb.as_retriever(search_kwargs={"k": 3})
    print("✅ Retriever created successfully")
    
    print("3. Testing retrieval...")
    docs = retriever.get_relevant_documents("bio fertilizers")
    print(f"✅ Retrieved {len(docs)} documents")
    if docs:
        print(f"First document preview: {docs[0].page_content[:200]}...")
    
    print("4. Testing RAG chain initialization...")
    chain = init_rag_chain_with_language("en")
    print("✅ RAG chain initialized successfully")
    
    if chain:
        print("5. Testing RAG chain query...")
        result = chain("what are bio fertilizers?")
        print("✅ RAG chain query successful")
        print(f"Response preview: {result.get('result', 'No result')[:200]}...")
    else:
        print("❌ RAG chain is None")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()