import React from "react";
import { Link } from "../ui/TransitionLink.tsx";

export interface HubEndBandProps {
  heading: string;
  nextUrl: string;
  nextTitle: string;
}

export const HubEndBand: React.FC<HubEndBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
}) => {
  return (
    <section
      className="next-band w-full bg-[var(--blue)] text-white py-[96px] lg:py-[120px] px-[20px] lg:px-[40px] relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.07) 100%)",
      }}
    >
      <div className="max-w-[1340px] mx-auto text-left">
        {/* Label NEXT */}
        <div className="text-[10px] uppercase font-semibold text-white/55 tracking-[0.14em] mb-5">
          NEXT
        </div>

        {/* Heading */}
        <h2 className="next-band-heading text-[24px] lg:text-[40px] font-bold text-white tracking-[-0.02em] leading-[1.15] mb-6 max-w-[900px]">
          {heading}
        </h2>

        {/* Link with sliding arrow */}
        <div>
          <Link
            to={nextUrl}
            className="next-band-link group inline-flex items-center gap-3 text-[14px] lg:text-[16px] font-semibold text-white no-underline hover:opacity-85 transition-opacity"
          >
            <span>{nextTitle}</span>
            <span className="next-band-arrow inline-block text-[18px] leading-none transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
