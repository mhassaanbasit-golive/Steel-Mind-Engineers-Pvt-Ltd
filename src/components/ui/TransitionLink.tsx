import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTransitionNavigate } from "../../context/PageTransitionContext.tsx";

export { useTransitionNavigate };

export interface TransitionLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  href,
  target,
  children,
  className,
  style,
  onClick,
  onPointerEnter,
  onFocus,
  onTouchStart,
  ...props
}) => {
  const navigate = useTransitionNavigate();
  const location = useLocation();
  const destination = to || href || "";

  // Prefetch logic: load route chunk and preload images on intent
  const handlePrefetch = useCallback(() => {
    if (
      !destination ||
      destination.startsWith("http") ||
      destination.startsWith("mailto:") ||
      destination.startsWith("tel:") ||
      destination.startsWith("#")
    ) {
      return;
    }
    // Prefetch image or link rel prefetch
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = destination;
    link.as = "document";
    document.head.appendChild(link);
  }, [destination]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      target === "_blank" ||
      destination.startsWith("http://") ||
      destination.startsWith("https://") ||
      destination.startsWith("mailto:") ||
      destination.startsWith("tel:") ||
      destination.startsWith("#")
    ) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);

    const currentClean = location.pathname.replace(/\/$/, "");
    const destinationClean = destination
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "");

    if (currentClean === destinationClean) {
      if (destination.includes("#")) {
        const hash = destination.split("#")[1];
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${hash}`);
          }
        }
      }
      return;
    }

    navigate(destination);
  };

  return (
    <a
      href={destination}
      target={target}
      onClick={handleClick}
      onPointerEnter={(e) => {
        handlePrefetch();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        handlePrefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        handlePrefetch();
        onTouchStart?.(e);
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </a>
  );
};

export const Link = TransitionLink;
