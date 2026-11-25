import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    id: "buy",
    title: "Buy",
    summary: "Verified residences & land",
    detail:
      "Private access to vetted homes and titled plots across Ikoyi, Victoria Island, Lekki, and Abuja.",
  },
  {
    id: "sell",
    title: "Sell",
    summary: "Discreet disposition",
    detail:
      "Architectural presentation, qualified buyer screening, and confidential negotiation from mandate to closing.",
  },
  {
    id: "rent",
    title: "Rent",
    summary: "Corporate & private lettings",
    detail:
      "Turnkey apartments, penthouses, and diplomatic residences structured with clear tenancy terms.",
  },
  {
    id: "valuation",
    title: "Valuation",
    summary: "Market-backed pricing",
    detail:
      "Evidence-led property appraisals grounded in comparable neighbourhood transactions and build quality.",
  },
  {
    id: "advisory",
    title: "Property advisory",
    summary: "Portfolio & title diligence",
    detail:
      "Independent counsel on acquisition timing, development feasibility, and title verification.",
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Consult",
    description:
      "Share your brief, timeline, and budget in a focused private conversation.",
  },
  {
    step: "02",
    title: "Shortlist",
    description:
      "Receive a curated selection of title-verified properties matched to your criteria.",
  },
  {
    step: "03",
    title: "Inspect",
    description:
      "Walk each residence or site in person or via live architectural video.",
  },
  {
    step: "04",
    title: "Close",
    description:
      "Coordinate legal diligence, documentation, and handover with full clarity.",
  },
];
