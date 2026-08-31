import { getAuthUserId } from "@convex-dev/auth/server";

export const ADMIN_EMAIL = "admin@lotussuaritma.com";

export async function requireAdmin(ctx) {
  const userId = await getAuthUserId(ctx);
  const user = userId ? await ctx.db.get(userId) : null;
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Bu işlem için yönetici yetkisi gerekiyor.");
  }
  return user;
}
