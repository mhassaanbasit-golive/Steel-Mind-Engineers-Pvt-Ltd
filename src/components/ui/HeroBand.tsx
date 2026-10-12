import React from "react";
import { BreadcrumbItem } from "./Breadcrumb.tsx";

export interface HeroBandProps {
  variant?: "image" | "blue";
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbItems?: BreadcrumbItem[];
  h1: string;
  subtitle?: string;
}

export const HeroBand: React.FC<HeroBandProps> = ({
  h1,
  subtitle,
}) => {
  // First sentence only for subtitle
  const cleanSubtitle = subtitle
    ? subtitle.split(". ")[0].replace(/\.$/, "") + "."
    : undefined;

  return (
    <section className="w-full bg-white border-b border-[var(--line)] pt-[calc(var(--header-h)+20px)] lg:pt-[calc(var(--header-h)+32px)] pb-6 lg:pb-8">
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="max-w-[760px]">
          {/* 2.4: Small page-top label removed so H1 stands alone */}
          {/* 2.1: Inner page H1 20px mobile / 32px desktop */}
          <h1
            className="text-[20px] lg:text-[32px] font-semibold text-[var(--ink)] leading-[1.15] tracking-[-0.01em]"
            data-split=""
          >
            {h1}
          </h1>

          {/* Subtitle / summary: 12px mobile / 13px desktop */}
          {cleanSubtitle && (
            <p
              className="mt-2.5 text-[12px] lg:text-[13px] text-[var(--grey)] leading-[1.65] max-w-[600px]"
              data-fade-up=""
            >
              {cleanSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
