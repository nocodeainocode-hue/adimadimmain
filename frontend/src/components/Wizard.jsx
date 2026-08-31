import { useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildWaLink } from "@/lib/whatsapp";
import { useLocalData } from "@/lib/convex";
import {
  TEKIRDAG_DISTRICTS,
  BUILDER_CONFIG as DEFAULT_BUILDER_CONFIG,
  getRecommendedDevices,
} from "@/data/siteConfig";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

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

/* ---------- Builder Component Detail Modal ---------- */
function BuilderDetailModal({ item, onClose, onSelect, isSelected }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
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
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border bg-neutral-950 mb-6 shadow-inner">
          <img
            src={item.img}
            alt={item.name || item.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-medium drop-shadow">
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
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 shadow-sm cursor-pointer ${
        selected
          ? "border-[hsl(var(--brand-champagne))] ring-2 ring-[hsl(var(--brand-champagne)/0.5)] bg-[hsl(var(--brand-champagne)/0.12)] -translate-y-0.5"
          : "border-border bg-card/90 hover:bg-muted/60 hover:border-neutral-300"
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Left Thumbnail with Click to Zoom */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDetails) onOpenDetails();
          }}
          className="relative h-24 w-full sm:h-20 sm:w-28 shrink-0 rounded-xl overflow-hidden border border-border bg-neutral-900 group/img shadow-sm"
          title="Büyük görseli ve detayları incelemek için tıklayın"
        >
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover group-hover/img:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow group-hover/img:scale-105 transition-transform">
              <Eye className="h-3 w-3" /> İncele
            </span>
          </div>
        </div>

        {/* Middle Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-base sm:text-lg text-foreground group-hover:text-foreground">
              {title}
            </span>
            {badge && (
              <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[11px] font-bold">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {desc}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetails) onOpenDetails();
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--brand-plum))] hover:underline"
          >
            <Info className="h-3.5 w-3.5" />
            <span>🔎 Büyük Görsel & Detaylı Özellikler</span>
          </button>
        </div>

        {/* Right Price & Select Circle */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <div className="text-left sm:text-right">
            <span className="block text-[11px] font-medium text-muted-foreground">Fiyat Farkı</span>
            <span className="font-display font-extrabold text-lg sm:text-xl text-[hsl(var(--brand-plum))] font-mono">
              {price === 0 ? "Dahil (0 ₺)" : `+${price.toLocaleString("tr-TR")} ₺`}
            </span>
          </div>

          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              selected
                ? "bg-[hsl(var(--brand-champagne))] border-[hsl(var(--brand-champagne))] text-neutral-900 shadow-md scale-110"
                : "border-border text-transparent group-hover:border-neutral-400"
            }`}
          >
            <Check className="h-4 w-4 stroke-[3]" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Callback Form with Convex Support ---------- */
function CallbackForm({ flowType, itemName, city, district, discountOffer, leadPayload }) {
  const { addLocalLead } = useLocalData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) return;
    setLoading(true);
    setSubmitError("");

    const fullLead = {
      fullName: name.trim() || "İsimsiz Müşteri",
      phone: cleanPhone,
      city: city || "Tekirdağ",
      district: district || "",
      flowType: flowType,
      itemName: itemName,
      ...(leadPayload || {}),
    };

    try {
      await addLocalLead(fullLead);
      setSubmitted(true);
    } catch {
      setSubmitError("Talebiniz kaydedilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
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
        <h4 className="font-display font-bold text-lg text-foreground">Talebiniz Başarıyla Alındı!</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
          {discountOffer ? "🎁 %20 İndirim hakkınız numaranıza tanımlandı! " : ""}
          Su uzmanımız 10-15 dakika içinde <strong className="text-foreground font-semibold">{phone}</strong> numaranızdan sizi arayarak montaj ve fiyat detaylarını aktaracaktır.
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-8 rounded-2xl border p-5 sm:p-7 backdrop-blur-sm ${
      discountOffer 
        ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" 
        : "border-border/90 bg-muted/40"
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${
          discountOffer
            ? "bg-emerald-600 text-white"
            : "bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))]"
        }`}>
          {discountOffer ? <Sparkles className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
        </span>
        <div>
          <h4 className="font-display font-bold text-base sm:text-lg text-foreground">
            {discountOffer ? "🎁 %20 İndirim Fırsatını Numaranıza Tanımlayın" : "WhatsApp Kullanmıyor musunuz?"}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {discountOffer 
              ? "Numaranızı bırakın, teknik uzmanımız %20 indirimli teklifinizle sizi 10-15 dk içinde arasın." 
              : "Numaranızı bırakın, teknik uzmanımız sizi hemen arasın."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid sm:grid-cols-3 gap-3">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
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
          disabled={loading || !phone}
          className="btn-champagne rounded-xl h-12 px-5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : discountOffer ? <Sparkles className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {discountOffer ? "%20 İndirimle Ara" : "Beni Arayın"}
        </button>
      </form>
      {submitError && <p role="alert" className="mt-3 text-xs font-semibold text-rose-600">{submitError}</p>}
    </div>
  );
}

