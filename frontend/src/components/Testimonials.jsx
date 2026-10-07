import React from "react";
import { useQuery } from "convex/react";
import { MapPin, Star } from "lucide-react";
import { api } from "../../convex/_generated/api";

// Yalnızca geliştirme ortamında, ?kanit-onizleme adresiyle görünüm denemesi için örnek veri.
// Yayın sürümünde bu yol hiç çalışmaz; gerçek veri yoksa bölüm gösterilmez.
const PREVIEW_ITEMS = [
  { _id: "p1", name: "Örnek Müşteri A.", district: "Çorlu", service: "Cihaz montajı", rating: 5, text: "Bu bir görünüm örneğidir. Gerçek yorumlar admin panelden eklenir.", photo: "/images/lotus-water-at-home.webp" },
  { _id: "p2", name: "Örnek Müşteri B.", district: "Çerkezköy", service: "Filtre değişimi", rating: 5, text: "Bu bir görünüm örneğidir. Yorum metni burada iki üç satır olarak görünür.", photo: "/images/lotus-water-at-home.webp" },
  { _id: "p3", name: "Örnek Müşteri C.", district: "Süleymanpaşa", service: "Teknik servis", rating: 4, text: "Bu bir görünüm örneğidir. Fotoğrafsız yorumlar da düzgün görünür." },
  { _id: "p4", name: "Örnek Müşteri D.", district: "Malkara", service: "Cihaz montajı", rating: 5, text: "Bu bir görünüm örneğidir. Gerçek yorumlar admin panelden eklenir.", photo: "/images/lotus-water-at-home.webp" },
];

const formatRating = (value) => value.toFixed(1).replace(".", ",");

function Stars({ value }) {
  return (
    <span className="proof-stars" role="img" aria-label={`5 üzerinden ${value} puan`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={17} className={n <= value ? "is-on" : ""} fill={n <= value ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}

function ProofCard({ item }) {
  const initial = item.name.trim().charAt(0).toLocaleUpperCase("tr-TR");
  return (
    <article className="proof-card">
      {item.photo ? (
        <div className="proof-photo"><img src={item.photo} alt={`${item.name} için yapılan işten bir fotoğraf`} loading="lazy" decoding="async" /></div>
      ) : null}
      <div className="proof-body">
        <Stars value={item.rating} />
        <p className="proof-text">{item.text}</p>
        <div className="proof-person">
          <span className="proof-avatar" aria-hidden="true">{initial}</span>
          <span>
            <strong>{item.name}</strong>
            <small>
              {item.district ? <><MapPin size={13} aria-hidden="true" /> {item.district}</> : null}
              {item.district && item.service ? " · " : ""}
              {item.service || ""}
            </small>
          </span>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsView({ items }) {
  // Veri henüz yükleniyorsa (undefined) hiçbir şey gösterme; yüklendi ve boşsa sade bir bilgi göster.
  if (items === undefined) return null;
  if (items.length === 0) {
    return (
      <section id="musteri-yorumlari" className="site-proof site-proof-empty" aria-labelledby="proof-title">
        <div className="site-container">
          <p className="site-eyebrow">Müşteri yorumları</p>
          <h2 id="proof-title">Henüz yorum yok</h2>
          <p>Evine cihazımızı taktıran müşterilerimizin yorumları ve fotoğrafları geldikçe burada yayınlayacağız.</p>
        </div>
      </section>
    );
  }
  const average = items.reduce((sum, item) => sum + item.rating, 0) / items.length;
  // Akış kesintisiz görünsün diye az kayıt varsa listeyi tekrar ederek şeridi doldur.
  const repeat = Math.max(1, Math.ceil(6 / items.length));
  const lane = Array.from({ length: repeat }, () => items).flat();

  return (
    <section id="musteri-yorumlari" className="site-proof" aria-labelledby="proof-title">
      <div className="site-container proof-head">
        <div>
          <p className="site-eyebrow">Müşterilerimiz anlatıyor</p>
          <h2 id="proof-title">Tekirdağ'da evlerine su arıtma taktığımız insanlar ne diyor?</h2>
        </div>
        <p className="proof-score">
          <strong>{formatRating(average)}</strong>
          <span><Stars value={Math.round(average)} /><small>{items.length} değerlendirme</small></span>
        </p>
      </div>
      <div className="proof-marquee" tabIndex={0} aria-label="Müşteri yorumları. Üzerine gelince akış durur.">
        <div className="proof-track">
          {lane.map((item, index) => <ProofCard item={item} key={`${item._id}-${index}`} />)}
          {/* Kayan şeridin ikinci yarısı; ekran okuyucular tekrarı görmesin. */}
          <div className="proof-dup" aria-hidden="true">
            {lane.map((item, index) => <ProofCard item={item} key={`d-${item._id}-${index}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsLive() {
  const items = useQuery(api.testimonials.listPublic);
  return <TestimonialsView items={items} />;
}

// Arka uç henüz yayında değilse veya sorgu hata verirse sayfanın geri kalanı etkilenmesin.
class ProofBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Testimonials() {
  if (import.meta.env.DEV && typeof window !== "undefined" && window.location.search.includes("kanit-onizleme")) {
    return <TestimonialsView items={PREVIEW_ITEMS} />;
  }
  return <ProofBoundary><TestimonialsLive /></ProofBoundary>;
}
