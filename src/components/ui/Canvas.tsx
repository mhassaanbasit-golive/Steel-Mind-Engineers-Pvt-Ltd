import React from "react";
import { Img } from "./Img.tsx";

export interface CanvasProps {
  slot: string;
  ratio?: "4/3" | "16/9" | "21/9" | "1/1" | string;
  src?: string;
  alt?: string;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  slot,
  ratio = "4/3",
  src,
  alt = "",
  className = "",
}) => {
  if (src) {
    return (
      <div data-slot={slot} className={`w-full overflow-hidden ${className}`}>
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
      : "";

  return (
    <div
      data-canvas=""
      data-slot={slot}
      style={ratioClass ? undefined : { aspectRatio: ratio }}
      className={`w-full border border-dashed border-[var(--line)] bg-[var(--offwhite)] ${ratioClass} ${className}`}
    />
  );
};
