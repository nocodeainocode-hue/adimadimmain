import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Edit, Loader2, MapPin, Plus, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import ImageUploadField from "@/components/admin/ImageUploadField";

const EMPTY = { name: "", district: "", service: "", text: "", rating: 5, photo: "", order: 1, isActive: true };

function RatingStars({ value }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${value} yıldız`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-3.5 w-3.5" fill={n <= value ? "currentColor" : "none"} />)}
    </span>
  );
}

function TestimonialsAdminInner() {
  const items = useQuery(api.testimonials.listAll);
  const upsert = useMutation(api.testimonials.upsert);
  const remove = useMutation(api.testimonials.remove);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await upsert({
        ...(editing._id ? { id: editing._id } : {}),
        name: editing.name,
        district: editing.district || undefined,
        service: editing.service || undefined,
        text: editing.text,
        rating: Number(editing.rating),
        photo: editing.photo || undefined,
        order: Number(editing.order) || 0,
        isActive: editing.isActive,
      });
      toast.success("Yorum kaydedildi.");
      setEditing(null);
    } catch (error) {
      toast.error(error?.data || error?.message?.split("\n")[0] || "Yorum kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await upsert({
        id: item._id, name: item.name, district: item.district, service: item.service,
        text: item.text, rating: item.rating, photo: item.photo, order: item.order, isActive: !item.isActive,
      });
    } catch {
      toast.error("Durum değiştirilemedi.");
    }
  };

  const del = async (item) => {
    if (!window.confirm(`"${item.name}" yorumunu silmek istediğinize emin misiniz?`)) return;
    try {
      await remove({ id: item._id });
      toast.success("Yorum silindi.");
    } catch {
      toast.error("Yorum silinemedi.");
    }
  };

  const field = "w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[hsl(var(--brand-plum))]";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">Müşteri Yorumları</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ana sayfada fotoğraflı, akan şerit olarak görünür. Yalnızca gerçek müşteri yorumlarını ekleyin. Hiç aktif yorum yoksa bölüm sitede görünmez.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY, order: (items?.length || 0) + 1 })}
          className="inline-flex items-center gap-2 btn-champagne px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" /> Yeni Yorum Ekle
        </button>
      </div>

      {items === undefined && <p className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…</p>}
      {items && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Henüz yorum yok. İlk yorumu ekleyin; fotoğraf eklemek güveni artırır.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(items || []).map((item) => (
          <div key={item._id} className={`rounded-2xl border bg-white overflow-hidden flex flex-col ${item.isActive ? "border-slate-200" : "border-slate-200 opacity-60"}`}>
            {item.photo ? <img src={item.photo} alt="" className="h-40 w-full object-cover" /> : <div className="h-12 bg-slate-100" />}
            <div className="p-4 flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <RatingStars value={item.rating} />
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${item.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                >
                  {item.isActive ? "Sitede görünüyor" : "Gizli"}
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed line-clamp-5 flex-1">{item.text}</p>
              <div className="text-xs text-slate-500">
                <strong className="text-slate-800">{item.name}</strong>
                {(item.district || item.service) && (
                  <span className="block mt-0.5">
                    {item.district && <><MapPin className="inline h-3 w-3" /> {item.district}</>}
                    {item.district && item.service ? " · " : ""}{item.service}
                  </span>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Sıra: {item.order}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ ...EMPTY, ...item, district: item.district || "", service: item.service || "", photo: item.photo || "" })}
                    className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold">
                    <Edit className="h-3.5 w-3.5" /> Düzenle
                  </button>
                  <button onClick={() => del(item)} aria-label="Yorumu sil"
                    className="inline-flex items-center text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 p-3 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Yorum düzenle">
          <form onSubmit={save} className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs my-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">{editing._id ? "Yorumu Düzenle" : "Yeni Yorum"}</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Kapat" className="p-1.5 rounded-lg hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            <ImageUploadField label="İş fotoğrafı (isteğe bağlı)" value={editing.photo} onChange={(photo) => setEditing({ ...editing, photo })} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block"><span className="block text-slate-700 font-bold mb-1">Müşteri adı *</span>
                <input required maxLength={80} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Ayşe K." className={field} /></label>
              <label className="block"><span className="block text-slate-700 font-bold mb-1">İlçe</span>
                <input maxLength={60} value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} placeholder="Çorlu" className={field} /></label>
              <label className="block"><span className="block text-slate-700 font-bold mb-1">Hizmet</span>
                <input maxLength={60} value={editing.service} onChange={(e) => setEditing({ ...editing, service: e.target.value })} placeholder="Cihaz montajı" className={field} /></label>
              <label className="block"><span className="block text-slate-700 font-bold mb-1">Puan</span>
                <select value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className={field}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} yıldız</option>)}
                </select></label>
            </div>

            <label className="block"><span className="block text-slate-700 font-bold mb-1">Yorum * <span className="font-normal text-slate-400">({editing.text.length}/700)</span></span>
              <textarea required rows={5} maxLength={700} value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} placeholder="Müşterinin kendi sözleriyle yorumu" className={field} /></label>

            <div className="grid grid-cols-2 gap-3 items-end">
              <label className="block"><span className="block text-slate-700 font-bold mb-1">Sıra (küçük önce)</span>
                <input type="number" min={0} value={editing.order} onChange={(e) => setEditing({ ...editing, order: e.target.value })} className={field} /></label>
              <label className="flex items-center gap-2 pb-2.5 font-bold text-slate-700">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="h-4 w-4" />
                Sitede göster
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50">Vazgeç</button>
              <button type="submit" disabled={saving} className="btn-champagne px-5 py-2.5 rounded-xl font-bold disabled:opacity-60 inline-flex items-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

class TestimonialsBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
        <strong className="block mb-1">Yorum işlevleri bu veritabanında henüz yayınlanmamış.</strong>
        Convex işlevlerini bağlı olduğunuz deployment'a yükleyin (geliştirme için <code>npx convex dev --once</code>, canlı için <code>npx convex deploy</code>), sonra sayfayı yenileyin.
      </div>
    );
  }
}

export default function TestimonialsAdmin() {
  return <TestimonialsBoundary><TestimonialsAdminInner /></TestimonialsBoundary>;
}
