export function buildWaLink(number, message) {
  const clean = String(number || "").replace(/[^0-9]/g, "");
  const base = `https://wa.me/${clean}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
