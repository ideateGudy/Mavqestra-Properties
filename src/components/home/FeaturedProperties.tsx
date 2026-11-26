"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { gsap, ScrollTrigger, revealOnScroll, useGSAP } from "@/lib/gsap";

export function FeaturedProperties() {
  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;

      if (headerRef.current) {
        revealOnScroll([headerRef.current], headerRef.current);
      }

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const cards = track.querySelectorAll<HTMLElement>("[data-reveal-item]");

      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(track, { clearProps: "transform" });
        revealOnScroll(cards, track);
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(cards, { opacity: 1, y: 0 });

        const getDistance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        if (getDistance() <= 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance() + 120}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, {
          x: () => -getDistance(),
          ease: "none",
          duration: 1,
        });

        ScrollTrigger.refresh();

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-heading"
      className="overflow-hidden border-t border-border bg-surface py-[clamp(4.5rem,9vw,9rem)] text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div
          ref={headerRef}
          className="mb-8 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end md:gap-6"
        >
          <div className="space-y-2 md:space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk-ink">
              Selected Portfolio
            </p>
            <h2
              id="featured-heading"
              className="font-display text-4xl leading-[1.06] tracking-tight text-ink md:text-5xl"
            >
              Featured properties
            </h2>
          </div>

          <Link
            href="/properties"
            className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-ink/20 px-6 text-sm font-medium text-ink transition-colors hover:border-ember hover:bg-ember hover:text-basalt md:self-auto"
          >
            <span>View all properties</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile: pinned scroll-driven horizontal track; Desktop: 2-column grid */}
        <div
          ref={viewportRef}
          className="overflow-hidden md:overflow-visible"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-5 will-change-transform md:grid md:w-full md:grid-cols-2 md:gap-8"
          >
            {featured.map((property) => (
              <div
                key={property.id}
                data-reveal-item
                className="w-[82vw] max-w-[340px] shrink-0 md:w-auto md:max-w-none"
              >
                <PropertyCard property={property} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
