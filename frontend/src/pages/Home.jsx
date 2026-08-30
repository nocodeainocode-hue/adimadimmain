import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Wizard from "@/components/Wizard";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function Home() {
  const config = SITE_CONFIG;
  const waNumber = config.whatsapp.number;

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      <Header brand={config.brand} waNumber={waNumber} />
      <Hero brand={config.brand} waNumber={waNumber} />

      <section
        id="yardim-formu"
        className="relative scroll-mt-20 py-14 sm:py-20"
        data-testid="wizard-section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Wizard config={config} />
        </div>
      </section>

      <Footer brand={config.brand} waDisplay={config.whatsapp.display} />
    </div>
  );
}
