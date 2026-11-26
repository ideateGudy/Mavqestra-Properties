import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  Maximize2,
  MessageCircle,
} from "lucide-react";
import { getPropertyGallerySections, properties } from "@/data/properties";
import { siteConfig } from "@/config/site";
import { formatNaira } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyCard } from "@/components/properties/PropertyCard";

export function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) {
    return { title: "Property Not Found" };
  }
  return {
    title: property.title,
    description: `${property.title} in ${property.location.area}, ${property.location.city} — ${formatNaira(property.price)}.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  const propertyUrl = `${siteConfig.url}/properties/${property.slug}`;
  const whatsappMessage = `Hello MAVQESTRA PROPERTIES, I would like to enquire about "${property.title}" (${formatNaira(property.price)}) in ${property.location.area}, ${property.location.city}. Link: ${propertyUrl}`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.type === property.type || p.location.city === property.location.city)
    )
    .slice(0, 3);

  const similarList =
    similar.length > 0
      ? similar
      : properties.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-surface pt-28 pb-24 text-ink">
      <div className="mx-auto max-w-7xl space-y-12 px-6 md:px-10">
        <div>
          <Link
            href="/properties"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-stone transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to all properties</span>
          </Link>
        </div>

        <PropertyGallery
          images={property.images}
          sections={getPropertyGallerySections(property)}
          title={property.title}
        />

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main property details */}
          <div className="space-y-10 lg:col-span-8">
            <header className="space-y-4 border-b border-border pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-ink px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-surface">
                  {property.status.replace("-", " ")}
                </span>
                <span className="rounded-full border border-border px-3.5 py-1 text-xs uppercase tracking-wider text-stone">
                  {property.type}
                </span>
              </div>

              <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
                {property.title}
              </h1>

              <p className="text-base text-stone">
                {property.location.area}, {property.location.city},{" "}
                {property.location.state}
              </p>

              <p className="pt-2 font-display text-3xl tracking-tight text-ink md:text-4xl">
                {formatNaira(property.price)}
                {property.priceLabel && (
                  <span className="ml-2 font-sans text-sm font-normal text-stone">
                    {property.priceLabel}
                  </span>
                )}
              </p>
            </header>

            {/* Key specs */}
            <section aria-label="Key specifications">
              <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-stone">
                Key Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {typeof property.bedrooms === "number" && (
                  <div className="rounded-[20px] border border-border bg-surface-elevated p-4">
                    <BedDouble
                      className="h-5 w-5 text-dusk-ink"
                      aria-hidden="true"
                    />
                    <p className="mt-2 font-display text-2xl text-ink">
                      {property.bedrooms}
                    </p>
                    <p className="text-xs text-stone">Bedrooms</p>
                  </div>
                )}
                {typeof property.bathrooms === "number" && (
                  <div className="rounded-[20px] border border-border bg-surface-elevated p-4">
                    <Bath className="h-5 w-5 text-dusk-ink" aria-hidden="true" />
                    <p className="mt-2 font-display text-2xl text-ink">
                      {property.bathrooms}
                    </p>
                    <p className="text-xs text-stone">Bathrooms</p>
                  </div>
                )}
                {typeof property.toilets === "number" && (
                  <div className="rounded-[20px] border border-border bg-surface-elevated p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-dusk-ink">
                      WC
                    </span>
                    <p className="mt-2 font-display text-2xl text-ink">
                      {property.toilets}
                    </p>
                    <p className="text-xs text-stone">Toilets</p>
                  </div>
                )}
                {typeof property.sizeSqm === "number" && (
                  <div className="rounded-[20px] border border-border bg-surface-elevated p-4">
                    <Maximize2
                      className="h-5 w-5 text-dusk-ink"
                      aria-hidden="true"
                    />
                    <p className="mt-2 font-display text-2xl text-ink">
                      {property.sizeSqm} m²
                    </p>
                    <p className="text-xs text-stone">Approximate Area</p>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section aria-label="Description" className="space-y-3">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
                Overview
              </h2>
              <p className="text-base leading-relaxed text-ink/85">
                {property.description}
              </p>
            </section>

            {/* Features */}
            <section aria-label="Features" className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
                Features &amp; Infrastructure
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-ink"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-dusk-ink"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sticky WhatsApp enquiry card */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-5 rounded-[20px] border border-border bg-basalt p-7 text-ivory">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-ember">
                Private Viewing &amp; Dossier
              </p>
              <h2 className="font-display text-3xl leading-tight tracking-tight">
                Speak with a MAVQESTRA advisor.
              </h2>
              <p className="text-sm leading-relaxed text-stone">
                Request floor plans, title summary, or schedule an in-person or
                live video inspection.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-ember px-6 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <div className="border-t border-graphite pt-4 text-xs text-stone space-y-1">
                <p>Direct line: {siteConfig.phoneDisplay}</p>
                <p>Email: {siteConfig.email}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similarList.length > 0 && (
          <section
            aria-labelledby="similar-heading"
            className="border-t border-border pt-16"
          >
            <h2
              id="similar-heading"
              className="mb-8 font-display text-3xl tracking-tight text-ink md:text-4xl"
            >
              Similar properties
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similarList.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
