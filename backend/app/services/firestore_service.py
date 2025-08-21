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
    
    # User operations
    def get_user_by_email(self, email: str) -> Dict[str, Any]:
        """Email'e göre kullanıcıyı getirir"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}

            users_ref = self.db.collection('users').where('email', '==', email).limit(1)
            docs = list(users_ref.stream())
            if not docs:
                return {"success": True, "user": None}

            doc = docs[0]
            data = doc.to_dict()
            data['id'] = doc.id
            return {"success": True, "user": data}

        except Exception as e:
            return {"success": False, "error": f"Failed to get user: {str(e)}"}

    def get_user_by_id(self, user_id: str) -> Dict[str, Any]:
        """ID'ye göre kullanıcıyı getirir"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            doc = self.db.collection('users').document(user_id).get()
            if not doc.exists:
                return {"success": True, "user": None}
            data = doc.to_dict()
            data['id'] = doc.id
            return {"success": True, "user": data}
        except Exception as e:
            return {"success": False, "error": f"Failed to get user: {str(e)}"}

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Yeni kullanıcı oluşturur"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}

            # timestamps
            now = datetime.now(timezone.utc)
            user_data.setdefault('created_at', now)
            user_data.setdefault('updated_at', now)
            user_ref = self.db.collection('users').document()
            user_ref.set(user_data)
            return {"success": True, "user_id": user_ref.id}
        except Exception as e:
            return {"success": False, "error": f"Failed to create user: {str(e)}"}

    def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Kullanıcı profilini günceller"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            update_data = dict(update_data or {})
            update_data['updated_at'] = datetime.now(timezone.utc)
            self.db.collection('users').document(user_id).update(update_data)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": f"Failed to update user: {str(e)}"}

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
    
    def get_diary_entries_count(self, user_id: str) -> Dict[str, Any]:
        """Kullanıcının günlük giriş sayısını getir"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Kullanıcının tüm günlük girişlerini say
            entries_ref = self.db.collection('diary_entries').where('user_id', '==', user_id)
            docs = list(entries_ref.stream())
            
            return {
                "success": True,
                "count": len(docs)
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to get diary entries count: {str(e)}"}
    
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

    def clear_all_diary_entries(self, user_id: str) -> Dict[str, Any]:
        """Kullanıcının tüm günlük girişlerini temizle"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}
            
            # Kullanıcının tüm günlük girişlerini getir
            entries_ref = self.db.collection('diary_entries').where('user_id', '==', user_id)
            docs = list(entries_ref.stream())
            
            deleted_count = 0
            for doc in docs:
                doc.reference.delete()
                deleted_count += 1
            
            return {
                "success": True,
                "message": f"All diary entries cleared successfully",
                "deleted_count": deleted_count
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to clear diary entries: {str(e)}"}

    def seed_demo_entries_for_user(self, user_id: str) -> Dict[str, Any]:
        """Yeni kullanıcı için demo günlük girdileri oluşturur"""
        try:
            if not self.db:
                return {"success": False, "error": "Firestore not initialized"}

            demo_entries: List[Dict[str, Any]] = [
                {
                    "title": "Hoş Geldiniz!",
                    "content": "MemoryMap'e hoş geldiniz! Bu demo hesabında anlamlı günlük girdileri bulabilirsiniz. Kendi günlük girdilerinizi oluşturmaya başlayabilirsiniz.",
                    "location": "İstanbul",
                    "mood": "Meraklı",
                },
                {
                    "title": "Güzel Bir Sabah",
                    "content": "Bugün güneşli bir sabahla uyandım. Kahvemi içerken günün planlarını yaptım. Bu tür sakin anlar hayatın en güzel yanlarından biri.",
                    "location": "Ev",
                    "mood": "Huzurlu",
                },
            ]

            created_ids: List[str] = []
            for entry in demo_entries:
                result = self.create_diary_entry(user_id, entry)
                if result.get("success"):
                    created_ids.append(result.get("entry_id"))

            return {"success": True, "created_entry_ids": created_ids}
        except Exception as e:
            return {"success": False, "error": f"Failed to seed demo entries: {str(e)}"}

# Global instance
firestore_service = FirestoreService() 