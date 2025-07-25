import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
from typing import Optional, Dict, List, Any

class FirestoreService:
    def __init__(self):
        self.db = None
        self.init_firebase()
    
    def init_firebase(self):
        """Firebase'i başlat"""
        try:
            if not firebase_admin._apps:
                # Service account key dosyasının yolu
                cred_path = os.path.join("firebase-service-account.json")
                
                if os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                    self.db = firestore.client()
                    print("✅ Firebase Firestore initialized successfully")
                else:
                    print("❌ Firebase credentials file not found!")
                    return False
            else:
                self.db = firestore.client()
                print("✅ Firebase already initialized")
            
            return True
            
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            return False
    
    def test_connection(self):
        """Firebase bağlantısını test et"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Test collection'a basit bir dokuman ekle
            test_ref = self.db.collection('test').document('connection_test')
            test_ref.set({
                'message': 'Firebase connection test',
                'timestamp': datetime.now(timezone.utc),
                'status': 'success'
            })
            
            # Test dokuman'ı oku
            doc = test_ref.get()
            if doc.exists:
                # Test dokuman'ı sil
                test_ref.delete()
                return {
                    "success": True, 
                    "message": "Firebase connection test successful!",
                    "data": doc.to_dict()
                }
            else:
                return {"success": False, "error": "Test document not found"}
                
        except Exception as e:
            return {"success": False, "error": f"Connection test failed: {str(e)}"}
    
    # Diary CRUD operations
    def create_diary_entry(self, user_id: str, entry_data: Dict[str, Any]) -> Dict[str, Any]:
        """Günlük girişi oluştur"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Timestamp ekle
            entry_data['created_at'] = datetime.now(timezone.utc)
            entry_data['updated_at'] = datetime.now(timezone.utc)
            entry_data['user_id'] = user_id
            
            # Firestore'a ekle
            doc_ref = self.db.collection('diary_entries').document()
            doc_ref.set(entry_data)
            
            return {
                "success": True,
                "entry_id": doc_ref.id,
                "message": "Diary entry created successfully"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to create diary entry: {str(e)}"}
    
    def get_diary_entries(self, user_id: str, limit: int = 10) -> Dict[str, Any]:
        """Kullanıcının günlük girişlerini getir"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Kullanıcının günlük girişlerini getir (basitleştirilmiş query)
            entries_ref = self.db.collection('diary_entries') \
                .where('user_id', '==', user_id) \
                .limit(limit)
            
            entries = []
            for doc in entries_ref.stream():
                entry_data = doc.to_dict()
                entry_data['id'] = doc.id
                entries.append(entry_data)
            
            # Client-side sorting (en yeni önce)
            entries.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            
            return {
                "success": True,
                "entries": entries,
                "count": len(entries)
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to get diary entries: {str(e)}"}
    
    def get_diary_entry(self, entry_id: str) -> Dict[str, Any]:
        """Tekil günlük girişi getir"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            doc_ref = self.db.collection('diary_entries').document(entry_id)
            doc = doc_ref.get()
            
            if doc.exists:
                entry_data = doc.to_dict()
                entry_data['id'] = doc.id
                return {
                    "success": True,
                    "entry": entry_data
                }
            else:
                return {"success": False, "error": "Diary entry not found"}
                
        except Exception as e:
            return {"success": False, "error": f"Failed to get diary entry: {str(e)}"}
    
    def update_diary_entry(self, entry_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Günlük girişini güncelle"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Updated timestamp ekle
            update_data['updated_at'] = datetime.now(timezone.utc)
            
            doc_ref = self.db.collection('diary_entries').document(entry_id)
            doc_ref.update(update_data)
            
            return {
                "success": True,
                "message": "Diary entry updated successfully"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to update diary entry: {str(e)}"}
    
    def delete_diary_entry(self, entry_id: str) -> Dict[str, Any]:
        """Günlük girişini sil"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            doc_ref = self.db.collection('diary_entries').document(entry_id)
            doc_ref.delete()
            
            return {
                "success": True,
                "message": "Diary entry deleted successfully"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to delete diary entry: {str(e)}"}

# Global instance
firestore_service = FirestoreService() 