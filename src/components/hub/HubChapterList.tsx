import React from "react";
import { Link } from "../ui/TransitionLink.tsx";

export interface ChapterItem {
  num: string;
  label: string;
  url: string;
  desc: string;
  slug?: string;
}

export interface HubChapterListProps {
  chapters: ChapterItem[];
}

export const HubChapterList: React.FC<HubChapterListProps> = ({ chapters }) => {
  return (
    <section className="w-full bg-[#FFFFFF] py-[48px] lg:py-[80px] px-[20px] lg:px-[40px]">
      {/* Centered inside a 720px max-width container */}
      <div className="max-w-[720px] mx-auto">
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.url || idx}
            className={`group block text-left py-[40px] lg:py-[56px] transition-colors duration-300 ${
              idx > 0 ? "border-t border-[#E5E5E5] hover:border-[#1E3A8A]" : ""
            }`}
          >
            {/* Number (01, 02, 03…): 16px Inter 700, #1E3A8A, tabular numerals, letter-spacing 0.06em. Margin-bottom 12px. */}
            <div
              className="text-[16px] font-bold text-[#1E3A8A] mb-[12px] tracking-[0.06em]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {chapter.num}
            </div>

            {/* Chapter name (H3): 14px mobile / 22px desktop, weight 600, #0A0A0A, uppercase. Margin-bottom 10px. Hover: shifts 4px to the right over 0.3s ease. */}
            <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-semibold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em] mb-[10px] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
              <Link to={chapter.url} className="text-[#0A0A0A] hover:text-[#0A0A0A] block">
                {chapter.label}
              </Link>
            </h3>

            {/* Description: 14px, #0A0A0A, line-height 1.7, max-width 480px. Margin-bottom 16px. */}
            {chapter.desc && (
              <p className="text-[14px] text-[#0A0A0A] leading-[1.7] max-w-[480px] mb-[16px]">
                {chapter.desc}
              </p>
            )}

            {/* Link View →: 13px, weight 600, #1E3A8A. Underline grows left to right on hover over 0.3s. Arrow slides 4px right on hover. */}
            <Link
              to={chapter.url}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1E3A8A] relative group/link"
            >
              <span className="relative inline-block">
                View
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1E3A8A] transition-all duration-300 ease-out group-hover:w-full group-hover/link:w-full" />
              </span>
              <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover/link:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
