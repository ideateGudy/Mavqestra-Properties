"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { revealOnScroll, useGSAP } from "@/lib/gsap";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const items = section.querySelectorAll("[data-about-reveal]");
      revealOnScroll(items, section, { stagger: 0.1 });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="bg-ivory py-[clamp(5rem,10vw,9rem)] text-basalt"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12 md:gap-14 md:px-10">
        <div
          data-about-reveal
          className="relative overflow-hidden rounded-[28px] bg-sand/40 md:col-span-7"
        >
          <Image
            src={siteConfig.about.image}
            alt={siteConfig.about.imageAlt}
            width={1280}
            height={720}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div className="space-y-6 md:col-span-5">
          <p
            data-about-reveal
            className="text-xs font-medium uppercase tracking-[0.24em] text-dusk"
          >
            {siteConfig.about.eyebrow}
          </p>
          <h2
            id="about-heading"
            data-about-reveal
            className="font-display text-4xl leading-[1.06] tracking-tight text-basalt md:text-5xl"
          >
            {siteConfig.about.headline}
          </h2>
          <div data-about-reveal className="space-y-4 text-base leading-relaxed text-basalt/80">
            {siteConfig.about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div data-about-reveal className="pt-2">
            <Link
              href={siteConfig.about.ctaHref}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-basalt/20 px-6 text-sm font-medium text-basalt transition-colors hover:border-ember hover:bg-ember hover:text-basalt"
            >
              <span>{siteConfig.about.ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
