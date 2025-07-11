# Teknoloji ve Araçlar (Tech Stack)

## Kullanılacak Teknolojiler ve Araçlar

### Ön Yüz (Frontend)
- **React.js (Web):** Modern, bileşen tabanlı kullanıcı arayüzü geliştirme. Kullanıcıların günlük girişi, harita ve galeri gibi etkileşimli modülleri sağlar.
- **React Native (Mobil):** iOS ve Android için tek kod tabanından mobil uygulama geliştirme. Push bildirim, kamera ve galeri entegrasyonu için uygundur.
- **Leaflet.js:** OpenStreetMap tabanlı harita görselleştirme. Kullanıcı anılarının mekânsal olarak işaretlenmesi ve harita üzerinde detay gösterimi için kullanılır.
- **OpenStreetMap API:** Yer isimlerinin koordinatlara dönüştürülmesi ve harita verisi sağlanması.

### Arka Uç (Backend)
- **FastAPI (Python):** Yüksek performanslı, asenkron RESTful API geliştirme. Kullanıcı yönetimi, günlük işleme, AI entegrasyonları ve bildirim yönetimi için ana iş mantığı burada çalışır.
- **Python:** AI modellerinin entegrasyonu, veri işleme ve API geliştirme için ana programlama dili.

### Veritabanı
- **Supabase (PostgreSQL):** Kullanıcı, günlük, analiz ve görsel verilerinin güvenli ve ölçeklenebilir şekilde saklanması. Gerçek zamanlı veri güncellemeleri ve kimlik doğrulama desteği.

### Medya Depolama
- **Firebase Storage:** Kullanıcıya ait görsel ve medya dosyalarının bulutta güvenli şekilde saklanması ve hızlı erişimi.

### Bildirimler
- **Firebase Cloud Messaging:** Mobil ve web uygulamalarına push bildirim göndermek için kullanılır. Hatırlatıcı ve motivasyonel mesajlar için uygundur.

### Analitik ve Telemetri
- **Google Analytics / Firebase Analytics:** Kullanıcı davranışlarının ve uygulama içi etkileşimlerin izlenmesi, raporlanması.
- **Özel Telemetri API'leri:** Kullanıcı alışkanlıkları, duygu değişimleri ve uygulama performansının izlenmesi için ek veri toplama.

### Diğer Entegrasyonlar
- **JWT (JSON Web Token):** Güvenli oturum yönetimi ve API erişim kontrolü.
- **HTTPS:** Tüm veri iletiminde güvenlik.

## Açık Kaynak AI Modelleri

### Duygu Analizi
- **HuggingFace Transformers:**
  - `distilbert-base-uncased-finetuned-sst-2-english` modeli ile İngilizce metinlerde duygu (pozitif/negatif) analizi.
  - Model, FastAPI backend'e entegre edilerek günlük metinleri otomatik işler.

### Yer/Mekân Çıkarımı
- **spaCy NER:**
  - Metinlerden yer, şehir, ülke gibi mekânsal varlıkların çıkarılması.
  - Türkçe ve İngilizce desteği için uygun modeller seçilebilir.
- **HuggingFace NER Modelleri:**
  - Alternatif olarak, HuggingFace'in çeşitli dillerdeki NER modelleri kullanılabilir.
- **OpenStreetMap API:**
  - Çıkarılan yer isimlerinin koordinatlara dönüştürülmesi.

### Görsel Üretimi
- **Stable Diffusion:**
  - Kullanıcı günlüklerinden alınan anahtar kelimelerle özgün görseller üretir.
  - Model, backend'de çalıştırılır ve üretilen görseller Firebase Storage'a kaydedilir.

### Koçluk Modülü
- **GPT-4 (OpenAI):**
  - Kullanıcıya reflektif sorular ve kişisel gelişim önerileri üretir.
  - API üzerinden erişim sağlanır.
- **phi-2 (Alternatif):**
  - Açık kaynak büyük dil modeli. Maliyet veya erişim kısıtlarında alternatif olarak kullanılabilir.

---

**Not:** Tüm AI modelleri, FastAPI backend'e entegre edilerek otomatik ve gerçek zamanlı analiz sağlar. Gerekli durumlarda modeller bulut tabanlı veya lokal olarak çalıştırılabilir. Her katmanda güvenlik, ölçeklenebilirlik ve veri gizliliği ön planda tutulur.

## İşlevsel Olmayan Gereksinimler (Özet)

- **Güvenlik:** Tüm veri iletiminde HTTPS, JWT tabanlı kimlik doğrulama, OWASP standartlarına uygunluk.
- **Performans:** Sayfa yüklenme süresi <2 sn, API yanıt süresi ortalama <500 ms (AI işlemleri hariç).
- **Erişilebilirlik:** Modern tarayıcılar ve mobil cihazlarla tam uyumluluk, %99,9 uptime.
- **Ölçeklenebilirlik:** Yatay ölçeklenebilir altyapı, artan kullanıcı ve veri hacmine karşı dayanıklı mimari.

## API ve Kullanıcı Rolleri (Referans)

- Temel API endpoint örnekleri ve kullanıcı rolleri için user-flow.md dosyasına bakınız. 