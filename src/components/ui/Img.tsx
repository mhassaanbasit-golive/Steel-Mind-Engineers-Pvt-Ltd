import React, { useState } from "react";
import { cl, srcSet } from "../../lib/cloudinary.ts";

export interface ImgProps {
  src: string;
  alt: string;
  ratio?: "4/5" | "16/9" | "4/3" | "9/16" | "1/1" | "21/9" | "5/6";
  sizes?: string;
  priority?: boolean;
  className?: string;
  parallax?: boolean | number;
}

const ratioStyles: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "9/16": "aspect-[9/16]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "5/6": "aspect-[5/6]",
};

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  ratio = "4/3",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1080px",
  priority = false,
  className = "",
  parallax = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass = ratioStyles[ratio] || "aspect-[4/3]";
  const responsiveSrcSet = srcSet(src);
  const defaultSrc = cl(src, 1080);
  const parallaxAttr = typeof parallax === "number" ? parallax : parallax ? 8 : undefined;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--offwhite)] ${aspectClass} ${className}`}
      data-img-reveal=""
      data-parallax={parallaxAttr}
    >
      {!error && src ? (
        <img
          src={defaultSrc}
          srcSet={responsiveSrcSet || undefined}
          sizes={sizes}
          alt={alt || "Steel Mind Engineers"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full object-cover transition-opacity duration-600 ${
            parallax ? "h-[116%] -top-[8%] absolute inset-x-0" : "h-full"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <div className="w-full h-full bg-[var(--offwhite)]" />
      )}
    </div>
  );
};
