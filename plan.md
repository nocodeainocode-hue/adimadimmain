# plan.md — Lotus Su Arıtma Web Sitesi (Branched Wizard)

## 1. Objectives
- Ziyaretçiyi tek sayfada, büyük hero banner + “Nasıl yardımcı olabiliriz?” formu ile doğru akışa sokmak.
- 3 akışı eksiksiz çalıştırmak: **Cihaz Satın Alma önerisi**, **Filtre seti önerisi**, **Arıza yönlendirmesi + WhatsApp CTA**.
- Premium, lotus-ilhamlı UI: **mavi/yeşil su teması yok** (plum/rose-gold/charcoal gibi).
- Backend’den konfigürasyonla (cihazlar, filtre fiyatları placeholder, arıza metinleri, WhatsApp no) yönetilebilir hale getirmek.
- Lead/DB kaydı yok; WhatsApp deep link ile yönlendirme.

## 2. Implementation Steps

### Phase 1 — Core Flow POC (Skip)
- Uygulama basit bir branching wizard + wa.me link; karmaşık entegrasyon yok → POC fazı yapılmayacak.

### Phase 2 — V1 App Development (MVP)
**User stories (V1)**
1. Kullanıcı olarak, siteye girince tek ekranda 3 seçenekten birini seçip hızlıca ilerlemek isterim.
2. Kullanıcı olarak, bütçemi ve tüketimimi seçince bana uygun cihazları liste halinde görmek isterim.
3. Kullanıcı olarak, filtre değişim zamanımı seçince doğru filtre seti ve fiyatını görmek isterim.
4. Kullanıcı olarak, arıza tipimi seçince ne yapacağımı anlatan kısa bir açıklama ve WhatsApp butonu görmek isterim.
5. Kullanıcı olarak, adımlar arasında geri gidip seçimimi değiştirebilmek isterim.

**2.1 UX/UI Tasarım (shadcn/ui)**
- Tema: dark/neutral taban + lotus vurgu renkleri (örn. charcoal + plum + rose-gold). Mavi/yeşil yasak.
- Sayfa yapısı: Header (Lotus Su Arıtma) + Hero (value prop) + Wizard card.
- Wizard: stepper/progress, back/forward, animasyonlu geçiş (hafif), mobil uyum.

**2.2 Frontend (React) — Branching Wizard**
- Rotalar: tek sayfa (/) + opsiyonel /admin yok.
- State modeli:
  - `entryChoice`: buy/filter/fault
  - `buyFlow`: budgetRange, consumption, results
  - `filterFlow`: lastChanged, recommendedSet
  - `faultFlow`: faultType, guidance
- Validasyon: seçim yapılmadan ilerleme yok; reset/baştan başla.
- Cihaz satın alma akışı:
  - Soru 1: Bütçe (örn. 0-7k / 7k-12k / 12k+)
  - Soru 2: Su tüketimi (Az/Orta/Yüksek veya kişi sayısı)
  - Sonuç: backend’den gelen cihazları filtrele (budget+capacity tags) ve kartlarla göster (placeholder image).
- Filtre akışı:
  - “En son ne zaman değiştirildi?” (6 ay / 1 yıl / bilmiyorum)
  - Mapping: 6 ay → 3’lü set, 1 yıl → 5’li set, bilmiyorum → 5’li set
  - Fiyatlar: placeholder ama belirgin etiketli (“Fiyat: ₺X (sonradan güncellenecek)”).
- Arıza akışı:
  - Seçenek: su damlatıyor / su az akıyor / sızıntı var
  - Sonuç: ilgili kısa açıklama + “WhatsApp’tan Yaz” butonu (wa.me deep link; demo numara).

**2.3 Backend (FastAPI) — Config API**
- Endpoint: `GET /api/config`
  - `brand`, `themeHints`
  - `whatsappNumber` (demo)
  - `devices[]`: id, name, price, badges, capacityTag, budgetTag(s), specs, imageUrl (placeholder)
  - `filterSets`: {set3: {name, pricePlaceholder}, set5: {...}}
  - `faultGuides`: map faultType → title, body, tips
