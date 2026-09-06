import { BadgeCheck, CheckCircle2, ChevronDown, MapPin, ShieldCheck } from "lucide-react";

const trustIcons = [BadgeCheck, MapPin, ShieldCheck, CheckCircle2];

export default function HomeSupport({ content }) {
  const trustItems = Object.values(content.trust.items);
  const whyItems = Object.values(content.why.items);
  const faqItems = Object.values(content.faq.items);

  return (
    <section className="border-t border-border/70 bg-card/35" aria-labelledby="home-support-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = trustIcons[index] || CheckCircle2;
            return (
              <div
                key={index}
                className={`flex min-h-20 items-center gap-3 border-border/70 p-4 ${
                  index < 2 ? "border-b" : ""
                } ${index % 2 === 0 ? "border-r" : ""} md:border-b-0 md:border-r md:last:border-r-0`}
              >
                <Icon className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span className="text-xs font-bold leading-relaxed text-foreground sm:text-sm">{item}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--brand-plum))]">{content.why.badge}</span>
            <h2 id="home-support-title" className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{content.why.title}</h2>
            <div className="mt-5 space-y-3">
              {whyItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-plum))] text-xs font-bold text-[hsl(var(--brand-champagne))]">{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">{content.faq.title}</h2>
            <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {faqItems.map((item, index) => (
                <details key={index} className="group px-4 sm:px-5">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-bold text-foreground">
                    {item.question}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-4 pr-8 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-center text-xs font-semibold text-muted-foreground">
          <MapPin className="h-4 w-4 text-[hsl(var(--brand-champagne))]" aria-hidden="true" />
          {content.serviceNote}
        </div>
      </div>
    </section>
  );
}
