#!/usr/bin/env python3
"""
Utility script to clear all diary entries for testing purposes.
This script will clear all diary entries from the database.
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.firestore_service import firestore_service

async def clear_all_entries():
    """Clear all diary entries from the database"""
    try:
        print("🔍 Connecting to Firestore...")
        
        # Test connection
        test_result = firestore_service.test_connection()
        if not test_result.get("success"):
            print(f"❌ Failed to connect to Firestore: {test_result.get('error')}")
            return
        
        print("✅ Connected to Firestore successfully")
        
        # Get all diary entries
        print("🔍 Fetching all diary entries...")
        
        # We need to get all entries without user filter first
        try:
            entries_ref = firestore_service.db.collection('diary_entries')
            docs = list(entries_ref.stream())
            
            if not docs:
                print("✅ No diary entries found in the database")
                return
            
            print(f"📝 Found {len(docs)} diary entries")
            
            # Confirm deletion
            response = input(f"⚠️  Are you sure you want to delete ALL {len(docs)} diary entries? (yes/no): ")
            if response.lower() != 'yes':
                print("❌ Operation cancelled")
                return
            
            # Delete all entries
            deleted_count = 0
            for doc in docs:
                doc.reference.delete()
                deleted_count += 1
                print(f"🗑️  Deleted entry: {doc.id}")
            
            print(f"✅ Successfully deleted {deleted_count} diary entries")
            
        except Exception as e:
            print(f"❌ Error fetching entries: {str(e)}")
            return
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    """Main function"""
    print("🧹 Diary Entries Cleanup Utility")
    print("=" * 40)
    
    # Load environment variables
    load_dotenv()
    
    # Run the async function
    asyncio.run(clear_all_entries())

if __name__ == "__main__":
    main()