- CORS ayarı (frontend dev origin).
- MongoDB: kullanılmayacak (opsiyonel; bu V1’de kapalı).

**2.4 Data (Demo içerikler)**
- 4–6 demo cihaz: farklı bütçe/kapasite segmentleri, kısa teknik maddeler.
- Placeholder görseller: sabit `/assets/placeholder-device.png`.
- Arıza metinleri: kısa, güven verici; “servis için WhatsApp” CTA.

**2.5 QA / Testing (V1 sonunda)**
- Testing agent ile E2E kontrol:
  - Tüm akışlar (3 seçenek) tamamlanıyor mu?
  - Back navigation ve reset doğru mu?
  - Mobil responsive (en az 375px) bozuluyor mu?
  - WhatsApp link doğru formatta mı (wa.me)?
  - Config API down olursa graceful error + retry var mı?

### Phase 3 — Refinement + Production Hardening
**User stories (Refinement)**
1. Kullanıcı olarak, seçimlerim değişince sonuçların anında güncellenmesini isterim.
2. Kullanıcı olarak, sonuç kartlarında “Önerilen” gibi rozetlerle neyin neden çıktığını anlamak isterim.
3. Kullanıcı olarak, arıza ekranında servis öncesi güvenli kontrol adımlarını görmek isterim.
4. Kullanıcı olarak, sayfa çok hızlı açılsın ve animasyonlar takılmasın isterim.
5. İşletme olarak, cihaz/veri değişikliklerini tek bir config dosyasından kolayca güncellemek isterim.

- Cihaz öneri mantığı iyileştirme (skor bazlı sıralama: bütçe uyumu + kapasite uyumu).
- UI polish: skeleton loading, empty-state açıklamaları, erişilebilirlik (ARIA, klavye ile kullanım).
- SEO basics: title/description, OG tags, favicon.
- Content revizyon: Hero metinleri, CTA kopyaları.
- Tekrar testing agent: tüm akışlar + edge-case’ler.

### Phase 4 — Optional Next Features (User onayıyla)
**User stories (Optional)**
1. İşletme olarak, filtre fiyatlarını panelden güncelleyebilmek isterim.
2. İşletme olarak, cihaz kataloğunu panelden yönetebilmek isterim.
3. Kullanıcı olarak, WhatsApp mesajı otomatik doldurulsun (seçimlerimle) isterim.
4. Kullanıcı olarak, cihazları karşılaştırma tablosunda görmek isterim.
5. İşletme olarak, çoklu şube/telefon numarası seçtirebilmek isterim.

- Mini admin sayfası veya JSON config upload.
- WhatsApp prefilled message: seçilen akış + cihaz/filtre/arızayı query ile ekleme.
- (İstenirse) MongoDB ile basit içerik yönetimi.

## 3. Next Actions
- (Sizden) 3’lü ve 5’li filtre seti **nihai fiyatlarını** gönderin (para birimi/format ile).
- (Sizden) Cihaz isimleri/segmentleri için tercih var mı? (yoksa demo isimlerle başlayacağız).
- Uygulama iskeletini kur: React + shadcn/ui + FastAPI `/api/config`.
- Tema/renk paletini belirle (mavi/yeşil hariç) ve hero + wizard tasarımını uygula.

## 4. Success Criteria
- Tek sayfada 3 akışın tamamı sorunsuz çalışır; geri/ileri ve reset stabil.
- Cihaz önerileri bütçe + tüketim seçimlerine göre tutarlı filtrelenir ve listelenir.
- Filtre akışı doğru seti (3’lü/5’li) doğru koşullarda gösterir; fiyat placeholder net etiketlidir.
- Arıza akışı doğru açıklamayı gösterir ve WhatsApp butonu doğru wa.me linkine gider.
- UI premium görünür (mavi/yeşil yok), mobilde ve desktop’ta bozulmaz; config API hatasında kullanıcıya anlaşılır mesaj verir.
