{
  "brand": {
    "name": "Lotus Su Arıtma",
    "product": "Su arıtma cihazı satışı + filtre değişimi + arıza yönlendirme (WhatsApp lead)",
    "tone": ["premium", "güven veren", "sakin", "editoryal", "modern"],
    "non_goals": [
      "Klişe su teması (mavi/yeşil/aqua) kullanma",
      "Aşırı gradient kullanımı",
      "Merkez hizalı, tek tip kart yığını görünümü"
    ]
  },
  "visual_personality": {
    "style_fusion": {
      "layout_principle": "Editorial + Bento (hero) + Full-screen wizard card",
      "surface_style": "Soft-ink dark base + warm paper cards + rose-gold jewelry accents",
      "motif": "Lotus petal curves (subtle corner highlights / separators), micro-grain texture"
    },
    "why_it_works": "Mavi/yeşil olmadan ‘temizlik/saflık’ hissini sıcak krem yüzeyler ve yüksek kontrastlı mürekkep tonlarıyla verir; lotus vurgusu plum/rose-gold ile premiumlaşır."
  },
  "design_tokens": {
    "css_custom_properties": {
      "notes": "Shadcn theme tokens are HSL in index.css. Replace :root and .dark with this system. Keep gradients decorative only (<=20% viewport).",
      "root_light": {
        "--background": "36 33% 97%",
        "--foreground": "240 10% 10%",
        "--card": "36 33% 99%",
        "--card-foreground": "240 10% 10%",
        "--popover": "36 33% 99%",
        "--popover-foreground": "240 10% 10%",
        "--primary": "292 34% 22%",
        "--primary-foreground": "36 33% 98%",
        "--secondary": "30 20% 92%",
        "--secondary-foreground": "240 10% 14%",
        "--muted": "30 18% 93%",
        "--muted-foreground": "240 6% 38%",
        "--accent": "18 35% 88%",
        "--accent-foreground": "292 34% 18%",
        "--destructive": "0 72% 52%",
        "--destructive-foreground": "36 33% 98%",
        "--border": "30 14% 86%",
        "--input": "30 14% 86%",
        "--ring": "292 34% 22%",
        "--radius": "0.75rem",
        "--shadow-color": "292 20% 20%",
        "--shadow-elev-1": "0 10px 30px hsl(var(--shadow-color) / 0.10)",
        "--shadow-elev-2": "0 18px 60px hsl(var(--shadow-color) / 0.14)",
        "--brand-ink": "240 10% 10%",
        "--brand-plum": "292 34% 22%",
        "--brand-rose": "345 45% 70%",
        "--brand-champagne": "38 45% 62%",
        "--brand-paper": "36 33% 97%",
        "--brand-stone": "30 10% 70%"
      },
      "root_dark": {
        "--background": "240 10% 6%",
        "--foreground": "36 33% 96%",
        "--card": "240 10% 8%",
        "--card-foreground": "36 33% 96%",
        "--popover": "240 10% 8%",
        "--popover-foreground": "36 33% 96%",
        "--primary": "38 45% 62%",
        "--primary-foreground": "240 10% 8%",
        "--secondary": "292 18% 16%",
        "--secondary-foreground": "36 33% 96%",
        "--muted": "292 14% 14%",
        "--muted-foreground": "30 10% 72%",
        "--accent": "292 22% 18%",
        "--accent-foreground": "36 33% 96%",
        "--destructive": "0 62% 40%",
        "--destructive-foreground": "36 33% 96%",
        "--border": "292 14% 18%",
        "--input": "292 14% 18%",
        "--ring": "38 45% 62%",
        "--radius": "0.75rem",
        "--shadow-color": "0 0% 0%",
        "--shadow-elev-1": "0 10px 30px hsl(var(--shadow-color) / 0.35)",
        "--shadow-elev-2": "0 18px 60px hsl(var(--shadow-color) / 0.45)",
        "--brand-ink": "240 10% 6%",
        "--brand-plum": "292 34% 22%",
        "--brand-rose": "345 45% 70%",
        "--brand-champagne": "38 45% 62%",
        "--brand-paper": "36 33% 96%",
        "--brand-stone": "30 10% 70%"
      },
      "supporting_hex_palette": {
        "ink": "#0E0F14",
        "charcoal": "#17161B",
        "paper": "#FBF7F1",
        "warm-stone": "#D8CFC3",
        "deep-plum": "#3E1E3A",
        "lotus-rose": "#D9A0B3",
        "champagne-gold": "#C9A96E",
        "whatsapp": "#25D366"
      },
      "allowed_gradients": {
        "hero_overlay_only": [
          "linear-gradient(135deg, hsl(240 10% 6% / 0.92), hsl(292 34% 22% / 0.55), hsl(240 10% 6% / 0.92))",
          "radial-gradient(900px circle at 20% 10%, hsl(345 45% 70% / 0.18), transparent 55%)"
        ],
        "restriction": "Gradients only as section background overlays; never on cards; never exceed 20% viewport; never on small UI elements."
      },
      "texture": {
        "noise_overlay_css": ".noise::before{content:'';position:absolute;inset:0;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.18%22/%3E%3C/svg%3E');mix-blend-mode:overlay;pointer-events:none;border-radius:inherit;}",
        "usage": "Apply to hero background wrapper and wizard container only (not inside text blocks)."
      }
    },
    "spacing_system": {
      "section_padding": "py-14 sm:py-20",
      "container": "max-w-6xl mx-auto px-4 sm:px-6",
      "card_padding": "p-4 sm:p-6",
      "wizard_height": "min-h-[calc(100vh-72px)] (below hero)"
    },
    "radius_and_shadow": {
      "radius": {
        "card": "rounded-2xl",
        "button": "rounded-xl",
        "pill": "rounded-full (only for small option chips)"
      },
      "shadow": {
        "default": "shadow-[var(--shadow-elev-1)]",
        "hover": "hover:shadow-[var(--shadow-elev-2)]"
      }
    }
  },
  "typography": {
    "fonts": {
      "display": {
        "name": "Fraunces",
        "google_fonts": "https://fonts.google.com/specimen/Fraunces",
        "usage": "Hero H1 + section titles (lotus premium editorial feel)"
      },
      "body": {
        "name": "Manrope",
        "google_fonts": "https://fonts.google.com/specimen/Manrope",
        "usage": "UI labels, wizard questions, cards, buttons"
      }
    },
    "tailwind_application": {
      "notes": "Add to index.css: body uses Manrope; headings use Fraunces via className 'font-display'.",
      "classes": {
        "h1": "font-display tracking-[-0.02em] text-4xl sm:text-5xl lg:text-6xl",
        "h2": "font-display tracking-[-0.01em] text-base md:text-lg",
        "body": "font-sans text-sm sm:text-base leading-relaxed",
        "small": "text-xs text-muted-foreground"
      }
    },
    "copy_tone_tr": {
      "principles": [
        "Kısa cümleler, net seçenekler",
        "Güven sinyali: garanti/servis/kurulum gibi mikro metinler",
        "CTA: WhatsApp’ta hızlı yanıt vurgusu"
      ]
    }
  },
  "layout": {
    "page_structure": [
      "Sticky header (brand + WhatsApp quick CTA)",
      "Hero banner (big headline + 3 trust bullets + primary CTA scroll-to-wizard)",
      "Full-screen wizard section (card-in-card, stepper, branching)",
      "Footer micro (adres/telefon placeholder + çalışma saatleri + KVKK link placeholder)"
    ],
    "grid": {
      "hero": "12-col on desktop; left copy (7), right visual (5). Mobile: stacked.",
      "entry_choices": "grid grid-cols-1 md:grid-cols-3 gap-4",
      "results_cards": "grid grid-cols-1 md:grid-cols-3 gap-4 (device cards)"
    },
    "wizard_container": {
      "outer": "relative overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-elev-1)]",
      "inner": "p-4 sm:p-6 md:p-8",
      "background": "Use warm paper card on top of ink section; add subtle noise overlay on section wrapper."
    }
  },
  "components": {
    "component_path": {
      "shadcn": {
        "Button": "/app/frontend/src/components/ui/button.jsx",
        "Card": "/app/frontend/src/components/ui/card.jsx",
        "Badge": "/app/frontend/src/components/ui/badge.jsx",
        "Progress": "/app/frontend/src/components/ui/progress.jsx",
        "Separator": "/app/frontend/src/components/ui/separator.jsx",
        "RadioGroup": "/app/frontend/src/components/ui/radio-group.jsx",
        "Slider": "/app/frontend/src/components/ui/slider.jsx",
        "Tabs": "/app/frontend/src/components/ui/tabs.jsx",
        "Dialog": "/app/frontend/src/components/ui/dialog.jsx",
        "Tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
        "Sonner": "/app/frontend/src/components/ui/sonner.jsx"
      },
      "icons": {
        "lucide_react": "Use lucide-react icons (already typical in shadcn). Avoid emojis.",
        "fontawesome_cdn": "Allowed if needed for WhatsApp icon; prefer lucide 'MessageCircle'."
      }
    },
    "header": {
      "behavior": "Sticky with blur; shows brand left, WhatsApp CTA right.",
      "classes": "sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "data_testids": {
        "brand": "site-header-brand",
        "whatsapp": "site-header-whatsapp-button"
      }
    },
    "hero": {
      "visual": "Ink background with mild plum overlay + radial rose highlight + noise. Right side: abstract lotus image or neutral interior photo masked in rounded frame.",
      "cta": "Primary button scrolls to wizard (#yardim-formu). Secondary ghost opens WhatsApp.",
      "trust_row": "3 bullets with small icons: 'Ücretsiz keşif', 'Hızlı servis', 'Orijinal filtre'.",
      "data_testids": {
        "primary": "hero-scroll-to-wizard-button",
        "secondary": "hero-whatsapp-button"
      }
    },
    "wizard": {
      "stepper": {
        "pattern": "Top row: Step label + Progress bar + 'Başa dön' link.",
        "use": "Progress component + small step chips.",
        "classes": {
          "wrapper": "flex items-center justify-between gap-3",
          "progress": "h-2 rounded-full bg-muted",
          "progress_indicator": "bg-[hsl(var(--brand-champagne))]"
        },
        "data_testids": {
          "back": "wizard-back-button",
          "restart": "wizard-restart-button",
          "progress": "wizard-progress"
        }
      },
      "entry_choice_cards": {
        "pattern": "3 premium cards with icon, title, 1-line description, arrow affordance.",
        "use": "Card + Button (as full-card clickable).",
        "classes": {
          "card": "group relative overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-[var(--shadow-elev-1)] hover:shadow-[var(--shadow-elev-2)]",
          "accent": "after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-200 after:bg-[radial-gradient(600px_circle_at_20%_10%,hsl(var(--brand-rose)/0.18),transparent_55%)] group-hover:after:opacity-100",
          "title": "font-display text-lg",
          "desc": "mt-1 text-sm text-muted-foreground",
          "arrow": "mt-4 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-plum))]"
        },
        "data_testids": {
          "buy": "wizard-entry-buy-device",
          "filter": "wizard-entry-change-filter",
          "malfunction": "wizard-entry-malfunction"
        }
      },
      "question_steps": {
        "budget": {
          "control": "Slider + preset chips (RadioGroup) for quick selection.",
          "data_testids": {
            "slider": "wizard-budget-slider",
            "preset": "wizard-budget-preset"
          }
        },
        "consumption": {
          "control": "RadioGroup cards (2-4 options) with short helper text.",
          "data_testids": {
            "options": "wizard-consumption-options"
          }
        },
        "filter_last_changed": {
          "control": "RadioGroup with 3 options (6 ay / 1 yıl / bilmiyorum).",
          "data_testids": {
            "options": "wizard-filter-last-changed-options"
          }
        },
        "malfunction_type": {
          "control": "RadioGroup with 3 options (Su damlatıyor / Su çok az akıyor / Sızıntı var).",
          "data_testids": {
            "options": "wizard-malfunction-options"
          }
        }
      },
      "results": {
        "device_recommendation_cards": {
          "pattern": "Bento-ish cards: image placeholder top, badges row, specs list, price + WhatsApp CTA.",
          "use": "Card + Badge + Button.",
          "placeholder_image": "Use Skeleton or AspectRatio with neutral gradient background.",
          "badges": ["En çok tercih edilen", "Sessiz", "Kompakt"],
          "data_testids": {
            "card": "wizard-device-result-card",
            "whatsapp": "wizard-device-whatsapp-button"
          }
        },
        "filter_set_card": {
          "pattern": "Single highlighted card with 3’lü/5’li set, what’s included, price, WhatsApp CTA.",
          "data_testids": {
            "card": "wizard-filter-result-card",
            "whatsapp": "wizard-filter-whatsapp-button"
          }
        },
        "malfunction_guidance": {
          "pattern": "Guidance text in Alert + big WhatsApp CTA.",
          "use": "Alert component + Button.",
          "data_testids": {
            "alert": "wizard-malfunction-guidance",
            "whatsapp": "wizard-malfunction-whatsapp-button"
          }
        }
      }
    },
    "buttons": {
      "variants": {
        "primary": {
          "look": "Solid champagne-gold button on ink/plum text; premium, not gradient.",
          "classes": "bg-[hsl(var(--brand-champagne))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-champagne)/0.92)] focus-visible:ring-[hsl(var(--brand-champagne))]",
          "motion": "hover:translate-y-[-1px] active:translate-y-0 (no transition-all; use transition-colors + shadow)"
        },
        "secondary": {
          "look": "Plum outline on paper; fills slightly on hover.",
          "classes": "border border-[hsl(var(--brand-plum)/0.35)] bg-transparent text-[hsl(var(--brand-plum))] hover:bg-[hsl(var(--brand-rose)/0.18)]"
        },
        "ghost": {
          "look": "Text button for back/restart.",
          "classes": "bg-transparent text-foreground/80 hover:text-foreground hover:bg-muted"
        },
        "whatsapp": {
          "look": "WhatsApp green is allowed as a functional brand color only for CTA; keep rest of palette non-blue/non-green.",
          "classes": "bg-[#25D366] text-black hover:bg-[#25D366]/90",
          "note": "Use sparingly: only WhatsApp CTAs and maybe tiny status dot."
        }
      },
      "sizes": {
        "sm": "h-9 px-3 text-sm",
        "md": "h-11 px-4 text-sm",
        "lg": "h-12 px-5 text-base"
      }
    },
    "forms": {
      "option_cards": {
        "pattern": "RadioGroup items styled as cards (tap targets >=44px).",
        "classes": {
          "item": "rounded-xl border bg-card px-4 py-3 text-left shadow-sm hover:bg-muted/60",
          "selected": "data-[state=checked]:border-[hsl(var(--brand-champagne))] data-[state=checked]:ring-2 data-[state=checked]:ring-[hsl(var(--brand-champagne)/0.35)]"
        }
      }
    }
  },
  "motion": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": "Animate wizard step transitions (slide/fade), card hover lift, progress changes. Respect prefers-reduced-motion."
    },
    "principles": {
      "durations": {
        "fast": "150-200ms",
        "medium": "240-320ms"
      },
      "easing": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "patterns": [
        "Step change: x: 12 -> 0, opacity: 0 -> 1",
        "Back: x: -12 -> 0",
        "Result cards: stagger 60ms"
      ],
      "tailwind_transitions": "Use transition-colors, transition-shadow, transition-opacity only. Avoid transition-all."
    }
  },
  "accessibility": {
    "requirements": [
      "WCAG AA contrast: champagne button text must be ink/black",
      "Focus rings visible (ring color = champagne)",
      "Tap targets >= 44px",
      "Wizard progress announced via aria-live for step title",
      "Respect prefers-reduced-motion"
    ]
  },
  "image_urls": {
    "hero_background_or_visual": [
      {
        "url": "https://images.unsplash.com/photo-1658696982877-32cb40d936a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwd2FybSUyMG1pbmltYWwlMjBraXRjaGVuJTIwY291bnRlcnRvcHxlbnwwfHx8d2hpdGV8MTc4Njg4NzMyOHww&ixlib=rb-4.1.0&q=85",
        "category": "hero",
        "description": "Warm neutral kitchen counter (trustworthy home context). Use with dark overlay + noise."
      },
      {
        "url": "https://images.unsplash.com/photo-1711798279972-5d3cd4425be9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGxvdHVzJTIwZmxvd2VyJTIwY2xvc2UlMjB1cCUyMGRhcmslMjBiYWNrZ3JvdW5kJTIwcHJlbWl1bXxlbnwwfHx8bWFnZW50YXwxNzg2ODg3MzMzfDA&ixlib=rb-4.1.0&q=85",
        "category": "hero-accent",
        "description": "Lotus-like macro flower accent; use as small masked decorative image (not full background)."
      }
    ],
    "device_placeholder_style_refs": [
      {
        "url": "https://images.unsplash.com/photo-1631214499031-6845d10b7694?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxtaW5pbWFsJTIwbHV4dXJ5JTIwcHJvZHVjdCUyMHBsYWNlaG9sZGVyJTIwZGV2aWNlJTIwbW9ja3VwJTIwb24lMjBuZXV0cmFsJTIwYmFja2dyb3VuZHxlbnwwfHx8cHVycGxlfDE3ODY4ODczMjR8MA&ixlib=rb-4.1.0&q=85",
        "category": "placeholders",
        "description": "Neutral product-on-surface reference for placeholder composition (use Skeleton blocks similarly)."
      }
    ]
  },
  "instructions_to_main_agent": {
    "implementation_notes": [
      "Replace CRA default App.css styles; remove centered App-header patterns.",
      "Update index.css theme tokens to the lotus palette above (HSL).",
      "Use shadcn components from /src/components/ui (JS files).",
      "Wizard must remain single-page; use Framer Motion for step transitions.",
      "Every interactive element and key info must include data-testid (kebab-case).",
      "Avoid blue/green in palette; WhatsApp green allowed only for WhatsApp CTA buttons."
    ],
    "suggested_sections": {
      "hero": [
        "H1: 'Eviniz için premium su arıtma çözümleri'",
        "Sub: 'Cihaz, filtre veya servis — 60 saniyede doğru yönlendirme.'",
        "Trust bullets",
        "CTA scroll to wizard"
      ],
      "wizard": [
        "Title: 'Nasıl yardımcı olabiliriz?'",
        "Entry choices",
        "Branch steps",
        "Results with WhatsApp CTA"
      ]
    },
    "data_testid_convention": "role-based, kebab-case. Examples: wizard-entry-buy-device, wizard-budget-slider, wizard-device-whatsapp-button."
  }
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
