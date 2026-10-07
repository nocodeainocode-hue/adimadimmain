import { useEffect, useMemo, useRef, useState } from "react";
import OptionArt from "@/components/OptionArt";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ShoppingCart,
  Replace,
  Wrench,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageCircle,
  Check,
  Droplets,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Sparkles,
  PhoneCall,
  User,
  MapPin,
  Send,
  SlidersHorizontal,
  Layers,
  Cpu,
  Gauge,
  Container,
  Pipette,
  Percent,
  Hammer,
  ShieldCheck,
  X,
  Info,
  Eye,
  CheckCircle2,
  ImageOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeviceDetailModal } from "@/components/DeviceDetails";
import DeviceQuoteModal from "@/components/DeviceQuoteModal";
import { buildWaLink } from "@/lib/whatsapp";
import { useLocalData } from "@/lib/convex";
import {
  TEKIRDAG_DISTRICTS,
  BUILDER_CONFIG as DEFAULT_BUILDER_CONFIG,
  getRecommendedDevices,
} from "@/data/siteConfig";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;
const WIZARD_DRAFT_KEY = "lotus_wizard_draft";

const readWizardDraft = () => {
  try {
    const saved = localStorage.getItem(WIZARD_DRAFT_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const clearWizardDraft = () => {
  try {
    localStorage.removeItem(WIZARD_DRAFT_KEY);
  } catch {
    // Tarayıcı depolaması kapalıysa akış normal şekilde devam eder.
  }
};

const createCustomDeviceId = () => {
  const now = new Date();
  const datePart = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = String(Math.floor(1000 + Math.random() * 9000));
  return `LC-${datePart}-${randomPart}`;
};

const customerFacingBuilderOption = (option) => {
  if (!option) return option;
  if (option.stepKey === "tank" && option.optionId === "eko8" && /^Eko Tank/i.test(option.name || "")) {
    return {
      ...option,
      name: "Standart Basınç Tankı",
      desc: "8–10 L kullanım kapasitesi; gıda uyumlu antibakteriyel diyafram.",
    };
  }
  if (option.stepKey === "tank" && option.optionId === "plat12" && /Platinum Tank/i.test(option.name || "")) {
    return {
      ...option,
      name: "Premium Basınç Tankı",
      desc: "Daha dayanıklı gövde, yüksek kalite diyafram ve uzun servis ömrü. PAE veya eşdeğer premium komponent.",
    };
  }
  return option;
};

const getOptionTier = (option, stepOptions) => {
  if (!option || stepOptions.length < 3 || option.stepKey === "pompa") return null;
  const priced = [...stepOptions].sort(
    (a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0)
  );
  const index = priced.findIndex((item) => item.optionId === option.optionId);
  if (index === 0) return "Ekonomik";
  if (index === priced.length - 1) return "Premium";
  return "Önerilen";
};

const ease = [0.2, 0.8, 0.2, 1];
const variants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 16 : -16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -16 : 16 }),
};

const ENTRY_ICONS = {
  ShoppingCart,
  Replace,
  Wrench,
  Droplets,
  SlidersHorizontal,
  Hammer,
  ShieldCheck,
  Sparkles,
};

