"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Compass, Expand, X } from "lucide-react";
import type { PropertyGallerySection } from "@/types";

interface PropertyGalleryProps {
  images: string[];
  sections?: PropertyGallerySection[];
  title: string;
}

export function PropertyGallery({
  images,
  sections = [],
  title,
}: PropertyGalleryProps) {
  const safeImages = useMemo(
    () => (images.length > 0 ? images : ["/images/properties/prop-01.jpg"]),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>(safeImages);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const touchStartX = useRef<number | null>(null);

  const allSectionImages = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const s of sections) {
      for (const img of s.images) {
        if (!seen.has(img)) {
          seen.add(img);
          list.push(img);
        }
      }
    }
    return list.length > 0 ? list : safeImages;
  }, [sections, safeImages]);

  const visibleSections = useMemo(() => {
    if (selectedCategory === "All") return sections;
    return sections.filter((s) => s.label === selectedCategory);
  }, [sections, selectedCategory]);

  const prev = () =>
    setActiveIndex(
      (i) => (i - 1 + lightboxImages.length) % lightboxImages.length
    );
  const next = () =>
    setActiveIndex((i) => (i + 1) % lightboxImages.length);

  const openMainLightbox = (idx: number) => {
    setLightboxImages(safeImages);
    setActiveIndex(idx);
    setLightboxOpen(true);
  };

  const openSectionImageInLightbox = (src: string) => {
    const idx = allSectionImages.indexOf(src);
    setLightboxImages(allSectionImages);
    setActiveIndex(idx >= 0 ? idx : 0);
    setExploreOpen(false);
    setLightboxOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxImages.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) prev();
    else next();
  };

  useEffect(() => {
    if (!lightboxOpen && !exploreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        setExploreOpen(false);
      }
      if (lightboxOpen) {
        if (e.key === "ArrowLeft")
          setActiveIndex(
            (i) => (i - 1 + lightboxImages.length) % lightboxImages.length
          );
        if (e.key === "ArrowRight")
          setActiveIndex((i) => (i + 1) % lightboxImages.length);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, exploreOpen, lightboxImages.length]);

  return (
    <div className="space-y-4">
      {/* Mobile swipeable gallery */}
      <div className="space-y-3 md:hidden">
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
          {safeImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => openMainLightbox(idx)}
              className="relative aspect-[4/3] w-[88vw] shrink-0 snap-center overflow-hidden rounded-[20px] bg-graphite"
            >
              <Image
                src={src}
                alt={`${title} — image ${idx + 1}`}
                fill
                sizes="88vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {sections.length > 0 && (
          <button
            type="button"
            onClick={() => setExploreOpen(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-ember px-5 text-sm font-medium text-basalt"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Explore property spaces ({allSectionImages.length})</span>
          </button>
        )}
      </div>

      {/* Desktop primary frame + Explore & Lightbox triggers */}
      <div className="hidden md:block">
        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-graphite">
          <Image
            src={safeImages[activeIndex % safeImages.length]}
            alt={`${title} — image ${(activeIndex % safeImages.length) + 1}`}
            fill
            priority
            sizes="(max-width: 1280px) 92vw, 1200px"
            className="object-cover"
          />
          <div className="absolute right-5 bottom-5 flex items-center gap-3">
            {sections.length > 0 && (
              <button
                type="button"
                onClick={() => setExploreOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ember px-5 text-xs font-medium text-basalt shadow-md transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore property</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => openMainLightbox(activeIndex % safeImages.length)}
              aria-label="Open full-screen image viewer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/25 bg-basalt/70 px-4 text-xs font-medium text-ivory backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
            >
              <Expand className="h-4 w-4" aria-hidden="true" />
              <span>View gallery ({safeImages.length})</span>
            </button>
          </div>
        </div>

        {safeImages.length > 1 && (
          <div className="mt-4 flex gap-3">
            {safeImages.map((src, idx) => (
              <button
                key={`${src}-thumb-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show image ${idx + 1}`}
                aria-current={idx === activeIndex ? "true" : undefined}
                className={`relative aspect-[16/10] w-28 overflow-hidden rounded-xl border-2 transition-opacity ${
                  idx === activeIndex
                    ? "border-ember opacity-100"
                    : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Explore Property Modal (categorized sections: Exterior, Living, Bedrooms, Bathrooms, Kitchen) */}
      {exploreOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="explore-property-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-basalt/80 p-4 backdrop-blur-xs sm:p-6"
          onClick={() => setExploreOpen(false)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-border bg-surface text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-dusk-ink">
                  Property Tour
                </p>
                <h2
                  id="explore-property-title"
                  className="font-display text-2xl tracking-tight text-ink sm:text-3xl"
                >
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setExploreOpen(false)}
                aria-label="Close property tour"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border text-ink hover:border-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Category filter tabs */}
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-border px-6 py-3.5 sm:px-8">
              {["All", ...sections.map((s) => s.label)].map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[38px] shrink-0 rounded-full border px-4 text-xs font-medium transition-colors ${
                      active
                        ? "border-ember bg-ember text-basalt"
                        : "border-border bg-surface-elevated text-ink hover:border-ink"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Grouped photo sections */}
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8">
              {visibleSections.map((section) => (
                <section key={section.label} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-border pb-2">
                    <h3 className="font-display text-2xl tracking-tight text-ink">
                      {section.label}
                    </h3>
                    <span className="text-xs text-stone">
                      {section.images.length}{" "}
                      {section.images.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.images.map((src, idx) => (
                      <button
                        key={`${section.label}-${src}-${idx}`}
                        type="button"
                        onClick={() => openSectionImageInLightbox(src)}
                        className="group relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[20px] border border-border bg-graphite text-left"
                      >
                        <Image
                          src={src}
                          alt={`${title} — ${section.label} ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 92vw, 44vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-basalt/95 p-6 text-ivory"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
            className="absolute top-6 right-6 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-ivory/20 bg-basalt text-ivory hover:border-ember"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="relative flex w-full max-w-5xl items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImages.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-ivory/20 bg-basalt/80 text-ivory hover:border-ember"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-graphite">
              <Image
                src={lightboxImages[activeIndex]}
                alt={`${title} — full view ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {lightboxImages.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-ivory/20 bg-basalt/80 text-ivory hover:border-ember"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
