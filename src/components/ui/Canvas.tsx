import React from "react";
import { Img } from "./Img.tsx";
import { A } from "../../data/assets.ts";
import { POOLS } from "../../data/pool.ts";

export interface CanvasProps {
  slot: string;
  ratio?: "4/5" | "16/9" | "4/3" | "21/9" | "1/1" | "3/4" | "9/19.5" | string;
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}

// Map known canvas slot patterns to high-fidelity photography
function resolveSlotImage(slot: string): string | undefined {
  if (!slot) return undefined;

  // Hub Hero Slots
  if (slot === "peb.hero") return A.division.peb;
  if (slot === "sheds.hero") return A.division.sheds;
  if (slot === "warehouses.hero") return A.division.warehouses;
  if (slot === "structural.hero") return A.division.structural;
  if (slot === "custom.hero") return A.division.custom;

  // PEB Chapters (peb.chapter.1 through 11)
  if (slot.startsWith("peb.chapter.")) {
    const num = parseInt(slot.replace("peb.chapter.", ""), 10);
    const pool = POOLS.peb;
    return pool[(num - 1) % pool.length];
  }

  // Division Child Cards (e.g. sheds.child.factory-sheds, warehouses.child.cold-storage, etc.)
  if (slot.startsWith("sheds.child.")) {
    const pool = POOLS.sheds;
    const hash = slot.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pool[hash % pool.length];
  }
  if (slot.startsWith("warehouses.child.")) {
    const pool = POOLS.warehouses;
    const hash = slot.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pool[hash % pool.length];
  }
  if (slot.startsWith("structural.child.")) {
    const pool = POOLS.structural;
    const hash = slot.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pool[hash % pool.length];
  }
  if (slot.startsWith("custom.child.")) {
    const pool = POOLS.custom;
    const hash = slot.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pool[hash % pool.length];
  }

  // About us slots
  if (slot.startsWith("about.")) {
    const pool = POOLS.aboutUs;
    const hash = slot.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pool[hash % pool.length];
  }

  return undefined;
}

export const Canvas: React.FC<CanvasProps> = ({
  slot,
  ratio = "4/3",
  src,
  alt = "",
  label,
  className = "",
}) => {
  const resolvedSrc = src || resolveSlotImage(slot);

  if (resolvedSrc) {
    return (
      <div
        data-slot={slot}
        data-canvas-slot={slot}
        data-canvas-ratio={ratio}
        className={`w-full overflow-hidden ${className}`}
      >
        <Img src={resolvedSrc} alt={alt || label || slot} ratio={ratio as any} className="w-full h-full object-cover" />
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
