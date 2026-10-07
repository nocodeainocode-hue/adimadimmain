import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import { telHref } from "@/components/Header";

const POINTS = [
  "Montaj dahil net fiyat, işlem başlamadan önce",
  "Orijinal filtre ve yedek parça",
  "Tekirdağ'ın tüm ilçelerinde yerinde servis",
  "Satın almadan önce uzman teyidi",
];

export default function Hero({ waNumber, waDisplay }) {
  return (
    <section id="top" className="site-hero" data-testid="hero-section">
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <p className="site-eyebrow">Tekirdağ'da su arıtma, filtre ve servis</p>
          <h1 className="site-hero-title">Evinizin suyuna uygun arıtma, <span>montajıyla birlikte net fiyat.</span></h1>
          <p className="hero-description">Hangi cihaza ihtiyacınız olduğunu birkaç soruyla belirleyin. Fiyatı, parçaları ve montajı işlem başlamadan önce açıkça görün.</p>
          <ul className="hero-points">{POINTS.map((p) => <li key={p}><Check size={18} strokeWidth={2.5} aria-hidden="true" />{p}</li>)}</ul>
          <div className="hero-actions">
            <a href="#yardim-formu" className="site-primary-action" data-testid="hero-scroll-to-wizard-button">Size uygun çözümü bulun <ArrowRight size={20} aria-hidden="true" /></a>
            <a href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener noreferrer" className="site-whatsapp-action" data-testid="hero-whatsapp-button"><MessageCircle size={20} aria-hidden="true" /> WhatsApp'tan yazın</a>
          </div>
          <p className="hero-reassurance">Ücretsiz ve yükümlülüksüz. Ya da doğrudan arayın: <a href={telHref(waNumber)}><Phone size={15} aria-hidden="true" /> {waDisplay}</a></p>
        </div>
        <figure className="hero-photo">
          <img src="/images/lotus-water-at-home.webp" alt="Mutfaktaki içme suyu musluğundan bir bardağa su dolduruluyor" width="1122" height="1402" fetchPriority="high" />
          <figcaption className="hero-photo-caption"><strong>Önce uzman teyidi, sonra işlem.</strong><span>Seçtiğiniz cihazı ve fiyatı ekibimiz sizinle onaylar; siz onaylamadan hiçbir şey kesinleşmez.</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
