import React from "react";
import { Img } from "./Img.tsx";

export interface CanvasProps {
  slot: string;
  ratio?: "4/5" | "16/9" | "4/3" | "21/9" | "1/1" | "3/4" | "9/19.5" | string;
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  slot,
  ratio = "4/3",
  src,
  alt = "",
  label,
  className = "",
}) => {
  if (src) {
    return (
      <div
        data-slot={slot}
        data-canvas-slot={slot}
        data-canvas-ratio={ratio}
        className={`w-full overflow-hidden ${className}`}
      >
        <Img src={src} alt={alt} ratio={ratio as any} className="w-full h-full object-cover" />
      </div>
    );
  }

  const ratioClass =
    ratio === "4/3"
      ? "aspect-[4/3]"
      : ratio === "16/9"
      ? "aspect-[16/9]"
      : ratio === "21/9"
      ? "aspect-[21/9]"
      : ratio === "1/1"
      ? "aspect-square"
      : ratio === "4/5"
      ? "aspect-[4/5]"
      : ratio === "3/4"
      ? "aspect-[3/4]"
      : "";

  const hasHeightOverride = className.includes("h-full") || className.includes("h-screen");
  const appliedRatioClass = hasHeightOverride ? "" : ratioClass;

  return (
    <div
      data-canvas=""
      data-slot={slot}
      data-canvas-slot={slot}
      data-canvas-ratio={ratio}
      aria-hidden="true"
      style={appliedRatioClass ? undefined : hasHeightOverride ? undefined : { aspectRatio: ratio }}
      className={`w-full border border-dashed border-[var(--line)] bg-white flex flex-col items-center justify-center p-3 text-center select-none ${appliedRatioClass} ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-0.5">
        <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--grey)] font-medium break-all px-1">
          {label || slot}
        </span>
        <span className="text-[9px] uppercase tracking-[0.08em] text-[var(--grey)]/70">
          {ratio}
        </span>
      </div>
    </div>
  );
};
