import { ArrowUpRight, Droplets, MessageCircle, Phone } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import { telHref } from "@/components/Header";

export default function Footer({ brand, waDisplay, waNumber }) {
  const name = brand?.name || "Lotus Su Arıtma";
  return (
    <footer className="site-footer" data-testid="site-footer"><div className="site-container">
      <div className="footer-top"><h2>Sorunuz mu var?<br />Arayın, birlikte bakalım.</h2>
        <div className="footer-contact-actions">
          <a href={telHref(waNumber)} className="footer-cta"><Phone size={20} aria-hidden="true" /> {waDisplay}</a>
          <a href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener noreferrer" className="footer-cta footer-cta-wa"><MessageCircle size={20} aria-hidden="true" /> WhatsApp'tan yazın</a>
        </div>
      </div>
      <div className="footer-main">
        <div><a href="/" className="site-brand footer-brand"><span className="brand-symbol"><Droplets size={24} strokeWidth={2} aria-hidden="true" /></span><span className="brand-type"><strong>{name}</strong></span></a><p>Tekirdağ'da evinizin suyuna ve cihazınıza iyi bakıyoruz.</p></div>
        <div><h3>Çalışma saatleri</h3><p>Hafta içi 09:00–18:00<br />Cumartesi 09:00–14:00</p></div>
        <div><h3>Hizmetlerimiz</h3><ul><li>Su arıtma cihazları</li><li>Filtre değişimi</li><li>Montaj, bakım ve teknik servis</li></ul></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {name}. Tüm hakları saklıdır.</span><span>Tekirdağ merkez ve tüm ilçeleri</span><a href="/admin">Yönetim paneli <ArrowUpRight size={12} aria-hidden="true" /></a></div>
    </div></footer>
  );
}
