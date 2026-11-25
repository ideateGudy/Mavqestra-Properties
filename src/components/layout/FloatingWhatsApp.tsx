"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gsap, useGSAP } from "@/lib/gsap";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (!btnRef.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.to(btnRef.current, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 16,
        duration: prefersReduced ? 0 : 0.3,
        ease: "power2.out",
        pointerEvents: visible ? "auto" : "none",
      });
    },
    { scope: btnRef, dependencies: [visible] }
  );

  const href = buildWhatsAppUrl(siteConfig.defaultWhatsAppMessage);

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MAVQESTRA PROPERTIES on WhatsApp"
      tabIndex={visible ? 0 : -1}
      style={{ opacity: 0, pointerEvents: "none" }}
      className="fixed right-5 bottom-5 z-40 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-medium text-basalt shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
