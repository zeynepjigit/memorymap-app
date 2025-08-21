import chromadb
import json
import os
from typing import List, Dict, Optional
from datetime import datetime
import uuid
from sentence_transformers import SentenceTransformer
from .providers.embed_openai import OpenAIEmbeddingsProvider
import numpy as np
# Explainable AI import'u lazy loading ile yapılacak

class RAGCoachingService:
    def __init__(self):
        """RAG tabanlı coaching servisi başlatıcısı"""
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection_name = "diary_entries"
        # Prefer OpenAI embeddings if available; fallback to local SBERT
        self.embedding_provider = None
        try:
            self.embedding_provider = OpenAIEmbeddingsProvider()
        except Exception:
            self.embedding_provider = None
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2') if self.embedding_provider is None else None
        
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
                    entry_id=entry["id"],
                    user_id="demo_user"
                )
            
            print("Demo veriler başarıyla yüklendi.")
            
        except Exception as e:
            print(f"Demo veriler yüklenirken hata: {str(e)}")

    def seed_demo_for_user(self, user_id: str) -> Dict:
        """Belirli bir kullanıcı için küçük bir demo seti ekler"""
        try:
            samples = [
                {
                    "content": "Getting started with MemoryMap! This is your first demo entry.",
                    "emotion": "neutral",
                    "date": datetime.now().strftime('%Y-%m-%d'),
                    "location": "",
                    "tags": ["demo", "intro"],
                },
                {
                    "content": "Had a productive day and felt motivated.",
                    "emotion": "motivated",
                    "date": datetime.now().strftime('%Y-%m-%d'),
                    "location": "",
                    "tags": ["productivity", "positive"],
                },
            ]
            for s in samples:
                self.add_diary_entry(
                    content=s["content"],
                    emotion=s["emotion"],
                    date=s["date"],
                    location=s["location"],
                    tags=s["tags"],
                    user_id=user_id,
                )
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def add_diary_entry(self, content: str, emotion: str, date: str, 
                       location: str = "", tags: List[str] = None, entry_id: str = None, user_id: str = "demo_user") -> Dict:
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
                "created_at": datetime.now().isoformat(),
                "user_id": user_id
            }
            
            # Embedding oluştur
            if self.embedding_provider is not None:
                embedding = self.embedding_provider.embed([content])[0]
            else:
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
    
    def query_diary(self, question: str, top_k: int = 5, user_id: Optional[str] = None) -> Dict:
        """Kullanıcı sorusuna göre günlük girdilerini sorgular"""
        try:
            # Soruyu vektörleştir
            if self.embedding_provider is not None:
                query_embedding = self.embedding_provider.embed([question])[0]
            else:
                query_embedding = self.embedding_model.encode(question).tolist()
            
            # Benzer girdileri bul
            where_filter = {"user_id": user_id} if user_id else None
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=["documents", "metadatas", "distances"],
                where=where_filter
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

    def sync_user_diaries_from_firestore(self, user_id: str) -> Dict:
        """Firestore'daki kullanıcının günlüklerini ChromaDB'ye indeksler."""
        try:
            # Lazy import to avoid heavy deps at import time
            from ..services.firestore_service import firestore_service  # type: ignore

            entries_res = firestore_service.get_diary_entries(user_id=user_id, limit=200)
            if not entries_res.get("success"):
                return {"success": False, "error": entries_res.get("error", "unknown firestore error")}

            entries = entries_res.get("entries", [])
            for e in entries:
                content = e.get("content") or e.get("text") or e.get("title") or ""
                if not content:
                    continue
                emotion = e.get("mood") or e.get("emotion") or ""
                date_str = ""
                # Try multiple date fields
                for key in ["date", "created_at", "updated_at"]:
                    val = e.get(key)
                    if val:
                        try:
                            # Firestore timestamp to iso
                            date_str = str(val)[:10]
                            break
                        except Exception:
                            continue

                tags = []
                if isinstance(e.get("tags"), list):
                    tags = e.get("tags")

                self.add_diary_entry(
                    content=content,
                    emotion=emotion,
                    date=date_str or datetime.now().strftime('%Y-%m-%d'),
                    location=e.get("location", ""),
                    tags=tags,
                    entry_id=e.get("id"),
                    user_id=user_id,
                )

            return {"success": True, "indexed_count": len(entries)}
        except Exception as e:
            return {"success": False, "error": f"Sync failed: {str(e)}"}
    
    def get_emotional_insights(self, user_id: str = None) -> Dict:
        """Kullanıcının duygu durumu analizini yapar"""
        try:
            # Tüm girdileri al
            if user_id:
                all_entries = self.collection.get(where={"user_id": user_id})
            else:
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

    def clear_demo_data(self) -> Dict:
        """Demo verilerini temizler"""
        try:
            # Demo user'a ait tüm verileri sil
            self.collection.delete(
                where={"user_id": "demo_user"}
            )
            return {"success": True, "message": "Demo data cleared successfully"}
        except Exception as e:
            return {"success": False, "error": f"Failed to clear demo data: {str(e)}"}

# Global instance
rag_coaching_service = RAGCoachingService()
