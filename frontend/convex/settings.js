import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

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
    await requireAdmin(ctx);
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
    await requireAdmin(ctx);
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
        guideText:
          "Mutfak dolabınızda dar alan varsa 'Kapalı Kasa' veya 'Slim Cam' kasa; geniş dolaplar ve en ekonomik bütçe için 'Açık Kasa' tercih edebilirsiniz.",
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
        guideText:
          "Tekirdağ'ın yüksek kireçli şebeke suyu için en az 5 aşamalı NSF onaylı membran ve doğal mineral filtreli set tavsiye edilir.",
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
        guideText:
          "Mutfak dolabında su kaçağı riskini sıfırlamak, membran ömrünü uzatmak ve suyun saflık (TDS) değerini anlık görmek için 'Akıllı Dijital Beyin' önerilir.",
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
          "Tekirdağ'da 3. kat ve üzeri dairelerde şebeke basıncı düştüğü için 'Pompalı' model önerilir. Giriş katlar için pompasız yeterlidir. Emin değilseniz uzmanımız montajda ücretsiz ölçüm yapacaktır.",
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
        guideText:
          "1-3 kişilik çekirdek aileler için 8L Eko Tank; kalabalık aileler ve yemek pişirmede bol arıtılmış su kullananlar için 12L Paslanmaz Platinum Tank önerilir.",
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
        guideText:
          "Mutfak tezgahınızın delinmesini istemiyorsanız '3 Yollu Lüks Batarya'; klasik ve dayanıklı tezgah üstü kullanım için paslanmaz kuğu musluk önerilir.",
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

    // 5. Arıza Rehberi Verilerini Ekle
    const existingFaults = await ctx.db.query("faultGuides").collect();
    for (const f of existingFaults) await ctx.db.delete(f._id);

    const faultGuidesData = [
      {
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
        faultId: "sizinti",
        label: "Sızıntı var",
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
    ];

    for (const fault of faultGuidesData) {
      await ctx.db.insert("faultGuides", fault);
    }

    // 6. Hazır Cihaz Kataloğu Verilerini Ekle
    const existingDevices = await ctx.db.query("catalogDevices").collect();
    for (const d of existingDevices) await ctx.db.delete(d._id);

    const devicesData = [
      {
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
    ];

    for (const dev of devicesData) {
      await ctx.db.insert("catalogDevices", dev);
    }

    // 7. Filtre Paketleri Verilerini Ekle
    const existingFilterSets = await ctx.db.query("filterSets").collect();
    for (const fs of existingFilterSets) await ctx.db.delete(fs._id);

    const filterSetsData = [
      {
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
    ];

    for (const fs of filterSetsData) {
      await ctx.db.insert("filterSets", fs);
    }

    return {
      success: true,
      stepsCount: stepsData.length,
      optionsCount: optionsData.length,
      faultsCount: faultGuidesData.length,
      devicesCount: devicesData.length,
      filterSetsCount: filterSetsData.length,
    };
  },
});

// Arıza Rehberi Query & Mutations
export const getFaultGuides = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("faultGuides")
      .withIndex("by_order")
      .collect();
  },
});

export const updateFaultGuide = mutation({
  args: {
    _id: v.optional(v.id("faultGuides")),
    faultId: v.string(),
    label: v.string(),
    title: v.string(),
    body: v.string(),
    tips: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { _id, ...data } = args;
    if (_id) {
      await ctx.db.patch(_id, data);
      return _id;
    } else {
      return await ctx.db.insert("faultGuides", data);
    }
  },
});

export const deleteFaultGuide = mutation({
  args: { id: v.id("faultGuides") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return true;
  },
});

// Hazır Cihaz Kataloğu Query & Mutations
export const getCatalogDevices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("catalogDevices")
      .withIndex("by_order")
      .collect();
  },
});

export const updateCatalogDevice = mutation({
  args: {
    _id: v.optional(v.id("catalogDevices")),
    deviceId: v.string(),
    name: v.string(),
    price: v.string(),
    costPrice: v.optional(v.number()),
    salePrice: v.optional(v.number()),
    tagline: v.string(),
    budgetTags: v.array(v.string()),
    consumptionTags: v.array(v.string()),
    capacity: v.string(),
    warranty: v.string(),
    img: v.string(),
    galleryImages: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    specs: v.optional(v.array(v.string())),
    includedItems: v.optional(v.array(v.string())),
    maintenanceInfo: v.optional(v.string()),
    recommendationReason: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),
    features: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { _id, ...data } = args;
    if (_id) {
      await ctx.db.patch(_id, data);
      return _id;
    } else {
      return await ctx.db.insert("catalogDevices", data);
    }
  },
});

export const deleteCatalogDevice = mutation({
  args: { id: v.id("catalogDevices") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return true;
  },
});

// Filtre Paketleri Query & Mutations
export const getFilterSets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("filterSets")
      .withIndex("by_order")
      .collect();
  },
});

export const updateFilterSet = mutation({
  args: {
    _id: v.optional(v.id("filterSets")),
    setId: v.string(),
    name: v.string(),
    subtitle: v.string(),
    recommendedFor: v.string(),
    matchKey: v.string(),
    price: v.string(),
    costPrice: v.optional(v.number()),
    salePrice: v.optional(v.number()),
    img: v.string(),
    desc: v.string(),
    includes: v.array(v.string()),
    benefits: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { _id, ...data } = args;
    if (_id) {
      await ctx.db.patch(_id, data);
      return _id;
    } else {
      return await ctx.db.insert("filterSets", data);
    }
  },
});

export const deleteFilterSet = mutation({
  args: { id: v.id("filterSets") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return true;
  },
});
