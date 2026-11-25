"use client";

import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { revealOnScroll, useGSAP } from "@/lib/gsap";

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const targets = section.querySelectorAll("[data-final-reveal]");
      revealOnScroll(targets, section);
    },
    { scope: sectionRef }
  );

  const consultationUrl = buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="final-cta-heading"
      className="border-t border-sand bg-sand/30 py-[clamp(5rem,10vw,9rem)] text-basalt"
    >
      <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 md:px-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <p
            data-final-reveal
            className="text-xs font-medium uppercase tracking-[0.24em] text-dusk"
          >
            Private Advisory
          </p>
          <h2
            id="final-cta-heading"
            data-final-reveal
            className="font-display text-4xl leading-[1.03] tracking-tight text-basalt md:text-6xl"
          >
            Begin a quiet conversation about your next home.
          </h2>
          <div data-final-reveal className="pt-2">
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-7 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          data-final-reveal
          className="space-y-4 rounded-[20px] border border-sand bg-ivory p-7 lg:col-span-5"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
            Direct Desk
          </p>
          <div className="space-y-3 text-sm text-basalt">
            <p className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-dusk"
                aria-hidden="true"
              />
              <span>{siteConfig.address}</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-dusk" aria-hidden="true" />
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s+/g, "")}`}
                className="inline-flex min-h-[44px] items-center hover:text-dusk"
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-dusk" aria-hidden="true" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex min-h-[44px] items-center hover:text-dusk"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
