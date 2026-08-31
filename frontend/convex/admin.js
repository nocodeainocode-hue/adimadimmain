export const ADMIN_EMAIL = "admin@lotussuaritma.com";

export async function requireAdmin(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Bu işlem için yönetici yetkisi gerekiyor.");
  }
  return identity;
}
