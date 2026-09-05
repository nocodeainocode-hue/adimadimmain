import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, PhoneCall, User, X } from "lucide-react";
import { useLocalData } from "@/lib/convex";
import { buildWaLink } from "@/lib/whatsapp";

const numericPrice = (device, field, fallback = 0) => {
  const direct = Number(device?.[field] || 0);
  if (direct) return direct;
  if (field === "salePrice") return Number(String(device?.price || "").replace(/[^0-9]/g, "")) || fallback;
  return fallback;
};

export default function DeviceQuoteModal({ device, waNumber, city = "Tekirdağ", district = "", onClose, onSubmitted }) {
  const { addLocalLead, trackAnalyticsEvent } = useLocalData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!device) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [device, onClose]);

  if (!device) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\s/g, "").trim();
    if (!cleanName || cleanPhone.length < 10) {
      setError("Adınızı ve geçerli bir telefon numarası girin.");
      return;
    }

    const salePrice = numericPrice(device, "salePrice");
    const costPrice = numericPrice(device, "costPrice");
    const estimatedProfit = Math.max(0, salePrice - costPrice);
    const whatsappMessage =
      `Merhaba, ben ${cleanName}. ${district ? `${city} / ${district} bölgesindeyim. ` : ""}` +
      `${device.name} modeli için fiyat teklifi ve montaj randevusu almak istiyorum.`;
    const popup = window.open("", "_blank");
    if (popup) popup.opener = null;

    setLoading(true);
    setError("");
    try {
      await addLocalLead({
        fullName: cleanName,
        phone: cleanPhone,
        city,
        district,
        flowType: "buy",
        itemName: device.name,
        deviceId: device.deviceId || device.id,
        source: "ready_device_whatsapp",
        totalListPrice: salePrice,
        finalDiscountedPrice: salePrice,
        totalCostPrice: costPrice,
        estimatedProfit,
        profitMarginPercent: salePrice ? Math.round((estimatedProfit / salePrice) * 100) : 0,
      });
      await trackAnalyticsEvent({ eventType: "lead_submitted", flowType: "buy", itemId: device.deviceId || device.id });
      await trackAnalyticsEvent({ eventType: "whatsapp_started", flowType: "buy", itemId: device.deviceId || device.id });
      onSubmitted?.();
      setSubmitted(true);
      const whatsappUrl = buildWaLink(waNumber, whatsappMessage);
      if (popup) popup.location.href = whatsappUrl;
      else window.location.href = whatsappUrl;
    } catch {
      if (popup) popup.close();
      setError("Talep kaydedilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${device.name} teklif formu`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 rounded-full bg-muted p-2 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-5 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">Talebiniz kaydedildi</h2>
            <p className="mt-2 text-sm text-muted-foreground">Talebiniz yönetim paneline eklendi ve WhatsApp görüşmeniz açıldı.</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-muted px-5 py-2.5 text-sm font-bold text-foreground">Kapat</button>
          </div>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Hazır cihaz teklifi</span>
            <h2 className="mt-2 pr-8 font-display text-2xl font-bold text-foreground">{device.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Bilgilerinizi girin; talebinizi kaydedip seçtiğiniz cihazla WhatsApp görüşmesini başlatalım.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <label className="relative block">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Adınız Soyadınız" className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]" />
              </label>
              <label className="relative block">
                <PhoneCall className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05XX XXX XX XX" className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]" />
              </label>
              {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}
              <button disabled={loading || !name.trim() || !phone.trim()} type="submit" className="btn-whatsapp flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold ring-2 ring-emerald-700/20 shadow-[0_8px_24px_rgba(18,140,126,0.32)] disabled:opacity-80 disabled:brightness-75 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                {loading ? "Talep kaydediliyor..." : "Kaydet ve WhatsApp'ı Aç"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
