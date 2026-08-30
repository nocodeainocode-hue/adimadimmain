import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { useLocalData } from "@/lib/convex";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
    updateLocalSettings,
    updateLocalLeadStatus,
    resetLocalToDefault,
  } = useLocalData();

  // Login Form States
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("finans"); // "finans" | "steps" | "options" | "leads" | "settings"
  const [selectedStepFilter, setSelectedStepFilter] = useState("all");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Form States
  const [editingStep, setEditingStep] = useState(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);

  const [editingOption, setEditingOption] = useState(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Settings Local Form State
  const [settingsForm, setSettingsForm] = useState(localData.settings);

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
    return localData.options.filter((opt) => {
      const matchStep = selectedStepFilter === "all" || opt.stepKey === selectedStepFilter;
      const matchSearch =
        !searchTerm ||
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStep && matchSearch;
    });
  }, [localData.options, selectedStepFilter, searchTerm]);

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

  // Step Handlers
  const handleSaveStep = (e) => {
    e.preventDefault();
    if (!editingStep.key || !editingStep.title) {
      toast.error("Lütfen adım anahtarını ve başlığını doldurun.");
      return;
    }
    updateLocalStep(editingStep);
    toast.success("Adım başarıyla kaydedildi!");
    setIsStepModalOpen(false);
    setEditingStep(null);
  };

  // Option Handlers
  const handleSaveOption = (e) => {
    e.preventDefault();
    if (!editingOption.name || !editingOption.stepKey) {
      toast.error("Lütfen parça adını ve ait olduğu adımı seçin.");
      return;
    }
    updateLocalOption(editingOption);
    toast.success("Parça başarıyla kaydedildi!");
    setIsOptionModalOpen(false);
    setEditingOption(null);
  };

  // Handle Admin Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = loginAdmin(emailInput.trim(), passwordInput.trim());
    setLoginLoading(false);
    if (result.success) {
      toast.success("Yönetici girişi başarılı!");
    } else {
      toast.error(result.error || "Giriş başarısız.");
    }
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[hsl(var(--brand-champagne)/0.12)] blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-md w-full rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Top Logo & Title */}
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--brand-champagne))] text-neutral-950 font-black text-2xl mb-3 shadow-lg">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Lotus Yönetici Girişi
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Fiyatlandırma, adım motoru, kârlılık takibi ve siparişleri yönetmek için giriş yapın.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">Yönetici E-posta Adresi</label>
              <input
                type="text"
                required
                placeholder="admin@lotussuaritma.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-neutral-300 font-bold">Yönetici Şifresi</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-amber-400 hover:underline"
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
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading || !passwordInput}
              className="btn-champagne w-full rounded-xl h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {loginLoading ? "Giriş Yapılıyor..." : "Yönetim Paneline Giriş Yap"}
            </button>
          </form>

          {/* Hint / Demo Credentials Box */}
          <div className="pt-2 border-t border-neutral-800/80 text-center">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <span className="block font-semibold text-neutral-300">🔑 Varsayılan Yönetici Bilgileri:</span>
              <span>E-posta: <strong className="text-amber-300 font-mono">admin@lotussuaritma.com</strong></span>
              <span className="block">Şifre: <strong className="text-amber-300 font-mono">lotus2026</strong></span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mt-4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Ana Sayfaya Geri Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/70 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-neutral-800/80 px-2.5 py-1.5 rounded-lg border border-neutral-700/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Siteye Dön</span>
          </Link>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-[hsl(var(--brand-champagne))] text-neutral-950 flex items-center justify-center font-extrabold text-sm shadow">
              L
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-white">
              Lotus Yönetim Paneli
            </span>
            <Badge className="bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] ml-1">
              Convex Reaktif
            </Badge>
          </div>
        </div>

        {/* Global Quick Action & User Auth */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (window.confirm("Varsayılan fabrika ayarlarına sıfırlamak istiyor musunuz?")) {
                resetLocalToDefault();
                toast.success("Tüm veriler varsayılana sıfırlandı.");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-rose-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg hover:border-rose-500/40 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Sıfırla
          </button>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          {/* Logged in User & Logout */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 hidden md:inline font-mono">
              {adminUser?.email || "admin@lotussuaritma.com"}
            </span>
            <button
              onClick={() => {
                logoutAdmin();
                toast.info("Oturum kapatıldı.");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              title="Yönetici Oturumunu Kapat"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800/80 text-sm">
          <button
            onClick={() => setActiveTab("finans")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === "finans"
                ? "bg-[hsl(var(--brand-champagne))] text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <TrendingUp className="h-4 w-4" /> Kârlılık & Finans
          </button>

          <button
            onClick={() => setActiveTab("steps")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === "steps"
                ? "bg-[hsl(var(--brand-champagne))] text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Layers className="h-4 w-4" /> Konfigüratör Adımları ({localData.steps.length})
          </button>

          <button
            onClick={() => setActiveTab("options")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === "options"
                ? "bg-[hsl(var(--brand-champagne))] text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Package className="h-4 w-4" /> Parçalar, Fiyatlar & Modallar ({localData.options.length})
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === "leads"
                ? "bg-[hsl(var(--brand-champagne))] text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Gelen Sipariş & Talepler ({(localData.leads || []).length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-[hsl(var(--brand-champagne))] text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Settings className="h-4 w-4" /> Genel Ayarlar
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: KÂRLILIK & FİNANS DASHBOARD                        */}
        {/* ========================================================= */}
        {activeTab === "finans" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Toplam Ciro (Satış)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-white font-mono">
                    {stats.totalRevenue.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-2 block font-medium">
                  {stats.totalLeads} toplam müşteri talebinden
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Toplam Parça Maliyeti (Alış)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-rose-400 font-mono">
                    {stats.totalCost.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 mt-2 block">
                  Toptan alış & montaj donanımları
                </span>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Tahmini Net Kâr
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-emerald-300 font-mono">
                    +{stats.totalEstimatedProfit.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400/80 mt-2 block font-semibold">
                  Alış & indirim sonrası net kazanç
                </span>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Ortalama Kâr Marjı
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-amber-300 font-mono">
                    %{stats.overallMargin}
                  </span>
                </div>
                <span className="text-[11px] text-amber-400/80 mt-2 block font-semibold">
                  Ciro üzerinden net kârlılık
                </span>
              </div>
            </div>

            {/* Parça Bazında Kârlılık Özeti Tablosu */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Parça Bazında Alış vs Satış Kâr Tablosu</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Her parçanın toptan alış fiyatı, müşteriye satış fiyatı ve parça başına brüt kârı.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Kategori / Adım</th>
                      <th className="pb-3 px-3">Parça Adı</th>
                      <th className="pb-3 px-3 text-right">Alış (Maliyet ₺)</th>
                      <th className="pb-3 px-3 text-right">Satış (Liste ₺)</th>
                      <th className="pb-3 px-3 text-right">Birim Kâr (₺)</th>
                      <th className="pb-3 px-3 text-right">Kâr Marjı (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-medium">
                    {localData.options.map((opt) => {
                      const step = localData.steps.find((s) => s.key === opt.stepKey);
                      const profit = (opt.salePrice || 0) - (opt.costPrice || 0);
                      const margin = opt.salePrice > 0 ? Math.round((profit / opt.salePrice) * 100) : 0;
                      return (
                        <tr key={opt._id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 px-3 text-neutral-400 text-xs">{step?.title || opt.stepKey}</td>
                          <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                            <img src={opt.img} alt={opt.name} className="h-7 w-7 rounded-md object-cover border border-neutral-700" />
                            <span>{opt.name}</span>
                          </td>
                          <td className="py-3 px-3 text-right text-rose-400 font-mono">{(opt.costPrice || 0).toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right text-neutral-200 font-mono font-bold">{(opt.salePrice || 0).toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-mono font-bold">+{profit.toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold font-mono ${margin >= 50 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
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

        {/* ========================================================= */}
        {/* TAB 2: KONFİGÜRATÖR ADIMLARI (DİNAMİK ADIM MOTORU)          */}
        {/* ========================================================= */}
        {activeTab === "steps" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-xl text-white">Konfigüratör Adım Motoru</h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
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
                    isActive: true,
                  });
                  setIsStepModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-[hsl(var(--brand-champagne))] text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all"
              >
                <Plus className="h-4 w-4" /> Yeni Adım Ekle
              </button>
            </div>

            {/* Steps List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localData.steps.map((s, idx) => {
                const optCount = localData.options.filter((o) => o.stepKey === s.key).length;
                return (
                  <div
                    key={s._id || s.key}
                    className={`rounded-2xl border p-5 bg-neutral-900/60 backdrop-blur-sm transition-all flex flex-col justify-between ${
                      s.isActive ? "border-neutral-800" : "border-neutral-800/40 opacity-60 bg-neutral-950"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-neutral-800 text-amber-300 border border-neutral-700 text-xs font-bold">
                          {s.badge}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateLocalStep({ ...s, isActive: !s.isActive })}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                              s.isActive
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-neutral-800 text-neutral-400 border-neutral-700"
                            }`}
                          >
                            {s.isActive ? "Aktif" : "Pasif"}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-lg text-white">{s.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{s.description}</p>
                      {s.guideText && (
                        <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                          <strong>Rehber Kutusu:</strong> {s.guideText}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-medium">
                        Bu adımda <strong>{optCount} adet</strong> parça/seçenek tanımlı
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingStep({ ...s });
                            setIsStepModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" /> Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${s.title}" adımını ve altındaki tüm seçenekleri silmek istiyor musunuz?`)) {
                              deleteLocalStep(s._id);
                              toast.success("Adım silindi.");
                            }
                          }}
                          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 px-2.5 py-1.5 rounded-lg transition-all"
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

        {/* ========================================================= */}
        {/* TAB 3: PARÇALAR, FİYATLAR & MODALLAR                      */}
        {/* ========================================================= */}
        {activeTab === "options" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Parça adı veya özellik ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 w-56 sm:w-64"
                  />
                </div>

                <select
                  value={selectedStepFilter}
                  onChange={(e) => setSelectedStepFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
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
                    specs: ["Özellik 1: Yüksek Dayanım", "Boyut: Standart", "Kullanım: Tezgah Altı"],
                    highlights: ["1 Numaralı Dayanıklılık", "Sıfır Bakım Masrafı"],
                    order: localData.options.length + 1,
                    isActive: true,
                  });
                  setIsOptionModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-[hsl(var(--brand-champagne))] text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="h-4 w-4" /> Yeni Parça Ekle
              </button>
            </div>

            {/* Options Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOptions.map((opt) => {
                const step = localData.steps.find((s) => s.key === opt.stepKey);
                const profit = (opt.salePrice || 0) - (opt.costPrice || 0);
                const margin = opt.salePrice > 0 ? Math.round((profit / opt.salePrice) * 100) : 0;

                return (
                  <div
                    key={opt._id || opt.optionId}
                    className={`rounded-2xl border p-4 bg-neutral-900/60 backdrop-blur-sm transition-all flex flex-col justify-between ${
                      opt.isActive ? "border-neutral-800" : "border-neutral-800/40 opacity-60 bg-neutral-950"
                    }`}
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-neutral-800">
                        <img src={opt.img} alt={opt.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <Badge className="bg-neutral-950/80 backdrop-blur-md text-amber-300 border border-neutral-700 text-[10px]">
                            {step?.title || opt.stepKey}
                          </Badge>
                          {opt.badge && (
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] border-0">
                              {opt.badge}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-base text-white">{opt.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{opt.desc}</p>

                      {/* Profit Metrics Box */}
                      <div className="mt-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="block text-[10px] text-neutral-400 uppercase">Alış (Maliyet)</span>
                          <span className="font-mono font-bold text-xs text-rose-400">
                            {(opt.costPrice || 0).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-neutral-400 uppercase">Satış (Liste)</span>
                          <span className="font-mono font-bold text-xs text-white">
                            {(opt.salePrice || 0).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-emerald-400 uppercase">Kâr (%{margin})</span>
                          <span className="font-mono font-bold text-xs text-emerald-300">
                            +{profit.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      </div>

                      {/* Modal Details Summary */}
                      <div className="mt-2.5 text-[11px] text-neutral-400 flex items-center justify-between">
                        <span>Teknik Özellik: {opt.specs?.length || 0} madde</span>
                        <span>Avantaj: {opt.highlights?.length || 0} madde</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <button
                        onClick={() => updateLocalOption({ ...opt, isActive: !opt.isActive })}
                        className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
                          opt.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
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
                          className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-all"
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
                          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 p-1.5 rounded-lg transition-all"
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

        {/* ========================================================= */}
        {/* TAB 4: GELEN SİPARİŞLER & TALEPLER (LEADS)                */}
        {/* ========================================================= */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Müşteri, telefon veya ilçe ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 w-56 sm:w-64"
                  />
                </div>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/60"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="new">Yeni Talep</option>
                  <option value="called">Arandı</option>
                  <option value="appointment">Randevu Verildi</option>
                  <option value="completed">Montaj Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              <span className="text-xs text-neutral-400">
                Toplam <strong>{filteredLeads.length}</strong> talep listeleniyor
              </span>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl">
                  <MessageSquare className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-neutral-300">Henüz talep bulunmuyor</h4>
                  <p className="text-xs text-neutral-500 mt-1">Siteden form doldurulduğunda talepler burada anında görünecektir.</p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const statusColors = {
                    new: "bg-sky-500/20 text-sky-300 border-sky-500/40",
                    called: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                    appointment: "bg-purple-500/20 text-purple-300 border-purple-500/40",
                    completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                    cancelled: "bg-rose-500/20 text-rose-300 border-rose-500/40",
                  };

                  return (
                    <div
                      key={lead._id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm flex flex-col lg:flex-row gap-5 justify-between"
                    >
                      {/* Customer & Location */}
                      <div className="space-y-2 lg:max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-white">{lead.fullName}</span>
                          <Badge className={`text-[10px] font-bold border ${statusColors[lead.status] || "bg-neutral-800"}`}>
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

                        <div className="text-xs text-neutral-400 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline font-mono font-semibold"
                            >
                              {lead.phone} (WhatsApp)
                            </a>
                          </div>
                          <div>
                            📍 <strong>{lead.district}</strong>, {lead.city}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            🕒 {new Date(lead.createdAt).toLocaleString("tr-TR")}
                          </div>
                        </div>

                        {/* Status Changer */}
                        <div className="pt-2">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Durumu Güncelle</label>
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              updateLocalLeadStatus(lead._id, e.target.value);
                              toast.success("Talep durumu güncellendi.");
                            }}
                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white w-full focus:outline-none focus:border-amber-400"
                          >
                            <option value="new">Yeni Talep</option>
                            <option value="called">Arandı / Bilgi Verildi</option>
                            <option value="appointment">Montaj Randevusu Verildi</option>
                            <option value="completed">Montaj & Teslim Tamamlandı</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                        </div>
                      </div>

                      {/* Selected Custom Build Parts & Profit Summary */}
                      <div className="flex-1 bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                            {lead.flowType === "builder" ? "🛠️ Özel Toplanan Cihaz Parçaları" : "📦 Talep Detayı"}
                          </span>

                          {lead.selectedItems && lead.selectedItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              {lead.selectedItems.map((item, i) => (
                                <div key={i} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                                  <span className="block text-[10px] text-neutral-400">{item.stepTitle}</span>
                                  <span className="font-semibold text-white truncate block">{item.name}</span>
                                  <span className="font-mono text-[11px] text-neutral-300">
                                    {item.salePrice.toLocaleString("tr-TR")} ₺
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-400">{lead.itemName || "Lotus Su Arıtma Cihaz Talebi"}</p>
                          )}
                        </div>

                        {/* Financial Bar of This Order */}
                        <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                          <div>
                            <span className="block text-[10px] text-neutral-400">Liste Tutarı</span>
                            <span className="font-mono line-through text-neutral-500">
                              {(lead.totalListPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-amber-400 font-bold">%20 İndirimli Satış</span>
                            <span className="font-mono font-extrabold text-amber-300">
                              {(lead.finalDiscountedPrice || lead.totalListPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-rose-400">Toplam Maliyet</span>
                            <span className="font-mono text-rose-400 font-bold">
                              {(lead.totalCostPrice || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-400 font-bold">Net Kâr (%{lead.profitMarginPercent || 0})</span>
                            <span className="font-mono font-extrabold text-emerald-300">
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

        {/* ========================================================= */}
        {/* TAB 5: GENEL AYARLAR                                      */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Genel Site & Fiyatlandırma Ayarları</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                WhatsApp numarası, baz montaj bedeli ve indirim kancası oranlarını buradan güncelleyin.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateLocalSettings(settingsForm);
                toast.success("Ayarlar başarıyla kaydedildi!");
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Marka Adı</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">WhatsApp Sipariş Numarası (Uluslararası)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    placeholder="905550000000"
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">WhatsApp Görünen Metin</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappDisplay}
                    placeholder="+90 (555) 000 00 00"
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Baz Donanım & Montaj Satış Bedeli (₺)</label>
                  <input
                    type="number"
                    value={settingsForm.basePrice}
                    onChange={(e) => setSettingsForm({ ...settingsForm, basePrice: Number(e.target.value) })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Baz Donanım Toptan Alış Maliyeti (₺)</label>
                  <input
                    type="number"
                    value={settingsForm.baseCost}
                    onChange={(e) => setSettingsForm({ ...settingsForm, baseCost: Number(e.target.value) })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 font-mono text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">İndirim Rozeti Metni</label>
                <input
                  type="text"
                  value={settingsForm.discountBadgeText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, discountBadgeText: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--brand-champagne))] text-neutral-950 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all"
                >
                  <Save className="h-4 w-4" /> Ayarları Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: STEP ADD / EDIT MODAL                            */}
      {/* ========================================================= */}
      {isStepModalOpen && editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl text-white">
                {editingStep._id ? "Adımı Düzenle" : "Yeni Konfigüratör Adımı"}
              </h3>
              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Adım Rozet Metni</label>
                <input
                  type="text"
                  required
                  placeholder="1. Adım • Dış Gövde & Kasa"
                  value={editingStep.badge}
                  onChange={(e) => setEditingStep({ ...editingStep, badge: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Adım Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Kasa Tipinizi Seçin"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Adım Açıklama Metni</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tezgah altınızın alanına ve estetik tercihinize..."
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Özel Rehber Kutusu Metni (İsteğe Bağlı)</label>
                <input
                  type="text"
                  placeholder="Örn: 3. kat ve üzeri için pompalı model önerilir..."
                  value={editingStep.guideText || ""}
                  onChange={(e) => setEditingStep({ ...editingStep, guideText: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsStepModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-[hsl(var(--brand-champagne))] text-neutral-950 px-5 py-2 rounded-xl font-bold shadow"
                >
                  <Save className="h-4 w-4" /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PARÇA & MODAL ZENGİN EDİTÖRÜ                      */}
      {/* ========================================================= */}
      {isOptionModalOpen && editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  {editingOption._id ? "Parçayı & Modalı Düzenle" : "Yeni Parça & Modal Oluştur"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Alış/Satış fiyatı, kârlılık ve büyük görsel modal detayları.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOptionModalOpen(false)}
                className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOption} className="space-y-4 text-xs">
              {/* Step Selection & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Ait Olduğu Adım / Kategori</label>
                  <select
                    value={editingOption.stepKey}
                    onChange={(e) => setEditingOption({ ...editingOption, stepKey: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400"
                  >
                    {localData.steps.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title} ({s.key})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Parça / Model Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 5'li PLATINUM PLUS DIAMOND"
                    value={editingOption.name}
                    onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
              </div>

              {/* Cost Price vs Selling Price + Live Profit Calculator */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-400/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-rose-400 font-bold mb-1">Alış / Toptan Maliyet (₺)</label>
                  <input
                    type="number"
                    required
                    value={editingOption.costPrice}
                    onChange={(e) => setEditingOption({ ...editingOption, costPrice: Number(e.target.value) })}
                    className="bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-white w-full focus:outline-none focus:border-rose-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-200 font-bold mb-1">Satış / Liste Fiyatı (₺)</label>
                  <input
                    type="number"
                    required
                    value={editingOption.salePrice}
                    onChange={(e) => setEditingOption({ ...editingOption, salePrice: Number(e.target.value) })}
                    className="bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-white w-full focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col justify-center text-center p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Birim Kâr & Marj</span>
                  <span className="font-mono font-black text-sm text-emerald-300">
                    +{(editingOption.salePrice - editingOption.costPrice).toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-bold">
                    %{editingOption.salePrice > 0 ? Math.round(((editingOption.salePrice - editingOption.costPrice) / editingOption.salePrice) * 100) : 0} Marj
                  </span>
                </div>
              </div>

              {/* Image URL & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-bold mb-1">Büyük HD Görsel URL'si</label>
                  <input
                    type="url"
                    required
                    value={editingOption.img}
                    onChange={(e) => setEditingOption({ ...editingOption, img: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-white w-full focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Rozet (Badge - Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="En Çok Tercih Edilen"
                    value={editingOption.badge || ""}
                    onChange={(e) => setEditingOption({ ...editingOption, badge: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-white w-full focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Card Short Description */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Kart Üzeri Kısa Açıklama</label>
                <input
                  type="text"
                  required
                  placeholder="Kullanıcı ilk baktığında göreceği 1 satırlık özet..."
                  value={editingOption.desc}
                  onChange={(e) => setEditingOption({ ...editingOption, desc: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-white w-full focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Modal Long Description */}
              <div>
                <label className="block text-amber-300 font-bold mb-1">🔎 Modal Detaylı Açıklama Paragrafı</label>
                <textarea
                  rows={3}
                  placeholder="Modal açıldığında müşteriye ürünün tüm detaylarını anlatan zengin paragraf..."
                  value={editingOption.longDesc || ""}
                  onChange={(e) => setEditingOption({ ...editingOption, longDesc: e.target.value })}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white w-full focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              {/* Modal Specs Editor (Lines) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-300 font-bold">📊 Modal Teknik Özellik Maddeleri</label>
                  <button
                    type="button"
                    onClick={() => setEditingOption({ ...editingOption, specs: [...(editingOption.specs || []), "Yeni Özellik: Değer"] })}
                    className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1 font-bold"
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
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white text-xs w-full focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingOption.specs.filter((_, i) => i !== sIdx);
                          setEditingOption({ ...editingOption, specs: updated });
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Highlights Editor (Lines) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-emerald-400 font-bold">✨ Modal Öne Çıkan Avantaj Maddeleri</label>
                  <button
                    type="button"
                    onClick={() => setEditingOption({ ...editingOption, highlights: [...(editingOption.highlights || []), "Yeni Avantaj"] })}
                    className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
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
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white text-xs w-full focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingOption.highlights.filter((_, i) => i !== hIdx);
                          setEditingOption({ ...editingOption, highlights: updated });
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsOptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-[hsl(var(--brand-champagne))] text-neutral-950 px-5 py-2 rounded-xl font-bold shadow"
                >
                  <Save className="h-4 w-4" /> Parçayı & Modalı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