/* ---------- Small reusable option card ---------- */
function OptionCard({ selected, onClick, title, hint, icon: Icon, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-pressed={selected}
      className={`w-full text-left rounded-2xl border px-5 py-4 transition-all duration-200 shadow-sm flex items-center gap-4 group
        ${selected
          ? "border-[hsl(var(--brand-champagne))] ring-2 ring-[hsl(var(--brand-champagne)/0.4)] bg-[hsl(var(--brand-champagne)/0.10)] translate-y-[-1px]"
          : "border-border bg-card/80 hover:bg-muted/70 hover:border-neutral-300"}`}
    >
      {Icon && (
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--brand-plum)/0.12)] text-[hsl(var(--brand-plum))] shadow-sm transition-transform group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="flex-1">
        <span className="block font-bold text-base text-foreground group-hover:text-foreground">{title}</span>
        {hint && <span className="block text-xs sm:text-sm text-muted-foreground mt-0.5">{hint}</span>}
      </span>
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all
          ${selected ? "bg-[hsl(var(--brand-champagne))] border-[hsl(var(--brand-champagne))] text-neutral-900 shadow-sm" : "border-border text-transparent group-hover:border-neutral-400"}`}
      >
        <Check className="h-4 w-4 stroke-[2.5]" />
      </span>
    </button>
  );
}

/* ---------- Entry choice big card ---------- */
function EntryCard({ icon: Icon, title, desc, buttonText, onClick, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-7 text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[hsl(var(--brand-champagne)/0.5)] hover:-translate-y-1"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(500px_circle_at_30%_20%,hsl(var(--brand-rose)/0.15),transparent_60%)]" />
      <span className="relative flex flex-col h-full">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-plum))] to-[hsl(var(--brand-plum)/0.85)] text-[hsl(var(--brand-champagne))] shadow-md transition-transform group-hover:scale-110">
          <Icon className="h-7 w-7" />
        </span>
        <span className="font-display font-bold text-xl sm:text-2xl mt-5 text-foreground">{title}</span>
        <span className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</span>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--brand-plum))] group-hover:text-[hsl(var(--brand-plum)/0.8)]">
          {buttonText} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </span>
      </span>
    </button>
  );
}

export default function Wizard({ config }) {
  const { localData } = useLocalData();
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

  const [flow, setFlow] = useState(null); // 'buy' | 'filter' | 'fault' | 'builder'
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // General Wizard selections
  const [city, setCity] = useState("Tekirdağ");
  const [district, setDistrict] = useState("Süleymanpaşa");
  const [consumption, setConsumption] = useState(null);
  const [budget, setBudget] = useState(null);
  const [lastChanged, setLastChanged] = useState(null);
  const [faultType, setFaultType] = useState(null);

  // Dynamic Custom Device Builder selections map: { [stepKey]: optionId }
  const [builderSelections, setBuilderSelections] = useState({});
  const [modalItem, setModalItem] = useState(null);

  // device results
  const [devices, setDevices] = useState([]);
  const [devLoading, setDevLoading] = useState(false);

  const stepsByFlow = {
    buy: 4,
    filter: 2,
    fault: 2,
    builder: activeBuilderSteps.length + 1, // All steps + 1 summary step
  };

  const totalSteps = flow ? stepsByFlow[flow] || 1 : 0;
  const progress = flow ? ((step + 1) / totalSteps) * 100 : 0;

  const stepLabels = {
    buy: ["Tekirdağ / İlçe", "Su tüketimi", "Bütçe", "Önerilen cihazlar"],
    filter: ["Son değişim", "Önerilen filtre seti"],
    fault: ["Arıza tipi", "Yönlendirme"],
    builder: [
      ...activeBuilderSteps.map((s) => s.title),
      "Özet & %20 İndirim",
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
        return opt
          ? {
              ...opt,
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
  };

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
  };

  const startFlow = (f) => {
    setDir(1);
    setFlow(f);
    setStep(0);
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
    <div className="relative">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand-plum)/0.15)] bg-[hsl(var(--brand-plum)/0.06)] px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
          <span>{texts.entry.badge}</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
          {texts.entry.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {texts.entry.subtitle}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-border/80 bg-card shadow-lg backdrop-blur-sm">
        <div className="noise absolute inset-0" />
        <div className="relative p-5 sm:p-7 md:p-10">
          {/* Stepper header (only within a flow) */}
          {flow && (
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition-all"
                  data-testid="wizard-back-button"
                >
                  <ArrowLeft className="h-4 w-4" /> {texts.navigation.backButton}
                </button>

                <div aria-live="polite" className="text-xs sm:text-sm font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted/60">
                  Adım {step + 1} / {totalSteps} • {stepLabels[flow]?.[step] || "Adım"}
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
              <div className="mt-4 h-2.5 w-full rounded-full bg-muted/80 overflow-hidden" data-testid="wizard-progress">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--brand-champagne))] to-amber-500 transition-all duration-300 shadow-sm"
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
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease }}
            >
              {/* ============ ENTRY ============ */}
              {!flow && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="wizard-entry">
                  <EntryCard
                    icon={ENTRY_ICONS[texts.entry.cards.buy.icon] || ShoppingCart}
                    title={texts.entry.cards.buy.title}
                    desc={texts.entry.cards.buy.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("buy")}
                    testId="wizard-entry-buy-device"
                  />
                  <EntryCard
                    icon={ENTRY_ICONS[texts.entry.cards.filter.icon] || Replace}
                    title={texts.entry.cards.filter.title}
                    desc={texts.entry.cards.filter.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("filter")}
                    testId="wizard-entry-change-filter"
                  />
                  <EntryCard
                    icon={ENTRY_ICONS[texts.entry.cards.fault.icon] || Wrench}
                    title={texts.entry.cards.fault.title}
                    desc={texts.entry.cards.fault.desc}
                    buttonText={texts.entry.cardButtonText}
                    onClick={() => startFlow("fault")}
                    testId="wizard-entry-malfunction"
                  />

                  {/* 4. Özel Konfigüratör Seçeneği */}
                  <div className="md:col-span-3 mt-1">
                    <button
                      type="button"
                      onClick={() => startFlow("builder")}
                      className="w-full text-left rounded-2xl border-2 border-dashed border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] shadow-md group-hover:scale-105 transition-transform">
                          <SlidersHorizontal className="h-6 w-6" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-lg sm:text-xl text-foreground">{texts.entry.configurator.title}</span>
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] border-0">
                              {siteSettings.discountBadgeText || "🎁 Formu Doldur %20 İndirim Kazan"}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {texts.entry.configurator.desc}
                          </p>
                        </div>
                      </div>
                      <span className="btn-champagne shrink-0 inline-flex items-center gap-2 rounded-xl h-11 px-5 text-sm font-bold shadow-sm">
                        {texts.entry.configurator.buttonText} <ArrowRight className="h-4 w-4" />
                      </span>
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
                      onClick={() => setConsumption("az")}
                      title={texts.buy.consumption.options.low.title}
                      hint={texts.buy.consumption.options.low.hint}
                      icon={Droplets}
                      testId="wizard-consumption-low"
                    />
                    <OptionCard
                      selected={consumption === "orta"}
                      onClick={() => setConsumption("orta")}
                      title={texts.buy.consumption.options.medium.title}
                      hint={texts.buy.consumption.options.medium.hint}
                      icon={Droplets}
                      testId="wizard-consumption-medium"
                    />
                    <OptionCard
                      selected={consumption === "cok"}
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
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{locationText} İçin Özel Eşleşme</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">{texts.buy.results.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">{texts.buy.results.subtitle}</p>
                  </div>

                  {devices.length === 0 ? (
                    <div className="text-center py-10 bg-card rounded-2xl border border-border p-6">
                      <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">Bu kriterlere uygun model bulunamadı.</p>
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
                            <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                              <img src={d.img} alt={d.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                                <span className="block text-[11px] font-medium text-muted-foreground">Tavsiye Edilen Fiyat</span>
                                <span className="font-display font-bold text-2xl text-[hsl(var(--brand-plum))]">{d.price}</span>
                              </div>
                            </div>
                            <a
                              href={buildWaLink(
                                waNumber,
                                `Merhaba, ${locationText ? locationText + " bölgesindeyim. " : ""}${d.name} modeli hakkında fiyat teklifi ve montaj randevusu almak istiyorum.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-whatsapp mt-4 inline-flex items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold transition-all w-full shadow-sm"
                            >
                              <MessageCircle className="h-4 w-4" /> WhatsApp ile Bilgi Al
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kendi Cihazını Topla Banner */}
                  <div className="mt-8 rounded-2xl border-2 border-dashed border-[hsl(var(--brand-champagne)/0.7)] bg-[hsl(var(--brand-champagne)/0.06)] p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] px-3 py-1 text-xs font-bold mb-2">
                      <Hammer className="h-3.5 w-3.5" />
                      <span>Özel Konfigüratör</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-foreground">Aradığınızı tam olarak bulamadınız mı?</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                      Kasa, filtre, beyin, pompa, tank ve musluğu bütçenize göre kendiniz seçin; %20 lansman indirimiyle anında özel fiyatınızı hesaplayın.
                    </p>
                    <button
                      type="button"
                      onClick={() => startFlow("builder")}
                      className="btn-champagne mt-4 inline-flex items-center gap-2 rounded-xl h-11 px-6 text-sm font-bold shadow-md transition-all"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Kendi Cihazımı Kendim Oluşturayım
                    </button>
                  </div>

                  <CallbackForm
                    flowType="buy"
                    itemName={devices[0]?.name || "Lotus Cihaz Satın Alma"}
                    city={city}
                    district={district}
                  />

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
                    <OptionCard selected={lastChanged === "6ay"} onClick={() => setLastChanged("6ay")} title={texts.filter.question.options.sixMonths.title} hint={texts.filter.question.options.sixMonths.hint} />
                    <OptionCard selected={lastChanged === "1yil"} onClick={() => setLastChanged("1yil")} title={texts.filter.question.options.oneYear.title} hint={texts.filter.question.options.oneYear.hint} />
                    <OptionCard selected={lastChanged === "bilmiyorum"} onClick={() => setLastChanged("bilmiyorum")} title={texts.filter.question.options.unknown.title} hint={texts.filter.question.options.unknown.hint} />
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
                  <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-bold mb-3">
                    ✨ Cihazınıza %100 Uyumlu Orijinal Filtre Paketi
                  </Badge>
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
                          <Badge className="bg-emerald-600 text-white font-bold text-[11px] border-0 shadow">
                            Orijinal NSF Sertifikalı
                          </Badge>
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
                    <span>Teknik Teşhis & İlk Müdahale Rehberi</span>
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
                    className="btn-whatsapp mt-6 inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold w-full shadow"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp ile Yetkili Servis Çağır
                  </a>

                  <CallbackForm
                    flowType="fault"
                    itemName={`Arıza Servisi: ${selectedFault.title || selectedFault.label}`}
                    city={city}
                    district={district}
                  />
                </div>
              )}

              {/* ============ BUILDER FLOW (DİNAMİK ADIM MOTORU) ============ */}
              {flow === "builder" && currentStep && step < activeBuilderSteps.length && (
                <div data-testid={`wizard-builder-step-${step}`} className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Layers className="h-3.5 w-3.5 text-amber-500" />
                    <span>{currentStep.badge}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">
                    {currentStep.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4">
                    {currentStep.description}
                  </p>

                  {currentStep.guideText && (
                    <div className="mb-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 p-4 sm:p-4.5 text-xs sm:text-sm text-amber-950 dark:text-amber-100 shadow-sm flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-base shadow-xs">
                        💡
                      </span>
                      <div>
                        <strong className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">Uzman Tavsiyesi:</strong>
                        <span className="leading-relaxed text-amber-950/90 dark:text-amber-100">{currentStep.guideText}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3.5">
                    {currentStepOptions.map((opt) => (
                      <BuilderOptionCard
                        key={opt._id || opt.optionId}
                        selected={builderSelections[currentStep.key] === opt.optionId}
                        onClick={() =>
                          setBuilderSelections((prev) => ({
                            ...prev,
                            [currentStep.key]: opt.optionId,
                          }))
                        }
                        onOpenDetails={() =>
                          setModalItem({
                            ...opt,
                            categoryTitle: currentStep.badge,
                            isSelected: builderSelections[currentStep.key] === opt.optionId,
                            onSelect: () =>
                              setBuilderSelections((prev) => ({
                                ...prev,
                                [currentStep.key]: opt.optionId,
                              })),
                          })
                        }
                        title={opt.name}
                        price={opt.salePrice || opt.price || 0}
                        desc={opt.desc}
                        img={opt.img}
                        badge={opt.badge}
                      />
                    ))}
                  </div>

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
                      <Badge className="bg-amber-400/15 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
                        {siteSettings.discountBadgeText || "🎁 Formu Doldur %20 İndirim Kazan"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderSelections[currentStep.key]}
                      onClick={() => go(step + 1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {step + 1 < activeBuilderSteps.length ? "Sonraki Adıma İlerle" : "Özet & %20 İndirim Fırsatını Gör"} <ArrowRight className="h-4 w-4" />
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
                      <span>Özel Toplama Lotus Arıtma Cihazınız Hazır!</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">Konfigürasyon Özeti & Parça Dökümü</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">
                      Tekirdağ / {district} bölgenize özel seçtiğiniz tüm orijinal parçaların şeffaf dökümü aşağıdadır.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-[hsl(var(--brand-champagne)/0.7)] bg-card overflow-hidden shadow-xl p-6 sm:p-8">
                    {/* Parça Döküm Tablosu */}
                    <div className="space-y-3 pb-6 border-b border-border">
                      <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground pb-2 border-b border-border/60">
                        <span className="font-bold text-foreground">Bileşen</span>
                        <span className="font-bold text-foreground">Seçiminiz</span>
                        <span className="font-bold text-foreground">Tutar</span>
                      </div>

                      {/* Baz Donanım */}
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Temel Montaj & Fitting Paketi:</span>
                        <span className="font-medium text-foreground text-xs sm:text-sm">Universal Housing, Çekvalf, Rekorlar</span>
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
                              %20 Lansman İndirimi
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
                            Nihai İndirimli Fiyat
                          </span>
                          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[hsl(var(--brand-plum))] font-mono">
                            {builderFinalPrice.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Sipariş Butonu */}
                    <a
                      href={buildWaLink(
                        waNumber,
                        `Merhaba, Tekirdağ / ${district} için Kendi Cihazımı Oluşturdum:\n` +
                          selectedItemsList.map((it) => `• ${it.stepTitle}: ${it.name}`).join("\n") +
                          `\n\nListe Tutarı: ${builderListPrice.toLocaleString("tr-TR")} ₺\n%20 İndirimli Teklifim: ${builderFinalPrice.toLocaleString("tr-TR")} ₺\nMontaj randevusu almak istiyorum.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp mt-6 inline-flex items-center justify-center gap-2.5 rounded-xl h-14 px-6 text-base sm:text-lg font-bold transition-all w-full shadow-lg"
                    >
                      <MessageCircle className="h-5 w-5" />
                      %20 İndirimli WhatsApp Siparişini Başlat
                    </a>

                    {/* Çift Kanallı Hızlı İletişim Formu */}
                    <CallbackForm
                      flowType="builder"
                      itemName="Özel Toplama Lotus Cihazı"
                      city={city}
                      district={district}
                      discountOffer={true}
                      leadPayload={{
                        selectedItems: selectedItemsList.map((item) => ({
                          stepTitle: item.stepTitle,
                          name: item.name,
                          costPrice: item.costPrice || 0,
                          salePrice: item.salePrice || item.price || 0,
                        })),
                        basePrice,
                        baseCost,
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
    </div>
  );
}
