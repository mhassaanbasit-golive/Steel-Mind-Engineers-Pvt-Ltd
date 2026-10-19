import React, { useState } from "react";
import { cld } from "../lib/cld.ts";

export interface PicProps {
  src: string;
  alt: string;
  ratio: number;
  sizes?: string;
  eager?: boolean;
  className?: string;
  bleed?: boolean;
  style?: React.CSSProperties;
}

export function Pic({
  src,
  alt,
  ratio,
  sizes = "(min-width: 1024px) 1280px, 100vw",
  eager = false,
  className = "",
  bleed = false,
  style,
}: PicProps) {
  const [r, setR] = useState(ratio);
  const widths = [640, 960, 1280, 1600, 1920, 2560];
  const srcSet = widths.map((w) => `${cld(src, w)} ${w}w`).join(", ");

  return (
    <div
      className={`pic ${className}`}
      style={{
        aspectRatio: String(r),
        position: "relative",
        overflow: "hidden",
        background: "rgba(10,10,10,.05)",
        marginInline: bleed ? "calc(var(--gutter) * -1)" : undefined,
        ...style,
      }}
    >
      <img
        src={cld(src, 1920)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        onLoad={(e) => {
          const i = e.currentTarget;
          if (i.naturalWidth && i.naturalHeight) {
            const n = i.naturalWidth / i.naturalHeight;
            if (Math.abs(n - r) / r > 0.02) setR(n);
          }
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
