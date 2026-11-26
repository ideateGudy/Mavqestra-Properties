"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  X,
} from "lucide-react";
import type { Property, PropertyStatus } from "@/types";
import { formatNaira } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const statusStyles: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  "for-sale": {
    label: "For Sale",
    className: "bg-basalt/85 text-ivory border-ivory/15",
  },
  "for-rent": {
    label: "For Rent",
    className: "bg-dusk text-ivory border-dusk",
  },
  "off-plan": {
    label: "Off-Plan",
    className: "bg-ember text-basalt border-ember",
  },
  sold: {
    label: "Sold",
    className: "bg-stone text-ivory border-stone",
  },
};

export interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const images =
    property.images.length > 0
      ? property.images
      : ["/images/properties/prop-01.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const hasMultiple = images.length > 1;
  const status = statusStyles[property.status];
  const enquiryText = `Hello MAVQESTRA PROPERTIES, I would like to enquire about "${property.title}" in ${property.location.area}, ${property.location.city} (${formatNaira(property.price)}${property.priceLabel ? ` ${property.priceLabel}` : ""}).`;
  const whatsappUrl = buildWhatsAppUrl(enquiryText);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) {
      prevImage();
    } else {
      nextImage();
    }
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft" && hasMultiple)
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight" && hasMultiple)
        setActiveIndex((i) => (i + 1) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, hasMultiple, images.length]);

  return (
    <>
      <article
        className={`group flex flex-col overflow-hidden rounded-[20px] border border-border bg-surface-elevated transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-graphite"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`View photos for ${property.title}`}
            className="relative block h-full w-full cursor-zoom-in text-left"
          >
            <Image
              src={images[activeIndex]}
              alt={`${property.title} in ${property.location.area}, ${property.location.city} — photo ${activeIndex + 1}`}
              fill
              sizes="(max-width: 767px) 85vw, (max-width: 1200px) 48vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </button>

          <span
            className={`pointer-events-none absolute top-4 left-4 rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm ${status.className}`}
          >
            {status.label}
          </span>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous property photo"
                className="absolute top-1/2 left-3 inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-basalt/65 text-ivory backdrop-blur-sm transition-opacity hover:border-ember hover:bg-basalt md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next property photo"
                className="absolute top-1/2 right-3 inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-basalt/65 text-ivory backdrop-blur-sm transition-opacity hover:border-ember hover:bg-basalt md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-basalt/55 px-2.5 py-1 backdrop-blur-sm"
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeIndex ? "w-4 bg-ember" : "w-1.5 bg-ivory/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5 p-6">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-2xl tracking-tight text-ink">
                {formatNaira(property.price)}
                {property.priceLabel && (
                  <span className="ml-1.5 font-sans text-xs font-normal text-stone">
                    {property.priceLabel}
                  </span>
                )}
              </p>
            </div>

            <Link
              href={`/properties/${property.slug}`}
              className="block font-display text-2xl leading-snug tracking-tight text-ink transition-colors group-hover:text-dusk-ink"
            >
              {property.title}
            </Link>

            <p className="text-sm text-stone">
              {property.location.area}, {property.location.city}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink/80">
              {typeof property.bedrooms === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-stone" aria-hidden="true" />
                  <span>{property.bedrooms} bd</span>
                </span>
              )}
              {typeof property.bathrooms === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-stone" aria-hidden="true" />
                  <span>{property.bathrooms} ba</span>
                </span>
              )}
              {typeof property.sizeSqm === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize2
                    className="h-3.5 w-3.5 text-stone"
                    aria-hidden="true"
                  />
                  <span>{property.sizeSqm} m²</span>
                </span>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${property.title} on WhatsApp`}
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-ember hover:bg-ember hover:text-basalt"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>

      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${property.title} photo gallery`}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-basalt p-0 text-ivory sm:bg-basalt/95 sm:p-6"
            onClick={() => setLightboxOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between gap-3 sm:static sm:mb-4 sm:w-full sm:max-w-5xl">
              <div className="min-w-0">
                <p className="truncate font-display text-xl text-ivory sm:text-2xl">
                  {property.title}
                </p>
                <p className="text-xs text-stone">
                  Photo {activeIndex + 1} of {images.length}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/properties/${property.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ember px-4 text-xs font-medium text-basalt"
                >
                  <span>View property</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close gallery"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-ivory/20 bg-basalt/80 text-ivory backdrop-blur-sm hover:border-ember"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className="relative flex h-full w-full max-w-6xl items-center justify-center sm:h-auto sm:gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {hasMultiple && (
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-3 z-20 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-basalt/70 text-ivory backdrop-blur-sm hover:border-ember sm:static sm:translate-y-0 sm:bg-basalt/80"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
              )}

              <div className="relative h-[78svh] w-full overflow-hidden bg-basalt sm:h-auto sm:aspect-[16/10] sm:rounded-[20px] sm:bg-graphite">
                <Image
                  src={images[activeIndex]}
                  alt={`${property.title} — full view ${activeIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {hasMultiple && (
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute top-1/2 right-3 z-20 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-basalt/70 text-ivory backdrop-blur-sm hover:border-ember sm:static sm:translate-y-0 sm:bg-basalt/80"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
