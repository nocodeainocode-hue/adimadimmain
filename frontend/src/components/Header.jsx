import { Droplets, MapPin, MessageCircle, Phone } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";

export const telHref = (waNumber) => `tel:+${String(waNumber || "").replace(/\D/g, "")}`;

export default function Header({ brand, waNumber, waDisplay, formFirst = false, formCtaText = "Çözümünü Bul" }) {
  const name = brand?.name || "Lotus Su Arıtma";
  const prefix = formFirst ? "" : "/";
  return (
    <header className="site-header" data-testid="site-header">
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <span><MapPin size={15} aria-hidden="true" /> Tekirdağ merkez ve tüm ilçeler</span>
          <span className="utility-hours">Hafta içi 09:00–18:00 · Cumartesi 09:00–14:00</span>
          <a href={telHref(waNumber)} className="utility-phone"><Phone size={15} aria-hidden="true" /> {waDisplay || "Bizi arayın"}</a>
        </div>
      </div>
      <div className="site-container header-inner">
        <a href={formFirst ? "#top" : "/"} className="site-brand" data-testid="site-header-brand" aria-label={`${name} ana sayfa`}>
          <span className="brand-symbol"><Droplets size={24} strokeWidth={2} aria-hidden="true" /></span>
          <span className="brand-type"><strong>{name}</strong></span>
        </a>
        <nav className="header-nav" aria-label="Ana menü"><a href={`${prefix}#yardim-formu`}>Çözümlerimiz</a><a href={`${prefix}#neden-lotus`}>Neden Lotus?</a><a href={`${prefix}#sorular`}>Sık sorulanlar</a></nav>
        <div className="header-actions">
          <a href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener noreferrer" className="header-whatsapp" aria-label="WhatsApp üzerinden yazın" data-testid="site-header-whatsapp-button"><MessageCircle size={20} aria-hidden="true" /><span>WhatsApp</span></a>
          <a href={`${prefix}#yardim-formu`} className="site-header-action" data-testid="site-header-form-button">{formCtaText}</a>
        </div>
      </div>
    </header>
  );
}