function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-muted/50 p-4 text-center text-muted-foreground ${className}`}>
        <ImageOff className="h-7 w-7" aria-hidden="true" />
        <span className="text-xs font-semibold">Ürün görseli yakında</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

/* ---------- Builder Component Detail Modal ---------- */
function BuilderDetailModal({ item, onClose, onSelect, isSelected }) {
  if (!item) return null;

  return (
    <div className="site-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`${item.name} bileşen detayları`}>
      <div className="site-modal relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border p-6 sm:p-8 text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Bileşen detaylarını kapat"
          className="absolute right-4 top-4 sm:right-6 sm:top-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Category & Badge */}
        <div className="flex items-center gap-2 mb-2 flex-wrap pr-8">
          <Badge className="bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] font-bold text-xs">
            {item.categoryTitle || "Bileşen Detayı"}
          </Badge>
          {item.badge && (
            <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 font-bold text-xs">
              {item.badge}
            </Badge>
          )}
        </div>

        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4 mb-5">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
            {item.name || item.title}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">Liste Fiyatı:</span>
            <span className="font-display font-extrabold text-2xl text-[hsl(var(--brand-plum))] font-mono">
              {(item.salePrice || item.price || 0) === 0 ? "Ücretsiz" : `${(item.salePrice || item.price || 0).toLocaleString("tr-TR")} ₺`}
            </span>
          </div>
        </div>

        {/* HD Image */}
        <div className="relative mb-6 h-72 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-inner sm:h-96">
          <ProductImage
            src={item.img}
            alt={item.name || item.title}
            className="h-full w-full object-contain object-center p-3 sm:p-5"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white drop-shadow">
            {item.desc}
          </div>
        </div>

        {/* Detailed Explanation Paragraph */}
        <div className="mb-6">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-[hsl(var(--brand-plum))]" />
            Detaylı Tanıtım & Kullanım Amacı
          </h4>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {item.longDesc || item.desc}
          </p>
        </div>

        {/* Highlights / Avantajlar */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mb-6 rounded-2xl bg-[hsl(var(--brand-champagne)/0.12)] border border-[hsl(var(--brand-champagne)/0.3)] p-4 sm:p-5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--brand-plum))] mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Neden Bu Seçeneği Tercih Etmelisiniz?
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {item.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specs Table */}
        {item.specs && item.specs.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Teknik Özellikler & Standartlar
            </h4>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border text-xs sm:text-sm">
              {item.specs.map((spec, idx) => (
                <div key={idx} className="px-4 py-2.5 bg-muted/30 flex items-center justify-between">
                  <span className="font-medium text-foreground">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-all"
          >
            Kapat
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect();
              onClose();
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm sm:text-base font-bold shadow-lg transition-all ${
              isSelected
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "btn-champagne"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="h-5 w-5 stroke-[2.5]" />
                Seçildi (Cihazınızda Mevcut)
              </>
            ) : (
              <>
                <Check className="h-5 w-5 stroke-[2.5]" />
                Bu Seçeneği Cihaza Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Builder Option Card with Image and Modal Trigger ---------- */
function BuilderOptionCard({
  selected,
  onClick,
  onOpenDetails,
  title,
  price,
  desc,
  img,
  badge,
  tier,
}) {
  return (
    <div
      className={`site-builder-option ${selected ? "is-selected" : ""}`}
    >
      <div className="builder-option-layout">
        {/* Left Thumbnail with Click to Zoom */}
        <button
          type="button"
          onClick={onOpenDetails}
          className="builder-option-image"
          aria-label={`${title} görselini ve detaylarını incele`}
        >
          <ProductImage
            src={img}
            alt={title}
            className="h-full w-full object-contain p-2"
          />
          <span className="builder-image-action"><Eye size={12} aria-hidden="true" /> İncele</span>
        </button>

        {/* Middle Info */}
        <div className="min-w-0">
          <button type="button" onClick={onClick} aria-pressed={selected} className="w-full text-left" aria-label={`${title} seç${selected ? " — seçildi" : ""}`}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-base sm:text-lg text-foreground group-hover:text-foreground">
              {title}
            </span>
            {badge && (
              <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[11px] font-bold">
                {badge}
              </Badge>
            )}
            {tier && (
              <Badge className={`border text-[11px] font-bold ${
                tier === "Önerilen"
                  ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                  : tier === "Premium"
                    ? "bg-[hsl(var(--brand-plum)/0.1)] text-[hsl(var(--brand-plum))] border-[hsl(var(--brand-plum)/0.25)]"
                    : "bg-slate-500/10 text-slate-600 border-slate-500/20"
              }`}>
                {tier}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {desc}
          </p>
          <span className="builder-option-select">
            <span><span className="block text-[10px] text-muted-foreground">Fiyat farkı</span><strong className="font-display text-xl font-semibold text-primary">{price === 0 ? "Dahil" : `+${price.toLocaleString("tr-TR")} ₺`}</strong></span>
            <span className="option-check"><Check size={13} aria-hidden="true" />{selected ? "Seçildi" : "Seç"}</span>
          </span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetails) onOpenDetails();
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--brand-plum))] hover:underline"
          >
            <Info className="h-3.5 w-3.5" />
          <span>Görsel ve özellikleri incele</span>
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- Callback Form with Convex Support ---------- */
function CallbackForm({ flowType, itemName, city, district, discountOffer, productionOrder = false, leadPayload, whatsappUrl, onSubmitted }) {
  const { addLocalLead, trackAnalyticsEvent } = useLocalData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10 || (whatsappUrl && !cleanName)) return;

    const resolvedWhatsappUrl = whatsappUrl?.replace(
      encodeURIComponent("{MÜŞTERİ_ADI}"),
      encodeURIComponent(cleanName)
    );
    const whatsappWindow = resolvedWhatsappUrl ? window.open("", "_blank") : null;
    if (whatsappWindow) whatsappWindow.opener = null;

    setLoading(true);
    setSubmitError("");

    const fullLead = {
      fullName: cleanName || "İsimsiz Müşteri",
      phone: cleanPhone,
      city: city || "Tekirdağ",
      district: district || "",
      flowType: flowType,
      itemName: itemName,
      ...(leadPayload || {}),
    };

    try {
      await addLocalLead(fullLead);
      await trackAnalyticsEvent({ eventType: "lead_submitted", flowType, itemId: leadPayload?.deviceId });
      if (resolvedWhatsappUrl) {
        await trackAnalyticsEvent({ eventType: "whatsapp_started", flowType, itemId: leadPayload?.deviceId });
      }
      onSubmitted?.();
      setSubmitted(true);
      if (resolvedWhatsappUrl) {
        if (whatsappWindow) {
          whatsappWindow.location.href = resolvedWhatsappUrl;
        } else {
          window.location.href = resolvedWhatsappUrl;
        }
      }
    } catch {
      if (whatsappWindow) whatsappWindow.close();
      setSubmitError("Talebiniz gönderilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center shadow-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white mb-2 shadow-md">
          <Check className="h-6 w-6 stroke-[3]" />
        </div>
        <h4 className="font-display font-bold text-lg text-foreground">Talebiniz bize ulaştı</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
          {productionOrder ? (
            <>Üretim talebiniz kaydedildi. Uzmanımız konfigürasyonu sizinle teyit ettikten sonra üretime başlıyoruz.</>
          ) : whatsappUrl ? (
            <>Siparişiniz kaydedildi, WhatsApp görüşmeniz açıldı. Mesajı göndermeniz yeterli; gerisini biz planlarız.</>
          ) : (
            <>
              {discountOffer ? "%20 indirim hakkınız numaranıza tanımlandı. " : ""}
              Uzmanımız 10–15 dakika içinde <strong className="text-foreground font-semibold">{phone}</strong> numaralı telefonunuzu arayıp montaj ve fiyat detaylarını anlatacak.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="site-callback">
      <div className="flex items-center gap-3 mb-2">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${
          discountOffer || productionOrder
            ? "bg-emerald-600 text-white"
            : "bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))]"
        }`}>
          {discountOffer || productionOrder ? <Sparkles className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
        </span>
        <div>
          <h4 className="font-display font-bold text-base sm:text-lg text-foreground">
            {productionOrder
              ? "Üretim talebinizi gönderin"
              : whatsappUrl
              ? "Siparişinizi WhatsApp'tan tamamlayın"
              : discountOffer
                ? "%20 indirimli teklifinizi alın"
                : "WhatsApp kullanmıyor musunuz?"}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {productionOrder
              ? "Seçiminiz kaydedilir. Uzmanımız sizinle teyit ettikten sonra üretime başlarız."
              : whatsappUrl
              ? "Adınızı ve telefonunuzu yazın. Siparişiniz kaydedilir, seçiminizle birlikte WhatsApp açılır."
              : discountOffer
                ? "Numaranızı bırakın, uzmanımız %20 indirimli teklifinizle sizi 10–15 dakika içinde arasın."
                : "Numaranızı bırakın, uzmanımız sizi arasın."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`mt-4 grid gap-3 ${whatsappUrl ? "sm:grid-cols-[1fr_1fr_1.35fr]" : "sm:grid-cols-3"}`}
      >
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            required={Boolean(whatsappUrl)}
            placeholder="Adınız Soyadınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-3.5 h-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
          />
        </div>
        <div className="relative">
          <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-3.5 h-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !phone || (whatsappUrl && !name.trim())}
          className={`${whatsappUrl ? "btn-whatsapp ring-2 ring-emerald-700/20 shadow-[0_8px_24px_rgba(18,140,126,0.32)]" : "btn-champagne"} rounded-xl h-12 px-5 text-sm font-extrabold flex items-center justify-center gap-2 disabled:opacity-80 disabled:brightness-75 disabled:cursor-not-allowed transition-all`}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : productionOrder ? <Layers className="h-4 w-4" /> : whatsappUrl ? <MessageCircle className="h-4 w-4" /> : discountOffer ? <Sparkles className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {productionOrder ? "Cihazımı üretime gönder" : whatsappUrl ? "Siparişi kaydet, WhatsApp'ı aç" : discountOffer ? "%20 indirimle beni arayın" : "Beni arayın"}
        </button>
      </form>
      {submitError && <p role="alert" className="mt-3 text-xs font-semibold text-rose-600">{submitError}</p>}
    </div>
  );
}

