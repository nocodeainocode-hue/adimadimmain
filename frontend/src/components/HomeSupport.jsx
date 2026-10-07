import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone, Plus, ShieldCheck, BadgeCheck } from "lucide-react";
import { telHref } from "@/components/Header";
import { buildWaLink } from "@/lib/whatsapp";

// Soruların gösterim sırası: en büyük itirazlar önce. Listede olmayan (sonradan eklenen) sorular sona gider.
const FAQ_ORDER = ["installation", "free", "order", "afterForm", "warranty", "area", "notListed", "hours"];

const trustIcons = [BadgeCheck, MapPin, ShieldCheck, CheckCircle2];

export function HomeTrust({ content }) {
  return (
    <div className="site-trust-strip" aria-label="Hizmet kapsamımız"><div className="site-container trust-strip-inner">{Object.values(content.trust.items).map((item, index) => {const Icon = trustIcons[index] || CheckCircle2; return <div className="trust-strip-item" key={index}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span>{item}</span></div>;})}</div></div>
  );
}

export default function HomeSupport({ content, waNumber, waDisplay }) {
  const whyItems = Object.values(content.why.items);
  const faqEntries = Object.entries(content.faq.items);
  const rank = (key) => { const i = FAQ_ORDER.indexOf(key); return i === -1 ? FAQ_ORDER.length : i; };
  const faqItems = faqEntries.sort((a, b) => rank(a[0]) - rank(b[0])).map(([, item]) => item);
  return (
    <>
      <section id="neden-lotus" className="site-why" aria-labelledby="home-support-title"><div className="site-container why-layout">
        <div className="why-heading"><p className="site-eyebrow">Lotus yaklaşımı</p><h2 id="home-support-title">Ne seçtiğinizi bilin.<br /><span>İçiniz rahat olsun.</span></h2><p>{content.why.title}</p><a href="#yardim-formu" className="site-text-link">Size uygun çözümü bulun <ArrowRight size={17} aria-hidden="true" /></a></div>
        <div className="why-points">{whyItems.map((item, index) => <div key={index} className="why-point"><span className="why-number">0{index + 1}</span><p>{item}</p></div>)}<p className="service-area"><MapPin size={18} strokeWidth={1.5} aria-hidden="true" />{content.serviceNote}</p></div>
      </div></section>
      <section id="sorular" className="site-faq" aria-labelledby="faq-title"><div className="site-container faq-layout">
        <div className="faq-side">
          <p className="site-eyebrow">Aklınızda soru kalmasın</p><h2 id="faq-title">{content.faq.title}</h2><p className="faq-intro">Karar vermeden önce en çok sorulanlar.</p>
          <div className="faq-help"><strong>Cevabını bulamadınız mı?</strong><span>Bize yazın ya da arayın, birlikte bakalım.</span>
            <a href={telHref(waNumber)} className="faq-help-call"><Phone size={18} aria-hidden="true" /> {waDisplay || "Bizi arayın"}</a>
            <a href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bir sorum var.")} target="_blank" rel="noopener noreferrer" className="faq-help-wa"><MessageCircle size={18} aria-hidden="true" /> WhatsApp'tan yazın</a>
          </div>
        </div>
        <div className="faq-list">{faqItems.map((item, index) => <details key={index} className="faq-item" open={index === 0}><summary><span>{item.question}</span><Plus size={22} strokeWidth={2} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
      </div></section>
    </>
  );
}
