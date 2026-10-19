import React from "react";
import { cld } from "../../lib/cld.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

export interface SlatRevealProps {
  currentSrc: string;
  nextSrc: string;
  isChanging: boolean;
  ratio?: number;
  alt?: string;
  className?: string;
}

export const SlatReveal: React.FC<SlatRevealProps> = ({
  currentSrc,
  nextSrc,
  isChanging,
  ratio = 3 / 2,
  alt = "",
  className = "",
}) => {
  const reducedMotion = useReducedMotion();
  const slats = [0, 1, 2, 3, 4, 5];

  return (
    <div
      className={`slat-reveal relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)] ${className}`}
      style={{ aspectRatio: String(ratio) }}
    >
      {/* Base Image (Old Image) */}
      <img
        src={cld(currentSrc, 1920)}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 6 Slats overlay holding new image */}
      {isChanging && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {slats.map((i) => {
            const topPercent = (i / 6) * 100;
            const delay = reducedMotion ? 0 : i * 70;

            return (
              <div
                key={i}
                className="absolute inset-x-0 overflow-hidden"
                style={{
                  top: `${topPercent}%`,
                  height: `${100 / 6}%`,
                  transformOrigin: "top center",
                  transform: reducedMotion ? "none" : "scaleY(1)",
                  animation: reducedMotion
                    ? "fadeSlat 250ms ease forwards"
                    : `growSlat 700ms cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms forwards`,
                }}
              >
                <img
                  src={cld(nextSrc, 1920)}
                  alt={alt}
                  className="absolute inset-x-0 w-full max-w-none object-cover"
                  style={{
                    height: "600%",
                    top: `-${i * 100}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes growSlat {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes fadeSlat {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