/* ---------- Small reusable option card ---------- */
function OptionCard({ selected, onClick, title, hint, icon: Icon, art, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-pressed={selected}
      className={`site-option-card ${selected ? "is-selected" : ""}`}
    >
      {art ? <OptionArt name={art} /> : Icon && (
        <Icon className="option-symbol h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      )}
      <span className="flex-1">
        <span className="block font-bold text-base text-foreground group-hover:text-foreground">{title}</span>
        {hint && <span className="block text-xs sm:text-sm text-muted-foreground mt-0.5">{hint}</span>}
      </span>
      <span className="option-check">
        <Check className="h-4 w-4 stroke-[2.5]" />
      </span>
    </button>
  );
}

/* ---------- Entry choice big card ---------- */
function EntryCard({ icon: Icon, title, desc, buttonText, onClick, testId, number, category }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`site-entry-card entry-${category} group`}
    >
      <span className="entry-topline"><span>0{number}</span><Icon size={30} strokeWidth={1.3} aria-hidden="true" /></span>
      <span className="entry-title">{title}</span>
      <span className="entry-description">{desc}</span>
      <span className="entry-action">
          {buttonText} <span className="entry-arrow"><ArrowRight size={19} aria-hidden="true" /></span>
        </span>
    </button>
  );
}

