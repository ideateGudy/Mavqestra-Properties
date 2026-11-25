"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const safeImages =
    images.length > 0 ? images : ["/images/properties/prop-01.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % safeImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, safeImages.length]);

  return (
    <div className="space-y-4">
      {/* Mobile swipeable gallery */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
        {safeImages.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="relative aspect-[4/3] w-[88vw] shrink-0 snap-center overflow-hidden rounded-[20px] bg-graphite"
          >
            <Image
              src={src}
              alt={`${title} — image ${idx + 1}`}
              fill
              sizes="88vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop primary frame + lightbox trigger */}
      <div className="hidden md:block">
        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-graphite">
          <Image
            src={safeImages[activeIndex]}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1280px) 92vw, 1200px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open full-screen image viewer"
            className="absolute right-5 bottom-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/25 bg-basalt/70 px-4 text-xs font-medium text-ivory backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
          >
            <Expand className="h-4 w-4" aria-hidden="true" />
            <span>View gallery ({safeImages.length})</span>
          </button>
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

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-basalt/95 p-6 text-ivory"
          onClick={() => setLightboxOpen(false)}
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
            {safeImages.length > 1 && (
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
                src={safeImages[activeIndex]}
                alt={`${title} — full view ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {safeImages.length > 1 && (
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
