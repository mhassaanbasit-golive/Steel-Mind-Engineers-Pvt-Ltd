import React from "react";

export interface SectionProps {
  bg?: "white" | "offwhite" | "ink" | "blue";
  label?: string;
  title?: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  bg = "white",
  label,
  title,
  intro,
  children,
  className = "",
  id,
}) => {
  let bgClass = "bg-[var(--white)] text-[var(--ink)]";
  let isDark = false;

  if (bg === "offwhite") {
    bgClass = "bg-[var(--offwhite)] text-[var(--ink)]";
  } else if (bg === "ink") {
    bgClass = "bg-[var(--ink)] text-white";
    isDark = true;
  } else if (bg === "blue") {
    bgClass = "bg-blue-glossy text-white";
    isDark = true;
  }

  return (
    <section
      id={id}
      className={`py-[var(--section-y)] relative w-full ${bgClass} ${className}`}
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {(label || title || intro) && (
          <div className="mb-12 lg:mb-16 max-w-[800px]" data-reveal-group="">
            {label && (
              <span
                className={`block text-[11px] uppercase font-semibold tracking-[0.1em] mb-3 ${
                  isDark ? "text-white/70" : "text-[var(--grey)]"
                }`}
                data-fade-up=""
              >
                {label}
              </span>
            )}
            {title && (
              <h2
                className={`text-[20px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.015em] ${
                  isDark ? "text-white" : "text-[var(--ink)]"
                }`}
                data-split=""
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={`mt-4 text-[14px] lg:text-[15px] leading-[1.6] max-w-[520px] ${
                  isDark ? "text-white/78" : "text-[var(--grey)]"
                }`}
                data-reveal=""
              >
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
