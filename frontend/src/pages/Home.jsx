import { lazy, Suspense, useEffect, useState } from "react";
import Header, { telHref } from "@/components/Header";
import { buildWaLink } from "@/lib/whatsapp";
import Hero from "@/components/Hero";
// Sihirbaz (ve animasyon kütüphanesi) ayrı pakette; sayfa ilk boyandıktan hemen sonra arka planda indirilir.
const loadWizard = () => import("@/components/Wizard");
const Wizard = lazy(loadWizard);
import Footer from "@/components/Footer";
import HomeSupport, { HomeTrust } from "@/components/HomeSupport";
import Testimonials from "@/components/Testimonials";
import { SITE_CONFIG } from "@/data/siteConfig";
import { useLocalData } from "@/lib/convex";
import { MessageCircle, Phone } from "lucide-react";

export default function Home() {
  const [formActive, setFormActive] = useState(false);
  useEffect(() => {
    const warm = () => { loadWizard(); };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = setTimeout(warm, 300);
    return () => clearTimeout(id);
  }, []);
  const config = SITE_CONFIG;
  const { localData } = useLocalData();
  const settings = localData.settings || {};
  const waNumber = settings.whatsappNumber || config.whatsapp.number;
  const waDisplay = settings.whatsappDisplay || config.whatsapp.display;
  const brand = { ...config.brand, name: settings.brandName || config.brand.name };
  const supportContent = localData.texts.homeSupport;

  return (
    <div className="site-public min-h-screen bg-background pb-16 text-foreground md:pb-0" data-testid="home-page">
      <Header brand={brand} waNumber={waNumber} waDisplay={waDisplay} formFirst formCtaText={supportContent.formCtaText} />
      <Hero brand={brand} waNumber={waNumber} waDisplay={waDisplay} />
      <HomeTrust content={supportContent} />

      <section
        id="yardim-formu"
        className="site-form-section relative scroll-mt-24"
        data-testid="wizard-section"
      >
        <div className="site-container">
          <Suspense fallback={<div className="wizard-loading" role="status" aria-live="polite">Form yükleniyor…</div>}>
            <Wizard config={config} onFlowChange={setFormActive} />
          </Suspense>
        </div>
      </section>

      <Testimonials />

      <HomeSupport content={supportContent} waNumber={waNumber} waDisplay={waDisplay} />
      <Footer brand={brand} waDisplay={waDisplay} waNumber={waNumber} />

      {!formActive && <div className="mobile-form-action md:hidden">
        <a href={telHref(waNumber)} className="mobile-bar-call" aria-label="Bizi arayın"><Phone size={20} aria-hidden="true" />Ara</a>
        <a href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener noreferrer" className="mobile-bar-wa" aria-label="WhatsApp'tan yazın"><MessageCircle size={20} aria-hidden="true" />WhatsApp</a>
        <a href="#yardim-formu" className="mobile-bar-form" data-testid="mobile-form-cta">{supportContent.mobileCtaText}</a>
      </div>}
    </div>
  );
}
