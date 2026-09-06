import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Wizard from "@/components/Wizard";
import Footer from "@/components/Footer";
import HomeSupport from "@/components/HomeSupport";
import { SITE_CONFIG } from "@/data/siteConfig";
import { useLocalData } from "@/lib/convex";
import { Sparkles } from "lucide-react";

export default function Home() {
  const config = SITE_CONFIG;
  const { localData } = useLocalData();
  const settings = localData.settings || {};
  const waNumber = settings.whatsappNumber || config.whatsapp.number;
  const waDisplay = settings.whatsappDisplay || config.whatsapp.display;
  const brand = { ...config.brand, name: settings.brandName || config.brand.name };
  const supportContent = localData.texts.homeSupport;

  return (
    <div className="min-h-screen bg-background pb-16 text-foreground md:pb-0" data-testid="home-page">
      <Header brand={brand} waNumber={waNumber} formFirst formCtaText={supportContent.formCtaText} />
      <Hero brand={brand} waNumber={waNumber} />

      <section
        id="yardim-formu"
        className="relative scroll-mt-20 py-14 sm:py-20"
        data-testid="wizard-section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Wizard config={config} />
        </div>
      </section>

      <HomeSupport content={supportContent} />
      <Footer brand={brand} waDisplay={waDisplay} />

      <a
        href="#yardim-formu"
        className="btn-champagne fixed inset-x-3 bottom-3 z-50 flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold shadow-xl md:hidden"
        data-testid="mobile-form-cta"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {supportContent.mobileCtaText}
      </a>
    </div>
  );
}
