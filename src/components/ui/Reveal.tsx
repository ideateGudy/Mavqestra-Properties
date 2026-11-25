"use client";

import { useRef, type ReactNode } from "react";
import { revealOnScroll, useGSAP } from "@/lib/gsap";

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
      revealOnScroll([el], el, { delay });
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
      const items = container.querySelectorAll<HTMLElement>(selector);
      revealOnScroll(items, container);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
