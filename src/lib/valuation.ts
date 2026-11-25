import { formatNaira } from "@/lib/format";

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export interface ValuationFormData {
  propertyType: string;
  state: string;
  city: string;
  area: string;
  bedrooms: string;
  sizeSqm: string;
  condition: string;
  expectedPrice: string;
  timeline: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

/**
 * Validates Nigerian phone numbers in +234XXXXXXXXXX, 234XXXXXXXXXX, or 0XXXXXXXXXX formats.
 */
export function isValidNigerianPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s()-]/g, "");
  return /^(?:\+234|234|0)(?:70|80|81|90|91|71)\d{8}$/.test(cleaned);
}

export function normalizeNigerianPhone(raw: string): string {
  const cleaned = raw.replace(/[\s()-]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("234")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`;
  return cleaned;
}

export function isValidOptionalEmail(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function buildValuationWhatsAppMessage(data: ValuationFormData): string {
  const priceLine = data.expectedPrice.trim()
    ? formatNaira(Number(data.expectedPrice))
    : "Not specified";

  const lines = [
    "Hello MAVQESTRA PROPERTIES, I would like to request a property valuation.",
    "",
    "PROPERTY DETAILS",
    `• Type: ${data.propertyType}`,
    `• Location: ${data.area}, ${data.city}, ${data.state}`,
    data.bedrooms ? `• Bedrooms: ${data.bedrooms}` : null,
    data.sizeSqm ? `• Size: ${data.sizeSqm} m²` : null,
    `• Condition: ${data.condition}`,
    "",
    "VALUATION CONTEXT",
    `• Expected price: ${priceLine}`,
    `• Timeline / Reason: ${data.timeline}`,
    data.notes.trim() ? `• Notes: ${data.notes.trim()}` : null,
    "",
    "CONTACT",
    `• Name: ${data.name.trim()}`,
    `• Phone: ${normalizeNigerianPhone(data.phone)}`,
    data.email.trim() ? `• Email: ${data.email.trim()}` : null,
  ];

  return lines.filter((l): l is string => l !== null).join("\n");
}
