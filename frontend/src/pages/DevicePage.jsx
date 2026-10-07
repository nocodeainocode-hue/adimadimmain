import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DeviceDetailContent, getDeviceImages } from "@/components/DeviceDetails";
import { SITE_CONFIG } from "@/data/siteConfig";
import { useLocalData } from "@/lib/convex";
import DeviceQuoteModal from "@/components/DeviceQuoteModal";

export default function DevicePage() {
  const { deviceId } = useParams();
  const { localData, trackAnalyticsEvent } = useLocalData();
  const [quoteDevice, setQuoteDevice] = useState(null);
  const device = (localData.devices || []).find(
    (item) => (item.deviceId || item.id) === deviceId && item.isActive !== false
  );
  const waNumber = localData.settings?.whatsappNumber || SITE_CONFIG.whatsapp.number;

  useEffect(() => {
    document.title = device ? `${device.name} | Lotus Su Arıtma` : "Cihaz Bulunamadı | Lotus Su Arıtma";
    return () => {
      document.title = "Lotus Su Arıtma";
    };
  }, [device]);

  useEffect(() => {
    if (!device) return;
    trackAnalyticsEvent({ eventType: "device_viewed", flowType: "buy", itemId: device.deviceId || device.id });
  }, [device, trackAnalyticsEvent]);

  const productJsonLd = device
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: device.name,
        description: device.longDescription || device.tagline,
        image: getDeviceImages(device),
        sku: device.deviceId || device.id,
        brand: { "@type": "Brand", name: "Lotus Su Arıtma" },
        offers: {
          "@type": "Offer",
          priceCurrency: "TRY",
          price: Number(device.salePrice || String(device.price || "").replace(/[^0-9]/g, "")) || 0,
          availability: "https://schema.org/InStock",
          url: typeof window !== "undefined" ? window.location.href : "",
        },
      }
    : null;

  return (
    <div className="site-public min-h-screen bg-background text-foreground">
      <Header brand={SITE_CONFIG.brand} waNumber={waNumber} />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/#yardim-formu" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Cihaz önerilerine dön
        </Link>

        {device ? (
          <>
            <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
            <DeviceDetailContent device={device} waNumber={waNumber} onRequestQuote={setQuoteDevice} />
          </>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
            <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="mt-4 font-display text-2xl font-bold">Bu cihaz bulunamadı</h1>
            <p className="mt-2 text-sm text-muted-foreground">Model yayından kaldırılmış veya bağlantı değişmiş olabilir.</p>
            <Link to="/#yardim-formu" className="btn-champagne mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-bold">
              Güncel cihazları görüntüle
            </Link>
          </div>
        )}
      </main>
      <Footer brand={SITE_CONFIG.brand} waDisplay={localData.settings?.whatsappDisplay || SITE_CONFIG.whatsapp.display} waNumber={waNumber} />
      <DeviceQuoteModal device={quoteDevice} waNumber={waNumber} onClose={() => setQuoteDevice(null)} />
    </div>
  );
}
