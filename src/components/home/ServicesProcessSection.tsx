"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { processSteps, services } from "@/data/services";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gsap, revealOnScroll, useGSAP } from "@/lib/gsap";

export function ServicesProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const servicesList = section.querySelector("[data-services-list]");
      const serviceRows = section.querySelectorAll("[data-service-row]");
      if (servicesList) {
        revealOnScroll(serviceRows, servicesList, { stagger: 0.07 });
      }

      const processGrid = section.querySelector("[data-process-grid]");
      const stepCards = section.querySelectorAll("[data-process-step]");
      if (processGrid) {
        revealOnScroll(stepCards, processGrid, { stagger: 0.1 });
      }

      if (prefersReduced) {
        if (lineRef.current) {
          gsap.set(lineRef.current, { scaleX: 1 });
        }
        return;
      }

      if (lineRef.current && processGrid) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processGrid,
              start: "top 85%",
              end: "bottom 65%",
              scrub: 0.5,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      className="border-t border-sand bg-ivory py-[clamp(5rem,10vw,9rem)] text-basalt"
    >
      <div className="mx-auto max-w-7xl space-y-24 px-6 md:px-10">
        {/* Services */}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk">
              Services
            </p>
            <h2
              id="services-heading"
              className="font-display text-4xl leading-[1.06] tracking-tight text-basalt md:text-5xl"
            >
              Advisory built around every stage.
            </h2>
            <p className="text-base leading-relaxed text-stone">
              Whether acquiring a residence, letting a floor, or valuing an
              asset, our team handles every detail discreetly.
            </p>
          </div>

          <div data-services-list className="divide-y divide-sand lg:col-span-8">
            {services.map((service, index) => {
              const href =
                service.id === "valuation"
                  ? "/valuation"
                  : service.id === "buy" || service.id === "rent"
                    ? "/properties"
                    : buildWhatsAppUrl(
                        `Hello MAVQESTRA PROPERTIES, I would like to discuss ${service.title.toLowerCase()}.`
                      );
              const isExternal = href.startsWith("http");

              const content = (
                <div className="group flex flex-col justify-between gap-4 py-6 transition-colors md:flex-row md:items-center">
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-stone transition-colors group-hover:text-ember">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-basalt transition-transform duration-200 group-hover:translate-x-1 md:text-3xl">
                        {service.title}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.18em] text-stone">
                        {service.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 md:max-w-sm">
                    <p className="text-sm leading-relaxed text-basalt/75 transition-colors group-hover:text-basalt">
                      {service.detail}
                    </p>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-stone transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );

              return (
                <div key={service.id} data-service-row>
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block min-h-[44px]"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link href={href} className="block min-h-[44px]">
                      {content}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Step Process */}
        <div className="space-y-12 border-t border-sand pt-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk">
                How It Works
              </p>
              <h2 className="font-display text-4xl leading-[1.06] tracking-tight text-basalt md:text-5xl">
                Four quiet steps to closing.
              </h2>
            </div>
            <a
              href={buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-basalt/20 px-5 text-sm font-medium text-basalt transition-colors hover:border-ember hover:bg-ember md:self-auto"
            >
              <span>Start with a consultation</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div data-process-grid className="relative">
            {/* Scroll-linked progress line on desktop */}
            <div
              aria-hidden="true"
              className="mb-8 hidden h-[2px] w-full overflow-hidden bg-sand md:block"
            >
              <div
                ref={lineRef}
                className="h-full w-full origin-left bg-ember will-change-transform"
              />
            </div>

            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item) => (
                <li
                  key={item.step}
                  data-process-step
                  className="space-y-3 rounded-[20px] border border-sand bg-ivory p-6"
                >
                  <span className="inline-block font-mono text-xs font-medium tracking-widest text-ember">
                    STEP {item.step}
                  </span>
                  <h3 className="font-display text-3xl tracking-tight text-basalt">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-basalt/75">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
