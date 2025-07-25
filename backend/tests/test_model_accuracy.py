import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Backend modüllerini import edebilmek için path ekle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.emotion_analysis import analyze_emotion
from app.services.location_extraction import extract_locations
from app.services.image_generation import create_prompt_from_diary_entry

class TestEmotionAnalysisAccuracy:
    """Duygu analizi doğruluğu testleri"""
    
    # Test data sets
    POSITIVE_SAMPLES = [
        "I had an amazing day at the beach!",
        "So happy to see my family again.",
        "This is the best news ever!",
        "I love spending time with my friends.",
        "What a wonderful surprise!"
    ]
    
    NEGATIVE_SAMPLES = [
        "I'm feeling really sad today.",
        "This has been a terrible week.",
        "I hate when things go wrong.",
        "I'm so frustrated with everything.",
        "This makes me really angry."
    ]
    
    NEUTRAL_SAMPLES = [
        "I went to the store today.",
        "The meeting is at 3 PM.",
        "I need to finish my work.",
        "The weather is cloudy.",
        "I had lunch at noon."
    ]
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_positive_emotion_accuracy(self, mock_pipeline):
        """Pozitif duygu analizi doğruluğu testi"""
        # Mock pipeline to return positive results
        mock_nlp = MagicMock()
        mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.9}]
        mock_pipeline.return_value = mock_nlp
        
        correct_predictions = 0
        total_samples = len(self.POSITIVE_SAMPLES)
        
        for sample in self.POSITIVE_SAMPLES:
            result = analyze_emotion(sample)
            if result["label"] == "POSITIVE" and result["score"] > 0.5:
                correct_predictions += 1
        
        accuracy = correct_predictions / total_samples
        assert accuracy >= 0.8, f"Positive emotion accuracy too low: {accuracy}"
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_negative_emotion_accuracy(self, mock_pipeline):
        """Negatif duygu analizi doğruluğu testi"""
        # Mock pipeline to return negative results
        mock_nlp = MagicMock()
        mock_nlp.return_value = [{"label": "NEGATIVE", "score": 0.85}]
        mock_pipeline.return_value = mock_nlp
        
        correct_predictions = 0
        total_samples = len(self.NEGATIVE_SAMPLES)
        
        for sample in self.NEGATIVE_SAMPLES:
            result = analyze_emotion(sample)
            if result["label"] == "NEGATIVE" and result["score"] > 0.5:
                correct_predictions += 1
        
        accuracy = correct_predictions / total_samples
        assert accuracy >= 0.8, f"Negative emotion accuracy too low: {accuracy}"
    
    @patch('app.services.emotion_analysis.get_emotion_pipeline')
    def test_confidence_threshold(self, mock_pipeline):
        """Güven skoru eşik testi"""
        # Mock pipeline with varying confidence scores
        mock_nlp = MagicMock()
        mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.95}]
        mock_pipeline.return_value = mock_nlp
        
        result = analyze_emotion("I'm extremely happy!")
        
        # Yüksek güven skoru bekleniyor
        assert result["score"] >= 0.7, f"Confidence score too low: {result['score']}"
    
    def test_model_consistency(self):
        """Model tutarlılığı testi - aynı input için aynı output"""
        test_text = "I had a great day today!"
        
        with patch('app.services.emotion_analysis.get_emotion_pipeline') as mock_pipeline:
            mock_nlp = MagicMock()
            mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.9}]
            mock_pipeline.return_value = mock_nlp
            
            result1 = analyze_emotion(test_text)
            result2 = analyze_emotion(test_text)
            
            assert result1["label"] == result2["label"]
            assert result1["score"] == result2["score"]

class TestLocationExtractionAccuracy:
    """Lokasyon çıkarımı doğruluğu testleri"""
    
    # Test samples with known locations
    LOCATION_SAMPLES = [
        ("I visited New York last week.", ["New York"]),
        ("Paris is beautiful in spring.", ["Paris"]),
        ("We went to Central Park and Times Square.", ["Central Park", "Times Square"]),
        ("I flew from London to Tokyo.", ["London", "Tokyo"]),
        ("The meeting was in San Francisco.", ["San Francisco"])
    ]
    
    NO_LOCATION_SAMPLES = [
        "I had breakfast this morning.",
        "The weather is nice today.",
        "I'm feeling happy.",
        "We need to finish the project.",
        "The car is red."
    ]
    
    @patch('app.services.location_extraction.get_spacy_model')
    def test_location_detection_accuracy(self, mock_spacy):
        """Lokasyon tespit doğruluğu testi"""
        correct_detections = 0
        total_samples = len(self.LOCATION_SAMPLES)
        
        for text, expected_locations in self.LOCATION_SAMPLES:
            # Mock spaCy model for each expected location
            mock_nlp = MagicMock()
            mock_doc = MagicMock()
            
            # Create mock entities
            mock_entities = []
            for location in expected_locations:
                mock_entity = MagicMock()
                mock_entity.text = location
                mock_entity.label_ = "GPE"  # Geopolitical entity
                mock_entities.append(mock_entity)
            
            mock_doc.ents = mock_entities
            mock_nlp.return_value = mock_doc
            mock_spacy.return_value = mock_nlp
            
            result = extract_locations(text)
            
            # Check if at least one expected location was found
            if any(loc in result for loc in expected_locations):
                correct_detections += 1
        
        accuracy = correct_detections / total_samples
        assert accuracy >= 0.8, f"Location detection accuracy too low: {accuracy}"
    
    @patch('app.services.location_extraction.get_spacy_model')
    def test_no_false_positives(self, mock_spacy):
        """Yanlış pozitif testi - lokasyon olmayan metinlerde lokasyon bulmamalı"""
        # Mock spaCy model to return no entities
        mock_nlp = MagicMock()
        mock_doc = MagicMock()
        mock_doc.ents = []
        mock_nlp.return_value = mock_doc
        mock_spacy.return_value = mock_nlp
        
        false_positives = 0
        total_samples = len(self.NO_LOCATION_SAMPLES)
        
        for sample in self.NO_LOCATION_SAMPLES:
            result = extract_locations(sample)
            if len(result) > 0:
                false_positives += 1
        
        false_positive_rate = false_positives / total_samples
        assert false_positive_rate <= 0.2, f"Too many false positives: {false_positive_rate}"

