import chromadb
import json
import os
from typing import List, Dict, Optional
from datetime import datetime
import uuid
from sentence_transformers import SentenceTransformer
import numpy as np
# Explainable AI import'u lazy loading ile yapılacak

class RAGCoachingService:
    def __init__(self):
        """RAG tabanlı coaching servisi başlatıcısı"""
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection_name = "diary_entries"
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Collection'ı oluştur veya mevcut olanı al
        try:
            self.collection = self.client.get_collection(name=self.collection_name)
        except:
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"description": "Günlük girdileri için vektör veritabanı"}
            )
        
        # Demo verileri yükle
        self._load_demo_data()
    
    def _load_demo_data(self):
        """Demo aşaması için örnek günlük verilerini yükler"""
        try:
            # Önce mevcut verileri kontrol et
            existing_data = self.collection.get()
            if existing_data['documents']:
                print("Demo veriler zaten yüklü, tekrar yüklenmiyor.")
                return
            
            demo_entries = [
                {
                    "id": "demo_1",
                    "content": "Bugün iş yerinde çok stresli bir gün geçirdim. Proje teslim tarihi yaklaşıyor ve henüz bitiremedim. Patronum sürekli durumu soruyor ve bu beni daha da kaygılandırıyor. Eve geldiğimde kendimi yorgun ve bitkin hissediyorum.",
                    "emotion": "stres",
                    "date": "2024-01-15",
                    "location": "İstanbul, Türkiye",
                    "tags": ["iş", "stres", "proje", "kaygı"]
                },
                {
                    "id": "demo_2", 
                    "content": "Hafta sonu arkadaşlarımla pikniğe gittik. Havalar çok güzeldi ve güzel vakit geçirdik. Yemek yerken eski anılarımızı konuştuk ve çok güldük. Bu tür sosyal aktiviteler beni gerçekten mutlu ediyor.",
                    "emotion": "mutlu",
                    "date": "2024-01-20",
                    "location": "Belgrad Ormanı, İstanbul",
                    "tags": ["arkadaşlar", "piknik", "sosyal", "mutlu"]
                },
                {
                    "id": "demo_3",
                    "content": "Geçen hafta aldığım kitabı bitirdim. 'İnsanın Anlam Arayışı' gerçekten etkileyici bir kitaptı. Viktor Frankl'ın deneyimleri beni derinden etkiledi. Hayatın anlamını bulma konusunda yeni perspektifler kazandım.",
                    "emotion": "düşünceli",
                    "date": "2024-01-25",
                    "location": "Ev, İstanbul",
                    "tags": ["kitap", "felsefe", "anlam", "düşünce"]
                },
                {
                    "id": "demo_4",
                    "content": "Bugün spor salonunda yeni bir egzersiz programına başladım. Antrenör bana özel bir program hazırladı. İlk gün olduğu için biraz zorlandım ama kendimi iyi hissettim. Düzenli spor yapmanın hem fiziksel hem de zihinsel sağlığım için önemli olduğunu düşünüyorum.",
                    "emotion": "motivasyonlu",
                    "date": "2024-01-28",
                    "location": "Spor Salonu, İstanbul",
                    "tags": ["spor", "sağlık", "motivasyon", "egzersiz"]
                },
                {
                    "id": "demo_5",
                    "content": "Ailemle akşam yemeği yerken annem sağlık sorunlarından bahsetti. Bu beni endişelendirdi. Onun yaşlanması ve sağlık problemleri yaşaması beni düşündürüyor. Ailemle daha fazla zaman geçirmem gerektiğini hissettim.",
                    "emotion": "endişeli",
                    "date": "2024-01-30",
                    "location": "Ev, İstanbul", 
                    "tags": ["aile", "sağlık", "endişe", "yaşlanma"]
                }
            ]
            
            # Demo verileri vektör veritabanına ekle
            for entry in demo_entries:
                self.add_diary_entry(
                    content=entry["content"],
                    emotion=entry["emotion"],
                    date=entry["date"],
                    location=entry["location"],
                    tags=entry["tags"],
                    entry_id=entry["id"]
                )
            
            print("Demo veriler başarıyla yüklendi.")
            
        except Exception as e:
            print(f"Demo veriler yüklenirken hata: {str(e)}")
    
    def add_diary_entry(self, content: str, emotion: str, date: str, 
                       location: str = "", tags: List[str] = None, entry_id: str = None) -> Dict:
        """Yeni günlük girdisini vektör veritabanına ekler"""
        try:
            if not entry_id:
                entry_id = str(uuid.uuid4())
            
            if not tags:
                tags = []
            
            # Metadata oluştur
            metadata = {
                "emotion": emotion,
                "date": date,
                "location": location,
                "tags": json.dumps(tags),
                "created_at": datetime.now().isoformat()
            }
            
            # Embedding oluştur
            embedding = self.embedding_model.encode(content).tolist()
            
            # ChromaDB'ye ekle
            self.collection.add(
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata],
                ids=[entry_id]
            )
            
            return {
                "success": True,
                "entry_id": entry_id,
                "message": "Günlük girdisi başarıyla eklendi"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Günlük girdisi eklenirken hata: {str(e)}"
            }
    
    def query_diary(self, question: str, top_k: int = 5) -> Dict:
        """Kullanıcı sorusuna göre günlük girdilerini sorgular"""
        try:
            # Soruyu vektörleştir
            query_embedding = self.embedding_model.encode(question).tolist()
            
            # Benzer girdileri bul
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=["documents", "metadatas", "distances"]
            )
            
            # Sonuçları formatla
            formatted_results = []
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "content": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "similarity_score": 1 - results['distances'][0][i]  # Mesafeyi benzerlik skoruna çevir
                })
            
            return {
                "success": True,
                "results": formatted_results,
                "query": question
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Sorgu sırasında hata: {str(e)}"
            }
    
    def get_emotional_insights(self, user_id: str = None) -> Dict:
        """Kullanıcının duygu durumu analizini yapar"""
        try:
            # Tüm girdileri al
            all_entries = self.collection.get()
            
            if not all_entries['documents']:
                return {
                    "success": False,
                    "error": "Henüz günlük girdisi bulunmuyor"
                }
            
            # Duygu analizi
            emotions = [entry['emotion'] for entry in all_entries['metadatas']]
            emotion_counts = {}
            
            for emotion in emotions:
                emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            
            # En sık görülen duygular
            most_common_emotions = sorted(emotion_counts.items(), 
                                        key=lambda x: x[1], reverse=True)[:3]
            
            # Son 7 günün analizi
            recent_emotions = []
            for i, metadata in enumerate(all_entries['metadatas']):
                try:
                    entry_date = datetime.strptime(metadata['date'], '%Y-%m-%d')
                    if (datetime.now() - entry_date).days <= 7:
                        recent_emotions.append(metadata['emotion'])
                except:
                    continue
            
            return {
                "success": True,
                "insights": {
                    "total_entries": len(all_entries['documents']),
                    "most_common_emotions": most_common_emotions,
                    "recent_emotions": recent_emotions,
                    "emotion_distribution": emotion_counts
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Duygu analizi sırasında hata: {str(e)}"
            }
    
    def generate_personalized_advice(self, question: str) -> Dict:
        """Kullanıcı sorusuna göre kişiselleştirilmiş tavsiye üretir"""
        try:
            # İlgili günlük girdilerini bul
            relevant_entries = self.query_diary(question, top_k=3)
            
            if not relevant_entries['success']:
                return relevant_entries
            
            # Tavsiye üretimi için context oluştur
            context = ""
            for entry in relevant_entries['results']:
                context += f"Tarih: {entry['metadata']['date']}\n"
                context += f"Duygu: {entry['metadata']['emotion']}\n"
                context += f"İçerik: {entry['content']}\n\n"
            
            # Basit tavsiye üretimi (gerçek uygulamada daha gelişmiş AI kullanılabilir)
            advice = self._generate_advice_from_context(question, context)
            
            # Explainable AI ile tavsiyeyi açıkla (lazy loading)
            from .explainable_ai import explainable_ai_service
            explanation_data = explainable_ai_service.explain_advice(
                question, advice, relevant_entries['results']
            )
            
            return {
                "success": True,
                "advice": advice,
                "relevant_entries": relevant_entries['results'],
                "explanation": explanation_data.get('explanation', "Bu tavsiye, geçmiş günlük girdilerinizdeki benzer durumlar analiz edilerek oluşturulmuştur."),
                "explainable_ai": explanation_data,
                "confidence_score": explanation_data.get('confidence_score', 0.5),
                "recommendation_strength": explanation_data.get('recommendation_strength', 'orta'),
                "patterns": explanation_data.get('patterns', []),
                "evidence": explanation_data.get('evidence', []),
                "reasoning_chain": explanation_data.get('reasoning_chain', [])
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Tavsiye üretimi sırasında hata: {str(e)}"
            }
    
    def _generate_advice_from_context(self, question: str, context: str) -> str:
        """Context'e göre basit tavsiye üretir"""
        # Bu kısım gerçek uygulamada daha gelişmiş AI modelleri kullanabilir
        # Şimdilik basit kurallar tabanlı bir sistem
        
        question_lower = question.lower()
        context_lower = context.lower()
        
        if "stres" in question_lower or "kaygı" in question_lower:
            return "Geçmiş günlük girdilerinizde stresli durumlar yaşadığınızı görüyorum. Size nefes egzersizleri ve düzenli spor yapmanızı öneriyorum. Ayrıca iş yükünüzü yönetmek için zaman yönetimi teknikleri öğrenmeniz faydalı olabilir."
        
        elif "mutlu" in question_lower or "sosyal" in question_lower:
            return "Sosyal aktivitelerin sizi mutlu ettiğini görüyorum. Arkadaşlarınızla düzenli olarak vakit geçirmeye devam etmenizi öneriyorum. Bu tür aktiviteler hem ruh sağlığınız hem de sosyal bağlarınız için çok faydalı."
        
        elif "sağlık" in question_lower or "aile" in question_lower:
            return "Ailenizle ilgili endişelerinizi anlıyorum. Aile üyelerinizle daha fazla zaman geçirmenizi ve onların sağlık durumlarını düzenli olarak takip etmenizi öneriyorum. Ayrıca kendi sağlığınızı da ihmal etmemek için düzenli kontroller yaptırmanız önemli."
        
        elif "spor" in question_lower or "egzersiz" in question_lower:
            return "Spor yapmaya başladığınızı ve bunun sizi iyi hissettirdiğini görüyorum. Bu alışkanlığı sürdürmenizi öneriyorum. Düzenli egzersiz hem fiziksel hem de zihinsel sağlığınız için çok faydalı."
        
        else:
            return "Günlük girdilerinizi analiz ederek size özel tavsiyeler sunmaya çalışıyorum. Daha spesifik sorular sorarsanız, size daha detaylı öneriler verebilirim."

# Global instance
rag_coaching_service = RAGCoachingService()
