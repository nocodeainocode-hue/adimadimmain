import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Info,
  ImageOff,
  MessageCircle,
  PackageCheck,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildWaLink } from "@/lib/whatsapp";

const unique = (values) => [...new Set(values.filter(Boolean))];

export const getDeviceImages = (device) =>
  unique([device?.img, ...(device?.galleryImages || [])]);

function getVideoSource(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return { type: "embed", url: `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}` };
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).at(-1);
      return id ? { type: "embed", url: `https://www.youtube-nocookie.com/embed/${id}` } : null;
    }
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return id ? { type: "embed", url: `https://player.vimeo.com/video/${id}` } : null;
    }
    return { type: "video", url: value };
  } catch {
    return null;
  }
}

function DeviceMediaGallery({ device }) {
  const images = useMemo(() => getDeviceImages(device), [device]);
  const video = useMemo(() => getVideoSource(device?.videoUrl), [device?.videoUrl]);
  const [activeMedia, setActiveMedia] = useState(images[0] || (video ? "video" : ""));
  const [failedImage, setFailedImage] = useState("");

  useEffect(() => {
    setActiveMedia(images[0] || (video ? "video" : ""));
  }, [device?.deviceId, images, video]);

  return (
    <div>
      <div className="device-detail-media relative aspect-[4/3] overflow-hidden">
        {activeMedia === "video" && video ? (
          video.type === "embed" ? (
            <iframe
              src={video.url}
              title={`${device.name} tanıtım videosu`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={video.url} controls preload="metadata" className="h-full w-full object-contain" />
          )
        ) : activeMedia && failedImage !== activeMedia ? (
          <img src={activeMedia} alt={device.name} className="h-full w-full object-contain p-6" onError={() => setFailedImage(activeMedia)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-secondary text-xs text-muted-foreground"><ImageOff size={30} strokeWidth={1.3} aria-hidden="true" />Ürün görseli güncelleniyor</div>
        )}
      </div>

      {(images.length > 1 || video) && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveMedia(image)}
              aria-label={`${device.name} görsel ${index + 1}`}
              className={`h-16 w-20 shrink-0 overflow-hidden border-2 bg-white transition-all ${
                activeMedia === image ? "border-primary" : "border-border"
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
          {video && (
            <button
              type="button"
              onClick={() => setActiveMedia("video")}
              className={`flex h-16 w-24 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 bg-[hsl(var(--brand-plum))] text-xs font-bold text-white transition-all ${
                activeMedia === "video" ? "border-[hsl(var(--brand-champagne))]" : "border-transparent"
              }`}
            >
              <PlayCircle className="h-5 w-5" /> Video
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function DeviceDetailContent({ device, waNumber, matchReason, showFullPageLink = false, onRequestQuote }) {
  const specs = device?.specs || [];
  const whatsappMessage = `Merhaba, ${device?.name} modeli hakkında detaylı bilgi, fiyat teklifi ve montaj randevusu almak istiyorum.`;

  if (!device) return null;

  return (
    <div className="device-detail-content space-y-7">
      <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr]">
        <DeviceMediaGallery device={device} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] font-bold">
              {device.warranty || "Yetkili Servis Garantisi"}
            </Badge>
            {device.capacity && <Badge variant="outline">{device.capacity}</Badge>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {device.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {device.longDescription || device.tagline}
          </p>

          {(matchReason || device.recommendationReason) && (
            <div className="mt-5 rounded-2xl border border-[hsl(var(--brand-champagne)/0.45)] bg-[hsl(var(--brand-champagne)/0.1)] p-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h2 className="text-sm font-bold text-foreground">Sizin için neden uygun?</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {matchReason || device.recommendationReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-muted/35 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tavsiye edilen fiyat</span>
            <div className="mt-1 font-display text-3xl font-extrabold text-[hsl(var(--brand-plum))]">{device.price}</div>
            <span className="mt-1 block text-xs text-muted-foreground">Montaj kapsamını ve güncel kampanyayı WhatsApp üzerinden doğrulayın.</span>
          </div>

          <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
            {onRequestQuote ? (
              <button
                type="button"
                onClick={() => onRequestQuote(device)}
                className="btn-whatsapp inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-md"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Teklifi Al
              </button>
            ) : (
              <a
                href={buildWaLink(waNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-md"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Teklifi Al
              </a>
            )}
            {showFullPageLink && (
              <Link
                to={`/cihazlar/${device.deviceId || device.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground hover:bg-muted"
              >
                Tam Sayfada İncele <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Check className="h-5 w-5 text-emerald-600" /> Öne Çıkan Özellikler
          </h2>
          <div className="mt-4 space-y-2.5">
            {(device.features || []).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Info className="h-5 w-5 text-[hsl(var(--brand-plum))]" /> Teknik Bilgiler
          </h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">
            {[
              ...(device.capacity ? [`Önerilen kullanım: ${device.capacity}`] : []),
              ...(device.warranty ? [`Garanti: ${device.warranty}`] : []),
              ...specs,
            ].map((spec, index) => (
              <div key={index} className="px-4 py-2.5 text-sm text-foreground">{spec}</div>
            ))}
          </div>
        </section>
      </div>

      {(device.includedItems?.length > 0 || device.maintenanceInfo || device.certifications?.length > 0) && (
        <div className="grid gap-5 md:grid-cols-3">
          {device.includedItems?.length > 0 && (
            <section className="rounded-2xl border border-border bg-muted/25 p-5">
              <h2 className="flex items-center gap-2 font-bold text-foreground"><PackageCheck className="h-5 w-5" /> Pakete Dahil</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {device.includedItems.map((item, index) => <li key={index}>• {item}</li>)}
              </ul>
            </section>
          )}
          {device.maintenanceInfo && (
            <section className="rounded-2xl border border-border bg-muted/25 p-5">
              <h2 className="flex items-center gap-2 font-bold text-foreground"><Wrench className="h-5 w-5" /> Bakım Bilgisi</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{device.maintenanceInfo}</p>
            </section>
          )}
          {device.certifications?.length > 0 && (
            <section className="rounded-2xl border border-border bg-muted/25 p-5">
              <h2 className="flex items-center gap-2 font-bold text-foreground"><ShieldCheck className="h-5 w-5" /> Sertifika & Güvence</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {device.certifications.map((item, index) => <li key={index}>• {item}</li>)}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export function DeviceDetailModal({ device, waNumber, matchReason, onClose, onRequestQuote }) {
  useEffect(() => {
    if (!device) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [device, onClose]);

  if (!device) return null;

  return (
    <div
      className="site-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${device.name} detayları`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="site-modal relative max-h-[94vh] w-full max-w-5xl overflow-y-auto border border-border bg-background p-5 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Detay penceresini kapat"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-md backdrop-blur hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <DeviceDetailContent
          device={device}
          waNumber={waNumber}
          matchReason={matchReason}
          showFullPageLink
          onRequestQuote={onRequestQuote}
        />
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-7 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
        >
          Sonuçlara Dön <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
