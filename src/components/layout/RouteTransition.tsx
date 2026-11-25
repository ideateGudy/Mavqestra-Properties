"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        ScrollTrigger.refresh();
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: MOTION.ease,
          clearProps: "transform",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    },
    { scope: wrapperRef, dependencies: [pathname] }
  );

  return (
    <div ref={wrapperRef} className="flex-1">
      {children}
    </div>
  );
}
