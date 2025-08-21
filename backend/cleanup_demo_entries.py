#!/usr/bin/env python3
"""
Script to clean up demo user entries and create meaningful demo diary entries
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.firestore_service import firestore_service
from app.utils.auth import hash_password
from datetime import datetime, timezone, timedelta

def cleanup_and_create_demo_entries():
    """Clean up demo user entries and create meaningful demo entries"""
    
    print("🧹 Cleaning up demo user entries...")
    
    # Get demo user
    demo_email = "demo@example.com"
    user_result = firestore_service.get_user_by_email(demo_email)
    
    if not user_result.get("success"):
        print("❌ Failed to get demo user")
        return False
    
    if not user_result.get("user"):
        print("❌ Demo user not found, creating...")
        # Create demo user if it doesn't exist
        demo_user = {
            "email": demo_email,
            "username": "demo",
            "full_name": "Demo User",
            "hashed_password": hash_password("demo123"),
            "bio": "Pre-seeded demo account",
        }
        user_result = firestore_service.create_user(demo_user)
        if not user_result.get("success"):
            print("❌ Failed to create demo user")
            return False
    
    user_id = user_result["user"]["id"]
    print(f"✅ Demo user found/created: {user_id}")
    
    # Clear all existing entries
    clear_result = firestore_service.clear_all_diary_entries(user_id)
    if clear_result.get("success"):
        print(f"✅ Cleared {clear_result.get('deleted_count', 0)} existing entries")
    else:
        print(f"❌ Failed to clear entries: {clear_result.get('error')}")
    
    # Create meaningful demo entries
    demo_entries = [
        {
            "title": "İlk İş Günüm",
            "content": """Bugün yeni işime başladım ve gerçekten heyecanlıyım! Ofis çok modern ve arkadaş canlısı bir ortam. İlk gün olduğu için biraz gergindim ama takım arkadaşlarım çok yardımcı oldu. Öğle yemeğinde hep birlikte gittik ve projeler hakkında konuştuk. Yeni teknolojiler öğreneceğim ve kariyerimde büyük bir adım atacağım. Akşam eve dönerken kendimi çok mutlu hissettim. Bu yeni başlangıç benim için harika bir fırsat olacak.""",
            "location": "İstanbul, Levent",
            "mood": "Mutlu",
            "created_at": datetime.now(timezone.utc) - timedelta(days=7)
        },
        {
            "title": "Parkta Güzel Bir Gün",
            "content": """Hafta sonu Emirgan Korusu'nda harika bir gün geçirdim. Sabah erken kalktım ve güneş doğarken parka gittim. Lale bahçeleri muhteşemdi, her renk tonunda çiçekler açmıştı. Kitabımı aldım ve bir bankta oturup okudum. Kuş sesleri, çocukların kahkahaları ve doğanın huzuru beni çok rahatlattı. Öğleden sonra bir dondurma aldım ve sahilde yürüyüş yaptım. Boğaz'ın maviliği ve ferahlığı beni büyüledi. Bu tür günler hayatın güzel yanlarını hatırlatıyor.""",
            "location": "İstanbul, Emirgan Korusu",
            "mood": "Huzurlu",
            "created_at": datetime.now(timezone.utc) - timedelta(days=5)
        },
        {
            "title": "Ailemle Akşam Yemeği",
            "content": """Bugün annem ve babamla birlikte akşam yemeği yedik. Annem en sevdiğim yemeklerden olan mantı yapmıştı. Mutfakta birlikte çalıştık, hamur açtık, iç harcı hazırladık. Bu süreçte çocukluğumdan beri unutamadığım anılarımızı konuştuk. Babam eski hikayelerini anlattı, annem de aile fotoğraflarını çıkardı. Bu tür anların değerini daha iyi anlıyorum artık. Ailemle geçirdiğim her an çok kıymetli. Yemekten sonra birlikte film izledik ve güzel sohbetler ettik.""",
            "location": "İstanbul, Kadıköy",
            "mood": "Sıcak",
            "created_at": datetime.now(timezone.utc) - timedelta(days=3)
        },
        {
            "title": "Yeni Bir Hobi Keşfettim",
            "content": """Bugün arkadaşımın önerisiyle resim kursuna başladım. Hiç resim yapmayı bilmiyordum ama içimde hep bir sanat tutkusu vardı. İlk derste basit çizim tekniklerini öğrendik. Kalem tutmayı bile doğru yapamıyordum başta, ama öğretmen çok sabırlıydı. Birkaç saat sonra basit bir natürmort çizdim ve gerçekten gurur duydum. Bu yeni hobi beni çok heyecanlandırıyor. Her hafta yeni şeyler öğreneceğim ve belki de gizli bir yeteneğim vardır. Sanatın insanı nasıl rahatlattığını da keşfettim.""",
            "location": "İstanbul, Beşiktaş",
            "mood": "Heyecanlı",
            "created_at": datetime.now(timezone.utc) - timedelta(days=2)
        },
        {
            "title": "Zorlu Bir Gün",
            "content": """Bugün gerçekten zorlu bir gündü. İşte beklenmedik bir problem çıktı ve tüm gün onu çözmeye çalıştım. Müşteri çok baskı yapıyordu ve ben de stres altında kaldım. Öğle yemeğini bile düzgün yiyemedim. Ama sonunda problemi çözdüm ve bu beni çok rahatlattı. Bu tür zorlukların bizi güçlendirdiğini düşünüyorum. Akşam eve dönerken kendimi yorgun ama başarılı hissettim. Bu deneyimden çok şey öğrendim ve gelecekte benzer durumlarla daha iyi başa çıkabileceğimi biliyorum.""",
            "location": "İstanbul, Maslak",
            "mood": "Yorgun",
            "created_at": datetime.now(timezone.utc) - timedelta(days=1)
        },
        {
            "title": "Eski Arkadaşımla Buluşma",
            "content": """Bugün üniversiteden arkadaşım Ahmet'le buluştum. Uzun zamandır görüşmüyorduk çünkü farklı şehirlerde yaşıyoruz. Onu karşımda görünce çok mutlu oldum. Eski günlerimizi konuştuk, üniversite anılarımızı hatırladık. O da çok değişmiş, olgunlaşmış. Kariyerinde başarılı olmuş ve yeni hedefleri var. Bu buluşma bana da ilham verdi. Bazen eski arkadaşlarla görüşmek insanı motive ediyor. Akşam birlikte güzel bir yemek yedik ve gelecek planlarımızı konuştuk. Bu tür dostluklar hayatta çok değerli.""",
            "location": "İstanbul, Nişantaşı",
            "mood": "Nostaljik",
            "created_at": datetime.now(timezone.utc) - timedelta(hours=6)
        },
        {
            "title": "Sabah Koşusu",
            "content": """Bu sabah erken kalktım ve koşuya çıktım. Hava çok güzeldi, güneş yeni doğmuştu. Belgrad Ormanı'nda koştum ve doğanın huzurunu hissettim. Kuş sesleri, ağaçların arasından süzülen güneş ışıkları beni çok rahatlattı. 5 kilometre koştum ve kendimi çok iyi hissettim. Spor yapmanın hem beden hem de ruh sağlığı için ne kadar önemli olduğunu bir kez daha anladım. Koşu sırasında düşüncelerimi toparladım ve gün için planlar yaptım. Bu rutini devam ettirmek istiyorum.""",
            "location": "İstanbul, Belgrad Ormanı",
            "mood": "Enerjik",
            "created_at": datetime.now(timezone.utc) - timedelta(hours=2)
        }
    ]
    
    print("📝 Creating meaningful demo entries...")
    created_ids = []
    
    for i, entry in enumerate(demo_entries, 1):
        print(f"  Creating entry {i}/7: {entry['title']}")
        
        # Create entry with custom timestamp
        entry_data = {
            "title": entry["title"],
            "content": entry["content"],
            "location": entry["location"],
            "mood": entry["mood"],
            "created_at": entry["created_at"],
            "updated_at": entry["created_at"]
        }
        
        result = firestore_service.create_diary_entry(user_id, entry_data)
        if result.get("success"):
            created_ids.append(result.get("entry_id"))
            print(f"    ✅ Created: {result.get('entry_id')}")
        else:
            print(f"    ❌ Failed: {result.get('error')}")
    
    print(f"\n🎉 Demo cleanup completed!")
    print(f"✅ Created {len(created_ids)} new meaningful diary entries")
    print(f"📊 Demo user ID: {user_id}")
    print(f"📧 Demo email: {demo_email}")
    
    return True

if __name__ == "__main__":
    cleanup_and_create_demo_entries()
