import os
import firebase_admin
from firebase_admin import credentials, storage, messaging
import uuid
from datetime import datetime

# Servis hesabı anahtarı dosyasının yolu
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS", "firebase-service-account.json")
FIREBASE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET", None)

# Firebase uygulamasını başlat (hata durumunda devam et)
try:
    if not firebase_admin._apps:
        if os.path.exists(FIREBASE_CREDENTIALS):
            cred = credentials.Certificate(FIREBASE_CREDENTIALS)
            firebase_admin.initialize_app(cred, {
                'storageBucket': FIREBASE_STORAGE_BUCKET
            })
            print("Firebase initialized successfully")
        else:
            print("Firebase credentials file not found - Firebase features disabled")
except Exception as e:
    print(f"Firebase initialization failed: {e} - Firebase features disabled")

# Artık firebase_admin.storage ve firebase_admin.messaging kullanılabilir 

def upload_image_to_storage(image_bytes, filename=None, folder="images"):
    """
    Firebase Storage'a görsel yükler
    """
    try:
        if not firebase_admin._apps:
            return {"success": False, "error": "Firebase not initialized"}
            
        if not filename:
            filename = f"{uuid.uuid4()}.png"
        
        # Storage referansı al
        bucket = storage.bucket()
        blob = bucket.blob(f"{folder}/{filename}")
        
        # Görseli yükle
        blob.upload_from_string(image_bytes, content_type='image/png')
        
        # Public URL al
        blob.make_public()
        public_url = blob.public_url
        
        return {
            "success": True,
            "url": public_url,
            "filename": filename,
            "path": f"{folder}/{filename}"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Upload failed: {str(e)}"
        }

def delete_image_from_storage(file_path):
    """
    Firebase Storage'dan görsel siler
    """
    try:
        if not firebase_admin._apps:
            return {"success": False, "error": "Firebase not initialized"}
            
        bucket = storage.bucket()
        blob = bucket.blob(file_path)
        blob.delete()
        
        return {"success": True, "message": "Image deleted successfully"}
        
    except Exception as e:
        return {"success": False, "error": f"Delete failed: {str(e)}"}

def list_user_images(user_id, folder="images"):
    """
    Kullanıcının yüklediği görselleri listeler
    """
    try:
        if not firebase_admin._apps:
            return {"success": False, "error": "Firebase not initialized"}
            
        bucket = storage.bucket()
        blobs = bucket.list_blobs(prefix=f"{folder}/user_{user_id}_")
        
        images = []
        for blob in blobs:
            images.append({
                "filename": blob.name.split("/")[-1],
                "url": blob.public_url,
                "path": blob.name,
                "created": blob.time_created.isoformat() if blob.time_created else None,
                "size": blob.size
            })
        
        return {"success": True, "images": images}
        
    except Exception as e:
        return {"success": False, "error": f"List failed: {str(e)}"} 