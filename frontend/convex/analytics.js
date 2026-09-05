import { mutation } from "./_generated/server";
import { v } from "convex/values";

const eventType = v.union(
  v.literal("wizard_started"),
  v.literal("step_viewed"),
  v.literal("results_viewed"),
  v.literal("device_viewed"),
  v.literal("lead_submitted"),
  v.literal("whatsapp_started")
);

export const track = mutation({
  args: {
    sessionId: v.string(),
    eventType,
    flowType: v.optional(v.string()),
    itemId: v.optional(v.string()),
    step: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId || args.sessionId.length > 100) {
      throw new Error("Geçersiz analiz oturumu.");
    }
    if ((args.flowType && args.flowType.length > 30) || (args.itemId && args.itemId.length > 100)) {
      throw new Error("Geçersiz analiz verisi.");
    }
    if (args.step !== undefined && (!Number.isInteger(args.step) || args.step < 0 || args.step > 20)) {
      throw new Error("Geçersiz analiz adımı.");
    }

    const sessionEvents = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_sessionId", (query) => query.eq("sessionId", args.sessionId))
      .collect();
    const duplicate = sessionEvents.find(
      (event) =>
        event.eventType === args.eventType &&
        event.flowType === args.flowType &&
        event.itemId === args.itemId &&
        event.step === args.step
    );
    if (duplicate) return duplicate._id;

    return await ctx.db.insert("analyticsEvents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
