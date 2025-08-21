#!/usr/bin/env python3
"""
Script to fix RAG demo data and ensure new entries are properly added
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.firestore_service import firestore_service
from app.services.rag_coaching import rag_coaching_service
from datetime import datetime, timezone, timedelta

def fix_rag_demo_data():
    """Fix RAG demo data and ensure proper functionality"""
    
    print("🔧 Fixing RAG demo data...")
    
    # 1. Get demo user
    demo_email = "demo@example.com"
    user_result = firestore_service.get_user_by_email(demo_email)
    
    if not user_result.get("success") or not user_result.get("user"):
        print("❌ Demo user not found")
        return False
    
    user_id = user_result["user"]["id"]
    print(f"✅ Demo user found: {user_id}")
    
    # 2. Clear existing RAG data for demo user
    print("\n🧹 Clearing existing RAG data for demo user...")
    try:
        # Get all entries for demo user from RAG
        rag_entries = rag_coaching_service.collection.get(
            where={"user_id": user_id}
        )
        
        if rag_entries['ids']:
            print(f"Found {len(rag_entries['ids'])} existing RAG entries, removing...")
            rag_coaching_service.collection.delete(ids=rag_entries['ids'])
            print("✅ Cleared existing RAG entries")
        else:
            print("No existing RAG entries found")
    except Exception as e:
        print(f"⚠️ Error clearing RAG data: {e}")
    
    # 3. Get all diary entries from Firestore
    print("\n📝 Getting all diary entries from Firestore...")
    entries_result = firestore_service.get_diary_entries(user_id, limit=100)
    
    if not entries_result.get("success"):
        print("❌ Failed to get diary entries")
        return False
    
    entries = entries_result.get("entries", [])
    print(f"Found {len(entries)} diary entries in Firestore")
    
    # 4. Add all diary entries to RAG
    print("\n🔄 Adding all diary entries to RAG...")
    added_count = 0
    
    for entry in entries:
        try:
            # Extract date from created_at
            created_at = entry.get("created_at")
            if hasattr(created_at, 'strftime'):
                date_str = created_at.strftime('%Y-%m-%d')
            else:
                date_str = datetime.now().strftime('%Y-%m-%d')
            
            rag_result = rag_coaching_service.add_diary_entry(
                content=entry.get("content", ""),
                emotion=entry.get("mood", "neutral"),
                date=date_str,
                location=entry.get("location", ""),
                tags=[],
                entry_id=entry.get("id"),  # Use Firestore ID as RAG ID
                user_id=user_id
            )
            
            if rag_result.get("success"):
                added_count += 1
                print(f"  ✅ Added: {entry.get('title', 'No title')}")
            else:
                print(f"  ❌ Failed: {entry.get('title', 'No title')} - {rag_result.get('error')}")
                
        except Exception as e:
            print(f"  ❌ Error adding entry: {e}")
    
    print(f"\n🎉 RAG fix completed!")
    print(f"✅ Added {added_count}/{len(entries)} entries to RAG")
    
    # 5. Test RAG query
    print("\n🧪 Testing RAG query...")
    try:
        query_result = rag_coaching_service.query_diary(
            question="What did I do today?",
            user_id=user_id,
            top_k=5
        )
        
        if query_result.get("success"):
            results = query_result.get("results", [])
            print(f"✅ RAG query successful, found {len(results)} results:")
            for i, result in enumerate(results[:3], 1):
                content = result.get("content", "")[:100] + "..." if len(result.get("content", "")) > 100 else result.get("content", "")
                print(f"  {i}. {content}")
        else:
            print(f"❌ RAG query failed: {query_result.get('error')}")
            
    except Exception as e:
        print(f"❌ RAG query error: {e}")
    
    return True

if __name__ == "__main__":
    fix_rag_demo_data()
