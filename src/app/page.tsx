import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { ServicesProcessSection } from "@/components/home/ServicesProcessSection";
import { ValuationCtaBand } from "@/components/home/ValuationCtaBand";
import { GoogleReviewsSection } from "@/components/home/GoogleReviewsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "NG",
    },
    sameAs: [
      siteConfig.socials.instagram,
      siteConfig.socials.linkedin,
      siteConfig.socials.x,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.googleRating,
      reviewCount: siteConfig.googleReviewCount,
    },
  };

  return (
    <main className="overflow-x-clip bg-ivory text-basalt">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <TrustStrip />
      <AboutSection />
      <FeaturedProperties />
      <ServicesProcessSection />
      <ValuationCtaBand />
      <GoogleReviewsSection />
      <FinalCtaSection />
    </main>
  );
}
