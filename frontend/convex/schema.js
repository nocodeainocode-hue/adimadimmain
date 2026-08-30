import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Konfigüratör Adımları (Dinamik Adım Motoru)
  builderSteps: defineTable({
    key: v.string(), // "kasa", "filtre", "beyin", "pompa", "tank", "musluk", vb.
    stepNumber: v.number(),
    order: v.number(),
    badge: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    guideText: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Her adımdaki parçalar / seçenekler
  builderOptions: defineTable({
    stepKey: v.string(),
    optionId: v.string(),
    name: v.string(),
    costPrice: v.number(),
    salePrice: v.number(),
    desc: v.string(),
    img: v.string(),
    badge: v.optional(v.string()),
    longDesc: v.optional(v.string()),
    specs: v.optional(v.array(v.string())),
    highlights: v.optional(v.array(v.string())),
    order: v.number(),
    isActive: v.boolean(),
  })
    .index("by_stepKey", ["stepKey"])
    .index("by_order", ["order"]),

  // Hazır Cihaz & Model Kataloğu (Satın Alma Akışı)
  catalogDevices: defineTable({
    deviceId: v.string(),
    name: v.string(),
    price: v.string(),
    costPrice: v.optional(v.number()),
    salePrice: v.optional(v.number()),
    tagline: v.string(),
    budgetTags: v.array(v.string()), // ["eko", "orta", "premium"]
    consumptionTags: v.array(v.string()), // ["az", "orta", "cok"]
    capacity: v.string(),
    warranty: v.string(),
    img: v.string(),
    features: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Filtre Değişim Paketleri
  filterSets: defineTable({
    setId: v.string(), // "set3", "set5", vb.
    name: v.string(),
    subtitle: v.string(),
    recommendedFor: v.string(), // "Son değişim ~6 ay önce"
    matchKey: v.string(), // "6ay", "1yil", "bilmiyorum"
    price: v.string(),
    costPrice: v.optional(v.number()),
    salePrice: v.optional(v.number()),
    img: v.string(),
    desc: v.string(),
    includes: v.array(v.string()),
    benefits: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Arıza Rehberi & Çözüm / Uzman Tavsiyeleri
  faultGuides: defineTable({
    faultId: v.string(),
    label: v.string(),
    title: v.string(),
    body: v.string(),
    tips: v.array(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Gelen Müşteri Talepleri ve Siparişler
  leads: defineTable({
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    district: v.string(),
    flowType: v.string(),
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
    totalCostPrice: v.number(),
    estimatedProfit: v.number(),
    profitMarginPercent: v.number(),
    status: v.string(),
    adminNote: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  // Genel Site & Fiyat Ayarları
  siteSettings: defineTable({
    key: v.string(),
    brandName: v.string(),
    whatsappNumber: v.string(),
    whatsappDisplay: v.string(),
    basePrice: v.number(),
    baseCost: v.number(),
    discountRate: v.number(),
    discountBadgeText: v.string(),
    districts: v.optional(v.array(v.string())),
  }).index("by_key", ["key"]),
});
