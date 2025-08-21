#!/usr/bin/env python3
"""
Debug script to test demo user and RAG service functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.firestore_service import firestore_service
from app.services.rag_coaching import rag_coaching_service

def debug_demo_issue():
    """Debug the demo user and RAG service issue"""
    
    print("🔍 Debugging demo user and RAG service issue...")
    
    # 1. Check if demo user exists
    print("\n1. Checking demo user...")
    demo_email = "demo@example.com"
    user_result = firestore_service.get_user_by_email(demo_email)
    print(f"Demo user result: {user_result}")
    
    if not user_result.get("success"):
        print("❌ Failed to get demo user")
        return False
    
    if not user_result.get("user"):
        print("❌ Demo user not found")
        return False
    
    user_id = user_result["user"]["id"]
    print(f"✅ Demo user found: {user_id}")
    
    # 2. Check existing diary entries
    print("\n2. Checking existing diary entries...")
    entries_result = firestore_service.get_diary_entries(user_id, limit=5)
    print(f"Entries result: {entries_result}")
    
    if entries_result.get("success"):
        print(f"Found {entries_result.get('count', 0)} entries")
        for entry in entries_result.get("entries", []):
            print(f"  - {entry.get('title', 'No title')} (ID: {entry.get('id', 'No ID')})")
    
    # 3. Test RAG service
    print("\n3. Testing RAG service...")
    try:
        rag_result = rag_coaching_service.add_diary_entry(
            content="Test content for debugging",
            emotion="happy",
            date="2024-01-01",
            location="Test location",
            tags=["test", "debug"],
            user_id=user_id
        )
        print(f"RAG add result: {rag_result}")
    except Exception as e:
        print(f"❌ RAG service error: {e}")
        import traceback
        traceback.print_exc()
    
    # 4. Test RAG query
    print("\n4. Testing RAG query...")
    try:
        query_result = rag_coaching_service.query_diary(
            question="What did I do today?",
            user_id=user_id
        )
        print(f"RAG query result: {query_result}")
    except Exception as e:
        print(f"❌ RAG query error: {e}")
        import traceback
        traceback.print_exc()
    
    # 5. Test creating a new diary entry through the normal flow
    print("\n5. Testing diary entry creation...")
    try:
        entry_data = {
            "title": "Debug Test Entry",
            "content": "This is a test entry created for debugging purposes.",
            "location": "Debug Location",
            "mood": "Debug"
        }
        
        create_result = firestore_service.create_diary_entry(user_id, entry_data)
        print(f"Create result: {create_result}")
        
        if create_result.get("success"):
            entry_id = create_result.get("entry_id")
            print(f"✅ Created entry with ID: {entry_id}")
            
            # Now manually add to RAG
            print("\n6. Manually adding to RAG...")
            rag_add_result = rag_coaching_service.add_diary_entry(
                content=entry_data["content"],
                emotion=entry_data["mood"],
                date="2024-01-01",
                location=entry_data["location"],
                tags=[],
                user_id=user_id
            )
            print(f"Manual RAG add result: {rag_add_result}")
            
    except Exception as e:
        print(f"❌ Diary creation error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n🔍 Debug completed!")

if __name__ == "__main__":
    debug_demo_issue()
