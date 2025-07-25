import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Backend modüllerini import edebilmek için path ekle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.utils.auth import hash_password, verify_password, create_access_token

client = TestClient(app)

class TestAuth:
    """Authentication endpoint testleri"""
    
    def test_password_hashing(self):
        """Şifre hashleme ve doğrulama testleri"""
        password = "test_password_123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed) == True
        assert verify_password("wrong_password", hashed) == False
    
    def test_jwt_token_creation(self):
        """JWT token oluşturma testi"""
        data = {"sub": "test@example.com", "user_id": 1}
        token = create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 50  # JWT token uzunluk kontrolü
    
    @patch('app.routes.auth.get_db')
    @patch('app.models.user.User')
    def test_register_endpoint(self, mock_user, mock_get_db):
        """Kullanıcı kayıt endpoint testi"""
        # Mock database session
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        
        # Mock user query (kullanıcı yoksa None döner)
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        register_data = {
            "email": "test@example.com",
            "name": "Test User",
            "password": "test_password_123"
        }
        
        response = client.post("/auth/register", json=register_data)
        
        # Status code ve response kontrolü
        assert response.status_code == 200
        assert "message" in response.json()
        assert response.json()["message"] == "User registered successfully"
    
    @patch('app.routes.auth.get_db')
    @patch('app.models.user.User')
    def test_register_existing_user(self, mock_user, mock_get_db):
        """Mevcut kullanıcı kayıt testi"""
        # Mock database session
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        
        # Mock existing user
        mock_existing_user = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_existing_user
        
        register_data = {
            "email": "existing@example.com",
            "name": "Existing User",
            "password": "test_password_123"
        }
        
        response = client.post("/auth/register", json=register_data)
        
        # Hata kontrolü
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    @patch('app.routes.auth.get_db')
    @patch('app.models.user.User')
    def test_login_endpoint(self, mock_user, mock_get_db):
        """Kullanıcı giriş endpoint testi"""
        # Mock database session
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        
        # Mock user
        mock_user_obj = MagicMock()
        mock_user_obj.id = 1
        mock_user_obj.email = "test@example.com"
        mock_user_obj.hashed_password = hash_password("test_password_123")
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user_obj
        
        login_data = {
            "email": "test@example.com",
            "password": "test_password_123"
        }
        
        response = client.post("/auth/login", json=login_data)
        
        # Başarılı giriş kontrolü
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"
    
    @patch('app.routes.auth.get_db')
    def test_login_invalid_credentials(self, mock_get_db):
        """Geçersiz kimlik bilgileri testi"""
        # Mock database session
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        
        # Mock user not found
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        login_data = {
            "email": "nonexistent@example.com",
            "password": "wrong_password"
        }
        
        response = client.post("/auth/login", json=login_data)
        
        # Hata kontrolü
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    def test_health_endpoint(self):
        """Health check endpoint testi"""
        response = client.get("/health")
        
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_root_endpoint(self):
        """Root endpoint testi"""
        response = client.get("/")
        
        assert response.status_code == 200
        assert "MemoryMap API is running" in response.json()["message"] 