import type { Property, PropertyStatus, PropertyType } from "@/types";

export type PropertySort = "newest" | "price-asc" | "price-desc";

export interface PropertyFilterState {
  q: string;
  status: PropertyStatus | "all";
  type: PropertyType | "all";
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  sort: PropertySort;
}

export const DEFAULT_FILTERS: PropertyFilterState = {
  q: "",
  status: "all",
  type: "all",
  city: "all",
  minPrice: "",
  maxPrice: "",
  bedrooms: "any",
  sort: "newest",
};

export interface PricePreset {
  label: string;
  min: string;
  max: string;
}

export const PRICE_PRESETS: PricePreset[] = [
  { label: "Up to ₦100M", min: "", max: "100000000" },
  { label: "₦100M – ₦500M", min: "100000000", max: "500000000" },
  { label: "₦500M – ₦1.5B", min: "500000000", max: "1500000000" },
  { label: "₦1.5B+", min: "1500000000", max: "" },
];

export function deriveLocationOptions(items: Property[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.location.city) set.add(item.location.city);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function parseFiltersFromSearchParams(
  params: URLSearchParams
): PropertyFilterState {
  const sortParam = params.get("sort");
  const sort: PropertySort =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "newest";

  const statusParam = params.get("status");
  const status: PropertyFilterState["status"] =
    statusParam === "for-sale" ||
    statusParam === "for-rent" ||
    statusParam === "off-plan" ||
    statusParam === "sold"
      ? statusParam
      : "all";

  const typeParam = params.get("type");
  const type: PropertyFilterState["type"] =
    typeParam === "apartment" ||
    typeParam === "duplex" ||
    typeParam === "detached" ||
    typeParam === "terrace" ||
    typeParam === "land" ||
    typeParam === "commercial"
      ? typeParam
      : "all";

  return {
    q: params.get("q") ?? "",
    status,
    type,
    city: params.get("city") ?? "all",
    minPrice: params.get("min") ?? "",
    maxPrice: params.get("max") ?? "",
    bedrooms: params.get("beds") ?? "any",
    sort,
  };
}

export function serializeFiltersToSearchParams(
  filters: PropertyFilterState,
  extra?: { page?: number }
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.city !== "all") params.set("city", filters.city);
  if (filters.minPrice.trim()) params.set("min", filters.minPrice.trim());
  if (filters.maxPrice.trim()) params.set("max", filters.maxPrice.trim());
  if (filters.bedrooms !== "any") params.set("beds", filters.bedrooms);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (extra?.page && extra.page > 1) params.set("page", String(extra.page));
  return params;
}

export function filterAndSortProperties(
  items: Property[],
  filters: PropertyFilterState
): Property[] {
  const query = filters.q.trim().toLowerCase();
  const minVal = filters.minPrice ? Number(filters.minPrice) : null;
  const maxVal = filters.maxPrice ? Number(filters.maxPrice) : null;
  const minBeds =
    filters.bedrooms !== "any" ? Number(filters.bedrooms) : null;

  const filtered = items.filter((item) => {
    if (query) {
      const haystack =
        `${item.title} ${item.location.area} ${item.location.city} ${item.location.state}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }

    if (filters.type !== "all" && item.type !== filters.type) {
      return false;
    }

    if (filters.city !== "all" && item.location.city !== filters.city) {
      return false;
    }

    if (minVal !== null && Number.isFinite(minVal) && item.price < minVal) {
      return false;
    }

    if (maxVal !== null && Number.isFinite(maxVal) && item.price > maxVal) {
      return false;
    }

    if (minBeds !== null && Number.isFinite(minBeds)) {
      if (typeof item.bedrooms !== "number" || item.bedrooms < minBeds) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered];
  if (filters.sort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }

  return sorted;
}
