import React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "hero" | "hero-white" | "link" | "ghost";
  size?: "sm" | "md";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className = "",
  type = "button",
  target,
  rel,
  disabled = false,
}) => {
  // Common base style
  const transitionStyle = "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]";

  // Text link
  if (variant === "link") {
    const linkBase = `relative inline-flex items-center gap-1.5 text-[var(--blue)] font-semibold text-[13px] cursor-pointer group rounded-none select-none ${className}`;
    const linkInner = (
      <>
        <span className="relative">
          {children}
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover:w-full" />
        </span>
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">
          &rarr;
        </span>
      </>
    );

    if (href) {
      if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
        return (
          <a
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : rel}
            className={linkBase}
          >
            {linkInner}
          </a>
        );
      }
      return (
        <Link to={href} className={linkBase}>
          {linkInner}
        </Link>
      );
    }

    return (
      <button type={type} onClick={onClick} className={linkBase} disabled={disabled}>
        {linkInner}
      </button>
    );
  }

  let baseStyle = `inline-flex items-center justify-center font-semibold text-[12px] uppercase tracking-[0.06em] min-h-[42px] px-[22px] py-[11px] rounded-none cursor-pointer text-center select-none ${transitionStyle} `;

  if (variant === "primary") {
    // Primary: Background var(--blue). White text.
    // Hover: background var(--blue-dark). box-shadow: 0 8px 24px rgba(30, 58, 138, 0.25). translateY(-1px).
    // Active: translateY(0), background --blue-deep. No scale. No black outline. No border.
    baseStyle += `bg-[var(--blue)] text-white border-0 hover:bg-[var(--blue-dark)] hover:shadow-[0_8px_24px_rgba(30,58,138,0.25)] hover:-translate-y-[1px] active:translate-y-0 active:bg-[var(--blue-deep)] `;
  } else if (variant === "secondary") {
    // Secondary: Transparent background. 1px solid var(--blue). Text var(--blue).
    // Hover: fill with var(--blue), text white, plus soft shadow 0 8px 24px rgba(30, 58, 138, 0.15), translateY(-1px).
    baseStyle += `bg-transparent border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white hover:shadow-[0_8px_24px_rgba(30,58,138,0.15)] hover:-translate-y-[1px] active:translate-y-0 active:bg-[var(--blue-deep)] `;
  } else if (variant === "ghost" || variant === "hero") {
    // Ghost (used on dark sections): Transparent, 1px solid white, white text.
    // Hover: fill white, text var(--blue), soft shadow 0 8px 24px rgba(0, 0, 0, 0.2).
    baseStyle += `bg-transparent border border-white text-white hover:bg-white hover:text-[var(--blue)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)] hover:-translate-y-[1px] active:translate-y-0 `;
  } else if (variant === "hero-white") {
    // White button on dark background:
    baseStyle += `bg-white text-[var(--blue)] border border-white hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)] hover:-translate-y-[1px] active:translate-y-0 `;
  }

  const combinedClass = `${baseStyle} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`;

  if (href) {
    if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : rel}
          className={combinedClass}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
    >
      {children}
    </button>
  );
};
