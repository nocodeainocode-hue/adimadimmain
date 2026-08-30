import { Droplets, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Footer({ brand, waDisplay }) {
  const name = brand?.name || "Lotus Su Arıtma";
  return (
    <footer className="border-t border-border/80 bg-neutral-900 text-neutral-300" data-testid="site-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-3.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] shadow-sm">
              <Droplets className="h-5 w-5" />
            </span>
            <span className="font-display font-bold text-xl text-white tracking-tight">{name}</span>
          </div>
          <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
            Eviniz ve aileniz için sağlıklı, alkali ve taze içme suyu çözümleri. Güvenilir teknik servis ve orijinal filtre garantisi.
          </p>
        </div>
        <div>
          <p className="font-bold text-white mb-3.5 text-sm tracking-wide">Müşteri Hizmetleri</p>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              WhatsApp: <span className="text-neutral-200 font-medium">{waDisplay || "+90 555 000 00 00"}</span>
            </li>
            <li>Çalışma Saatleri: Hafta içi 09:00 – 18:00</li>
            <li>Cumartesi: 09:00 – 14:00</li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white mb-3.5 text-sm tracking-wide">Hizmetlerimiz</p>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>• Yeni Nesil Su Arıtma Cihazları</li>
            <li>• Periyodik Orijinal Filtre Değişimi</li>
            <li>• Arıza Tespiti, Montaj & Bakım</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} {name}. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Lotus Su Arıtma Sistemleri</span>
            <a
              href="/admin"
              className="text-neutral-500 hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-semibold"
            >
              ⚙️ Yönetim Paneli
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

