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
    const linkBase = `link-arrow text-[var(--blue)] font-medium text-[13px] ${className}`;
    const linkInner = (
      <>
        <span>{children}</span>
        <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
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

  // Standard Button styles with .btn and .btn--light
  const isLight = variant === "hero-white" || variant === "light";
  const lightClass = isLight ? "btn--light" : "";
  const sizeClass = size === "sm" ? "btn-sm" : "";

  const baseStyle = `btn ${lightClass} ${sizeClass} ${
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
  } ${className}`;

  const content = (
    <>
      <span>{children}</span>
      <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
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
