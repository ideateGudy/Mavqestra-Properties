import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, MessageCircle } from "lucide-react";
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
  const status = statusStyles[property.status];
  const enquiryText = `Hello MAVQESTRA PROPERTIES, I would like to enquire about "${property.title}" in ${property.location.area}, ${property.location.city} (${formatNaira(property.price)}${property.priceLabel ? ` ${property.priceLabel}` : ""}).`;
  const whatsappUrl = buildWhatsAppUrl(enquiryText);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-border bg-surface-elevated transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-graphite"
      >
        <Image
          src={property.images[0] ?? "/images/properties/prop-01.jpg"}
          alt={`${property.title} in ${property.location.area}, ${property.location.city}`}
          fill
          sizes="(max-width: 767px) 85vw, (max-width: 1200px) 48vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span
          className={`absolute top-4 left-4 rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm ${status.className}`}
        >
          {status.label}
        </span>
      </Link>

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
                <Maximize2 className="h-3.5 w-3.5 text-stone" aria-hidden="true" />
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
  );
}
