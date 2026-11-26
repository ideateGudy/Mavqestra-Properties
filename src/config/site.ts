export const siteConfig = {
  name: "MAVQESTRA PROPERTIES",
  shortName: "MAVQESTRA",
  tagline: "Architectural homes & discreet property advisory.",
  description:
    "MAVQESTRA PROPERTIES — curated residential sales, lettings, and property valuation across Lagos and Abuja, Nigeria.",
  url: "https://mavqestra.example", // TODO(client): replace with production domain

  // TODO(client): replace with official WhatsApp number (international format, digits only)
  whatsappNumber: "2349033069636",
  // TODO(client): replace with official phone display string
  phoneDisplay: "+234 903 306 9636",
  // TODO(client): replace with official contact email
  email: "concierge@mavqestra.example",
  // TODO(client): replace with official office address
  address: "14 Bourdillon Road, Ikoyi, Lagos",

  socials: {
    // TODO(client): replace with official social URLs
    instagram: "https://instagram.com/mavqestraproperties",
    linkedin: "https://linkedin.com/company/mavqestra-properties",
    x: "https://x.com/mavqestraprop",
  },

  // TODO(client): replace with official Google Business Profile review link & metrics
  googleReviewUrl: "https://g.page/r/TODO-client-replace/review",
  googleRating: 4.8,
  googleReviewCount: 82,

  propertiesPerPage: 9,

  hero: {
    headline: "Exceptional homes. Built with trust.",
    subheadline:
      "Curated residences, verified land, and discreet valuation across Nigeria.",
    primaryCta: "Explore properties",
    secondaryCta: "Book consultation",
  },

  showcase: {
    eyebrow: "Architectural Detail",
    headline: "Crafted for light, proportion, and permanence.",
    subheadline:
      "Every residence is evaluated for structural integrity, natural light, and lasting neighbourhood value.",
    ctaLabel: "Browse residences",
    ctaHref: "/properties",
  },

  defaultWhatsAppMessage:
    "Hello MAVQESTRA PROPERTIES, I would like to book a private property consultation.",

  // TODO(client): replace with verified company figures
  stats: [
    { value: 12, suffix: "+", label: "Years in Nigerian real estate" },
    { value: 140, suffix: "+", label: "Residences & plots placed" },
    { value: 4, suffix: "", label: "Core cities served" },
    { value: 320, suffix: "+", label: "Private & diaspora clients" },
  ],

  // TODO(client): replace with official company story
  about: {
    eyebrow: "About MAVQESTRA",
    headline: "Architecture chosen with patience, acquired with clarity.",
    body: [
      "MAVQESTRA PROPERTIES advises buyers, families, and institutional investors across Ikoyi, Victoria Island, Lekki, and Abuja.",
      "Every listing is vetted for title integrity, build quality, and long-term neighbourhood value before it ever reaches a private viewing.",
    ],
    image: "/images/hero-poster-end.jpg",
    imageAlt: "Dusk-lit contemporary residence curated by MAVQESTRA PROPERTIES",
    ctaLabel: "Explore available homes",
    ctaHref: "/properties",
  },

  // TODO(client): replace with preferred valuation reassurance copy
  valuationReassurances: [
    {
      title: "Complimentary appraisal",
      description: "Free market assessment with zero listing fees upfront.",
    },
    {
      title: "No obligation",
      description: "Use the valuation for planning, refinancing, or sale.",
    },
    {
      title: "24-hour response",
      description: "Direct follow-up from a senior advisor within one business day.",
    },
  ],
} as const;
