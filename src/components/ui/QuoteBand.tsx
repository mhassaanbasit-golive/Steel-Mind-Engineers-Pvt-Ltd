import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";
import { A } from "../../data/assets.ts";
import { SITE } from "../../data/site.ts";

export interface QuoteBandProps {
  title?: string;
  description?: string;
  className?: string;
}

export const QuoteBand: React.FC<QuoteBandProps> = ({
  title = "Get a Quote",
  description = "Send the use, size and location of your project. An engineer will read the details and reply with questions and the next steps. A steel building is judged for decades, so the planning starts before any steel is cut.",
  className = "",
}) => {
  return (
    <section
      style={{ backgroundColor: "var(--blue)" }}
      className={`relative w-full overflow-hidden text-white bg-[var(--blue)] py-14 lg:py-20 flex items-center justify-center ${className}`}
    >
      {/* Background Image: A.quote with luminosity blend and low opacity */}
      <img
        src={A.quote}
        alt="Steel Mind Engineers fabrication facility"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
          opacity: 0.22,
          mixBlendMode: "luminosity",
        }}
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        loading="lazy"
      />

      {/* Layer 1 — Deep Royal Blue Gradient Overlay (Zero black, 100% brand Royal Blue) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(30, 58, 138, 0.88) 0%, rgba(22, 45, 110, 0.92) 50%, rgba(16, 31, 78, 0.96) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div
        style={{ position: "relative", zIndex: 3 }}
        className="relative z-[3] max-w-[1340px] mx-auto px-[var(--pad-x)] text-center flex flex-col items-center py-2"
      >
        <h2
          className="text-[20px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-white max-w-[800px] mb-3"
          data-split=""
        >
          {title}
        </h2>

        <p
          className="text-[12px] lg:text-[13px] leading-[1.65] text-white/90 max-w-[560px] mb-6"
          data-reveal=""
        >
          {description}
        </p>

        <div
          className="flex flex-row flex-wrap items-center justify-center gap-3 w-full sm:w-auto"
          data-fade-up=""
        >
          {/* Request a Quote: Solid White button with Royal Blue text */}
          <TransitionLink
            to="/contact-us/#quote"
            style={{
              background: "#FFFFFF",
              color: "var(--blue)",
              borderColor: "#FFFFFF",
            }}
            className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.08em] px-4 py-2.5 min-h-[36px] border border-white bg-white text-[var(--blue)] hover:bg-white/90 transition-all duration-300 rounded-none cursor-pointer select-none text-center"
          >
            Request a Quote
          </TransitionLink>

          {/* Talk to an Expert: Transparent button with White border and White text */}
          <a
            href={`tel:${SITE.tel[0]}`}
            style={{
              background: "transparent",
              color: "#FFFFFF",
              borderColor: "#FFFFFF",
            }}
            className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.08em] px-4 py-2.5 min-h-[36px] border border-white bg-transparent text-white hover:bg-white hover:text-[var(--blue)] transition-all duration-300 rounded-none cursor-pointer select-none text-center"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </section>
  );
};
