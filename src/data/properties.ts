import type { Property, PropertyGallerySection } from "@/types";

// TODO(client): replace all 12 placeholder listings with verified MAVQESTRA PROPERTIES inventory.
export const properties: Property[] = [
  {
    id: "prop-01",
    slug: "bourdillon-courtyard-residence-ikoyi",
    title: "Bourdillon Courtyard Residence",
    status: "for-sale",
    type: "detached",
    price: 1850000000,
    location: { area: "Ikoyi", city: "Lagos", state: "Lagos" },
    bedrooms: 5,
    bathrooms: 6,
    toilets: 7,
    sizeSqm: 920,
    images: ["/images/properties/prop-01.jpg", "/images/properties/prop-02.jpg"],
    description:
      "Placeholder listing: five-bedroom contemporary detached residence with double-height living volume, private pool courtyard, and two-room staff quarters.",
    features: [
      "Private swimming pool",
      "Double-height reception",
      "Fitted dry & wet kitchens",
      "24-hour power infrastructure",
      "Staff quarters (2 rooms)",
    ],
    featured: true,
    addedAt: "2026-10-18",
  },
  {
    id: "prop-02",
    slug: "maitama-crescent-villa-abuja",
    title: "Maitama Crescent Villa",
    status: "for-sale",
    type: "detached",
    price: 1450000000,
    location: { area: "Maitama", city: "Abuja", state: "FCT" },
    bedrooms: 6,
    bathrooms: 6,
    toilets: 7,
    sizeSqm: 1100,
    images: ["/images/properties/prop-02.jpg", "/images/properties/prop-03.jpg"],
    description:
      "Placeholder listing: elevated six-bedroom villa with limestone facade, private cinema, landscaped gardens, and gatehouse security.",
    features: [
      "Certificate of Occupancy",
      "Private cinema room",
      "Landscaped garden",
      "4-car covered carport",
    ],
    featured: true,
    addedAt: "2026-10-12",
  },
  {
    id: "prop-03",
    slug: "victoria-island-sky-penthouse",
    title: "Victoria Island Sky Penthouse",
    status: "for-rent",
    type: "apartment",
    price: 65000000,
    priceLabel: "per annum",
    location: { area: "Victoria Island", city: "Lagos", state: "Lagos" },
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 430,
    images: ["/images/properties/prop-03.jpg", "/images/properties/prop-04.jpg"],
    description:
      "Placeholder listing: full-floor penthouse overlooking the Atlantic shoreline with wrap-around terrace, private lift lobby, and concierge desk.",
    features: [
      "Private elevator access",
      "Wrap-around ocean terrace",
      "24/7 concierge & security",
      "Residents' lap pool & gym",
    ],
    featured: true,
    addedAt: "2026-10-08",
  },
  {
    id: "prop-04",
    slug: "lekki-phase-one-modern-duplex",
    title: "Lekki Phase 1 Modern Duplex",
    status: "off-plan",
    type: "duplex",
    price: 540000000,
    location: { area: "Lekki Phase 1", city: "Lagos", state: "Lagos" },
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 480,
    images: ["/images/properties/prop-04.jpg", "/images/properties/prop-05.jpg"],
    description:
      "Placeholder listing: architect-designed semi-detached duplex currently in finishing stage, featuring cantilevered balconies and smart-home wiring.",
    features: [
      "Flexible milestone payment",
      "Smart-home pre-wiring",
      "Solar-hybrid readiness",
      "Borehole & water treatment",
    ],
    featured: true,
    addedAt: "2026-10-03",
  },
  {
    id: "prop-05",
    slug: "banana-island-waterfront-parcel",
    title: "Banana Island Waterfront Parcel",
    status: "for-sale",
    type: "land",
    price: 3200000000,
    location: { area: "Banana Island", city: "Lagos", state: "Lagos" },
    sizeSqm: 1500,
    images: [
      "/images/properties/prop-05.jpg",
      "/images/properties/prop-01.jpg",
      "/images/properties/prop-02.jpg",
    ],
    description:
      "Placeholder listing: prime fenced residential plot with direct lagoon frontage and verified Governor's Consent.",
    features: [
      "Governor's Consent",
      "Lagoon frontage",
      "Paved estate access",
      "Ready for immediate build",
    ],
    featured: false,
    addedAt: "2026-09-25",
  },
  {
    id: "prop-06",
    slug: "asokoro-diplomatic-terrace",
    title: "Asokoro Diplomatic Terrace",
    status: "for-sale",
    type: "terrace",
    price: 490000000,
    location: { area: "Asokoro", city: "Abuja", state: "FCT" },
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 380,
    images: [
      "/images/properties/prop-06.jpg",
      "/images/properties/prop-03.jpg",
    ],
    description:
      "Placeholder listing: four-bedroom corner terrace inside a quiet gated enclave with private courtyard and dedicated backup generator.",
    features: [
      "Gated diplomatic enclave",
      "Corner-piece garden",
      "Fitted kitchen appliances",
      "Dedicated transformer",
    ],
    featured: false,
    addedAt: "2026-09-19",
  },
  {
    id: "prop-07",
    slug: "eko-atlantic-tower-suite",
    title: "Eko Atlantic Tower Suite",
    status: "for-rent",
    type: "apartment",
    price: 45000000,
    priceLabel: "per annum",
    location: { area: "Eko Atlantic", city: "Lagos", state: "Lagos" },
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    sizeSqm: 290,
    images: [
      "/images/properties/prop-01.jpg",
      "/images/properties/prop-03.jpg",
    ],
    description:
      "Placeholder listing: three-bedroom high-rise apartment with floor-to-ceiling glazing, district cooling, and underground parking.",
    features: [
      "District cooling",
      "Underground parking (2 bays)",
      "Panoramic sea view",
      "Concierge reception",
    ],
    featured: false,
    addedAt: "2026-09-14",
  },
  {
    id: "prop-08",
    slug: "guzape-hillside-residence",
    title: "Guzape Hillside Residence",
    status: "off-plan",
    type: "duplex",
    price: 620000000,
    location: { area: "Guzape", city: "Abuja", state: "FCT" },
    bedrooms: 5,
    bathrooms: 5,
    toilets: 6,
    sizeSqm: 610,
    images: [
      "/images/properties/prop-02.jpg",
      "/images/properties/prop-04.jpg",
    ],
    description:
      "Placeholder listing: split-level hillside duplex designed for natural cross-ventilation and panoramic views over Abuja.",
    features: [
      "Elevated hillside plot",
      "Double-glazed windows",
      "Private study & lounge",
      "12-month completion window",
    ],
    featured: false,
    addedAt: "2026-09-07",
  },
  {
    id: "prop-09",
    slug: "ikoyi-commercial-pavilion",
    title: "Ikoyi Commercial Pavilion",
    status: "for-rent",
    type: "commercial",
    price: 120000000,
    priceLabel: "per annum",
    location: { area: "Ikoyi", city: "Lagos", state: "Lagos" },
    sizeSqm: 850,
    images: [
      "/images/properties/prop-03.jpg",
      "/images/properties/prop-05.jpg",
    ],
    description:
      "Placeholder listing: Grade-A boutique office building suited to family offices, private wealth practices, or design studios.",
    features: [
      "Open-plan floor plates",
      "12-car private forecourt",
      "Fibre-optic backbone",
      "Acoustic glazing",
    ],
    featured: false,
    addedAt: "2026-08-29",
  },
  {
    id: "prop-10",
    slug: "oniru-courtyard-terrace",
    title: "Oniru Courtyard Terrace",
    status: "sold",
    type: "terrace",
    price: 360000000,
    location: { area: "Oniru", city: "Lagos", state: "Lagos" },
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 340,
    images: [
      "/images/properties/prop-04.jpg",
      "/images/properties/prop-06.jpg",
    ],
    description:
      "Placeholder listing: recently closed four-bedroom terrace residence two minutes from Landmark Beachfront.",
    features: [
      "En-suite bedrooms",
      "Rooftop lounge deck",
      "24-hour estate security",
    ],
    featured: false,
    addedAt: "2026-08-20",
  },
  {
    id: "prop-11",
    slug: "wuse-ii-executive-apartment",
    title: "Wuse II Executive Apartment",
    status: "for-sale",
    type: "apartment",
    price: 280000000,
    location: { area: "Wuse II", city: "Abuja", state: "FCT" },
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    sizeSqm: 260,
    images: [
      "/images/properties/prop-05.jpg",
      "/images/properties/prop-03.jpg",
    ],
    description:
      "Placeholder listing: three-bedroom serviced apartment in central Wuse II with private balcony and strong rental yield.",
    features: [
      "Central Wuse II address",
      "Serviced power & water",
      "Elevator & access control",
    ],
    featured: false,
    addedAt: "2026-08-11",
  },
  {
    id: "prop-12",
    slug: "chevron-drive-family-duplex",
    title: "Chevron Drive Family Duplex",
    status: "for-sale",
    type: "duplex",
    price: 310000000,
    location: { area: "Lekki", city: "Lagos", state: "Lagos" },
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sizeSqm: 410,
    images: [
      "/images/properties/prop-06.jpg",
      "/images/properties/prop-04.jpg",
    ],
    description:
      "Placeholder listing: four-bedroom fully detached family home in a serene, flood-free estate off Chevron Drive.",
    features: [
      "Interlocked compound",
      "Fitted kitchen & pantry",
      "Family lounge",
      "Estate security patrol",
    ],
    featured: false,
    addedAt: "2026-08-02",
  },
];

