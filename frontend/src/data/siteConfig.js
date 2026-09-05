// Site Configuration, Devices, Filter Sets, Fault Guides & Custom Device Builder Config
// Pure static & client-side optimized (No backend/database dependency needed)

export const WHATSAPP_NUMBER = "905550000000"; // Replace with your real WhatsApp number
export const WHATSAPP_DISPLAY = "+90 555 000 00 00";

export const TEKIRDAG_DISTRICTS = [
  "Süleymanpaşa",
  "Çorlu",
  "Çerkezköy",
  "Kapaklı",
  "Ergene",
  "Marmaraereğlisi",
  "Saray",
  "Muratlı",
  "Malkara",
  "Hayrabolu",
  "Şarköy",
];

export const DEVICES = [
  {
    id: "lotus-essential",
    name: "Lotus Essential",
    price: "6.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Giriş seviyesi, kompakt tezgah altı arıtma",
    budgetTags: ["ekonomik"],
    consumptionTags: ["az"],
    capacity: "1-2 kişilik hane",
    badges: ["Kompakt", "Ekonomik"],
    specs: [
      "5 aşamalı filtrasyon",
      "Tezgah altı montaj",
      "Kompakt tank (8 L)",
      "Kolay filtre değişimi",
    ],
  },
  {
    id: "lotus-eco-plus",
    name: "Lotus Eco Plus",
    price: "8.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Fiyat/performans odaklı mineral zenginleştirici",
    budgetTags: ["ekonomik"],
    consumptionTags: ["az", "orta"],
    capacity: "2-3 kişilik hane",
    badges: ["Mineral Filtre", "Yüksek Verim"],
    specs: [
      "6 aşamalı filtrasyon",
      "Doğal mineral katkısı",
      "10 L çelik antibakteriyel tank",
      "Hızlı su akış musluğu",
    ],
  },
  {
    id: "lotus-balance",
    name: "Lotus Balance",
    price: "12.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Denge ve sessizlik odaklı günlük kullanım",
    budgetTags: ["orta"],
    consumptionTags: ["az", "orta"],
    capacity: "2-3 kişilik hane",
    badges: ["Sessiz Pompa", "Mineral Katkı"],
    specs: [
      "6 aşamalı filtrasyon",
      "Sessiz booster pompa",
      "Mineral zenginleştirme",
      "Akıllı sızıntı sensörü",
    ],
  },
  {
    id: "lotus-home",
    name: "Lotus Home",
    price: "14.500 ₺",
    isPlaceholderPrice: true,
    tagline: "Aileler için en çok tercih edilen model",
    budgetTags: ["orta"],
    consumptionTags: ["orta", "yuksek"],
    capacity: "3-4 kişilik hane",
    badges: ["En Çok Tercih Edilen", "Alkali Su"],
    specs: [
      "7 aşamalı filtrasyon",
      "Alkali & mineral filtre (pH 8.5+)",
      "12 L çelik depo",
      "Dijital filtre ömrü göstergesi",
    ],
  },
  {
    id: "lotus-comfort-pro",
    name: "Lotus Comfort Pro",
    price: "17.800 ₺",
    isPlaceholderPrice: true,
    tagline: "Yüksek arıtma kapasitesi ve ekstra mineral desteği",
    budgetTags: ["orta"],
    consumptionTags: ["orta", "yuksek"],
    capacity: "4-5 kişilik hane",
    badges: ["Yüksek Kapasite", "Garantili Membran"],
    specs: [
      "7 aşamalı filtrasyon",
      "NSF onaylı ithal membran",
      "Sessiz basma pompası",
      "Basınç regülatörü ve sızıntı emniyeti",
    ],
  },
  {
    id: "lotus-premium-pro",
    name: "Lotus Premium Pro",
    price: "24.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Yüksek performans + alkali & detoks teknolojisi",
    budgetTags: ["premium"],
    consumptionTags: ["az", "orta", "yuksek"],
    capacity: "4-5 kişilik hane",
    badges: ["Premium", "Alkali & Detoks"],
    specs: [
      "8 aşamalı ileri filtrasyon",
      "Alkali + mineral + detoks filtre",
      "UV sterilizasyon modülü",
      "Akıllı ekran & filtre takip sistemi",
    ],
  },
  {
    id: "lotus-maxflow",
    name: "Lotus MaxFlow Direct",
    price: "29.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Tanksız, doğrudan akış — yoğun kullanım için",
    budgetTags: ["premium"],
    consumptionTags: ["orta", "yuksek"],
    capacity: "5+ kişilik hane / ofis",
    badges: ["Tanksız", "800 GPD Yüksek Debi"],
    specs: [
      "Tanksız direkt taze su akışı",
      "800 GPD yüksek kapasiteli membran",
      "Anlık TDS su kalitesi göstergesi",
      "Kompakt ve zarif tezgah altı tasarım",
    ],
  },
  {
    id: "lotus-elite-smart",
    name: "Lotus Elite Smart Touch",
    price: "34.900 ₺",
    isPlaceholderPrice: true,
    tagline: "Dokunmatik akıllı batarya, UV arıtma ve mineral optimizasyonu",
    budgetTags: ["premium"],
    consumptionTags: ["az", "orta", "yuksek"],
    capacity: "Her haneye uygun ultra lüks",
    badges: ["Ultra Lüks", "Akıllı Batarya"],
    specs: [
      "9 aşamalı moleküler filtrasyon",
      "Dokunmatik dijital akıllı batarya",
      "Entegre UV LED bakteri & virüs yok edici",
      "Ömür boyu servis & filtre takip garantisi",
    ],
  },
];