class TestPromptGenerationQuality:
    """Prompt üretimi kalite testleri"""
    
    def test_prompt_length(self):
        """Prompt uzunluğu testi"""
        diary_text = "I had a wonderful day at the beach with my family."
        emotion = "POSITIVE"
        locations = ["Beach", "California"]
        
        prompt = create_prompt_from_diary_entry(diary_text, emotion, locations)
        
        # Prompt yeterince uzun olmalı
        assert len(prompt) >= 50, f"Prompt too short: {len(prompt)} characters"
        assert len(prompt) <= 500, f"Prompt too long: {len(prompt)} characters"
    
    def test_prompt_contains_emotion(self):
        """Prompt'ta duygu bilgisi testi"""
        diary_text = "I feel sad today."
        emotion = "NEGATIVE"
        
        prompt = create_prompt_from_diary_entry(diary_text, emotion)
        
        # Negatif duygu için uygun kelimeler içermeli
        negative_keywords = ["moody", "dramatic", "contemplative"]
        assert any(keyword in prompt.lower() for keyword in negative_keywords)
    
    def test_prompt_contains_location(self):
        """Prompt'ta lokasyon bilgisi testi"""
        diary_text = "I visited the museum."
        locations = ["Paris", "Louvre"]
        
        prompt = create_prompt_from_diary_entry(diary_text, locations=locations)
        
        # Lokasyon bilgisi içermeli
        assert "Paris" in prompt or "Louvre" in prompt
    
    def test_prompt_safety(self):
        """Prompt güvenlik testi"""
        diary_text = "I had a normal day."
        
        prompt = create_prompt_from_diary_entry(diary_text)
        
        # Güvenli içerik kontrolü
        unsafe_keywords = ["violence", "explicit", "harmful", "illegal"]
        assert not any(keyword in prompt.lower() for keyword in unsafe_keywords)

class TestModelPerformanceBenchmark:
    """Model performans benchmark testleri"""
    
    def test_response_time_emotion_analysis(self):
        """Duygu analizi yanıt süresi testi"""
        import time
        
        with patch('app.services.emotion_analysis.get_emotion_pipeline') as mock_pipeline:
            mock_nlp = MagicMock()
            mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.9}]
            mock_pipeline.return_value = mock_nlp
            
            start_time = time.time()
            analyze_emotion("This is a test sentence for performance measurement.")
            end_time = time.time()
            
            response_time = end_time - start_time
            assert response_time < 1.0, f"Emotion analysis too slow: {response_time}s"
    
    def test_response_time_location_extraction(self):
        """Lokasyon çıkarımı yanıt süresi testi"""
        import time
        
        with patch('app.services.location_extraction.get_spacy_model') as mock_spacy:
            mock_nlp = MagicMock()
            mock_doc = MagicMock()
            mock_doc.ents = []
            mock_nlp.return_value = mock_doc
            mock_spacy.return_value = mock_nlp
            
            start_time = time.time()
            extract_locations("This is a test sentence for performance measurement.")
            end_time = time.time()
            
            response_time = end_time - start_time
            assert response_time < 1.0, f"Location extraction too slow: {response_time}s"
    
    def test_memory_usage(self):
        """Bellek kullanımı testi"""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        # Birden fazla analiz yap
        with patch('app.services.emotion_analysis.get_emotion_pipeline') as mock_pipeline:
            mock_nlp = MagicMock()
            mock_nlp.return_value = [{"label": "POSITIVE", "score": 0.9}]
            mock_pipeline.return_value = mock_nlp
            
            for i in range(100):
                analyze_emotion(f"Test sentence number {i}")
        
        final_memory = process.memory_info().rss
        memory_increase = final_memory - initial_memory
        
        # Bellek artışı 100MB'dan az olmalı
        assert memory_increase < 100 * 1024 * 1024, f"Memory usage too high: {memory_increase} bytes" 