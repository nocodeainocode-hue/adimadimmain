import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Site Ayarlarını Getir
export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();
  },
});

// Site Ayarlarını Güncelle
export const updateSettings = mutation({
  args: {
    brandName: v.string(),
    whatsappNumber: v.string(),
    whatsappDisplay: v.string(),
    basePrice: v.number(),
    baseCost: v.number(),
    discountRate: v.number(),
    discountBadgeText: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
      return existing._id;
    } else {
      return await ctx.db.insert("siteSettings", {
        key: "global",
        ...args,
      });
    }
  },
});

// İlk Kurulum / Varsayılan Verileri Tohumlama (Seed)
export const seedDefaultData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Mevcut verileri temizle
    const existingSteps = await ctx.db.query("builderSteps").collect();
    for (const s of existingSteps) await ctx.db.delete(s._id);

    const existingOptions = await ctx.db.query("builderOptions").collect();
    for (const o of existingOptions) await ctx.db.delete(o._id);

    const existingSettings = await ctx.db.query("siteSettings").collect();
    for (const set of existingSettings) await ctx.db.delete(set._id);

    // 2. Global Ayarları Ekle
    await ctx.db.insert("siteSettings", {
      key: "global",
      brandName: "Lotus Su Arıtma",
      whatsappNumber: "905550000000",
      whatsappDisplay: "+90 (555) 000 00 00",
      basePrice: 500,
      baseCost: 180, // Filtre kabı, çekvalf, fitting, hortum toptan maliyeti
      discountRate: 0.2,
      discountBadgeText: "🎁 Formu Doldur %20 İndirim Kazan",
    });

    // 3. Adımları Ekle
    const stepsData = [
      {
        key: "kasa",
        stepNumber: 1,
        order: 1,
        badge: "1. Adım • Dış Gövde & Kasa",
        title: "Kasa Tipinizi Seçin",
        description:
          "Tezgah altınızın alanına ve estetik tercihinize en uygun kasa modelini belirleyin.",
        icon: "Layers",
        isActive: true,
      },
      {
        key: "filtre",
        stepNumber: 2,
        order: 2,
        badge: "2. Adım • Filtrasyon Teknolojisi",
        title: "Filtre Paketinizi Seçin",
        description:
          "İçme suyunuzun mineral zenginliğini, pH alkali seviyesini ve membran arıtma kalitesini belirleyin.",
        icon: "Droplets",
        isActive: true,
      },
      {
        key: "beyin",
        stepNumber: 3,
        order: 3,
        badge: "3. Adım • Otomasyon & Emniyet",
        title: "Sistem Beynini Seçin",
        description:
          "Su tasarrufu, otomatik yıkama ve mutfak dolabını su basmasına karşı koruyan emniyet sistemini belirleyin.",
        icon: "Cpu",
        isActive: true,
      },
      {
        key: "pompa",
        stepNumber: 4,
        order: 4,
        badge: "4. Adım • Basınç & Pompa",
        title: "Basınç Pompa Tercihiniz",
        description:
          "Bulunduğunuz kat ve şebeke suyu basıncınıza göre pompalı veya pompasız sistemi belirleyin.",
        icon: "Zap",
        guideText:
          "Tekirdağ'da 3. kat ve üzeri dairelerde şebeke basıncı düştüğü için 'Pompalı' model önerilir. Giriş katlar için pompasız yeterlidir.",
        isActive: true,
      },
      {
        key: "tank",
        stepNumber: 5,
        order: 5,
        badge: "5. Adım • Su Depolama Rezervi",
        title: "Depolama Tankı Kapasitesi",
        description:
          "Hanedeki kişi sayısına ve günlük yemek/içme suyu tüketim hacminize uygun antibakteriyel tankı seçin.",
        icon: "Cylinder",
        isActive: true,
      },
      {
        key: "musluk",
        stepNumber: 6,
        order: 6,
        badge: "6. Adım • Tezgah Üstü Musluk & Batarya",
        title: "Arıtma Musluğunuzu Seçin",
        description:
          "Evye tasarımınıza uygun şık ve gıda uyumlu paslanmaz çelik arıtma musluğu belirleyin.",
        icon: "Pipette",
        isActive: true,
      },
    ];

    for (const step of stepsData) {
      await ctx.db.insert("builderSteps", step);
    }

    // 4. Parçaları / Seçenekleri Ekle (Alış Maliyeti ve Satış Fiyatı ile)
    const optionsData = [
      // Kasa
      {
        stepKey: "kasa",
        optionId: "acik",
        name: "Açık Kasa",
        costPrice: 320,
        salePrice: 750,
        desc: "Klasik tezgah altı açık montaj kasası, kolay filtre kontrolü",
        img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Klasik açık montaj kasası, filtre gövdelerini şeffafça görmenizi ve değişim periyotlarında kolayca müdahale etmenizi sağlar.",
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
        order: 1,
        isActive: true,
      },
      {
        stepKey: "kasa",
        optionId: "kapali",
        name: "Kapalı Kasa",
        costPrice: 650,
        salePrice: 1500,
        badge: "En Çok Tercih Edilen",
        desc: "Kompakt, şık ve toza/neme karşı tam korumalı hijyenik kabin",
        img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Şık beyaz gövdesiyle tüm filtreleri tek bir kapalı gövde içinde toplar. Nem ve dış etkenlere karşı tam koruma sağlar.",
        specs: [
          "Gövde: Antibakteriyel ABS Plastik Kabin",
          "Boyut: 41x26x40 cm (Kompakt)",
          "Koruma: Toz, Nem & Dış Etken Korumalı",
        ],
        highlights: [
          "En çok satan gövde tasarımı",
          "Mutfak dolabında sıfır hortum karmaşası",
          "Darbeye ve basınca dayanıklı ABS malzeme",
        ],
        order: 2,
        isActive: true,
      },
      {
        stepKey: "kasa",
        optionId: "cam_slim",
        name: "Lüks Cam Kapaklı / Slim Kasa",
        costPrice: 1150,
        salePrice: 2500,
        badge: "Ultra Slim Mimari",
        desc: "Ultra modern, dar mutfak alanlarına özel temperli cam ön kapak",
        img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Sadece 14 cm derinliğiyle en dar mutfak dolaplarına dahi kolayca sığar. Füme temperli cam kapağı manyetik olarak açılır.",
        specs: [
          "Ön Panel: 4mm Temperli Füme Cam Kapak",
          "Boyut: 39x14x42 cm (Ultra İnce Slim)",
          "Açılış: Manyetik Kilitli Kolay Ön Kapak",
        ],
        highlights: [
          "Ultra ince (Slim) mimari tasarım",
          "Manyetik pratik ön kapak mekanizması",
          "Lüks mutfaklara özel estetik cam panel",
        ],
        order: 3,
        isActive: true,
      },

      // Filtre
      {
        stepKey: "filtre",
        optionId: "eko5",
        name: "5'li Eko Filtre Seti",
        costPrice: 480,
        salePrice: 1200,
        desc: "Tortu, klor, pas ve aktif karbon filtrasyonu (5 aşama)",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "5 temel kademeden oluşan ekonomik filtre setidir. Kaba tortu, kum, pas ve kloru %95+ oranında arıtır.",
        specs: [
          "Aşama: 5 Kademeli Ters Ozmoz Filtrasyon",
          "Membran: 75 GPD Standart RO Membran",
        ],
        highlights: ["Tortu, klor ve kireç arıtımı", "Standart hane kullanımı için ideal"],
        order: 1,
        isActive: true,
      },
      {
        stepKey: "filtre",
        optionId: "premium5",
        name: "5'li Premium Filtre Seti",
        costPrice: 950,
        salePrice: 2400,
        badge: "Fiyat/Performans",
        desc: "İthal NSF onaylı membran + doğal mineral zenginleştirici",
        img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "İthal NSF onaylı yüksek verimli membran ile mikroskobik ağır metalleri ve bakterileri %99.2 oranında süzer.",
        specs: [
          "Aşama: 5 Kademeli Zenginleştirilmiş Filtrasyon",
          "Membran: 80 GPD İthal NSF/ANSI 58 Sertifikalı Membran",
          "Mineral: Kalsiyum, Magnezyum Doğal Mineral Kartuşu",
        ],
        highlights: [
          "NSF Uluslararası Sağlık Sertifikalı",
          "Doğal mineral takviyesiyle tatlı memba lezzeti",
        ],
        order: 2,
        isActive: true,
      },
      {
        stepKey: "filtre",
        optionId: "diamond5",
        name: "5'li PLATINUM PLUS DIAMOND",
        costPrice: 1750,
        salePrice: 4200,
        badge: "Ultra Zengin Mineral",
        desc: "Alkali pH 9+, Detoks, Doğal Taş Mineral & Bioceramic hidrojen desteği",
        img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Arıtmanın zirvesi: Standart filtrasyonun ötesinde, suyu pH 9+ alkali seviyesine yükseltir ve antioksidan sunar.",
        specs: [
          "Membran: Orijinal Dow Filmtec / Vontron Yüksek Basınç Membranı",
          "Alkali: Doğal Taş pH 9+ Alkali İyonize Filtre",
          "Detoks: Far-Infrared Bioceramic Su Molekülü Aktivatörü",
        ],
        highlights: [
          "pH 9+ Yüksek Alkali & Antioksidan zengini",
          "Bioceramic hidrojen & negatif iyon enerjisi",
        ],
        order: 3,
        isActive: true,
      },

      // Beyin
      {
        stepKey: "beyin",
        optionId: "mekanik",
        name: "Standart Mekanik Beyin",
        costPrice: 35,
        salePrice: 100,
        desc: "Otomatik hidrolik şatof kesici valf ve basınç anahtarı",
        img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Depo dolduğunda su girişini mekanik basınç farkıyla otomatik keser. Elektriksiz sorunsuz çalışır.",
        specs: ["Tip: 4 Yollu Hidrolik Şatof Valf", "Çalışma: Elektriksiz Otomatik"],
        highlights: ["Sıfır elektrik tüketimi", "Mekanik arıza riski en düşük sistem"],
        order: 1,
        isActive: true,
      },
      {
        stepKey: "beyin",
        optionId: "dijital",
        name: "Akıllı Dijital Beyin",
        costPrice: 95,
        salePrice: 250,
        badge: "Su Kaçağı Korumalı",
        desc: "TDS su saflık ölçer, otomatik ters yıkama ve su sızıntı emniyet sensörü",
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Su kalitesini anlık TDS ile ölçer; en ufak sızıntıda giriş suyunu anında kilitleyerek su baskınını önler.",
        specs: [
          "Sensör: Dijital Giriş/Çıkış TDS Saflık Ölçer",
          "Emniyet: Akıllı Su Sızıntısı Kesme Sensörü",
        ],
        highlights: [
          "Anlık su saflık (TDS) kalite göstergesi",
          "Akıllı su kaçağı algılama ve otomatik kilit",
        ],
        order: 2,
        isActive: true,
      },

      // Pompa
      {
        stepKey: "pompa",
        optionId: "pompasiz",
        name: "Pompasız (Yüksek Şebeke Basıncı)",
        costPrice: 0,
        salePrice: 0,
        desc: "Giriş katlar ve 3 bar üzeri yüksek su basıncına sahip daireler için",
        img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        longDesc: "Şebeke basıncının yüksek olduğu dairelerde doğrudan şebeke gücüyle çalışır.",
        specs: ["Gerekli Basınç: Minimum 3.5 Bar", "Elektrik: Yok"],
        highlights: ["Sıfır elektrik sarfiyatı", "Tamamen sessiz çalışma"],
        order: 1,
        isActive: true,
      },
      {
        stepKey: "pompa",
        optionId: "pompali",
        name: "Pompalı (+Sessiz Booster Pompa)",
        costPrice: 780,
        salePrice: 1800,
        badge: "Tekirdağ Tavsiyesi",
        desc: "3. kat ve üzeri veya düşük basınçlı daireler için 24V sessiz booster pompa",
        img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Özellikle üst katlarda su basıncını ideal 5.5 bar seviyesine çıkarır, deponun 3 kat hızlı dolmasını sağlar.",
        specs: ["Motor: 24V DC Yüksek Torklu Pompa", "Gürültü: <28 dB"],
        highlights: [
          "Gereksiz atık su israfını %60 azaltır",
          "Titreşimsiz ve fısıltı sessizliğinde",
        ],
        order: 2,
        isActive: true,
      },
      {
        stepKey: "pompa",
        optionId: "emin_degilim",
        name: "Emin Değilim (Uzman Kontrol Etsin)",
        costPrice: 0,
        salePrice: 0,
        badge: "Ücretsiz Keşif",
        desc: "Tekirdağ ilçenizin şebeke basıncını uzmanımız ücretsiz kontrol etsin",
        img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Uzman teknisyenimiz montaj anında manometre ile basıncı ölçer; sadece gerekiyorsa pompa eklenir.",
        specs: ["Hizmet: Ücretsiz Yerinde Basınç Ölçümü"],
        highlights: ["Tekirdağ geneli ücretsiz keşif", "Gereksiz masraftan koruyan analiz"],
        order: 3,
        isActive: true,
      },

      // Tank
      {
        stepKey: "tank",
        optionId: "eko8",
        name: "Eko Tank (8 Litre)",
        costPrice: 620,
        salePrice: 1500,
        desc: "1-3 kişilik haneler için gıda uyumlu antibakteriyel basınç tankı",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        longDesc: "Kompakt ebatlarıyla tezgah altında minimum yer kaplar.",
        specs: ["Kapasite: 8 Litre", "İç Kaplama: Gıda Uyumlu Butil Diyafram"],
        highlights: ["Dar dolaplar için kompakt", "Bakteri üretmeyen diyafram"],
        order: 1,
        isActive: true,
      },
      {
        stepKey: "tank",
        optionId: "plat12",
        name: "Platinum Tank (12 Litre Paslanmaz)",
        costPrice: 1250,
        salePrice: 3000,
        badge: "Geniş Aileler",
        desc: "3-5+ kişilik haneler için paslanmaz çelik yüksek kapasiteli depo",
        img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
        longDesc: "304 paslanmaz çelik gövdesiyle ömür boyu korozyon ve koku yapmaz.",
        specs: ["Kapasite: 12 Litre", "Gövde: 304 Kalite Paslanmaz Çelik"],
        highlights: ["12 Litre kesintisiz su rezervi", "304 paslanmaz maksimum dayanıklılık"],
        order: 2,
        isActive: true,
      },

      // Musluk
      {
        stepKey: "musluk",
        optionId: "eko",
        name: "Eko Paslanmaz Kuğu Musluk",
        costPrice: 180,
        salePrice: 500,
        desc: "Klasik döner borulu paslanmaz çelik arıtma musluğu",
        img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        longDesc: "Klasik ve dayanıklı paslanmaz çelik kuğu boyunlu arıtma musluğu.",
        specs: ["Malzeme: SUS304 Paslanmaz Çelik", "Dönüş: 360 Derece"],
        highlights: ["Damlatmaz seramik çekirdek", "360 derece rahat dönüş"],
        order: 1,
        isActive: true,
      },
      {
        stepKey: "musluk",
        optionId: "lux",
        name: "Mat Siyah / Gold Lüks Musluk",
        costPrice: 480,
        salePrice: 1200,
        badge: "Tasarım Ödüllü",
        desc: "Modern mutfak evyelerine uyumlu estetik mat siyah veya gold tasarım",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        longDesc: "Çizilmeye ve parmak izine dayanıklı elektrostatik kaplamalı lüks musluk.",
        specs: ["Renk: Mat Siyah / Gold", "Malzeme: Katı Pirinç Gövde"],
        highlights: ["Mat Siyah & Gold renkler", "Parmak izi ve kireç tutmaz"],
        order: 2,
        isActive: true,
      },
      {
        stepKey: "musluk",
        optionId: "3yollu",
        name: "3 Yollu Lüks Mutfak Bataryası",
        costPrice: 1350,
        salePrice: 3000,
        badge: "Tezgahı Deldirmez",
        desc: "Sıcak + Soğuk + Arıtılmış su tek gövdede! Tezgah delme gerektirmez.",
        img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
        longDesc:
          "Mevcut ana mutfak bataryanızın yerine takılır. Sıcak/soğuk şebeke ve saf arıtma suyu ayrı kanallardan akar, tezgahı deldirmez.",
        specs: [
          "Fonksiyon: Sıcak + Soğuk + Arıtılmış Su",
          "Malzeme: 3 Girişli Masif Pirinç",
        ],
        highlights: [
          "Tezgahta ikinci bir delik açtırmaz",
          "Lüks porselen/kuvars tezgahlar için 1 numara",
        ],
        order: 3,
        isActive: true,
      },
    ];

    for (const opt of optionsData) {
      await ctx.db.insert("builderOptions", opt);
    }

    return { success: true, stepsCount: stepsData.length, optionsCount: optionsData.length };
  },
});
