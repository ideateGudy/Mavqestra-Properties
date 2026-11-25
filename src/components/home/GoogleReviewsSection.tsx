"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, Star, X } from "lucide-react";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/config/site";
import type { Review } from "@/types";
import { MOTION, gsap, revealOnScroll, useGSAP } from "@/lib/gsap";

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.57-5.15 3.57-8.86Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4 3.1c.95-2.84 3.6-4.95 6.72-4.95Z"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  onReadMore,
  className = "",
}: {
  review: Review;
  onReadMore: (review: Review) => void;
  className?: string;
}) {
  const initial = review.author.trim().charAt(0).toUpperCase();

  return (
    <article
      className={`flex flex-col justify-between gap-4 rounded-[20px] border border-sand bg-ivory p-6 ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand/70 font-display text-lg text-basalt"
            >
              {initial}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-basalt">
                  {review.author}
                </p>
                {review.verified && (
                  <BadgeCheck
                    className="h-4 w-4 text-dusk"
                    aria-label="Verified review"
                  />
                )}
              </div>
              <p className="text-xs text-stone">{review.relativeDate}</p>
            </div>
          </div>

          <div
            className="flex items-center gap-0.5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating ? "fill-ember text-ember" : "text-sand"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-basalt/80">
          {review.text}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onReadMore(review)}
        className="min-h-[36px] self-start text-xs font-medium text-dusk underline-offset-4 hover:underline"
      >
        Read more
      </button>
    </article>
  );
}

export function GoogleReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);

  const rowOne = reviews.slice(0, 3);
  const rowTwo = reviews.slice(3, 6);

  const openModal = (review?: Review) => {
    setFocusedReviewId(review?.id ?? null);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  useGSAP(
    () => {
      if (!modalOpen || !modalRef.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: MOTION.ease,
        }
      );
    },
    { scope: modalRef, dependencies: [modalOpen] }
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const entryTargets = section.querySelectorAll("[data-reviews-reveal]");
      revealOnScroll(entryTargets, section);

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const created: gsap.core.Tween[] = [];

      if (rowOneRef.current) {
        created.push(
          gsap.to(rowOneRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 38,
            ease: "none",
          })
        );
      }

      if (rowTwoRef.current) {
        gsap.set(rowTwoRef.current, { xPercent: -50 });
        created.push(
          gsap.to(rowTwoRef.current, {
            xPercent: 0,
            repeat: -1,
            duration: 42,
            ease: "none",
          })
        );
      }

      tweensRef.current = created;

      return () => {
        created.forEach((t) => t.kill());
        tweensRef.current = [];
      };
    },
    { scope: sectionRef }
  );

  const pauseMarquee = () => {
    tweensRef.current.forEach((t) => t.pause());
  };

  const resumeMarquee = () => {
    tweensRef.current.forEach((t) => t.resume());
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="border-t border-sand bg-ivory py-[clamp(5rem,10vw,9rem)] text-basalt"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 md:px-10 lg:grid-cols-12">
        {/* Left summary column */}
        <div data-reviews-reveal className="space-y-6 lg:col-span-4">
          <div className="inline-flex items-center gap-2.5">
            <GoogleMark />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-stone">
              Client Reviews
            </span>
          </div>

          <div className="flex items-end gap-4">
            <h2
              id="reviews-heading"
              className="font-display text-7xl leading-none tracking-tight text-basalt md:text-8xl"
            >
              {siteConfig.googleRating.toFixed(1)}
            </h2>
            <div className="space-y-1.5 pb-2">
              <div
                className="flex items-center gap-1"
                aria-label={`${siteConfig.googleRating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-ember text-ember"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm text-stone">
                Based on {siteConfig.googleReviewCount} Google reviews
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-basalt/20 px-6 text-sm font-medium text-basalt transition-colors hover:border-ember hover:bg-ember"
            >
              <span>Review us on Google</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium text-dusk underline-offset-4 hover:underline"
            >
              Read all reviews
            </button>
          </div>
        </div>

        {/* Right: pausable two-row infinite marquee (mobile & desktop) */}
        <div
          data-reviews-reveal
          className="min-w-0 overflow-hidden lg:col-span-8"
          onMouseEnter={pauseMarquee}
          onMouseLeave={resumeMarquee}
          onTouchStart={pauseMarquee}
          onTouchEnd={resumeMarquee}
          onFocusCapture={pauseMarquee}
          onBlurCapture={resumeMarquee}
        >
          <div className="space-y-4 overflow-hidden md:space-y-5">
            <div ref={rowOneRef} className="flex w-max gap-4 will-change-transform md:gap-5">
              {[...rowOne, ...rowOne].map((review, idx) => (
                <ReviewCard
                  key={`r1-${review.id}-${idx}`}
                  review={review}
                  onReadMore={openModal}
                  className="w-[280px] shrink-0 sm:w-[320px] md:w-[340px]"
                />
              ))}
            </div>
            <div ref={rowTwoRef} className="flex w-max gap-4 will-change-transform md:gap-5">
              {[...rowTwo, ...rowTwo].map((review, idx) => (
                <ReviewCard
                  key={`r2-${review.id}-${idx}`}
                  review={review}
                  onReadMore={openModal}
                  className="w-[280px] shrink-0 sm:w-[320px] md:w-[340px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Reviews Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-reviews-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-basalt/70 p-4 backdrop-blur-xs sm:p-6"
          onClick={() => setModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-sand bg-ivory text-basalt shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-sand px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <GoogleMark />
                <div>
                  <h3
                    id="all-reviews-title"
                    className="font-display text-2xl tracking-tight text-basalt sm:text-3xl"
                  >
                    {siteConfig.googleRating.toFixed(1)} · Client Reviews
                  </h3>
                  <p className="text-xs text-stone">
                    Based on {siteConfig.googleReviewCount} Google reviews
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close reviews modal"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-sand text-basalt hover:border-basalt"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-6 py-6 sm:px-8">
              {reviews.map((review) => {
                const isSelected = review.id === focusedReviewId;
                return (
                  <article
                    key={review.id}
                    className={`space-y-3 rounded-[20px] border p-5 ${
                      isSelected
                        ? "border-ember bg-sand/25"
                        : "border-sand bg-ivory"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand/70 font-display text-lg text-basalt"
                        >
                          {review.author.trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-basalt">
                              {review.author}
                            </p>
                            {review.verified && (
                              <BadgeCheck
                                className="h-4 w-4 text-dusk"
                                aria-label="Verified review"
                              />
                            )}
                          </div>
                          <p className="text-xs text-stone">
                            {review.relativeDate}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-ember text-ember"
                                : "text-sand"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-basalt/85">
                      {review.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-sand px-6 py-4 sm:px-8">
              <p className="text-xs text-stone">
                Verified client feedback
              </p>
              <a
                href={siteConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ember px-5 text-sm font-medium text-basalt"
              >
                <span>Review us on Google</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