export const FILTER_SETS = {
  set3: {
    id: "set3",
    name: "3'lü Orijinal Ön Filtre Bakım Seti",
    subtitle: "Sediment (Tortu) + Granül Aktif Karbon + Blok Karbon",
    recommendedFor: "Son değişim ~6 ay önce",
    price: "950 ₺",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    desc: "Şebeke suyundaki çamur, pas, klor ve kimyasalları temizleyerek ana membranı koruyan 3'lü ön bakım paketi.",
    includes: [
      "1. Aşama: 5 Mikron Tortu & Sediment Filtresi",
      "2. Aşama: GAC Granül Aktif Karbon Klor Filtresi",
      "3. Aşama: CTO Blok Karbon Koku & Tat Filtresi",
      "Ücretsiz Hijyen Dezenfeksiyon & TDS Ölçümü",
    ],
    benefits: [
      "İlk 3 kademe ön arıtma tamamen yenilenir",
      "Klor ve kötü koku %99 oranında giderilir",
      "Ana RO membranın ömrünü 2 kat uzatır",
    ],
  },
  set5: {
    id: "set5",
    name: "5'li Tam Kapsamlı Orijinal Filtre Seti",
    subtitle: "3 Ön Filtre + İthal RO Membran + Doğal Mineral & Tatlandırıcı",
    recommendedFor: "Son değişim ~1 yıl önce veya bilinmiyor",
    price: "1.850 ₺",
    img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
    desc: "Tüm filtrelerin ve ana membranın sıfırlandığı, suyu tatlı memba lezzetine ve ideal mineral dengesine kavuşturan komple set.",
    includes: [
      "1. Aşama: 5 Mikron Tortu & Sediment Filtresi",
      "2. Aşama: GAC Granül Aktif Karbon Filtresi",
      "3. Aşama: CTO Blok Karbon Filtresi",
      "4. Aşama: NSF Onaylı 80 GPD İthal RO Membran",
      "5. Aşama: Post Karbon Hindistan Cevizi Tatlandırıcı",
      "Ücretsiz Tank Basınç Ayarı & Kaçak Kontrolü",
    ],
    benefits: [
      "Tüm filtrasyon kademeleri fabrika çıkışı gibi yenilenir",
      "Mikroskobik virüs, kireç ve ağır metaller %99.2 arıtılır",
      "Doğal mineral takviyesiyle tatlı memba suyu lezzeti",
    ],
  },
};

