import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const confirmUpload = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata) throw new Error("Yüklenen görsel bulunamadı.");

    const contentType = metadata.contentType || "";
    if (!ALLOWED_IMAGE_TYPES.has(contentType) || metadata.size > MAX_IMAGE_SIZE) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Görsel türü veya dosya boyutu izin verilen sınırların dışında.");
    }

    await ctx.db.insert("mediaAssets", {
      storageId: args.storageId,
      fileName: args.fileName,
      contentType,
      size: metadata.size,
      createdAt: Date.now(),
    });

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Görsel bağlantısı oluşturulamadı.");
    return { storageId: args.storageId, url };
  },
});
