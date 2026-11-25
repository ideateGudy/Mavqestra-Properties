const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount in Nigerian Naira (₦).
 */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
