import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ValuationForm } from "@/components/valuation/ValuationForm";

export const metadata: Metadata = {
  title: "Sell & Valuation",
  description:
    "Request a confidential, complimentary property valuation from MAVQESTRA PROPERTIES.",
};

export default function ValuationPage() {
  return (
    <main className="min-h-screen bg-surface pt-32 pb-24 text-ink">
      <div className="mx-auto max-w-5xl space-y-12 px-6 md:px-10">
        <header className="space-y-4 border-b border-border pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-dusk-ink">
            Sell with MAVQESTRA
          </p>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Find out what your property is worth.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-stone">
            Share a few details about your home or titled land. We prepare an
            evidence-led market range and follow up directly on WhatsApp.
          </p>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {siteConfig.valuationReassurances.map((item) => (
              <div
                key={item.title}
                className="rounded-[20px] border border-border bg-surface-elevated p-5"
              >
                <p className="font-display text-xl text-ink">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </header>

        <ValuationForm />
      </div>
    </main>
  );
}
