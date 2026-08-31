import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

// Müşteri Talebi Kaydet (Frontend Form & Builder Siparişleri)
export const submitLead = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    district: v.string(),
    flowType: v.string(),
    itemName: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

// Admin: Tüm Müşteri Taleplerini Listele
export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Admin: Talep Durumu Güncelle ve Not Ekle
export const updateLeadStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Admin: Finans & Kârlılık İstatistikleri
export const getFinancialStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const leads = await ctx.db.query("leads").collect();

    let totalRevenue = 0;
    let totalCost = 0;
    let totalEstimatedProfit = 0;
    let builderLeadsCount = 0;

    for (const lead of leads) {
      if (lead.status !== "cancelled") {
        totalRevenue += lead.finalDiscountedPrice || lead.totalListPrice || 0;
        totalCost += lead.totalCostPrice || 0;
        totalEstimatedProfit += lead.estimatedProfit || 0;
        if (lead.flowType === "builder") {
          builderLeadsCount++;
        }
      }
    }

    const overallMargin =
      totalRevenue > 0
        ? Math.round((totalEstimatedProfit / totalRevenue) * 100)
        : 0;

    return {
      totalLeads: leads.length,
      builderLeadsCount,
      totalRevenue,
      totalCost,
      totalEstimatedProfit,
      overallMargin,
    };
  },
});
