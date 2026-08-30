import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Konfigüratör Adımları (Dinamik Adım Motoru)
  builderSteps: defineTable({
    key: v.string(), // "kasa", "filtre", "beyin", "pompa", "tank", "musluk", vb.
    stepNumber: v.number(), // 1, 2, 3, 4, 5, 6...
    order: v.number(),
    badge: v.string(), // "1. Adım • Dış Gövde & Kasa"
    title: v.string(), // "Kasa Tipinizi Seçin"
    description: v.string(), // "Tezgah altınızın alanına ve estetik tercihinize..."
    icon: v.optional(v.string()), // "Layers", "Droplets", "Cpu", "Zap", "Cylinder", "Pipette"
    guideText: v.optional(v.string()), // Örn. Pompa için "Neye Göre Seçmelisiniz?" rehber kutusu metni
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Her adımdaki parçalar / seçenekler
  builderOptions: defineTable({
    stepKey: v.string(), // builderSteps.key ile eşleşir
    optionId: v.string(), // "acik", "kapali", "cam_slim", vb.
    name: v.string(), // "Kapalı Kasa"
    costPrice: v.number(), // Alış / Maliyet Fiyatı ₺ (Admin içi)
    salePrice: v.number(), // Satış Liste Fiyatı ₺
    desc: v.string(), // Kısa açıklama (kart üstü)
    img: v.string(), // HD Görsel URL
    badge: v.optional(v.string()), // "En Çok Tercih Edilen", "Fiyat/Performans", vb.
    longDesc: v.optional(v.string()), // Modal detaylı açıklama
    specs: v.optional(v.array(v.string())), // Teknik özellikler listesi
    highlights: v.optional(v.array(v.string())), // Öne çıkan avantajlar listesi
    order: v.number(),
    isActive: v.boolean(),
  })
    .index("by_stepKey", ["stepKey"])
    .index("by_order", ["order"]),

  // Gelen Müşteri Talepleri ve Siparişler
  leads: defineTable({
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    district: v.string(),
    flowType: v.string(), // "builder", "buy", "filter", "fault"
    selectedItems: v.optional(
      v.array(
        v.object({
          stepTitle: v.string(),
          name: v.string(),
          costPrice: v.number(),
          salePrice: v.number(),
        })
      )
    ),
    basePrice: v.optional(v.number()),
    baseCost: v.optional(v.number()),
    totalListPrice: v.number(),
    finalDiscountedPrice: v.number(),
    totalCostPrice: v.number(), // Toplam Parça Alış Maliyeti ₺
    estimatedProfit: v.number(), // Tahmini Net Kâr ₺
    profitMarginPercent: v.number(), // Kâr Marjı %
    status: v.string(), // "new" | "called" | "appointment" | "completed" | "cancelled"
    adminNote: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // Genel Site & Fiyat Ayarları
  siteSettings: defineTable({
    key: v.string(), // "global"
    brandName: v.string(),
    whatsappNumber: v.string(),
    whatsappDisplay: v.string(),
    basePrice: v.number(), // Baz montaj/aparat bedeli (500 ₺)
    baseCost: v.number(), // Baz parça maliyeti (200 ₺)
    discountRate: v.number(), // %20 -> 0.20
    discountBadgeText: v.string(), // "🎁 Formu Doldur %20 İndirim Kazan"
  }).index("by_key", ["key"]),
});
