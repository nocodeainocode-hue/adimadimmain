import { useRef, useState } from "react";
import { ImagePlus, Link as LinkIcon, Loader2, UploadCloud, X } from "lucide-react";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE_LABEL,
  validateImageFile,
} from "@/lib/imageStorage";
import { useLocalData } from "@/lib/convex";

export default function ImageUploadField({ label = "Görsel", value, onChange }) {
  const { uploadImage } = useLocalData();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await validateImageFile(file);
      onChange(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError.message || "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className="block text-slate-700 font-bold mb-1">{label}</label>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
        }}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
          dragging
            ? "border-[hsl(var(--brand-plum))] bg-[hsl(var(--brand-champagne)/0.18)]"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        {value ? (
          <div className="relative h-48 bg-slate-900">
            <img src={value} alt="Yüklenen görsel önizlemesi" className="h-full w-full object-contain" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-slate-950/75 px-3 py-2 text-white backdrop-blur-sm">
              <span className="truncate text-[11px] font-medium">
                {value}
              </span>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-[11px] font-bold hover:bg-rose-700"
              >
                <X className="h-3.5 w-3.5" /> Kaldır
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-44 w-full flex-col items-center justify-center gap-2 p-6 text-center disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-9 w-9 animate-spin text-[hsl(var(--brand-plum))]" />
            ) : (
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--brand-plum))] text-[hsl(var(--brand-champagne))] shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </span>
            )}
            <span className="text-sm font-bold text-slate-800">
              {uploading ? "Görsel yükleniyor..." : "Görseli buraya sürükleyin veya seçin"}
            </span>
            <span className="text-[11px] text-slate-500">JPG, PNG, WebP veya GIF • En fazla {MAX_IMAGE_SIZE_LABEL}</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_EXTENSIONS}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="sr-only"
        />
      </div>

      {value && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--brand-plum))] hover:underline disabled:opacity-50"
        >
          <ImagePlus className="h-3.5 w-3.5" /> Başka Görsel Yükle
        </button>
      )}

      <div className="relative mt-3">
        <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="url"
          value={value || ""}
          placeholder="veya https://... görsel adresi girin"
          onChange={(event) => {
            setError("");
            onChange(event.target.value);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-champagne))] disabled:bg-slate-100"
        />
      </div>

      {error && <p role="alert" className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
