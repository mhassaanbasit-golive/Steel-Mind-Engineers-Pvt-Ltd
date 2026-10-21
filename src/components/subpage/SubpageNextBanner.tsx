import React, { useState } from "react";
import { cl } from "../../data/images.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export interface SubpageNextBannerProps {
  heading: string;
  title: string;
  url: string;
  image: string;
  compact?: boolean;
  overlay?: boolean;
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

export const SubpageNextBanner: React.FC<SubpageNextBannerProps> = ({
  heading,
  title,
  url,
  image,
  compact = false,
  overlay = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const nextUrl = image ? cl(image, 2560) : "";
  const titleCasedHeading = toTitleCase(heading);
  const titleCasedTitle = toTitleCase(title);

  return (
    <section className="w-full bg-[#0A0A0A] border-t border-[#E5E5E5]/20 overflow-hidden">
      <TransitionLink
        to={url}
        className="group block w-full no-underline select-none cursor-pointer"
      >
        {/* Desktop (768px and up): Cinematic widescreen banner */}
        <div className="hidden md:block relative w-full h-[380px] lg:h-[440px] overflow-hidden bg-[#0A0A0A]">
          {nextUrl && !hasError ? (
            <img
              src={nextUrl}
              alt={titleCasedTitle}
              loading="lazy"
              onError={() => setHasError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]" />
          )}

          {/* 1. Flat tint on photo: nav blue at 25% */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.25)" }}
          />

          {/* 2. Dark contrast gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.15) 100%)",
            }}
          />

          {/* 3. Left gradient for high text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0) 75%)",
            }}
          />

          {/* Desktop Headline & link bottom-left on image: Title Case on desktop >= 1024px */}
          <div className="absolute bottom-10 lg:bottom-14 left-6 lg:left-12 max-w-[840px] text-left z-10">
            <h2 className="text-[26px] lg:text-[38px] font-bold text-white tracking-[-0.02em] leading-[1.18] mb-5 normal-case lg:normal-case">
              {titleCasedHeading}
            </h2>
            <div className="inline-flex items-center gap-2.5 text-[15px] lg:text-[17px] font-semibold text-white">
              <span>{titleCasedTitle}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 text-[20px]">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Mobile (below 768px): Photo on top 16/9, solid nav-blue panel underneath, ALL CAPS on mobile */}
        <div className="md:hidden w-full flex flex-col">
          <div
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {nextUrl && !hasError ? (
              <img
                src={nextUrl}
                alt={titleCasedTitle}
                loading="lazy"
                onError={() => setHasError(true)}
                className="w-full h-full object-cover object-center block"
              />
            ) : (
              <div className="w-full h-full bg-[#0A0A0A]" />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
            />
          </div>

          <div
            style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
            className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left"
          >
            <h2
              className="font-bold text-white tracking-[-0.02em] mb-4 uppercase"
              style={{
                fontSize: "clamp(17px, 4.8vw, 22px)",
                lineHeight: 1.25,
                textTransform: "uppercase",
              }}
            >
              {heading}
            </h2>
            <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-white">
              <span>{titleCasedTitle}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 text-[17px]">
                &rarr;
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </section>
  );
};
