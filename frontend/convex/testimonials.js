import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

const MAX_PUBLIC = 60;

const fields = {
  name: v.string(),
  district: v.optional(v.string()),
  service: v.optional(v.string()),
  text: v.string(),
  rating: v.number(),
  photo: v.optional(v.string()),
  order: v.number(),
  isActive: v.boolean(),
};

// Herkese açık: yalnızca aktif yorumlar ve yalnızca gösterilecek alanlar.
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("testimonials").withIndex("by_order").take(200);
    return rows
      .filter((row) => row.isActive)
      .slice(0, MAX_PUBLIC)
      .map(({ _id, name, district, service, text, rating, photo }) => ({
        _id,
        name,
        district,
        service,
        text,
        rating,
        photo,
      }));
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("testimonials").withIndex("by_order").collect();
  },
});

export const upsert = mutation({
  args: { id: v.optional(v.id("testimonials")), ...fields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...input } = args;

    const name = input.name.trim();
    const text = input.text.trim();
    if (!name || name.length > 80) throw new Error("İsim 1-80 karakter olmalı.");
    if (!text || text.length > 700) throw new Error("Yorum 1-700 karakter olmalı.");
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error("Puan 1 ile 5 arasında olmalı.");
    }
    const photo = input.photo?.trim();
    if (photo && !/^https:\/\//i.test(photo)) throw new Error("Fotoğraf adresi https:// ile başlamalı.");

    const data = {
      name,
      text,
      rating: input.rating,
      order: input.order,
      isActive: input.isActive,
      ...(input.district?.trim() ? { district: input.district.trim().slice(0, 60) } : {}),
      ...(input.service?.trim() ? { service: input.service.trim().slice(0, 60) } : {}),
      ...(photo ? { photo } : {}),
    };

    if (id) {
      // replace: alanı boş bırakınca (ör. fotoğrafı kaldırınca) eski değer kalmasın.
      await ctx.db.replace(id, data);
      return id;
    }
    return await ctx.db.insert("testimonials", data);
  },
});

export const remove = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return null;
  },
});
