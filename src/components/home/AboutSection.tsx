"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { revealOnScroll, useGSAP } from "@/lib/gsap";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const items = section.querySelectorAll("[data-about-reveal]");
      revealOnScroll(items, section, { stagger: 0.1 });
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="bg-surface py-[clamp(5rem,10vw,9rem)] text-ink"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12 md:gap-14 md:px-10">
        <div
          data-about-reveal
          className="relative overflow-hidden rounded-[28px] bg-surface-muted/40 md:col-span-7"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`View ${siteConfig.about.imageAlt} in fullscreen`}
            className="group block w-full cursor-zoom-in text-left"
          >
            <Image
              src={siteConfig.about.image}
              alt={siteConfig.about.imageAlt}
              width={1280}
              height={720}
              className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </button>
        </div>

        <div className="space-y-6 md:col-span-5">
          <p
            data-about-reveal
            className="text-xs font-medium uppercase tracking-[0.24em] text-dusk-ink"
          >
            {siteConfig.about.eyebrow}
          </p>
          <h2
            id="about-heading"
            data-about-reveal
            className="font-display text-4xl leading-[1.06] tracking-tight text-ink md:text-5xl"
          >
            {siteConfig.about.headline}
          </h2>
          <div data-about-reveal className="space-y-4 text-base leading-relaxed text-ink/80">
            {siteConfig.about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div data-about-reveal className="pt-2">
            <Link
              href={siteConfig.about.ctaHref}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/20 px-6 text-sm font-medium text-ink transition-colors hover:border-ember hover:bg-ember hover:text-basalt"
            >
              <span>{siteConfig.about.ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={siteConfig.about.imageAlt}
            className="fixed inset-0 z-[100] flex flex-col bg-basalt text-ivory"
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-dusk-ink">
                  {siteConfig.about.eyebrow}
                </p>
                <p className="truncate font-display text-xl text-ivory sm:text-2xl">
                  {siteConfig.about.headline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close fullscreen image"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-ivory/20 bg-basalt/80 text-ivory backdrop-blur-sm hover:border-ember"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative flex min-h-0 w-full flex-1 items-center justify-center px-2 pb-4 sm:px-6 sm:pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden">
                <Image
                  src={siteConfig.about.image}
                  alt={siteConfig.about.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
