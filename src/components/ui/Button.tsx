import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "hero" | "hero-white" | "link" | "ghost" | "light";
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
  // Text link variant
  if (variant === "link") {
    const linkBase = `link-arrow relative inline-flex items-center gap-1.5 text-[var(--blue)] font-semibold text-[12px] lg:text-[13px] cursor-pointer group rounded-none select-none ${className}`;
    const linkInner = (
      <>
        <span className="relative">
          {children}
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover:w-full" />
        </span>
        <span className="arrow-icon inline-block transition-transform duration-300 group-hover:translate-x-[4px]">
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
        <TransitionLink to={href} className={linkBase}>
          {linkInner}
        </TransitionLink>
      );
    }

    return (
      <button type={type} onClick={onClick} className={linkBase} disabled={disabled}>
        {linkInner}
      </button>
    );
  }

  // Button classes with interactive hover and micro-animation
  let variantClass = "bg-[var(--blue)] text-white hover:bg-[var(--blue-dark)] hover:shadow-[0_6px_20px_rgba(30,58,138,0.28)]";
  if (variant === "secondary") {
    variantClass = "bg-transparent border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white hover:shadow-[0_6px_20px_rgba(30,58,138,0.2)]";
  } else if (variant === "hero-white" || variant === "light") {
    variantClass = "bg-white text-[var(--blue)] border border-white hover:bg-white/95 hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]";
  } else if (variant === "ghost" || variant === "hero") {
    variantClass = "bg-transparent border border-white text-white hover:bg-white hover:text-[var(--blue)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]";
  }

  const sizeClass = size === "sm" ? "min-h-[36px] px-4 py-2 text-[10px]" : "min-h-[42px] px-6 py-2.5 text-[11px]";

  const baseStyle = `group relative inline-flex items-center justify-center font-semibold uppercase tracking-[0.08em] select-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2 ${sizeClass} ${variantClass} ${
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
  } ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[4px] ml-2">
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
          className={baseStyle}
        >
          {content}
        </a>
      );
    }
    return (
      <TransitionLink to={href} className={baseStyle}>
        {content}
      </TransitionLink>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyle}
    >
      {content}
    </button>
  );
};