export const FAULT_GUIDES = [
  {
    id: "damla",
    label: "Su damlatıyor",
    title: "Cihazınız su damlatıyor",
    body: "Musluk veya cihaz gövdesinden gelen damlama, genellikle gevşeyen bir bağlantı, aşınmış bir conta ya da dolmuş bir tahliye hattından kaynaklanır. Çoğu zaman basit bir bağlantı sıkımı veya conta değişimi ile çözülür.",
    tips: [
      "Cihazın besleme (giriş) vanasını kapatın.",
      "Damlamanın musluktan mı yoksa gövdeden mi geldiğini not edin.",
      "Zemine bir bez/kap koyarak su birikmesini önleyin.",
    ],
    cta: "Damlama noktasını fotoğraflayıp WhatsApp'tan gönderin, ekibimiz en uygun çözümü yönlendirsin.",
  },
  {
    id: "az_akis",
    label: "Su çok az akıyor",
    title: "Sudaki akış çok azaldı",
    body: "Debinin düşmesi çoğunlukla tıkanmış filtreler, tankta basınç kaybı veya membranın ömrünü tamamlaması ile ilgilidir. Genellikle filtre/membran değişimi veya tank basınç ayarı ile normale döner.",
    tips: [
      "Filtrelerin en son ne zaman değiştiğini hatırlamaya çalışın.",
      "Musluğu birkaç dakika açık tutup akışın değişip değişmediğine bakın.",
      "Cihaz modelini biliyorsanız not alın.",
    ],
    cta: "Cihaz modelinizi ve son filtre değişim tarihinizi WhatsApp'tan iletin, hızlıca çözelim.",
  },
  {
    id: "sizinti",
    label: "Sızıntı var",
    title: "Cihaz altında veya hortumda su birikiyor",
    body: "Gözle görülür su birikintisi, genellikle hızlı bağlantı rekorlarının o-ring aşınmasından, yüksek şebeke basıncından veya çatlamış bir filtre kabından kaynaklanır. Hızlı müdahale önemlidir.",
    tips: [
      "Ana besleme vanasını derhal kapatın.",
      "Varsa pompalı modellerde fişi prizden çekin.",
      "Hortum giriş-çıkış noktalarını kurulayıp sızıntının kaynağını tespit edin.",
    ],
    cta: "Sızıntının olduğu yeri fotoğraflayıp WhatsApp'tan paylaşın; servis ekibimiz acil destek sağlasın.",
  },
  {
    id: "tat_koku",
    label: "Tatta / kokuda gariplik",
    title: "Suyun tadı veya kokusu değişti",
    body: "Su tadındaki acılaşma, klor kokusu veya tat kaybı; karbon filtrelerin doygunluğa ulaşması, membranın yıpranması ya da tank içinde suyun beklemesinden kaynaklanır.",
    tips: [
      "En son ne zaman filtre değiştiğini kontrol edin (önerilen: 6–12 ay).",
      "Depodaki suyu tamamen tahliye edip yeni su dolumunu bekleyin.",
      "Sorun devam ediyorsa filtre/membran yenileme zamanı gelmiştir.",
    ],
    cta: "Mevcut filtrelerinizi WhatsApp'tan bize bildirin, uygun filtre paketini aynı gün ulaştıralım.",
  },
  {
    id: "ses",
    label: "Anormal ses geliyor",
    title: "Cihazdan tıkırtı, uğultu veya titreme sesi geliyor",
    body: "Sesli çalışma çoğunlukla booster pompanın hava yapması, diyafram aşınması, montaj şasesinin gevşemesi ya da düşük su basıncı kaynaklıdır.",
    tips: [
      "Giriş suyu vanasının tam açık olduğundan emin olun.",
      "Cihazın duvara veya dolap kapağına temas edip titreşim yapmadığını kontrol edin.",
      "Ses pompadan geliyorsa cihazı dinlendirip tekrar gözlemleyin.",
    ],
    cta: "Gelen sesin kısa bir videosunu WhatsApp'tan gönderin, ustamız hemen dinleyip teşhis koysun.",
  },
  {
    id: "diger",
    label: "Başka bir sorun",
    title: "Farklı bir arıza veya sorunuz mu var?",
    body: "Yukarıdaki başlıklara uymayan her türlü teknik soru, basınç problemi, montaj yeri değişikliği veya periyodik bakım talebi için doğrudan ustalarımızla görüşebilirsiniz.",
    tips: [
      "Cihazın markasını ve modelini öğrenin.",
      "Yaşadığınız sorunu kısaca not edin.",
      "Tekirdağ içi aynı gün yerinde servis imkanından yararlanın.",
    ],
    cta: "Doğrudan WhatsApp hattımıza yazın, Tekirdağ uzman ekibimiz anında yanıtlasın.",
  },
];

