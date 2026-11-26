import { Suspense } from "react";
import type { Metadata } from "next";
import { properties } from "@/data/properties";
import { PropertiesCatalogue } from "@/components/properties/PropertiesCatalogue";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse curated residential and commercial properties across Lagos and Abuja.",
};

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-surface pt-32 pb-24 text-ink">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <header className="mb-10 space-y-3 border-b border-border pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk-ink">
            Portfolio
          </p>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Properties
          </h1>
        </header>

        <Suspense
          fallback={
            <p className="py-12 text-sm text-stone">Loading properties...</p>
          }
        >
          <PropertiesCatalogue items={properties} />
        </Suspense>
      </div>
    </main>
  );
}
