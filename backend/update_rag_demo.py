#!/usr/bin/env python3
"""
Script to update RAG coaching service with new demo entries
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.rag_coaching import rag_coaching_service
from datetime import datetime, timezone, timedelta

def update_rag_demo_entries():
    """Update RAG coaching service with new demo entries"""
    
    print("🔄 Updating RAG coaching service with new demo entries...")
    
    # Clear existing demo data
    try:
        rag_coaching_service.clear_demo_data()
        print("✅ Cleared existing demo data")
    except Exception as e:
        print(f"⚠️ Could not clear existing data: {e}")
    
    # New demo entries that match our diary entries
    demo_entries = [
        {
            "id": "demo_1",
            "content": """Bugün yeni işime başladım ve gerçekten heyecanlıyım! Ofis çok modern ve arkadaş canlısı bir ortam. İlk gün olduğu için biraz gergindim ama takım arkadaşlarım çok yardımcı oldu. Öğle yemeğinde hep birlikte gittik ve projeler hakkında konuştuk. Yeni teknolojiler öğreneceğim ve kariyerimde büyük bir adım atacağım. Akşam eve dönerken kendimi çok mutlu hissettim. Bu yeni başlangıç benim için harika bir fırsat olacak.""",
            "emotion": "mutlu",
            "date": (datetime.now(timezone.utc) - timedelta(days=7)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Levent",
            "tags": ["iş", "kariyer", "yeni başlangıç", "heyecan", "takım", "teknoloji"]
        },
        {
            "id": "demo_2",
            "content": """Hafta sonu Emirgan Korusu'nda harika bir gün geçirdim. Sabah erken kalktım ve güneş doğarken parka gittim. Lale bahçeleri muhteşemdi, her renk tonunda çiçekler açmıştı. Kitabımı aldım ve bir bankta oturup okudum. Kuş sesleri, çocukların kahkahaları ve doğanın huzuru beni çok rahatlattı. Öğleden sonra bir dondurma aldım ve sahilde yürüyüş yaptım. Boğaz'ın maviliği ve ferahlığı beni büyüledi. Bu tür günler hayatın güzel yanlarını hatırlatıyor.""",
            "emotion": "huzurlu",
            "date": (datetime.now(timezone.utc) - timedelta(days=5)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Emirgan Korusu",
            "tags": ["doğa", "park", "kitap", "huzur", "lale", "boğaz", "yürüyüş"]
        },
        {
            "id": "demo_3",
            "content": """Bugün annem ve babamla birlikte akşam yemeği yedik. Annem en sevdiğim yemeklerden olan mantı yapmıştı. Mutfakta birlikte çalıştık, hamur açtık, iç harcı hazırladık. Bu süreçte çocukluğumdan beri unutamadığım anılarımızı konuştuk. Babam eski hikayelerini anlattı, annem de aile fotoğraflarını çıkardı. Bu tür anların değerini daha iyi anlıyorum artık. Ailemle geçirdiğim her an çok kıymetli. Yemekten sonra birlikte film izledik ve güzel sohbetler ettik.""",
            "emotion": "sıcak",
            "date": (datetime.now(timezone.utc) - timedelta(days=3)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Kadıköy",
            "tags": ["aile", "yemek", "nostalji", "anılar", "mantı", "film"]
        },
        {
            "id": "demo_4",
            "content": """Bugün arkadaşımın önerisiyle resim kursuna başladım. Hiç resim yapmayı bilmiyordum ama içimde hep bir sanat tutkusu vardı. İlk derste basit çizim tekniklerini öğrendik. Kalem tutmayı bile doğru yapamıyordum başta, ama öğretmen çok sabırlıydı. Birkaç saat sonra basit bir natürmort çizdim ve gerçekten gurur duydum. Bu yeni hobi beni çok heyecanlandırıyor. Her hafta yeni şeyler öğreneceğim ve belki de gizli bir yeteneğim vardır. Sanatın insanı nasıl rahatlattığını da keşfettim.""",
            "emotion": "heyecanlı",
            "date": (datetime.now(timezone.utc) - timedelta(days=2)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Beşiktaş",
            "tags": ["hobi", "sanat", "resim", "kurs", "yetenek", "öğrenme"]
        },
        {
            "id": "demo_5",
            "content": """Bugün gerçekten zorlu bir gündü. İşte beklenmedik bir problem çıktı ve tüm gün onu çözmeye çalıştım. Müşteri çok baskı yapıyordu ve ben de stres altında kaldım. Öğle yemeğini bile düzgün yiyemedim. Ama sonunda problemi çözdüm ve bu beni çok rahatlattı. Bu tür zorlukların bizi güçlendirdiğini düşünüyorum. Akşam eve dönerken kendimi yorgun ama başarılı hissettim. Bu deneyimden çok şey öğrendim ve gelecekte benzer durumlarla daha iyi başa çıkabileceğimi biliyorum.""",
            "emotion": "yorgun",
            "date": (datetime.now(timezone.utc) - timedelta(days=1)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Maslak",
            "tags": ["iş", "problem", "stres", "başarı", "öğrenme", "zorluk"]
        },
        {
            "id": "demo_6",
            "content": """Bugün üniversiteden arkadaşım Ahmet'le buluştum. Uzun zamandır görüşmüyorduk çünkü farklı şehirlerde yaşıyoruz. Onu karşımda görünce çok mutlu oldum. Eski günlerimizi konuştuk, üniversite anılarımızı hatırladık. O da çok değişmiş, olgunlaşmış. Kariyerinde başarılı olmuş ve yeni hedefleri var. Bu buluşma bana da ilham verdi. Bazen eski arkadaşlarla görüşmek insanı motive ediyor. Akşam birlikte güzel bir yemek yedik ve gelecek planlarımızı konuştuk. Bu tür dostluklar hayatta çok değerli.""",
            "emotion": "nostaljik",
            "date": (datetime.now(timezone.utc) - timedelta(hours=6)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Nişantaşı",
            "tags": ["arkadaş", "üniversite", "nostalji", "kariyer", "ilham", "dostluk"]
        },
        {
            "id": "demo_7",
            "content": """Bu sabah erken kalktım ve koşuya çıktım. Hava çok güzeldi, güneş yeni doğmuştu. Belgrad Ormanı'nda koştum ve doğanın huzurunu hissettim. Kuş sesleri, ağaçların arasından süzülen güneş ışıkları beni çok rahatlattı. 5 kilometre koştum ve kendimi çok iyi hissettim. Spor yapmanın hem beden hem de ruh sağlığı için ne kadar önemli olduğunu bir kez daha anladım. Koşu sırasında düşüncelerimi toparladım ve gün için planlar yaptım. Bu rutini devam ettirmek istiyorum.""",
            "emotion": "enerjik",
            "date": (datetime.now(timezone.utc) - timedelta(hours=2)).strftime('%Y-%m-%d'),
            "location": "İstanbul, Belgrad Ormanı",
            "tags": ["spor", "koşu", "doğa", "sağlık", "rutin", "enerji"]
        }
    ]
    
    print("📝 Adding new demo entries to RAG system...")
    added_count = 0
    
    for i, entry in enumerate(demo_entries, 1):
        print(f"  Adding entry {i}/7: {entry['id']}")
        
        try:
            result = rag_coaching_service.add_diary_entry(
                content=entry["content"],
                emotion=entry["emotion"],
                date=entry["date"],
                location=entry["location"],
                tags=entry["tags"],
                entry_id=entry["id"],
                user_id="demo_user"
            )
            
            if result.get("success"):
                added_count += 1
                print(f"    ✅ Added successfully")
            else:
                print(f"    ❌ Failed: {result.get('error', 'Unknown error')}")
                
        except Exception as e:
            print(f"    ❌ Error: {e}")
    
    print(f"\n🎉 RAG demo update completed!")
    print(f"✅ Added {added_count}/7 demo entries to RAG system")
    print(f"🤖 AI Coach is now ready to answer questions about your demo entries")
    
    return True

if __name__ == "__main__":
    update_rag_demo_entries()
