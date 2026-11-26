"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [videoError, setVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldPreloadFull, setShouldPreloadFull] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldPreloadFull) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldPreloadFull(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldPreloadFull]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();

      if (reducedMotion || videoError) {
        if (contentRef.current) {
          gsap.set(contentRef.current, { opacity: 1, y: 0 });
        }
        return;
      }

      if (!video) return;

      let rafId: number | null = null;
      let lastSetTime = -1;
      let targetTime = 0;
      let activeTl: gsap.core.Timeline | null = null;

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

        activeTl?.scrollTrigger?.kill();
        activeTl?.kill();

        video.pause();
        video.currentTime = 0;
        lastSetTime = 0;

        const proxy = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=200%" : "+=150%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
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

        if (contentRef.current) {
          tl.fromTo(
            contentRef.current,
            { opacity: 0.7, y: 16 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
            0.1
          );
        }

        activeTl = tl;
        ScrollTrigger.refresh();
      };

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const isDesktop = Boolean(context.conditions?.isDesktop);
          const desiredSrc = isDesktop
            ? "/videos/section-showcase.mp4"
            : "/videos/section-showcase-mobile.mp4";

          if (video.getAttribute("src") !== desiredSrc) {
            video.setAttribute("src", desiredSrc);
            video.load();
          }

          const onReady = () => setupScrollScrub(isDesktop);

          if (video.readyState >= 1) {
            onReady();
          } else {
            video.addEventListener("loadedmetadata", onReady, { once: true });
          }

          return () => {
            video.removeEventListener("loadedmetadata", onReady);
            activeTl?.scrollTrigger?.kill();
            activeTl?.kill();
            activeTl = null;
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

  const showStaticPoster = reducedMotion || videoError;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showcase-heading"
      className="relative h-[100svh] min-h-[580px] w-full overflow-hidden bg-basalt text-ivory"
      style={{ touchAction: "pan-y" }}
    >
      {showStaticPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/section-poster-end.jpg"
          alt="MAVQESTRA architectural interior detail"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          preload={shouldPreloadFull ? "auto" : "metadata"}
          poster="/images/section-poster.jpg"
          onError={() => setVideoError(true)}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt/80 via-basalt/25 to-basalt/45"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 md:px-10 md:pb-20">
        <div
          ref={contentRef}
          className="flex flex-col justify-between gap-6 border-t border-ivory/15 pt-8 md:flex-row md:items-end"
        >
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-ember">
              {siteConfig.showcase.eyebrow}
            </p>
            <h2
              id="showcase-heading"
              className="font-display text-4xl leading-[1.04] tracking-tight text-ivory md:text-6xl"
            >
              {siteConfig.showcase.headline}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-ivory/80 md:text-base">
              {siteConfig.showcase.subheadline}
            </p>
          </div>

          <Link
            href={siteConfig.showcase.ctaHref}
            className="inline-flex min-h-[48px] shrink-0 items-center gap-2 self-start rounded-full bg-ember px-6 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5 md:self-auto"
          >
            <span>{siteConfig.showcase.ctaLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

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