export interface PropertyFeatureMedia {
  label: string;
  image: string;
}

const FEATURE_IMAGE_RULES: { keywords: string[]; image: string }[] = [
  {
    keywords: ["pool", "lap pool"],
    image: "/images/properties/pool.jpg",
  },
  {
    keywords: ["kitchen", "pantry", "appliances"],
    image: "/images/properties/kitchen.jpg",
  },
  {
    keywords: ["bedroom", "en-suite", "staff quarters"],
    image: "/images/properties/bedroom.jpg",
  },
  {
    keywords: ["bathroom", "tub", "shower"],
    image: "/images/properties/bathroom.jpg",
  },
  {
    keywords: [
      "reception",
      "lounge",
      "cinema",
      "study",
      "terrace",
      "sea view",
      "ocean",
      "open-plan",
      "cooling",
      "concierge",
      "elevator",
    ],
    image: "/images/properties/prop-03.jpg",
  },
  {
    keywords: [
      "garden",
      "lagoon",
      "waterfront",
      "estate access",
      "immediate build",
      "rooftop",
    ],
    image: "/images/properties/prop-05.jpg",
  },
  {
    keywords: [
      "smart-home",
      "solar",
      "carport",
      "parking",
      "forecourt",
      "interlocked",
      "glazing",
      "windows",
      "milestone",
      "completion",
    ],
    image: "/images/properties/prop-04.jpg",
  },
  {
    keywords: [
      "security",
      "gated",
      "power",
      "transformer",
      "borehole",
      "water",
      "fibre",
      "access control",
    ],
    image: "/images/properties/prop-06.jpg",
  },
  {
    keywords: ["certificate", "consent", "hillside", "address", "yield"],
    image: "/images/properties/prop-02.jpg",
  },
];

