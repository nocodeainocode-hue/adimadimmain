import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Save,
  DollarSign,
  TrendingUp,
  Percent,
  Eye,
  CheckCircle2,
  Clock,
  PhoneCall,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Settings,
  MessageSquare,
  Package,
  Wrench,
  ShieldCheck,
  Check,
  X,
  FileText,
  SlidersHorizontal,
  Lock,
  Unlock,
  LogOut,
  KeyRound,
  AlertTriangle,
  Droplets,
  ShoppingCart,
} from "lucide-react";
import { useLocalData } from "@/lib/convex";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ImageUploadField from "@/components/admin/ImageUploadField";

const ENTRY_ICON_OPTIONS = [
  ["ShoppingCart", "Alışveriş Sepeti"],
  ["Replace", "Değişim Okları"],
  ["Wrench", "Anahtar / Servis"],
  ["Droplets", "Su Damlaları"],
  ["SlidersHorizontal", "Ayar Sürgüleri"],
  ["Hammer", "Çekiç"],
  ["ShieldCheck", "Onaylı Kalkan"],
  ["Sparkles", "Parıltı"],
];

const TEXT_CONTENT_SECTIONS = [
  {
    title: "Giriş Ekranı",
    description: "Wizard üst başlığı, kartların ortak buton metni ve genel gezinme butonları.",
    fields: [
      ["entry.badge", "Üst Rozet"],
      ["entry.title", "Ana Başlık"],
      ["entry.subtitle", "Alt Yazı", "textarea"],
      ["entry.cardButtonText", "Kart Buton Metni"],
      ["navigation.backButton", "Geri Butonu"],
      ["navigation.restartButton", "Başa Dön Butonu"],
    ],
  },
  ...[
    ["buy", "Satın Al Kartı"],
    ["filter", "Filtre Kartı"],
    ["fault", "Arıza Kartı"],
  ].map(([key, title]) => ({
    title,
    fields: [
      [`entry.cards.${key}.icon`, "İkon", "icon"],
      [`entry.cards.${key}.title`, "Başlık"],
      [`entry.cards.${key}.desc`, "Açıklama", "textarea"],
    ],
  })),
  {
    title: "Konfigüratör Bannerı",
    fields: [
      ["entry.configurator.title", "Başlık"],
      ["entry.configurator.desc", "Açıklama", "textarea"],
      ["entry.configurator.buttonText", "Buton Metni"],
    ],
  },
  {
    title: "Satın Al • İlçe Adımı",
    fields: [
      ["buy.district.badge", "Rozet"],
      ["buy.district.title", "Başlık"],
      ["buy.district.subtitle", "Alt Yazı", "textarea"],
      ["buy.district.label", "İlçe Seçim Etiketi"],
      ["buy.district.buttonText", "Buton Metni"],
    ],
  },
  {
    title: "Satın Al • Tüketim Adımı",
    fields: [
      ["buy.consumption.title", "Başlık"],
      ["buy.consumption.subtitle", "Alt Yazı", "textarea"],
      ["buy.consumption.buttonText", "Buton Metni"],
      ["buy.consumption.options.low.title", "Düşük Tüketim • Başlık"],
      ["buy.consumption.options.low.hint", "Düşük Tüketim • İpucu", "textarea"],
      ["buy.consumption.options.medium.title", "Orta Tüketim • Başlık"],
      ["buy.consumption.options.medium.hint", "Orta Tüketim • İpucu", "textarea"],
      ["buy.consumption.options.high.title", "Yüksek Tüketim • Başlık"],
      ["buy.consumption.options.high.hint", "Yüksek Tüketim • İpucu", "textarea"],
    ],
  },
  {
    title: "Satın Al • Bütçe Adımı",
    fields: [
      ["buy.budget.title", "Başlık"],
      ["buy.budget.subtitle", "Alt Yazı", "textarea"],
      ["buy.budget.buttonText", "Buton Metni"],
      ["buy.budget.loadingText", "Yükleniyor Metni"],
      ["buy.budget.options.economy.title", "Ekonomik • Başlık"],
      ["buy.budget.options.economy.hint", "Ekonomik • İpucu", "textarea"],
      ["buy.budget.options.medium.title", "Orta Segment • Başlık"],
      ["buy.budget.options.medium.hint", "Orta Segment • İpucu", "textarea"],
      ["buy.budget.options.premium.title", "Premium • Başlık"],
      ["buy.budget.options.premium.hint", "Premium • İpucu", "textarea"],
    ],
  },
  {
    title: "Satın Al • Sonuçlar",
    fields: [
      ["buy.results.title", "Başlık"],
      ["buy.results.subtitle", "Alt Yazı", "textarea"],
    ],
  },
  {
    title: "Filtre Akışı • Soru",
    fields: [
      ["filter.question.title", "Başlık"],
      ["filter.question.subtitle", "Alt Yazı", "textarea"],
      ["filter.question.buttonText", "Buton Metni"],
      ["filter.question.options.sixMonths.title", "6 Ay • Başlık"],
      ["filter.question.options.sixMonths.hint", "6 Ay • İpucu", "textarea"],
      ["filter.question.options.oneYear.title", "1 Yıl • Başlık"],
      ["filter.question.options.oneYear.hint", "1 Yıl • İpucu", "textarea"],
      ["filter.question.options.unknown.title", "Bilinmiyor • Başlık"],
      ["filter.question.options.unknown.hint", "Bilinmiyor • İpucu", "textarea"],
    ],
  },
  {
    title: "Arıza Akışı • Soru",
    fields: [
      ["fault.question.title", "Başlık"],
      ["fault.question.subtitle", "Alt Yazı", "textarea"],
      ["fault.question.buttonText", "Buton Metni"],
    ],
  },
];

const getNestedValue = (object, path) =>
  path.split(".").reduce((value, key) => value?.[key], object) ?? "";

const setNestedValue = (object, path, value) => {
  const [key, ...rest] = path.split(".");
  if (rest.length === 0) return { ...object, [key]: value };
  return { ...object, [key]: setNestedValue(object?.[key] || {}, rest.join("."), value) };
};

