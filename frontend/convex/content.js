import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

const MIGRATION_KEY = "convex_content_v1";

const withoutSystemFields = (value = {}) => {
  const { _id, _creationTime, ...data } = value;
  return data;
};

const clearTable = async (ctx, tableName) => {
  const documents = await ctx.db.query(tableName).collect();
  for (const document of documents) await ctx.db.delete(document._id);
};

const cleanStep = (value) => {
  const data = withoutSystemFields(value);
  return {
    key: String(data.key || ""),
    stepNumber: Number(data.stepNumber || 0),
    order: Number(data.order || 0),
    badge: String(data.badge || ""),
    title: String(data.title || ""),
    description: String(data.description || ""),
    ...(data.icon ? { icon: String(data.icon) } : {}),
    ...(data.guideText ? { guideText: String(data.guideText) } : {}),
    isActive: data.isActive !== false,
  };
};

const cleanOption = (value) => {
  const data = withoutSystemFields(value);
  return {
    stepKey: String(data.stepKey || ""),
    optionId: String(data.optionId || ""),
    name: String(data.name || ""),
    costPrice: Number(data.costPrice || 0),
    salePrice: Number(data.salePrice || 0),
    desc: String(data.desc || ""),
    img: String(data.img || ""),
    ...(data.badge ? { badge: String(data.badge) } : {}),
    ...(data.longDesc ? { longDesc: String(data.longDesc) } : {}),
    specs: Array.isArray(data.specs) ? data.specs.map(String) : [],
    highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
    order: Number(data.order || 0),
    isActive: data.isActive !== false,
  };
};

const cleanDevice = (value) => {
  const data = withoutSystemFields(value);
  return {
    deviceId: String(data.deviceId || data.id || `device-${Date.now()}`),
    name: String(data.name || ""),
    price: String(data.price || ""),
    costPrice: Number(data.costPrice || 0),
    salePrice: Number(data.salePrice || 0),
    tagline: String(data.tagline || ""),
    budgetTags: Array.isArray(data.budgetTags) ? data.budgetTags.map(String) : [],
    consumptionTags: Array.isArray(data.consumptionTags) ? data.consumptionTags.map(String) : [],
    capacity: String(data.capacity || ""),
    warranty: String(data.warranty || ""),
    img: String(data.img || ""),
    features: Array.isArray(data.features) ? data.features.map(String) : [],
    order: Number(data.order || 0),
    isActive: data.isActive !== false,
  };
};

const cleanFilterSet = (value) => {
  const data = withoutSystemFields(value);
  return {
    setId: String(data.setId || data.id || `filter-${Date.now()}`),
    name: String(data.name || ""),
    subtitle: String(data.subtitle || ""),
    recommendedFor: String(data.recommendedFor || ""),
    matchKey: String(data.matchKey || ""),
    price: String(data.price || ""),
    costPrice: Number(data.costPrice || 0),
    salePrice: Number(data.salePrice || 0),
    img: String(data.img || ""),
    desc: String(data.desc || ""),
    includes: Array.isArray(data.includes) ? data.includes.map(String) : [],
    benefits: Array.isArray(data.benefits) ? data.benefits.map(String) : [],
    order: Number(data.order || 0),
    isActive: data.isActive !== false,
  };
};

const cleanFault = (value) => {
  const data = withoutSystemFields(value);
  return {
    faultId: String(data.faultId || data.id || `fault-${Date.now()}`),
    label: String(data.label || ""),
    title: String(data.title || ""),
    body: String(data.body || ""),
    tips: Array.isArray(data.tips) ? data.tips.map(String) : [],
    order: Number(data.order || 0),
    isActive: data.isActive !== false,
  };
};

const cleanLead = (value) => {
  const data = withoutSystemFields(value);
  return {
    fullName: String(data.fullName || "İsimsiz Müşteri"),
    phone: String(data.phone || ""),
    city: String(data.city || ""),
    district: String(data.district || ""),
    flowType: String(data.flowType || ""),
    ...(data.itemName ? { itemName: String(data.itemName) } : {}),
    ...(Array.isArray(data.selectedItems) ? {
      selectedItems: data.selectedItems.map((item) => ({
        stepTitle: String(item.stepTitle || ""),
        name: String(item.name || ""),
        costPrice: Number(item.costPrice || 0),
        salePrice: Number(item.salePrice || 0),
      })),
    } : {}),
    basePrice: Number(data.basePrice || 0),
    baseCost: Number(data.baseCost || 0),
    totalListPrice: Number(data.totalListPrice || 0),
    finalDiscountedPrice: Number(data.finalDiscountedPrice || 0),
    totalCostPrice: Number(data.totalCostPrice || 0),
    estimatedProfit: Number(data.estimatedProfit || 0),
    profitMarginPercent: Number(data.profitMarginPercent || 0),
    status: String(data.status || "new"),
    ...(data.adminNote ? { adminNote: String(data.adminNote) } : {}),
    createdAt: Number(data.createdAt || Date.now()),
  };
};

