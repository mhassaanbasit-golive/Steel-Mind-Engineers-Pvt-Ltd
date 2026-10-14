import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: "dark" | "white";
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  theme = "dark",
  className = "",
}) => {
  const isWhite = theme === "white";

  return (
    <nav aria-label="Breadcrumb" className={`text-[9px] uppercase tracking-[0.1em] flex items-center space-x-2 ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className={isWhite ? "text-white/50" : "text-[var(--grey)]/50"}>/</span>
            )}
            {item.href && !isLast ? (
              <TransitionLink
                to={item.href}
                className={`transition-colors ${
                  isWhite ? "text-white/80 hover:text-white" : "text-[var(--grey)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </TransitionLink>
            ) : (
              <span className={`font-medium ${isWhite ? "text-white" : "text-[var(--ink)]"}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
