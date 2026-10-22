import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";
import { A } from "../../data/assets.ts";
import { cl } from "../../lib/cloudinary.ts";

const ROW1 = [
  "Haier",
  "Imperial Denim",
  "Moiz Steel",
  "Saif Engineers",
  "Dravton Dairy",
];
const ROW2 = [
  "Latifia Dairy",
  "Maria B",
  "Elite Stitching",
  "MAB",
  "Agha Waqar",
];

export const Marquee: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const renderLogo = (name: string, idx: number | string) => {
    const src = A.clientLogo[name as keyof typeof A.clientLogo];
    return (
      <div
        key={`${name}-${idx}`}
        className="flex-shrink-0 w-[160px] h-[72px] lg:w-[200px] lg:h-[88px] mx-4 lg:mx-5 flex items-center justify-center p-3 select-none"
      >
        {src ? (
          <img
            src={cl(src, 240)}
            alt={`${name} logo`}
            className="max-h-full max-w-full object-contain block filter-none mix-blend-normal"
            loading="lazy"
            decoding="async"
            width={200}
            height={88}
          />
        ) : (
          <span className="text-[12px] lg:text-[13px] font-semibold text-[var(--grey)]">
            {name}
          </span>
        )}
      </div>
    );
  };

  // Single unit rows (repeated enough to span viewport width)
  const mobileUnit = [...ROW1, ...ROW2];
  const desktopUnit1 = [...ROW1, ...ROW1];
  const desktopUnit2 = [...ROW2, ...ROW2];

  // Track contains two identical copies of the logo row, back to back
  const mobileTrack = [...mobileUnit, ...mobileUnit];
  const desktopTrack1 = [...desktopUnit1, ...desktopUnit1];
  const desktopTrack2 = [...desktopUnit2, ...desktopUnit2];

  return (
    <section
      style={{ backgroundColor: "#FFFFFF" }}
      className={`py-8 sm:py-10 border-y border-[var(--line)] overflow-hidden bg-white ${className}`}
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2
          className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold leading-[1.22] tracking-[-0.01em] uppercase text-[var(--ink)] text-left mb-6 sm:mb-8 lg:mb-12"
          data-split=""
        >
          OUR CLIENTS
        </h2>
      </div>

      <TransitionLink
        to="/clients/"
        aria-label="Client logos"
        className="block space-y-6 cursor-pointer focus-visible:outline-none pointer-events-auto overflow-hidden"
      >
        {/* Mobile: Single row, 25s linear infinite, never pauses */}
        <div className="lg:hidden overflow-hidden select-none w-full">
          <div
            className="marquee-track"
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 25s linear infinite",
            }}
          >
            {mobileTrack.map((name, i) => renderLogo(name, `m-${i}`))}
          </div>
        </div>

        {/* Desktop Row 1: 30s linear infinite, never pauses */}
        <div className="hidden lg:block overflow-hidden select-none w-full">
          <div
            className="marquee-track"
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 30s linear infinite",
            }}
          >
            {desktopTrack1.map((name, i) => renderLogo(name, `d1-${i}`))}
          </div>
        </div>

        {/* Desktop Row 2: 30s linear infinite reverse, never pauses */}
        <div className="hidden lg:block overflow-hidden select-none w-full">
          <div
            className="marquee-track-reverse"
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 30s linear infinite reverse",
            }}
          >
            {desktopTrack2.map((name, i) => renderLogo(name, `d2-${i}`))}
          </div>
        </div>
      </TransitionLink>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
};
