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
      guideText: "Tekirdağ'da 3. kat ve üzeri dairelerde şebeke basıncı düştüğü için 'Pompalı' model önerilir. Giriş katlar için pompasız yeterlidir.",
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
      return saved ? JSON.parse(saved) : DEFAULT_LOCAL_STATE;
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
