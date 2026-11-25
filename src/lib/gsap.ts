"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const MOTION = {
  duration: 0.6,
  ease: "power2.out",
  distance: 20,
  stagger: 0.08,
} as const;

export { gsap, ScrollTrigger, useGSAP };
