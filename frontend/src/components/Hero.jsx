import { MessageCircle, ArrowDown, ShieldCheck, Zap, Sparkles, CheckCircle2, XCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { buildWaLink } from "@/lib/whatsapp";

const HERO_IMG =
  "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=2000&q=85";

const valueProps = [
  {
    bad: "Telefonda usta derdi yok",
    good: "60 sn Akıllı Tespit",
    icon: Zap,
  },
  {
    bad: "Sürpriz masraf yok",
    good: "Şeffaf & Net Fiyat",
    icon: ShieldCheck,
  },
  {
    bad: "Uyumsuz parça yok",
    good: "Orijinal Filtre & Servis",
    icon: Sparkles,
  },
];

export default function Hero({ brand, waNumber }) {
  const name = brand?.name || "Lotus Su Arıtma";

  return (
    <section id="top" className="relative overflow-hidden bg-[hsl(var(--brand-ink))]" data-testid="hero-section">
      {/* background image + overlay */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Lotus Doğal Su Arıtma" className="h-full w-full object-cover object-center opacity-45" />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="absolute inset-0 noise" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-7 text-[hsl(var(--brand-paper))]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-amber-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>📍 Tekirdağ & Tüm İlçelerinde Hızlı Montaj ve Servis</span>
            </div>

            <h1 className="font-display font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl mt-6 leading-[1.18] text-white">
              Telefonda usta karmaşasına ve{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--brand-champagne))] via-amber-200 to-[hsl(var(--brand-rose))]">
                gizli fiyatlara son.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              Tekirdağ'ın kireçli şebeke suyuna özel, ne takıldığını bildiğiniz ve fiyatta sürpriz yaşamayacağınız yeni nesil arıtma dönemi. 
              <strong className="text-white font-semibold"> 60 saniyelik akıllı formumuzla</strong> ilçenizi seçin; doğru cihazı, orijinal filtreyi veya arıza çözümünü anında şeffaf fiyatla görün.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
              <a
                href="#yardim-formu"
                className="btn-champagne inline-flex items-center justify-center gap-2.5 rounded-xl h-13 px-7 text-sm sm:text-base font-bold transition-all shadow-lg hover:shadow-amber-500/20"
                data-testid="hero-scroll-to-wizard-button"
              >
                <Zap className="h-4 w-4 fill-current" />
                60 Sn'de İhtiyacını Belirle
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi ve şeffaf fiyat teklifi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl h-13 px-6 text-sm sm:text-base font-semibold border border-white/20 bg-white/5 backdrop-blur-sm text-white transition-all hover:bg-white/15"
                data-testid="hero-whatsapp-button"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                WhatsApp ile Danış
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {valueProps.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.05] border border-white/10 p-3 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <XCircle className="h-3.5 w-3.5 text-rose-400/80 shrink-0" />
                    <span className="line-through">{item.bad}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{item.good}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          >
            <div className="relative rounded-[28px] overflow-hidden border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md p-6 text-white">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200">Akıllı Çözüm Rehberi</span>
                </div>
                <span className="text-xs text-neutral-400 font-mono">1 Dakikada Sonuç</span>
              </div>

              <div className="mt-5 space-y-3.5">
                <div className="rounded-xl bg-white/10 border border-white/10 p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[hsl(var(--brand-plum))] flex items-center justify-center text-[hsl(var(--brand-champagne))] font-bold text-xs">
                    1
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">İhtiyacınızı Seçin</div>
                    <div className="text-neutral-300 text-[11px]">Yeni Cihaz • Filtre Değişimi • Arıza Çözümü</div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/10 p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[hsl(var(--brand-plum))] flex items-center justify-center text-[hsl(var(--brand-champagne))] font-bold text-xs">
                    2
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Net & Şeffaf Seçenekler</div>
                    <div className="text-neutral-300 text-[11px]">Gizli maliyetsiz tavsiye edilen modeller</div>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-emerald-200">Anında WhatsApp Teklifi</div>
                    <div className="text-emerald-300/80 text-[11px]">Laf kalabalığı olmadan tek tıkla kapınızda</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-neutral-300">
                <span>🛡️ Orijinal Parça Garantisi</span>
                <span className="text-[hsl(var(--brand-champagne))] font-semibold">Yetkili Teknik Servis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


