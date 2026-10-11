import React from "react";

export interface PhProps {
  ratio?: "4/5" | "21/9" | "16/9" | "3/4" | "4/3" | string;
  className?: string;
  style?: React.CSSProperties;
  border?: boolean;
}

const ratioClasses: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
};

export const Ph: React.FC<PhProps> = ({ ratio = "4/5", className = "", style, border = true }) => {
  const customAspect = ratioClasses[ratio] ? undefined : { aspectRatio: ratio };

  return (
    <div
      aria-hidden="true"
      style={{
        background: "color-mix(in srgb, var(--blue, #1D2E7A) 8%, white)",
        borderColor: border ? "color-mix(in srgb, var(--blue, #1D2E7A) 15%, #E5E5E5)" : "transparent",
        borderWidth: border ? 1 : 0,
        ...customAspect,
        ...style,
      }}
      className={`w-full select-none overflow-hidden ${border ? "border" : "border-0"} ${ratioClasses[ratio] || ""} ${className}`}
    />
  );
};
