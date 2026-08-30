import React, { createContext, useContext, useState, useEffect } from "react";
import { ConvexReactClient, ConvexProvider as OriginalConvexProvider } from "convex/react";
import { SITE_CONFIG, BUILDER_CONFIG } from "@/data/siteConfig";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

export const convexClient = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

// Local fallback context for offline / demo mode
const LocalDataContext = createContext(null);

const DEFAULT_LOCAL_STATE = {
  steps: [
    {
      _id: "step_kasa",
      key: "kasa",
      stepNumber: 1,
      order: 1,
      badge: "1. Adım • Dış Gövde & Kasa",
      title: "Kasa Tipinizi Seçin",
      description: "Tezgah altınızın alanına ve estetik tercihinize en uygun kasa modelini belirleyin.",
      icon: "Layers",
      guideText: "Mutfak dolabınızda dar alan varsa 'Kapalı Kasa' veya 'Slim Cam' kasa; geniş dolaplar ve en ekonomik bütçe için 'Açık Kasa' tercih edebilirsiniz.",
      isActive: true,
    },
    {
      _id: "step_filtre",
      key: "filtre",
      stepNumber: 2,
      order: 2,
      badge: "2. Adım • Filtrasyon Teknolojisi",
      title: "Filtre Paketinizi Seçin",
      description: "İçme suyunuzun mineral zenginliğini, pH alkali seviyesini ve membran arıtma kalitesini belirleyin.",
      icon: "Droplets",
      guideText: "Tekirdağ'ın yüksek kireçli şebeke suyu için en az 5 aşamalı NSF onaylı membran ve doğal mineral filtreli set tavsiye edilir.",
      isActive: true,
    },
    {
      _id: "step_beyin",
      key: "beyin",
      stepNumber: 3,
      order: 3,
      badge: "3. Adım • Otomasyon & Emniyet",
      title: "Sistem Beynini Seçin",
      description: "Su tasarrufu, otomatik yıkama ve mutfak dolabını su basmasına karşı koruyan emniyet sistemini belirleyin.",
      icon: "Cpu",
      guideText: "Mutfak dolabında su kaçağı riskini sıfırlamak, membran ömrünü uzatmak ve suyun saflık (TDS) değerini anlık görmek için 'Akıllı Dijital Beyin' önerilir.",
      isActive: true,
    },
    {
      _id: "step_pompa",
      key: "pompa",
      stepNumber: 4,
      order: 4,
      badge: "4. Adım • Basınç & Pompa",
      title: "Basınç Pompa Tercihiniz",
      description: "Bulunduğunuz kat ve şebeke suyu basıncınıza göre pompalı veya pompasız sistemi belirleyin.",
      icon: "Zap",
      guideText: "Tekirdağ'da 3. kat ve üzeri dairelerde şebeke basıncı düştüğü için 'Pompalı' model önerilir. Giriş katlar için pompasız yeterlidir. Emin değilseniz uzmanımız montajda ücretsiz ölçüm yapacaktır.",
      isActive: true,
    },
    {
      _id: "step_tank",
      key: "tank",
      stepNumber: 5,
      order: 5,
      badge: "5. Adım • Su Depolama Rezervi",
      title: "Depolama Tankı Kapasitesi",
      description: "Hanedeki kişi sayısına ve günlük yemek/içme suyu tüketim hacminize uygun antibakteriyel tankı seçin.",
      icon: "Cylinder",
      guideText: "1-3 kişilik çekirdek aileler için 8L Eko Tank; kalabalık aileler ve yemek pişirmede bol arıtılmış su kullananlar için 12L Paslanmaz Platinum Tank önerilir.",
      isActive: true,
    },
    {
      _id: "step_musluk",
      key: "musluk",
      stepNumber: 6,
      order: 6,
      badge: "6. Adım • Tezgah Üstü Musluk & Batarya",
      title: "Arıtma Musluğunuzu Seçin",
      description: "Evye tasarımınıza uygun şık ve gıda uyumlu paslanmaz çelik arıtma musluğu belirleyin.",
      icon: "Pipette",
      guideText: "Mutfak tezgahınızın delinmesini istemiyorsanız '3 Yollu Lüks Batarya'; klasik ve dayanıklı tezgah üstü kullanım için paslanmaz kuğu musluk önerilir.",
      isActive: true,
    },
  ],
  options: [
    // Kasa
    {
      _id: "opt_kasa_acik",
      stepKey: "kasa",
      optionId: "acik",
      name: "Açık Kasa",
      costPrice: 320,
      salePrice: 750,
      desc: "Klasik tezgah altı açık montaj kasası, kolay filtre kontrolü",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      longDesc: "Klasik açık montaj kasası, filtre gövdelerini şeffafça görmenizi ve değişim periyotlarında kolayca müdahale etmenizi sağlar.",
      specs: ["Gövde: Paslanmaz Çelik & Metal Şase", "Boyut: 38x28x15 cm", "Filtre Yuvası: 10 inç Standart"],
      highlights: ["Kolay filtre değişimi", "Yüksek dayanımlı metal şase"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_kasa_kapali",
      stepKey: "kasa",
      optionId: "kapali",
      name: "Kapalı Kasa",
      costPrice: 650,
      salePrice: 1500,
      badge: "En Çok Tercih Edilen",
      desc: "Kompakt, şık ve toza/neme karşı tam korumalı hijyenik kabin",
      img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
      longDesc: "Şık beyaz gövdesiyle tüm filtreleri tek bir kapalı gövde içinde toplar. Nem ve dış etkenlere karşı tam koruma sağlar.",
      specs: ["Gövde: Antibakteriyel ABS Plastik", "Boyut: 41x26x40 cm", "Koruma: Toz & Nem Korumalı"],
      highlights: ["En çok satan gövde tasarımı", "Mutfak dolabında sıfır hortum karmaşası"],
      order: 2,
      isActive: true,
    },
    {
      _id: "opt_kasa_cam_slim",
      stepKey: "kasa",
      optionId: "cam_slim",
      name: "Lüks Cam Kapaklı / Slim Kasa",
      costPrice: 1150,
      salePrice: 2500,
      badge: "Ultra Slim Mimari",
      desc: "Ultra modern, dar mutfak alanlarına özel temperli cam ön kapak",
      img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
      longDesc: "Sadece 14 cm derinliğiyle en dar mutfak dolaplarına dahi kolayca sığar. Füme temperli cam kapağı manyetik olarak açılır.",
      specs: ["Ön Panel: 4mm Temperli Füme Cam", "Boyut: 39x14x42 cm", "Açılış: Manyetik Kilitli"],
      highlights: ["Ultra ince (Slim) mimari tasarım", "Lüks mutfaklara özel estetik cam panel"],
      order: 3,
      isActive: true,
    },
    // Filtre
    {
      _id: "opt_filtre_eko5",
      stepKey: "filtre",
      optionId: "eko5",
      name: "5'li Eko Filtre Seti",
      costPrice: 480,
      salePrice: 1200,
      desc: "Tortu, klor, pas ve aktif karbon filtrasyonu (5 aşama)",
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      longDesc: "5 temel kademeden oluşan ekonomik filtre setidir.",
      specs: ["Aşama: 5 Kademeli Ters Ozmoz", "Membran: 75 GPD RO"],
      highlights: ["Tortu, klor ve kireç arıtımı", "Standart hane için ideal"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_filtre_premium5",
      stepKey: "filtre",
      optionId: "premium5",
      name: "5'li Premium Filtre Seti",
      costPrice: 950,
      salePrice: 2400,
      badge: "Fiyat/Performans",
      desc: "İthal NSF onaylı membran + doğal mineral zenginleştirici",
      img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
      longDesc: "İthal NSF onaylı yüksek verimli membran ile mikroskobik ağır metalleri ve bakterileri %99.2 oranında süzer.",
      specs: ["Membran: 80 GPD İthal NSF Membran", "Mineral: Kalsiyum, Magnezyum Kartuşu"],
      highlights: ["NSF Uluslararası Sertifikalı", "Doğal mineral takviyesiyle tatlı memba lezzeti"],
      order: 2,
      isActive: true,
    },
    {
      _id: "opt_filtre_diamond5",
      stepKey: "filtre",
      optionId: "diamond5",
      name: "5'li PLATINUM PLUS DIAMOND",
      costPrice: 1750,
      salePrice: 4200,
      badge: "Ultra Zengin Mineral",
      desc: "Alkali pH 9+, Detoks, Doğal Taş Mineral & Bioceramic hidrojen desteği",
      img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
      longDesc: "Arıtmanın zirvesi: Standart filtrasyonun ötesinde, suyu pH 9+ alkali seviyesine yükseltir.",
      specs: ["Membran: Orijinal Dow Filmtec", "Alkali: pH 9+ Doğal Taş İyonize", "Detoks: Bioceramic"],
      highlights: ["pH 9+ Yüksek Alkali & Antioksidan", "Bioceramic hidrojen enerjisi"],
      order: 3,
      isActive: true,
    },
    // Beyin
    {
      _id: "opt_beyin_mekanik",
      stepKey: "beyin",
      optionId: "mekanik",
      name: "Standart Mekanik Beyin",
      costPrice: 35,
      salePrice: 100,
      desc: "Otomatik hidrolik şatof kesici valf ve basınç anahtarı",
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDesc: "Depo dolduğunda su girişini mekanik basınç farkıyla otomatik keser.",
      specs: ["Tip: 4 Yollu Hidrolik Şatof Valf", "Çalışma: Elektriksiz"],
      highlights: ["Sıfır elektrik tüketimi", "Mekanik arıza riski en düşük"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_beyin_dijital",
      stepKey: "beyin",
      optionId: "dijital",
      name: "Akıllı Dijital Beyin",
      costPrice: 95,
      salePrice: 250,
      badge: "Su Kaçağı Korumalı",
      desc: "TDS su saflık ölçer, otomatik ters yıkama ve su sızıntı emniyet sensörü",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      longDesc: "Su kalitesini anlık TDS ile ölçer; en ufak sızıntıda giriş suyunu anında kilitleyerek su baskınını önler.",
      specs: ["Sensör: Dijital TDS Metre", "Emniyet: Akıllı Su Sızıntısı Kesme Sensörü"],
      highlights: ["Anlık TDS kalite göstergesi", "Akıllı su kaçağı algılama ve kilit"],
      order: 2,
      isActive: true,
    },
    // Pompa
    {
      _id: "opt_pompa_pompasiz",
      stepKey: "pompa",
      optionId: "pompasiz",
      name: "Pompasız (Yüksek Şebeke Basıncı)",
      costPrice: 0,
      salePrice: 0,
      desc: "Giriş katlar ve 3 bar üzeri yüksek su basıncına sahip daireler için",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      longDesc: "Şebeke basıncının yüksek olduğu dairelerde doğrudan şebeke gücüyle çalışır.",
      specs: ["Basınç: Min 3.5 Bar", "Elektrik: Yok"],
      highlights: ["Sıfır elektrik sarfiyatı", "Tamamen sessiz"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_pompa_pompali",
      stepKey: "pompa",
      optionId: "pompali",
      name: "Pompalı (+Sessiz Booster Pompa)",
      costPrice: 780,
      salePrice: 1800,
      badge: "Tekirdağ Tavsiyesi",
      desc: "3. kat ve üzeri veya düşük basınçlı daireler için 24V sessiz booster pompa",
      img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      longDesc: "Özellikle üst katlarda su basıncını ideal 5.5 bar seviyesine çıkarır.",
      specs: ["Motor: 24V DC Pompa", "Gürültü: <28 dB"],
      highlights: ["Atık suyu %60 azaltır", "Fısıltı sessizliğinde"],
      order: 2,
      isActive: true,
    },
    {
      _id: "opt_pompa_emin_degilim",
      stepKey: "pompa",
      optionId: "emin_degilim",
      name: "Emin Değilim (Uzman Kontrol Etsin)",
      costPrice: 0,
      salePrice: 0,
      badge: "Ücretsiz Keşif",
      desc: "Tekirdağ ilçenizin şebeke basıncını uzmanımız ücretsiz kontrol etsin",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDesc: "Uzman teknisyenimiz montaj anında manometre ile basıncı ölçer.",
      specs: ["Hizmet: Ücretsiz Basınç Ölçümü"],
      highlights: ["Tekirdağ geneli ücretsiz keşif", "Gereksiz masraftan koruyan analiz"],
      order: 3,
      isActive: true,
    },
    // Tank
    {
      _id: "opt_tank_eko8",
      stepKey: "tank",
      optionId: "eko8",
      name: "Eko Tank (8 Litre)",
      costPrice: 620,
      salePrice: 1500,
      desc: "1-3 kişilik haneler için gıda uyumlu antibakteriyel basınç tankı",
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      longDesc: "Kompakt ebatlarıyla tezgah altında minimum yer kaplar.",
      specs: ["Kapasite: 8 Litre", "İç Kaplama: Butil Diyafram"],
      highlights: ["Dar dolaplar için kompakt", "Bakteri üretmeyen diyafram"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_tank_plat12",
      stepKey: "tank",
      optionId: "plat12",
      name: "Platinum Tank (12 Litre Paslanmaz)",
      costPrice: 1250,
      salePrice: 3000,
      badge: "Geniş Aileler",
      desc: "3-5+ kişilik haneler için paslanmaz çelik yüksek kapasiteli depo",
      img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
      longDesc: "304 paslanmaz çelik gövdesiyle ömür boyu korozyon ve koku yapmaz.",
      specs: ["Kapasite: 12 Litre", "Gövde: 304 Paslanmaz Çelik"],
      highlights: ["12 Litre kesintisiz su", "304 paslanmaz maksimum dayanıklılık"],
      order: 2,
      isActive: true,
    },
    // Musluk
    {
      _id: "opt_musluk_eko",
      stepKey: "musluk",
      optionId: "eko",
      name: "Eko Paslanmaz Kuğu Musluk",
      costPrice: 180,
      salePrice: 500,
      desc: "Klasik döner borulu paslanmaz çelik arıtma musluğu",
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      longDesc: "Klasik ve dayanıklı paslanmaz çelik kuğu boyunlu arıtma musluğu.",
      specs: ["Malzeme: SUS304 Paslanmaz", "Dönüş: 360 Derece"],
      highlights: ["Damlatmaz seramik disk", "360 derece rahat dönüş"],
      order: 1,
      isActive: true,
    },
    {
      _id: "opt_musluk_lux",
      stepKey: "musluk",
      optionId: "lux",
      name: "Mat Siyah / Gold Lüks Musluk",
      costPrice: 480,
      salePrice: 1200,
      badge: "Tasarım Ödüllü",
      desc: "Modern mutfak evyelerine uyumlu estetik mat siyah veya gold tasarım",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      longDesc: "Çizilmeye ve parmak izine dayanıklı elektrostatik kaplamalı lüks musluk.",
      specs: ["Renk: Mat Siyah / Gold", "Gövde: Katı Pirinç"],
      highlights: ["Mat Siyah & Gold renkler", "Parmak izi tutmaz"],
      order: 2,
      isActive: true,
    },
    {
      _id: "opt_musluk_3yollu",
      stepKey: "musluk",
      optionId: "3yollu",
      name: "3 Yollu Lüks Mutfak Bataryası",
      costPrice: 1350,
      salePrice: 3000,
      badge: "Tezgahı Deldirmez",
      desc: "Sıcak + Soğuk + Arıtılmış su tek gövdede! Tezgah delme gerektirmez.",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      longDesc: "Mevcut bataryanızın yerine takılır. Sıcak/soğuk ve arıtma suyu ayrı kanallardan akar, tezgahı deldirmez.",
      specs: ["Fonksiyon: Sıcak + Soğuk + Arıtma", "Gövde: Masif Pirinç"],
      highlights: ["Tezgahı asla deldirmez", "Lüks evyeler için 1 numara"],
      order: 3,
      isActive: true,
    },
  ],
  settings: {
    brandName: "Lotus Su Arıtma",
    whatsappNumber: "905550000000",
    whatsappDisplay: "+90 (555) 000 00 00",
    basePrice: 500,
    baseCost: 180,
    discountRate: 0.2,
    discountBadgeText: "🎁 Formu Doldur %20 İndirim Kazan",
  },
  faultGuides: [
    {
      _id: "fault_damla",
      faultId: "damla",
      label: "Su damlatıyor",
      title: "Cihazınız su damlatıyor",
      body: "Musluk veya cihaz gövdesinden gelen damlama, genellikle gevşeyen bir bağlantı, aşınmış bir conta ya da dolmuş bir tahliye hattından kaynaklanır. Çoğu zaman basit bir bağlantı sıkımı veya conta değişimi ile çözülür.",
      tips: [
        "Cihazın besleme (giriş) vanasını kapatın.",
        "Damlamanın musluktan mı yoksa gövdeden mi geldiğini not edin.",
        "Zemine bir bez/kap koyarak su birikmesini önleyin.",
      ],
      order: 1,
      isActive: true,
    },
    {
      _id: "fault_az_akis",
      faultId: "az_akis",
      label: "Su çok az akıyor",
      title: "Sudaki akış çok azaldı",
      body: "Debinin düşmesi çoğunlukla tıkanmış filtreler, tankta basınç kaybı veya membranın ömrünü tamamlaması ile ilgilidir. Genellikle filtre/membran değişimi veya tank basınç ayarı ile normale döner.",
      tips: [
        "Filtrelerin en son ne zaman değiştiğini hatırlamaya çalışın.",
        "Musluğu birkaç dakika açık tutup akışın değişip değişmediğine bakın.",
        "Cihaz modelini biliyorsanız not alın.",
      ],
      order: 2,
      isActive: true,
    },
    {
      _id: "fault_sizinti",
      faultId: "sizinti",
      label: "Sızıntı var (Cihaz altında su birikiyor)",
      title: "Cihaz altında veya hortumda su birikiyor",
      body: "Gözle görülür su birikintisi, genellikle hızlı bağlantı rekorlarının o-ring aşınmasından, yüksek şebeke basıncından veya çatlamış bir filtre kabından kaynaklanır. Hızlı müdahale önemlidir.",
      tips: [
        "Ana besleme vanasını derhal kapatın.",
        "Varsa pompalı modellerde fişi prizden çekin.",
        "Hortum giriş-çıkış noktalarını kurulayıp sızıntının kaynağını tespit edin.",
      ],
      order: 3,
      isActive: true,
    },
    {
      _id: "fault_tat_koku",
      faultId: "tat_koku",
      label: "Tatta / kokuda gariplik",
      title: "Suyun tadı veya kokusu değişti",
      body: "Su tadındaki acılaşma, klor kokusu veya tat kaybı; karbon filtrelerin doygunluğa ulaşması, membranın yıpranması ya da tank içinde suyun beklemesinden kaynaklanır.",
      tips: [
        "En son ne zaman filtre değiştiğini kontrol edin (önerilen: 6–12 ay).",
        "Depodaki suyu tamamen tahliye edip yeni su dolumunu bekleyin.",
        "Sorun devam ediyorsa filtre/membran yenileme zamanı gelmiştir.",
      ],
      order: 4,
      isActive: true,
    },
    {
      _id: "fault_ses",
      faultId: "ses",
      label: "Anormal ses geliyor",
      title: "Cihazdan tıkırtı, uğultu veya titreme sesi geliyor",
      body: "Sesli çalışma çoğunlukla booster pompanın hava yapması, diyafram aşınması, montaj şasesinin gevşemesi ya da düşük su basıncı kaynaklıdır.",
      tips: [
        "Giriş suyu vanasının tam açık olduğundan emin olun.",
        "Cihazın duvara veya dolap kapağına temas edip titreşim yapmadığını kontrol edin.",
        "Ses pompadan geliyorsa cihazı dinlendirip tekrar gözlemleyin.",
      ],
      order: 5,
      isActive: true,
    },
    {
      _id: "fault_diger",
      faultId: "diger",
      label: "Başka bir sorun",
      title: "Farklı bir arıza veya sorunuz mu var?",
      body: "Yukarıdaki başlıklara uymayan her türlü teknik soru, basınç problemi, montaj yeri değişikliği veya periyodik bakım talebi için doğrudan ustalarımızla görüşebilirsiniz.",
      tips: [
        "Cihazın markasını ve modelini öğrenin.",
        "Yaşadığınız sorunu kısaca not edin.",
        "Tekirdağ içi aynı gün yerinde servis imkanından yararlanın.",
      ],
      order: 6,
      isActive: true,
    },
  ],
  devices: [
    {
      _id: "dev_lotus_eco_plus",
      id: "lotus-eco-plus",
      deviceId: "lotus-eco-plus",
      name: "Lotus Eco Plus 5",
      price: "8.900 ₺",
      costPrice: 4200,
      salePrice: 8900,
      tagline: "Ekonomik, güvenilir 5 aşamalı ters ozmoz sistemi",
      budgetTags: ["eko"],
      consumptionTags: ["az", "orta"],
      capacity: "1-3 kişilik hane",
      warranty: "2 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      features: [
        "5 aşamalı RO filtrasyon",
        "Antibakteriyel 8L basınç tankı",
        "Paslanmaz çelik döner musluk",
        "Kompakt tezgah altı tasarım",
      ],
      order: 1,
      isActive: true,
    },
    {
      _id: "dev_lotus_compact",
      id: "lotus-compact",
      deviceId: "lotus-compact",
      name: "Lotus Compact Slim",
      price: "14.500 ₺",
      costPrice: 6500,
      salePrice: 14500,
      tagline: "Dar dolaplara özel, şık kapalı kasa tasarımı",
      budgetTags: ["orta"],
      consumptionTags: ["az", "orta"],
      capacity: "2-4 kişilik hane",
      warranty: "3 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
      features: [
        "6 aşamalı mineral zenginleştirici",
        "Ultra kompakt kapalı hijyen kabini",
        "Sessiz çalışma & kaçak emniyeti",
        "Hızlı filtre değişim mekanizması",
      ],
      order: 2,
      isActive: true,
    },
    {
      _id: "dev_lotus_smart_ro",
      id: "lotus-smart-ro",
      deviceId: "lotus-smart-ro",
      name: "Lotus Smart RO-7",
      price: "18.900 ₺",
      costPrice: 8800,
      salePrice: 18900,
      tagline: "7 aşamalı arıtma + dahili basınç pompası",
      budgetTags: ["orta", "premium"],
      consumptionTags: ["orta", "yuksek"],
      capacity: "3-5 kişilik hane",
      warranty: "3 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      features: [
        "7 aşamalı filtrasyon",
        "NSF onaylı ithal membran",
        "24V sessiz booster pompa",
        "Basınç regülatörü ve sızıntı emniyeti",
      ],
      order: 3,
      isActive: true,
    },
    {
      _id: "dev_lotus_premium_pro",
      id: "lotus-premium-pro",
      deviceId: "lotus-premium-pro",
      name: "Lotus Premium Pro",
      price: "24.900 ₺",
      costPrice: 11500,
      salePrice: 24900,
      tagline: "Yüksek performans + alkali & detoks teknolojisi",
      budgetTags: ["premium"],
      consumptionTags: ["az", "orta", "yuksek"],
      capacity: "4-5 kişilik hane",
      warranty: "5 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
      features: [
        "8 aşamalı ileri filtrasyon",
        "Alkali + mineral + detoks filtre",
        "pH 9+ antioksidan zenginleştirici",
        "Dijital filtre takip göstergesi",
      ],
      order: 4,
      isActive: true,
    },
    {
      _id: "dev_lotus_maxflow",
      id: "lotus-maxflow",
      deviceId: "lotus-maxflow",
      name: "Lotus MaxFlow Direct",
      price: "29.900 ₺",
      costPrice: 14000,
      salePrice: 29900,
      tagline: "Tanksız, doğrudan akış — yoğun kullanım için",
      budgetTags: ["premium"],
      consumptionTags: ["orta", "yuksek"],
      capacity: "5+ kişilik hane / ofis",
      warranty: "5 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
      features: [
        "Tanksız direkt taze su akışı",
        "800 GPD yüksek kapasiteli membran",
        "Anlık TDS su kalitesi göstergesi",
        "Kompakt ve zarif tezgah altı tasarım",
      ],
      order: 5,
      isActive: true,
    },
    {
      _id: "dev_lotus_elite_smart",
      id: "lotus-elite-smart",
      deviceId: "lotus-elite-smart",
      name: "Lotus Elite Smart Touch",
      price: "34.900 ₺",
      costPrice: 16500,
      salePrice: 34900,
      tagline: "Dokunmatik akıllı batarya, UV arıtma ve mineral optimizasyonu",
      budgetTags: ["premium"],
      consumptionTags: ["az", "orta", "yuksek"],
      capacity: "Her haneye uygun ultra lüks",
      warranty: "5 Yıl Garanti",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      features: [
        "9 aşamalı moleküler filtrasyon",
        "Dokunmatik dijital akıllı batarya",
        "Entegre UV LED bakteri & virüs yok edici",
        "Ömür boyu servis & filtre takip garantisi",
      ],
      order: 6,
      isActive: true,
    },
  ],
  filterSets: [
    {
      _id: "fs_set3",
      id: "set3",
      setId: "set3",
      name: "3'lü Orijinal Ön Filtre Bakım Seti",
      subtitle: "Sediment (Tortu) + Granül Aktif Karbon + Blok Karbon",
      recommendedFor: "Son değişim ~6 ay önce",
      matchKey: "6ay",
      price: "950 ₺",
      costPrice: 450,
      salePrice: 950,
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
      order: 1,
      isActive: true,
    },
    {
      _id: "fs_set5",
      id: "set5",
      setId: "set5",
      name: "5'li Tam Kapsamlı Orijinal Filtre Seti",
      subtitle: "3 Ön Filtre + İthal RO Membran + Doğal Mineral & Tatlandırıcı",
      recommendedFor: "Son değişim ~1 yıl önce veya bilinmiyor",
      matchKey: "1yil",
      price: "1.850 ₺",
      costPrice: 850,
      salePrice: 1850,
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
      order: 2,
      isActive: true,
    },
  ],
  leads: [
    {
      _id: "lead_demo_1",
      fullName: "Ahmet Yılmaz",
      phone: "0532 123 4567",
      city: "Tekirdağ",
      district: "Çorlu",
      flowType: "builder",
      selectedItems: [
        { stepTitle: "Kasa", name: "Kapalı Kasa", costPrice: 650, salePrice: 1500 },
        { stepTitle: "Filtre", name: "5'li Premium Filtre Seti", costPrice: 950, salePrice: 2400 },
        { stepTitle: "Beyin", name: "Akıllı Dijital Beyin", costPrice: 95, salePrice: 250 },
        { stepTitle: "Pompa", name: "Pompalı (+Booster)", costPrice: 780, salePrice: 1800 },
        { stepTitle: "Tank", name: "Platinum Tank (12L Paslanmaz)", costPrice: 1250, salePrice: 3000 },
        { stepTitle: "Musluk", name: "Mat Siyah / Gold Lüks", costPrice: 480, salePrice: 1200 },
      ],
      basePrice: 500,
      baseCost: 180,
      totalListPrice: 10650,
      finalDiscountedPrice: 8520,
      totalCostPrice: 4385,
      estimatedProfit: 4135,
      profitMarginPercent: 49,
      status: "appointment",
      adminNote: "Montaj için Salı 14:00 randevusu verildi.",
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      _id: "lead_demo_2",
      fullName: "Merve Kaya",
      phone: "0544 987 6543",
      city: "Tekirdağ",
      district: "Süleymanpaşa",
      flowType: "builder",
      selectedItems: [
        { stepTitle: "Kasa", name: "Lüks Cam Slim Kasa", costPrice: 1150, salePrice: 2500 },
        { stepTitle: "Filtre", name: "5'li PLATINUM PLUS DIAMOND", costPrice: 1750, salePrice: 4200 },
        { stepTitle: "Beyin", name: "Akıllı Dijital Beyin", costPrice: 95, salePrice: 250 },
        { stepTitle: "Pompa", name: "Pompasız", costPrice: 0, salePrice: 0 },
        { stepTitle: "Tank", name: "Eko Tank (8L)", costPrice: 620, salePrice: 1500 },
        { stepTitle: "Musluk", name: "3 Yollu Lüks Batarya", costPrice: 1350, salePrice: 3000 },
      ],
      basePrice: 500,
      baseCost: 180,
      totalListPrice: 11950,
      finalDiscountedPrice: 9560,
      totalCostPrice: 5145,
      estimatedProfit: 4415,
      profitMarginPercent: 46,
      status: "new",
      createdAt: Date.now() - 3600000 * 5,
    },
  ],
};

export function AppConvexProvider({ children }) {
  const [localData, setLocalData] = useState(() => {
    try {
      const saved = localStorage.getItem("lotus_admin_data");
      if (!saved) return DEFAULT_LOCAL_STATE;
      const parsed = JSON.parse(saved);
      // Ensure all steps have guideText merged from defaults
      if (parsed.steps) {
        parsed.steps = parsed.steps.map((s) => {
          const def = DEFAULT_LOCAL_STATE.steps.find((d) => d.key === s.key);
          return {
            ...s,
            guideText: s.guideText || def?.guideText || "",
          };
        });
      }
      // Ensure faultGuides are present
      if (!parsed.faultGuides || parsed.faultGuides.length === 0) {
        parsed.faultGuides = DEFAULT_LOCAL_STATE.faultGuides;
      }
      // Ensure devices are present
      if (!parsed.devices || parsed.devices.length === 0) {
        parsed.devices = DEFAULT_LOCAL_STATE.devices;
      }
      // Ensure filterSets are present
      if (!parsed.filterSets || parsed.filterSets.length === 0) {
        parsed.filterSets = DEFAULT_LOCAL_STATE.filterSets;
      }
      return parsed;
    } catch {
      return DEFAULT_LOCAL_STATE;
    }
  });

  // Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const authSaved = sessionStorage.getItem("lotus_admin_auth");
      return authSaved ? JSON.parse(authSaved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(adminUser);

  const loginAdmin = (email, password) => {
    // Default admin credential verification
    if (
      (email === "admin@lotussuaritma.com" || email === "admin" || email === "lotus") &&
      (password === "lotus2026" || password === "admin123" || password === "123456")
    ) {
      const user = { email: email.includes("@") ? email : `${email}@lotussuaritma.com`, name: "Lotus Yönetici" };
      setAdminUser(user);
      sessionStorage.setItem("lotus_admin_auth", JSON.stringify(user));
      return { success: true };
    }
    // Accept custom password if set
    if (password === "lotus2026" || password === "admin123") {
      const user = { email: email || "admin@lotussuaritma.com", name: "Lotus Yönetici" };
      setAdminUser(user);
      sessionStorage.setItem("lotus_admin_auth", JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: "Hatalı e-posta veya şifre girdiniz." };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    sessionStorage.removeItem("lotus_admin_auth");
  };

  useEffect(() => {
    try {
      localStorage.setItem("lotus_admin_data", JSON.stringify(localData));
    } catch {}
  }, [localData]);

  const updateLocalStep = (step) => {
    setLocalData((prev) => {
      const exists = prev.steps.some((s) => s._id === step._id || s.key === step.key);
      const updatedSteps = exists
        ? prev.steps.map((s) => (s._id === step._id || s.key === step.key ? { ...s, ...step } : s))
        : [...prev.steps, { ...step, _id: "step_" + Date.now() }];
      return { ...prev, steps: updatedSteps };
    });
  };

  const deleteLocalStep = (stepId) => {
    setLocalData((prev) => {
      const step = prev.steps.find((s) => s._id === stepId);
      const filteredSteps = prev.steps.filter((s) => s._id !== stepId);
      const filteredOptions = step ? prev.options.filter((o) => o.stepKey !== step.key) : prev.options;
      return { ...prev, steps: filteredSteps, options: filteredOptions };
    });
  };

  const updateLocalOption = (option) => {
    setLocalData((prev) => {
      const exists = prev.options.some((o) => o._id === option._id || (o.stepKey === option.stepKey && o.optionId === option.optionId));
      const updatedOptions = exists
        ? prev.options.map((o) => (o._id === option._id || (o.stepKey === option.stepKey && o.optionId === option.optionId) ? { ...o, ...option } : o))
        : [...prev.options, { ...option, _id: "opt_" + Date.now() }];
      return { ...prev, options: updatedOptions };
    });
  };

  const deleteLocalOption = (optionId) => {
    setLocalData((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o._id !== optionId),
    }));
  };

  const updateLocalSettings = (settings) => {
    setLocalData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const addLocalLead = (lead) => {
    const newLead = {
      ...lead,
      _id: "lead_" + Date.now(),
      status: "new",
      createdAt: Date.now(),
    };
    setLocalData((prev) => ({
      ...prev,
      leads: [newLead, ...(prev.leads || [])],
    }));
    return newLead;
  };

  const updateLocalLeadStatus = (leadId, status, adminNote) => {
    setLocalData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l._id === leadId ? { ...l, status, ...(adminNote !== undefined ? { adminNote } : {}) } : l
      ),
    }));
  };

  const updateLocalFault = (fault) => {
    setLocalData((prev) => {
      const exists = (prev.faultGuides || []).some((f) => f._id === fault._id || f.faultId === fault.faultId);
      const updatedFaults = exists
        ? (prev.faultGuides || []).map((f) => (f._id === fault._id || f.faultId === fault.faultId ? { ...f, ...fault } : f))
        : [...(prev.faultGuides || []), { ...fault, _id: "fault_" + Date.now() }];
      return { ...prev, faultGuides: updatedFaults };
    });
  };

  const deleteLocalFault = (faultId) => {
    setLocalData((prev) => ({
      ...prev,
      faultGuides: (prev.faultGuides || []).filter((f) => f._id !== faultId),
    }));
  };

  const updateLocalDevice = (device) => {
    setLocalData((prev) => {
      const exists = (prev.devices || []).some((d) => d._id === device._id || d.deviceId === device.deviceId || d.id === device.id);
      const updatedDevices = exists
        ? (prev.devices || []).map((d) => (d._id === device._id || d.deviceId === device.deviceId || d.id === device.id ? { ...d, ...device } : d))
        : [...(prev.devices || []), { ...device, _id: "dev_" + Date.now(), id: device.deviceId || `dev_${Date.now()}` }];
      return { ...prev, devices: updatedDevices };
    });
  };

  const deleteLocalDevice = (deviceId) => {
    setLocalData((prev) => ({
      ...prev,
      devices: (prev.devices || []).filter((d) => d._id !== deviceId && d.deviceId !== deviceId && d.id !== deviceId),
    }));
  };

  const updateLocalFilterSet = (filterSet) => {
    setLocalData((prev) => {
      const exists = (prev.filterSets || []).some((fs) => fs._id === filterSet._id || fs.setId === filterSet.setId || fs.id === filterSet.id);
      const updatedFilterSets = exists
        ? (prev.filterSets || []).map((fs) => (fs._id === filterSet._id || fs.setId === filterSet.setId || fs.id === filterSet.id ? { ...fs, ...filterSet } : fs))
        : [...(prev.filterSets || []), { ...filterSet, _id: "fs_" + Date.now(), id: filterSet.setId || `fs_${Date.now()}` }];
      return { ...prev, filterSets: updatedFilterSets };
    });
  };

  const deleteLocalFilterSet = (filterSetId) => {
    setLocalData((prev) => ({
      ...prev,
      filterSets: (prev.filterSets || []).filter((fs) => fs._id !== filterSetId && fs.setId !== filterSetId && fs.id !== filterSetId),
    }));
  };

  const resetLocalToDefault = () => {
    setLocalData(DEFAULT_LOCAL_STATE);
  };

  const contextValue = {
    isConvexConnected: Boolean(CONVEX_URL),
    isAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    localData,
    updateLocalStep,
    deleteLocalStep,
    updateLocalOption,
    deleteLocalOption,
    updateLocalDevice,
    deleteLocalDevice,
    updateLocalFilterSet,
    deleteLocalFilterSet,
    updateLocalFault,
    deleteLocalFault,
    updateLocalSettings,
    addLocalLead,
    updateLocalLeadStatus,
    resetLocalToDefault,
  };

  if (convexClient) {
    return (
      <OriginalConvexProvider client={convexClient}>
        <LocalDataContext.Provider value={contextValue}>{children}</LocalDataContext.Provider>
      </OriginalConvexProvider>
    );
  }

  return <LocalDataContext.Provider value={contextValue}>{children}</LocalDataContext.Provider>;
}

export function useLocalData() {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error("useLocalData must be used within an AppConvexProvider");
  }
  return context;
}
