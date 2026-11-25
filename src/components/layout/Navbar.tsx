"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gsap, useGSAP } from "@/lib/gsap";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/valuation", label: "Sell / Valuation" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const isHome = pathname === "/";
  const isOverHero = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 120) {
        setNavHidden(false);
      } else if (y > lastScrollY.current + 10) {
        setNavHidden(true);
      } else if (y < lastScrollY.current - 10) {
        setNavHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.to(headerRef.current, {
        y: navHidden && !menuOpen ? -96 : 0,
        duration: prefersReduced ? 0 : 0.3,
        ease: "power2.out",
      });
    },
    { scope: headerRef, dependencies: [navHidden, menuOpen] }
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || !menuRef.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const items = menuRef.current.querySelectorAll("[data-menu-item]");
      if (prefersReduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    },
    { scope: menuRef, dependencies: [menuOpen] }
  );

  const consultationUrl = buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2"
      >
        <nav
          aria-label="Primary navigation"
          className={`flex items-center justify-between rounded-full border px-4 py-2 transition-colors duration-300 ${
            isOverHero
              ? "border-ivory/20 bg-basalt/45 text-ivory backdrop-blur-md"
              : "border-sand bg-ivory/95 text-basalt shadow-sm backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center rounded-full px-2"
            aria-label={`${siteConfig.name} home`}
          >
            <Logo
              variant="full"
              tone={isOverHero ? "light" : "dark"}
              className="text-[13px] sm:text-[14px]"
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm transition-colors ${
                      active
                        ? isOverHero
                          ? "bg-ivory/15 text-ivory font-medium"
                          : "bg-sand/70 text-basalt font-medium"
                        : isOverHero
                          ? "text-ivory/80 hover:text-ivory"
                          : "text-basalt/75 hover:text-basalt"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-ember px-5 text-sm font-medium text-basalt transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex"
            >
              <span>Book consultation</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors md:hidden ${
                isOverHero
                  ? "text-ivory hover:bg-ivory/10"
                  : "text-basalt hover:bg-sand/60"
              }`}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-basalt px-6 pt-28 pb-10 text-ivory md:hidden"
        >
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href} data-menu-item>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-[52px] items-center justify-between border-b border-graphite py-3 font-display text-3xl tracking-tight ${
                      active ? "text-ember" : "text-ivory"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-5 w-5 text-stone" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="space-y-6" data-menu-item>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ember px-6 text-base font-medium text-basalt"
            >
              <span>Book consultation on WhatsApp</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="space-y-1 text-sm text-stone">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phoneDisplay}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