export const BUILDER_CONFIG = {
  basePrice: 500,
  baseItems: [
    "Filtre kabı & gövde montaj aparatları",
    "Çekvalf ve flow kısıtlayıcı",
    "Gıda uyumlu antibakteriyel hortum seti",
    "Paslanmaz fitting & bağlantı rekorları",
  ],
  kasa: [
    {
      id: "acik",
      name: "Açık Kasa",
      price: 750,
      desc: "Klasik tezgah altı açık montaj kasası, kolay filtre kontrolü",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      longDesc: "Klasik açık montaj kasası, filtre gövdelerini şeffafça görmenizi ve değişim periyotlarında kolayca müdahale etmenizi sağlar. Geniş tezgah altı alanına sahip evler ve ofisler için ekonomik ve sağlam çözümdür.",
      specs: [
        "Gövde: Paslanmaz Çelik & Metal Taşıyıcı Şase",
        "Boyut: 38x28x15 cm",
        "Filtre Yuvası: 10 inç Standart Universal Housing",
        "Kullanım: Tezgah altı geniş dolaplar",
      ],
      highlights: [
        "Kolay filtre değişimi ve görsel kontrol",
        "Yüksek dayanımlı metal taşıyıcı şase",
        "Universal filtre yuvaları ile %100 uyum",
      ],
    },
    {
      id: "kapali",
      name: "Kapalı Kasa",
      price: 1500,
      desc: "Kompakt, şık ve toza/neme karşı tam korumalı hijyenik kabin",
      img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
      longDesc: "Şık beyaz gövdesiyle tüm filtreleri ve bağlantı hortumlarını tek bir kapalı gövde içinde toplar. Dolap içerisindeki deterjan buharı, nem, toz ve dış etkenlere karşı tam koruma sağlayarak maksimum hijyen sunar.",
      specs: [
        "Gövde: Antibakteriyel ABS Plastik Kabin",
        "Boyut: 41x26x40 cm (Kompakt)",
        "Koruma: Toz, Nem & Dış Etken Korumalı",
        "Kullanım: Modern mutfak tezgah altları",
      ],
      highlights: [
        "En çok satan gövde tasarımı",
        "Mutfak dolabında sıfır hortum karmaşası",
        "Darbeye ve basınca dayanıklı ABS malzeme",
      ],
    },
    {
      id: "cam_slim",
      name: "Lüks Cam Kapaklı / Slim Kasa",
      price: 2500,
      desc: "Ultra modern, dar mutfak alanlarına özel temperli cam ön kapak",
      img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
      longDesc: "Sadece 14 cm derinliğiyle en dar mutfak dolaplarına dahi kolayca sığar. Füme temperli lüks cam kapağı manyetik olarak açılır; dolap kapağını açtığınızda premium bir teknoloji cihazı görünümü sunar.",
      specs: [
        "Ön Panel: 4mm Temperli Füme Cam Kapak",
        "Boyut: 39x14x42 cm (Ultra İnce Slim)",
        "Açılış: Manyetik Kilitli Kolay Ön Kapak",
        "Kullanım: Dar tezgah altları ve ada mutfaklar",
      ],
      highlights: [
        "Ultra ince (Slim) mimari tasarım",
        "Manyetik pratik ön kapak mekanizması",
        "Lüks mutfaklara özel estetik cam panel",
      ],
    },
  ],
  filtre: [
    {
      id: "eko5",
      name: "5'li Eko Filtre Seti",
      price: 1200,
      desc: "Tortu, klor, pas ve aktif karbon filtrasyonu (5 aşama)",
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      longDesc: "5 temel kademeden oluşan ekonomik filtre setidir. Sudaki kaba tortu, kum, pas, klor, ağır koku ve kimyasalları %95+ oranında arıtarak temiz içme suyu sağlar.",
      specs: [
        "Aşama: 5 Kademeli Ters Ozmoz Filtrasyon",
        "Membran: 75 GPD Standart RO Membran",
        "Ön Filtreler: 5 Micron Sediment, Granül GAC, Blok CTO",
        "Son Filtre: Hindistan Cevizi Kabuğu Post Karbon Tatlandırıcı",
      ],
      highlights: [
        "Tortu, klor ve kireç arıtımı",
        "Tatsız ve kokusuz berrak su",
        "Standart hane kullanımı için ideal",
      ],
    },
    {
      id: "premium5",
      name: "5'li Premium Filtre Seti",
      price: 2400,
      desc: "İthal NSF onaylı membran + doğal mineral zenginleştirici",
      img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
      longDesc: "İthal NSF onaylı yüksek verimli membran ile en zorlu şebeke sularında dahi mikroskobik ağır metalleri, kireci ve bakterileri %99.2 oranında süzer. İlave mineral filtresiyle suya doğal kalsiyum ve magnezyum takviyesi yaparak tatlı pınar suyu lezzeti kazandırır.",
      specs: [
        "Aşama: 5 Kademeli Zenginleştirilmiş Filtrasyon",
        "Membran: 80 GPD İthal NSF/ANSI 58 Sertifikalı Membran",
        "Ön Filtreler: %100 Saf Polipropilen Tortu + Yüksek İyodin Aktif Karbon",
        "Mineral: Kalsiyum, Magnezyum & Potasyum Doğal Mineral Kartuşu",
      ],
      highlights: [
        "NSF Uluslararası Sağlık Sertifikalı",
        "Günde 300 litreye kadar yüksek arıtma debisi",
        "Doğal mineral takviyesiyle tatlı memba lezzeti",
      ],
    },
    {
      id: "diamond5",
      name: "5'li PLATINUM PLUS DIAMOND",
      price: 4200,
      desc: "Alkali pH 9+, Detoks, Doğal Taş Mineral & Bioceramic hidrojen desteği",
      img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
      longDesc: "Arıtmanın zirvesi: Standart filtrasyonun ötesinde, suyu pH 9+ alkali seviyesine yükseltir ve antioksidan mineral dengesi sunar. Bioceramic teknoloji su molekül kümesini küçülterek hücre içi emilimi hızlandırır, vücutta detoks etkisi yaratır ve bağışıklığı destekler.",
      specs: [
        "Aşama: 5 Kademeli Ultra Lüks Kristal Filtrasyon",
        "Membran: Orijinal Dow Filmtec / Vontron Yüksek Basınç Membranı",
        "Alkali Kartuş: Doğal Taş pH 9+ Alkali İyonize Filtre",
        "Detoks & Bioceramic: Far-Infrared Bioceramic Su Molekülü Aktivatörü",
      ],
      highlights: [
        "pH 9+ Yüksek Alkali & Antioksidan zengini",
        "Bioceramic hidrojen & negatif iyon enerjisi",
        "Dünyanın 1 numaralı membran teknolojisi",
      ],
    },
  ],
  beyin: [
    {
      id: "mekanik",
      name: "Standart Mekanik Beyin",
      price: 100,
      desc: "Otomatik hidrolik şatof kesici valf ve basınç anahtarı",
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDesc: "Depo dolduğunda şebeke su girişini mekanik basınç farkıyla otomatik olarak keser. Elektrik enerjisine ihtiyaç duymadan yıllarca sorunsuz ve bakım gerektirmeden çalışır.",
      specs: [
        "Tip: 4 Yollu Hidrolik Şatof Valf",
        "Gövde: POM Gıda Uyumlu Mühendislik Plastiği",
        "Çalışma: Elektriksiz Otomatik Hidrolik Kesme",
        "Basınç Eşiği: 2.5 - 6 Bar",
      ],
      highlights: [
        "Sıfır elektrik tüketimi",
        "Mekanik arıza riski en düşük sistem",
        "Otomatik hidrostatik kapatma",
      ],
    },
    {
      id: "dijital",
      name: "Akıllı Dijital Beyin",
      price: 250,
      desc: "TDS su saflık ölçer, otomatik ters yıkama ve su sızıntı emniyet sensörü",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      longDesc: "Cihazın su kalitesini anlık TDS değeriyle ölçer, membran ömrünü uzatmak için periyodik ters yıkama yapar. En önemlisi, mutfak dolabında en ufak su sızıntısı algıladığında giriş suyunu anında kilitleyerek evinizi su basmasına karşı korur.",
      specs: [
        "Sensör: Dijital Giriş/Çıkış TDS Saflık Ölçer",
        "Emniyet: Akıllı Su Sızıntısı Kesme Sensörü",
        "Yıkama: Otomatik Auto-Flush Membran Temizleme",
        "Ekran: Renkli LED Durum & Filtre Ömrü İkazı",
      ],
      highlights: [
        "Anlık su saflık (TDS) kalite göstergesi",
        "Akıllı su kaçağı algılama ve otomatik kilit",
        "Otomatik membran yıkama ile 2 kat uzun filtre ömrü",
      ],
    },
  ],
  pompa: [
    {
      id: "pompasiz",
      name: "Pompasız (Yüksek Şebeke Basıncı)",
      price: 0,
      desc: "Giriş katlar ve 3 bar üzeri yüksek su basıncına sahip daireler için",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      longDesc: "Şebeke su basıncının yüksek olduğu dairelerde doğrudan şebeke gücüyle çalışır. Elektrik bağlantısı gerektirmez, tamamen sessizdir.",
      specs: [
        "Gerekli Şebeke Basıncı: Minimum 3.5 Bar",
        "Çalışma Prensibi: Doğrudan Şebeke Hidroliği",
        "Elektrik İhtiyacı: Yok",
        "Uygun Katlar: Giriş, 1. ve 2. Katlar",
      ],
      highlights: [
        "Sıfır elektrik sarfiyatı",
        "Tamamen sessiz çalışma",
        "Giriş katlar için ideal",
      ],
    },
    {
      id: "pompali",
      name: "Pompalı (+Sessiz Booster Pompa)",
      price: 1800,
      desc: "3. kat ve üzeri veya düşük basınçlı daireler için 24V sessiz booster pompa",
      img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      longDesc: "Özellikle üst katlarda ve Tekirdağ'ın basınç dalgalanması yaşanan bölgelerinde su basıncını ideal 5.5 bar seviyesine çıkarır. Membranın atık su üretmeden maksimum verimle çalışmasını ve deponun 3 kat hızlı dolmasını sağlar.",
      specs: [
        "Motor: 24V DC Yüksek Torklu Diyafram Pompa",
        "Debi: 1.2 L/Dk Sabit Basınç",
        "Gürültü Seviyesi: <28 dB (Fısıltı Sessizliğinde)",
        "Kullanım: 3. kat ve üzeri, düşük basınçlı binalar",
      ],
      highlights: [
        "Gereksiz atık su israfını %60 azaltır",
        "Depoyu dakikalar içinde doldurur",
        "Titreşimsiz ve fısıltı sessizliğinde 24V motor",
      ],
    },
    {
      id: "emin_degilim",
      name: "Emin Değilim (Uzman Kontrol Etsin)",
      price: 0,
      desc: "Tekirdağ ilçenizin şebeke basıncını uzmanımız ücretsiz kontrol etsin",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDesc: "Evinizin şebeke basıncından emin değilseniz bu seçeneği işaretleyin. Uzman montaj teknisyenimiz dijital manometre ile dairenizin su basıncını ölçer; sadece gerçekten ihtiyaç varsa pompa montajı önerilir.",
      specs: [
        "Hizmet: Ücretsiz Yerinde Basınç Ölçümü",
        "Teknisyen: Lotus Tekirdağ Yetkili Servis Ekibi",
        "Süreç: Montaj anında manometre ile ölçüm yapılır",
        "Fiyat Güvencesi: Gerekirse yerinde şeffaf bilgilendirme",
      ],
      highlights: [
        "Tekirdağ geneli ücretsiz basınç keşfi",
        "Gereksiz masraftan koruyan uzman analizi",
        "Yerinde karar verme özgürlüğü",
      ],
    },
  ],
  tank: [
    {
      id: "eko8",
      name: "Standart Basınç Tankı",
      price: 1500,
      desc: "8–10 L kullanım kapasitesi; gıda uyumlu antibakteriyel diyafram",
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      longDesc: "Kompakt ebatlarıyla tezgah altında minimum yer kaplar. İçerisindeki antibakteriyel diyafram sayesinde suyun hava veya metal ile teması engellenir, su her an taze ve soğuk kalır.",
      specs: [
        "Kapasite: 8 Litre (2.2 Galon)",
        "İç Kaplama: Gıda Uyumlu Butil Diyafram",
        "Dış Gövde: Fırın Boyalı Korozyon Korumalı Çelik",
        "Uygunluk: 1-3 Kişilik Çekirdek Aileler",
      ],
      highlights: [
        "Dar dolaplar için kompakt boyut",
        "Bakteri üretmeyen özel diyafram",
        "Elektrik veya su kesintisinde 8L hazır içme suyu",
      ],
    },
    {
      id: "plat12",
      name: "Premium Basınç Tankı",
      price: 3000,
      desc: "Daha dayanıklı gövde, yüksek kalite diyafram ve uzun servis ömrü; PAE veya eşdeğer premium komponent",
      img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
      longDesc: "Kalabalık aileler, yemeklerinde ve çay/kahvede bol arıtılmış su kullananlar için maksimum kapasite sunar. 304 paslanmaz çelik gövdesiyle ömür boyu korozyon ve koku yapmaz.",
      specs: [
        "Kapasite: 12 Litre (3.2 Galon)",
        "İç/Dış Gövde: 304 Kalite Paslanmaz Çelik & NSF Onaylı Membran",
        "Basınç Dayanımı: 100 PSI Test Edilmiş",
        "Uygunluk: 3-6+ Kişilik Geniş Haneler & Yemek Pişirme",
      ],
      highlights: [
        "Yüksek 12 Litre kesintisiz su rezervi",
        "304 paslanmaz çelik maksimum dayanıklılık",
        "Tüm ailenin yemek ve içme suyu ihtiyacına tek çözüm",
      ],
    },
  ],
  musluk: [
    {
      id: "eko",
      name: "Eko Paslanmaz Kuğu Musluk",
      price: 500,
      desc: "Klasik döner borulu paslanmaz çelik arıtma musluğu",
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      longDesc: "Klasik ve dayanıklı paslanmaz çelik kuğu boyunlu arıtma musluğu. Seramik disk mekanizmasıyla damlatma yapmaz, 360 derece döner borusuyla sürahi ve tencereleri rahatça doldurmanızı sağlar.",
      specs: [
        "Malzeme: SUS304 Paslanmaz Çelik",
        "Mekanizma: Çeyrek Tur Seramik Disk Kartuş",
        "Dönüş Açısı: 360 Derece Döner Kuğu Boru",
        "Montaj: Standart tezgah üstü tek delik",
      ],
      highlights: [
        "Damlatmaz seramik çekirdek",
        "360 derece rahat dönüş",
        "Paslanmaz parlak krom kaplama",
      ],
    },
    {
      id: "lux",
      name: "Mat Siyah / Gold Lüks Musluk",
      price: 1200,
      desc: "Modern mutfak evyelerine uyumlu estetik mat siyah veya gold tasarım",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      longDesc: "Modern mutfak bataryalarına ve granit/antrasit evyelere kusursuz uyum sağlar. Çizilmeye ve parmak izine dayanıklı elektrostatik kaplamasıyla mutfağınıza sofistike bir hava katar.",
      specs: [
        "Malzeme: Katı Pirinç Gövde & Elektrostatik Mat Fırın Kaplama",
        "Renk Seçenekleri: Mat Siyah / Fırçalanmış Gold",
        "Tasarım: Modern Minimalist Slim Çıkış Ucu",
        "Montaj: Lüks Evye Uyumlu Tek Delik",
      ],
      highlights: [
        "Mat Siyah & Gold özel renk seçenekleri",
        "Parmak izi ve kireç lekesi tutmayan kaplama",
        "Modern mimari evyelerle kusursuz uyum",
      ],
    },
    {
      id: "3yollu",
      name: "3 Yollu Lüks Mutfak Bataryası",
      price: 3000,
      desc: "Sıcak + Soğuk + Arıtılmış su tek gövdede! Tezgah delme gerektirmez.",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      longDesc: "Mutfak tezgahınızın delinmesini istemiyorsanız mükemmel çözüm! Mevcut ana mutfak bataryanızın yerine takılır. Sağ koldan sıcak/soğuk şebeke suyu, sol koldan ise arıtılmış saf içme suyu akar. Suyun kanalları gövde içinde tamamen ayrıdır, şebeke suyuyla asla karışmaz.",
      specs: [
        "Malzeme: 3 Girişli Masif Pirinç Batarya Gövdesi",
        "Fonksiyon: Sıcak Su + Soğuk Şebeke Suyu + Saf Arıtılmış Su",
        "Avantaj: TEZGAHI ASLA DELDİRMEZ",
        "Kartuş: Çift Çıkışlı Bağımsız İkili Seramik Kartuş",
      ],
      highlights: [
        "Mutfak tezgahında ikinci bir delik açtırmaz",
        "Sıcak + Soğuk + Arıtma tek gövdede",
        "Lüks porselen ve kuvars tezgahlar için 1 numaralı tercih",
      ],
    },
  ],
};

