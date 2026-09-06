import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

// Tüm aktif adımları ve seçeneklerini getir (Client-side Config)
export const getActiveBuilderConfig = query({
  args: {},
  handler: async (ctx) => {
    const steps = await ctx.db
      .query("builderSteps")
      .withIndex("by_order")
      .collect();

    const activeSteps = steps.filter((s) => s.isActive);
    const options = await ctx.db
      .query("builderOptions")
      .withIndex("by_order")
      .collect();

    const activeOptions = options.filter((o) => o.isActive);

    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();

    return {
      settings: settings || {
        basePrice: 500,
        baseCost: 200,
        discountRate: 0.2,
        discountBadgeText: "Lansmana özel konfigüratör fiyatı uygulanacaktır",
      },
      steps: activeSteps,
      options: activeOptions,
    };
  },
});

// Admin: Tüm adımları ve tüm seçenekleri getir (Aktif/Pasif ve Alış Fiyatları Dahil)
export const getAllBuilderAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const steps = await ctx.db
      .query("builderSteps")
      .withIndex("by_order")
      .collect();

    const options = await ctx.db
      .query("builderOptions")
      .withIndex("by_order")
      .collect();

    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();

    return { steps, options, settings };
  },
});

// Admin: Adım Ekle / Güncelle
export const upsertStep = mutation({
  args: {
    id: v.optional(v.id("builderSteps")),
    key: v.string(),
    stepNumber: v.number(),
    order: v.number(),
    badge: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    guideText: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    } else {
      return await ctx.db.insert("builderSteps", data);
    }
  },
});

// Admin: Adımların tamamını tek işlemde yeniden sırala
export const reorderSteps = mutation({
  args: { orderedIds: v.array(v.id("builderSteps")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const currentSteps = await ctx.db
      .query("builderSteps")
      .withIndex("by_order")
      .take(100);
    const uniqueIds = new Set(args.orderedIds);
    const currentIds = new Set(currentSteps.map((step) => step._id));

    if (
      uniqueIds.size !== args.orderedIds.length ||
      args.orderedIds.length !== currentSteps.length ||
      args.orderedIds.some((id) => !currentIds.has(id))
    ) {
      throw new Error("Adım listesi güncel değil. Sayfayı yenileyip tekrar deneyin.");
    }

    const stepsById = new Map(currentSteps.map((step) => [step._id, step]));
    for (let index = 0; index < args.orderedIds.length; index += 1) {
      const id = args.orderedIds[index];
      const step = stepsById.get(id);
      const position = index + 1;
      const badge = step.badge.replace(/^\s*\d+\.\s*Adım\b/i, `${position}. Adım`);
      await ctx.db.patch(id, { order: position, stepNumber: position, badge });
    }

    return null;
  },
});

// Admin: Adım Sil
export const deleteStep = mutation({
  args: { id: v.id("builderSteps") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const step = await ctx.db.get(args.id);
    if (step) {
      // Adıma bağlı parçaları da temizle
      const options = await ctx.db
        .query("builderOptions")
        .withIndex("by_stepKey", (q) => q.eq("stepKey", step.key))
        .collect();
      for (const opt of options) {
        await ctx.db.delete(opt._id);
      }
      await ctx.db.delete(args.id);

      const remainingSteps = await ctx.db
        .query("builderSteps")
        .withIndex("by_order")
        .take(100);
      for (let index = 0; index < remainingSteps.length; index += 1) {
        const remainingStep = remainingSteps[index];
        const position = index + 1;
        const badge = remainingStep.badge.replace(/^\s*\d+\.\s*Adım\b/i, `${position}. Adım`);
        await ctx.db.patch(remainingStep._id, { order: position, stepNumber: position, badge });
      }
    }
    return null;
  },
});

// Admin: Parça / Seçenek Ekle / Güncelle (Alış & Satış Fiyatları Dahil)
export const upsertOption = mutation({
  args: {
    id: v.optional(v.id("builderOptions")),
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    } else {
      return await ctx.db.insert("builderOptions", data);
    }
  },
});

// Admin: Parça Sil
export const deleteOption = mutation({
  args: { id: v.id("builderOptions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
