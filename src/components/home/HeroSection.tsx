"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const endCtaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();

      // Reduced motion or video error: static end-frame poster + simple fade-in
      if (reducedMotion || videoError) {
        if (introRef.current) {
          gsap.fromTo(
            introRef.current.children,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
            }
          );
        }
        if (endCtaRef.current) {
          gsap.set(endCtaRef.current, { opacity: 1, y: 0 });
        }
        return;
      }

      // Page-load intro stagger
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }

      if (!video) return;

      let rafId: number | null = null;
      let lastSetTime = -1;
      let targetTime = 0;

      const scheduleSeek = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          if (!video || !Number.isFinite(video.duration)) return;
          const clamped = Math.min(
            Math.max(0, targetTime),
            Math.max(0, video.duration - 0.05)
          );
          if (Math.abs(clamped - lastSetTime) >= 1 / 30) {
            video.currentTime = clamped;
            lastSetTime = clamped;
          }
        });
      };

      const setupScrollScrub = (isDesktop: boolean) => {
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;

        video.pause();
        video.currentTime = 0;
        lastSetTime = 0;

        const proxy = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=250%" : "+=180%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (scrollCueRef.current) {
                scrollCueRef.current.style.opacity =
                  self.progress > 0.04 ? "0" : "1";
              }
            },
          },
        });

        tl.to(
          proxy,
          {
            t: Math.max(0.05, duration - 0.05),
            ease: "none",
            duration: 1,
            onUpdate: () => {
              targetTime = proxy.t;
              scheduleSeek();
            },
          },
          0
        );

        if (introRef.current) {
          tl.to(
            introRef.current,
            {
              opacity: 0,
              y: -24,
              ease: "power2.inOut",
              duration: 0.35,
            },
            0.18
          );
        }

        if (endCtaRef.current) {
          tl.fromTo(
            endCtaRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 0.25,
            },
            0.68
          );
        }

        ScrollTrigger.refresh();
        document.fonts?.ready.then(() => {
          ScrollTrigger.refresh();
        });
      };

      const handleLoaded = (isDesktop: boolean) => {
        setupScrollScrub(isDesktop);
      };

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const isDesktop = Boolean(context.conditions?.isDesktop);
          const desiredSrc = isDesktop
            ? "/videos/hero-construction.mp4"
            : "/videos/hero-construction-mobile.mp4";

          if (video.getAttribute("src") !== desiredSrc) {
            video.setAttribute("src", desiredSrc);
            video.load();
          }

          const onReady = () => handleLoaded(isDesktop);

          if (video.readyState >= 1) {
            onReady();
          } else {
            video.addEventListener("loadedmetadata", onReady, { once: true });
          }

          return () => {
            video.removeEventListener("loadedmetadata", onReady);
            if (rafId !== null) {
              window.cancelAnimationFrame(rafId);
              rafId = null;
            }
          };
        }
      );

      return () => {
        mm.revert();
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, videoError] }
  );

  const consultationUrl = buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage);
  const showStaticPoster = reducedMotion || videoError;

  const handleScrollToNext = () => {
    const nextEl = document.querySelector<HTMLElement>("[data-hero-next]");
    if (!nextEl) return;
    nextEl.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="MAVQESTRA architectural showcase"
      className="relative h-[100svh] min-h-[580px] w-full overflow-hidden bg-basalt text-ivory"
      style={{ touchAction: "pan-y" }}
    >
      {/* Background media: scroll-scrubbed video or static poster fallback */}
      {showStaticPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/hero-poster-end.jpg"
          alt="Completed MAVQESTRA architectural residence at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          onError={() => setVideoError(true)}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Subtle architectural scrim for WCAG AA contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt/80 via-basalt/25 to-basalt/55"
      />

      {/* Opening headline overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 md:px-10 md:pb-24">
        <div ref={introRef} className="max-w-3xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-ember">
            Lagos &amp; Abuja · Residential &amp; Advisory
          </p>
          <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.96] tracking-tight text-ivory">
            {siteConfig.hero.headline}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            {siteConfig.hero.subheadline}
          </p>
        </div>

        {/* End-of-scrub CTA bar (also visible immediately on reduced-motion) */}
        <div
          ref={endCtaRef}
          style={{ opacity: showStaticPoster ? 1 : 0 }}
          className="pointer-events-auto absolute right-6 bottom-14 left-6 mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-ivory/15 pt-6 sm:flex-row sm:items-center md:right-10 md:left-10"
        >
          <p className="font-display text-2xl tracking-tight text-ivory md:text-3xl">
            From structure to sanctuary.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/properties"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ember px-6 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span>{siteConfig.hero.primaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/25 bg-basalt/50 px-6 text-sm font-medium text-ivory backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
            >
              <span>{siteConfig.hero.secondaryCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      {!showStaticPoster && (
        <button
          ref={scrollCueRef}
          type="button"
          onClick={handleScrollToNext}
          aria-label="Scroll to next section"
          className="absolute bottom-6 left-1/2 z-20 flex min-h-[44px] -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full px-4 text-xs uppercase tracking-[0.24em] text-ivory/80 transition-opacity duration-300 hover:text-ivory"
        >
          <span>Scroll</span>
          <ArrowDown className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
        </button>
      )}

      {/* Thin ember scroll progress line */}
      {!showStaticPoster && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-[3px] bg-ivory/10"
        >
          <div
            ref={progressBarRef}
            style={{ transform: "scaleX(0)" }}
            className="h-full w-full origin-left bg-ember will-change-transform"
          />
        </div>
      )}
    </section>
  );
}
