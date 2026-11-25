import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CurrentYear } from "@/components/layout/CurrentYear";

export function Footer() {
  const consultationUrl = buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage);

  return (
    <footer className="border-t border-graphite bg-basalt text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-5">
            <Logo variant="full" tone="light" className="text-[16px]" />
            <p className="max-w-sm text-sm leading-relaxed text-stone">
              {siteConfig.tagline}
            </p>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/20 px-5 text-sm font-medium text-ivory transition-colors hover:border-ember hover:text-ember"
            >
              <span>Book a private consultation</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
              Navigation
            </h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[44px] items-center text-ivory/85 transition-colors hover:text-ember"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="inline-flex min-h-[44px] items-center text-ivory/85 transition-colors hover:text-ember"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/valuation"
                  className="inline-flex min-h-[44px] items-center text-ivory/85 transition-colors hover:text-ember"
                >
                  Sell / Valuation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
              Contact &amp; Socials
            </h2>
            <address className="space-y-2 not-italic text-sm text-ivory/85">
              <p>{siteConfig.address}</p>
              <p>
                <a
                  href={`tel:${siteConfig.phoneDisplay.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-ember"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-ember"
                >
                  {siteConfig.email}
                </a>
              </p>
            </address>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-stone">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-ivory"
              >
                Instagram
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-ivory"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center transition-colors hover:text-ivory"
              >
                X
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-graphite pt-8 text-xs text-stone md:flex-row md:items-center md:justify-between">
          <p>
            &copy; <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>
            All prices in Nigerian Naira (₦). No personal data is stored on this
            site; enquiries open directly in WhatsApp in line with the NDPA.
          </p>
        </div>
      </div>
    </footer>
  );
}
