"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { revealOnScroll, useGSAP } from "@/lib/gsap";

export function ValuationCtaBand() {
  const bandRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const band = bandRef.current;
      if (!band) return;
      const targets = band.querySelectorAll("[data-valuation-reveal]");
      revealOnScroll(targets, band);
    },
    { scope: bandRef }
  );

  return (
    <section
      ref={bandRef}
      aria-labelledby="valuation-cta-heading"
      className="bg-basalt py-[clamp(5rem,10vw,8.5rem)] text-ivory"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col justify-between gap-10 rounded-[28px] border border-graphite bg-graphite/60 p-8 md:flex-row md:items-end md:p-14">
          <div className="max-w-2xl space-y-4">
            <p
              data-valuation-reveal
              className="text-xs font-medium uppercase tracking-[0.24em] text-ember"
            >
              Sell with MAVQESTRA
            </p>
            <h2
              id="valuation-cta-heading"
              data-valuation-reveal
              className="font-display text-4xl leading-[1.05] tracking-tight text-ivory md:text-6xl"
            >
              Thinking of selling? Find out what your property is worth.
            </h2>
            <p
              data-valuation-reveal
              className="max-w-xl text-base leading-relaxed text-stone"
            >
              Complimentary, confidential market appraisal for homes and titled
              land across Lagos and Abuja. Zero obligation, response within 24
              hours.
            </p>
          </div>

          <div data-valuation-reveal className="shrink-0">
            <Link
              href="/valuation"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-7 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Request a valuation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
