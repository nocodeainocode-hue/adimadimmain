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
import {
  TEKIRDAG_DISTRICTS,
  BUILDER_CONFIG as DEFAULT_BUILDER_CONFIG,
  getRecommendedDevices,
  saveLeadLocally,
} from "@/data/siteConfig";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

const ease = [0.2, 0.8, 0.2, 1];
const variants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 16 : -16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -16 : 16 }),
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

        <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
          {item.name}
        </h3>

        {/* Big HD Image */}
        {item.img && (
          <div className="mt-4 w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-border/80 shadow-md">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Price & Guarantee Box */}
        <div className="mt-5 p-4 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs text-muted-foreground font-medium">Bileşen Ek Tutarı</span>
            <span className="font-display font-extrabold text-2xl text-[hsl(var(--brand-plum))] font-mono">
              {item.price === 0 ? "Dahil (0 ₺)" : `+${item.price.toLocaleString("tr-TR")} ₺`}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" /> 2 Yıl Orijinal Garanti
            </span>
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-5">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
            Bileşen Açıklaması
          </h4>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            {item.longDesc || item.desc}
          </p>
        </div>

        {/* Highlights */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mt-5">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Öne Çıkan Avantajlar
            </h4>
            <div className="grid gap-2 sm:grid-cols-1">
              {item.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span className="font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specs Grid */}
        {item.specs && item.specs.length > 0 && (
          <div className="mt-5">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Teknik Özellikler & Standartlar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.specs.map((sp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-card border border-border text-xs text-foreground/90 font-medium">
                  {sp}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 h-12 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect();
              onClose();
            }}
            className="w-full sm:w-auto btn-champagne px-6 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md"
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" /> Bu Seçenek Seçili
              </>
            ) : (
              <>
                <Check className="h-4 w-4 stroke-[3]" /> Bu Seçeneği Cihaza Ekle ({item.price === 0 ? "0 ₺" : `+${item.price.toLocaleString("tr-TR")} ₺`})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Builder Option Card with Image Support & Details Trigger ---------- */
function BuilderOptionCard({ selected, onClick, title, price, desc, badge, img, onOpenDetails }) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group ${
        selected
          ? "border-[hsl(var(--brand-champagne))] ring-2 ring-[hsl(var(--brand-champagne)/0.5)] bg-[hsl(var(--brand-champagne)/0.10)] scale-[1.01]"
          : "border-border bg-card hover:bg-muted/60 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
        {img && (
          <div
            onClick={(e) => {
              if (onOpenDetails) {
                e.stopPropagation();
                onOpenDetails();
              }
            }}
            title="Büyük görsel ve detaylar için tıklayın"
            className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-border/80 shadow-sm group-hover:ring-2 group-hover:ring-[hsl(var(--brand-champagne))]"
          >
            <img
              src={img}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Eye className="h-4 w-4 drop-shadow" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base sm:text-lg text-foreground">{title}</span>
            {badge && (
              <Badge className="bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] text-[10px] font-bold border-0">
                {badge}
              </Badge>
            )}
          </div>
          {desc && <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>}
          
          {onOpenDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--brand-plum))] hover:text-[hsl(var(--brand-plum)/0.8)] mt-2 hover:underline bg-[hsl(var(--brand-plum)/0.08)] px-2 py-0.5 rounded-md"
            >
              <Info className="h-3 w-3" /> Büyük Görsel & Detaylı Özellikler
            </button>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        <span className="font-display font-extrabold text-base sm:text-lg text-[hsl(var(--brand-plum))] block font-mono">
          {price === 0 ? "0 ₺" : `+${price.toLocaleString("tr-TR")} ₺`}
        </span>
        <span
          className={`inline-flex h-6 w-6 mt-1.5 items-center justify-center rounded-full border transition-all ${
            selected
              ? "bg-[hsl(var(--brand-champagne))] border-[hsl(var(--brand-champagne))] text-neutral-900"
              : "border-border text-transparent"
          }`}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </span>
      </div>
    </div>
  );
}

/* ---------- Callback "Beni Arayın" Lead Form ---------- */
function CallbackForm({ flowType, itemName, city, district, discountOffer }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) return;
    setLoading(true);
    setError(false);

    const leadData = {
      full_name: name.trim() || "İsimsiz Müşteri",
      phone: cleanPhone,
      city: city || "Belirtilmedi",
      district: district || "",
      flow_type: flowType,
      item_name: itemName,
    };

    // Save locally first for 100% guarantee
    saveLeadLocally(leadData);

    // Optional API sync if server is configured
    if (API) {
      try {
        await axios.post(`${API}/lead`, leadData);
      } catch (err) {
        console.warn("Backend sync skipped, saved locally.", err);
      }
    }

    setSubmitted(true);
    setLoading(false);
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
      {error && <p className="text-xs text-rose-500 mt-2 font-medium">Bir bağlantı hatası oluştu, lütfen doğrudan WhatsApp'tan deneyin.</p>}
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
function EntryCard({ icon: Icon, title, desc, onClick, testId }) {
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
          Seç ve İlerle <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </span>
      </span>
    </button>
  );
}

/* ---------- WhatsApp CTA button ---------- */
function WhatsAppButton({ number, message, testId, children, full }) {
  return (
    <a
      href={buildWaLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      className={`btn-whatsapp inline-flex items-center justify-center gap-2.5 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all shadow-sm ${full ? "w-full" : ""}`}
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      {children || "WhatsApp'tan Yaz"}
    </a>
  );
}

export default function Wizard({ config }) {
  const waNumber = config?.whatsapp?.number || "905550000000";

  const [flow, setFlow] = useState(null); // 'buy' | 'filter' | 'fault'
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // selections
  const [city, setCity] = useState("Tekirdağ");
  const [district, setDistrict] = useState("Süleymanpaşa");
  const [consumption, setConsumption] = useState(null);
  const [budget, setBudget] = useState(null);
  const [lastChanged, setLastChanged] = useState(null);
  const [faultType, setFaultType] = useState(null);

  // Custom Device Builder selections (start empty for step-by-step accumulation)
  const [builderKasa, setBuilderKasa] = useState(null);
  const [builderFiltre, setBuilderFiltre] = useState(null);
  const [builderBeyin, setBuilderBeyin] = useState(null);
  const [builderPompa, setBuilderPompa] = useState(null);
  const [builderTank, setBuilderTank] = useState(null);
  const [builderMusluk, setBuilderMusluk] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  // device results
  const [devices, setDevices] = useState([]);
  const [devLoading, setDevLoading] = useState(false);

  const stepsByFlow = { buy: 4, filter: 2, fault: 2, builder: 7 };
  const totalSteps = flow ? stepsByFlow[flow] : 0;
  const progress = flow ? ((step + 1) / totalSteps) * 100 : 0;

  const stepLabels = {
    buy: ["Tekirdağ / İlçe", "Su tüketimi", "Bütçe", "Önerilen cihazlar"],
    filter: ["Son değişim", "Önerilen filtre seti"],
    fault: ["Arıza tipi", "Yönlendirme"],
    builder: [
      "Kasa Seçimi",
      "Filtre Paketi",
      "Beyin / Otomasyon",
      "Pompa Seçimi",
      "Depolama Tankı",
      "Musluk Seçimi",
      "Özet & %20 İndirim",
    ],
  };

  const locationText = district ? `Tekirdağ / ${district}` : "Tekirdağ";

  // Builder calculation logic (only adds items selected so far)
  const bCfg = config?.builderConfig || DEFAULT_BUILDER_CONFIG;
  const selKasa = bCfg.kasa.find((k) => k.id === builderKasa) || null;
  const selFiltre = bCfg.filtre.find((f) => f.id === builderFiltre) || null;
  const selBeyin = bCfg.beyin.find((b) => b.id === builderBeyin) || null;
  const selPompa = bCfg.pompa.find((p) => p.id === builderPompa) || null;
  const selTank = bCfg.tank.find((t) => t.id === builderTank) || null;
  const selMusluk = bCfg.musluk.find((m) => m.id === builderMusluk) || null;

  const builderListPrice =
    (bCfg.basePrice || 500) +
    (selKasa ? selKasa.price : 0) +
    (selFiltre ? selFiltre.price : 0) +
    (selBeyin ? selBeyin.price : 0) +
    (selPompa ? selPompa.price : 0) +
    (selTank ? selTank.price : 0) +
    (selMusluk ? selMusluk.price : 0);

  const builderDiscount = Math.round(builderListPrice * 0.2);
  const builderFinalPrice = builderListPrice - builderDiscount;

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
    setBuilderKasa(null);
    setBuilderFiltre(null);
    setBuilderBeyin(null);
    setBuilderPompa(null);
    setBuilderTank(null);
    setBuilderMusluk(null);
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

  const fetchDevices = (b, c) => {
    setDevLoading(true);
    const recs = getRecommendedDevices(b, c);
    setDevices(recs && recs.length > 0 ? recs : config.devices || []);
    setDevLoading(false);
  };

  const goToBuyResults = () => {
    fetchDevices(budget, consumption);
    go(3, 1);
  };

  // Filter set recommendation logic
  const recommendedSet = useMemo(() => {
    if (!lastChanged) return null;
    if (lastChanged === "6ay") return config.filterSets.set3;
    return config.filterSets.set5; // 1yil & bilmiyorum -> 5'li
  }, [lastChanged, config]);

  const selectedFault = useMemo(
    () => config.faultGuides.find((f) => f.id === faultType) || null,
    [faultType, config]
  );

  const stepKey = `${flow || "entry"}-${step}`;

  return (
    <div className="relative">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand-plum)/0.15)] bg-[hsl(var(--brand-plum)/0.06)] px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
          <span>✨ 60 Saniyelik Akıllı Çözüm Rehberi</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
          Nasıl yardımcı olabiliriz?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          İhtiyacınıza en uygun modeli, filtreyi veya teknik servis çözümünü birkaç saniyede belirleyelim.
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
                  <ArrowLeft className="h-4 w-4" /> Geri
                </button>

                <div aria-live="polite" className="text-xs sm:text-sm font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted/60">
                  Adım {step + 1} / {totalSteps} • {stepLabels[flow][step]}
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition-all"
                  data-testid="wizard-restart-button"
                >
                  <RotateCcw className="h-4 w-4" /> Başa Dön
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
                    icon={ShoppingCart}
                    title="Cihaz Satın Almak İstiyorum"
                    desc="Bölgenize, bütçenize ve kullanım alışkanlığınıza en uygun yeni nesil su arıtma cihazını keşfedin."
                    onClick={() => startFlow("buy")}
                    testId="wizard-entry-buy-device"
                  />
                  <EntryCard
                    icon={Replace}
                    title="Filtre Değiştirmek İstiyorum"
                    desc="Son değişim tarihinize göre tam uyumlu orijinal filtre setini hemen belirleyin."
                    onClick={() => startFlow("filter")}
                    testId="wizard-entry-change-filter"
                  />
                  <EntryCard
                    icon={Wrench}
                    title="Cihazımda Arıza Var"
                    desc="Damlatma, sızıntı veya düşük debi gibi sorunlara hızlı çözüm ve yetkili servis desteği alın."
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
                            <span className="font-display font-bold text-lg sm:text-xl text-foreground">Kendi Cihazını Kendin Oluştur</span>
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] border-0">🎁 Formu Doldur %20 İndirim Kazan</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Kasa, filtre paketi, beyin, pompa, tank ve musluğu ihtiyacınıza göre parça parça kendiniz seçin; canlı fiyatınızı hesaplayın.
                          </p>
                        </div>
                      </div>
                      <span className="btn-champagne shrink-0 inline-flex items-center gap-2 rounded-xl h-11 px-5 text-sm font-bold shadow-sm">
                        Konfigüratörü Başlat <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ============ BUY FLOW ============ */}
              {/* Step 0: Tekirdağ İlçe Seçimi */}
              {flow === "buy" && step === 0 && (
                <div data-testid="wizard-location-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand-champagne)/0.4)] bg-[hsl(var(--brand-champagne)/0.12)] px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <MapPin className="h-3.5 w-3.5 text-[hsl(var(--brand-champagne))]" />
                    <span>Tekirdağ Bölgesel Su & Kireç Analizi</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Hangi ilçede ikamet ediyorsunuz?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Tekirdağ genelinde şebeke sularının yüksek kireç, klor ve sertlik yapısına tam uyumlu, en uzun ömürlü filtre ve membran teknolojisini seçelim.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                      Tekirdağ İlçenizi Seçin
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
                      Devam Et <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Su Tüketim Yoğunluğu */}
              {flow === "buy" && step === 1 && (
                <div data-testid="wizard-consumption-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Su tüketim yoğunluğunuz nedir?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">Evinizdeki kişi sayısına ve günlük kullanımınıza göre en verimli tank ve debi kapasitesini seçelim.</p>
                  <div className="grid gap-3.5" data-testid="wizard-consumption-options">
                    {config.consumptionOptions.map((o) => (
                      <OptionCard
                        key={o.id}
                        selected={consumption === o.id}
                        onClick={() => setConsumption(o.id)}
                        title={o.label}
                        hint={o.hint}
                        testId={`wizard-consumption-option-${o.id}`}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!consumption}
                      onClick={() => go(2, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-consumption-next"
                    >
                      Devam Et <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Bütçe */}
              {flow === "buy" && step === 2 && (
                <div data-testid="wizard-budget-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Bütçeniz nedir?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">Size en uygun fiyat-performans aralığındaki cihazları sıralayalım.</p>
                  <div className="grid gap-3.5" data-testid="wizard-budget-preset">
                    {config.budgetOptions.map((o) => (
                      <OptionCard
                        key={o.id}
                        selected={budget === o.id}
                        onClick={() => setBudget(o.id)}
                        title={o.label}
                        hint={o.hint}
                        testId={`wizard-budget-option-${o.id}`}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!budget}
                      onClick={goToBuyResults}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-budget-next"
                    >
                      Cihazları Göster <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Sonuç Ekranı */}
              {flow === "buy" && step === 3 && (
                <div data-testid="wizard-device-results">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 text-xs font-bold mb-2">
                      <Check className="h-3.5 w-3.5" />
                      <span>{locationText ? `${locationText} Bölgesine Özel Eşleşme` : "Özel Eşleşme"}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-foreground">Size Özel Önerilen Cihazlar</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Seçimlerinize ve bölgenize göre en yüksek puanı alan modeller aşağıda listelendi.
                    </p>
                  </div>

                  {devLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-3 text-[hsl(var(--brand-champagne))]" />
                      <p className="font-semibold">Cihazlar getiriliyor…</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {devices.map((d) => (
                        <div
                          key={d.id}
                          className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                          data-testid="wizard-device-result-card"
                        >
                          <div className="device-placeholder relative aspect-[4/3] flex items-center justify-center border-b border-border/50">
                            <div className="flex flex-col items-center text-[hsl(var(--brand-plum))]">
                              <Droplets className="h-10 w-10 opacity-70 group-hover:scale-110 transition-transform" />
                              <span className="mt-2 text-xs font-semibold text-muted-foreground">Lotus Arıtma Modeli</span>
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                              {d.badges?.map((b) => (
                                <Badge key={b} variant="secondary" className="text-[11px] font-semibold bg-[hsl(var(--brand-plum)/0.08)] text-[hsl(var(--brand-plum))] border-0">{b}</Badge>
                              ))}
                            </div>
                            <h4 className="font-display font-bold text-xl text-foreground">{d.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{d.tagline}</p>
                            <ul className="mt-4 space-y-2 flex-1">
                              {d.specs?.slice(0, 4).map((s) => (
                                <li key={s} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                                  <Check className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-5 pt-4 border-t border-border flex items-end justify-between">
                              <div>
                                <span className="block text-[11px] font-medium text-muted-foreground">Tavsiye Edilen Fiyat</span>
                                <span className="font-display font-bold text-2xl text-[hsl(var(--brand-plum))]" data-testid="wizard-device-price">{d.price}</span>
                              </div>
                            </div>
                            <a
                              href={buildWaLink(
                                waNumber,
                                `Merhaba, ${locationText ? locationText + " bölgesindeyim. " : ""}${d.name} modeli hakkında fiyat teklifi ve montaj randevusu almak istiyorum.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid="wizard-device-whatsapp-button"
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

                  {/* Çift Kanallı İletişim: Hızlı Beni Arayın Formu */}
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
                      data-testid="wizard-restart-secondary"
                    >
                      <RotateCcw className="h-4 w-4" /> Farklı Seçim Yap
                    </button>
                  </div>
                </div>
              )}

              {/* ============ BUILDER FLOW (KENDİ CİHAZINI OLUŞTUR) ============ */}
              {/* Builder Step 0: Kasa */}
              {flow === "builder" && step === 0 && (
                <div data-testid="wizard-builder-kasa-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Layers className="h-3.5 w-3.5 text-amber-500" />
                    <span>1. Adım • Dış Gövde & Kasa</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Kasa Tipinizi Seçin</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Tezgah altınızın alanına ve estetik tercihinize en uygun kasa modelini belirleyin.
                  </p>

                  <div className="grid gap-3.5">
                    {bCfg.kasa.map((k) => (
                      <BuilderOptionCard
                        key={k.id}
                        selected={builderKasa === k.id}
                        onClick={() => setBuilderKasa(k.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...k,
                            categoryTitle: "1. Adım • Dış Gövde & Kasa",
                            badge: k.id === "kapali" ? "En Çok Tercih Edilen" : null,
                            isSelected: builderKasa === k.id,
                            onSelect: () => setBuilderKasa(k.id),
                          })
                        }
                        title={k.name}
                        price={k.price}
                        desc={k.desc}
                        img={k.img}
                        badge={k.id === "kapali" ? "En Çok Tercih Edilen" : null}
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
                            {builderKasa
                              ? "Canlı Liste Tutarı (Baz Donanım 500 ₺ Dahil):"
                              : "Temel Montaj & Fitting Baz Tutarı: 500 ₺ (Kasa seçtiğinizde eklenecektir)"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderKasa}
                      onClick={() => go(1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Filtre Seçimine İlerle <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 1: Filtre */}
              {flow === "builder" && step === 1 && (
                <div data-testid="wizard-builder-filtre-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Droplets className="h-3.5 w-3.5 text-amber-500" />
                    <span>2. Adım • Filtrasyon Teknolojisi</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Filtre Paketinizi Seçin</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    İçme suyunuzun mineral zenginliğini, pH alkali seviyesini ve membran arıtma kalitesini belirleyin.
                  </p>

                  <div className="grid gap-3.5">
                    {bCfg.filtre.map((f) => (
                      <BuilderOptionCard
                        key={f.id}
                        selected={builderFiltre === f.id}
                        onClick={() => setBuilderFiltre(f.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...f,
                            categoryTitle: "2. Adım • Filtrasyon Teknolojisi",
                            badge: f.id === "diamond5" ? "Ultra Zengin Mineral" : f.id === "premium5" ? "Fiyat/Performans" : null,
                            isSelected: builderFiltre === f.id,
                            onSelect: () => setBuilderFiltre(f.id),
                          })
                        }
                        title={f.name}
                        price={f.price}
                        desc={f.desc}
                        img={f.img}
                        badge={f.id === "diamond5" ? "Ultra Zengin Mineral" : f.id === "premium5" ? "Fiyat/Performans" : null}
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
                            {builderFiltre
                              ? "Canlı Liste Tutarı (Baz + Kasa + Filtre):"
                              : "Şu Ana Kadarki Liste Tutarı (Filtre seçimi bekleniyor):"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderFiltre}
                      onClick={() => go(2, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Beyin Seçimine İlerle <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 2: Beyin */}
              {flow === "builder" && step === 2 && (
                <div data-testid="wizard-builder-beyin-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Cpu className="h-3.5 w-3.5 text-amber-500" />
                    <span>3. Adım • Otomasyon & Kontrol</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Beyin / Kontrol Ünitesini Seçin</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Sistem basıncını yöneten ve su sızıntılarını engelleyen otomasyon modülünü seçin.
                  </p>

                  <div className="grid gap-3.5">
                    {bCfg.beyin.map((b) => (
                      <BuilderOptionCard
                        key={b.id}
                        selected={builderBeyin === b.id}
                        onClick={() => setBuilderBeyin(b.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...b,
                            categoryTitle: "3. Adım • Otomasyon & Kontrol",
                            badge: b.id === "dijital" ? "Akıllı Sensörlü" : null,
                            isSelected: builderBeyin === b.id,
                            onSelect: () => setBuilderBeyin(b.id),
                          })
                        }
                        title={b.name}
                        price={b.price}
                        desc={b.desc}
                        img={b.img}
                        badge={b.id === "dijital" ? "Akıllı Sensörlü" : null}
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
                            {builderBeyin
                              ? "Canlı Liste Tutarı (Baz + Kasa + Filtre + Beyin):"
                              : "Şu Ana Kadarki Liste Tutarı (Beyin seçimi bekleniyor):"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderBeyin}
                      onClick={() => go(3, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Pompa Seçimine İlerle <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 3: Pompa */}
              {flow === "builder" && step === 3 && (
                <div data-testid="wizard-builder-pompa-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Gauge className="h-3.5 w-3.5 text-amber-500" />
                    <span>4. Adım • Basınç & Pompa Desteği</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Pompa Durumunu Seçin</h3>
                  
                  {/* Rehber & Bilgilendirme Kutusu */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-6 text-xs sm:text-sm text-foreground/90">
                    <strong className="text-blue-700 block font-bold mb-1">💡 Neye Göre Seçmelisiniz?</strong>
                    Eviniz <strong>3. kat ve üzerindeyse</strong> veya şebeke su basıncınız 3 bar altındaysa membranın tam verimle çalışması için <strong>Pompalı</strong> seçmeniz tavsiye edilir. Giriş katlarda veya hidroforlu binalarda pompasız yeterlidir.
                  </div>

                  <div className="grid gap-3.5">
                    {bCfg.pompa.map((p) => (
                      <BuilderOptionCard
                        key={p.id}
                        selected={builderPompa === p.id}
                        onClick={() => setBuilderPompa(p.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...p,
                            categoryTitle: "4. Adım • Basınç & Pompa Desteği",
                            badge: p.id === "pompali" ? "Tavsiye Edilen" : null,
                            isSelected: builderPompa === p.id,
                            onSelect: () => setBuilderPompa(p.id),
                          })
                        }
                        title={p.name}
                        price={p.price}
                        desc={p.desc}
                        img={p.img}
                        badge={p.id === "pompali" ? "Tavsiye Edilen" : null}
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
                            {builderPompa
                              ? "Canlı Liste Tutarı (Baz + Kasa + Filtre + Beyin + Pompa):"
                              : "Şu Ana Kadarki Liste Tutarı (Pompa seçimi bekleniyor):"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderPompa}
                      onClick={() => go(4, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Tank Seçimine İlerle <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 4: Tank */}
              {flow === "builder" && step === 4 && (
                <div data-testid="wizard-builder-tank-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Container className="h-3.5 w-3.5 text-amber-500" />
                    <span>5. Adım • Depolama Kapasitesi</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Depolama Tankınızı Seçin</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Ailenizin günlük arıtılmış su ihtiyacını karşılayacak antibakteriyel basınç tankı kapasitesini belirleyin.
                  </p>

                  <div className="grid gap-3.5">
                    {bCfg.tank.map((t) => (
                      <BuilderOptionCard
                        key={t.id}
                        selected={builderTank === t.id}
                        onClick={() => setBuilderTank(t.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...t,
                            categoryTitle: "5. Adım • Depolama Kapasitesi",
                            badge: t.id === "plat12" ? "Paslanmaz Çelik" : null,
                            isSelected: builderTank === t.id,
                            onSelect: () => setBuilderTank(t.id),
                          })
                        }
                        title={t.name}
                        price={t.price}
                        desc={t.desc}
                        img={t.img}
                        badge={t.id === "plat12" ? "Paslanmaz Çelik" : null}
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
                            {builderTank
                              ? "Canlı Liste Tutarı (Baz + Kasa + Filtre + Beyin + Pompa + Tank):"
                              : "Şu Ana Kadarki Liste Tutarı (Tank seçimi bekleniyor):"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderTank}
                      onClick={() => go(5, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Musluk Seçimine İlerle <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 5: Musluk */}
              {flow === "builder" && step === 5 && (
                <div data-testid="wizard-builder-musluk-step" className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-[hsl(var(--brand-plum))] mb-3">
                    <Pipette className="h-3.5 w-3.5 text-amber-500" />
                    <span>6. Adım • Çıkış Musluğu & Batarya</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Musluk / Batarya Modelini Seçin</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Mutfak tezgahınızın görünümüne uygun klasik paslanmaz veya 3 yollu entegre lüks bataryanızı seçin.
                  </p>

                  <div className="grid gap-3.5">
                    {bCfg.musluk.map((m) => (
                      <BuilderOptionCard
                        key={m.id}
                        selected={builderMusluk === m.id}
                        onClick={() => setBuilderMusluk(m.id)}
                        onOpenDetails={() =>
                          setModalItem({
                            ...m,
                            categoryTitle: "6. Adım • Çıkış Musluğu & Batarya",
                            badge: m.id === "3yollu" ? "Tezgahı Deldirmez" : null,
                            isSelected: builderMusluk === m.id,
                            onSelect: () => setBuilderMusluk(m.id),
                          })
                        }
                        title={m.name}
                        price={m.price}
                        desc={m.desc}
                        img={m.img}
                        badge={m.id === "3yollu" ? "Tezgahı Deldirmez" : null}
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
                            {builderMusluk
                              ? "Nihai Liste Tutarı (Tüm Parçalar Tamamlandı):"
                              : "Şu Ana Kadarki Liste Tutarı (Musluk seçimi bekleniyor):"}
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
                        🎁 Formu Doldur %20 İndirim Kazan
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!builderMusluk}
                      onClick={() => go(6, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Özet & İndirim Fırsatını Gör <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Builder Step 6: Özet & Fiyat & İndirim & Form */}
              {flow === "builder" && step === 6 && (
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
                        <span className="font-bold text-foreground text-right">Tutar</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Temel Donanım & Fitting</span>
                        <span className="text-muted-foreground text-xs">Filtre kabı, çekvalf, hortum & fitting</span>
                        <span className="font-mono font-bold text-foreground text-right">+500 ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Kasa Tipi</span>
                        <span className="text-muted-foreground text-xs">{selKasa?.name || "Açık Kasa"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selKasa ? selKasa.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Filtre Paketi</span>
                        <span className="text-muted-foreground text-xs">{selFiltre?.name || "5'li Eko"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selFiltre ? selFiltre.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Beyin / Otomasyon</span>
                        <span className="text-muted-foreground text-xs">{selBeyin?.name || "Standart"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selBeyin ? selBeyin.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Pompa Desteği</span>
                        <span className="text-muted-foreground text-xs">{selPompa?.name || "Pompasız"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selPompa ? selPompa.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Depolama Tankı</span>
                        <span className="text-muted-foreground text-xs">{selTank?.name || "8 Litre"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selTank ? selTank.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-foreground">Arıtma Musluğu</span>
                        <span className="text-muted-foreground text-xs">{selMusluk?.name || "Standart Musluk"}</span>
                        <span className="font-mono font-bold text-foreground text-right">+{selMusluk ? selMusluk.price.toLocaleString("tr-TR") : "0"} ₺</span>
                      </div>
                    </div>

                    {/* %20 İndirim Kancası / Reveal Kutusu */}
                    <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white border-2 border-emerald-500/50 shadow-xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                        <Sparkles className="h-4 w-4" />
                        <span>ÖZEL İNDİRİM HAKKI KAZANDINIZ!</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 mb-4 leading-relaxed">
                        Aşağıdaki formu doldurarak veya doğrudan WhatsApp'tan teklif alarak cihazınıza anında <strong>%20 İndirim</strong> uygulayabilirsiniz.
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-neutral-800">
                        <div>
                          <span className="block text-xs text-neutral-400 font-medium">Normal Liste Fiyatı:</span>
                          <span className="text-lg line-through text-neutral-500 font-mono">{builderListPrice.toLocaleString("tr-TR")} ₺</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="block text-xs uppercase tracking-wider text-emerald-400 font-bold">Formu Doldur / %20 İndirimli Fiyat</span>
                          <span className="font-display font-extrabold text-3xl text-amber-300 font-mono">{builderFinalPrice.toLocaleString("tr-TR")} ₺</span>
                          <span className="block text-[11px] text-emerald-400 font-semibold mt-0.5">🎉 -{builderDiscount.toLocaleString("tr-TR")} ₺ Anında Tasarruf</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Sipariş Butonu */}
                    <div className="mt-6">
                      <WhatsAppButton
                        number={waNumber}
                        message={`Merhaba, Tekirdağ / ${district} için Kendi Cihazımı Oluşturdum:%0A- Kasa: ${selKasa?.name}%0A- Filtre: ${selFiltre?.name}%0A- Beyin: ${selBeyin?.name}%0A- Pompa: ${selPompa?.name}%0A- Tank: ${selTank?.name}%0A- Musluk: ${selMusluk?.name}%0A%0A🎁 Form/WhatsApp İndirimli Tutarı: ${builderFinalPrice.toLocaleString("tr-TR")} ₺.%0AMontaj randevusu ve sipariş için görüşmek istiyorum.`}
                        testId="wizard-builder-whatsapp-button"
                        full
                      >
                        🎁 %20 İndirimli Teklifimi WhatsApp'tan Al & Randevu Al
                      </WhatsAppButton>
                    </div>

                    {/* Callback Form with Discount Heading */}
                    <CallbackForm
                      flowType="builder"
                      itemName={`Özel Toplama (${selKasa?.name} + ${selFiltre?.name} + ${selPompa?.name}) - %20 İndirimli ${builderFinalPrice} ₺`}
                      city={city}
                      district={district}
                      discountOffer={true}
                    />
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold border border-border bg-card hover:bg-muted transition-all"
                    >
                      <RotateCcw className="h-4 w-4" /> Baştan Başla
                    </button>
                  </div>
                </div>
              )}

              {/* ============ FILTER FLOW ============ */}
              {flow === "filter" && step === 0 && (
                <div data-testid="wizard-filter-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Filtreniz en son ne zaman değiştirildi?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">Cihazınızın su kalitesini ve membran ömrünü korumak için en doğru periyodu belirleyelim.</p>
                  <div className="grid gap-3.5" data-testid="wizard-filter-last-changed-options">
                    <OptionCard
                      selected={lastChanged === "6ay"}
                      onClick={() => setLastChanged("6ay")}
                      title="Yaklaşık 6 ay önce"
                      hint="Ön tortu ve karbon filtrelerinin standart yenilenme zamanı"
                      testId="wizard-filter-option-6ay"
                    />
                    <OptionCard
                      selected={lastChanged === "1yil"}
                      onClick={() => setLastChanged("1yil")}
                      title="1 yıl veya daha uzun süre önce"
                      hint="Membran dahil tam takım filtre değişimi tavsiye edilir"
                      testId="wizard-filter-option-1yil"
                    />
                    <OptionCard
                      selected={lastChanged === "bilmiyorum"}
                      onClick={() => setLastChanged("bilmiyorum")}
                      title="Tarihi hatırlamıyorum / Bilmiyorum"
                      hint="Su tadında veya akışında değişiklik varsa tam kontrol önerilir"
                      testId="wizard-filter-option-bilmiyorum"
                    />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!lastChanged}
                      onClick={() => go(1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-filter-next"
                    >
                      Önerilen Seti Gör <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "filter" && step === 1 && recommendedSet && (
                <div data-testid="wizard-filter-result" className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-foreground">Sizin İçin Önerilen Filtre Seti</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{recommendedSet.recommendedFor}</p>
                  </div>

                  <div
                    className="rounded-2xl border-2 border-[hsl(var(--brand-champagne)/0.6)] bg-card overflow-hidden shadow-lg"
                    data-testid="wizard-filter-result-card"
                  >
                    <div
                      className="device-placeholder relative aspect-[16/6] flex items-center justify-center border-b border-border/50"
                      data-testid="wizard-filter-image-placeholder"
                    >
                      <div className="flex flex-col items-center text-[hsl(var(--brand-plum))]">
                        <Replace className="h-10 w-10 opacity-70" />
                        <span className="mt-2 text-xs font-semibold text-muted-foreground">Orijinal Lotus Filtre Seti</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4 flex-wrap pb-5 border-b border-border">
                        <div>
                          <Badge className="bg-[hsl(var(--brand-champagne))] text-neutral-900 font-bold border-0 mb-2">⭐ Tavsiye Edilen Set</Badge>
                          <h4 className="font-display font-bold text-2xl text-foreground">{recommendedSet.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{recommendedSet.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-medium text-muted-foreground">Fiyat</span>
                          <span className="font-display font-bold text-2xl text-[hsl(var(--brand-plum))]" data-testid="wizard-filter-price">
                            {recommendedSet.price}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-600" /> Set İçeriği
                          </p>
                          <ul className="space-y-2">
                            {recommendedSet.includes.map((s) => (
                              <li key={s} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85">
                                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-plum))] mt-1.5 shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[hsl(var(--brand-champagne))]" /> Sağladığı Avantajlar
                          </p>
                          <ul className="space-y-2">
                            {recommendedSet.benefits.map((s) => (
                              <li key={s} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/85">
                                <ChevronRight className="h-4 w-4 mt-0.5 text-[hsl(var(--brand-rose))] shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {recommendedSet.isPlaceholderPrice && (
                        <p className="mt-5 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/60">{recommendedSet.priceNote}</p>
                      )}

                      <div className="mt-6">
                        <WhatsAppButton
                          number={waNumber}
                          message={`Merhaba, ${locationText ? locationText + " bölgesindeyim. " : ""}${recommendedSet.name} için güncel fiyat ve montaj randevusu bilgisi almak istiyorum.`}
                          testId="wizard-filter-whatsapp-button"
                          full
                        >
                          WhatsApp ile Fiyat Al & Randevu Oluştur
                        </WhatsAppButton>
                      </div>
                    </div>
                  </div>

                  {/* Çift Kanallı İletişim: Hızlı Beni Arayın Formu */}
                  <CallbackForm
                    flowType="filter"
                    itemName={recommendedSet.name}
                    city={city}
                    district={district}
                  />

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold border border-border bg-card hover:bg-muted transition-all"
                      data-testid="wizard-restart-secondary"
                    >
                      <RotateCcw className="h-4 w-4" /> Baştan Başla
                    </button>
                  </div>
                </div>
              )}

              {/* ============ FAULT FLOW ============ */}
              {flow === "fault" && step === 0 && (
                <div data-testid="wizard-fault-step" className="max-w-2xl mx-auto">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl mb-1 text-foreground">Cihazınızda ne tür bir sorun var?</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">Yaşadığınız arıza tipini seçin, hemen ilk müdahale adımlarını ve servis yönlendirmesini aktaralım.</p>
                  <div className="grid gap-3.5" data-testid="wizard-malfunction-options">
                    {config.faultGuides.map((f) => (
                      <OptionCard
                        key={f.id}
                        selected={faultType === f.id}
                        onClick={() => setFaultType(f.id)}
                        title={f.label}
                        testId={`wizard-fault-option-${f.id}`}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      disabled={!faultType}
                      onClick={() => go(1, 1)}
                      className="btn-champagne inline-flex items-center gap-2 rounded-xl h-12 px-6 text-sm sm:text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="wizard-fault-next"
                    >
                      Çözümü Gör <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {flow === "fault" && step === 1 && selectedFault && (
                <div data-testid="wizard-fault-result" className="max-w-3xl mx-auto">
                  <div
                    className="rounded-2xl border border-[hsl(var(--brand-rose)/0.4)] bg-[hsl(var(--brand-rose)/0.06)] p-6 sm:p-8 shadow-sm"
                    data-testid="wizard-malfunction-guidance"
                  >
                    <div className="flex items-center gap-3.5 pb-4 border-b border-[hsl(var(--brand-rose)/0.2)]">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] shadow-sm">
                        <AlertTriangle className="h-6 w-6" />
                      </span>
                      <h3 className="font-display font-bold text-2xl text-foreground">{selectedFault.title}</h3>
                    </div>
                    <p className="mt-4 text-sm sm:text-base text-foreground/90 leading-relaxed">{selectedFault.body}</p>

                    <div className="mt-6 rounded-xl bg-white/70 border border-border/80 p-4 sm:p-5">
                      <p className="text-sm font-bold text-foreground">🛠️ Servis Ulaşana Kadar Yapabileceğiniz Güvenlik Adımları:</p>
                      <ul className="mt-3 space-y-2">
                        {selectedFault.tips.map((t) => (
                          <li key={t} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85">
                            <Check className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="mt-5 text-sm sm:text-base font-medium text-foreground/90">{selectedFault.cta}</p>

                    <div className="mt-6">
                      <WhatsAppButton
                        number={waNumber}
                        message={`Merhaba, ${locationText ? locationText + " bölgesindeyim. " : ""}Cihazımda "${selectedFault.label}" arızası var. Hızlı teknik servis desteği alabilir miyim?`}
                        testId="wizard-malfunction-whatsapp-button"
                        full
                      >
                        Hemen WhatsApp ile Servis Çağır
                      </WhatsAppButton>
                    </div>
                  </div>

                  {/* Çift Kanallı İletişim: Hızlı Beni Arayın Formu */}
                  <CallbackForm
                    flowType="fault"
                    itemName={selectedFault.label}
                    city={city}
                    district={district}
                  />

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold border border-border bg-card hover:bg-muted transition-all"
                      data-testid="wizard-restart-secondary"
                    >
                      <RotateCcw className="h-4 w-4" /> Baştan Başla
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Component Detail Modal */}
      {modalItem && (
        <BuilderDetailModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSelect={modalItem.onSelect}
          isSelected={modalItem.isSelected}
        />
      )}
    </div>
  );
}