export function getPropertyFeatureMedia(
  property: Property
): PropertyFeatureMedia[] {
  const fallback = property.images[0] ?? "/images/properties/prop-01.jpg";
  return property.features.map((label) => {
    const lower = label.toLowerCase();
    const matched = FEATURE_IMAGE_RULES.find((rule) =>
      rule.keywords.some((kw) => lower.includes(kw))
    );
    return {
      label,
      image: matched ? matched.image : fallback,
    };
  });
}

export function getPropertyGallerySections(
  property: Property
): PropertyGallerySection[] {
  if (property.gallerySections && property.gallerySections.length > 0) {
    return property.gallerySections;
  }

  const exteriorImages =
    property.images.length > 0
      ? property.images
      : ["/images/properties/prop-01.jpg"];

  const featureImages = Array.from(
    new Set(getPropertyFeatureMedia(property).map((f) => f.image))
  );

  if (property.type === "land") {
    return [
      {
        label: "Site & Waterfront",
        images: exteriorImages,
      },
      {
        label: "Features & Infrastructure",
        images: featureImages,
      },
    ];
  }

  return [
    {
      label: "Exterior & Grounds",
      images: exteriorImages,
    },
    {
      label: "Living & Reception",
      images: ["/images/properties/prop-03.jpg", exteriorImages[0]],
    },
    {
      label: "Bedrooms",
      images: ["/images/properties/bedroom.jpg"],
    },
    {
      label: "Bathrooms",
      images: ["/images/properties/bathroom.jpg"],
    },
    {
      label: "Kitchen",
      images: ["/images/properties/kitchen.jpg"],
    },
    {
      label: "Features & Infrastructure",
      images: featureImages,
    },
  ];
}