export default function Wizard({ config, onFlowChange }) {
  const { localData, trackAnalyticsEvent } = useLocalData();
  const prefersReducedMotion = useReducedMotion();
  const initialDraft = useMemo(readWizardDraft, []);
  const siteSettings = localData?.settings || {};
  const texts = localData.texts;
  const waNumber = siteSettings.whatsappNumber || config?.whatsapp?.number || "905550000000";

  // Dynamic Builder Steps from Convex / LocalData
  const activeBuilderSteps = useMemo(() => {
    return (localData?.steps || []).filter((s) => s.isActive);
  }, [localData]);

  const allBuilderOptions = useMemo(() => {
    return (localData?.options || []).filter((o) => o.isActive);
  }, [localData]);

  const [flow, setFlow] = useState(initialDraft.flow || null); // 'buy' | 'filter' | 'fault' | 'builder'
  useEffect(() => { onFlowChange?.(Boolean(flow)); }, [flow, onFlowChange]);
  const [step, setStep] = useState(Number(initialDraft.step || 0));
  const [dir, setDir] = useState(1);
  const [draftRestored, setDraftRestored] = useState(Boolean(initialDraft.flow));

  // General Wizard selections
  const [city, setCity] = useState(initialDraft.city || "Tekirdağ");
  const [district, setDistrict] = useState(initialDraft.district || "Süleymanpaşa");
  const [consumption, setConsumption] = useState(initialDraft.consumption || null);
  const [budget, setBudget] = useState(initialDraft.budget || null);
  const [lastChanged, setLastChanged] = useState(initialDraft.lastChanged || null);
  const [faultType, setFaultType] = useState(initialDraft.faultType || null);
  const [customDeviceId, setCustomDeviceId] = useState(initialDraft.customDeviceId || createCustomDeviceId);

  // Dynamic Custom Device Builder selections map: { [stepKey]: optionId }
  const [builderSelections, setBuilderSelections] = useState(initialDraft.builderSelections || {});
  const [modalItem, setModalItem] = useState(null);
  const trackedSteps = useRef(new Set());
  const restoredStartTracked = useRef(false);

  // device results
  const [devices, setDevices] = useState([]);
  const [devLoading, setDevLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [quoteDevice, setQuoteDevice] = useState(null);

  useEffect(() => {
    if (!flow) return;
    try {
      localStorage.setItem(
        WIZARD_DRAFT_KEY,
        JSON.stringify({ flow, step, city, district, consumption, budget, lastChanged, faultType, builderSelections, customDeviceId })
      );
    } catch {
      // Tarayıcı depolaması kapalıysa form yine kullanılabilir.
    }
  }, [flow, step, city, district, consumption, budget, lastChanged, faultType, builderSelections, customDeviceId]);

  useEffect(() => {
    if (!flow) return;
    if (draftRestored && !restoredStartTracked.current) {
      restoredStartTracked.current = true;
      trackAnalyticsEvent({ eventType: "wizard_started", flowType: flow, step: 0 });
    }
    const key = `${flow}:${step}`;
    if (trackedSteps.current.has(key)) return;
    trackedSteps.current.add(key);
    trackAnalyticsEvent({ eventType: "step_viewed", flowType: flow, step });
  }, [draftRestored, flow, step, trackAnalyticsEvent]);

  const stepsByFlow = {
    buy: 4,
    filter: 2,
    fault: 2,
    builder: activeBuilderSteps.length + 1, // All steps + 1 summary step
  };

  const totalSteps = flow ? stepsByFlow[flow] || 1 : 0;
  const progress = flow ? ((step + 1) / totalSteps) * 100 : 0;
  const trackedResults = useRef(new Set());

  useEffect(() => {
    if (!flow || step !== totalSteps - 1) return;
    if (trackedResults.current.has(flow)) return;
    trackedResults.current.add(flow);
    trackAnalyticsEvent({ eventType: "results_viewed", flowType: flow, step });
  }, [flow, step, totalSteps, trackAnalyticsEvent]);

  const stepLabels = {
    buy: ["Tekirdağ / İlçe", "Su tüketimi", "Bütçe", "Önerilen cihazlar"],
    filter: ["Son değişim", "Önerilen filtre seti"],
    fault: ["Arıza tipi", "Yönlendirme"],
    builder: [
      ...activeBuilderSteps.map((s) => s.title),
      "Üretim Özeti",
    ],
  };

  const locationText = district ? `Tekirdağ / ${district}` : "Tekirdağ";

  // Builder Selected Items List & Financial Calculations
  const selectedItemsList = useMemo(() => {
    return activeBuilderSteps
      .map((stepItem) => {
        const chosenOptId = builderSelections[stepItem.key];
        if (!chosenOptId) return null;
        const opt = allBuilderOptions.find(
          (o) => o.stepKey === stepItem.key && o.optionId === chosenOptId
        );
        const displayOption = customerFacingBuilderOption(opt);
        return displayOption
          ? {
              ...displayOption,
              stepTitle: stepItem.title,
              stepBadge: stepItem.badge,
            }
          : null;
      })
      .filter(Boolean);
  }, [activeBuilderSteps, builderSelections, allBuilderOptions]);

  const basePrice = siteSettings.basePrice || 500;
  const baseCost = siteSettings.baseCost || 180;
  const discountRate = siteSettings.discountRate || 0.2;
  const discountPercent = Math.round(discountRate * 100);
  const configuredCampaignText = siteSettings.discountBadgeText || "";
  const campaignBadgeText = /%20|formu doldur/i.test(configuredCampaignText)
    ? "Lansmana özel konfigüratör fiyatı uygulanacaktır"
    : configuredCampaignText || "Lansmana özel konfigüratör fiyatı uygulanacaktır";

  const builderListPrice =
    basePrice +
    selectedItemsList.reduce((sum, item) => sum + (item.salePrice || item.price || 0), 0);

  const builderTotalCost =
    baseCost +
    selectedItemsList.reduce((sum, item) => sum + (item.costPrice || 0), 0);

  const builderDiscount = Math.round(builderListPrice * discountRate);
  const builderFinalPrice = builderListPrice - builderDiscount;
  const builderEstimatedProfit = builderFinalPrice - builderTotalCost;
  const builderMarginPercent =
    builderFinalPrice > 0
      ? Math.round((builderEstimatedProfit / builderFinalPrice) * 100)
      : 0;

  const go = (nextStep, direction = 1) => {
    setDir(direction);
    setStep(nextStep);
    scrollToForm();
  };

  // Konfigüratörde seçim yapılınca kısa bir süre sonra sonraki adıma geç. "Seçildi" göstergesi görülsün diye küçük gecikme var.
  const autoAdvanceTimer = useRef(null);
  const cancelAutoAdvance = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = null;
  };
  const selectBuilderOption = (stepKey, optionId, fromStep) => {
    setBuilderSelections((prev) => ({ ...prev, [stepKey]: optionId }));
    cancelAutoAdvance();
    autoAdvanceTimer.current = setTimeout(() => {
      autoAdvanceTimer.current = null;
      go(fromStep + 1, 1);
    }, prefersReducedMotion ? 150 : 450);
  };
  // Adım ya da akış değişirse (Geri, Başa Dön vb.) bekleyen otomatik geçişi iptal et.
  useEffect(() => cancelAutoAdvance, [step, flow]);

  const scrollToForm = () => document.getElementById("yardim-formu")?.scrollIntoView({ behavior: prefersReducedMotion ? "instant" : "smooth", block: "start" });

  const reset = () => {
    setDir(-1);
    setFlow(null);
    setStep(0);
    setCity("Tekirdağ");
    setDistrict("Süleymanpaşa");
    setConsumption(null);
    setBudget(null);
    setLastChanged(null);
    setFaultType(null);
    setBuilderSelections({});
    setDevices([]);
    setSelectedDevice(null);
    setQuoteDevice(null);
    setCustomDeviceId(createCustomDeviceId());
    setDraftRestored(false);
    clearWizardDraft();
    scrollToForm();
  };

  const startFlow = (f) => {
    setDir(1);
    setFlow(f);
    setStep(0);
    setDraftRestored(false);
    trackAnalyticsEvent({ eventType: "wizard_started", flowType: f, step: 0 });
    scrollToForm();
  };

  const back = () => {
    if (step === 0) {
      reset();
    } else {
      go(step - 1, -1);
    }
  };

  // Dynamic Catalog Devices & Filter Sets from Convex / LocalData
  const activeCatalogDevices = useMemo(() => {
    return (localData?.devices || config?.devices || []).filter((d) => d.isActive !== false);
  }, [localData, config]);

  const activeFilterSets = useMemo(() => {
    return localData?.filterSets || Object.values(config?.filterSets || {});
  }, [localData, config]);

  const fetchDevices = (b, c) => {
    setDevLoading(true);
    let recs = activeCatalogDevices.filter((d) => {
      const matchBudget = !b || (d.budgetTags && d.budgetTags.includes(b));
      const matchConsumption = !c || (d.consumptionTags && d.consumptionTags.includes(c));
      return matchBudget && matchConsumption;
    });
    if (recs.length === 0 && b) {
      recs = activeCatalogDevices.filter((d) => d.budgetTags && d.budgetTags.includes(b));
    }
    setDevices(recs && recs.length > 0 ? recs : activeCatalogDevices);
    setDevLoading(false);
  };

  const goToBuyResults = () => {
    fetchDevices(budget, consumption);
    go(3, 1);
  };

  useEffect(() => {
    if (flow !== "buy" || step !== 3 || devices.length > 0 || activeCatalogDevices.length === 0) return;
    let restoredDevices = activeCatalogDevices.filter((device) => {
      const matchesBudget = !budget || device.budgetTags?.includes(budget);
      const matchesConsumption = !consumption || device.consumptionTags?.includes(consumption);
      return matchesBudget && matchesConsumption;
    });
    if (restoredDevices.length === 0 && budget) {
      restoredDevices = activeCatalogDevices.filter((device) => device.budgetTags?.includes(budget));
    }
    setDevices(restoredDevices.length ? restoredDevices : activeCatalogDevices);
  }, [flow, step, devices.length, activeCatalogDevices, budget, consumption]);

  const openDeviceDetails = (device) => {
    setSelectedDevice(device);
    trackAnalyticsEvent({ eventType: "device_viewed", flowType: "buy", itemId: device.deviceId || device.id });
  };

  const openDeviceQuote = (device) => {
    setQuoteDevice(device);
    trackAnalyticsEvent({ eventType: "device_viewed", flowType: "buy", itemId: device.deviceId || device.id });
  };

  // Filter set recommendation logic
  const recommendedSet = useMemo(() => {
    if (!lastChanged) return null;
    const matchKey = lastChanged === "6ay" ? "6ay" : "1yil";
    const found = activeFilterSets.find(
      (fs) => fs.matchKey === matchKey || fs.id === (matchKey === "6ay" ? "set3" : "set5") || fs.setId === (matchKey === "6ay" ? "set3" : "set5")
    );
    return found || activeFilterSets[0] || null;
  }, [lastChanged, activeFilterSets]);

  // Dynamic Fault Guides from Convex / LocalData
  const activeFaultGuides = useMemo(() => {
    return (localData?.faultGuides || config?.faultGuides || []).filter(
      (f) => f.isActive !== false
    );
  }, [localData, config]);

  const selectedFault = useMemo(() => {
    return (
      activeFaultGuides.find(
        (f) => f._id === faultType || f.faultId === faultType || f.id === faultType
      ) || null
    );
  }, [faultType, activeFaultGuides]);

  const stepKey = `${flow || "entry"}-${step}`;

  // Current Dynamic Step Object
  const currentStep =
    flow === "builder" && step < activeBuilderSteps.length
      ? activeBuilderSteps[step]
      : null;

  const currentStepOptions = useMemo(() => {
    if (!currentStep) return [];
    return allBuilderOptions.filter((o) => o.stepKey === currentStep.key);
  }, [currentStep, allBuilderOptions]);

  return (
    <div className={`site-wizard ${flow ? "is-active" : ""}`}>
      <div className="wizard-section-heading">
        <div><p className="site-eyebrow">{texts.entry.badge.replace(/^✨\s*/, "")}</p><h2>{texts.entry.title}</h2></div>
        <p className="wizard-intro">{texts.entry.subtitle}</p>
      </div>

      <div className="site-wizard-panel">
        <div className="wizard-panel-inner">
          {/* Stepper header (only within a flow) */}
              {flow && (
                <div className="wizard-stepper mb-8">
                  {draftRestored && (
                    <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800">
                      Önceki seçimleriniz geri yüklendi; kaldığınız yerden devam edebilirsiniz.
                    </div>
                  )}
              <div className="wizard-stepper-controls">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition-all"
                  data-testid="wizard-back-button"
                >
                  <ArrowLeft className="h-4 w-4" /> {texts.navigation.backButton}
                </button>

                <div aria-live="polite" className="wizard-step-label">
                  <span>ADIM {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}</span><strong>{stepLabels[flow]?.[step] || "Adım"}</strong>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition-all"
                  data-testid="wizard-restart-button"
                >
                  <RotateCcw className="h-4 w-4" /> {texts.navigation.restartButton}
                </button>
              </div>
              <div className="mt-4 h-1 w-full bg-muted/80 overflow-hidden" data-testid="wizard-progress">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={stepKey}
              custom={dir}
              variants={variants}
              initial={prefersReducedMotion ? false : "enter"}
              animate="center"
              exit="exit"
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease }}
            >
              {/* ============ ENTRY ============ */}
              {!flow && (
                <div className="wizard-entry-grid" data-testid="wizard-entry">
                  <EntryCard
                    number={1}
                    category="buy"
                    icon={ENTRY_ICONS[texts.entry.cards.buy.icon] || ShoppingCart}
                    title={texts.entry.cards.buy.title}
                    desc={texts.entry.cards.buy.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("buy")}
                    testId="wizard-entry-buy-device"
                  />
                  <EntryCard
                    number={2}
                    category="filter"
                    icon={ENTRY_ICONS[texts.entry.cards.filter.icon] || Replace}
                    title={texts.entry.cards.filter.title}
                    desc={texts.entry.cards.filter.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("filter")}
                    testId="wizard-entry-change-filter"
                  />
                  <EntryCard
                    number={3}
                    category="fault"
                    icon={ENTRY_ICONS[texts.entry.cards.fault.icon] || Wrench}
                    title={texts.entry.cards.fault.title}
                    desc={texts.entry.cards.fault.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("fault")}
                    testId="wizard-entry-malfunction"
                  />

                  {/* 4. Özel Konfigüratör Seçeneği */}
                  <div className="builder-entry-wrapper">
                    <button
                      type="button"
                      onClick={() => startFlow("builder")}
                      className="site-builder-entry"
                      data-testid="wizard-entry-builder"
                    >
                      <span className="builder-wordmark" aria-hidden="true"><SlidersHorizontal size={26} strokeWidth={1.4} />LOTUS<br /><strong>CUSTOM</strong></span>
                      <span className="builder-entry-copy"><strong>{texts.entry.configurator.title}</strong><span>{texts.entry.configurator.desc}</span><small>{campaignBadgeText}</small></span>
                      <span className="builder-entry-action">{texts.entry.configurator.buttonText} <ArrowRight size={18} aria-hidden="true" /></span>
                    </button>
                  </div>
                </div>
              )}

              {/* ============ BUY FLOW ============ */}
              {flow === "buy" && step === 0 && (
                <div data-testid="wizard-location-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand-champagne)/0.4)] bg-[hsl(var(--brand-champagne)/0.12)] px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <MapPin className="h-3.5 w-3.5 text-[hsl(var(--brand-champagne))]" />
                    <span>{texts.buy.district.badge}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">{texts.buy.district.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    {texts.buy.district.subtitle}
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                      {texts.buy.district.label}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {TEKIRDAG_DISTRICTS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDistrict(d)}
                          className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all shadow-sm text-center flex items-center justify-center gap-1.5 ${
                            district === d
                              ? "bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] ring-2 ring-[hsl(var(--brand-champagne)/0.6)] font-bold scale-[1.02]"
                              : "bg-card border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          <MapPin className={`h-3.5 w-3.5 ${district === d ? "text-[hsl(var(--brand-champagne))]" : "text-muted-foreground"}`} />
                          <span>{d}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!district}
                      onClick={() => go(1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-location-next"
                    >
                      {texts.buy.district.buttonText} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "buy" && step === 1 && (
                <div data-testid="wizard-consumption-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">{texts.buy.consumption.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    {texts.buy.consumption.subtitle}
                  </p>

                  <div className="space-y-3">
                    <OptionCard
                      selected={consumption === "az"}
                      art="people-low"
                      onClick={() => setConsumption("az")}
                      title={texts.buy.consumption.options.low.title}
                      hint={texts.buy.consumption.options.low.hint}
                      icon={Droplets}
                      testId="wizard-consumption-low"
                    />
                    <OptionCard
                      selected={consumption === "orta"}
                      art="people-mid"
                      onClick={() => setConsumption("orta")}
                      title={texts.buy.consumption.options.medium.title}
                      hint={texts.buy.consumption.options.medium.hint}
                      icon={Droplets}
                      testId="wizard-consumption-medium"
                    />
                    <OptionCard
                      selected={consumption === "cok"}
                      art="people-high"
                      onClick={() => setConsumption("cok")}
                      title={texts.buy.consumption.options.high.title}
                      hint={texts.buy.consumption.options.high.hint}
                      icon={Droplets}
                      testId="wizard-consumption-high"
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!consumption}
                      onClick={() => go(2, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-consumption-next"
                    >
                      {texts.buy.consumption.buttonText} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "buy" && step === 2 && (
                <div data-testid="wizard-budget-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">{texts.buy.budget.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    {texts.buy.budget.subtitle}
                  </p>

                  <div className="space-y-3">
                    <OptionCard
                      selected={budget === "eko"}
                      onClick={() => setBudget("eko")}
                      title={texts.buy.budget.options.economy.title}
                      hint={texts.buy.budget.options.economy.hint}
                      testId="wizard-budget-eko"
                    />
                    <OptionCard
                      selected={budget === "orta"}
                      onClick={() => setBudget("orta")}
                      title={texts.buy.budget.options.medium.title}
                      hint={texts.buy.budget.options.medium.hint}
                      testId="wizard-budget-orta"
                    />
                    <OptionCard
                      selected={budget === "premium"}
                      onClick={() => setBudget("premium")}
                      title={texts.buy.budget.options.premium.title}
                      hint={texts.buy.budget.options.premium.hint}
                      testId="wizard-budget-premium"
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!budget}
                      onClick={goToBuyResults}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-budget-next"
                    >
                      {devLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {texts.buy.budget.loadingText}
                        </>
                      ) : (
                        <>
                          {texts.buy.budget.buttonText} <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {flow === "buy" && step === 3 && (
                <div data-testid="wizard-buy-results" className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-champagne)/0.15)] text-[hsl(var(--brand-plum))] px-3.5 py-1 text-xs font-bold mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{locationText} İçin Özel Eşleşme</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">{texts.buy.results.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">{texts.buy.results.subtitle}</p>
                  </div>

                  {devices.length === 0 ? (
                    <div className="text-center py-10 bg-card rounded-2xl border border-border p-6">
                      <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">Bu seçimlere uyan cihaz bulunamadı.</p>
                      <button onClick={reset} className="btn-champagne mt-4 inline-flex items-center gap-2 rounded-xl h-10 px-4 text-xs font-bold">
                        <RotateCcw className="h-3.5 w-3.5" /> Seçimleri Değiştir
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {devices.map((d) => (
                        <div
                          key={d.id}
                          className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="device-result-media relative w-full overflow-hidden">
                              <ProductImage src={d.img} alt={d.name} className="h-full w-full object-contain p-5" />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] font-bold shadow-md">
                                  {d.warranty}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-5 sm:p-6">
                              <h4 className="font-display font-bold text-xl text-foreground">{d.name}</h4>
                              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                              <div className="mt-4 space-y-2">
                                {d.features?.map((f, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-5 sm:p-6 pt-0 border-t border-border/60 mt-4">
                            <div className="flex items-baseline justify-between pt-3">
                              <div>
                                <span className="block text-[11px] font-medium text-muted-foreground">Fiyat</span>
                                <span className="font-display font-bold text-2xl text-[hsl(var(--brand-plum))]">{d.price}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openDeviceDetails(d)}
                              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition-all hover:bg-muted"
                            >
                              <Eye className="h-4 w-4" /> Fotoğraf, Video ve Detayları İncele
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeviceQuote(d)}
                              className="btn-whatsapp mt-2 inline-flex items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold transition-all w-full shadow-sm"
                            >
                              <MessageCircle className="h-4 w-4" /> WhatsApp ile Bilgi Al
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kendi Cihazını Topla Banner */}
                  <div className="mt-8 rounded-2xl border border-border bg-secondary p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] px-3 py-1 text-xs font-bold mb-2">
                      <Hammer className="h-3.5 w-3.5" />
                      <span>Lotus Custom</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-foreground">Aradığınızı bulamadınız mı?</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                      Kasa, filtre, pompa, tank ve musluğu kendiniz seçin. %20 lansman indirimiyle özel fiyatınızı anında görün.
                    </p>
                    <button
                      type="button"
                      onClick={() => startFlow("builder")}
                      className="btn-champagne mt-4 inline-flex items-center gap-2 rounded-xl h-11 px-6 text-sm font-bold shadow-md transition-all"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Cihazımı kendim tasarlayayım
                    </button>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold border border-border bg-card hover:bg-muted transition-all"
                    >
                      <RotateCcw className="h-4 w-4" /> Farklı Seçim Yap
                    </button>
                  </div>
                </div>
              )}

              {/* ============ FILTER & FAULT FLOWS ============ */}
              {flow === "filter" && step === 0 && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">{texts.filter.question.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    {texts.filter.question.subtitle}
                  </p>
                  <div className="space-y-3">
                    <OptionCard selected={lastChanged === "6ay"} art="filter-fresh" onClick={() => setLastChanged("6ay")} title={texts.filter.question.options.sixMonths.title} hint={texts.filter.question.options.sixMonths.hint} />
                    <OptionCard selected={lastChanged === "1yil"} art="filter-old" onClick={() => setLastChanged("1yil")} title={texts.filter.question.options.oneYear.title} hint={texts.filter.question.options.oneYear.hint} />
                    <OptionCard selected={lastChanged === "bilmiyorum"} art="filter-unknown" onClick={() => setLastChanged("bilmiyorum")} title={texts.filter.question.options.unknown.title} hint={texts.filter.question.options.unknown.hint} />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="button" disabled={!lastChanged} onClick={() => go(1, 1)} className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 font-bold disabled:opacity-40">
                      {texts.filter.question.buttonText} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "filter" && step === 1 && recommendedSet && (
                <div className="max-w-2xl mx-auto text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 px-3.5 py-1 text-xs font-bold mb-3 shadow-xs">
                    Size önerilen orijinal filtre paketi
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
                    {recommendedSet.name}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
                    {recommendedSet.desc}
                  </p>

                  <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-lg text-left mb-6">
                    {/* HD Filtre Seti Görseli */}
                    {recommendedSet.img && (
                      <div className="relative h-56 sm:h-64 w-full bg-neutral-900 overflow-hidden">
                        <img
                          src={recommendedSet.img}
                          alt={recommendedSet.name}
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-3.5 left-4 right-4 text-white flex items-center justify-between">
                          <span className="text-xs font-semibold drop-shadow">
                            {recommendedSet.subtitle}
                          </span>
                          <span className="inline-flex items-center rounded-lg bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-1 border-0 shadow">
                            Orijinal NSF Sertifikalı
                          </span>
                        </div>
                      </div>
                    )}


                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-4 mb-5">
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Tavsiye Edilen Değişim Paketi
                          </span>
                          <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
                            Tekirdağ / {district} için Yerinde Değişim Dahil
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-display font-black text-3xl text-[hsl(var(--brand-plum))] font-mono">
                            {recommendedSet.price}
                          </span>
                        </div>
                      </div>

                      {/* Paket İçeriği */}
                      <div className="mb-5">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Paket İçeriği & Değiştirilecek Parçalar
                        </h4>
                        <div className="space-y-2">
                          {recommendedSet.includes?.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60">
                              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Avantajlar */}
                      {recommendedSet.benefits && (
                        <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            Bu Değişim ile Neler Kazanacaksınız?
                          </h4>
                          <div className="space-y-1.5">
                            {recommendedSet.benefits.map((b, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-emerald-950 dark:text-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <a
                        href={buildWaLink(
                          waNumber,
                          `Merhaba, Tekirdağ / ${district} bölgesindeyim. ${recommendedSet.name} için filtre değişim randevusu ve yerinde montaj talebinde bulunmak istiyorum.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAnalyticsEvent({ eventType: "whatsapp_started", flowType: "filter", itemId: recommendedSet.setId || recommendedSet.id })}
                        className="btn-whatsapp inline-flex items-center justify-center gap-2 rounded-xl h-14 px-6 text-base font-bold w-full shadow-lg transition-all"
                      >
                        <MessageCircle className="h-5 w-5" /> WhatsApp ile Filtre Değişim Randevusu Al
                      </a>
                    </div>
                  </div>

                  <CallbackForm
                    flowType="filter"
                    itemName={recommendedSet.name}
                    city={city}
                    district={district}
                    onSubmitted={clearWizardDraft}
                  />
                </div>
              )}

              {flow === "fault" && step === 0 && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">{texts.fault.question.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">{texts.fault.question.subtitle}</p>
                  <div className="space-y-3">
                    {activeFaultGuides.map((f) => (
                      <OptionCard
                        key={f._id || f.faultId || f.id}
                        selected={faultType === (f.faultId || f.id || f._id)}
                        onClick={() => setFaultType(f.faultId || f.id || f._id)}
                        title={f.title || f.label}
                        icon={Wrench}
                        art={`fault-${f.faultId || f.id}`}
                        testId={`wizard-fault-${f.faultId || f.id || f._id}`}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!faultType}
                      onClick={() => go(1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 font-bold disabled:opacity-40"
                    >
                      {texts.fault.question.buttonText} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "fault" && step === 1 && selectedFault && (
                <div className="max-w-2xl mx-auto text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-3 shadow-sm border border-amber-400/30">
                    <Wrench className="h-7 w-7" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-2">
                    <span>İlk kontroller</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                    {selectedFault.title || selectedFault.label}
                  </h3>

                  {/* 💡 Uzman Tavsiyesi & Arıza Teşhis Kutusu */}
                  <div className="mt-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 p-5 text-left text-xs sm:text-sm text-amber-950 dark:text-amber-100 shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-base shadow-xs">
                        💡
                      </span>
                      <div>
                        <strong className="font-bold text-amber-900 dark:text-amber-200 block text-sm">
                          Uzman Tavsiyesi & Arıza Nedeni:
                        </strong>
                        <p className="mt-1 leading-relaxed text-amber-950/90 dark:text-amber-100 font-medium">
                          {selectedFault.body || selectedFault.solution}
                        </p>
                      </div>
                    </div>

                    {/* İlk Müdahale Adımları (tips) */}
                    {selectedFault.tips && selectedFault.tips.length > 0 && (
                      <div className="pt-3 border-t border-amber-400/30 space-y-2">
                        <span className="block font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                          🛠️ Servis Gelene Kadar Yapılması Gerekenler:
                        </span>
                        <div className="space-y-1.5">
                          {selectedFault.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-amber-950 dark:text-amber-100">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <a
                    href={buildWaLink(
                      waNumber,
                      `Merhaba, Tekirdağ / ${district} bölgesindeyim. Arıtma cihazımda '${selectedFault.title || selectedFault.label}' sorunu yaşıyorum. Teknik servis desteği ve arıza randevusu almak istiyorum.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAnalyticsEvent({ eventType: "whatsapp_started", flowType: "fault", itemId: selectedFault.faultId || selectedFault.id })}
                    className="btn-whatsapp mt-6 inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold w-full shadow"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp ile Yetkili Servis Çağır
                  </a>

                  <CallbackForm
                    flowType="fault"
                    itemName={`Arıza Servisi: ${selectedFault.title || selectedFault.label}`}
                    city={city}
                    district={district}
                    onSubmitted={clearWizardDraft}
                  />
                </div>
              )}

              {/* ============ BUILDER FLOW (DİNAMİK ADIM MOTORU) ============ */}
              {flow === "builder" && currentStep && step < activeBuilderSteps.length && (
                <div data-testid={`wizard-builder-step-${step}`} className="max-w-2xl mx-auto">
                  <div className="site-eyebrow mb-3 inline-flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{currentStep.badge}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">
                    {currentStep.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4">
                    {currentStep.description}
                  </p>
                  <p className="text-xs sm:text-sm text-primary font-semibold mb-4" data-testid="builder-auto-advance-hint">
                    Seçim yaptığınız anda sonraki adıma geçersiniz. Geri dönüp istediğiniz zaman değiştirebilirsiniz.
                  </p>

                  {(currentStep.guideText || currentStep.key === "tank") && (
                    <div className="mb-5 flex items-start gap-3 border-l-2 border-primary bg-secondary p-4 text-xs text-foreground sm:text-sm">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-primary">
                        <Info className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <div>
                        <strong className="mb-0.5 block font-semibold text-foreground">Uzman notu</strong>
                        <span className="leading-relaxed text-muted-foreground">
                          {currentStep.key === "tank"
                            ? "Standart tank 8–10 L kullanım kapasitesi sunar. Daha dayanıklı gövde, yüksek kalite diyafram ve uzun servis ömrü isteyenler için PAE veya eşdeğer komponentli Premium Tank uygundur."
                            : currentStep.guideText}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3.5">
                    {currentStepOptions.map((rawOption) => {
                      const opt = customerFacingBuilderOption(rawOption);
                      return <BuilderOptionCard
                        key={opt._id || opt.optionId}
                        selected={builderSelections[currentStep.key] === opt.optionId}
                        onClick={() => selectBuilderOption(currentStep.key, opt.optionId, step)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...opt,
                            categoryTitle: currentStep.badge,
                            isSelected: builderSelections[currentStep.key] === opt.optionId,
                            onSelect: () => selectBuilderOption(currentStep.key, opt.optionId, step),
                          })
                        }
                        title={opt.name}
                        price={opt.salePrice || opt.price || 0}
                        desc={opt.desc}
                        img={opt.img}
                        badge={opt.badge}
                        tier={getOptionTier(opt, currentStepOptions)}
                      />
                    })}
                  </div>

                  {step === 0 && (
                    <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-foreground">Lotus Custom Altyapı Paketi</strong>
                        <span className="font-mono font-bold text-foreground">{basePrice.toLocaleString("tr-TR")} ₺</span>
                      </div>
                      <p className="mt-1.5 text-muted-foreground leading-relaxed">
                        Temel şase, hortumlar, fittings, çekvalf, montaj altyapısı, işçilik ve test dahildir. Seçtiğiniz bileşenler bu platform üzerine eklenir.
                      </p>
                    </div>
                  )}

                  {/* Live Incremental Price Bar */}
                  <div className="mt-6 rounded-2xl bg-neutral-950 text-white p-4 sm:p-5 shadow-lg border border-neutral-800/80">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>
                            {builderSelections[currentStep.key]
                              ? `Canlı Liste Tutarı (${selectedItemsList.length} Parça Seçildi):`
                              : "Şu Ana Kadarki Liste Tutarı (Bu adımın seçimi bekleniyor):"}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-display font-extrabold text-2xl text-amber-300 font-mono">
                            {builderListPrice.toLocaleString("tr-TR")} ₺
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">(KDV & Montaj Dahil)</span>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 shrink-0">Lotus Custom altyapısı dahil</span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderSelections[currentStep.key]}
                      onClick={() => go(step + 1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {step + 1 < activeBuilderSteps.length ? "Sonraki adım" : "Özeti göster"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============ BUILDER SUMMARY & PROFIT / DISCOUNT STEP ============ */}
              {flow === "builder" && step === activeBuilderSteps.length && (
                <div data-testid="wizard-builder-result" className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-600 px-3.5 py-1 text-xs font-bold mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Size özel Lotus Custom</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">Cihazınızın özeti</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">
                      Tekirdağ / {district} için hazırlanan cihazınızın üretim bileşenleri aşağıdadır.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[hsl(var(--brand-champagne)/0.7)] bg-card overflow-hidden shadow-xl p-6 sm:p-8">
                    <div className="mb-6 rounded-2xl border border-[hsl(var(--brand-plum)/0.18)] bg-[hsl(var(--brand-plum)/0.05)] p-4 sm:p-5">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cihaz Kimliği</span>
                      <strong className="mt-1 block font-display text-xl sm:text-2xl text-[hsl(var(--brand-plum))]">LOTUS CUSTOM #{customDeviceId}</strong>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {selectedItemsList.map((item) => item.name).join(" / ")}
                      </p>
                      <p className="mt-2 text-xs sm:text-sm font-semibold text-foreground">
                        Bu cihaz stoktan alınmadı. Siparişiniz için bu konfigürasyonda hazırlanacak.
                      </p>
                    </div>

                    {/* Parça Döküm Tablosu */}
                    <div className="space-y-3 pb-6 border-b border-border">
                      <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground pb-2 border-b border-border/60">
                        <span className="font-bold text-foreground">Bileşen</span>
                        <span className="font-bold text-foreground">Seçiminiz</span>
                        <span className="font-bold text-foreground">Tutar</span>
                      </div>

                      {/* Baz Donanım */}
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Lotus Custom Altyapı Paketi:</span>
                        <span className="font-medium text-foreground text-xs sm:text-sm">Şase, hortum, fittings, çekvalf, işçilik ve test</span>
                        <span className="font-bold text-foreground font-mono">{basePrice.toLocaleString("tr-TR")} ₺</span>
                      </div>

                      {selectedItemsList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">{item.stepTitle}:</span>
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            {item.name}
                          </span>
                          <span className="font-bold text-foreground font-mono">
                            {(item.salePrice || item.price || 0) === 0 ? "Dahil (0 ₺)" : `+${(item.salePrice || item.price || 0).toLocaleString("tr-TR")} ₺`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Fiyatlandırma & %20 İndirim Açığa Çıkışı */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm sm:text-base">
                        <span className="text-muted-foreground">Toplam Liste Fiyatı:</span>
                        <span className="line-through font-mono font-bold text-muted-foreground text-lg sm:text-xl">
                          {builderListPrice.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-amber-500/10 border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-600 text-white font-bold text-xs">
                              %{discountPercent} Lansman Avantajı
                            </Badge>
                            <span className="text-xs font-bold text-emerald-600">
                              {builderDiscount.toLocaleString("tr-TR")} ₺ Net Tasarruf
                            </span>
                          </div>
                          <span className="block text-xs text-muted-foreground mt-1">
                            Montaj, KDV ve 2 Yıl Yerinde Garanti Dahil
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="block text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                            Lotus Custom Lansman Fiyatı
                          </span>
                          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[hsl(var(--brand-plum))] font-mono">
                            {builderFinalPrice.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Siparişi kaydet, ardından WhatsApp görüşmesini başlat */}
                    <CallbackForm
                      flowType="builder"
                      itemName={`Lotus Custom #${customDeviceId}`}
                      city={city}
                      district={district}
                      productionOrder
                      onSubmitted={clearWizardDraft}
                      whatsappUrl={buildWaLink(
                        waNumber,
                        `Merhaba, ben {MÜŞTERİ_ADI}. ${customDeviceId} kimlikli Lotus Custom cihazımı üretime göndermek istiyorum.\nTekirdağ / ${district}\n\nÜretim Konfigürasyonu:\n` +
                          selectedItemsList.map((it) => `• ${it.stepTitle}: ${it.name}`).join("\n") +
                          `\n\nListe Tutarı: ${builderListPrice.toLocaleString("tr-TR")} ₺\nLotus Custom Lansman Fiyatı: ${builderFinalPrice.toLocaleString("tr-TR")} ₺\nKonfigürasyonu teyit etmek istiyorum.`
                      )}
                      leadPayload={{
                        selectedItems: selectedItemsList.map((item) => ({
                          stepTitle: item.stepTitle,
                          name: item.name,
                          costPrice: item.costPrice || 0,
                          salePrice: item.salePrice || item.price || 0,
                        })),
                        basePrice,
                        baseCost,
                        deviceId: customDeviceId,
                        source: "custom_production_order",
                        totalListPrice: builderListPrice,
                        finalDiscountedPrice: builderFinalPrice,
                        totalCostPrice: builderTotalCost,
                        estimatedProfit: builderEstimatedProfit,
                        profitMarginPercent: builderMarginPercent,
                      }}
                    />
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold border border-border bg-card hover:bg-muted transition-all"
                    >
                      <RotateCcw className="h-4 w-4" /> Baştan Yeni Cihaz Oluştur
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Detail Modal */}
      <BuilderDetailModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onSelect={modalItem?.onSelect}
        isSelected={modalItem?.isSelected}
      />
      <DeviceDetailModal
        device={selectedDevice}
        waNumber={waNumber}
        matchReason={
          selectedDevice
            ? selectedDevice.recommendationReason || `${selectedDevice.capacity || "Evinizin kullanımı"} ve seçtiğiniz ${budget || "uygun"} bütçe aralığıyla eşleştiği için önerildi.`
            : ""
        }
        onClose={() => setSelectedDevice(null)}
        onRequestQuote={(device) => {
          setSelectedDevice(null);
          openDeviceQuote(device);
        }}
      />
      <DeviceQuoteModal
        device={quoteDevice}
        waNumber={waNumber}
        city={city}
        district={district}
        onClose={() => setQuoteDevice(null)}
        onSubmitted={clearWizardDraft}
      />
    </div>
  );
}
