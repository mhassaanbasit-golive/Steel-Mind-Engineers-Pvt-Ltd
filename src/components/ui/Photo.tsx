import React, { useState } from "react";

export interface PhotoProps {
  src: string;
  ratio?: "4/5" | "21/9" | "16/9" | "3/4" | "4/3" | "1/1" | string;
  fit?: "cover" | "contain";
  alt?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  noScale?: boolean;
}

const ratioMap: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export const Photo: React.FC<PhotoProps> = ({
  src,
  ratio = "4/5",
  fit = "cover",
  alt = "",
  className = "",
  innerClassName = "",
  style,
  noScale = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = src.startsWith("/") ? src : `/about/${src}`;
  const customAspect = ratioMap[ratio] ? undefined : { aspectRatio: ratio };

  return (
    <div
      style={{
        ...customAspect,
        ...style,
      }}
      className={`w-full overflow-hidden select-none relative ${ratioMap[ratio] || ""} ${className}`}
    >
      {!hasError ? (
        <img
          src={normalizedSrc}
          alt={alt}
          onError={() => setHasError(true)}
          style={{
            objectFit: fit,
          }}
          className={`w-full h-full ${
            noScale ? "" : "transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          } ${innerClassName}`}
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            background: "color-mix(in srgb, var(--blue, #1E3A8A) 6%, white)",
            borderColor: "color-mix(in srgb, var(--blue, #1E3A8A) 12%, rgba(0,0,0,0.12))",
          }}
          className="w-full h-full border"
        />
      )}
    </div>
  );
};
