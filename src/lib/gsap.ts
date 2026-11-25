"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const MOTION = {
  duration: 0.55,
  ease: "power2.out",
  distance: 18,
  stagger: 0.08,
} as const;

/**
 * Safely animates elements into view on scroll without ever leaving them
 * stuck at opacity: 0 after client-side navigation or fast scrolling.
 */
export function revealOnScroll(
  targets: Element[] | NodeListOf<Element>,
  trigger: Element,
  options?: { stagger?: number; delay?: number }
) {
  const list = Array.from(targets) as HTMLElement[];
  if (list.length === 0) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) {
    gsap.set(list, { opacity: 1, y: 0 });
    return;
  }

  let revealed = false;
  const play = () => {
    if (revealed) return;
    revealed = true;
    gsap.to(list, {
      opacity: 1,
      y: 0,
      duration: MOTION.duration,
      delay: options?.delay ?? 0,
      stagger: options?.stagger ?? MOTION.stagger,
      ease: MOTION.ease,
      overwrite: "auto",
      clearProps: "transform",
    });
  };

  const rect = trigger.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.92) {
    gsap.set(list, { opacity: 0, y: MOTION.distance });
    play();
    return;
  }

  gsap.set(list, { opacity: 0, y: MOTION.distance });

  ScrollTrigger.create({
    trigger,
    start: "top 90%",
    once: true,
    onEnter: play,
    onEnterBack: play,
    onRefresh: (self) => {
      if (self.progress > 0 || trigger.getBoundingClientRect().top < window.innerHeight * 0.92) {
        play();
      }
    },
  });
}

export { gsap, ScrollTrigger, useGSAP };
