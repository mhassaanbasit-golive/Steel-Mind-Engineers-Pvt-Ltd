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
      className={`group relative flex flex-col bg-white border border-[var(--line)] p-0 rounded-none cursor-pointer overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_12px_32px_rgba(30,58,138,0.10)] hover:-translate-y-[2px] hover:border-[rgba(30,58,138,0.2)] ${className}`}
      data-reveal=""
    >
      {imageSrc && (
        <div className="relative w-full overflow-hidden bg-[var(--offwhite)]">
          {indexBadge && (
            <span className="absolute top-4 left-4 z-10 text-[11px] font-semibold text-white bg-[var(--ink)]/60 px-2 py-0.5">
              {indexBadge}
            </span>
          )}
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <Img src={imageSrc} alt={imageAlt || title} ratio={imageRatio} />
          </div>

          {/* Blue arrow badge (bottom-left of image) fades in and slides up 4px */}
          <div className="absolute bottom-3 left-3 w-7 h-7 bg-[var(--blue)] text-white flex items-center justify-center opacity-0 translate-y-1 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-hover:translate-y-0 z-10 shadow-sm">
            <svg
              className="w-3.5 h-3.5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {label && (
          <span className="text-[10px] uppercase font-semibold tracking-[0.1em] text-[var(--grey)] mb-2">
            {label}
          </span>
        )}
        <h3 className="text-[18px] lg:text-[20px] font-semibold leading-[1.25] text-[var(--ink)] mb-2.5">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] lg:text-[14px] leading-[1.65] text-[var(--grey)] mb-4 line-clamp-3">
            {description}
          </p>
        )}
        {linkText && (
          <div className="mt-auto pt-2 flex items-center justify-between text-[13px] font-semibold text-[var(--blue)]">
            <span className="relative inline-block">
              {linkText}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover:w-full" />
            </span>
            <svg
              className="w-4 h-4 stroke-current text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
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
