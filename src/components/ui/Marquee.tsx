import React from "react";
import { Link } from "react-router-dom";
import { A } from "../../data/assets.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

const ROW1 = ["Haier", "Imperial Denim", "Moiz Steel", "Saif Engineers", "Dravton Dairy"];
const ROW2 = ["Latifia Dairy", "Maria B", "Elite Stitching", "MAB", "Agha Waqar"];

export const Marquee: React.FC<{ className?: string }> = ({ className = "" }) => {
  const reducedMotion = useReducedMotion();

  const renderLogo = (name: string, idx: number | string) => {
    const src = A.clientLogo[name as keyof typeof A.clientLogo];
    return (
      <div
        key={`${name}-${idx}`}
        className="flex-shrink-0 w-[160px] h-[72px] lg:w-[180px] lg:h-[80px] flex items-center justify-center p-3 select-none"
      >
        {src ? (
          <img
            src={src}
            alt={`${name} logo`}
            className="max-h-full max-w-full object-contain block"
            loading="lazy"
          />
        ) : (
          <span className="text-[13px] lg:text-[14px] font-semibold text-[var(--grey)]">{name}</span>
        )}
      </div>
    );
  };

  if (reducedMotion) {
    return (
      <div className={`py-12 border-y border-[var(--line)] bg-[var(--offwhite)] ${className}`}>
        <div className="text-center text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-6">
          Trusted By
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-[1340px] mx-auto px-[var(--pad-x)]">
          {[...ROW1, ...ROW2].map((name, i) => renderLogo(name, i))}
        </div>
      </div>
    );
  }

  const mobileRow = [...ROW1, ...ROW2, ...ROW1, ...ROW2, ...ROW1, ...ROW2];
  const desktopRow1 = [...ROW1, ...ROW1, ...ROW1, ...ROW1, ...ROW1];
  const desktopRow2 = [...ROW2, ...ROW2, ...ROW2, ...ROW2, ...ROW2];

  return (
    <div className={`py-10 border-y border-[var(--line)] overflow-hidden bg-[var(--offwhite)] ${className}`}>
      <div className="text-center text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-8">
        Trusted By
      </div>

      <Link
        to="/clients/"
        aria-label="Client logos"
        className="block space-y-6 cursor-pointer focus-visible:outline-none pointer-events-auto"
      >
        {/* Mobile: Single row 22s non-stop */}
        <div className="lg:hidden flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-8 animate-[marquee_22s_linear_infinite]">
            {mobileRow.map((name, i) => renderLogo(name, `m-${i}`))}
          </div>
        </div>

        {/* Desktop Row 1: Left to right 28s non-stop */}
        <div className="hidden lg:flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-10 animate-[marquee_28s_linear_infinite]">
            {desktopRow1.map((name, i) => renderLogo(name, `d1-${i}`))}
          </div>
        </div>

        {/* Desktop Row 2: Right to left 28s reverse non-stop */}
        <div className="hidden lg:flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-10 animate-[marquee_28s_linear_infinite_reverse]">
            {desktopRow2.map((name, i) => renderLogo(name, `d2-${i}`))}
          </div>
        </div>
      </Link>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
