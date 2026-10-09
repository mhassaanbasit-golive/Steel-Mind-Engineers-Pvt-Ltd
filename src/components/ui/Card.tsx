import React from "react";
import { Link } from "react-router-dom";
import { Img, ImgProps } from "./Img.tsx";

export interface CardProps {
  imageSrc?: string;
  imageAlt?: string;
  imageRatio?: ImgProps["ratio"];
  label?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
  indexBadge?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  imageSrc,
  imageAlt = "",
  imageRatio = "4/3",
  label,
  title,
  description,
  href,
  linkText,
  indexBadge,
  className = "",
}) => {
  const content = (
    <div
      className={`group relative flex flex-col bg-transparent p-0 rounded-none cursor-pointer overflow-hidden ${className}`}
      data-reveal=""
    >
      {imageSrc && (
        <div className="relative w-full overflow-hidden">
          {indexBadge && (
            <span className="absolute top-4 left-4 z-10 text-[12px] font-semibold text-white bg-[var(--ink)]/40 px-2 py-0.5">
              {indexBadge}
            </span>
          )}
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <Img src={imageSrc} alt={imageAlt || title} ratio={imageRatio} />
          </div>
        </div>
      )}

      <div className="pt-6 pb-2 flex flex-col flex-1">
        {label && (
          <span className="text-[12px] uppercase font-semibold tracking-[0.08em] text-[var(--grey)] mb-2">
            {label}
          </span>
        )}
        <h3 className="text-[20px] lg:text-[24px] font-semibold leading-[1.25] text-[var(--ink)] mb-3">
          {title}
        </h3>
        {description && (
          <p className="text-[15px] lg:text-[16px] leading-[1.6] text-[var(--grey)] mb-4 line-clamp-3">
            {description}
          </p>
        )}
        {linkText && (
          <div className="mt-auto pt-2 flex items-center justify-between text-[14px] font-semibold text-[var(--blue)]">
            <span className="relative inline-block">
              {linkText}
              <span
                style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
                className="absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
              />
            </span>
            {/* Thin 24px arrow drawn with 1px lines */}
            <svg
              className="w-6 h-6 stroke-current text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <polyline points="14 6 20 12 14 18" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};
