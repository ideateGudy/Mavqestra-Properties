import React from "react";

export interface LogoProps {
  variant?: "full" | "mark";
  tone?: "dark" | "light";
  className?: string;
}

export function Logo({
  variant = "full",
  tone = "dark",
  className = "",
}: LogoProps) {
  const toneClass = tone === "light" ? "text-ivory" : "text-basalt";

  return (
    <span
      className={`inline-flex items-center gap-3 select-none ${toneClass} ${className}`}
      aria-label="MAVQESTRA PROPERTIES"
    >
      <svg
        viewBox="0 0 40 36"
        fill="none"
        className="h-[1.65em] w-auto shrink-0"
        aria-hidden="true"
      >
        <path
          d="M4 31V11L20 24L36 11V31"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M11.5 11.5L20 4.5L28.5 11.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="20" cy="13.5" r="2.6" fill="#E8913A" />
      </svg>

      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.875em] font-medium tracking-[0.28em] uppercase">
            MAVQESTRA
          </span>
          <span className="mt-1 text-[0.52em] font-normal tracking-[0.38em] uppercase opacity-75">
            PROPERTIES
          </span>
        </span>
      )}
    </span>
  );
}