const cleanSettings = (value = {}) => ({
  key: "global",
  brandName: String(value.brandName || "Lotus Su Arıtma"),
  whatsappNumber: String(value.whatsappNumber || ""),
  whatsappDisplay: String(value.whatsappDisplay || ""),
  basePrice: Number(value.basePrice || 0),
  baseCost: Number(value.baseCost || 0),
  discountRate: Number(value.discountRate ?? 0.2),
  discountBadgeText: String(value.discountBadgeText || ""),
  ...(Array.isArray(value.districts) ? { districts: value.districts.map(String) } : {}),
});

export const getSnapshot = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [steps, options, devices, filterSets, faultGuides, leads, settings, texts, migration] =
      await Promise.all([
        ctx.db.query("builderSteps").withIndex("by_order").collect(),
        ctx.db.query("builderOptions").withIndex("by_order").collect(),
        ctx.db.query("catalogDevices").withIndex("by_order").collect(),
        ctx.db.query("filterSets").withIndex("by_order").collect(),
        ctx.db.query("faultGuides").withIndex("by_order").collect(),
        ctx.db.query("leads").withIndex("by_createdAt").order("desc").collect(),
        ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", "global")).first(),
        ctx.db.query("siteTexts").withIndex("by_key", (q) => q.eq("key", "global")).first(),
        ctx.db.query("appState").withIndex("by_key", (q) => q.eq("key", MIGRATION_KEY)).first(),
      ]);

    return {
      initialized: Boolean(migration),
      steps,
      options,
      devices,
      filterSets,
      faultGuides,
      leads,
      settings,
      texts: texts?.content || null,
    };
  },
});

export const getPublicSnapshot = query({
  args: {},
  handler: async (ctx) => {
    const [steps, options, devices, filterSets, faultGuides, settings, texts, migration] =
      await Promise.all([
        ctx.db.query("builderSteps").withIndex("by_order").collect(),
        ctx.db.query("builderOptions").withIndex("by_order").collect(),
        ctx.db.query("catalogDevices").withIndex("by_order").collect(),
        ctx.db.query("filterSets").withIndex("by_order").collect(),
        ctx.db.query("faultGuides").withIndex("by_order").collect(),
        ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", "global")).first(),
        ctx.db.query("siteTexts").withIndex("by_key", (q) => q.eq("key", "global")).first(),
        ctx.db.query("appState").withIndex("by_key", (q) => q.eq("key", MIGRATION_KEY)).first(),
      ]);

    return {
      initialized: Boolean(migration),
      steps: steps.filter((item) => item.isActive),
      options: options.filter((item) => item.isActive),
      devices: devices.filter((item) => item.isActive),
      filterSets: filterSets.filter((item) => item.isActive),
      faultGuides: faultGuides.filter((item) => item.isActive),
      leads: [],
      settings,
      texts: texts?.content || null,
    };
  },
});

export const replaceSnapshot = mutation({
  args: { snapshot: v.any(), force: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existingMigration = await ctx.db
      .query("appState")
      .withIndex("by_key", (q) => q.eq("key", MIGRATION_KEY))
      .first();
    if (existingMigration && !args.force) return { imported: false };

    const snapshot = args.snapshot && typeof args.snapshot === "object" ? args.snapshot : {};
    for (const tableName of [
      "builderSteps",
      "builderOptions",
      "catalogDevices",
      "filterSets",
      "faultGuides",
      "leads",
      "siteSettings",
      "siteTexts",
    ]) {
      await clearTable(ctx, tableName);
    }

    for (const item of snapshot.steps || []) await ctx.db.insert("builderSteps", cleanStep(item));
    for (const item of snapshot.options || []) await ctx.db.insert("builderOptions", cleanOption(item));
    for (const item of snapshot.devices || []) await ctx.db.insert("catalogDevices", cleanDevice(item));
    for (const item of snapshot.filterSets || []) await ctx.db.insert("filterSets", cleanFilterSet(item));
    for (const item of snapshot.faultGuides || []) await ctx.db.insert("faultGuides", cleanFault(item));
    for (const item of snapshot.leads || []) await ctx.db.insert("leads", cleanLead(item));
    await ctx.db.insert("siteSettings", cleanSettings(snapshot.settings));
    await ctx.db.insert("siteTexts", { key: "global", content: snapshot.texts || {} });

    if (existingMigration) {
      await ctx.db.patch(existingMigration._id, { value: "complete", updatedAt: Date.now() });
    } else {
      await ctx.db.insert("appState", {
        key: MIGRATION_KEY,
        value: "complete",
        updatedAt: Date.now(),
      });
    }
    return { imported: true };
  },
});

export const updateTexts = mutation({
  args: { content: v.any() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteTexts")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content });
      return existing._id;
    }
    return await ctx.db.insert("siteTexts", { key: "global", content: args.content });
  },
});
