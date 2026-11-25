"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Property, PropertyStatus, PropertyType } from "@/types";
import {
  DEFAULT_FILTERS,
  PRICE_PRESETS,
  deriveLocationOptions,
  filterAndSortProperties,
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
  type PropertyFilterState,
  type PropertySort,
} from "@/lib/filters";
import { formatNaira } from "@/lib/format";
import { PropertyCard } from "@/components/properties/PropertyCard";

const STATUS_OPTIONS: { value: PropertyStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "for-sale", label: "For Sale" },
  { value: "for-rent", label: "For Rent" },
  { value: "off-plan", label: "Off-Plan" },
  { value: "sold", label: "Sold" },
];

const TYPE_OPTIONS: { value: PropertyType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "detached", label: "Detached" },
  { value: "duplex", label: "Duplex" },
  { value: "terrace", label: "Terrace" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const BEDROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

interface PropertiesCatalogueProps {
  items: Property[];
}

export function PropertiesCatalogue({ items }: PropertiesCatalogueProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const resultsTopRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const cities = useMemo(() => deriveLocationOptions(items), [items]);
  const results = useMemo(
    () => filterAndSortProperties(items, filters),
    [items, filters]
  );

  const pageSize = siteConfig.propertiesPerPage;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const rawPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1
      ? Math.min(Math.floor(rawPage), totalPages)
      : 1;

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, currentPage, pageSize]);

  const updateFilters = (patch: Partial<PropertyFilterState>) => {
    const next = { ...filters, ...patch };
    const params = serializeFiltersToSearchParams(next);
    const qs = params.toString();
    router.replace(qs ? `/properties?${qs}` : "/properties", {
      scroll: false,
    });
  };

  const clearAll = () => {
    router.replace("/properties", { scroll: false });
  };

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    const params = serializeFiltersToSearchParams(filters, { page: clamped });
    const qs = params.toString();
    router.replace(qs ? `/properties?${qs}` : "/properties", {
      scroll: false,
    });
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    resultsTopRef.current?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const activeChips: { key: string; label: string; onClear: () => void }[] = [];
  if (filters.q.trim()) {
    activeChips.push({
      key: "q",
      label: `Search: "${filters.q.trim()}"`,
      onClear: () => updateFilters({ q: "" }),
    });
  }
  if (filters.status !== "all") {
    activeChips.push({
      key: "status",
      label:
        STATUS_OPTIONS.find((s) => s.value === filters.status)?.label ??
        filters.status,
      onClear: () => updateFilters({ status: "all" }),
    });
  }
  if (filters.type !== "all") {
    activeChips.push({
      key: "type",
      label:
        TYPE_OPTIONS.find((t) => t.value === filters.type)?.label ??
        filters.type,
      onClear: () => updateFilters({ type: "all" }),
    });
  }
  if (filters.city !== "all") {
    activeChips.push({
      key: "city",
      label: filters.city,
      onClear: () => updateFilters({ city: "all" }),
    });
  }
  if (filters.bedrooms !== "any") {
    activeChips.push({
      key: "beds",
      label: `${filters.bedrooms}+ bedrooms`,
      onClear: () => updateFilters({ bedrooms: "any" }),
    });
  }
  if (filters.minPrice) {
    activeChips.push({
      key: "min",
      label: `Min ${formatNaira(Number(filters.minPrice))}`,
      onClear: () => updateFilters({ minPrice: "" }),
    });
  }
  if (filters.maxPrice) {
    activeChips.push({
      key: "max",
      label: `Max ${formatNaira(Number(filters.maxPrice))}`,
      onClear: () => updateFilters({ maxPrice: "" }),
    });
  }

  const filterControls = (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label
            htmlFor="filter-status"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
          >
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) =>
              updateFilters({
                status: e.target.value as PropertyFilterState["status"],
              })
            }
            className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-type"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
          >
            Property Type
          </label>
          <select
            id="filter-type"
            value={filters.type}
            onChange={(e) =>
              updateFilters({
                type: e.target.value as PropertyFilterState["type"],
              })
            }
            className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-city"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
          >
            City
          </label>
          <select
            id="filter-city"
            value={filters.city}
            onChange={(e) => updateFilters({ city: e.target.value })}
            className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-beds"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-stone"
          >
            Bedrooms
          </label>
          <select
            id="filter-beds"
            value={filters.bedrooms}
            onChange={(e) => updateFilters({ bedrooms: e.target.value })}
            className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt"
          >
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 border-t border-sand pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone">
          Price Range (₦)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="filter-min-price" className="sr-only">
              Minimum price in Naira
            </label>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min ₦"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
              className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt placeholder:text-stone"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="sr-only">
              Maximum price in Naira
            </label>
            <input
              id="filter-max-price"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max ₦"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
              className="min-h-[44px] w-full rounded-xl border border-sand bg-ivory px-3 text-sm text-basalt placeholder:text-stone"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              filters.minPrice === preset.min &&
              filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  updateFilters({ minPrice: preset.min, maxPrice: preset.max })
                }
                className={`min-h-[36px] rounded-full border px-3 text-xs transition-colors ${
                  active
                    ? "border-basalt bg-basalt text-ivory"
                    : "border-sand bg-ivory text-basalt hover:border-basalt"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={resultsTopRef} className="scroll-mt-28 space-y-8">
      {/* Top search + sort + mobile filter trigger */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <label htmlFor="property-search" className="sr-only">
            Search properties by title, area, or city
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone"
            aria-hidden="true"
          />
          <input
            id="property-search"
            type="search"
            value={filters.q}
            onChange={(e) => updateFilters({ q: e.target.value })}
            placeholder="Search by title, area (e.g. Ikoyi, Maitama), or city..."
            className="min-h-[48px] w-full rounded-full border border-sand bg-ivory pr-4 pl-11 text-sm text-basalt placeholder:text-stone"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-sand bg-ivory px-5 text-sm font-medium text-basalt lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1.5 text-xs text-basalt">
                {activeChips.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="property-sort" className="sr-only">
              Sort properties
            </label>
            <select
              id="property-sort"
              value={filters.sort}
              onChange={(e) =>
                updateFilters({ sort: e.target.value as PropertySort })
              }
              className="min-h-[48px] rounded-full border border-sand bg-ivory px-5 text-sm text-basalt"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filter chips + result count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onClear}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-sand bg-sand/40 px-3.5 text-xs text-basalt hover:border-basalt"
            >
              <span>{chip.label}</span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="min-h-[36px] px-2 text-xs font-medium text-dusk underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="text-sm text-stone" aria-live="polite">
          Showing {results.length}{" "}
          {results.length === 1 ? "property" : "properties"}
        </p>
      </div>

      {/* Desktop sticky sidebar + grid */}
      <div className="grid gap-10 lg:grid-cols-12">
        <aside
          aria-label="Property filters"
          className="hidden lg:col-span-3 lg:block"
        >
          <div className="sticky top-28 rounded-[20px] border border-sand bg-ivory p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-tight text-basalt">
                Filter
              </h2>
              {JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-dusk hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            {filterControls}
          </div>
        </aside>

        <div className="lg:col-span-9">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[20px] border border-sand bg-ivory px-6 py-20 text-center">
              <Building2 className="h-10 w-10 text-stone" aria-hidden="true" />
              <h2 className="mt-4 font-display text-3xl tracking-tight text-basalt">
                No matching properties
              </h2>
              <p className="mt-2 max-w-md text-sm text-stone">
                Try broadening your price range or clearing a filter to see more
                residences.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-ember px-6 text-sm font-medium text-basalt"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {paginatedResults.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-sand pt-8"
            >
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-full border border-sand bg-ivory px-4 text-sm text-basalt transition-colors hover:border-basalt disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border px-3.5 text-sm font-medium transition-colors ${
                      isCurrent
                        ? "border-basalt bg-basalt text-ivory"
                        : "border-sand bg-ivory text-basalt hover:border-basalt"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-full border border-sand bg-ivory px-4 text-sm text-basalt transition-colors hover:border-basalt disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter properties"
          className="fixed inset-0 z-50 flex items-end bg-basalt/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-[28px] bg-ivory p-6 pb-8 text-basalt shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-sand pb-4">
              <h2 className="font-display text-2xl tracking-tight">
                Filter properties
              </h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-sand/50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {filterControls}

            <div className="mt-6 flex items-center gap-3 border-t border-sand pt-4">
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setSheetOpen(false);
                }}
                className="min-h-[48px] flex-1 rounded-full border border-sand text-sm font-medium text-basalt"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="min-h-[48px] flex-1 rounded-full bg-ember text-sm font-medium text-basalt"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
