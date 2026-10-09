import React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "hero" | "hero-white" | "link";
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
  const isSm = size === "sm";

  let baseStyle = "inline-flex items-center justify-center font-semibold transition-colors duration-300 rounded-none cursor-pointer text-center select-none ";
  
  if (variant === "primary") {
    baseStyle += `bg-blue-glossy text-white hover:brightness-110 active:brightness-95 uppercase tracking-[0.06em] text-[11px] shadow-sm ${
      isSm ? "px-[16px] py-[10px]" : "px-[24px] py-[12px] min-h-[44px]"
    }`;
  } else if (variant === "secondary") {
    baseStyle += `bg-transparent border border-[var(--blue)] text-[var(--blue)] hover:bg-blue-glossy hover:text-white uppercase tracking-[0.06em] text-[11px] ${
      isSm ? "px-[16px] py-[10px]" : "px-[24px] py-[12px] min-h-[44px]"
    }`;
  } else if (variant === "hero-white") {
    baseStyle += `bg-white text-[var(--blue)] hover:bg-white/90 uppercase tracking-[0.06em] text-[11px] ${
      isSm ? "px-[16px] py-[10px]" : "px-[24px] py-[12px] min-h-[44px]"
    }`;
  } else if (variant === "hero") {
    baseStyle += `bg-transparent border border-white text-white hover:bg-white hover:text-[var(--blue)] uppercase tracking-[0.06em] text-[11px] ${
      isSm ? "px-[16px] py-[10px]" : "px-[24px] py-[12px] min-h-[44px]"
    }`;
  } else if (variant === "link") {
    baseStyle = `relative inline-block text-[var(--blue)] font-semibold text-[14px] transition-colors duration-300 cursor-pointer group rounded-none min-h-[44px] leading-[44px] ${className}`;
    const linkInner = (
      <>
        <span>{children}</span>
        <span className="absolute bottom-[8px] left-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover:w-full" />
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
            {linkInner}
          </a>
        );
      }
      return (
        <Link to={href} className={baseStyle}>
          {linkInner}
        </Link>
      );
    }

    return (
      <button type={type} onClick={onClick} className={baseStyle} disabled={disabled}>
        {linkInner}
      </button>
    );
  }

  const combinedClass = `${baseStyle} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

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
