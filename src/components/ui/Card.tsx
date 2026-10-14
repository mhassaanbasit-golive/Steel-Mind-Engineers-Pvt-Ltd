import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface CardProps {
  imageSrc?: string;
  imageAlt?: string;
  imageRatio?: "4/3" | "16/9" | string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  imageSrc,
  imageAlt = "",
  imageRatio = "4/3",
  title,
  description,
  href,
  linkText,
  className = "",
}) => {
  const is16by9 = imageRatio === "16/9";

  const cardInner = (
    <div
      className={`group w-full bg-[#FFFFFF] border-0 rounded-none overflow-hidden transition-[box-shadow,transform] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_48px_rgba(30,58,138,0.12)] hover:-translate-y-1 ${className}`}
    >
      {/* Edge-to-edge Image at top */}
      {imageSrc && (
        <div
          className={`w-full overflow-hidden bg-[#FFFFFF] ${
            is16by9 ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      )}

      {/* Body below image: Padding 24px */}
      <div className="p-[24px] flex flex-col flex-1 text-left bg-[#FFFFFF]">
        {/* Above title: a 40px wide, 2px tall #1E3A8A line. Margin-bottom 16px */}
        <div className="w-[40px] h-[2px] bg-[#1E3A8A] mb-[16px]" />

        {/* Title: 16px weight 600, #0A0A0A, line-height 1.3, letter-spacing -0.01em. Margin-bottom 8px */}
        <h3 className="text-[16px] font-semibold text-[#0A0A0A] leading-[1.3] tracking-[-0.01em] mb-[8px]">
          {title}
        </h3>

        {/* Description: 13px, #6B7280, line-height 1.6, max 3 lines. Margin-bottom 12px */}
        {description && (
          <p className="text-[13px] text-[#6B7280] leading-[1.6] line-clamp-3 mb-[12px]">
            {description}
          </p>
        )}

        {/* Optional link: 13px weight 600, #1E3A8A, underline on hover */}
        {linkText && (
          <div className="mt-auto pt-1">
            <span className="text-[13px] font-semibold text-[#1E3A8A] group-hover:underline inline-flex items-center gap-1">
              {linkText}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full no-underline"
        >
          {cardInner}
        </a>
      );
    }
    return (
      <TransitionLink to={href} className="block w-full no-underline">
        {cardInner}
      </TransitionLink>
    );
  }

  return cardInner;
};
