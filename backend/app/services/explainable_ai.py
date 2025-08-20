import json
from typing import List, Dict, Optional
from datetime import datetime, timedelta

class ExplainableAIService:
    def __init__(self):
        """Explainable AI servisi başlatıcısı"""
        pass
    
    def explain_advice(self, question: str, advice: str, relevant_entries: List[Dict]) -> Dict:
        """AI tavsiyesinin nedenini açıklar"""
        try:
            # Tavsiye analizi
            explanation = self._analyze_advice_reasoning(question, advice, relevant_entries)
            
            # Güven skoru hesapla
            confidence_score = self._calculate_confidence_score(relevant_entries)
            
            # Öneri gücü hesapla
            recommendation_strength = self._calculate_recommendation_strength(advice, relevant_entries)
            
            # Pattern analizi
            patterns = self._identify_patterns(relevant_entries)
            
            return {
                "success": True,
                "explanation": explanation,
                "confidence_score": confidence_score,
                "recommendation_strength": recommendation_strength,
                "patterns": patterns,
                "evidence": self._extract_evidence(relevant_entries),
                "reasoning_chain": self._build_reasoning_chain(question, advice, relevant_entries)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Tavsiye açıklaması oluşturulurken hata: {str(e)}"
            }
    
    def _analyze_advice_reasoning(self, question: str, advice: str, relevant_entries: List[Dict]) -> str:
        """Tavsiyenin mantığını analiz eder"""
        if not relevant_entries:
            return "Bu tavsiye genel bilgiler üzerine kurulmuştur."
        
        # En yüksek benzerlik skoruna sahip girdiyi bul
        best_match = max(relevant_entries, key=lambda x: x.get('similarity_score', 0))
        
        # Soru analizi
        question_keywords = self._extract_keywords(question.lower())
        
        # Tavsiye analizi
        advice_keywords = self._extract_keywords(advice.lower())
        
        # Benzerlik analizi
        similarity_score = best_match.get('similarity_score', 0)
        
        explanation_parts = []
        
        # Benzerlik skoru açıklaması
        if similarity_score > 0.8:
            explanation_parts.append(f"Geçmiş günlük girdilerinizde %{int(similarity_score * 100)} benzerlik oranında bir durum tespit ettim.")
        elif similarity_score > 0.6:
            explanation_parts.append(f"Geçmiş deneyimlerinizle %{int(similarity_score * 100)} oranında benzerlik buldum.")
        else:
            explanation_parts.append("Genel deneyimler ve bilgiler ışığında bu tavsiyeyi veriyorum.")
        
        # Tarih analizi
        if relevant_entries:
            dates = [entry['metadata']['date'] for entry in relevant_entries]
            recent_entries = [d for d in dates if self._is_recent(d)]
            if recent_entries:
                explanation_parts.append(f"Son zamanlarda {len(recent_entries)} benzer durum yaşadığınızı görüyorum.")
        
        # Duygu analizi
        emotions = [entry['metadata']['emotion'] for entry in relevant_entries]
        if emotions:
            most_common_emotion = max(set(emotions), key=emotions.count)
            explanation_parts.append(f"Bu durumlarda genellikle '{most_common_emotion}' hissettiğinizi gözlemledim.")
        
        return " ".join(explanation_parts)
    
    def _calculate_confidence_score(self, relevant_entries: List[Dict]) -> float:
        """Tavsiye için güven skoru hesaplar"""
        if not relevant_entries:
            return 0.3  # Düşük güven
        
        # Benzerlik skorlarının ortalaması
        similarity_scores = [entry.get('similarity_score', 0) for entry in relevant_entries]
        avg_similarity = sum(similarity_scores) / len(similarity_scores)
        
        # Girdi sayısına göre bonus
        entry_count_bonus = min(len(relevant_entries) * 0.1, 0.3)
        
        # Tarih yakınlığına göre bonus
        recency_bonus = 0.0
        for entry in relevant_entries:
            if self._is_recent(entry['metadata']['date']):
                recency_bonus += 0.1
        
        recency_bonus = min(recency_bonus, 0.2)
        
        confidence = avg_similarity + entry_count_bonus + recency_bonus
        return min(confidence, 1.0)
    
    def _calculate_recommendation_strength(self, advice: str, relevant_entries: List[Dict]) -> str:
        """Öneri gücünü hesaplar"""
        if not relevant_entries:
            return "orta"
        
        # Benzerlik skorlarına göre güç belirleme
        similarity_scores = [entry.get('similarity_score', 0) for entry in relevant_entries]
        avg_similarity = sum(similarity_scores) / len(similarity_scores)
        
        if avg_similarity > 0.8:
            return "yüksek"
        elif avg_similarity > 0.6:
            return "orta"
        else:
            return "düşük"
    
    def _identify_patterns(self, relevant_entries: List[Dict]) -> List[Dict]:
        """Girdilerdeki pattern'leri tespit eder"""
        patterns = []
        
        if not relevant_entries:
            return patterns
        
        # Duygu pattern'leri
        emotions = [entry['metadata']['emotion'] for entry in relevant_entries]
        emotion_counts = {}
        for emotion in emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        if emotion_counts:
            most_common_emotion = max(emotion_counts.items(), key=lambda x: x[1])
            patterns.append({
                "type": "emotion_pattern",
                "description": f"En sık yaşanan duygu: {most_common_emotion[0]} ({most_common_emotion[1]} kez)",
                "confidence": most_common_emotion[1] / len(emotions)
            })
        
        # Zaman pattern'leri
        dates = [entry['metadata']['date'] for entry in relevant_entries]
        recent_count = len([d for d in dates if self._is_recent(d)])
        if recent_count > len(dates) * 0.5:
            patterns.append({
                "type": "temporal_pattern",
                "description": "Bu durumlar son zamanlarda daha sık yaşanıyor",
                "confidence": recent_count / len(dates)
            })
        
        # Konum pattern'leri
        locations = [entry['metadata']['location'] for entry in relevant_entries if entry['metadata']['location']]
        if locations:
            location_counts = {}
            for location in locations:
                location_counts[location] = location_counts.get(location, 0) + 1
            
            if location_counts:
                most_common_location = max(location_counts.items(), key=lambda x: x[1])
                patterns.append({
                    "type": "location_pattern",
                    "description": f"En sık yaşandığı yer: {most_common_location[0]}",
                    "confidence": most_common_location[1] / len(locations)
                })
        
        return patterns
    
    def _extract_evidence(self, relevant_entries: List[Dict]) -> List[Dict]:
        """Tavsiye için kanıtları çıkarır"""
        evidence = []
        
        for entry in relevant_entries[:3]:  # En iyi 3 kanıt
            evidence.append({
                "date": entry['metadata']['date'],
                "emotion": entry['metadata']['emotion'],
                "content_preview": entry['content'][:100] + "...",
                "similarity_score": entry.get('similarity_score', 0),
                "location": entry['metadata'].get('location', '')
            })
        
        return evidence
    
    def _build_reasoning_chain(self, question: str, advice: str, relevant_entries: List[Dict]) -> List[str]:
        """Mantık zincirini oluşturur"""
        reasoning_chain = []
        
        # 1. Soru analizi
        reasoning_chain.append(f"1. Sorunuz: '{question}'")
        
        # 2. Benzer durumların tespiti
        if relevant_entries:
            reasoning_chain.append(f"2. Geçmiş günlük girdilerinizde {len(relevant_entries)} benzer durum buldum")
        else:
            reasoning_chain.append("2. Geçmiş girdilerinizde doğrudan benzer durum bulamadım")
        
        # 3. Pattern analizi
        if relevant_entries:
            emotions = [entry['metadata']['emotion'] for entry in relevant_entries]
            if emotions:
                most_common = max(set(emotions), key=emotions.count)
                reasoning_chain.append(f"3. Bu durumlarda genellikle '{most_common}' hissettiğinizi gözlemledim")
        
        # 4. Tavsiye oluşturma
        reasoning_chain.append(f"4. Bu analizler ışığında şu tavsiyeyi veriyorum: {advice[:100]}...")
        
        return reasoning_chain
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Metinden anahtar kelimeleri çıkarır"""
        # Basit keyword extraction
        stop_words = {'ve', 'veya', 'ile', 'için', 'bu', 'bir', 'da', 'de', 'mi', 'mu', 'mü'}
        words = text.split()
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        return keywords[:10]  # İlk 10 keyword
    
    def _is_recent(self, date_str: str, days: int = 30) -> bool:
        """Tarihin yakın olup olmadığını kontrol eder"""
        try:
            entry_date = datetime.strptime(date_str, '%Y-%m-%d')
            cutoff_date = datetime.now() - timedelta(days=days)
            return entry_date > cutoff_date
        except:
            return False
    
    def generate_explanation_summary(self, explanation_data: Dict) -> str:
        """Açıklama verilerinden özet oluşturur"""
        if not explanation_data.get('success'):
            return "Tavsiye açıklaması oluşturulamadı."
        
        summary_parts = []
        
        # Güven skoru
        confidence = explanation_data.get('confidence_score', 0)
        if confidence > 0.8:
            summary_parts.append("Bu tavsiyeye yüksek güvenle inanıyorum.")
        elif confidence > 0.6:
            summary_parts.append("Bu tavsiyeye orta düzeyde güveniyorum.")
        else:
            summary_parts.append("Bu genel bir tavsiyedir.")
        
        # Pattern'ler
        patterns = explanation_data.get('patterns', [])
        if patterns:
            pattern_desc = patterns[0].get('description', '')
            summary_parts.append(f"Analiz sonucu: {pattern_desc}")
        
        # Kanıt sayısı
        evidence = explanation_data.get('evidence', [])
        if evidence:
            summary_parts.append(f"Bu tavsiye {len(evidence)} geçmiş deneyiminize dayanmaktadır.")
        
        return " ".join(summary_parts)

# Global instance
explainable_ai_service = ExplainableAIService()
