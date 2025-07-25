import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Backend modüllerini import edebilmek için path ekle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.emotion_analysis import analyze_emotion
from app.services.location_extraction import extract_locations, get_coordinates
from app.services.analytics_backend import AnalyticsTracker

class TestEmotionAnalysis:
    """Duygu analizi servis testleri"""
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_analyze_emotion_positive(self, mock_pipeline):
        """Pozitif duygu analizi testi"""
        # Mock pipeline response
        mock_nlp = MagicMock()
        mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.95}]
        mock_pipeline.return_value = mock_nlp
        
        result = analyze_emotion("I had a wonderful day!")
        
        assert result["label"] == "POSITIVE"
        assert result["score"] == 0.95
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_analyze_emotion_negative(self, mock_pipeline):
        """Negatif duygu analizi testi"""
        # Mock pipeline response
        mock_nlp = MagicMock()
        mock_nlp.return_value = [{"label": "NEGATIVE", "score": 0.87}]
        mock_pipeline.return_value = mock_nlp
        
        result = analyze_emotion("I feel terrible today.")
        
        assert result["label"] == "NEGATIVE"
        assert result["score"] == 0.87
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_analyze_emotion_empty_result(self, mock_pipeline):
        """Boş sonuç testi"""
        # Mock pipeline response
        mock_nlp = MagicMock()
        mock_nlp.return_value = []
        mock_pipeline.return_value = mock_nlp
        
        result = analyze_emotion("Some text")
        
        assert result["label"] == "neutral"
        assert result["score"] == 0.0

class TestLocationExtraction:
    """Lokasyon çıkarımı servis testleri"""
    
    @patch('app.services.location_extraction.get_spacy_model')
    def test_extract_locations_success(self, mock_spacy):
        """Başarılı lokasyon çıkarımı testi"""
        # Mock spaCy model
        mock_nlp = MagicMock()
        mock_doc = MagicMock()
        
        # Mock entities
        mock_entity1 = MagicMock()
        mock_entity1.text = "New York"
        mock_entity1.label_ = "GPE"
        
        mock_entity2 = MagicMock()
        mock_entity2.text = "Central Park"
        mock_entity2.label_ = "LOC"
        
        mock_doc.ents = [mock_entity1, mock_entity2]
        mock_nlp.return_value = mock_doc
        mock_spacy.return_value = mock_nlp
        
        result = extract_locations("I visited New York and walked through Central Park.")
        
        assert "New York" in result
        assert "Central Park" in result
        assert len(result) == 2
    
    @patch('app.services.location_extraction.get_spacy_model')
    def test_extract_locations_no_locations(self, mock_spacy):
        """Lokasyon bulunamadığında test"""
        # Mock spaCy model
        mock_nlp = MagicMock()
        mock_doc = MagicMock()
        mock_doc.ents = []  # Hiç entity yok
        mock_nlp.return_value = mock_doc
        mock_spacy.return_value = mock_nlp
        
        result = extract_locations("I had a great day today.")
        
        assert result == []
    
    @patch('geopy.geocoders.Nominatim.geocode')
    def test_get_coordinates_success(self, mock_geocode):
        """Başarılı koordinat dönüşümü testi"""
        # Mock geocoder response
        mock_location = MagicMock()
        mock_location.latitude = 40.7589
        mock_location.longitude = -73.9851
        mock_geocode.return_value = mock_location
        
        result = get_coordinates("New York")
        
        assert result["lat"] == 40.7589
        assert result["lon"] == -73.9851
    
    @patch('geopy.geocoders.Nominatim.geocode')
    def test_get_coordinates_not_found(self, mock_geocode):
        """Koordinat bulunamadığında test"""
        mock_geocode.return_value = None
        
        result = get_coordinates("NonexistentPlace")
        
        assert result is None

class TestAnalyticsTracker:
    """Analytics tracker testleri"""
    
    def test_track_user_session(self):
        """Kullanıcı oturum takibi testi"""
        tracker = AnalyticsTracker()
        
        tracker.track_user_session(1, "login", {"method": "email"})
        
        assert len(tracker.user_sessions[1]) == 1
        assert tracker.user_sessions[1][0]["action"] == "login"
        assert tracker.feature_usage["login"] == 1
    
    def test_track_api_performance(self):
        """API performans takibi testi"""
        tracker = AnalyticsTracker()
        
        tracker.track_api_performance("/auth/login", 150.5, 200)
        
        assert len(tracker.performance_metrics) == 1
        assert tracker.performance_metrics[0]["endpoint"] == "/auth/login"
        assert tracker.performance_metrics[0]["duration_ms"] == 150.5
        assert tracker.performance_metrics[0]["status_code"] == 200
    
    def test_track_error(self):
        """Hata takibi testi"""
        tracker = AnalyticsTracker()
        
        tracker.track_error("ValidationError", "Invalid email format", 1)
        
        assert len(tracker.error_logs) == 1
        assert tracker.error_logs[0]["error_type"] == "ValidationError"
        assert tracker.error_logs[0]["user_id"] == 1
    
    def test_get_user_analytics(self):
        """Kullanıcı analitik raporu testi"""
        tracker = AnalyticsTracker()
        
        # Test verisi ekle
        tracker.track_user_session(1, "login", {})
        tracker.track_user_session(1, "diary_create", {})
        tracker.track_user_session(1, "emotion_analysis", {})
        
        report = tracker.get_user_analytics(1, 30)
        
        assert report["user_id"] == 1
        assert report["total_sessions"] == 3
        assert report["unique_actions"] == 3
        assert len(report["most_used_features"]) > 0
    
    def test_get_system_analytics(self):
        """Sistem analitik raporu testi"""
        tracker = AnalyticsTracker()
        
        # Test verisi ekle
        tracker.track_user_session(1, "login", {})
        tracker.track_user_session(2, "register", {})
        tracker.track_api_performance("/auth/login", 100, 200)
        tracker.track_error("TestError", "Test message")
        
        report = tracker.get_system_analytics(7)
        
        assert report["total_users"] == 2
        assert report["total_api_calls"] == 1
        assert len(report["most_used_features"]) > 0
        assert len(report["error_types"]) > 0 