import React from "react";

export interface DotRailProps {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  orientation?: "vertical" | "horizontal";
  itemNames?: string[];
  className?: string;
  light?: boolean;
}

export const DotRail: React.FC<DotRailProps> = ({
  count,
  active,
  onSelect,
  orientation = "vertical",
  itemNames = [],
  className = "",
  light = false,
}) => {
  const isVertical = orientation === "vertical";
  const inactiveColor = light ? "rgba(255, 255, 255, 0.35)" : "rgba(10, 10, 10, 0.18)";
  const activeColor = light ? "#FFFFFF" : "var(--blue, #1E3A8A)";

  return (
    <div
      role="tablist"
      aria-label="Section navigation"
      className={`dot-rail flex items-center justify-center select-none ${
        isVertical ? "flex-col" : "flex-row"
      } ${className}`}
      style={{
        gap: "10px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active === i;
        const name = itemNames[i] || `Item ${i + 1}`;

        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={name}
            onClick={() => onSelect && onSelect(i)}
            className="cursor-pointer transition-all p-0 border-0 outline-none focus-visible:outline-2 focus-visible:outline-[var(--blue)]"
            style={{
              backgroundColor: isActive ? activeColor : inactiveColor,
              width: isVertical ? (isActive ? "44px" : "18px") : (isActive ? "44px" : "18px"),
              height: isVertical ? "2px" : "2px",
              borderRadius: "1px",
              transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        );
      })}
    </div>
  );
};
