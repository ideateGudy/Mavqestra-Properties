import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0E0D0C",
          color: "#F4EFE6",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 20,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#E8913A",
          }}
        >
          <span>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {siteConfig.hero.headline}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#8A8378",
              maxWidth: "820px",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
