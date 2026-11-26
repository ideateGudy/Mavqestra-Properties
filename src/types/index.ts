export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "off-plan";

export type PropertyType =
  | "apartment"
  | "duplex"
  | "detached"
  | "terrace"
  | "land"
  | "commercial";

export interface PropertyGallerySection {
  label: string;
  images: string[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  type: PropertyType;
  price: number; // NGN
  priceLabel?: string; // e.g. "per annum"
  location: {
    area: string;
    city: string;
    state: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  sizeSqm?: number;
  images: string[]; // paths in /public/images/properties/
  gallerySections?: PropertyGallerySection[];
  description: string;
  features: string[];
  featured?: boolean; // shown on landing page
  addedAt: string; // ISO date
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  relativeDate: string;
  text: string;
  verified?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  summary: string;
  detail: string;
}
