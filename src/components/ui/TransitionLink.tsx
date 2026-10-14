import React from "react";
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
  ...props
}) => {
  const navigate = useTransitionNavigate();
  const location = useLocation();
  const destination = to || href || "";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle modifier clicks, middle clicks, target="_blank", anchors, or external links
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

    // Link to current page: do nothing
    const currentClean = location.pathname.replace(/\/$/, "");
    const destinationClean = destination
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "");

    if (currentClean === destinationClean) {
      return;
    }

    navigate(destination);
  };

  return (
    <a
      href={destination}
      target={target}
      onClick={handleClick}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </a>
  );
};

export const Link = TransitionLink;
