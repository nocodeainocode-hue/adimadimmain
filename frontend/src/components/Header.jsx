import { MessageCircle, Droplets } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";

export default function Header({ brand, waNumber }) {
  const name = brand?.name || "Lotus Su Arıtma";
  return (
    <header
      className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 transition-all"
      data-testid="site-header"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group" data-testid="site-header-brand">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-plum))] to-[hsl(var(--brand-plum)/0.8)] text-[hsl(var(--brand-champagne))] shadow-sm transition-transform group-hover:scale-105">
            <Droplets className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg sm:text-xl leading-tight text-foreground tracking-tight">{name}</span>
            <span className="text-[11px] font-medium text-muted-foreground tracking-normal">Tekirdağ Bölge & Yetkili Servis</span>
          </div>
        </a>

        <a
          href={buildWaLink(waNumber, "Merhaba, Lotus Su Arıtma hakkında bilgi almak istiyorum.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp inline-flex items-center gap-2 rounded-xl h-10 px-3.5 sm:px-4 text-sm font-semibold shadow-sm"
          data-testid="site-header-whatsapp-button"
        >
          <span className="pulse-dot" />
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp Destek</span>
        </a>
      </div>
    </header>
  );
}