export const SITE_CONFIG = {
  brand: {
    name: "Lotus Su Arıtma",
    tagline: "Eviniz için premium su arıtma çözümleri",
    region: "Tekirdağ",
  },
  whatsapp: {
    number: WHATSAPP_NUMBER,
    display: WHATSAPP_DISPLAY,
  },
  devices: DEVICES,
  filterSets: FILTER_SETS,
  faultGuides: FAULT_GUIDES,
  budgetOptions: [
    { id: "ekonomik", label: "Ekonomik", hint: "0 – 10.000 ₺" },
    { id: "orta", label: "Orta segment", hint: "10.000 – 20.000 ₺" },
    { id: "premium", label: "Premium", hint: "20.000 ₺ ve üzeri" },
  ],
  consumptionOptions: [
    { id: "az", label: "Düşük", hint: "1-2 kişi / az kullanım" },
    { id: "orta", label: "Orta", hint: "3-4 kişilik hane" },
    { id: "yuksek", label: "Yüksek", hint: "5+ kişi / yoğun kullanım" },
  ],
  builderConfig: BUILDER_CONFIG,
};

/**
 * Pure client-side device recommendation logic
 * Strictly filters by budget, then prioritizes by consumption
 */
export function getRecommendedDevices(budget, consumption) {
  let filtered = DEVICES;
  if (budget) {
    filtered = DEVICES.filter((d) => d.budgetTags && d.budgetTags.includes(budget));
  }
  if (!filtered || filtered.length === 0) {
    filtered = DEVICES;
  }

  const scored = filtered.map((d) => {
    let score = 0;
    if (consumption && d.consumptionTags && d.consumptionTags.includes(consumption)) {
      score += 5;
    }
    return { ...d, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.map(({ _score, ...rest }) => rest);
}

/**
 * Client-side lead logger & local persistence
 */
export function saveLeadLocally(leadData) {
  try {
    const existing = JSON.parse(localStorage.getItem("lotus_leads") || "[]");
    const newLead = {
      ...leadData,
      id: "lead_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    existing.unshift(newLead);
    localStorage.setItem("lotus_leads", JSON.stringify(existing.slice(0, 100)));
    return newLead;
  } catch (e) {
    console.warn("Could not save lead to localStorage", e);
    return leadData;
  }
}
