import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";

export function FeaturedProperties() {
  const featured = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <section
      aria-labelledby="featured-heading"
      className="border-t border-sand bg-ivory py-[clamp(5rem,10vw,9rem)] text-basalt"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk">
              Selected Portfolio
            </p>
            <h2
              id="featured-heading"
              className="font-display text-4xl leading-[1.06] tracking-tight text-basalt md:text-5xl"
            >
              Featured properties
            </h2>
          </div>

          <Link
            href="/properties"
            className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-basalt/20 px-6 text-sm font-medium text-basalt transition-colors hover:border-ember hover:bg-ember md:self-auto"
          >
            <span>View all properties</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile: horizontal swipeable rail; Desktop: 2-column architectural grid */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
          {featured.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className="w-[84vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
