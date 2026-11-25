import { siteConfig } from "@/config/site";

/**
 * Builds a wa.me deep link with an encoded pre-filled message.
 * Strips any non-digit characters from the target phone number.
 */
export function buildWhatsAppUrl(
  message: string,
  phone: string = siteConfig.whatsappNumber
): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
