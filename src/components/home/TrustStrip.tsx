"use client";

import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap, revealOnScroll, useGSAP } from "@/lib/gsap";

export function TrustStrip() {
  const stripRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const container = stripRef.current;
      if (!container) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const statItems = container.querySelectorAll<HTMLElement>("[data-stat-item]");
      revealOnScroll(statItems, container);

      const numberEls = container.querySelectorAll<HTMLElement>("[data-count]");
      if (prefersReduced) {
        numberEls.forEach((el) => {
          const target = Number(el.dataset.count ?? "0");
          const suffix = el.dataset.suffix ?? "";
          el.textContent = `${target}${suffix}`;
        });
        return;
      }

      numberEls.forEach((el) => {
        const target = Number(el.dataset.count ?? "0");
        const suffix = el.dataset.suffix ?? "";
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
        });
      });
    },
    { scope: stripRef }
  );

  return (
    <section
      ref={stripRef}
      data-hero-next
      aria-label="Key figures"
      className="border-y border-border bg-surface text-ink"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-10 md:py-14">
        {siteConfig.stats.map((stat) => (
          <div key={stat.label} data-stat-item className="space-y-1.5">
            <p
              data-count={stat.value}
              data-suffix={stat.suffix}
              className="font-display text-4xl tracking-tight text-ink md:text-5xl"
            >
              {stat.value}
              {stat.suffix}
            </p>
            <p className="text-sm text-stone">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