function StringListEditor({ label, values = [], onChange, placeholder = "Yeni madde" }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="font-bold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...values, placeholder])}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--brand-plum))] hover:underline"
        >
          <Plus className="h-3 w-3" /> Madde Ekle
        </button>
      </div>
      <div className="space-y-1.5">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(event) => {
                const updated = [...values];
                updated[index] = event.target.value;
                onChange(updated);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 hover:text-rose-700"
              aria-label={`${label} maddesini kaldır`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const {
    isAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    localData,
    updateLocalStep,
    deleteLocalStep,
    updateLocalOption,
    deleteLocalOption,
    updateLocalDevice,
    deleteLocalDevice,
    updateLocalFilterSet,
    deleteLocalFilterSet,
    updateLocalFault,
    deleteLocalFault,
    updateLocalSettings,
    updateLocalTexts,
    updateLocalLeadStatus,
    resetLocalToDefault,
  } = useLocalData();

  // Login Form States
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("finans");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedStepFilter, setSelectedStepFilter] = useState("all");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Form States
  const [editingStep, setEditingStep] = useState(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);

  const [editingOption, setEditingOption] = useState(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  const [editingDevice, setEditingDevice] = useState(null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  const [editingFilterSet, setEditingFilterSet] = useState(null);
  const [isFilterSetModalOpen, setIsFilterSetModalOpen] = useState(false);

  const [editingFault, setEditingFault] = useState(null);
  const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);

  // Settings Local Form State
  const [settingsForm, setSettingsForm] = useState(localData.settings);
  const [textsForm, setTextsForm] = useState(localData.texts);

  useEffect(() => {
    setTextsForm(localData.texts);
  }, [localData.texts]);

  useEffect(() => {
    setSettingsForm(localData.settings);
  }, [localData.settings]);

  // Financial Calculations
  const stats = useMemo(() => {
    const leads = localData.leads || [];
    let totalRevenue = 0;
    let totalCost = 0;
    let totalEstimatedProfit = 0;

    leads.forEach((l) => {
      if (l.status !== "cancelled") {
        totalRevenue += l.finalDiscountedPrice || l.totalListPrice || 0;
        totalCost += l.totalCostPrice || 0;
        totalEstimatedProfit += l.estimatedProfit || 0;
      }
    });

    const overallMargin =
      totalRevenue > 0 ? Math.round((totalEstimatedProfit / totalRevenue) * 100) : 0;

    return {
      totalLeads: leads.length,
      builderLeads: leads.filter((l) => l.flowType === "builder").length,
      totalRevenue,
      totalCost,
      totalEstimatedProfit,
      overallMargin,
    };
  }, [localData.leads]);

  // Filtered Options
  const filteredOptions = useMemo(() => {
    return (localData.options || []).filter((opt) => {
      const matchStep = selectedStepFilter === "all" || opt.stepKey === selectedStepFilter;
      const matchSearch =
        !searchTerm ||
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStep && matchSearch;
    });
  }, [localData.options, selectedStepFilter, searchTerm]);

  // Filtered Devices
  const filteredDevices = useMemo(() => {
    return (localData.devices || []).filter((dev) => {
      const matchSearch =
        !searchTerm ||
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [localData.devices, searchTerm]);

  // Filtered Filter Sets
  const filteredFilterSets = useMemo(() => {
    return (localData.filterSets || []).filter((fs) => {
      const matchSearch =
        !searchTerm ||
        fs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fs.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fs.desc?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [localData.filterSets, searchTerm]);

  // Filtered Faults
  const filteredFaults = useMemo(() => {
    return (localData.faultGuides || []).filter((fault) => {
      const matchSearch =
        !searchTerm ||
        fault.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.body.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [localData.faultGuides, searchTerm]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return (localData.leads || []).filter((lead) => {
      const matchStatus = leadStatusFilter === "all" || lead.status === leadStatusFilter;
      const matchSearch =
        !searchTerm ||
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.district.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [localData.leads, leadStatusFilter, searchTerm]);

  // Handlers
  const persistChange = async (operation, successMessage) => {
    try {
      await operation();
      toast.success(successMessage);
      return true;
    } catch (error) {
      toast.error(error?.message || "Değişiklik Convex'e kaydedilemedi.");
      return false;
    }
  };

  const handleSaveStep = async (e) => {
    e.preventDefault();
    if (!editingStep.key || !editingStep.title) {
      toast.error("Lütfen adım anahtarını ve başlığını doldurun.");
      return;
    }
    if (!(await persistChange(() => updateLocalStep(editingStep), "Adım başarıyla kaydedildi!"))) return;
    setIsStepModalOpen(false);
    setEditingStep(null);
  };

  const handleSaveOption = async (e) => {
    e.preventDefault();
    if (!editingOption.name || !editingOption.stepKey) {
      toast.error("Lütfen parça adını ve ait olduğu adımı seçin.");
      return;
    }
    if (!(await persistChange(() => updateLocalOption(editingOption), "Parça başarıyla kaydedildi!"))) return;
    setIsOptionModalOpen(false);
    setEditingOption(null);
  };

  const handleSaveDevice = async (e) => {
    e.preventDefault();
    if (!editingDevice.name) {
      toast.error("Lütfen cihaz adını doldurun.");
      return;
    }
    if (!(await persistChange(() => updateLocalDevice(editingDevice), "Hazır model başarıyla kaydedildi!"))) return;
    setIsDeviceModalOpen(false);
    setEditingDevice(null);
  };

  const handleSaveFilterSet = async (e) => {
    e.preventDefault();
    if (!editingFilterSet.name) {
      toast.error("Lütfen filtre seti adını doldurun.");
      return;
    }
    if (!(await persistChange(() => updateLocalFilterSet(editingFilterSet), "Filtre paketi başarıyla kaydedildi!"))) return;
    setIsFilterSetModalOpen(false);
    setEditingFilterSet(null);
  };

  const handleSaveFault = async (e) => {
    e.preventDefault();
    if (!editingFault.title || !editingFault.label) {
      toast.error("Lütfen arıza başlığını doldurun.");
      return;
    }
    if (!(await persistChange(() => updateLocalFault(editingFault), "Arıza rehberi başarıyla kaydedildi!"))) return;
    setIsFaultModalOpen(false);
    setEditingFault(null);
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = await loginAdmin(emailInput.trim(), passwordInput.trim());
    setLoginLoading(false);
    if (result.success) {
      toast.success("Yönetici girişi başarılı!");
    } else {
      toast.error(result.error || "Giriş başarısız.");
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-amber-200/40 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-200/40 blur-[90px] pointer-events-none" />

        <div className="relative max-w-md w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] font-black text-2xl mb-3 shadow-md">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Lotus Yönetici Girişi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Tüm adımları, modelleri, filtre paketlerini, arıza rehberini ve siparişleri yönetmek için giriş yapın.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Yönetici E-posta Adresi</label>
              <input
                type="text"
                required
                placeholder="admin@lotussuaritma.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] text-sm font-medium transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">Yönetici Şifresi</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[hsl(var(--brand-plum))] hover:underline font-semibold"
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] text-sm font-mono transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading || !passwordInput}
              className="btn-champagne w-full rounded-xl h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {loginLoading ? "Giriş Yapılıyor..." : "Yönetim Paneline Giriş Yap"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="block font-bold text-slate-800">🔑 Varsayılan Yönetici Bilgileri:</span>
              <span>E-posta: <strong className="text-[hsl(var(--brand-plum))] font-mono font-bold">admin@lotussuaritma.com</strong></span>
              <span className="block">Şifre: <strong className="text-[hsl(var(--brand-plum))] font-mono font-bold">lotus2026</strong></span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mt-4 transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Ana Sayfaya Geri Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Siteye Dön</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] flex items-center justify-center font-extrabold text-sm shadow">
              L
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-slate-900">
              Lotus Yönetim Paneli
            </span>
            <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] ml-1 font-bold">
              Convex Reaktif
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={async () => {
              if (window.confirm("Varsayılan fabrika ayarlarına sıfırlamak istiyor musunuz?")) {
                await persistChange(resetLocalToDefault, "Tüm Convex verileri varsayılana sıfırlandı.");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-rose-300 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Sıfırla
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 hidden md:inline font-mono font-medium">
              {adminUser?.email || "admin@lotussuaritma.com"}
            </span>
            <button
              onClick={() => {
                logoutAdmin();
                toast.info("Oturum kapatıldı.");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-all shadow-xs"
              title="Yönetici Oturumunu Kapat"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: "calc(100vh - 57px)" }}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
          style={{ top: 57 }}
        >
          <div className="px-4 py-4 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Yönetim Menüsü</p>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">

            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Genel</p>

            {[
              { key: "finans", icon: TrendingUp, label: "Finans & Kâr" },
              { key: "leads", icon: MessageSquare, label: "Gelen Siparişler", count: (localData.leads || []).length },
            ].map(({ key, icon: Icon, label, count }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === key
                    ? "bg-[hsl(var(--brand-plum))] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {count != null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}

            <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Wizard İçerikleri</p>

            {[
              { key: "steps", icon: Layers, label: "1. Konfigüratör Adımları", count: localData.steps.length },
              { key: "options", icon: Package, label: "2. Parçalar & Fiyatlar", count: localData.options.length },
              { key: "devices", icon: ShoppingCart, label: "3. Hazır Cihaz Modelleri", count: (localData.devices || []).length },
              { key: "filterSets", icon: Droplets, label: "4. Filtre Paketleri", count: (localData.filterSets || []).length },
              { key: "faults", icon: Wrench, label: "5. Arıza Rehberi", count: (localData.faultGuides || []).length },
              { key: "texts", icon: FileText, label: "Metin & İçerikler" },
            ].map(({ key, icon: Icon, label, count }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === key
                    ? "bg-[hsl(var(--brand-plum))] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {count != null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}

            <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sistem</p>

            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-[hsl(var(--brand-plum))] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Genel Ayarlar</span>
            </button>
          </nav>

          {/* Sidebar footer actions */}
          <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
            <button
              onClick={async () => {
                if (window.confirm("Varsayılan fabrika ayarlarına sıfırlamak istiyor musunuz?")) {
                  await persistChange(resetLocalToDefault, "Tüm veriler varsayılana sıfırlandı.");
                }
              }}
              className="w-full flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Fabrika Ayarlarına Sıfırla
            </button>
            <button
              onClick={() => { logoutAdmin(); toast.info("Oturum kapatıldı."); }}
              className="w-full flex items-center gap-2 text-xs font-bold text-rose-700 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" /> Çıkış Yap
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Mobile: hamburger + current tab label */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
              >
                <SlidersHorizontal className="h-4 w-4" /> Menü
              </button>
              <span className="text-sm font-bold text-slate-700">
                {activeTab === "finans" && "Finans & Kâr"}
                {activeTab === "steps" && "Konfigüratör Adımları"}
                {activeTab === "options" && "Parçalar & Fiyatlar"}
                {activeTab === "devices" && "Hazır Cihaz Modelleri"}
                {activeTab === "filterSets" && "Filtre Paketleri"}
                {activeTab === "faults" && "Arıza Rehberi"}
                {activeTab === "leads" && "Gelen Siparişler"}
                {activeTab === "texts" && "Metin & İçerikler"}
                {activeTab === "settings" && "Genel Ayarlar"}
              </span>
            </div>




        {/* TAB 1: KÂRLILIK & FİNANS */}
        {activeTab === "finans" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Toplam Ciro (Satış)
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 font-mono">
                  {stats.totalRevenue.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-[11px] text-emerald-600 mt-2 block font-semibold">
                  {stats.totalLeads} toplam müşteri talebinden
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Toplam Parça Maliyeti (Alış)
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-rose-600 font-mono">
                  {stats.totalCost.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-[11px] text-slate-500 mt-2 block font-medium">
                  Toptan alış & montaj donanımları
                </span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                  Tahmini Net Kâr
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-emerald-700 font-mono">
                  +{stats.totalEstimatedProfit.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-[11px] text-emerald-700 mt-2 block font-bold">
                  Alış & indirim sonrası net kazanç
                </span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                  Ortalama Kâr Marjı
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-amber-700 font-mono">
                  %{stats.overallMargin}
                </span>
                <span className="text-[11px] text-amber-800 mt-2 block font-bold">
                  Ciro üzerinden net kârlılık
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <h3 className="font-display font-bold text-lg text-slate-900 mb-4">Parça Bazında Alış vs Satış Kâr Tablosu</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-3">Kategori / Adım</th>
                      <th className="py-3 px-3">Parça Adı</th>
                      <th className="py-3 px-3 text-right">Alış (Maliyet ₺)</th>
                      <th className="py-3 px-3 text-right">Satış (Liste ₺)</th>
                      <th className="py-3 px-3 text-right">Birim Kâr (₺)</th>
                      <th className="py-3 px-3 text-right">Kâr Marjı (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {localData.options.map((opt) => {
                      const step = localData.steps.find((s) => s.key === opt.stepKey);
                      const profit = (opt.salePrice || 0) - (opt.costPrice || 0);
                      const margin = opt.salePrice > 0 ? Math.round((profit / opt.salePrice) * 100) : 0;
                      return (
                        <tr key={opt._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 text-slate-500 text-xs">{step?.title || opt.stepKey}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                            <img src={opt.img} alt={opt.name} className="h-7 w-7 rounded-md object-cover border border-slate-200 shadow-xs" />
                            <span>{opt.name}</span>
                          </td>
                          <td className="py-3 px-3 text-right text-rose-600 font-mono font-medium">{(opt.costPrice || 0).toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right text-slate-900 font-mono font-bold">{(opt.salePrice || 0).toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right text-emerald-600 font-mono font-bold">+{profit.toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold font-mono ${margin >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                              %{margin}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KONFİGÜRATÖR ADIMLARI */}
        {activeTab === "steps" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Konfigüratör Adım Motoru</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Adımların sıralamasını değiştirin, yeni adım ekleyin veya aktif/pasif durumunu yönetin.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingStep({
                    key: `step_${Date.now()}`,
                    stepNumber: localData.steps.length + 1,
                    order: localData.steps.length + 1,
                    badge: `${localData.steps.length + 1}. Adım • Yeni Kategori`,
                    title: "Yeni Adım Başlığı",
                    description: "Kullanıcıya bu adımda ne seçeceğini açıklayan metin.",
                    icon: "Layers",
                    guideText: "Bu adım için uzman tavsiyesi ve yönlendirme metni.",
                    isActive: true,
                  });
                  setIsStepModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all"
              >
                <Plus className="h-4 w-4" /> Yeni Adım Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localData.steps.map((s) => {
                const optCount = (localData.options || []).filter((o) => o.stepKey === s.key).length;
                return (
                  <div
                    key={s._id || s.key}
                    className={`rounded-2xl border p-5 bg-white shadow-xs transition-all flex flex-col justify-between ${
                      s.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
                          {s.badge}
                        </Badge>
                        <button
                          onClick={() => updateLocalStep({ ...s, isActive: !s.isActive })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                            s.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {s.isActive ? "Aktif" : "Pasif"}
                        </button>
                      </div>

                      <h4 className="font-display font-bold text-lg text-slate-900">{s.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{s.description}</p>
                      {s.guideText && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
                          <strong>💡 Rehber Kutusu:</strong> {s.guideText}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Bu adımda <strong>{optCount} adet</strong> parça tanımlı
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingStep({ ...s });
                            setIsStepModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" /> Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${s.title}" adımını silmek istiyor musunuz?`)) {
                              deleteLocalStep(s._id);
                              toast.success("Adım silindi.");
                            }
                          }}
                          className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PARÇALAR, FİYATLAR & MODALLAR */}
        {activeTab === "options" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Parça adı veya özellik ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] w-56 sm:w-64 shadow-xs"
                  />
                </div>

                <select
                  value={selectedStepFilter}
                  onChange={(e) => setSelectedStepFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] shadow-xs font-medium"
                >
                  <option value="all">Tüm Adımlar / Kategoriler</option>
                  {localData.steps.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingOption({
                    stepKey: selectedStepFilter !== "all" ? selectedStepFilter : localData.steps[0]?.key || "kasa",
                    optionId: `opt_${Date.now()}`,
                    name: "Yeni Parça / Model",
                    costPrice: 500,
                    salePrice: 1200,
                    badge: "Yeni",
                    desc: "Kısa tanıtım açıklaması",
                    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
                    longDesc: "Büyük görsel modalında görüntülenecek detaylı tanıtım ve kullanım açıklaması.",
                    specs: ["Özellik 1: Yüksek Dayanım", "Boyut: Standart"],
                    highlights: ["1 Numaralı Dayanıklılık", "Sıfır Bakım Masrafı"],
                    order: localData.options.length + 1,
                    isActive: true,
                  });
                  setIsOptionModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Yeni Parça Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOptions.map((opt) => {
                const step = localData.steps.find((s) => s.key === opt.stepKey);
                const profit = (opt.salePrice || 0) - (opt.costPrice || 0);
                const margin = opt.salePrice > 0 ? Math.round((profit / opt.salePrice) * 100) : 0;

                return (
                  <div
                    key={opt._id || opt.optionId}
                    className={`rounded-2xl border p-4 bg-white shadow-xs transition-all flex flex-col justify-between ${
                      opt.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                        <img src={opt.img} alt={opt.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <Badge className="bg-white/90 text-slate-800 font-bold border border-slate-200 text-[10px] shadow-xs">
                            {step?.title || opt.stepKey}
                          </Badge>
                          {opt.badge && (
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] border-0">
                              {opt.badge}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-base text-slate-900">{opt.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{opt.desc}</p>

                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Alış (Maliyet)</span>
                          <span className="font-mono font-bold text-xs text-rose-600">
                            {(opt.costPrice || 0).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Satış (Liste)</span>
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {(opt.salePrice || 0).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-emerald-700 uppercase font-semibold">Kâr (%{margin})</span>
                          <span className="font-mono font-bold text-xs text-emerald-600">
                            +{profit.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => updateLocalOption({ ...opt, isActive: !opt.isActive })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          opt.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {opt.isActive ? "Satışta Aktif" : "Pasif"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingOption({
                              ...opt,
                              specs: opt.specs || [],
                              highlights: opt.highlights || [],
                            });
                            setIsOptionModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" /> Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${opt.name}" parçasını silmek istediğinize emin misiniz?`)) {
                              deleteLocalOption(opt._id);
                              toast.success("Parça silindi.");
                            }
                          }}
                          className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: HAZIR CİHAZ & MODEL KATALOĞU (SATIN ALMA AKIŞI) */}
        {activeTab === "devices" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Hazır Cihaz Kataloğu & Modeller</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  "Cihaz Satın Almak İstiyorum" akışında önerilen hazır arıtma modellerini, fiyatlarını, özelliklerini ve görsellerini yönetin.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingDevice({
                    deviceId: `device_${Date.now()}`,
                    name: "Yeni Lotus Cihaz Modeli",
                    price: "12.500 ₺",
                    costPrice: 5500,
                    salePrice: 12500,
                    tagline: "Kompakt ve yüksek verimli yeni model",
                    budgetTags: ["orta"],
                    consumptionTags: ["az", "orta"],
                    capacity: "3-4 kişilik hane",
                    warranty: "3 Yıl Garanti",
                    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
                    galleryImages: [],
                    videoUrl: "",
                    longDescription: "",
                    specs: [],
                    includedItems: [],
                    maintenanceInfo: "",
                    recommendationReason: "",
                    certifications: [],
                    features: ["5 aşamalı RO filtrasyon", "Antibakteriyel tank", "Paslanmaz musluk"],
                    order: (localData.devices || []).length + 1,
                    isActive: true,
                  });
                  setIsDeviceModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Yeni Cihaz Modeli Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((dev) => (
                <div
                  key={dev._id || dev.deviceId || dev.id}
                  className={`rounded-2xl border p-4 bg-white shadow-xs transition-all flex flex-col justify-between ${
                    dev.isActive !== false ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                      <img src={dev.img} alt={dev.name} className="h-full w-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[hsl(var(--brand-plum))] text-white font-bold text-[10px] shadow">
                          {dev.warranty || "2 Yıl Garanti"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-display font-bold text-base text-slate-900">{dev.name}</h4>
                      <span className="font-mono font-bold text-base text-[hsl(var(--brand-plum))]">
                        {dev.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{dev.tagline}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {dev.features?.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => updateLocalDevice({ ...dev, isActive: dev.isActive === false ? true : false })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        dev.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {dev.isActive !== false ? "Satışta Aktif" : "Pasif"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingDevice({
                            ...dev,
                            features: dev.features || [],
                            galleryImages: dev.galleryImages || [],
                            specs: dev.specs || [],
                            includedItems: dev.includedItems || [],
                            certifications: dev.certifications || [],
                            budgetTags: dev.budgetTags || ["orta"],
                            consumptionTags: dev.consumptionTags || ["orta"],
                          });
                          setIsDeviceModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" /> Düzenle
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${dev.name}" cihazını silmek istediğinize emin misiniz?`)) {
                            deleteLocalDevice(dev._id || dev.deviceId || dev.id);
                            toast.success("Cihaz silindi.");
                          }
                        }}
                        className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FİLTRE DEĞİŞİM PAKETLERİ */}
        {activeTab === "filterSets" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Filtre Değişim Paketleri</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  "Filtre Değiştirmek İstiyorum" akışında önerilen filtre setlerini, görsellerini, fiyatlarını ve içeriklerini yönetin.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFilterSet({
                    setId: `set_${Date.now()}`,
                    name: "Yeni Filtre Seti Paketi",
                    subtitle: "Ön Filtreler + Membran",
                    recommendedFor: "Periyodik Değişim",
                    matchKey: "1yil",
                    price: "1.250 ₺",
                    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
                    desc: "Detaylı filtre seti açıklaması.",
                    includes: ["1. Aşama Sediment", "2. Aşama Blok Karbon", "3. Aşama Membran"],
                    benefits: ["Klor ve kireç arıtımı", "Taze tatlı su"],
                    order: (localData.filterSets || []).length + 1,
                    isActive: true,
                  });
                  setIsFilterSetModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Yeni Filtre Paketi Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFilterSets.map((fs) => (
                <div
                  key={fs._id || fs.setId || fs.id}
                  className={`rounded-2xl border p-5 bg-white shadow-xs transition-all flex flex-col justify-between ${
                    fs.isActive !== false ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                      <img src={fs.img} alt={fs.name} className="h-full w-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                          {fs.recommendedFor}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">{fs.name}</h4>
                      <span className="font-mono font-bold text-lg text-[hsl(var(--brand-plum))]">
                        {fs.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{fs.desc}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="block text-[11px] font-bold text-slate-700 uppercase">Paket İçeriği:</span>
                      {fs.includes?.map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => updateLocalFilterSet({ ...fs, isActive: fs.isActive === false ? true : false })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        fs.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {fs.isActive !== false ? "Aktif" : "Pasif"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingFilterSet({
                            ...fs,
                            includes: fs.includes || [],
                            benefits: fs.benefits || [],
                          });
                          setIsFilterSetModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" /> Düzenle
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${fs.name}" paketini silmek istediğinize emin misiniz?`)) {
                            deleteLocalFilterSet(fs._id || fs.setId || fs.id);
                            toast.success("Filtre paketi silindi.");
                          }
                        }}
                        className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ARIZA REHBERİ & ÇÖZÜMLER */}
        {activeTab === "faults" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Arıza Rehberi & Uzman Tavsiyeleri</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Arıza tiplerini, arıza seçildiğinde çıkan 💡 Uzman Tavsiyesi metnini ve ilk müdahale adımlarını buradan yönetin.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFault({
                    faultId: `fault_${Date.now()}`,
                    label: "Yeni Arıza Tipi",
                    title: "Arıza Başlığı & Detayı",
                    body: "Bu arızanın teknik sebebi ve uzman tavsiyesi açıklaması.",
                    tips: [
                      "Ana besleme vanasını kapatın.",
                      "Cihazın fişini prizden çekin.",
                    ],
                    order: (localData.faultGuides || []).length + 1,
                    isActive: true,
                  });
                  setIsFaultModalOpen(true);
                }}
                className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Yeni Arıza Rehberi Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaults.map((fault) => (
                <div
                  key={fault._id || fault.faultId}
                  className={`rounded-2xl border p-5 bg-white shadow-xs transition-all flex flex-col justify-between ${
                    fault.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                        {fault.label}
                      </Badge>
                      <button
                        onClick={() => updateLocalFault({ ...fault, isActive: !fault.isActive })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          fault.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {fault.isActive ? "Aktif" : "Pasif"}
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">{fault.title}</h4>

                    <div className="mt-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <strong className="block text-amber-900 font-bold">💡 Uzman Tavsiyesi & Neden:</strong>
                      <p className="leading-relaxed text-slate-700">{fault.body}</p>
                    </div>

                    {fault.tips && fault.tips.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <span className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                          🛠️ Servis Gelene Kadar Yapılacaklar ({fault.tips.length} Adım):
                        </span>
                        <div className="space-y-1">
                          {fault.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingFault({
                          ...fault,
                          tips: fault.tips || [],
                        });
                        setIsFaultModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold transition-all"
                    >
                      <Edit className="h-3.5 w-3.5" /> Düzenle
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`"${fault.title}" arıza kaydını silmek istediğinize emin misiniz?`)) {
                          deleteLocalFault(fault._id);
                          toast.success("Arıza rehberi silindi.");
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: GELEN SİPARİŞLER (LEADS) */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Müşteri, telefon veya ilçe ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] w-56 sm:w-64 shadow-xs"
                  />
                </div>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] shadow-xs font-medium"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="new">Yeni Talep</option>
                  <option value="called">Arandı</option>
                  <option value="appointment">Randevu Verildi</option>
                  <option value="completed">Montaj Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Toplam <strong>{filteredLeads.length}</strong> talep listeleniyor
              </span>
            </div>

            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white">
                  <MessageSquare className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">Henüz talep bulunmuyor</h4>
                  <p className="text-xs text-slate-500 mt-1">Siteden form doldurulduğunda talepler burada anında görünecektir.</p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const statusColors = {
                    new: "bg-sky-50 text-sky-800 border-sky-200",
                    called: "bg-amber-50 text-amber-800 border-amber-200",
                    appointment: "bg-purple-50 text-purple-800 border-purple-200",
                    completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    cancelled: "bg-rose-50 text-rose-800 border-rose-200",
                  };

                  return (
                    <div
                      key={lead._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col lg:flex-row gap-5 justify-between"
                    >
                      <div className="space-y-2 lg:max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-slate-900">{lead.fullName}</span>
                          <Badge className={`text-[10px] font-bold border ${statusColors[lead.status] || "bg-slate-100"}`}>
                            {lead.status === "new"
                              ? "Yeni"
                              : lead.status === "called"
                              ? "Arandı"
                              : lead.status === "appointment"
                              ? "Randevu Verildi"
                              : lead.status === "completed"
                              ? "Tamamlandı"
                              : "İptal"}
                          </Badge>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline font-mono font-bold"
                            >
                              {lead.phone} (WhatsApp)
                            </a>
                          </div>
                          <div>
                            📍 <strong>{lead.district}</strong>, {lead.city}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            🕒 {new Date(lead.createdAt).toLocaleString("tr-TR")}
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Durumu Güncelle</label>
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              updateLocalLeadStatus(lead._id, e.target.value);
                              toast.success("Talep durumu güncellendi.");
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                          >
                            <option value="new">Yeni Talep</option>
                            <option value="called">Arandı / Bilgi Verildi</option>
                            <option value="appointment">Montaj Randevusu Verildi</option>
                            <option value="completed">Montaj & Teslim Tamamlandı</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-[hsl(var(--brand-plum))] uppercase tracking-wider block mb-2">
                            {lead.flowType === "builder" ? "🛠️ Özel Toplanan Cihaz Parçaları" : "📦 Talep Detayı"}
                          </span>

                          {lead.selectedItems && lead.selectedItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              {lead.selectedItems.map((item, i) => (
                                <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                                  <span className="block text-[10px] text-slate-500 font-medium">{item.stepTitle}</span>
                                  <span className="font-bold text-slate-900 truncate block">{item.name}</span>
                                  <span className="font-mono text-[11px] text-slate-600 font-semibold">
                                    {item.salePrice.toLocaleString("tr-TR")} ₺
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600 font-medium">{lead.itemName || "Lotus Su Arıtma Cihaz Talebi"}</p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                          <div>
                            <span className="block text-[10px] text-slate-500">Liste Tutarı</span>
                            <span className="font-mono line-through text-slate-400">
                              {(lead.totalListPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-amber-700 font-bold">%20 İndirimli Satış</span>
                            <span className="font-mono font-extrabold text-slate-900 text-sm">
                              {(lead.finalDiscountedPrice || lead.totalListPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-rose-600 font-bold">Toplam Maliyet</span>
                            <span className="font-mono text-rose-600 font-bold">
                              {(lead.totalCostPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-700 font-bold">Net Kâr (%{lead.profitMarginPercent || 0})</span>
                            <span className="font-mono font-extrabold text-emerald-700 text-sm">
                              +{(lead.estimatedProfit || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 8: METİN & İÇERİKLER */}
        {activeTab === "texts" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await persistChange(
                () => updateLocalTexts(textsForm),
                "Metin ve içerikler başarıyla kaydedildi!"
              );
            }}
            className="space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">Metin & İçerik Yönetimi</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Giriş ekranı ve çözüm akışlarında müşterinin gördüğü soru, seçenek ve buton metinlerini buradan yönetin.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 btn-champagne px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm shrink-0"
              >
                <Save className="h-4 w-4" /> Tüm Metinleri Kaydet
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {TEXT_CONTENT_SECTIONS.map((section) => (
                <section key={section.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-display font-bold text-base text-slate-900">{section.title}</h3>
                    {section.description && <p className="text-[11px] text-slate-500 mt-0.5">{section.description}</p>}
                  </div>

                  <div className="space-y-3">
                    {section.fields.map(([path, label, type = "text"]) => {
                      const value = getNestedValue(textsForm, path);
                      return (
                        <div key={path}>
                          <label className="block text-xs text-slate-700 font-bold mb-1">{label}</label>
                          {type === "textarea" ? (
                            <textarea
                              rows={2}
                              value={value}
                              onChange={(e) => setTextsForm((prev) => setNestedValue(prev, path, e.target.value))}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] resize-y text-sm leading-relaxed"
                            />
                          ) : type === "icon" ? (
                            <select
                              value={value}
                              onChange={(e) => setTextsForm((prev) => setNestedValue(prev, path, e.target.value))}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] text-sm"
                            >
                              {ENTRY_ICON_OPTIONS.map(([iconValue, iconLabel]) => (
                                <option key={iconValue} value={iconValue}>{iconLabel}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setTextsForm((prev) => setNestedValue(prev, path, e.target.value))}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] text-sm"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="sticky bottom-4 flex justify-end pointer-events-none">
              <button
                type="submit"
                className="pointer-events-auto inline-flex items-center gap-2 btn-champagne px-7 py-3 rounded-xl font-bold text-sm shadow-lg"
              >
                <Save className="h-4 w-4" /> Tüm Metinleri Kaydet
              </button>
            </div>
          </form>
        )}

        {/* TAB 9: GENEL AYARLAR */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs animate-in fade-in duration-200">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Genel Site & Fiyatlandırma Ayarları</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                WhatsApp numarası, baz montaj bedeli ve indirim kancası oranlarını buradan güncelleyin.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await persistChange(
                  () => updateLocalSettings(settingsForm),
                  "Ayarlar başarıyla kaydedildi!"
                );
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Marka Adı</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Sipariş Numarası (Uluslararası)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    placeholder="905550000000"
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Görünen Metin</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappDisplay}
                    placeholder="+90 (555) 000 00 00"
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Baz Donanım & Montaj Satış Bedeli (₺)</label>
                  <input
                    type="number"
                    value={settingsForm.basePrice}
                    onChange={(e) => setSettingsForm({ ...settingsForm, basePrice: Number(e.target.value) })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Baz Donanım Toptan Alış Maliyeti (₺)</label>
                  <input
                    type="number"
                    value={settingsForm.baseCost}
                    onChange={(e) => setSettingsForm({ ...settingsForm, baseCost: Number(e.target.value) })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-rose-600 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">İndirim Rozeti Metni</label>
                <input
                  type="text"
                  value={settingsForm.discountBadgeText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, discountBadgeText: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 btn-champagne px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-all"
                >
                  <Save className="h-4 w-4" /> Ayarları Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
          </div>
        </main>
      </div>

      {/* MODAL 1: STEP ADD / EDIT */}
      {isStepModalOpen && editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl text-slate-900">
                {editingStep._id ? "Adımı Düzenle" : "Yeni Konfigüratör Adımı"}
              </h3>
              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Adım Rozet Metni</label>
                <input
                  type="text"
                  required
                  placeholder="1. Adım • Dış Gövde & Kasa"
                  value={editingStep.badge}
                  onChange={(e) => setEditingStep({ ...editingStep, badge: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adım Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Kasa Tipinizi Seçin"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adım Açıklama Metni</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tezgah altınızın alanına ve estetik tercihinize..."
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Özel Rehber / Uzman Tavsiyesi Metni</label>
                <input
                  type="text"
                  placeholder="Örn: Mutfak dolabınızda dar alan varsa kapalı kasa önerilir..."
                  value={editingStep.guideText || ""}
                  onChange={(e) => setEditingStep({ ...editingStep, guideText: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStepModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 btn-champagne px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  <Save className="h-4 w-4" /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PARÇA & MODAL ZENGİN EDİTÖRÜ */}
      {isOptionModalOpen && editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  {editingOption._id ? "Parçayı & Modalı Düzenle" : "Yeni Parça & Modal Oluştur"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Alış/Satış fiyatı, kârlılık ve büyük görsel modal detayları.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOptionModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOption} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ait Olduğu Adım / Kategori</label>
                  <select
                    value={editingOption.stepKey}
                    onChange={(e) => setEditingOption({ ...editingOption, stepKey: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-medium"
                  >
                    {localData.steps.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title} ({s.key})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Parça / Model Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 5'li PLATINUM PLUS DIAMOND"
                    value={editingOption.name}
                    onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-rose-600 font-bold mb-1">Alış / Toptan Maliyet (₺)</label>
                  <input
                    type="number"
                    required
                    value={editingOption.costPrice}
                    onChange={(e) => setEditingOption({ ...editingOption, costPrice: Number(e.target.value) })}
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-rose-600 w-full focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Satış / Liste Fiyatı (₺)</label>
                  <input
                    type="number"
                    required
                    value={editingOption.salePrice}
                    onChange={(e) => setEditingOption({ ...editingOption, salePrice: Number(e.target.value) })}
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col justify-center text-center p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Birim Kâr & Marj</span>
                  <span className="font-mono font-black text-sm text-emerald-700">
                    +{(editingOption.salePrice - editingOption.costPrice).toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    %{editingOption.salePrice > 0 ? Math.round(((editingOption.salePrice - editingOption.costPrice) / editingOption.salePrice) * 100) : 0} Marj
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Büyük HD Görsel"
                    value={editingOption.img}
                    onChange={(img) => setEditingOption({ ...editingOption, img })}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rozet (Badge - Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="En Çok Tercih Edilen"
                    value={editingOption.badge || ""}
                    onChange={(e) => setEditingOption({ ...editingOption, badge: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kart Üzeri Kısa Açıklama</label>
                <input
                  type="text"
                  required
                  placeholder="Kullanıcı ilk baktığında göreceği 1 satırlık özet..."
                  value={editingOption.desc}
                  onChange={(e) => setEditingOption({ ...editingOption, desc: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div>
                <label className="block text-[hsl(var(--brand-plum))] font-bold mb-1">🔎 Modal Detaylı Açıklama Paragrafı</label>
                <textarea
                  rows={3}
                  placeholder="Modal açıldığında müşteriye ürünün tüm detaylarını anlatan zengin paragraf..."
                  value={editingOption.longDesc || ""}
                  onChange={(e) => setEditingOption({ ...editingOption, longDesc: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] resize-none leading-relaxed"
                />
              </div>

              {/* Specs Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">📊 Modal Teknik Özellik Maddeleri</label>
                  <button
                    type="button"
                    onClick={() => setEditingOption({ ...editingOption, specs: [...(editingOption.specs || []), "Yeni Özellik: Değer"] })}
                    className="text-[11px] text-[hsl(var(--brand-plum))] hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-3 w-3" /> Madde Ekle
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingOption.specs || []).map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => {
                          const updated = [...editingOption.specs];
                          updated[sIdx] = e.target.value;
                          setEditingOption({ ...editingOption, specs: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingOption.specs.filter((_, i) => i !== sIdx);
                          setEditingOption({ ...editingOption, specs: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg bg-rose-50 border border-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-emerald-800 font-bold">✨ Modal Öne Çıkan Avantaj Maddeleri</label>
                  <button
                    type="button"
                    onClick={() => setEditingOption({ ...editingOption, highlights: [...(editingOption.highlights || []), "Yeni Avantaj"] })}
                    className="text-[11px] text-emerald-700 hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-3 w-3" /> Madde Ekle
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingOption.highlights || []).map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => {
                          const updated = [...editingOption.highlights];
                          updated[hIdx] = e.target.value;
                          setEditingOption({ ...editingOption, highlights: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 text-xs w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingOption.highlights.filter((_, i) => i !== hIdx);
                          setEditingOption({ ...editingOption, highlights: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg bg-rose-50 border border-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 btn-champagne px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  <Save className="h-4 w-4" /> Parçayı & Modalı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: HAZIR CİHAZ MODELİ EDİTÖRÜ */}
      {isDeviceModalOpen && editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  {editingDevice._id ? "Hazır Modeli Düzenle" : "Yeni Hazır Model Ekle"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Satın alma akışında önerilecek hazır arıtma cihazı.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeviceModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Model Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Lotus Smart RO-7"
                    value={editingDevice.name}
                    onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Önerilen Kapasite</label>
                  <input
                    type="text"
                    placeholder="Örn: 3-5 kişilik hane"
                    value={editingDevice.capacity || ""}
                    onChange={(e) => setEditingDevice({ ...editingDevice, capacity: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Görünen Fiyat Metni</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 18.900 ₺"
                    value={editingDevice.price}
                    onChange={(e) => setEditingDevice({ ...editingDevice, price: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Slogan / Kısa Açıklama</label>
                  <input
                    type="text"
                    placeholder="Örn: 7 aşamalı arıtma + dahili pompa"
                    value={editingDevice.tagline || ""}
                    onChange={(e) => setEditingDevice({ ...editingDevice, tagline: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Garanti Süresi</label>
                  <input
                    type="text"
                    placeholder="Örn: 3 Yıl Garanti"
                    value={editingDevice.warranty || ""}
                    onChange={(e) => setEditingDevice({ ...editingDevice, warranty: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Ana Cihaz Görseli"
                value={editingDevice.img}
                onChange={(img) => setEditingDevice({ ...editingDevice, img })}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800">📷 Detay Galerisi</h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">Kurulum, iç filtre ve ölçü görsellerinden en fazla 5 adet ekleyin.</p>
                  </div>
                  <button
                    type="button"
                    disabled={(editingDevice.galleryImages || []).length >= 5}
                    onClick={() => setEditingDevice({ ...editingDevice, galleryImages: [...(editingDevice.galleryImages || []), ""] })}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-[hsl(var(--brand-plum))] shadow-xs disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" /> Fotoğraf Alanı Ekle
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {(editingDevice.galleryImages || []).map((image, imageIndex) => (
                    <ImageUploadField
                      key={imageIndex}
                      label={`Galeri Görseli ${imageIndex + 1}`}
                      value={image}
                      onChange={(nextImage) => {
                        const updated = [...(editingDevice.galleryImages || [])];
                        if (nextImage) updated[imageIndex] = nextImage;
                        else updated.splice(imageIndex, 1);
                        setEditingDevice({ ...editingDevice, galleryImages: updated });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">🎬 Tanıtım Videosu Bağlantısı</label>
                <input
                  type="url"
                  placeholder="YouTube, Vimeo veya doğrudan MP4/WebM bağlantısı"
                  value={editingDevice.videoUrl || ""}
                  onChange={(event) => setEditingDevice({ ...editingDevice, videoUrl: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detaylı Cihaz Açıklaması</label>
                  <textarea
                    rows={5}
                    placeholder="Cihazın çalışma biçimi, kullanım amacı ve farkları..."
                    value={editingDevice.longDescription || ""}
                    onChange={(event) => setEditingDevice({ ...editingDevice, longDescription: event.target.value })}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Neden Öneriliyor?</label>
                  <textarea
                    rows={5}
                    placeholder="Hangi hane, su koşulu veya kullanım tipi için uygun?"
                    value={editingDevice.recommendationReason || ""}
                    onChange={(event) => setEditingDevice({ ...editingDevice, recommendationReason: event.target.value })}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bakım ve Filtre Değişim Bilgisi</label>
                <textarea
                  rows={3}
                  placeholder="Önerilen bakım sıklığı ve müşterinin bilmesi gereken servis bilgileri..."
                  value={editingDevice.maintenanceInfo || ""}
                  onChange={(event) => setEditingDevice({ ...editingDevice, maintenanceInfo: event.target.value })}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <StringListEditor
                  label="✨ Öne Çıkan Özellikler"
                  values={editingDevice.features || []}
                  onChange={(features) => setEditingDevice({ ...editingDevice, features })}
                  placeholder="Yeni özellik"
                />
                <StringListEditor
                  label="📊 Teknik Özellikler"
                  values={editingDevice.specs || []}
                  onChange={(specs) => setEditingDevice({ ...editingDevice, specs })}
                  placeholder="Örn: Ölçüler: 40 × 25 × 42 cm"
                />
                <StringListEditor
                  label="📦 Pakete / Montaja Dahil"
                  values={editingDevice.includedItems || []}
                  onChange={(includedItems) => setEditingDevice({ ...editingDevice, includedItems })}
                  placeholder="Yeni dahil ürün veya hizmet"
                />
                <StringListEditor
                  label="🛡️ Sertifikalar ve Güvenceler"
                  values={editingDevice.certifications || []}
                  onChange={(certifications) => setEditingDevice({ ...editingDevice, certifications })}
                  placeholder="Yeni sertifika veya güvence"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeviceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 btn-champagne px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  <Save className="h-4 w-4" /> Cihaz Modelini Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: FİLTRE PAKETİ EDİTÖRÜ */}
      {isFilterSetModalOpen && editingFilterSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  {editingFilterSet._id ? "Filtre Paketini Düzenle" : "Yeni Filtre Paketi Ekle"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Filtre değişim akışında önerilecek paket ve içerikleri.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSetModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFilterSet} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Paket Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 5'li Tam Kapsamlı Orijinal Filtre Seti"
                    value={editingFilterSet.name}
                    onChange={(e) => setEditingFilterSet({ ...editingFilterSet, name: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fiyat Metni</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 1.850 ₺"
                    value={editingFilterSet.price}
                    onChange={(e) => setEditingFilterSet({ ...editingFilterSet, price: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alt Başlık</label>
                  <input
                    type="text"
                    placeholder="Örn: 3 Ön Filtre + Membran + Tatlandırıcı"
                    value={editingFilterSet.subtitle || ""}
                    onChange={(e) => setEditingFilterSet({ ...editingFilterSet, subtitle: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Önerilen Değişim Periyodu</label>
                  <input
                    type="text"
                    placeholder="Örn: Son değişim ~1 yıl önce"
                    value={editingFilterSet.recommendedFor || ""}
                    onChange={(e) => setEditingFilterSet({ ...editingFilterSet, recommendedFor: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="HD Filtre Paketi Görseli"
                value={editingFilterSet.img}
                onChange={(img) => setEditingFilterSet({ ...editingFilterSet, img })}
              />

              <div>
                <label className="block text-slate-700 font-bold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  placeholder="Paketin sağladığı fayda ve kullanım alanı..."
                  value={editingFilterSet.desc || ""}
                  onChange={(e) => setEditingFilterSet({ ...editingFilterSet, desc: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] resize-none"
                />
              </div>

              {/* Includes Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">📦 Paket İçeriğindeki Filtreler</label>
                  <button
                    type="button"
                    onClick={() => setEditingFilterSet({ ...editingFilterSet, includes: [...(editingFilterSet.includes || []), "Yeni Filtre Aşaması"] })}
                    className="text-[11px] text-[hsl(var(--brand-plum))] hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-3 w-3" /> Filtre Ekle
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingFilterSet.includes || []).map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inc}
                        onChange={(e) => {
                          const updated = [...editingFilterSet.includes];
                          updated[iIdx] = e.target.value;
                          setEditingFilterSet({ ...editingFilterSet, includes: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingFilterSet.includes.filter((_, i) => i !== iIdx);
                          setEditingFilterSet({ ...editingFilterSet, includes: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg bg-rose-50 border border-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFilterSetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 btn-champagne px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  <Save className="h-4 w-4" /> Filtre Paketini Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ARIZA REHBERİ EDİTÖRÜ */}
      {isFaultModalOpen && editingFault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  {editingFault._id ? "Arıza Rehberini & Çözümü Düzenle" : "Yeni Arıza Rehberi Oluştur"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Arıza başlığı, 💡 Uzman Tavsiyesi açıklaması ve ilk müdahale adımları.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFaultModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFault} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Arıza Seçim Butonu Başlığı (Kısa)</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Sızıntı var"
                    value={editingFault.label}
                    onChange={(e) => setEditingFault({ ...editingFault, label: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Detaylı Arıza Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Cihaz altında veya hortumda su birikiyor"
                    value={editingFault.title}
                    onChange={(e) => setEditingFault({ ...editingFault, title: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">
                  💡 Uzman Tavsiyesi & Arıza Nedeni (Seçimden sonraki sayfada görünecektir)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Gözle görülür su birikintisi, genellikle hızlı bağlantı rekorlarının o-ring aşınmasından kaynaklanır..."
                  value={editingFault.body}
                  onChange={(e) => setEditingFault({ ...editingFault, body: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">🛠️ Servis Gelene Kadar Yapılması Gereken İlk Adımlar</label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingFault({
                        ...editingFault,
                        tips: [...(editingFault.tips || []), "Yeni ilk müdahale adımı"],
                      })
                    }
                    className="text-[11px] text-[hsl(var(--brand-plum))] hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-3 w-3" /> Adım Ekle
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingFault.tips || []).map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => {
                          const updated = [...editingFault.tips];
                          updated[tIdx] = e.target.value;
                          setEditingFault({ ...editingFault, tips: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingFault.tips.filter((_, i) => i !== tIdx);
                          setEditingFault({ ...editingFault, tips: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg bg-rose-50 border border-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaultModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 btn-champagne px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  <Save className="h-4 w-4" /> Arıza Rehberini Kaydet
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

