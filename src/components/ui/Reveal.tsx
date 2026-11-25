"use client";

import { useRef, type ReactNode } from "react";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: MOTION.distance },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          delay,
          ease: MOTION.ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealBatch({
  children,
  className = "",
  selector = "[data-reveal-item]",
}: {
  children: ReactNode;
  className?: string;
  selector?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const items = container.querySelectorAll<HTMLElement>(selector);
      if (items.length === 0) return;

      gsap.set(items, { opacity: 0, y: MOTION.distance });

      ScrollTrigger.batch(items, {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: MOTION.duration,
            stagger: MOTION.stagger,
            ease: MOTION.ease,
            overwrite: true,
          });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
